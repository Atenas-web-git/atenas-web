-- ============================================================
-- Migración 065 — Plantillas de correo del nuevo pipeline de admisiones
-- Sesión 41.
--
-- Borra las 6 plantillas de los estados ANTIGUOS y siembra 7 plantillas
-- para los nuevos estados (todos menos "interesado", cuya confirmación
-- la cubre el correo del formulario via `admisiones-confirmacion`).
--
-- Defaults de `activo`:
--   - 6 plantillas con activo=true.
--   - 'no_admitido' con activo=false (protocolo del colegio: comunicación
--     por llamada telefónica, no por correo).
--
-- El admin puede editar cada plantilla y togglear `activo` desde
-- /admin/admisiones/correos/[estado].
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- 1. Borrar plantillas de estados antiguos que ya no existen en el
-- pipeline nuevo. Hay que hacerlo ANTES de recrear el CHECK constraint,
-- porque PostgreSQL valida el nuevo constraint contra las filas
-- existentes — si quedan filas con estados viejos, el ALTER TABLE
-- falla con error 23514.
DELETE FROM plantillas_correo_admision
  WHERE estado IN (
    'pendiente',
    'revisando',
    'entrevista_agendada',
    'lista_espera',
    'aceptado',
    'rechazado'
  );

-- 2. Reemplazar el CHECK constraint de `estado` para aceptar los nuevos
-- estados del pipeline. El constraint fue definido en la migración 003
-- con los estados antiguos; sin este paso, cualquier INSERT con un
-- estado nuevo (p.ej. 'postulante') falla con error 23514.
ALTER TABLE plantillas_correo_admision
  DROP CONSTRAINT IF EXISTS plantillas_estado_check;

ALTER TABLE plantillas_correo_admision
  ADD CONSTRAINT plantillas_estado_check
  CHECK (estado IN (
    'postulante',
    'postulacion_completa',
    'en_evaluacion',
    'en_revision_comite',
    'admitido',
    'no_admitido',
    'matriculado'
  ));

-- 3. Sembrar las 7 plantillas nuevas (solo si no existen).
INSERT INTO plantillas_correo_admision
  (estado, titulo, asunto, cuerpo_html, activo, acento)
SELECT * FROM (VALUES
  (
    'postulante',
    'Te enviamos los requisitos para tu postulación',
    'Requisitos del proceso de admisión — Unidad Educativa Atenas',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Gracias por su interés en la Unidad Educativa Atenas. A continuación detallamos los requisitos para completar la postulación de <strong>{{est_nombres}} {{est_apellidos}}</strong> al nivel <strong>{{est_nivel}}</strong>.</p><p>(El colegio puede editar este texto desde el backoffice y agregar la lista de documentos requeridos.)</p><p>Quedamos atentos a la recepción de su documentación.</p><p>Saludos cordiales,<br/>Equipo de Admisiones</p>',
    true,
    'navy'
  ),
  (
    'postulacion_completa',
    'Hemos recibido toda tu documentación',
    'Documentación completa — Unidad Educativa Atenas',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Confirmamos la recepción de toda la documentación requerida para la postulación de <strong>{{est_nombres}} {{est_apellidos}}</strong>. La postulación está completa y habilitada para continuar.</p><p>El siguiente paso será coordinar la entrevista familiar y la evaluación del estudiante. Nuestro equipo se pondrá en contacto pronto para definir fecha y hora.</p><p>Saludos cordiales,<br/>Equipo de Admisiones</p>',
    true,
    'navy'
  ),
  (
    'en_evaluacion',
    'Estamos listos para continuar con tu proceso de admisión',
    'Estamos listos para continuar con tu proceso de admisión',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Nos complace informarles que hemos recibido y validado satisfactoriamente toda la documentación requerida para el proceso de admisión de su representado(a).</p><p>Como siguiente paso, procederemos a coordinar la entrevista familiar y la evaluación del estudiante aspirante. En las próximas horas, un miembro de nuestro equipo de Admisiones se pondrá en contacto con ustedes para definir la fecha y hora más conveniente.</p><p>Agradecemos la confianza depositada en nuestra institución y nos entusiasma seguir avanzando junto a ustedes en este importante proceso.</p><p><em>#atenasparatodalavida</em></p>',
    true,
    'red'
  ),
  (
    'en_revision_comite',
    'Tu expediente está en revisión por el Comité de Admisiones',
    'Expediente en Comité de Admisiones — Unidad Educativa Atenas',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Su expediente de admisión, tras la entrevista y evaluación, ha sido presentado al Comité de Admisiones para su análisis y resolución.</p><p>Les notificaremos el resultado dentro de las 48 horas posteriores a la sesión del Comité.</p><p>Gracias por su paciencia,<br/>Equipo de Admisiones</p>',
    true,
    'navy'
  ),
  (
    'admitido',
    '¡Felicitaciones! Tu solicitud fue admitida',
    'Admisión confirmada — Unidad Educativa Atenas',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Tenemos el agrado de informarles que la postulación de <strong>{{est_nombres}} {{est_apellidos}}</strong> al nivel <strong>{{est_nivel}}</strong> ha sido <strong>admitida</strong> por el Comité de Admisiones.</p><p>El siguiente paso es completar el proceso de matrícula. Nos comunicaremos a la brevedad para coordinar.</p><p>¡Bienvenidos a la familia Atenas!</p><p><em>#atenasparatodalavida</em></p>',
    true,
    'gold'
  ),
  (
    'no_admitido',
    'Resultado del proceso de admisión',
    'Resultado del proceso de admisión — Unidad Educativa Atenas',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Agradecemos su interés en la Unidad Educativa Atenas y el tiempo dedicado al proceso de admisión.</p><p>(Por protocolo del colegio, esta comunicación se realiza por llamada telefónica. Esta plantilla queda desactivada por defecto; el admin puede activarla si en algún caso prefiere notificar por correo.)</p>',
    false,
    'navy'
  ),
  (
    'matriculado',
    '¡Bienvenidos a la familia Atenas!',
    'Matrícula confirmada — Unidad Educativa Atenas',
    '<p>Estimada familia <strong>{{rep_nombres}}</strong>,</p><p>Confirmamos que la matrícula de <strong>{{est_nombres}} {{est_apellidos}}</strong> en el nivel <strong>{{est_nivel}}</strong> ha sido formalizada con éxito.</p><p>¡Les damos la más cordial bienvenida a la familia Atenas! Estamos felices de comenzar este camino con ustedes.</p><p><em>#atenasparatodalavida</em></p>',
    true,
    'gold'
  )
) AS data(estado, titulo, asunto, cuerpo_html, activo, acento)
WHERE NOT EXISTS (
  SELECT 1 FROM plantillas_correo_admision p WHERE p.estado = data.estado
);
