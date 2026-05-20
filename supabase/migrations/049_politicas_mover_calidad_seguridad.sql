-- ============================================================
-- Migración 049 — Mover Política de Calidad y Política de Seguridad
-- desde la ruta /el-atenas/ hacia /politicas/.
--
-- Cambios:
--
-- 1. UPDATE slug en `paginas`:
--    - 'el-atenas/politica-calidad'   → 'politicas/calidad'
--    - 'el-atenas/politica-seguridad' → 'politicas/seguridad'
--    (Plantilla se mantiene en A; la app sirve el contenido vía catch-all.)
--
-- 2. UPDATE href en `menu_items` para que el mega-menú apunte a las nuevas URLs.
--
-- IDEMPOTENTE: re-ejecutable. Solo actualiza si los slugs/hrefs viejos existen
-- y los nuevos NO existen (para evitar romper si la migración se aplica dos
-- veces o si el usuario ya cambió manualmente algo).
-- ============================================================

-- ─── 1. Mover slug en `paginas` ─────────────────────────────────────
UPDATE paginas
SET slug = 'politicas/calidad'
WHERE slug = 'el-atenas/politica-calidad'
  AND NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'politicas/calidad');

UPDATE paginas
SET slug = 'politicas/seguridad'
WHERE slug = 'el-atenas/politica-seguridad'
  AND NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'politicas/seguridad');

-- ─── 2. Actualizar href en menu_items ───────────────────────────────
UPDATE menu_items
SET href = '/politicas/calidad'
WHERE href = '/el-atenas/politica-calidad';

UPDATE menu_items
SET href = '/politicas/seguridad'
WHERE href = '/el-atenas/politica-seguridad';
