-- ============================================================
-- Migración 055 — Búsqueda global unificada del sitio público.
--
-- Crea una VISTA `search_index` que combina las 4 fuentes de contenido
-- público (páginas del CMS + documentos institucionales + eventos del
-- cronograma + reconocimientos) en filas uniformes con un `tsvector`
-- de búsqueda en español.
--
-- Y una función pública `search_global(q text)` que el endpoint
-- /api/search llama. Devuelve top 20 resultados rankeados por
-- relevancia. Es SECURITY DEFINER + STABLE para poder ser invocada
-- por usuarios anónimos sin depender de RLS.
--
-- IDEMPOTENTE: CREATE OR REPLACE + DROP IF EXISTS.
-- ============================================================

-- ─── Vista search_index ──────────────────────────────────────────
CREATE OR REPLACE VIEW search_index AS
  -- 1) Páginas del CMS publicadas
  SELECT
    'pagina'::text                          AS type,
    p.id::text                              AS entity_id,
    p.titulo                                AS title,
    COALESCE(p.meta_description, '')        AS description,
    ('/' || p.slug)::text                   AS url,
    setweight(to_tsvector('spanish', COALESCE(p.titulo, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(p.meta_description, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(p.slug, '')), 'C') AS search_vector
  FROM paginas p
  WHERE p.publicada = true

  UNION ALL

  -- 2) Documentos institucionales publicados
  SELECT
    'documento'::text                       AS type,
    d.id::text                              AS entity_id,
    d.titulo                                AS title,
    COALESCE(d.descripcion, '')             AS description,
    '/documentos-institucionales'::text     AS url,
    setweight(to_tsvector('spanish', COALESCE(d.titulo, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(d.descripcion, '')), 'B') AS search_vector
  FROM documentos d
  WHERE d.publicado = true

  UNION ALL

  -- 3) Eventos del cronograma publicados
  SELECT
    'evento'::text                          AS type,
    e.id::text                              AS entity_id,
    e.titulo                                AS title,
    COALESCE(e.descripcion, '')             AS description,
    '/cronograma-anual'::text               AS url,
    setweight(to_tsvector('spanish', COALESCE(e.titulo, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(e.descripcion, '')), 'B') AS search_vector
  FROM cronograma_eventos e
  WHERE e.publicado = true

  UNION ALL

  -- 4) Reconocimientos — categorías visibles
  SELECT
    'reconocimiento_categoria'::text        AS type,
    rc.id::text                             AS entity_id,
    rc.nombre                               AS title,
    COALESCE(rc.meta_description, rc.hero_subtitle, '') AS description,
    ('/reconocimientos/' || rc.slug)::text  AS url,
    setweight(to_tsvector('spanish', COALESCE(rc.nombre, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(rc.hero_title, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(rc.meta_description, rc.hero_subtitle, '')), 'B') AS search_vector
  FROM reconocimientos_categorias rc
  WHERE rc.visible = true

  UNION ALL

  -- 5) Reconocimientos — subcategorías visibles
  SELECT
    'reconocimiento_subcategoria'::text     AS type,
    rs.id::text                             AS entity_id,
    rs.nombre                               AS title,
    COALESCE(rs.meta_description, rs.hero_subtitle, '') AS description,
    ('/reconocimientos/' || rc.slug || '/' || rs.slug)::text AS url,
    setweight(to_tsvector('spanish', COALESCE(rs.nombre, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(rs.meta_description, rs.hero_subtitle, '')), 'B') AS search_vector
  FROM reconocimientos_subcategorias rs
  JOIN reconocimientos_categorias rc ON rc.id = rs.categoria_id
  WHERE rs.visible = true AND rc.visible = true

  UNION ALL

  -- 6) Reconocimientos — logros visibles
  SELECT
    'reconocimiento_logro'::text            AS type,
    rl.id::text                             AS entity_id,
    rl.titulo                               AS title,
    COALESCE(rl.descripcion, '')            AS description,
    CASE
      WHEN rl.subcategoria_id IS NOT NULL
        THEN ('/reconocimientos/' || rc.slug || '/' || rs.slug || '/logros')
      ELSE ('/reconocimientos/' || rc.slug || '/logros')
    END::text                               AS url,
    setweight(to_tsvector('spanish', COALESCE(rl.titulo, '')), 'A') ||
    setweight(to_tsvector('spanish', COALESCE(rl.descripcion, '')), 'B') ||
    setweight(to_tsvector('spanish', COALESCE(rl.year, '')), 'C') AS search_vector
  FROM reconocimientos_logros rl
  JOIN reconocimientos_categorias rc ON rc.id = rl.categoria_id
  LEFT JOIN reconocimientos_subcategorias rs ON rs.id = rl.subcategoria_id
  WHERE rl.visible = true AND rc.visible = true
    AND (rl.subcategoria_id IS NULL OR rs.visible = true);

-- ─── Función search_global ────────────────────────────────────────
-- SECURITY DEFINER: corre como el dueño de la función (postgres) y por
-- tanto bypassa RLS. La vista ya filtra por publicada/visible, así que
-- los resultados que devuelve son seguros para usuarios anónimos.
DROP FUNCTION IF EXISTS search_global(text);
CREATE OR REPLACE FUNCTION search_global(q text)
RETURNS TABLE (
  type        text,
  entity_id   text,
  title       text,
  description text,
  url         text,
  rank        real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.type,
    s.entity_id,
    s.title,
    s.description,
    s.url,
    ts_rank(s.search_vector, plainto_tsquery('spanish', q)) AS rank
  FROM search_index s
  WHERE s.search_vector @@ plainto_tsquery('spanish', q)
  ORDER BY rank DESC, s.title ASC
  LIMIT 20;
$$;

-- Permitir invocar la función desde rol anónimo y autenticado
GRANT EXECUTE ON FUNCTION search_global(text) TO anon, authenticated;
