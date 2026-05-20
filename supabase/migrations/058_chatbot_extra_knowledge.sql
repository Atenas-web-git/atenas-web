-- ============================================================
-- Migración 058 — Campo "Conocimiento adicional" en config del chatbot.
--
-- Permite que el cliente pegue texto extra desde
-- /admin/configuracion/chatbot con información que NO está publicada
-- en la web (vacaciones internas, FAQ administrativos, números
-- privilegiados, etc.) y que el chatbot debe conocer.
--
-- Se concatena al knowledge base del sitio al armar el system prompt
-- en cada conversación.
--
-- IDEMPOTENTE: jsonb_set con null-safe.
-- ============================================================

UPDATE configuracion_global
SET value = jsonb_set(
  value,
  '{extraKnowledge}',
  COALESCE(value->'extraKnowledge', '""'::jsonb),
  true
)
WHERE key = 'chatbot';
