-- ============================================================
-- Migración 044 — Mover landing /admisiones a una fila de `paginas`
-- (plantilla nueva P) y refactor del schema FAQ + Explorar.
--
-- Cambios:
--
-- 1. Extender CHECK constraint con `tpl_p_admisiones_landing`.
--
-- 2. Migrar el contenido de `configuracion_global['admisiones_landing']`
--    a una nueva fila de `paginas` con slug = 'admisiones',
--    plantilla = 'tpl_p_admisiones_landing'.
--
--    El JSON se transforma en el camino:
--      a) `faq` (array plano de items) → `faq` (objeto con eyebrow +
--         heading + description + items[]). La sección FAQ ahora se
--         renderiza VISIBLEMENTE en el frontend (acordeón), además del
--         JSON-LD para SEO.
--      b) Cada item de `explorar.items` recibe los nuevos campos
--         `ctaLabel` (= "Ver requisitos") y `href` (= `/admisiones/{slug}`).
--
-- 3. Deja en pie `configuracion_global['admisiones_landing']` por si
--    el cliente quiere ver el JSON viejo. La app ya no lo lee.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- ─── 1. Ampliar CHECK constraint ───────────────────────────────────
ALTER TABLE paginas DROP CONSTRAINT IF EXISTS paginas_plantilla_check;
ALTER TABLE paginas
  ADD CONSTRAINT paginas_plantilla_check
  CHECK (plantilla IN (
    'tpl_a_hero_texto',
    'tpl_b_hero_grid',
    'tpl_c_hero_pasos',
    'tpl_d_hero_detalle',
    'tpl_e_hero_galeria',
    'tpl_f_hero_academico',
    'tpl_g_landing_ib',
    'tpl_h_landing_niveles',
    'tpl_i_historia',
    'tpl_j_landing_matriculas',
    'tpl_k_ficha_servicio',
    'tpl_l_ficha_espacio',
    'tpl_m_home',
    'tpl_n_trabaja',
    'tpl_o_admision_nivel',
    'tpl_p_admisiones_landing'
  ));

-- ─── 2. Migrar el contenido ─────────────────────────────────────────
-- Solo crea la fila si NO existe ya (idempotente). Toma el JSON del
-- bloque `configuracion_global['admisiones_landing']` si existe, lo
-- transforma y lo guarda. Si no existe, usa un objeto vacío y los
-- defaults del código serán los que apliquen.
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'admisiones',
  'tpl_p_admisiones_landing',
  'Landing /admisiones',
  CASE
    WHEN cg.value IS NULL THEN '{}'::jsonb
    ELSE
      -- Construir el JSON transformado:
      jsonb_build_object(
        'hero',     cg.value->'hero',
        'proceso',  cg.value->'proceso',
        'niveles',  cg.value->'niveles',
        -- explorar.items: agregar ctaLabel y href a cada item existente
        'explorar', jsonb_build_object(
          'eyebrow',     cg.value->'explorar'->>'eyebrow',
          'heading',     cg.value->'explorar'->>'heading',
          'description', cg.value->'explorar'->>'description',
          'items', COALESCE(
            (
              SELECT jsonb_agg(
                item || jsonb_build_object(
                  'ctaLabel', COALESCE(item->>'ctaLabel', 'Ver requisitos'),
                  'href',     COALESCE(NULLIF(item->>'href', ''), '/admisiones/' || (item->>'slug'))
                )
              )
              FROM jsonb_array_elements(cg.value->'explorar'->'items') AS item
            ),
            '[]'::jsonb
          )
        ),
        'visita',   cg.value->'visita',
        -- faq: array plano → objeto con header + items
        'faq', CASE
          WHEN jsonb_typeof(cg.value->'faq') = 'array' THEN
            jsonb_build_object(
              'eyebrow',     'Preguntas frecuentes',
              'heading',     'Lo que las familias preguntan más',
              'description', '',
              'items',       cg.value->'faq'
            )
          ELSE
            cg.value->'faq'
        END
      )
  END,
  'Admisiones — Unidad Educativa Atenas',
  'Conoce el proceso de admisión del Colegio Atenas en Ambato, Ecuador. Niveles desde Inicial hasta Bachillerato Internacional IB. Solicita tu visita.',
  true
FROM (
  SELECT value FROM configuracion_global WHERE key = 'admisiones_landing'
  UNION ALL
  SELECT NULL::jsonb WHERE NOT EXISTS (
    SELECT 1 FROM configuracion_global WHERE key = 'admisiones_landing'
  )
) AS cg
WHERE NOT EXISTS (
  SELECT 1 FROM paginas WHERE slug = 'admisiones'
);

-- Si la fila ya existe (re-ejecución), también actualizamos los campos
-- que cambiaron en este sprint: explorar.items.{ctaLabel,href} y faq
-- como objeto (manteniendo el resto del contenido tal como está).
-- Esto cubre el caso de un usuario que ya estaba editando la fila
-- entre que se ejecutó la migración inicial y este patch.
UPDATE paginas
SET contenido = jsonb_set(
  jsonb_set(
    contenido,
    '{explorar,items}',
    COALESCE(
      (
        SELECT jsonb_agg(
          item || jsonb_build_object(
            'ctaLabel', COALESCE(item->>'ctaLabel', 'Ver requisitos'),
            'href',     COALESCE(NULLIF(item->>'href', ''), '/admisiones/' || (item->>'slug'))
          )
        )
        FROM jsonb_array_elements(contenido->'explorar'->'items') AS item
      ),
      contenido->'explorar'->'items'
    ),
    false  -- no crear si no existe
  ),
  '{faq}',
  CASE
    WHEN jsonb_typeof(contenido->'faq') = 'array' THEN
      jsonb_build_object(
        'eyebrow',     'Preguntas frecuentes',
        'heading',     'Lo que las familias preguntan más',
        'description', '',
        'items',       contenido->'faq'
      )
    ELSE
      contenido->'faq'
  END,
  false
)
WHERE slug = 'admisiones'
  AND plantilla = 'tpl_p_admisiones_landing'
  AND (
    -- Solo actualiza si necesita la transformación (idempotente real):
    jsonb_typeof(contenido->'faq') = 'array'
    OR EXISTS (
      SELECT 1 FROM jsonb_array_elements(contenido->'explorar'->'items') AS item
      WHERE item->>'ctaLabel' IS NULL OR item->>'href' IS NULL
    )
  );
