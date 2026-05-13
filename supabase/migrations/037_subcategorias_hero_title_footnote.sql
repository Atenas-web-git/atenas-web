-- ============================================================
-- Migración 037 — Añadir hero_title y hero_footnote a subcategorías de Reconocimientos
-- Backoffice Atenas — Fase 4 (sesión 31)
-- Requiere: 035 (módulo Reconocimientos)
--
-- Cierra dos huecos detectados al revisar el backoffice de subcategorías:
--
-- 1. `hero_title` — el título grande del hero del detalle hoy se fuerza al
--    `nombre` de la subcategoría. Esta columna permite editar el título por
--    separado (ej. nombre="Olimpiadas" + hero_title="Olimpiadas Matemáticas
--    Nacionales"). Si queda vacío, el frontend cae al `nombre`.
--
-- 2. `hero_footnote` — el pie del hero hoy hereda el de la categoría padre.
--    Esta columna permite personalizarlo por subcategoría. Si queda vacío,
--    el frontend cae al `hero_footnote` de la categoría.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

ALTER TABLE reconocimientos_subcategorias
  ADD COLUMN IF NOT EXISTS hero_title    text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_footnote text;
