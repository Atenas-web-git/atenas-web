-- ============================================================
-- Migración 060 — Campo `bgVideoUrl` en el hero del Home.
--
-- Permite subir un video propio (MP4/WebM liviano) como fondo del hero
-- en lugar de un embed de YouTube. El video propio tiene prioridad sobre
-- el de YouTube y se reproduce en loop sin branding ni botón de play.
--
-- Agrega la clave al JSONB del hero de la página Home (slug = '/').
--
-- IDEMPOTENTE: jsonb_set con null-safe — si ya existe no la pisa.
-- ============================================================

UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{hero,bgVideoUrl}',
  COALESCE(contenido->'hero'->'bgVideoUrl', '""'::jsonb),
  true
)
WHERE slug = '/' AND plantilla = 'tpl_m_home';
