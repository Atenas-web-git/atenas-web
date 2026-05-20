-- ============================================================
-- Migración 059 — Campo "texto de la burbuja" del chatbot.
--
-- El globo de sugerencia que aparece junto al botón flotante de Ateneo
-- ("¿Tienes alguna pregunta sobre Atenas?") estaba hardcoded. Ahora es
-- editable desde /admin/configuracion/chatbot.
--
-- IDEMPOTENTE: jsonb_set con null-safe.
-- ============================================================

UPDATE configuracion_global
SET value = jsonb_set(
  value,
  '{bubbleText}',
  COALESCE(value->'bubbleText', '"¿Tienes alguna pregunta sobre Atenas?"'::jsonb),
  true
)
WHERE key = 'chatbot';
