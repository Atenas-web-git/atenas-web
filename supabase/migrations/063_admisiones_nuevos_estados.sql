-- ============================================================
-- Migración 063 — Nuevos estados del pipeline de admisiones
-- Sesión 41.
--
-- Reemplaza los 7 estados anteriores
--   (pendiente, revisando, entrevista_agendada, lista_espera,
--    aceptado, matriculado, rechazado)
-- por los 8 oficiales del colegio:
--   1. interesado          (estado inicial al enviar el formulario)
--   2. postulante
--   3. postulacion_completa
--   4. en_evaluacion
--   5. en_revision_comite
--   6. admitido
--   7. no_admitido
--   8. matriculado
--
-- Importante: se elimina el estado "lista_espera" (ya no se usa).
-- Si por algún motivo hay filas con estados viejos (no debería —
-- la plataforma aún no está en producción real), se mapean al
-- equivalente más cercano del nuevo flujo.
--
-- IDEMPOTENTE.
-- ============================================================

-- 1. Quitar el CHECK anterior (para poder hacer el UPDATE de mapeo).
ALTER TABLE solicitudes_admision
  DROP CONSTRAINT IF EXISTS solicitudes_admision_estado_check;

-- 2. Mapear cualquier fila existente con un estado viejo al nuevo equivalente.
UPDATE solicitudes_admision SET estado = 'interesado'
  WHERE estado = 'pendiente';
UPDATE solicitudes_admision SET estado = 'postulante'
  WHERE estado = 'revisando';
UPDATE solicitudes_admision SET estado = 'en_evaluacion'
  WHERE estado = 'entrevista_agendada';
UPDATE solicitudes_admision SET estado = 'en_revision_comite'
  WHERE estado = 'lista_espera';
UPDATE solicitudes_admision SET estado = 'admitido'
  WHERE estado = 'aceptado';
UPDATE solicitudes_admision SET estado = 'no_admitido'
  WHERE estado = 'rechazado';
-- 'matriculado' se mantiene igual en ambos flujos.

-- 3. Aplicar el nuevo CHECK.
ALTER TABLE solicitudes_admision
  ADD CONSTRAINT solicitudes_admision_estado_check
  CHECK (estado IN (
    'interesado',
    'postulante',
    'postulacion_completa',
    'en_evaluacion',
    'en_revision_comite',
    'admitido',
    'no_admitido',
    'matriculado'
  ));

-- 4. Default del estado inicial.
ALTER TABLE solicitudes_admision
  ALTER COLUMN estado SET DEFAULT 'interesado';
