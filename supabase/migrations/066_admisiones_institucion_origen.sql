-- ============================================================
-- Migración 066 — Campo "Institución de origen" en solicitudes
-- Sesión 41.
--
-- Agrega un campo de texto libre opcional para indicar la institución
-- educativa de origen del estudiante aspirante. Se solicita en el
-- paso 1 del formulario (Datos del estudiante) y se muestra en la
-- ficha del postulante del backoffice.
--
-- IDEMPOTENTE.
-- ============================================================

ALTER TABLE solicitudes_admision
  ADD COLUMN IF NOT EXISTS est_institucion_origen text;
