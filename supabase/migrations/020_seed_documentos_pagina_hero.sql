-- ============================================================
-- Migración 020 — Seed de hero editable para /documentos-institucionales
-- Backoffice Atenas — Fase 3 (sesión 27)
-- Requiere: 011_configuracion_global.sql + 019_documentos_descargables.sql
--
-- Siembra una entrada en `configuracion_global` con la cabecera
-- (hero) de la página pública /documentos-institucionales para que
-- el cliente pueda editarla desde /admin/contenido/documentos/hero.
--
-- IDEMPOTENTE: solo inserta si la clave no existe.
-- ============================================================

INSERT INTO configuracion_global (key, value)
SELECT 'documentos_pagina_hero',
       jsonb_build_object(
         'badge',     'DOCUMENTOS INSTITUCIONALES',
         'title',     'Documentos Institucionales',
         'subtitle',  'Resoluciones, contratos, políticas y formularios para familias y estudiantes de la Unidad Educativa Atenas.',
         'ghostText', 'DOCUMENTOS',
         'footnote',  '',
         'bgImageSrc', ''
       )
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'documentos_pagina_hero'
);
