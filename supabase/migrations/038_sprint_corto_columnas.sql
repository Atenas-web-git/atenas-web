-- ============================================================
-- Migración 038 — Sprint corto: foto en mega-menú + hero de logros por categoría
-- Backoffice Atenas — Fase 4 (sesión 32)
--
-- 1. `menu_items.imagen_url` — añadida originalmente para mostrar thumbnails
--    por sub-item en el mega-menú. **Descontinuada en sesión 32** (el cliente
--    pidió en su lugar una imagen de fondo GLOBAL del panel izquierdo, que se
--    gestiona desde `configuracion_global['mega_menu']`). La columna queda en
--    BD como inocua (no se lee desde el frontend); no es necesario borrarla.
--
-- 2. `reconocimientos_categorias.logros_hero_*` — 5 columnas opcionales para
--    personalizar el Hero de la página `/reconocimientos/[cat]/logros` (hoy
--    está hardcoded). Si están vacías, el frontend usa un fallback genérico.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- ─── 1. menu_items.imagen_url (DESCONTINUADA — ver nota arriba) ─
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS imagen_url text;

-- ─── 2. reconocimientos_categorias — hero de página de logros ──
ALTER TABLE reconocimientos_categorias
  ADD COLUMN IF NOT EXISTS logros_hero_badge      text,
  ADD COLUMN IF NOT EXISTS logros_hero_title      text,
  ADD COLUMN IF NOT EXISTS logros_hero_subtitle   text,
  ADD COLUMN IF NOT EXISTS logros_hero_ghost_text text,
  ADD COLUMN IF NOT EXISTS logros_hero_bg_image   text;
