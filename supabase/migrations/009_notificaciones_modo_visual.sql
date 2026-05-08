-- ============================================================
-- Migración 009 — Modo visual del popup de notificaciones
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 008_notificaciones.sql ejecutada
--
-- Agrega la columna `modo_visual` para que las notificaciones tipo
-- "popup" puedan elegir entre 3 estilos visuales:
--
--   - imagen_libre              → solo la imagen cuadrada (sin texto/CTA del sistema)
--   - plantilla_imagen_texto    → variante B: imagen 1:1 + bloque texto
--   - plantilla_diagonal        → variante C: navy con franja diagonal roja
--
-- Para tipos `dropdown` y `banner_top` la columna se ignora (la UI no la
-- pregunta), pero queda con valor por compatibilidad.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

ALTER TABLE notificaciones
  ADD COLUMN IF NOT EXISTS modo_visual text NOT NULL DEFAULT 'plantilla_imagen_texto';

ALTER TABLE notificaciones DROP CONSTRAINT IF EXISTS notificaciones_modo_visual_check;
ALTER TABLE notificaciones
  ADD CONSTRAINT notificaciones_modo_visual_check
  CHECK (modo_visual IN (
    'imagen_libre',
    'plantilla_imagen_texto',
    'plantilla_diagonal'
  ));
