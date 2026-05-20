-- ============================================================
-- Migración 061 — Campo `bgVideoUrl` en el bloque Trayectoria de Historia.
--
-- Igual que en el Home (migración 060): permite subir un video propio
-- (MP4/WebM liviano) como fondo del bloque Trayectoria en lugar de un
-- embed de YouTube. El video propio tiene prioridad y no muestra branding.
--
-- Agrega la clave al JSONB de `trayectoria` de la página de Historia.
--
-- IDEMPOTENTE: jsonb_set con null-safe.
-- ============================================================

UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{trayectoria,bgVideoUrl}',
  COALESCE(contenido->'trayectoria'->'bgVideoUrl', '""'::jsonb),
  true
)
WHERE slug = 'el-atenas/historia' AND plantilla = 'tpl_i_historia';
