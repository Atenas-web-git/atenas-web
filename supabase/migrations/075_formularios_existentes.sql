-- ============================================================
-- Migración 075 — Los formularios que ya están en producción pasan al motor.
--
-- QUÉ HACE
--
--  1. Relaciona cada formulario con su plantilla de correo de confirmación,
--     las que se editan en Contenido › Plantillas de correo para formularios.
--     Hasta ahora esa relación existía solo en el código, dentro de un mapa
--     con cinco nombres fijos, y desde el panel no había forma de saber qué
--     plantilla corresponde a qué formulario.
--
--  2. Registra los tres formularios públicos que hoy están escritos a mano y
--     que NO guardan nada: contactos, quejas y consulta por nivel. A partir de
--     aquí sus respuestas quedan en la bandeja aunque el correo falle.
--
-- QUÉ **NO** HACE
--
--  · No toca la solicitud de admisión. Tiene pipeline de ocho estados,
--    contador ADM y correos por etapa; se gestiona en su propio módulo y solo
--    aparece listada en Formularios como referencia.
--  · No toca «Trabaja con nosotros»: se va a rehacer entera, y registrar ahora
--    los campos viejos solo obligaría a borrarlos después.
--
-- DE DÓNDE SALEN LOS TEXTOS
--
-- De la BASE, no del código. El formulario de quejas ya tenía textos propios
-- del colegio guardados en la página —cuatro tipos de comunicación en vez de
-- los tres del código, y sus propios mensajes de éxito—, y sembrar los valores
-- por defecto se los habría llevado por delante sin que nadie lo notara.
--
-- Contactos no tenía nada guardado, así que sus textos son los que hoy sirve
-- el código; se copian tal cual para que la página no cambie de aspecto.
--
-- IDEMPOTENTE: si el slug ya existe no se toca. Al reaplicarla no se pisan las
-- ediciones que el colegio haya hecho desde el panel.
-- ============================================================

BEGIN;

-- ─── Relación con las plantillas de correo ────────────────────
--
-- Guarda el mismo identificador que usa `plantillas_correo_formularios`
-- ('contactos', 'quejas', 'trabaja', 'admisiones-confirmacion',
-- 'admisiones-consulta'). Sin restricción de clave foránea a propósito: la
-- tabla de plantillas se indexa por tipo y no todas las filas existen siempre.

ALTER TABLE formularios ADD COLUMN IF NOT EXISTS plantilla_correo text;

COMMENT ON COLUMN formularios.plantilla_correo IS
  'Tipo de plantilla de correo de confirmación asociada, en plantillas_correo_formularios.';

-- ─── 1. Contactos ─────────────────────────────────────────────

INSERT INTO formularios (
  slug, nombre, descripcion_interna, titulo, subtitulo,
  texto_boton, titulo_exito, texto_exito,
  campos, notificar_a, asunto, preset_correo, plantilla_correo,
  campo_correo, confirmacion_activa, activo
)
SELECT
  'contactos',
  'Contactos',
  'Formulario de la página /contactos. Es el buzón general del colegio.',
  'Envíanos un mensaje',
  'Te responderemos en máximo 48 horas hábiles.',
  'Enviar mensaje',
  '¡Mensaje enviado!',
  'Gracias por contactarnos. Nuestro equipo te responderá pronto.',
  '[
    {"key":"nombre","tipo":"texto","etiqueta":"Nombre","obligatorio":true,"ancho":"medio","placeholder":"Tu nombre"},
    {"key":"correo","tipo":"correo","etiqueta":"Correo electrónico","obligatorio":true,"ancho":"medio","placeholder":"correo@ejemplo.com"},
    {"key":"asunto","tipo":"texto","etiqueta":"Asunto","obligatorio":true,"ancho":"completo","placeholder":"¿Sobre qué nos escribes?"},
    {"key":"mensaje","tipo":"texto_largo","etiqueta":"Mensaje","obligatorio":true,"ancho":"completo","placeholder":"Escribe tu mensaje"}
  ]'::jsonb,
  ARRAY['info@atenas.edu.ec'],
  'Nuevo mensaje de contacto — {nombre}',
  'contactos',
  'contactos',
  'correo',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM formularios WHERE slug = 'contactos');

-- ─── 2. Quejas y sugerencias ──────────────────────────────────
--
-- Los textos y las opciones se copian de lo que el colegio ya tiene guardado
-- en la página `servicios/quejas-sugerencias`; si por lo que sea faltara algo,
-- se cae al valor que hoy sirve el sitio.

INSERT INTO formularios (
  slug, nombre, descripcion_interna, titulo, subtitulo,
  texto_boton, titulo_exito, texto_exito,
  campos, notificar_a, asunto, preset_correo, plantilla_correo,
  campo_correo, confirmacion_activa, activo
)
SELECT
  'quejas-sugerencias',
  'Quejas y sugerencias',
  'Formulario de /servicios/quejas-sugerencias. Buzón de comunicaciones de la comunidad.',
  COALESCE(f->>'headerTitle', 'Envía tu comunicación'),
  COALESCE(f->>'headerSubtitle', 'Responderemos en un máximo de 5 días hábiles.'),
  COALESCE(f->>'submitText', 'Enviar comunicación'),
  COALESCE(f->>'successTitle', '¡Mensaje recibido!'),
  COALESCE(f->>'successText', 'Hemos recibido tu comunicación. Te responderemos al correo indicado.'),
  jsonb_build_array(
    jsonb_build_object('key','nombre','tipo','texto','etiqueta','Nombre','obligatorio',true,'ancho','medio'),
    jsonb_build_object('key','correo','tipo','correo','etiqueta','Correo electrónico','obligatorio',true,'ancho','medio'),
    jsonb_build_object(
      'key','tipo','tipo','seleccion_unica','etiqueta','Tipo de comunicación','obligatorio',true,'ancho','completo',
      'opciones', COALESCE(f->'tipos', '["Queja","Sugerencia","Reconocimiento"]'::jsonb)
    ),
    jsonb_build_object('key','descripcion','tipo','texto_largo','etiqueta','Descripción','obligatorio',true,'ancho','completo')
  ),
  ARRAY[COALESCE(NULLIF(f->>'destinatarioEmail',''), 'secretaria@atenas.edu.ec')],
  COALESCE(f->>'asuntoEmail', 'Nueva {tipo} — {nombre}'),
  'quejas',
  'quejas',
  'correo',
  true,
  true
FROM (
  SELECT COALESCE(contenido->'formulario', '{}'::jsonb) AS f
    FROM paginas
   WHERE slug = 'servicios/quejas-sugerencias'
   LIMIT 1
) AS origen
WHERE NOT EXISTS (SELECT 1 FROM formularios WHERE slug = 'quejas-sugerencias');

-- Si la página de quejas no existiera en `paginas`, el SELECT de arriba no
-- devuelve filas y no se inserta nada. Esta segunda pasada cubre ese caso con
-- los valores que hoy sirve el código.
INSERT INTO formularios (
  slug, nombre, descripcion_interna, titulo, subtitulo,
  texto_boton, titulo_exito, texto_exito,
  campos, notificar_a, asunto, preset_correo, plantilla_correo,
  campo_correo, confirmacion_activa, activo
)
SELECT
  'quejas-sugerencias',
  'Quejas y sugerencias',
  'Formulario de /servicios/quejas-sugerencias. Buzón de comunicaciones de la comunidad.',
  'Envía tu comunicación',
  'Responderemos en un máximo de 5 días hábiles.',
  'Enviar comunicación',
  '¡Mensaje recibido!',
  'Hemos recibido tu comunicación. Te responderemos al correo indicado.',
  '[
    {"key":"nombre","tipo":"texto","etiqueta":"Nombre","obligatorio":true,"ancho":"medio"},
    {"key":"correo","tipo":"correo","etiqueta":"Correo electrónico","obligatorio":true,"ancho":"medio"},
    {"key":"tipo","tipo":"seleccion_unica","etiqueta":"Tipo de comunicación","obligatorio":true,"ancho":"completo","opciones":["Queja","Sugerencia","Reconocimiento"]},
    {"key":"descripcion","tipo":"texto_largo","etiqueta":"Descripción","obligatorio":true,"ancho":"completo"}
  ]'::jsonb,
  ARRAY['secretaria@atenas.edu.ec'],
  'Nueva {tipo} — {nombre}',
  'quejas',
  'quejas',
  'correo',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM formularios WHERE slug = 'quejas-sugerencias');

-- ─── 3. Consulta por nivel ────────────────────────────────────
--
-- El mismo formulario aparece en las cuatro páginas de nivel
-- (/admisiones/inicial, egb-elemental-media, egb-superior, ib). Es uno solo y
-- no cuatro porque el nivel lo elige quien escribe, no la página.

INSERT INTO formularios (
  slug, nombre, descripcion_interna, titulo, subtitulo,
  texto_boton, titulo_exito, texto_exito,
  campos, notificar_a, asunto, preset_correo, plantilla_correo,
  campo_correo, confirmacion_activa, activo
)
SELECT
  'consulta-admisiones',
  'Consulta de admisiones',
  'Formulario de contacto de las páginas de nivel (/admisiones/inicial, egb-elemental-media, egb-superior, ib). No es la solicitud de admisión: es una consulta previa.',
  'Conversemos sobre el ingreso',
  'Déjanos tus datos y el equipo de admisiones te contacta.',
  'Enviar consulta',
  '¡Consulta enviada!',
  'Gracias por tu interés. El equipo de admisiones se pondrá en contacto contigo muy pronto.',
  '[
    {"key":"representante","tipo":"texto","etiqueta":"Nombre del representante","obligatorio":true,"ancho":"medio","placeholder":"Tu nombre completo"},
    {"key":"estudiante","tipo":"texto","etiqueta":"Nombre del estudiante","obligatorio":true,"ancho":"medio","placeholder":"Nombre del hijo/a"},
    {"key":"correo","tipo":"correo","etiqueta":"Correo electrónico","obligatorio":true,"ancho":"medio","placeholder":"correo@ejemplo.com"},
    {"key":"telefono","tipo":"telefono","etiqueta":"WhatsApp / Teléfono","obligatorio":true,"ancho":"medio","placeholder":"+593 99 000 0000"},
    {"key":"nivel","tipo":"seleccion_unica","etiqueta":"Nivel de interés","obligatorio":true,"ancho":"completo","opciones":["Educación Inicial","EGB Elemental y Media","EGB Superior","Bachillerato IB"]},
    {"key":"mensaje","tipo":"texto_largo","etiqueta":"Mensaje","obligatorio":false,"ancho":"completo","placeholder":"¿Tienes alguna duda o comentario para nuestro equipo?"}
  ]'::jsonb,
  ARRAY['admisiones@atenas.edu.ec'],
  'Nueva consulta de admisión — {representante} ({nivel})',
  'admisiones-confirmacion',
  'admisiones-consulta',
  'correo',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM formularios WHERE slug = 'consulta-admisiones');

COMMIT;
