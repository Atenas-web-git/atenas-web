-- ============================================================
-- Migración 002 — Ampliación módulo de Admisiones
-- Backoffice Atenas — Fase 2
-- Requiere: 001_profiles_roles.sql ejecutado
-- ============================================================

-- ─── Ampliar solicitudes_admision con columnas operacionales ────
ALTER TABLE solicitudes_admision
  ADD COLUMN IF NOT EXISTS prioridad smallint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS asignado_a uuid REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS cupo_disponible boolean,
  ADD COLUMN IF NOT EXISTS documentos_recibidos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS notas_internas text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ─── Ampliar estados permitidos del pipeline ────────────────────
-- Estados válidos: pendiente, revisando, entrevista_agendada,
--                  lista_espera, aceptado, matriculado, rechazado
ALTER TABLE solicitudes_admision
  DROP CONSTRAINT IF EXISTS solicitudes_admision_estado_check;

ALTER TABLE solicitudes_admision
  ADD CONSTRAINT solicitudes_admision_estado_check
  CHECK (estado IN (
    'pendiente',
    'revisando',
    'entrevista_agendada',
    'lista_espera',
    'aceptado',
    'matriculado',
    'rechazado'
  ));

CREATE INDEX IF NOT EXISTS idx_solicitudes_asignado ON solicitudes_admision (asignado_a);
CREATE INDEX IF NOT EXISTS idx_solicitudes_created_at ON solicitudes_admision (created_at DESC);

-- ─── Tabla solicitudes_historial ────────────────────────────────
CREATE TABLE IF NOT EXISTS solicitudes_historial (
  id              bigserial PRIMARY KEY,
  solicitud_id    uuid NOT NULL REFERENCES solicitudes_admision(id) ON DELETE CASCADE,
  estado_anterior text,
  estado_nuevo    text NOT NULL,
  cambiado_por    uuid REFERENCES profiles(id),
  nota            text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_historial_solicitud ON solicitudes_historial (solicitud_id, created_at DESC);

-- ─── Trigger: registrar cambios de estado automáticamente ──────
CREATE OR REPLACE FUNCTION log_solicitud_estado_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Solo registrar si el estado cambió
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO solicitudes_historial (solicitud_id, estado_anterior, estado_nuevo, cambiado_por)
    VALUES (NEW.id, NULL, NEW.estado, auth.uid());
  ELSIF (TG_OP = 'UPDATE' AND OLD.estado IS DISTINCT FROM NEW.estado) THEN
    INSERT INTO solicitudes_historial (solicitud_id, estado_anterior, estado_nuevo, cambiado_por)
    VALUES (NEW.id, OLD.estado, NEW.estado, auth.uid());
  END IF;

  -- Actualizar updated_at
  IF (TG_OP = 'UPDATE') THEN
    NEW.updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_solicitud_estado_change ON solicitudes_admision;
CREATE TRIGGER trg_solicitud_estado_change
  AFTER INSERT OR UPDATE ON solicitudes_admision
  FOR EACH ROW EXECUTE FUNCTION log_solicitud_estado_change();

-- ─── Tabla cupos_admision (configuración por nivel y año) ──────
CREATE TABLE IF NOT EXISTS cupos_admision (
  nivel           text NOT NULL,
  ano_lectivo     text NOT NULL,
  cupos_total     int NOT NULL DEFAULT 0,
  cupos_ocupados  int NOT NULL DEFAULT 0,
  updated_at      timestamptz NOT NULL DEFAULT now(),
  updated_by      uuid REFERENCES profiles(id),
  PRIMARY KEY (nivel, ano_lectivo),
  CHECK (cupos_total >= 0),
  CHECK (cupos_ocupados >= 0),
  CHECK (cupos_ocupados <= cupos_total)
);

-- ─── Reemplazar policies anteriores por las basadas en roles ────

-- Borrar las policies viejas (las creó la migración inicial)
DROP POLICY IF EXISTS "Insertar solicitud pública" ON solicitudes_admision;
DROP POLICY IF EXISTS "Lectura interna" ON solicitudes_admision;
DROP POLICY IF EXISTS "Actualización interna" ON solicitudes_admision;

-- Cualquier visitante anónimo puede INSERT (formulario público)
CREATE POLICY "solicitudes_insert_anon"
  ON solicitudes_admision FOR INSERT
  TO anon
  WITH CHECK (true);

-- También authenticated puede INSERT (admin manual)
CREATE POLICY "solicitudes_insert_authenticated"
  ON solicitudes_admision FOR INSERT
  TO authenticated
  WITH CHECK (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );

-- Lectura: solo superadmin o editor_admisiones
CREATE POLICY "solicitudes_select_admin"
  ON solicitudes_admision FOR SELECT
  TO authenticated
  USING (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );

-- Actualización: solo superadmin o editor_admisiones
CREATE POLICY "solicitudes_update_admin"
  ON solicitudes_admision FOR UPDATE
  TO authenticated
  USING (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  )
  WITH CHECK (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );

-- Borrado: solo superadmin
CREATE POLICY "solicitudes_delete_superadmin"
  ON solicitudes_admision FOR DELETE
  TO authenticated
  USING (user_has_role('superadmin'));

-- ─── RLS para solicitudes_historial ────────────────────────────
ALTER TABLE solicitudes_historial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "historial_select_admin"
  ON solicitudes_historial FOR SELECT
  TO authenticated
  USING (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );

-- El historial se inserta solo desde el trigger (ningún rol lo escribe directo).
-- Mantenemos sin policy de INSERT — el trigger usa SECURITY DEFINER si necesario.

-- ─── RLS para cupos_admision ───────────────────────────────────
ALTER TABLE cupos_admision ENABLE ROW LEVEL SECURITY;

-- Lectura: anon también puede leer (para auto-derivar a lista de espera desde el form público)
CREATE POLICY "cupos_select_public"
  ON cupos_admision FOR SELECT
  TO anon, authenticated
  USING (true);

-- Escritura: solo superadmin o editor_admisiones
CREATE POLICY "cupos_write_admin"
  ON cupos_admision FOR ALL
  TO authenticated
  USING (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  )
  WITH CHECK (
    user_has_role('superadmin') OR user_has_role('editor_admisiones')
  );
