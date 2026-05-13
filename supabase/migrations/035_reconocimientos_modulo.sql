-- ============================================================
-- Migración 035 — Módulo Reconocimientos (categorías + subcategorías + logros + galerías)
-- Backoffice Atenas — Fase 4 (sesión 31)
-- Requiere: 001_profiles_roles.sql
--
-- Reemplaza el seed estático de Plantilla E (sesión 30) por un módulo
-- dedicado que permite al cliente crear categorías arbitrarias de
-- reconocimientos (académicos, deportivos, profesionales, etc.) cada una
-- con sus subcategorías (disciplinas/áreas), logros y galería de fotos.
--
-- 5 tablas:
--   1. reconocimientos_categorias    (ej. Académicos, Deportivos)
--   2. reconocimientos_subcategorias (ej. Cambridge, Olimpiadas, Básquet)
--   3. reconocimientos_logros        (logro puntual con año + foto principal)
--   4. reconocimientos_logro_fotos   (sub-galería de fotos por logro)
--   5. reconocimientos_galeria_fotos (galería compartida — categoría o subcategoría)
--
-- RLS: lectura pública para items visibles; escritura para superadmin
-- y editor_comunicaciones / editor_academico.
--
-- IDEMPOTENTE: re-ejecutable sin destruir datos.
-- ============================================================

-- ─── 1. Tabla reconocimientos_categorias ───────────────────────
CREATE TABLE IF NOT EXISTS reconocimientos_categorias (
  id              bigserial PRIMARY KEY,
  slug            text NOT NULL UNIQUE,
  nombre          text NOT NULL,
  -- Hero de la landing /reconocimientos/[slug]
  hero_badge      text NOT NULL DEFAULT 'RECONOCIMIENTOS',
  hero_title      text NOT NULL,
  hero_subtitle   text NOT NULL DEFAULT '',
  hero_ghost_text text NOT NULL DEFAULT '',
  hero_bg_image   text,
  hero_footnote   text,
  -- Showcase configurable
  showcase_heading text NOT NULL DEFAULT 'Por disciplina',
  showcase_cta_text text NOT NULL DEFAULT 'Ver logros',
  -- Logros destacados configurable
  logros_heading    text NOT NULL DEFAULT 'Logros destacados',
  logros_subheading text NOT NULL DEFAULT '',
  -- Galería configurable
  galeria_titulo    text NOT NULL DEFAULT 'Galería',
  galeria_subtitulo text NOT NULL DEFAULT '',
  -- SEO
  meta_title       text,
  meta_description text,
  orden           int NOT NULL DEFAULT 0,
  visible         boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reconocimientos_categorias_orden
  ON reconocimientos_categorias (orden);
CREATE INDEX IF NOT EXISTS idx_reconocimientos_categorias_visible
  ON reconocimientos_categorias (visible);

-- ─── 2. Tabla reconocimientos_subcategorias ────────────────────
CREATE TABLE IF NOT EXISTS reconocimientos_subcategorias (
  id             bigserial PRIMARY KEY,
  categoria_id   bigint NOT NULL REFERENCES reconocimientos_categorias(id) ON DELETE CASCADE,
  slug           text NOT NULL,
  nombre         text NOT NULL,
  icon           text NOT NULL DEFAULT '🏆',  -- emoji o string corto que se renderiza en card
  -- Datos del Showcase (card en la landing)
  count_value    text NOT NULL DEFAULT '0',  -- texto libre: "12", "5", "Oro"
  count_label    text NOT NULL DEFAULT 'Logros',
  photo_src      text NOT NULL DEFAULT '',   -- foto principal de la card showcase
  -- Hero del detalle /reconocimientos/[categoria]/[subcategoria]
  hero_badge     text NOT NULL DEFAULT '',
  hero_subtitle  text NOT NULL DEFAULT '',
  hero_ghost_text text NOT NULL DEFAULT '',
  hero_bg_image   text,
  -- Logros destacados del detalle
  logros_heading    text NOT NULL DEFAULT '',
  logros_subheading text NOT NULL DEFAULT '',
  -- Galería del detalle
  galeria_titulo    text NOT NULL DEFAULT '',
  galeria_subtitulo text NOT NULL DEFAULT '',
  -- SEO
  meta_title       text,
  meta_description text,
  orden          int NOT NULL DEFAULT 0,
  visible        boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (categoria_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_reconocimientos_subcategorias_categoria
  ON reconocimientos_subcategorias (categoria_id);
CREATE INDEX IF NOT EXISTS idx_reconocimientos_subcategorias_orden
  ON reconocimientos_subcategorias (categoria_id, orden);
CREATE INDEX IF NOT EXISTS idx_reconocimientos_subcategorias_visible
  ON reconocimientos_subcategorias (visible);

-- ─── 3. Tabla reconocimientos_logros ───────────────────────────
-- Un logro pertenece a una subcategoría (o directo a la categoría si
-- subcategoria_id es NULL — para categorías sin disciplinas).
CREATE TABLE IF NOT EXISTS reconocimientos_logros (
  id              bigserial PRIMARY KEY,
  categoria_id    bigint NOT NULL REFERENCES reconocimientos_categorias(id) ON DELETE CASCADE,
  subcategoria_id bigint REFERENCES reconocimientos_subcategorias(id) ON DELETE CASCADE,
  icon            text NOT NULL DEFAULT '🏆',
  titulo          text NOT NULL,
  year            text NOT NULL DEFAULT '',
  descripcion     text NOT NULL DEFAULT '',  -- antes 'categoria' en la plantilla E
  highlight       boolean NOT NULL DEFAULT false,
  orden           int NOT NULL DEFAULT 0,
  visible         boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reconocimientos_logros_categoria
  ON reconocimientos_logros (categoria_id);
CREATE INDEX IF NOT EXISTS idx_reconocimientos_logros_subcategoria
  ON reconocimientos_logros (subcategoria_id);
CREATE INDEX IF NOT EXISTS idx_reconocimientos_logros_highlight
  ON reconocimientos_logros (highlight) WHERE highlight = true;
CREATE INDEX IF NOT EXISTS idx_reconocimientos_logros_orden
  ON reconocimientos_logros (categoria_id, orden);

-- ─── 4. Tabla reconocimientos_logro_fotos ──────────────────────
-- Sub-galería de fotos por logro (las que rotan en el slider de LogroCard).
CREATE TABLE IF NOT EXISTS reconocimientos_logro_fotos (
  id          bigserial PRIMARY KEY,
  logro_id    bigint NOT NULL REFERENCES reconocimientos_logros(id) ON DELETE CASCADE,
  src         text NOT NULL,
  alt         text NOT NULL DEFAULT '',
  orden       int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reconocimientos_logro_fotos_logro
  ON reconocimientos_logro_fotos (logro_id, orden);

-- ─── 5. Tabla reconocimientos_galeria_fotos ────────────────────
-- Galería compartida — scope = 'categoria' o 'subcategoria'.
-- Si scope = 'categoria' → scope_id apunta a reconocimientos_categorias.id
-- Si scope = 'subcategoria' → scope_id apunta a reconocimientos_subcategorias.id
-- (No usamos FK por scope_id porque depende del scope; integridad por trigger).
CREATE TABLE IF NOT EXISTS reconocimientos_galeria_fotos (
  id          bigserial PRIMARY KEY,
  scope       text NOT NULL,  -- 'categoria' | 'subcategoria'
  scope_id    bigint NOT NULL,
  src         text NOT NULL,
  alt         text NOT NULL DEFAULT '',
  orden       int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reconocimientos_galeria_fotos
  DROP CONSTRAINT IF EXISTS reconocimientos_galeria_fotos_scope_check;
ALTER TABLE reconocimientos_galeria_fotos
  ADD CONSTRAINT reconocimientos_galeria_fotos_scope_check
  CHECK (scope IN ('categoria', 'subcategoria'));

CREATE INDEX IF NOT EXISTS idx_reconocimientos_galeria_fotos_scope
  ON reconocimientos_galeria_fotos (scope, scope_id, orden);

-- ─── RLS ───────────────────────────────────────────────────────
ALTER TABLE reconocimientos_categorias        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconocimientos_subcategorias     ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconocimientos_logros            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconocimientos_logro_fotos       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconocimientos_galeria_fotos     ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo items visibles
DROP POLICY IF EXISTS "reconocimientos_categorias_public_select" ON reconocimientos_categorias;
CREATE POLICY "reconocimientos_categorias_public_select"
  ON reconocimientos_categorias FOR SELECT TO anon, authenticated
  USING (visible = true);

DROP POLICY IF EXISTS "reconocimientos_subcategorias_public_select" ON reconocimientos_subcategorias;
CREATE POLICY "reconocimientos_subcategorias_public_select"
  ON reconocimientos_subcategorias FOR SELECT TO anon, authenticated
  USING (visible = true);

DROP POLICY IF EXISTS "reconocimientos_logros_public_select" ON reconocimientos_logros;
CREATE POLICY "reconocimientos_logros_public_select"
  ON reconocimientos_logros FOR SELECT TO anon, authenticated
  USING (visible = true);

DROP POLICY IF EXISTS "reconocimientos_logro_fotos_public_select" ON reconocimientos_logro_fotos;
CREATE POLICY "reconocimientos_logro_fotos_public_select"
  ON reconocimientos_logro_fotos FOR SELECT TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "reconocimientos_galeria_fotos_public_select" ON reconocimientos_galeria_fotos;
CREATE POLICY "reconocimientos_galeria_fotos_public_select"
  ON reconocimientos_galeria_fotos FOR SELECT TO anon, authenticated
  USING (true);

-- Escritura admin (superadmin + editor_comm + editor_academico)
DROP POLICY IF EXISTS "reconocimientos_categorias_admin_all" ON reconocimientos_categorias;
CREATE POLICY "reconocimientos_categorias_admin_all"
  ON reconocimientos_categorias FOR ALL TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );

DROP POLICY IF EXISTS "reconocimientos_subcategorias_admin_all" ON reconocimientos_subcategorias;
CREATE POLICY "reconocimientos_subcategorias_admin_all"
  ON reconocimientos_subcategorias FOR ALL TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );

DROP POLICY IF EXISTS "reconocimientos_logros_admin_all" ON reconocimientos_logros;
CREATE POLICY "reconocimientos_logros_admin_all"
  ON reconocimientos_logros FOR ALL TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );

DROP POLICY IF EXISTS "reconocimientos_logro_fotos_admin_all" ON reconocimientos_logro_fotos;
CREATE POLICY "reconocimientos_logro_fotos_admin_all"
  ON reconocimientos_logro_fotos FOR ALL TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );

DROP POLICY IF EXISTS "reconocimientos_galeria_fotos_admin_all" ON reconocimientos_galeria_fotos;
CREATE POLICY "reconocimientos_galeria_fotos_admin_all"
  ON reconocimientos_galeria_fotos FOR ALL TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
    OR user_has_role('editor_academico')
  );

-- ─── Seed inicial (idempotente — solo siembra si las tablas están vacías) ───
DO $$
DECLARE
  v_acad_id    bigint;
  v_dep_id     bigint;
  v_sub_id     bigint;
  v_logro_id   bigint;
BEGIN
  -- Solo siembra si la tabla categorias está vacía
  IF NOT EXISTS (SELECT 1 FROM reconocimientos_categorias LIMIT 1) THEN

    -- ─── CATEGORÍA: ACADÉMICOS ────────────────────────────────
    INSERT INTO reconocimientos_categorias (
      slug, nombre, hero_badge, hero_title, hero_subtitle, hero_ghost_text,
      showcase_heading, showcase_cta_text,
      logros_heading, logros_subheading,
      galeria_titulo, galeria_subtitulo,
      meta_title, meta_description,
      orden, visible
    ) VALUES (
      'academicos', 'Académicos',
      'RECONOCIMIENTOS', 'Reconocimientos Académicos',
      'Estudiantes que destacan en olimpiadas, exámenes internacionales y proyectos de innovación — el orgullo intelectual de Atenas.',
      'ACADEMIA',
      'Por área',
      'Ver logros',
      'Logros académicos destacados',
      'Toca los puntos de cada tarjeta para navegar entre las fotos del logro.',
      'Galería — Académicos',
      'Momentos que reflejan la excelencia académica',
      'Reconocimientos Académicos | Atenas',
      'Los estudiantes de la Unidad Educativa Atenas destacan en olimpiadas, exámenes internacionales y proyectos de innovación. Conoce sus logros académicos.',
      1, true
    ) RETURNING id INTO v_acad_id;

    -- Subcategorías académicas
    INSERT INTO reconocimientos_subcategorias (
      categoria_id, slug, nombre, icon, count_value, count_label, photo_src,
      hero_badge, hero_subtitle, hero_ghost_text,
      logros_heading, logros_subheading,
      galeria_titulo, galeria_subtitulo,
      orden, visible
    ) VALUES
      (v_acad_id, 'olimpiadas', 'Olimpiadas', '🧠', '15', 'Medallas obtenidas',
       'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&q=80',
       'RECONOCIMIENTOS ACADÉMICOS', 'Estudiantes que conquistan podios en olimpiadas de matemática, física y química a nivel provincial y nacional.',
       'OLIMPIADAS',
       'Nuestros logros en Olimpiadas',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del logro.',
       'Galería — Olimpiadas',
       'Momentos históricos de nuestros olímpicos',
       1, true),
      (v_acad_id, 'ib', 'Diploma IB', '🎓', '92%', 'Tasa de aprobación',
       'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
       'RECONOCIMIENTOS ACADÉMICOS', 'Bachillerato Internacional con tasas de aprobación superiores al promedio mundial y becas universitarias internacionales.',
       'IB',
       'Nuestros logros en el Programa IB',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del logro.',
       'Galería — Diploma IB',
       'Ceremonias y graduaciones del Programa IB',
       2, true),
      (v_acad_id, 'cambridge', 'Cambridge', '📜', '48', 'Certificados FCE/CAE',
       'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
       'RECONOCIMIENTOS ACADÉMICOS', 'Certificaciones internacionales de Cambridge English (FCE, CAE) que abren las puertas del mundo a nuestros estudiantes.',
       'CAMBRIDGE',
       'Nuestros logros en Cambridge English',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del logro.',
       'Galería — Cambridge',
       'Ceremonias de entrega de certificados Cambridge',
       3, true),
      (v_acad_id, 'oratoria', 'Ciencia y Tech', '🔬', '7', 'Proyectos premiados',
       'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=600&q=80',
       'RECONOCIMIENTOS ACADÉMICOS', 'Proyectos de investigación y prototipos tecnológicos premiados en ferias provinciales y nacionales de ciencia y tecnología.',
       'CIENCIA',
       'Nuestros logros en Ciencia y Tecnología',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del logro.',
       'Galería — Ciencia y Tech',
       'Proyectos y exposiciones de nuestros estudiantes',
       4, true);

    -- Logros destacados Académicos (algunos con highlight=true para la landing)
    INSERT INTO reconocimientos_logros (categoria_id, subcategoria_id, icon, titulo, year, descripcion, highlight, orden)
    SELECT v_acad_id, s.id, '🥇', 'Medalla de Oro Olimpiada Nacional', '2024', 'Matemática · Categoría sub-18', true, 1
      FROM reconocimientos_subcategorias s WHERE s.slug = 'olimpiadas' AND s.categoria_id = v_acad_id
    UNION ALL
    SELECT v_acad_id, s.id, '🏅', 'Plata Olimpiada Provincial Física', '2023', 'Categoría sub-16', false, 2
      FROM reconocimientos_subcategorias s WHERE s.slug = 'olimpiadas' AND s.categoria_id = v_acad_id
    UNION ALL
    SELECT v_acad_id, s.id, '🎓', '92% Aprobación IB Diploma', '2024', 'Promedio histórico superior al global', true, 3
      FROM reconocimientos_subcategorias s WHERE s.slug = 'ib' AND s.categoria_id = v_acad_id
    UNION ALL
    SELECT v_acad_id, s.id, '📜', '48 Certificaciones Cambridge FCE/CAE', '2024', 'Promociones 2023 y 2024', false, 4
      FROM reconocimientos_subcategorias s WHERE s.slug = 'cambridge' AND s.categoria_id = v_acad_id
    UNION ALL
    SELECT v_acad_id, s.id, '🔬', 'Primer Lugar Feria Provincial de Ciencias', '2023', 'Proyecto de energía solar portátil', true, 5
      FROM reconocimientos_subcategorias s WHERE s.slug = 'oratoria' AND s.categoria_id = v_acad_id;

    -- Sub-galería de fotos por cada logro académico (1-2 fotos cada uno)
    INSERT INTO reconocimientos_logro_fotos (logro_id, src, alt, orden)
    SELECT l.id, 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=700&q=80', l.titulo, 1
      FROM reconocimientos_logros l WHERE l.categoria_id = v_acad_id;

    -- Galería de fotos de la categoría Académicos (5 fotos para mosaico landing)
    INSERT INTO reconocimientos_galeria_fotos (scope, scope_id, src, alt, orden) VALUES
      ('categoria', v_acad_id, 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=700&q=80', 'Olimpiada de matemática', 1),
      ('categoria', v_acad_id, 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80', 'Ceremonia IB', 2),
      ('categoria', v_acad_id, 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80', 'Entrega Cambridge', 3),
      ('categoria', v_acad_id, 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=500&q=80', 'Feria de ciencias', 4),
      ('categoria', v_acad_id, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&q=80', 'Equipo académico', 5);

    -- ─── CATEGORÍA: DEPORTIVOS ────────────────────────────────
    INSERT INTO reconocimientos_categorias (
      slug, nombre, hero_badge, hero_title, hero_subtitle, hero_ghost_text,
      showcase_heading, showcase_cta_text,
      logros_heading, logros_subheading,
      galeria_titulo, galeria_subtitulo,
      meta_title, meta_description,
      orden, visible
    ) VALUES (
      'deportivos', 'Deportivos',
      'RECONOCIMIENTOS', 'Reconocimientos Deportivos',
      'Atletas que representan a Atenas con excelencia — campeonatos provinciales, nacionales y logros que enorgullecen a toda la comunidad.',
      'DEPORTE',
      'Por disciplina',
      'Ver logros',
      'Campeones que representan a Atenas en todo el país',
      'Cada tarjeta es un álbum de fotos del campeonato — toca los puntos para ver todos los momentos.',
      'Galería de Logros',
      'Momentos que quedan en la historia del colegio',
      'Reconocimientos Deportivos | Atenas',
      'Los atletas de la Unidad Educativa Atenas compiten y ganan en campeonatos provinciales y nacionales. Conoce nuestros logros deportivos por disciplina.',
      2, true
    ) RETURNING id INTO v_dep_id;

    -- Subcategorías deportivas
    INSERT INTO reconocimientos_subcategorias (
      categoria_id, slug, nombre, icon, count_value, count_label, photo_src,
      hero_badge, hero_subtitle, hero_ghost_text,
      logros_heading, logros_subheading,
      galeria_titulo, galeria_subtitulo,
      orden, visible
    ) VALUES
      (v_dep_id, 'basquetbol', 'Básquetbol', '🏀', '8', 'Medallas y títulos',
       'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80',
       'RECONOCIMIENTOS DEPORTIVOS', 'Campeones provinciales con un equipo que demuestra disciplina, trabajo en equipo y orgullo ateniense en cada cancha.',
       'BASKET',
       'Nuestros logros en Básquetbol',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
       'Galería — Básquetbol',
       'Momentos históricos de nuestros atletas',
       1, true),
      (v_dep_id, 'atletismo', 'Atletismo', '🏃', '5', 'Medallas nacionales',
       'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
       'RECONOCIMIENTOS DEPORTIVOS', 'Velocistas y fondistas que representan a Atenas en los Juegos Nacionales Estudiantiles con medallas y récords que inspiran.',
       'ATLETAS',
       'Nuestros logros en Atletismo',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
       'Galería — Atletismo',
       'Momentos históricos de nuestros atletas',
       2, true),
      (v_dep_id, 'futbol', 'Fútbol', '⚽', '12', 'Títulos provinciales',
       'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80',
       'RECONOCIMIENTOS DEPORTIVOS', 'Un equipo que juega con corazón ateniense — campeones provinciales y referentes del fútbol intercolegial en Tungurahua.',
       'FÚTBOL',
       'Nuestros logros en Fútbol',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
       'Galería — Fútbol',
       'Momentos históricos de nuestros atletas',
       3, true),
      (v_dep_id, 'natacion', 'Natación', '🏊', '3', 'Oros regionales',
       'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80',
       'RECONOCIMIENTOS DEPORTIVOS', 'Nadadores de élite que conquistan las piscinas regionales y nacionales con técnica y perseverancia.',
       'AGUA',
       'Nuestros logros en Natación',
       'Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.',
       'Galería — Natación',
       'Momentos históricos de nuestros atletas',
       4, true);

    -- Logros destacados Deportivos
    INSERT INTO reconocimientos_logros (categoria_id, subcategoria_id, icon, titulo, year, descripcion, highlight, orden)
    SELECT v_dep_id, s.id, '🥇', 'Campeones Provinciales', '2023', 'Categoría masculina sub-18', true, 1
      FROM reconocimientos_subcategorias s WHERE s.slug = 'basquetbol' AND s.categoria_id = v_dep_id
    UNION ALL
    SELECT v_dep_id, s.id, '🏅', 'Subcampeones Regionales', '2022', 'Categoría femenina sub-16', false, 2
      FROM reconocimientos_subcategorias s WHERE s.slug = 'basquetbol' AND s.categoria_id = v_dep_id
    UNION ALL
    SELECT v_dep_id, s.id, '🏅', 'Medalla de Oro Nacional', '2022', 'Juegos Nacionales Estudiantiles', true, 3
      FROM reconocimientos_subcategorias s WHERE s.slug = 'atletismo' AND s.categoria_id = v_dep_id
    UNION ALL
    SELECT v_dep_id, s.id, '🏆', 'Liga Provincial — Primer Lugar', '2023', 'Categoría mixta · Ambato', true, 4
      FROM reconocimientos_subcategorias s WHERE s.slug = 'futbol' AND s.categoria_id = v_dep_id
    UNION ALL
    SELECT v_dep_id, s.id, '🥇', 'Torneo Intercolegial', '2022', 'Categoría masculina sub-18', false, 5
      FROM reconocimientos_subcategorias s WHERE s.slug = 'futbol' AND s.categoria_id = v_dep_id
    UNION ALL
    SELECT v_dep_id, s.id, '🥇', 'Medalla de Oro Regional', '2021', 'Zona 3 — 200m libre', false, 6
      FROM reconocimientos_subcategorias s WHERE s.slug = 'natacion' AND s.categoria_id = v_dep_id;

    -- Sub-galería de fotos por cada logro deportivo
    INSERT INTO reconocimientos_logro_fotos (logro_id, src, alt, orden)
    SELECT l.id,
      CASE
        WHEN l.icon LIKE '%🏀%' OR l.descripcion LIKE '%básquet%' OR l.descripcion LIKE '%sub-18%' THEN 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80'
        WHEN l.descripcion LIKE '%atletismo%' OR l.year = '2022' AND l.titulo LIKE '%Nacional%' THEN 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80'
        WHEN l.descripcion LIKE '%fútbol%' OR l.titulo LIKE '%Liga%' OR l.titulo LIKE '%Intercolegial%' THEN 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80'
        ELSE 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80'
      END,
      l.titulo, 1
      FROM reconocimientos_logros l WHERE l.categoria_id = v_dep_id;

    -- Galería de fotos de la categoría Deportivos
    INSERT INTO reconocimientos_galeria_fotos (scope, scope_id, src, alt, orden) VALUES
      ('categoria', v_dep_id, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80', 'Básquetbol', 1),
      ('categoria', v_dep_id, 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80', 'Atletismo', 2),
      ('categoria', v_dep_id, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', 'Fútbol', 3),
      ('categoria', v_dep_id, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80', 'Natación', 4),
      ('categoria', v_dep_id, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80', 'Celebración', 5);

  END IF;
END $$;
