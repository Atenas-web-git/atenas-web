-- ============================================================================
-- 096 — El asistente del panel acepta capturas (etapa 2, 2026-09-28)
-- ============================================================================
--
-- Una columna más en `asistente_uso`: si la pregunta llevó una captura de
-- pantalla. Una captura cuesta bastante más tokens que una pregunta escrita
-- (una imagen de 1600 px son del orden de mil tokens de entrada, fuera de la
-- caché), y la tarjeta de uso de Configuración › Asistente del panel la
-- cuenta aparte para que se vea de dónde sale el gasto.
--
-- ORDEN: da igual. El código que inserta la fila detecta que la columna no
-- existe y vuelve a insertar sin ella; la tarjeta de uso lee `*` y trata la
-- columna como opcional. Sin esta migración solo se pierde el dato de cuántas
-- preguntas llevaron captura, nada más.
--
-- Idempotente.
-- ============================================================================

ALTER TABLE asistente_uso
  ADD COLUMN IF NOT EXISTS con_captura boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN asistente_uso.con_captura IS
  'true si la pregunta llevó una captura de pantalla adjunta. La imagen NUNCA se guarda: solo el hecho, para separar su costo en la tarjeta de uso. En las pantallas con datos de personas (el Inicio, Admisiones, respuestas de formularios, registro de descargas) no se aceptan capturas, así que ahí siempre es false; la lista vive en capturasBloqueadas() de lib/asistente/captura.ts.';
