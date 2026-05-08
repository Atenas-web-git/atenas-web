-- ============================================================
-- Migración 019 — Documentos descargables (PDFs en Google Drive)
-- Backoffice Atenas — Fase 3 (sesión 27)
-- Requiere: 001_profiles_roles.sql ejecutada
--
-- Crea dos tablas para el módulo de Documentos Institucionales:
--
-- 1. `documentos_categorias` — catálogo editable de categorías
--    (Contratos, Políticas, Formularios, etc.) con icono Lucide y
--    color de paleta (gold/red/teal/navy/purple).
--
-- 2. `documentos` — fichas de documentos descargables. Los archivos
--    NO se suben a Supabase Storage — se hospedan en Google Drive
--    como públicos y aquí se guarda solo la URL + metadata.
--
-- Lectura pública filtrada (`publicado = true`); escritura para
-- superadmin + editor_academico.
--
-- IDEMPOTENTE: re-ejecutable sin destruir datos.
-- ============================================================

-- ─── Tabla documentos_categorias ─────────────────────────────
CREATE TABLE IF NOT EXISTS documentos_categorias (
  id          bigserial PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  nombre      text NOT NULL,
  icono       text,        -- nombre del icono Lucide en kebab-case (ej. "file-text", "shield")
  color       text NOT NULL DEFAULT 'gold',  -- gold | red | teal | navy | purple
  orden       int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE documentos_categorias
  DROP CONSTRAINT IF EXISTS documentos_categorias_color_check;
ALTER TABLE documentos_categorias
  ADD CONSTRAINT documentos_categorias_color_check
  CHECK (color IN ('gold', 'red', 'teal', 'navy', 'purple'));

CREATE INDEX IF NOT EXISTS idx_documentos_categorias_orden
  ON documentos_categorias (orden);

-- ─── Tabla documentos ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documentos (
  id            bigserial PRIMARY KEY,
  titulo        text NOT NULL,
  descripcion   text,
  categoria_id  bigint NOT NULL REFERENCES documentos_categorias(id) ON DELETE RESTRICT,
  drive_url     text NOT NULL,    -- URL de Google Drive (cualquier formato del usuario)
  orden         int NOT NULL DEFAULT 0,
  publicado     boolean NOT NULL DEFAULT false,
  subido_por    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_documentos_categoria
  ON documentos (categoria_id);

CREATE INDEX IF NOT EXISTS idx_documentos_publicado_orden
  ON documentos (publicado, orden);

-- ─── Trigger updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_documentos_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_documentos_categorias_updated_at ON documentos_categorias;
CREATE TRIGGER trg_documentos_categorias_updated_at
  BEFORE UPDATE ON documentos_categorias
  FOR EACH ROW EXECUTE FUNCTION set_documentos_updated_at();

DROP TRIGGER IF EXISTS trg_documentos_updated_at ON documentos;
CREATE TRIGGER trg_documentos_updated_at
  BEFORE UPDATE ON documentos
  FOR EACH ROW EXECUTE FUNCTION set_documentos_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────
ALTER TABLE documentos_categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Categorías: lectura pública (las usa el frontend incluso para listar
-- categorías sin documentos publicados); escritura solo superadmin
-- y editor_academico
DROP POLICY IF EXISTS "documentos_categorias_select_publica" ON documentos_categorias;
CREATE POLICY "documentos_categorias_select_publica" ON documentos_categorias
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "documentos_categorias_insert_admin" ON documentos_categorias;
CREATE POLICY "documentos_categorias_insert_admin" ON documentos_categorias
  FOR INSERT
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "documentos_categorias_update_admin" ON documentos_categorias;
CREATE POLICY "documentos_categorias_update_admin" ON documentos_categorias
  FOR UPDATE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "documentos_categorias_delete_admin" ON documentos_categorias;
CREATE POLICY "documentos_categorias_delete_admin" ON documentos_categorias
  FOR DELETE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'));

-- Documentos: lectura pública SOLO publicados; escritura admin
DROP POLICY IF EXISTS "documentos_select_publicos" ON documentos;
CREATE POLICY "documentos_select_publicos" ON documentos
  FOR SELECT
  USING (
    publicado = true
    OR user_has_role('superadmin')
    OR user_has_role('editor_academico')
  );

DROP POLICY IF EXISTS "documentos_insert_admin" ON documentos;
CREATE POLICY "documentos_insert_admin" ON documentos
  FOR INSERT
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "documentos_update_admin" ON documentos;
CREATE POLICY "documentos_update_admin" ON documentos
  FOR UPDATE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "documentos_delete_admin" ON documentos;
CREATE POLICY "documentos_delete_admin" ON documentos
  FOR DELETE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'));

-- ─── Seed de categorías iniciales ────────────────────────────
-- Reemplazan las 3 categorías hardcodeadas en TablaDocumentos.tsx.
-- IDEMPOTENTE: solo inserta si no existe ese slug.
INSERT INTO documentos_categorias (slug, nombre, icono, color, orden)
SELECT * FROM (VALUES
  ('contratos',    'Contratos y Acuerdos',     'file-check', 'gold', 10),
  ('politicas',    'Políticas Institucionales', 'shield',     'red',  20),
  ('formularios',  'Formularios y Solicitudes', 'clipboard',  'teal', 30)
) AS data(slug, nombre, icono, color, orden)
WHERE NOT EXISTS (
  SELECT 1 FROM documentos_categorias WHERE documentos_categorias.slug = data.slug
);

-- ─── Seed de documentos iniciales (placeholder) ──────────────
-- Replica los 7 documentos hardcodeados en TablaDocumentos con
-- drive_url placeholder vacío. El cliente debe entrar al backoffice y
-- pegar la URL real de Google Drive de cada documento. Quedan como
-- borrador (publicado=false) para que no aparezcan en el público
-- hasta que se configuren bien.
INSERT INTO documentos (titulo, categoria_id, drive_url, orden, publicado)
SELECT
  d.titulo,
  c.id,
  d.drive_url,
  d.orden,
  d.publicado
FROM (VALUES
  ('Resolución de Pensiones',                  'contratos',   '', 10, false),
  ('Contrato de Prestación de Servicios',       'contratos',   '', 20, false),
  ('Consentimiento de Datos Personales',        'contratos',   '', 30, false),
  ('Declaración Juramentada',                   'contratos',   '', 40, false),
  ('Código de Convivencia',                     'politicas',   '', 10, false),
  ('Rutas de Manejo de Conflictos',             'politicas',   '', 20, false),
  ('Solicitud de Inasistencia',                 'formularios', '', 10, false)
) AS d(titulo, cat_slug, drive_url, orden, publicado)
JOIN documentos_categorias c ON c.slug = d.cat_slug
WHERE NOT EXISTS (
  SELECT 1 FROM documentos WHERE documentos.titulo = d.titulo
);
