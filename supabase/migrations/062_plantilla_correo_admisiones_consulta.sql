-- ============================================================
-- Migración 062 — Plantilla de correo: consulta de admisión por nivel
-- Sesión 40.
--
-- El formulario "Resolvemos tus dudas" de las páginas de admisión por
-- nivel (/admisiones/inicial, /egb-superior, etc., endpoint /api/admisiones)
-- ahora también envía un correo de CONFIRMACIÓN al usuario que lo llena
-- —antes solo enviaba la notificación interna al colegio—.
--
-- Esta migración agrega el nuevo tipo de plantilla `admisiones-consulta`
-- a `plantillas_correo_formularios`, editable desde
-- /admin/contenido/plantillas-formularios.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- 1. Ampliar el CHECK de `tipo` para admitir el nuevo tipo.
ALTER TABLE plantillas_correo_formularios
  DROP CONSTRAINT IF EXISTS plantillas_correo_formularios_tipo_check;
ALTER TABLE plantillas_correo_formularios
  ADD CONSTRAINT plantillas_correo_formularios_tipo_check
  CHECK (tipo IN (
    'contactos',
    'quejas',
    'trabaja',
    'admisiones-confirmacion',
    'admisiones-consulta'
  ));

-- 2. Seed de la plantilla (solo si no existe).
INSERT INTO plantillas_correo_formularios (tipo, titulo, asunto, cuerpo_html, activo)
SELECT
  'admisiones-consulta',
  'Recibimos tu consulta',
  'Recibimos tu consulta — Unidad Educativa Atenas',
  '<p>Hola <strong>{{representante}}</strong>,</p><p>Recibimos tu consulta sobre el nivel <strong>{{nivel}}</strong>. Nuestro equipo de admisiones te responderá en las próximas 24 a 48 horas hábiles.</p><p>Si tu consulta es urgente, también puedes llamarnos directamente.</p><p>Gracias por tu interés en la Unidad Educativa Atenas,<br/>Equipo de Admisiones</p>',
  true
WHERE NOT EXISTS (
  SELECT 1 FROM plantillas_correo_formularios WHERE tipo = 'admisiones-consulta'
);
