-- ============================================================
-- Migración 003 — Años lectivos, plantillas de correo, adjuntos
-- Backoffice Atenas — Fase 2 (gestor de correos)
-- Requiere: 001_profiles_roles.sql + 002_admisiones_extension.sql
--
-- IDEMPOTENTE: se puede re-ejecutar sin romper nada existente.
-- ============================================================

-- ─── Tabla anos_lectivos ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anos_lectivos (
  codigo text PRIMARY KEY
);

ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS nombre        text;
ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS fecha_inicio  date;
ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS fecha_fin     date;
ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS activo        boolean NOT NULL DEFAULT true;
ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();
ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS created_by    uuid REFERENCES profiles(id);
ALTER TABLE anos_lectivos ADD COLUMN IF NOT EXISTS updated_at    timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_anos_lectivos_activo ON anos_lectivos (activo);

ALTER TABLE anos_lectivos ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquier visitante (anon o auth) — para que el formulario público pueda listar opciones
DROP POLICY IF EXISTS "anos_select_public" ON anos_lectivos;
CREATE POLICY "anos_select_public"
  ON anos_lectivos FOR SELECT
  TO anon, authenticated
  USING (true);

-- Escritura: solo superadmin (configuración global)
DROP POLICY IF EXISTS "anos_write_admin" ON anos_lectivos;
CREATE POLICY "anos_write_admin"
  ON anos_lectivos FOR ALL
  TO authenticated
  USING (user_has_role('superadmin'))
  WITH CHECK (user_has_role('superadmin'));

-- Seed inicial (solo si no hay nada todavía)
INSERT INTO anos_lectivos (codigo, nombre, activo)
VALUES
  ('2026-2027', 'Año Lectivo 2026-2027', true),
  ('2027-2028', 'Año Lectivo 2027-2028', true)
ON CONFLICT (codigo) DO NOTHING;


-- ─── Tabla plantillas_correo_admision ─────────────────────────
CREATE TABLE IF NOT EXISTS plantillas_correo_admision (
  estado text PRIMARY KEY
);

ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS asunto      text;
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS titulo      text;
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS cuerpo_html text;
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS activo      boolean NOT NULL DEFAULT true;
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS updated_at  timestamptz NOT NULL DEFAULT now();
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS updated_by  uuid REFERENCES profiles(id);

ALTER TABLE plantillas_correo_admision DROP CONSTRAINT IF EXISTS plantillas_estado_check;
ALTER TABLE plantillas_correo_admision
  ADD CONSTRAINT plantillas_estado_check
  CHECK (estado IN (
    'revisando',
    'entrevista_agendada',
    'lista_espera',
    'aceptado',
    'matriculado',
    'rechazado'
  ));

ALTER TABLE plantillas_correo_admision ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plantillas_select_admin" ON plantillas_correo_admision;
CREATE POLICY "plantillas_select_admin"
  ON plantillas_correo_admision FOR SELECT
  TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

DROP POLICY IF EXISTS "plantillas_write_admin" ON plantillas_correo_admision;
CREATE POLICY "plantillas_write_admin"
  ON plantillas_correo_admision FOR ALL
  TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_admisiones'));


-- ─── Tabla solicitud_adjuntos (archivos por solicitud) ─────────
CREATE TABLE IF NOT EXISTS solicitud_adjuntos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid()
);

ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS solicitud_id  uuid REFERENCES solicitudes_admision(id) ON DELETE CASCADE;
ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS filename      text;
ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS storage_path  text;
ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS size_bytes    int;
ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS mime_type     text;
ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS uploaded_at   timestamptz NOT NULL DEFAULT now();
ALTER TABLE solicitud_adjuntos ADD COLUMN IF NOT EXISTS uploaded_by   uuid REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_solicitud_adjuntos_solicitud
  ON solicitud_adjuntos (solicitud_id);

ALTER TABLE solicitud_adjuntos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "adjuntos_select_admin" ON solicitud_adjuntos;
CREATE POLICY "adjuntos_select_admin"
  ON solicitud_adjuntos FOR SELECT
  TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'));

DROP POLICY IF EXISTS "adjuntos_write_admin" ON solicitud_adjuntos;
CREATE POLICY "adjuntos_write_admin"
  ON solicitud_adjuntos FOR ALL
  TO authenticated
  USING (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_admisiones'));


-- ─── Storage bucket: admisiones-adjuntos ───────────────────────
-- Privado, límite 5MB por archivo
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'admisiones-adjuntos',
  'admisiones-adjuntos',
  false,
  5242880  -- 5MB
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  public = EXCLUDED.public;

-- Policies del bucket: solo superadmin / editor_admisiones leen, suben y borran
DROP POLICY IF EXISTS "adjuntos_storage_select" ON storage.objects;
CREATE POLICY "adjuntos_storage_select"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'admisiones-adjuntos'
    AND (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  );

DROP POLICY IF EXISTS "adjuntos_storage_insert" ON storage.objects;
CREATE POLICY "adjuntos_storage_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'admisiones-adjuntos'
    AND (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  );

DROP POLICY IF EXISTS "adjuntos_storage_delete" ON storage.objects;
CREATE POLICY "adjuntos_storage_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'admisiones-adjuntos'
    AND (user_has_role('superadmin') OR user_has_role('editor_admisiones'))
  );
