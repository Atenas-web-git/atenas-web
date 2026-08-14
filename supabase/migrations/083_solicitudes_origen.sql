-- ============================================================
-- Migración 083 — De dónde vino cada solicitud de admisión
-- Backoffice Atenas — sesión 51 (2026-08-14)
-- Requiere: 002_admisiones_extension.sql ejecutada
--
-- Añade `solicitudes_admision.origen` para poder distinguir las
-- solicitudes que entraron por el formulario público de las que registra
-- a mano el equipo de admisiones.
--
-- Hace falta por dos motivos concretos:
--
-- 1. La ficha del tablero lo pide literalmente: «se distingue de las que
--    entraron por el formulario web».
-- 2. El caso real del colegio: en 2do y 3ro de bachillerato el trámite es
--    presencial por norma, así que esas solicitudes SIEMPRE entrarán a
--    mano. Sin marca, no hay forma de saber cuántas del padrón llegaron
--    por un canal o por otro.
--
-- IDEMPOTENTE.
-- ============================================================
--
-- ⚠️ ESTA MIGRACIÓN VA ANTES DEL DESPLIEGUE. Al revés que la 081.
--
-- El formulario de creación manual escribe `origen = 'manual'` en el
-- INSERT. Si el código llega antes que la columna, el INSERT falla entero
-- y no se puede registrar ninguna solicitud desde el panel.
--
-- Migración primero, push después. Es el orden habitual del proyecto.
--
-- ============================================================

-- `web` por defecto, y NOT NULL: todas las filas que existen hoy entraron
-- por el formulario público, así que el backfill es correcto sin más.
--
-- El default se queda puesto a propósito y no solo para el backfill: el
-- endpoint público NO escribe esta columna, y no debería tener que
-- acordarse de hacerlo. Lo que se marca es la excepción, no la norma.
ALTER TABLE solicitudes_admision
  ADD COLUMN IF NOT EXISTS origen text NOT NULL DEFAULT 'web';

-- CHECK aparte del ADD COLUMN para que la migración sea reejecutable: si
-- ya existe la restricción, se recrea igual sin fallar.
ALTER TABLE solicitudes_admision
  DROP CONSTRAINT IF EXISTS solicitudes_admision_origen_check;
ALTER TABLE solicitudes_admision
  ADD CONSTRAINT solicitudes_admision_origen_check
  CHECK (origen IN ('web', 'manual'));

COMMENT ON COLUMN solicitudes_admision.origen IS
  'Canal de entrada: «web» si vino del formulario público, «manual» si la registró el equipo de admisiones desde el panel. Por defecto «web» — se marca la excepción.';
