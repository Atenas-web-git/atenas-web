-- ============================================================
-- Migración 071 — Crear la página /privacidad.
--
-- PROBLEMA: los formularios de admisión de los cuatro niveles enlazan a
-- `/privacidad` y esa página NO EXISTE — da 404. Es decir: se piden datos
-- personales de menores y, cuando la familia intenta leer qué se hace con
-- ellos, encuentra una página de error.
--
-- Detectado en la auditoría de enlaces del 2026-08-04.
--
-- Se crea con la plantilla S (documento de política), la misma de
-- /politicas/clientes, /politicas/proveedores, /politicas/calidad y
-- /politicas/seguridad, así que queda editable desde el panel como cualquier
-- otra y con la misma presentación.
--
-- EL TEXTO DESCRIBE LO QUE EL SITIO HACE DE VERDAD, contrastado con el código:
--   • los campos exactos de cada formulario, incluidos los sensibles del de
--     empleo (identificación, fecha de nacimiento, género y discapacidad);
--   • el registro técnico seudonimizado de la migración 069, con su retención
--     real —máximo 2 horas, purga oportunista, no un cron—;
--   • las herramientas de analítica y el chatbot, que el panel puede activar
--     en cualquier momento desde Configuración › Integraciones.
--
-- El responsable declarado es la **Fundación Cultural y Educativa Ambato**,
-- con el canal `protecciondatos@atenas.edu.ec`, para NO contradecir a las
-- políticas ya publicadas por la migración 048. Que dos páginas del mismo
-- sitio den respuestas distintas a «quién responde por mis datos» sería peor
-- que no tener ninguna.
--
-- ⚠️ Lo que esta migración NO puede hacer es dar por buena su validez legal.
-- El colegio debe revisarla con su asesoría antes de darla por definitiva,
-- sobre todo los plazos de conservación, que aquí quedan indicados en
-- términos generales y hay que concretar.
--
-- IDEMPOTENTE: no hace nada si la página ya existe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, meta_title, meta_description, publicada, contenido)
SELECT
  'privacidad',
  'tpl_s_documento_politica',
  'Política de Privacidad y Protección de Datos',
  'Política de Privacidad — Unidad Educativa Atenas',
  'Cómo la Unidad Educativa Atenas recoge, usa y protege los datos personales de las familias que usan este sitio web.',
  true,
  jsonb_build_object(
    'hero', jsonb_build_object(
      'badge', 'PROTECCIÓN DE DATOS',
      'title', 'Política de Privacidad',
      'subtitle', 'Cómo tratamos la información que nos confías al usar este sitio.',
      'ghostText', 'PRIVACIDAD',
      'footnote', ''
    ),
    'meta', jsonb_build_object(
      'versionLabel', 'Versión 1.0',
      'audiencia', 'Familias y visitantes del sitio web',
      'fechaVigencia', 'Vigente desde agosto de 2026'
    ),
    'tituloDocumento', 'Tratamiento de datos personales en el sitio web del Atenas',
    'secciones', jsonb_build_array(
      jsonb_build_object('numero','1','titulo','Quién es responsable de tus datos','cuerpoHtml',
        '<p>La <strong>Fundación Cultural y Educativa Ambato</strong>, RUC 1890050863001, con domicilio en Calle Gabriel Román s/n y Av. Pedro Vásconez Yacupamba, Izamba, Ambato (Ecuador), es responsable del tratamiento de los datos personales que se recogen a través de este sitio web, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.</p><p>Para cualquier asunto relacionado con tus datos, escribe a <strong>protecciondatos@atenas.edu.ec</strong> o llama al <strong>03 2854281</strong>, extensión 111.</p>'),
      jsonb_build_object('numero','2','titulo','Qué datos recogemos y en qué momento','cuerpoHtml',
        '<p>Solo recogemos datos cuando tú los envías a través de uno de nuestros formularios.</p><ul><li><strong>Solicitud de admisión:</strong> nombres, apellidos, <strong>fecha de nacimiento</strong> y nivel educativo del estudiante, institución de origen, y nombres, apellidos, correo, teléfono y relación del representante.</li><li><strong>Formulario de contacto:</strong> nombre, correo, asunto y mensaje.</li><li><strong>Quejas y sugerencias:</strong> los datos que decidas incluir en tu mensaje.</li><li><strong>Trabaja con nosotros:</strong> nombres, correo, <strong>número de identificación</strong>, <strong>fecha de nacimiento</strong>, <strong>género</strong>, <strong>condición de discapacidad</strong>, cargo al que aplicas, formación, área, certificación de idioma, disponibilidad, expectativa salarial y el enlace a tu hoja de vida.</li></ul><p>La información sobre <strong>condición de discapacidad</strong> es un dato sensible: se solicita únicamente para cumplir con la normativa laboral ecuatoriana de inclusión, es de entrega voluntaria, y no se usa para ningún otro fin.</p>'),
      jsonb_build_object('numero','3','titulo','Para qué usamos esos datos','cuerpoHtml',
        '<p>Únicamente para el fin por el que nos los diste:</p><ul><li>Gestionar el proceso de admisión y comunicarte en qué etapa está tu solicitud.</li><li>Responder a tus consultas, quejas o sugerencias.</li><li>Evaluar tu postulación si aplicas a una vacante laboral.</li></ul><p><strong>No vendemos tus datos ni los cedemos a terceros con fines comerciales.</strong></p>'),
      jsonb_build_object('numero','4','titulo','Niñas, niños y adolescentes','cuerpoHtml',
        '<p>El formulario de admisión recoge datos de menores de edad. Esos datos <strong>solo los proporciona su representante legal</strong>, que es quien completa la solicitud, y se usan exclusivamente para el proceso de admisión.</p><p>La consulta pública del estado de una solicitud exige <strong>dos datos a la vez</strong> —el número de solicitud y el correo del representante— precisamente para que nadie ajeno a la familia pueda acceder a la información del estudiante.</p>'),
      jsonb_build_object('numero','5','titulo','Quién puede ver tu información','cuerpoHtml',
        '<p>Dentro de la institución, solo el personal autorizado del área correspondiente: admisiones, secretaría o el departamento que deba atender tu caso. El acceso al sistema de gestión está protegido con usuario y contraseña, y cada persona ve únicamente lo que su rol le permite.</p><p>Para funcionar, el sitio se apoya en proveedores tecnológicos que alojan la información y envían los correos de notificación. Esos proveedores tratan los datos por cuenta de la institución y no pueden usarlos para otros fines.</p>'),
      jsonb_build_object('numero','6','titulo','Cuánto tiempo conservamos tus datos','cuerpoHtml',
        '<p>Las solicitudes de admisión se conservan mientras dure el proceso y, después, durante el tiempo que exige la normativa educativa aplicable.</p><p>Los mensajes de contacto y las postulaciones laborales se conservan el tiempo necesario para atenderlos.</p><p>Puedes pedirnos en cualquier momento que eliminemos tus datos, salvo que debamos conservarlos por una obligación legal.</p>'),
      jsonb_build_object('numero','7','titulo','Registros técnicos de seguridad','cuerpoHtml',
        '<p>Cuando alguien consulta el estado de una solicitud, el sistema guarda un <strong>identificador técnico seudonimizado</strong> derivado de la conexión desde la que se hace la consulta. No se guarda la dirección de conexión en claro.</p><p>Sirve para un único fin: impedir que alguien intente adivinar datos probando combinaciones una y otra vez. <strong>Estos registros se conservan como máximo 2 horas</strong> y se eliminan de forma periódica. No se usan para identificar a nadie ni para ningún otro propósito.</p>'),
      jsonb_build_object('numero','8','titulo','Herramientas de terceros','cuerpoHtml',
        '<p>Este sitio puede utilizar herramientas de medición de audiencia —como Google Analytics o píxeles de redes sociales— para entender cómo se navega por él y mejorar su contenido. Cuando están activas, esas herramientas instalan cookies en tu navegador y pueden usarse para mostrarte publicidad de la institución en otras plataformas. Puedes bloquearlas desde la configuración de tu navegador.</p><p>El sitio ofrece además un <strong>asistente virtual</strong>. Si lo usas, el texto que escribas se envía a un proveedor externo de inteligencia artificial para poder generar la respuesta. No escribas ahí información que no quieras compartir: para trámites usa los formularios o los canales de contacto.</p>'),
      jsonb_build_object('numero','9','titulo','Tus derechos','cuerpoHtml',
        '<p>En cualquier momento puedes pedirnos:</p><ul><li><strong>Acceder</strong> a los datos que tenemos sobre ti o sobre tu representado.</li><li><strong>Corregirlos</strong> si están equivocados o incompletos.</li><li><strong>Eliminarlos</strong>, cuando no exista una obligación legal de conservarlos.</li><li><strong>Oponerte</strong> a un tratamiento concreto o retirar tu consentimiento.</li></ul><p>Para ejercerlos, escribe a <strong>protecciondatos@atenas.edu.ec</strong> indicando qué necesitas. Te responderemos en el plazo que establece la normativa vigente.</p>'),
      jsonb_build_object('numero','10','titulo','Cambios en esta política','cuerpoHtml',
        '<p>Si cambia la forma en que tratamos los datos, actualizaremos esta página y su fecha de vigencia. Te recomendamos revisarla cuando vayas a enviarnos información.</p>')
    ),
    'ctaPie', jsonb_build_object(
      'titulo', '¿Tienes dudas sobre tus datos?',
      'descripcion', 'Escríbenos a protecciondatos@atenas.edu.ec y te explicamos qué información tenemos y cómo la tratamos.',
      'ctaLabel', 'Contactar a la institución',
      'ctaHref', '/contactos'
    )
  )
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE lower(slug) = 'privacidad');
