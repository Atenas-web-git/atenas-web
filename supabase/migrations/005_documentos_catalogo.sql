-- ============================================================
-- Migración 005 — Catálogo editable de documentos físicos de admisión
-- Backoffice Atenas — Fase 2
-- Requiere: 001 + 002 + 003 ejecutadas
--
-- Antes los 6 documentos físicos estaban hardcodeados en el código.
-- Ahora viven en BD y se pueden agregar/editar/eliminar desde
-- /admin/configuracion/documentos-admision.
--
-- IDEMPOTENTE: re-ejecutable. Si la tabla ya está poblada, NO sembramos.
-- ============================================================

CREATE TABLE IF NOT EXISTS documentos_admision_catalogo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE documentos_admision_catalogo ADD COLUMN IF NOT EXISTS nombre      text;
ALTER TABLE documentos_admision_catalogo ADD COLUMN IF NOT EXISTS orden       int  NOT NULL DEFAULT 0;
ALTER TABLE documentos_admision_catalogo ADD COLUMN IF NOT EXISTS activo      boolean NOT NULL DEFAULT true;
ALTER TABLE documentos_admision_catalogo ADD COLUMN IF NOT EXISTS created_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE documentos_admision_catalogo ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE documentos_admision_catalogo ADD COLUMN IF NOT EXISTS updated_by  uuid REFERENCES profiles(id);

-- Evitar duplicados de nombre (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS idx_documentos_catalogo_nombre_unique
  ON documentos_admision_catalogo (lower(nombre));

CREATE INDEX IF NOT EXISTS idx_documentos_catalogo_activo
  ON documentos_admision_catalogo (activo, orden);

ALTER TABLE documentos_admision_catalogo ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquier admin (superadmin o editor_admisiones)
DROP POLICY IF EXISTS "documentos_catalogo_select" ON documentos_admision_catalogo;
CREATE POLICY "documentos_catalogo_select"
  ON documentos_admision_catalogo FOR SELECT
  TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

-- Escritura: superadmin o editor_admisiones
DROP POLICY IF EXISTS "documentos_catalogo_write" ON documentos_admision_catalogo;
CREATE POLICY "documentos_catalogo_write"
  ON documentos_admision_catalogo FOR ALL
  TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

-- Seed inicial: solo si la tabla está vacía
INSERT INTO documentos_admision_catalogo (nombre, orden, activo)
SELECT * FROM (VALUES
  ('Partida de nacimiento', 1, true),
  ('Cédula de identidad del estudiante', 2, true),
  ('Cédula del representante', 3, true),
  ('Foto tamaño carnet', 4, true),
  ('Historial académico anterior', 5, true),
  ('Certificado de no adeudo', 6, true)
) AS data(nombre, orden, activo)
WHERE NOT EXISTS (SELECT 1 FROM documentos_admision_catalogo);
