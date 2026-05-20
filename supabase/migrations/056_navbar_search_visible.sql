-- ============================================================
-- Migración 056 — Activar el botón de búsqueda del navbar por default.
--
-- En la migración 052 el botón de búsqueda quedó `visible = false` porque
-- aún no era funcional. Con la migración 055 ya existe la búsqueda global
-- real, así que lo activamos automáticamente.
--
-- IDEMPOTENTE: solo afecta a la fila navbar si existe.
-- ============================================================

UPDATE configuracion_global
SET value = jsonb_set(value, '{busqueda,visible}', 'true'::jsonb, true)
WHERE key = 'navbar';
