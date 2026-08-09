-- ============================================================
-- Migración 077 — Formulario de postulación de empleo.
--
-- Réplica del Google Forms que el colegio usa hoy («Postulación - Proceso de
-- Selección U.E Atenas»), campo por campo y con sus mismos textos de ayuda.
--
-- UN SOLO FORMULARIO PARA TODAS LAS VACANTES
--
-- Es como lo hacen hoy: «Cargo al que Aplica» es una pregunta abierta y la
-- misma encuesta sirve para autoridad académica, docentes de inglés y el resto.
-- Se mantiene así para no cambiarles el proceso.
--
-- La diferencia es que aquí el cargo llega YA PUESTO con el título de la
-- vacante desde la que se postula. Hoy lo escribe el postulante a mano, y un
-- cargo mal escrito o en blanco es una postulación que después no se puede
-- clasificar.
--
-- SOBRE EL AUDIO Y EL TAMAÑO
--
-- El formulario de Google admite 10 MB de hoja de vida y 100 MB de audio. Aquí
-- el techo son 4 MB por archivo, porque Vercel corta el cuerpo de la petición
-- en 4,5 MB — ver el comentario de MAX_MB_ARCHIVO en src/lib/formularios/tipos.
-- Los textos de ayuda de este formulario lo dicen, para no prometer algo que
-- va a fallar. Subir archivos grandes exige subida directa a Storage, que está
-- pendiente.
--
-- IDEMPOTENTE: si el slug ya existe no se toca.
-- ============================================================

BEGIN;

INSERT INTO formularios (
  slug, nombre, descripcion_interna, titulo, subtitulo,
  texto_boton, titulo_exito, texto_exito, aviso_legal,
  campos, notificar_a, asunto, preset_correo, plantilla_correo,
  campo_correo, confirmacion_activa, confirmacion_asunto, confirmacion_cuerpo,
  activo
)
SELECT
  'postulacion-empleo',
  'Postulación de empleo',
  'Réplica del Google Forms de talento humano. Lo usan TODAS las vacantes: el cargo llega puesto desde la vacante en la que se postula.',
  'Postulación — Proceso de selección',
  'Agradecemos tu tiempo e interés en formar parte de este maravilloso equipo. Llena los campos para activar tu postulación.',
  'Enviar postulación',
  '¡Postulación recibida!',
  'Gracias por tu interés en formar parte de la Unidad Educativa Atenas. Nuestro equipo de talento humano revisará tu información y te contactará si tu perfil avanza en el proceso.',
  'En cumplimiento con la Ley Orgánica de Protección de Datos Personales, los datos proporcionados mediante este formulario serán tratados por la Unidad Educativa Atenas exclusivamente para la participación en el proceso de selección de personal; se tratarán con confidencialidad y no serán cedidos a terceros. Puedes ejercer tus derechos de acceso, rectificación, eliminación y oposición escribiendo a protecciondatos@atenas.edu.ec.',
  '[
    {
      "key":"correo","tipo":"correo","etiqueta":"Correo electrónico","obligatorio":true,"ancho":"medio",
      "placeholder":"tu@correo.com"
    },
    {
      "key":"nombres","tipo":"texto","etiqueta":"Apellidos y nombres completos","obligatorio":true,"ancho":"medio"
    },
    {
      "key":"cargo","tipo":"texto","etiqueta":"Cargo al que aplica","obligatorio":true,"ancho":"medio",
      "ayuda":"Si llegaste desde una vacante, ya viene puesto."
    },
    {
      "key":"telefono","tipo":"telefono","etiqueta":"Teléfono celular de contacto","obligatorio":true,"ancho":"medio"
    },
    {
      "key":"hoja_de_vida","tipo":"archivo","etiqueta":"Hoja de vida","obligatorio":true,"ancho":"completo",
      "ayuda":"Sube tu hoja de vida sin certificados ni documentos de identificación personal. PDF o Word, máximo 4 MB.",
      "acepta":[".pdf",".doc",".docx"],"maxMb":4
    },
    {
      "key":"aspiracion_salarial","tipo":"texto","etiqueta":"Aspiración salarial","obligatorio":true,"ancho":"medio",
      "ayuda":"Puede ser un valor o un rango."
    },
    {
      "key":"disponibilidad","tipo":"seleccion_unica","etiqueta":"Disponibilidad","obligatorio":true,"ancho":"medio",
      "ayuda":"Con qué disponibilidad podrías integrarte al equipo.",
      "opciones":["Inmediata","De 15 días","De 30 días","Más de 30 días"]
    },
    {
      "key":"discapacidad","tipo":"seleccion_unica","etiqueta":"¿Eres una persona con discapacidad o sustituto de una persona con discapacidad?","obligatorio":true,"ancho":"completo",
      "opciones":["Sí","No"]
    },
    {
      "key":"residencia","tipo":"seleccion_unica","etiqueta":"¿Resides en Ambato o tienes posibilidad de movilizarte o residir en Ambato?","obligatorio":true,"ancho":"completo",
      "opciones":[
        "Sí, resido en Ambato",
        "No resido en Ambato, pero tengo disponibilidad de movilizarme a la ciudad todos los días",
        "No resido en Ambato, pero tengo disposición de cambiar mi residencia a Ambato",
        "No resido en Ambato y no tengo posibilidades de movilización o reubicación"
      ]
    },
    {
      "key":"audio_presentacion","tipo":"archivo","etiqueta":"Audio de presentación","obligatorio":false,"ancho":"completo",
      "ayuda":"Solo si la vacante lo pide (aplica a vacantes de idiomas). Audio de máximo 4 MB — un MP3 de voz a 64 kbps da para unos 8 minutos.",
      "acepta":[".mp3",".m4a",".ogg",".wav"],"maxMb":4
    },
    {
      "key":"acepta_datos","tipo":"aceptacion","etiqueta":"He leído y acepto que la Unidad Educativa Atenas almacene y trate mis datos personales","obligatorio":true,"ancho":"completo"
    },
    {
      "key":"acepta_informacion","tipo":"aceptacion","etiqueta":"Acepto recibir información sobre el proceso de selección","obligatorio":false,"ancho":"completo",
      "ayuda":"Es opcional: puedes postular sin marcarla."
    }
  ]'::jsonb,
  ARRAY['gestionhumana@atenas.edu.ec'],
  'Nueva postulación — {nombres} ({cargo})',
  'trabaja',
  'trabaja',
  'correo',
  true,
  'Recibimos tu postulación',
  E'Gracias por tu interés en formar parte de la Unidad Educativa Atenas.\n\nHemos recibido tu postulación y el equipo de talento humano la revisará. Si tu perfil avanza en el proceso, nos pondremos en contacto contigo.\n\nSi tienes dudas puedes escribirnos a gestionhumana@atenas.edu.ec.',
  true
WHERE NOT EXISTS (SELECT 1 FROM formularios WHERE slug = 'postulacion-empleo');

-- El buzón de talento humano. Hoy el preset «trabaja» apunta a rrhh@, pero el
-- correo de contacto que el colegio publica en su propio sitio de vacantes es
-- gestionhumana@. Se deja el remitente como está y el destinatario lo fija el
-- formulario, que es donde manda desde la migración 075.

COMMIT;
