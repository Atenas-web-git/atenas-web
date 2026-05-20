-- ============================================================
-- Migración 054 — Agregar ciudad + sitio web a la configuración de Marca.
--
-- Antes de esta migración, los emails tenían "Izamba, Ambato",
-- "Ambato, Ecuador" y "atenas.edu.ec" hardcoded. Ahora se leen de
-- `configuracion_global['marca']` para que sean editables desde el
-- backoffice como el resto de la identidad institucional.
--
-- IDEMPOTENTE: usa jsonb_set con default null-safe.
-- ============================================================

UPDATE configuracion_global
SET value = jsonb_set(
  jsonb_set(
    value,
    '{institucion,ciudad}',
    COALESCE(value->'institucion'->'ciudad', '"Ambato, Ecuador"'::jsonb),
    true
  ),
  '{institucion,sitioWeb}',
  COALESCE(value->'institucion'->'sitioWeb', '"https://atenas.edu.ec"'::jsonb),
  true
)
WHERE key = 'marca';
