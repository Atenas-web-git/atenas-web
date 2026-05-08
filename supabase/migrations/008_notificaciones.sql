-- ============================================================
-- Migración 008 — Sistema de Notificaciones públicas
-- Backoffice Atenas — Fase 3 (CMS de Contenido)
-- Requiere: 001 al 007 ejecutadas
--
-- Reemplaza la idea original de "Noticias / Revista" que el cliente
-- decidió eliminar (la revista del colegio se publica externamente).
--
-- Modelo: una sola tabla `notificaciones` con tres tipos visuales:
--   - popup       → modal central al primer ingreso (localStorage por id)
--   - dropdown    → lista en la campana del navbar
--   - banner_top  → barra fija arriba del sitio
--
-- Programación: fecha_inicio (obligatoria) y fecha_fin (opcional). Solo
-- las que están activas Y dentro del rango son visibles para el público.
--
-- IDEMPOTENTE: re-ejecutable. Sin seed (las notificaciones se crean desde
-- el backoffice).
-- ============================================================

CREATE TABLE IF NOT EXISTS notificaciones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS titulo          text;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS contenido_html  text;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS tipo            text NOT NULL DEFAULT 'dropdown';
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS imagen_url      text;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS cta_texto       text;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS cta_url         text;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS fecha_inicio    timestamptz NOT NULL DEFAULT now();
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS fecha_fin       timestamptz;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS prioridad       smallint NOT NULL DEFAULT 0;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS activa          boolean NOT NULL DEFAULT true;
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS created_at      timestamptz NOT NULL DEFAULT now();
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS updated_at      timestamptz NOT NULL DEFAULT now();
ALTER TABLE notificaciones ADD COLUMN IF NOT EXISTS updated_by      uuid REFERENCES profiles(id);

ALTER TABLE notificaciones DROP CONSTRAINT IF EXISTS notificaciones_tipo_check;
ALTER TABLE notificaciones
  ADD CONSTRAINT notificaciones_tipo_check
  CHECK (tipo IN ('popup', 'dropdown', 'banner_top'));

ALTER TABLE notificaciones DROP CONSTRAINT IF EXISTS notificaciones_fechas_check;
ALTER TABLE notificaciones
  ADD CONSTRAINT notificaciones_fechas_check
  CHECK (fecha_fin IS NULL OR fecha_fin > fecha_inicio);

CREATE INDEX IF NOT EXISTS idx_notificaciones_vigentes
  ON notificaciones (activa, fecha_inicio, fecha_fin);

CREATE INDEX IF NOT EXISTS idx_notificaciones_tipo
  ON notificaciones (tipo);

ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo activas Y dentro del rango de fechas
DROP POLICY IF EXISTS "notificaciones_select_public" ON notificaciones;
CREATE POLICY "notificaciones_select_public"
  ON notificaciones FOR SELECT
  TO anon, authenticated
  USING (
    activa = true
    AND fecha_inicio <= now()
    AND (fecha_fin IS NULL OR fecha_fin >= now())
  );

-- Lectura completa para admins (incluye programadas, vencidas, inactivas)
DROP POLICY IF EXISTS "notificaciones_select_admin" ON notificaciones;
CREATE POLICY "notificaciones_select_admin"
  ON notificaciones FOR SELECT
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
  );

-- Escritura: solo superadmin y editor_comm
DROP POLICY IF EXISTS "notificaciones_write_admin" ON notificaciones;
CREATE POLICY "notificaciones_write_admin"
  ON notificaciones FOR ALL
  TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_comm')
  );

-- Trigger updated_at automático (reusa la función de la migración 006)
DROP TRIGGER IF EXISTS trg_notificaciones_updated_at ON notificaciones;
CREATE TRIGGER trg_notificaciones_updated_at
  BEFORE UPDATE ON notificaciones
  FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
