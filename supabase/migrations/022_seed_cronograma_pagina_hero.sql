-- ============================================================
-- Migración 022 — Seed de hero editable para /cronograma-anual
-- Backoffice Atenas — Fase 3 (sesión 27)
-- Requiere: 011_configuracion_global.sql + 021_cronograma_eventos.sql
--
-- Siembra una entrada en `configuracion_global` con la cabecera
-- (hero) de la página pública /cronograma-anual para que el cliente
-- pueda editarla desde /admin/contenido/cronograma/hero.
--
-- IDEMPOTENTE: solo inserta si la clave no existe.
-- ============================================================

INSERT INTO configuracion_global (key, value)
SELECT 'cronograma_pagina_hero',
       jsonb_build_object(
         'badge',     'UNIDAD EDUCATIVA ATENAS',
         'title',     'Cronograma Anual 2026 – 2027',
         'subtitle',  'Calendario del año lectivo Sierra con todas las fechas clave para estudiantes, familias y docentes.',
         'ghostText', 'CRONOGRAMA',
         'footnote',  '',
         'bgImageSrc', ''
       )
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'cronograma_pagina_hero'
);
