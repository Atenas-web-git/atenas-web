-- ============================================================
-- Migración 042 — Campo `ctaHref` editable en la tarjeta de correo
-- de /contactos (sección "Canales de atención").
--
-- Permite al equipo del colegio cambiar a dónde apunta el botón
-- "Enviar correo": por defecto abre el cliente de correo del
-- visitante con `mailto:` (comportamiento automático del front si
-- el campo está vacío), pero también pueden apuntar a un
-- formulario externo, una URL absoluta, un mailto con asunto
-- precargado, etc.
--
-- Solo afecta a la fila ya seedeada en la migración 041; si por
-- alguna razón no existe, no hace nada (el seed de 041 ya incluiría
-- `ctaHref: ""` de aquí en adelante porque el código merge default
-- lo agrega automáticamente, pero igual lo dejamos seteado en BD
-- por consistencia para Supabase Studio).
--
-- IDEMPOTENTE: re-ejecutable. Solo agrega el campo si no existe.
-- ============================================================

UPDATE configuracion_global
SET value = jsonb_set(
  value,
  '{canales,tarjetaEmail,ctaHref}',
  '""'::jsonb,
  true   -- create_missing = true
)
WHERE key = 'contactos_pagina'
  AND NOT (value #> '{canales,tarjetaEmail}' ? 'ctaHref');
