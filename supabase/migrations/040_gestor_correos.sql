-- ============================================================
-- Migración 040 — Gestor unificado de correos
-- Backoffice Atenas — sesión 32 (sprint mediano-grande)
--
-- Centraliza TODOS los envíos de correo del sitio (5 puntos:
-- 4 formularios + pipeline de admisiones) detrás de una sola capa
-- configurable desde el backoffice.
--
-- Agrega:
--
-- 1. `configuracion_global['correos']` — provider switch (Resend/SMTP)
--    + presets `{ fromEmail, fromName, notifyTo }` por cada uno de los
--    5 propósitos del sitio. Solo se ejecuta un provider a la vez
--    (el otro conserva sus datos pero no se usa).
--
-- 2. Tabla `plantillas_correo_formularios` — plantillas editables del
--    cuerpo del email de CONFIRMACIÓN que recibe el usuario que llenó
--    el formulario. 4 tipos: contactos, quejas, trabaja,
--    admisiones-confirmacion. Reutiliza el wrapper navy de admisiones
--    para consistencia visual.
--
-- IDEMPOTENTE: re-ejecutable.
-- ============================================================

-- ─── 1. Seed inicial de configuracion_global['correos'] ─────────
-- Solo siembra si la clave no existe. El cliente luego edita desde
-- /admin/configuracion/correos.
INSERT INTO configuracion_global (key, value, descripcion)
SELECT
  'correos',
  $$
  {
    "provider": "resend",
    "resend": {
      "apiKey": "",
      "defaultFrom": "noreply@atenas.edu.ec",
      "defaultFromName": "Unidad Educativa Atenas"
    },
    "smtp": {
      "host": "",
      "port": 587,
      "secure": false,
      "user": "",
      "pass": "",
      "defaultFrom": "noreply@atenas.edu.ec",
      "defaultFromName": "Unidad Educativa Atenas"
    },
    "presets": {
      "admisiones-pipeline": {
        "fromEmail": "admisiones@atenas.edu.ec",
        "fromName": "Admisiones Atenas",
        "notifyTo": ""
      },
      "admisiones-confirmacion": {
        "fromEmail": "admisiones@atenas.edu.ec",
        "fromName": "Admisiones Atenas",
        "notifyTo": "admisiones@atenas.edu.ec"
      },
      "quejas": {
        "fromEmail": "atenas@atenas.edu.ec",
        "fromName": "Unidad Educativa Atenas",
        "notifyTo": "secretaria@atenas.edu.ec"
      },
      "contactos": {
        "fromEmail": "atenas@atenas.edu.ec",
        "fromName": "Unidad Educativa Atenas",
        "notifyTo": "info@atenas.edu.ec"
      },
      "trabaja": {
        "fromEmail": "atenas@atenas.edu.ec",
        "fromName": "Unidad Educativa Atenas",
        "notifyTo": "rrhh@atenas.edu.ec"
      }
    }
  }
  $$::jsonb,
  'Configuración global del gestor de correos: provider activo + presets de emisor/destinatario por cada propósito del sitio (4 formularios + pipeline de admisiones).'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'correos'
);

-- ─── 2. Tabla plantillas_correo_formularios ─────────────────────
-- Plantillas editables para los emails de CONFIRMACIÓN que recibe el
-- usuario que llena un formulario público (quejas, contactos, trabaja,
-- admisiones-confirmacion). El email INTERNO que llega al admin del
-- colegio sigue siendo HTML hardcoded en código (solo notificación,
-- no necesita editor visual).
CREATE TABLE IF NOT EXISTS plantillas_correo_formularios (
  tipo        text PRIMARY KEY,
  titulo      text,
  asunto      text,
  cuerpo_html text,
  activo      boolean NOT NULL DEFAULT true,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES profiles(id) ON DELETE SET NULL
);

ALTER TABLE plantillas_correo_formularios
  DROP CONSTRAINT IF EXISTS plantillas_correo_formularios_tipo_check;
ALTER TABLE plantillas_correo_formularios
  ADD CONSTRAINT plantillas_correo_formularios_tipo_check
  CHECK (tipo IN (
    'contactos',
    'quejas',
    'trabaja',
    'admisiones-confirmacion'
  ));

ALTER TABLE plantillas_correo_formularios ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plantillas_correo_formularios_select" ON plantillas_correo_formularios;
CREATE POLICY "plantillas_correo_formularios_select"
  ON plantillas_correo_formularios FOR SELECT TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  );

DROP POLICY IF EXISTS "plantillas_correo_formularios_write" ON plantillas_correo_formularios;
CREATE POLICY "plantillas_correo_formularios_write"
  ON plantillas_correo_formularios FOR ALL TO authenticated
  USING (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  )
  WITH CHECK (
    user_has_role('superadmin')
    OR user_has_role('editor_admisiones')
    OR user_has_role('editor_comm')
  );

-- ─── 3. Seed plantillas de formularios (solo si no existen) ─────
INSERT INTO plantillas_correo_formularios (tipo, titulo, asunto, cuerpo_html, activo)
SELECT * FROM (VALUES
  (
    'contactos',
    'Recibimos tu mensaje',
    'Hemos recibido tu mensaje — Unidad Educativa Atenas',
    '<p>Hola <strong>{{nombre}}</strong>,</p><p>Recibimos tu mensaje y te responderemos en las próximas 24 a 48 horas hábiles.</p><p>Si tu consulta es urgente, llámanos al <strong>03-2854281</strong>.</p><p>Gracias por contactarnos,<br/>Unidad Educativa Atenas</p>',
    true
  ),
  (
    'quejas',
    'Recibimos tu solicitud',
    'Hemos recibido tu solicitud — Unidad Educativa Atenas',
    '<p>Hola <strong>{{nombre}}</strong>,</p><p>Hemos recibido tu <strong>{{tipo}}</strong>. La revisaremos y te responderemos a la brevedad posible.</p><p>Gracias por ayudarnos a mejorar,<br/>Unidad Educativa Atenas</p>',
    true
  ),
  (
    'trabaja',
    'Recibimos tu postulación',
    'Postulación recibida — Unidad Educativa Atenas',
    '<p>Hola <strong>{{nombre}}</strong>,</p><p>Recibimos tu hoja de vida para la posición de <strong>{{cargo}}</strong>. Nuestro equipo de Talento Humano revisará tu perfil y te contactaremos si tu candidatura avanza al siguiente paso.</p><p>Gracias por tu interés,<br/>Unidad Educativa Atenas</p>',
    true
  ),
  (
    'admisiones-confirmacion',
    'Tu solicitud de admisión está registrada',
    'Solicitud de admisión recibida — N° {{numero}}',
    '<p>Hola <strong>{{rep_nombres}}</strong>,</p><p>Recibimos la solicitud de admisión de <strong>{{est_nombres}} {{est_apellidos}}</strong> para el nivel <strong>{{est_nivel}}</strong>.</p><p>Tu número de seguimiento es: <strong>{{numero}}</strong></p><p>Puedes consultar el estado de tu solicitud en cualquier momento desde <a href="{{url_seguimiento}}">esta página</a>.</p><p>Nuestro equipo de admisiones revisará tu solicitud y te contactaremos pronto.</p><p>Gracias,<br/>Equipo de Admisiones Atenas</p>',
    true
  )
) AS data(tipo, titulo, asunto, cuerpo_html, activo)
WHERE NOT EXISTS (
  SELECT 1 FROM plantillas_correo_formularios WHERE tipo = data.tipo
);
