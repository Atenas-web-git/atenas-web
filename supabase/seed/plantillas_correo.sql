-- ============================================================
-- Seed inicial — Plantillas de correo del pipeline de admisiones
-- Ejecutar UNA SOLA VEZ después de la migración 003.
--
-- ⚠️  ARQUITECTURA: el HTML del wrapper (header navy, número de
-- seguimiento, footer) está FIJO EN CÓDIGO en `email_wrapper.ts`.
-- Aquí solo se guarda lo editable:
--   - titulo       → texto del header navy
--   - asunto       → asunto del email
--   - cuerpo_html  → solo el mensaje (HTML rico, editable visualmente)
--
-- Variables disponibles dentro del cuerpo y el asunto:
--   {{numero}}            — N° de seguimiento (ATN-YYYY-XXXXXX)
--   {{est_nombres}}       — Nombres del estudiante
--   {{est_apellidos}}     — Apellidos del estudiante
--   {{est_nivel}}         — Nivel solicitado
--   {{rep_nombres}}       — Nombres del representante
--   {{url_seguimiento}}   — URL pública del seguimiento
--
-- Re-ejecutar este script SOBRESCRIBE las ediciones manuales del
-- backoffice. Solo úsalo para "resetear" todas las plantillas.
-- ============================================================

INSERT INTO plantillas_correo_admision (estado, titulo, asunto, cuerpo_html, activo)
VALUES
(
  'revisando',
  'Tu solicitud está en revisión',
  'Tu solicitud está siendo revisada — N° {{numero}}',
  '<p>Hola <strong>{{rep_nombres}}</strong>, hemos comenzado la revisión de la solicitud de <strong>{{est_nombres}}</strong> al nivel de <strong>{{est_nivel}}</strong>.</p><p>Pronto nuestro equipo se pondrá en contacto contigo para coordinar los siguientes pasos.</p>',
  true
),
(
  'entrevista_agendada',
  'Vamos a conocernos',
  'Tu entrevista ha sido agendada — N° {{numero}}',
  '<p>Hola <strong>{{rep_nombres}}</strong>, queremos invitarte a una entrevista personal con nuestro equipo para conocer mejor a <strong>{{est_nombres}}</strong> y a tu familia.</p><p>En las próximas horas te contactaremos para coordinar la fecha y hora más conveniente.</p>',
  true
),
(
  'lista_espera',
  'Tu solicitud está en lista de espera',
  'Tu solicitud está en lista de espera — N° {{numero}}',
  '<p>Hola <strong>{{rep_nombres}}</strong>, agradecemos tu interés en la Unidad Educativa Atenas.</p><p>En este momento los cupos para <strong>{{est_nivel}}</strong> están completos, por lo que tu solicitud quedará en lista de espera. Te notificaremos en cuanto se libere un cupo.</p>',
  true
),
(
  'aceptado',
  '¡Felicitaciones!',
  '¡Felicitaciones! Tu solicitud fue aceptada — N° {{numero}}',
  '<p>Hola <strong>{{rep_nombres}}</strong>, nos complace comunicarte que la solicitud de <strong>{{est_nombres}}</strong> al nivel de <strong>{{est_nivel}}</strong> ha sido <strong>aceptada</strong>.</p><p>Pronto te enviaremos los pasos para completar la matrícula.</p>',
  true
),
(
  'matriculado',
  '¡Bienvenido a la familia Atenas!',
  '¡Bienvenido a la familia Atenas! — N° {{numero}}',
  '<p>Hola <strong>{{rep_nombres}}</strong>, la matrícula de <strong>{{est_nombres}}</strong> al nivel de <strong>{{est_nivel}}</strong> ha sido completada con éxito.</p><p>Estamos emocionados de comenzar este camino contigo.</p>',
  true
),
(
  'rechazado',
  'Sobre tu solicitud',
  'Sobre tu solicitud de admisión — N° {{numero}}',
  '<p>Hola <strong>{{rep_nombres}}</strong>, agradecemos sinceramente tu interés en la Unidad Educativa Atenas.</p><p>Lamentablemente, en esta ocasión no nos es posible otorgar un cupo a <strong>{{est_nombres}}</strong>. Te animamos a postular nuevamente en futuras convocatorias.</p>',
  true
)
ON CONFLICT (estado) DO UPDATE SET
  titulo       = EXCLUDED.titulo,
  asunto       = EXCLUDED.asunto,
  cuerpo_html  = EXCLUDED.cuerpo_html,
  updated_at   = now();
