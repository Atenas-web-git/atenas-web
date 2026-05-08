-- ============================================================
-- Migración 021 — Cronograma escolar (eventos + tipos + períodos)
-- Backoffice Atenas — Fase 3 (sesión 27)
-- Requiere: 001_profiles_roles.sql + 003_correos_anos_adjuntos.sql
--
-- Crea tres tablas para el módulo de Cronograma:
--
-- 1. `cronograma_tipos` — categorías de eventos (feriado, evaluación,
--    ceremonia, académico, vacaciones, etc.). Editables.
--
-- 2. `cronograma_periodos` — períodos académicos del año lectivo
--    (Quimestre 1, Quimestre 2, Trimestre 1, etc.). El cliente define
--    sus períodos por año lectivo, así puede usar quimestres un año y
--    trimestres otro si cambia la planificación. Cada período tiene
--    un color que se usa para los badges del frontend.
--
-- 3. `cronograma_eventos` — fichas de eventos del cronograma con
--    fecha_inicio, fecha_fin opcional (para rangos), título, descripción,
--    y FKs a período y tipo.
--
-- RLS: lectura pública de eventos publicados; escritura para superadmin
-- y editor_academico.
--
-- IDEMPOTENTE: re-ejecutable sin destruir datos.
-- ============================================================

-- ─── Tabla cronograma_tipos ──────────────────────────────────
CREATE TABLE IF NOT EXISTS cronograma_tipos (
  id          bigserial PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  nombre      text NOT NULL,
  orden       int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cronograma_tipos_orden
  ON cronograma_tipos (orden);

-- ─── Tabla cronograma_periodos ───────────────────────────────
CREATE TABLE IF NOT EXISTS cronograma_periodos (
  id                  bigserial PRIMARY KEY,
  slug                text NOT NULL UNIQUE,
  nombre              text NOT NULL,
  color               text NOT NULL DEFAULT 'navy',  -- gold | red | teal | navy | purple
  ano_lectivo_codigo  text REFERENCES anos_lectivos(codigo) ON DELETE SET NULL,
  orden               int NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cronograma_periodos
  DROP CONSTRAINT IF EXISTS cronograma_periodos_color_check;
ALTER TABLE cronograma_periodos
  ADD CONSTRAINT cronograma_periodos_color_check
  CHECK (color IN ('gold', 'red', 'teal', 'navy', 'purple'));

CREATE INDEX IF NOT EXISTS idx_cronograma_periodos_ano
  ON cronograma_periodos (ano_lectivo_codigo);
CREATE INDEX IF NOT EXISTS idx_cronograma_periodos_orden
  ON cronograma_periodos (orden);

-- ─── Tabla cronograma_eventos ────────────────────────────────
CREATE TABLE IF NOT EXISTS cronograma_eventos (
  id            bigserial PRIMARY KEY,
  titulo        text NOT NULL,
  descripcion   text,
  periodo_id    bigint NOT NULL REFERENCES cronograma_periodos(id) ON DELETE RESTRICT,
  tipo_id       bigint NOT NULL REFERENCES cronograma_tipos(id) ON DELETE RESTRICT,
  fecha_inicio  date NOT NULL,
  fecha_fin     date,                            -- NULL si es de un solo día
  publicado     boolean NOT NULL DEFAULT true,    -- por defecto publicados (eventos suelen ser confirmados al crearse)
  subido_por    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cronograma_eventos_periodo
  ON cronograma_eventos (periodo_id);
CREATE INDEX IF NOT EXISTS idx_cronograma_eventos_tipo
  ON cronograma_eventos (tipo_id);
CREATE INDEX IF NOT EXISTS idx_cronograma_eventos_fecha
  ON cronograma_eventos (fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_cronograma_eventos_publicado
  ON cronograma_eventos (publicado);

-- ─── Trigger updated_at ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_cronograma_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cronograma_tipos_updated_at ON cronograma_tipos;
CREATE TRIGGER trg_cronograma_tipos_updated_at
  BEFORE UPDATE ON cronograma_tipos
  FOR EACH ROW EXECUTE FUNCTION set_cronograma_updated_at();

DROP TRIGGER IF EXISTS trg_cronograma_periodos_updated_at ON cronograma_periodos;
CREATE TRIGGER trg_cronograma_periodos_updated_at
  BEFORE UPDATE ON cronograma_periodos
  FOR EACH ROW EXECUTE FUNCTION set_cronograma_updated_at();

DROP TRIGGER IF EXISTS trg_cronograma_eventos_updated_at ON cronograma_eventos;
CREATE TRIGGER trg_cronograma_eventos_updated_at
  BEFORE UPDATE ON cronograma_eventos
  FOR EACH ROW EXECUTE FUNCTION set_cronograma_updated_at();

-- ─── RLS ─────────────────────────────────────────────────────
ALTER TABLE cronograma_tipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cronograma_periodos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cronograma_eventos ENABLE ROW LEVEL SECURITY;

-- Tipos: lectura pública, escritura admin
DROP POLICY IF EXISTS "cronograma_tipos_select_publica" ON cronograma_tipos;
CREATE POLICY "cronograma_tipos_select_publica" ON cronograma_tipos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "cronograma_tipos_insert_admin" ON cronograma_tipos;
CREATE POLICY "cronograma_tipos_insert_admin" ON cronograma_tipos
  FOR INSERT WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "cronograma_tipos_update_admin" ON cronograma_tipos;
CREATE POLICY "cronograma_tipos_update_admin" ON cronograma_tipos
  FOR UPDATE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "cronograma_tipos_delete_admin" ON cronograma_tipos;
CREATE POLICY "cronograma_tipos_delete_admin" ON cronograma_tipos
  FOR DELETE USING (user_has_role('superadmin') OR user_has_role('editor_academico'));

-- Períodos: lectura pública, escritura admin
DROP POLICY IF EXISTS "cronograma_periodos_select_publica" ON cronograma_periodos;
CREATE POLICY "cronograma_periodos_select_publica" ON cronograma_periodos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "cronograma_periodos_insert_admin" ON cronograma_periodos;
CREATE POLICY "cronograma_periodos_insert_admin" ON cronograma_periodos
  FOR INSERT WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "cronograma_periodos_update_admin" ON cronograma_periodos;
CREATE POLICY "cronograma_periodos_update_admin" ON cronograma_periodos
  FOR UPDATE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "cronograma_periodos_delete_admin" ON cronograma_periodos;
CREATE POLICY "cronograma_periodos_delete_admin" ON cronograma_periodos
  FOR DELETE USING (user_has_role('superadmin') OR user_has_role('editor_academico'));

-- Eventos: lectura pública SOLO publicados; escritura admin
DROP POLICY IF EXISTS "cronograma_eventos_select_publicos" ON cronograma_eventos;
CREATE POLICY "cronograma_eventos_select_publicos" ON cronograma_eventos
  FOR SELECT USING (
    publicado = true
    OR user_has_role('superadmin')
    OR user_has_role('editor_academico')
  );

DROP POLICY IF EXISTS "cronograma_eventos_insert_admin" ON cronograma_eventos;
CREATE POLICY "cronograma_eventos_insert_admin" ON cronograma_eventos
  FOR INSERT WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "cronograma_eventos_update_admin" ON cronograma_eventos;
CREATE POLICY "cronograma_eventos_update_admin" ON cronograma_eventos
  FOR UPDATE
  USING (user_has_role('superadmin') OR user_has_role('editor_academico'))
  WITH CHECK (user_has_role('superadmin') OR user_has_role('editor_academico'));

DROP POLICY IF EXISTS "cronograma_eventos_delete_admin" ON cronograma_eventos;
CREATE POLICY "cronograma_eventos_delete_admin" ON cronograma_eventos
  FOR DELETE USING (user_has_role('superadmin') OR user_has_role('editor_academico'));

-- ─── Seed año lectivo 2026-2027 (si no existe) ───────────────
-- El cronograma público necesita al menos un año lectivo activo.
INSERT INTO anos_lectivos (codigo, nombre, fecha_inicio, fecha_fin, activo)
SELECT '2026-2027', 'Año Lectivo 2026–2027', '2026-09-08', '2027-06-30', true
WHERE NOT EXISTS (SELECT 1 FROM anos_lectivos WHERE codigo = '2026-2027');

-- ─── Seed tipos iniciales (replican los 5 hardcoded actuales) ─
INSERT INTO cronograma_tipos (slug, nombre, orden)
SELECT * FROM (VALUES
  ('feriado',     'Feriado',     10),
  ('evaluacion',  'Evaluación',  20),
  ('ceremonia',   'Ceremonia',   30),
  ('academico',   'Académico',   40),
  ('vacaciones',  'Vacaciones',  50)
) AS data(slug, nombre, orden)
WHERE NOT EXISTS (
  SELECT 1 FROM cronograma_tipos WHERE cronograma_tipos.slug = data.slug
);

-- ─── Seed períodos (Quimestres 1 y 2 del año 2026-2027) ──────
INSERT INTO cronograma_periodos (slug, nombre, color, ano_lectivo_codigo, orden)
SELECT * FROM (VALUES
  ('q1-2026-2027', 'Quimestre 1', 'navy', '2026-2027', 10),
  ('q2-2026-2027', 'Quimestre 2', 'red',  '2026-2027', 20)
) AS data(slug, nombre, color, ano_lectivo_codigo, orden)
WHERE NOT EXISTS (
  SELECT 1 FROM cronograma_periodos WHERE cronograma_periodos.slug = data.slug
);

-- ─── Seed eventos (replican los 18 hardcoded actuales) ───────
-- Cada evento se asocia al período por slug (q1-2026-2027 o q2-2026-2027)
-- y al tipo por slug. fecha_inicio en formato ISO; fecha_fin sólo si es rango.
INSERT INTO cronograma_eventos (titulo, periodo_id, tipo_id, fecha_inicio, fecha_fin, publicado)
SELECT
  ev.titulo,
  p.id,
  t.id,
  ev.fecha_inicio::date,
  CASE WHEN ev.fecha_fin = '' THEN NULL ELSE ev.fecha_fin::date END,
  true
FROM (VALUES
  -- ── Quimestre 1 ─────────────────────────────────────────
  ('Inicio del Año Lectivo 2026–2027',    'q1-2026-2027', 'ceremonia',  '2026-09-08', ''),
  ('Día del Maestro',                      'q1-2026-2027', 'feriado',    '2026-10-01', ''),
  ('Evaluaciones Parciales Quimestre 1',   'q1-2026-2027', 'evaluacion', '2026-10-15', '2026-10-17'),
  ('Día de Difuntos',                      'q1-2026-2027', 'feriado',    '2026-11-02', ''),
  ('Día de la Madre',                      'q1-2026-2027', 'ceremonia',  '2026-11-13', ''),
  ('Evaluaciones Finales Quimestre 1',     'q1-2026-2027', 'evaluacion', '2026-11-25', '2026-12-04'),
  ('Entrega de Libretas Q1',               'q1-2026-2027', 'ceremonia',  '2026-12-05', ''),
  ('Vacaciones de Navidad y Fin de Año',   'q1-2026-2027', 'vacaciones', '2026-12-22', '2027-01-04'),
  -- ── Quimestre 2 ─────────────────────────────────────────
  ('Regreso a Clases — Inicio Q2',         'q2-2026-2027', 'academico',  '2027-01-05', ''),
  ('Evaluaciones Parciales Quimestre 2',   'q2-2026-2027', 'evaluacion', '2027-02-01', '2027-02-03'),
  ('Carnaval — Feriado Nacional',          'q2-2026-2027', 'vacaciones', '2027-02-27', '2027-03-02'),
  ('Día Internacional de la Mujer',        'q2-2026-2027', 'academico',  '2027-03-08', ''),
  ('Vacaciones de Semana Santa',           'q2-2026-2027', 'vacaciones', '2027-04-01', '2027-04-09'),
  ('Día del Trabajo',                      'q2-2026-2027', 'feriado',    '2027-05-01', ''),
  ('Batalla de Pichincha / Día del Maestro', 'q2-2026-2027', 'feriado',  '2027-05-24', ''),
  ('Evaluaciones Finales Quimestre 2',     'q2-2026-2027', 'evaluacion', '2027-05-25', '2027-06-04'),
  ('Acto de Graduación',                   'q2-2026-2027', 'ceremonia',  '2027-06-18', ''),
  ('Clausura del Año Lectivo 2026–2027',   'q2-2026-2027', 'ceremonia',  '2027-06-25', '')
) AS ev(titulo, periodo_slug, tipo_slug, fecha_inicio, fecha_fin)
JOIN cronograma_periodos p ON p.slug = ev.periodo_slug
JOIN cronograma_tipos    t ON t.slug = ev.tipo_slug
WHERE NOT EXISTS (
  SELECT 1 FROM cronograma_eventos
  WHERE cronograma_eventos.titulo       = ev.titulo
    AND cronograma_eventos.fecha_inicio = ev.fecha_inicio::date
);
