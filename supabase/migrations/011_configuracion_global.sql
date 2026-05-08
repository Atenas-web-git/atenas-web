-- ============================================================
-- Migración 011 — Tabla genérica de configuración global (key-value)
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 001_profiles_roles.sql ejecutada
--
-- Tabla key-value para configuraciones que aplican GLOBALMENTE al sitio
-- (no por página). Pensada para datos compartidos entre múltiples páginas
-- o componentes:
--
--   - fechas_matriculas       → banner que aparece en /matriculas/*
--   - (futuro) telefonos        → contactos en footer
--   - (futuro) redes_sociales   → links en footer / contactos
--   - (futuro) marca            → logo, colores (Fase 4)
--
-- IDEMPOTENTE: re-ejecutable. Seed inicial solo si la key no existe.
-- ============================================================

CREATE TABLE IF NOT EXISTS configuracion_global (
  key text PRIMARY KEY
);

ALTER TABLE configuracion_global ADD COLUMN IF NOT EXISTS value       jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE configuracion_global ADD COLUMN IF NOT EXISTS descripcion text;
ALTER TABLE configuracion_global ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE configuracion_global ADD COLUMN IF NOT EXISTS updated_by  uuid REFERENCES profiles(id);

ALTER TABLE configuracion_global ENABLE ROW LEVEL SECURITY;

-- Lectura pública (alimenta componentes del sitio público)
DROP POLICY IF EXISTS "configuracion_global_select_public" ON configuracion_global;
CREATE POLICY "configuracion_global_select_public"
  ON configuracion_global FOR SELECT
  TO anon, authenticated
  USING (true);

-- Escritura: superadmin o editor_admisiones (porque las fechas son operativas
-- para admisiones/matrículas). Editor_comm también puede tocar (para futuras
-- configs de marca / redes sociales).
DROP POLICY IF EXISTS "configuracion_global_write_admin" ON configuracion_global;
CREATE POLICY "configuracion_global_write_admin"
  ON configuracion_global FOR ALL
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  );

-- Trigger updated_at automático (reusa la función de migración 006)
DROP TRIGGER IF EXISTS trg_configuracion_global_updated_at ON configuracion_global;
CREATE TRIGGER trg_configuracion_global_updated_at
  BEFORE UPDATE ON configuracion_global
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- ─── Seed inicial: fechas_matriculas ──────────────────────────
INSERT INTO configuracion_global (key, value, descripcion)
SELECT * FROM (VALUES
  (
    'fechas_matriculas',
    jsonb_build_object(
      'ano_lectivo', 'Año lectivo 2026–2027',
      'etapas', jsonb_build_array(
        jsonb_build_object('etapa', 'Inscripciones',     'rango', '3 – 28 feb 2026'),
        jsonb_build_object('etapa', 'Matrículas nuevas', 'rango', '3 – 14 mar 2026'),
        jsonb_build_object('etapa', 'Reingreso',         'rango', '17 – 21 mar 2026')
      ),
      'cta_texto', 'Iniciar proceso',
      'cta_url',   '/matriculas/proceso'
    ),
    'Banner de fechas que aparece en todas las páginas de Matrículas. Se edita desde /admin/configuracion/fechas-matriculas.'
  )
) AS data(key, value, descripcion)
WHERE NOT EXISTS (SELECT 1 FROM configuracion_global WHERE configuracion_global.key = data.key);
