-- ============================================================
-- Migración 048 — Migrar páginas /politicas, /politicas/clientes,
-- /politicas/proveedores y /portal-familiar a plantillas CMS.
--
-- Cambios:
--
-- 1. Extender CHECK constraint con `tpl_s_documento_politica` y
--    `tpl_t_portal_accesos`.
--
-- 2. Crear 4 filas en `paginas`:
--    - `politicas`              → plantilla B (landing con 2 cards a
--                                  /politicas/clientes y /politicas/proveedores)
--    - `politicas/clientes`     → plantilla S (12 secciones del documento de
--                                  Política de Privacidad para Clientes y Familias)
--    - `politicas/proveedores`  → plantilla S (12 secciones del documento de
--                                  Política de Privacidad para Proveedores)
--    - `portal-familiar`        → plantilla T (2 cards: Seguimiento de Admisión
--                                  + Plataforma Idukay)
--
-- IDEMPOTENTE: re-ejecutable. Si la fila ya existe NO se sobrescribe.
-- ============================================================

-- ─── 1. Ampliar CHECK constraint ───────────────────────────────────
ALTER TABLE paginas DROP CONSTRAINT IF EXISTS paginas_plantilla_check;
ALTER TABLE paginas
  ADD CONSTRAINT paginas_plantilla_check
  CHECK (plantilla IN (
    'tpl_a_hero_texto',
    'tpl_b_hero_grid',
    'tpl_c_hero_pasos',
    'tpl_d_hero_detalle',
    'tpl_e_hero_galeria',
    'tpl_f_hero_academico',
    'tpl_g_landing_ib',
    'tpl_h_landing_niveles',
    'tpl_i_historia',
    'tpl_j_landing_matriculas',
    'tpl_k_ficha_servicio',
    'tpl_l_ficha_espacio',
    'tpl_m_home',
    'tpl_n_trabaja',
    'tpl_o_admision_nivel',
    'tpl_p_admisiones_landing',
    'tpl_q_contactos_pagina',
    'tpl_s_documento_politica',
    'tpl_t_portal_accesos'
  ));

-- ─── 2a. /politicas — landing (plantilla B) ───────────────────────
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'politicas',
  'tpl_b_hero_grid',
  'Política de Privacidad — Landing',
  $${
    "hero": {
      "badge": "UNIDAD EDUCATIVA ATENAS",
      "title": "Políticas Institucionales",
      "subtitle": "Transparencia en el tratamiento de datos personales de nuestra comunidad educativa, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
      "ghostText": "POLÍTICAS"
    },
    "seccion": {
      "badge": "Protección de Datos",
      "heading": "Políticas de Privacidad",
      "description": "Conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP), la Fundación Cultural y Educativa Ambato informa el tratamiento de datos según la audiencia.",
      "items": [
        {
          "icon": "shield-check",
          "title": "Política para Clientes y Familias",
          "subtitle": "REVGER-DOG-007 · Versión 1.0",
          "description": "Tratamiento de datos personales de estudiantes y representantes legales en el marco de la prestación de servicios educativos de la Unidad Educativa Atenas.",
          "href": "/politicas/clientes",
          "color": "gold",
          "ctaText": "Ver Política de Privacidad"
        },
        {
          "icon": "building-2",
          "title": "Política para Proveedores",
          "subtitle": "REVGER-DOG-008 · Versión 1.0",
          "description": "Tratamiento de datos personales de representantes y contactos de las empresas proveedoras de bienes y servicios de la institución.",
          "href": "/politicas/proveedores",
          "color": "gold",
          "ctaText": "Ver Política de Privacidad"
        }
      ]
    }
  }$$::jsonb,
  'Política de Privacidad — Unidad Educativa Atenas',
  'Información sobre el tratamiento de datos personales de la Fundación Cultural y Educativa Ambato, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.',
  true
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'politicas');

-- ─── 2b. /politicas/clientes — documento de política (plantilla S) ─
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'politicas/clientes',
  'tpl_s_documento_politica',
  'Política de Privacidad — Clientes y Familias',
  $${
    "hero": {
      "badge": "POLÍTICA DE PRIVACIDAD",
      "title": "Para Clientes y Familias",
      "subtitle": "Versión 1.0 · Vigente desde el 30 de septiembre de 2024",
      "ghostText": "PRIVACIDAD",
      "bgImageSrc": ""
    },
    "meta": {
      "versionLabel": "Versión 1.0",
      "audiencia": "Clientes y Familias",
      "fechaVigencia": "Vigente desde el 30 de septiembre de 2024"
    },
    "tituloDocumento": "Política de Privacidad para Clientes y Familias",
    "secciones": [
      {
        "numero": "1",
        "titulo": "Responsable del Tratamiento",
        "cuerpoHtml": "<p>El responsable del tratamiento de sus datos personales es la <strong>Fundación Cultural y Educativa Ambato</strong>, con RUC 1890050863001, con domicilio en calle Gabriel Román y Av. Pedro Vásconez, Izamba, Ambato, Ecuador.</p><p>Para consultas relativas a protección de datos puede contactarnos en: <strong>protecciondatos@atenas.edu.ec</strong> · Teléfono: +593 2854281 ext. 111.</p>"
      },
      {
        "numero": "2",
        "titulo": "Finalidad del Tratamiento y Datos Personales Tratados",
        "cuerpoHtml": "<p>La Fundación trata datos personales de sus clientes (estudiantes, representantes legales y familias) para las siguientes finalidades:</p><ul><li>Admisiones y matrícula: datos de identificación, historial académico previo y documentos personales requeridos por el Ministerio de Educación.</li><li>Gestión académica: seguimiento de calificaciones, asistencia, actividades extracurriculares y expedientes académicos.</li><li>Comunicación institucional: notificaciones, circulares, convocatorias a eventos y comunicados oficiales.</li><li>Cobro de pensiones y matrículas: datos bancarios y comprobantes de pago para la gestión financiera.</li><li>Acceso a plataformas educativas: habilitación de cuentas en Aleks, eLibro, Biblioteca Virtual, Idukay y Google Workspace for Education.</li><li>Participación en programas externos: olimpiadas académicas, intercambios, competencias deportivas y eventos culturales.</li><li>Bachillerato Internacional (IB): gestión de exámenes, acreditación y registro ante la IB Organization.</li></ul>"
      },
      {
        "numero": "3",
        "titulo": "Legitimación del Tratamiento",
        "cuerpoHtml": "<p>La legitimación para el tratamiento de sus datos personales se basa en:</p><ul><li>El consentimiento expreso del titular o de su representante legal (en el caso de menores de edad).</li><li>La ejecución del contrato de prestación de servicios educativos suscrito con la institución.</li><li>El cumplimiento de obligaciones legales establecidas por la Ley Orgánica de Educación Intercultural (LOEI), la LOPDP y la normativa del MINEDUC.</li><li>El interés legítimo de la Fundación para garantizar la seguridad y el correcto funcionamiento del entorno educativo.</li></ul>"
      },
      {
        "numero": "4",
        "titulo": "Destinatarios de los Datos",
        "cuerpoHtml": "<p>Los datos personales podrán ser compartidos, exclusivamente en la medida necesaria, con:</p><ul><li>Personal docente y administrativo interno de la institución para el desempeño de sus funciones.</li><li>Organismos de control y autoridades competentes (MINEDUC, SNIDE, entidades de salud) cuando la ley así lo exija.</li><li>Proveedores de servicios tecnológicos que actúan como encargados del tratamiento bajo acuerdos de confidencialidad y seguridad (plataformas educativas, sistemas de gestión académica).</li><li>IB Organization, para la gestión del Programa del Diploma Internacional, conforme al contrato de centro autorizado.</li></ul><p>En ningún caso se cederán datos a terceros con fines comerciales sin el consentimiento previo del titular.</p>"
      },
      {
        "numero": "5",
        "titulo": "Transferencias Internacionales de Datos",
        "cuerpoHtml": "<p>En el marco del Programa del Diploma del Bachillerato Internacional, determinados datos de rendimiento académico pueden ser transferidos a la IB Organization, con sede en Ginebra, Suiza. Esta transferencia se realiza en cumplimiento de los requerimientos del programa IB y con el consentimiento previo informado del titular o su representante legal.</p><p>Ninguna otra transferencia internacional de datos se realizará sin consentimiento explícito del titular o sin una base legal que lo justifique.</p>"
      },
      {
        "numero": "6",
        "titulo": "Período de Retención de los Datos",
        "cuerpoHtml": "<p>Los datos personales serán conservados durante el tiempo necesario para cumplir con las finalidades para las que fueron recopilados:</p><ul><li>Durante toda la vigencia de la relación educativa con la institución.</li><li>Por un período mínimo de 7 años contados desde la finalización de la relación, para atender posibles reclamaciones y cumplir obligaciones legales.</li><li>Los expedientes académicos serán conservados de forma permanente conforme a la normativa del MINEDUC.</li></ul><p>Una vez cumplidos los plazos de retención, los datos serán eliminados o anonimizados de forma segura.</p>"
      },
      {
        "numero": "7",
        "titulo": "Derechos del Titular y Proceso para Ejercerlos",
        "cuerpoHtml": "<p>De conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP), el titular o su representante legal tiene derecho a:</p><ul><li>Acceso: conocer qué datos personales trata la Fundación y con qué finalidad.</li><li>Rectificación: solicitar la corrección de datos inexactos o incompletos.</li><li>Cancelación o Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios para la finalidad para la que fueron recopilados.</li><li>Oposición: oponerse al tratamiento de sus datos en las circunstancias previstas por la ley.</li><li>Portabilidad: recibir sus datos en un formato estructurado, de uso común y lectura mecánica.</li><li>Limitación del tratamiento: solicitar que se restrinja el tratamiento de sus datos en los casos que la ley prevé.</li><li>No ser sujeto de decisiones automatizadas que produzcan efectos jurídicos significativos.</li></ul><p>Para ejercer cualquiera de estos derechos, el titular o su representante legal deberá enviar una solicitud escrita a <strong>protecciondatos@atenas.edu.ec</strong>, indicando el derecho que desea ejercer y adjuntando copia de su cédula de identidad. Para datos de menores se deberá acreditar la condición de representante legal.</p><p>La Fundación responderá en un plazo máximo de 15 días hábiles desde la recepción de la solicitud completa.</p>"
      },
      {
        "numero": "8",
        "titulo": "Uso de Cookies",
        "cuerpoHtml": "<p>El sitio web institucional (atenas.edu.ec) puede utilizar cookies y tecnologías similares con las siguientes finalidades:</p><ul><li>Cookies técnicas o necesarias: permiten el funcionamiento básico del sitio (gestión de sesión, preferencias de accesibilidad).</li><li>Cookies de análisis: recopilan información estadística anónima para mejorar el rendimiento y la experiencia del sitio.</li><li>Cookies de preferencias: recuerdan las configuraciones seleccionadas por el usuario entre visitas.</li></ul><p>El usuario puede configurar su navegador para rechazar todas las cookies o para recibir un aviso previo a su instalación. La desactivación de cookies técnicas puede afectar el correcto funcionamiento del sitio.</p>"
      },
      {
        "numero": "9",
        "titulo": "Seguridad de los Datos",
        "cuerpoHtml": "<p>La Fundación ha implementado medidas técnicas y organizativas para garantizar la confidencialidad, integridad y disponibilidad de los datos personales:</p><ul><li>Control de acceso basado en roles para los sistemas de información internos.</li><li>Cifrado de datos en tránsito mediante protocolos SSL/TLS.</li><li>Copias de seguridad periódicas y planes de recuperación ante incidentes.</li><li>Formación continua del personal en materia de protección de datos.</li><li>Procedimientos de detección y notificación de brechas de seguridad.</li></ul><p>En caso de producirse una brecha de seguridad que pueda afectar los derechos de los titulares, la Fundación notificará a la autoridad competente y, cuando corresponda, a los propios titulares, en los plazos establecidos por la LOPDP.</p>"
      },
      {
        "numero": "10",
        "titulo": "Menores de Edad",
        "cuerpoHtml": "<p>La Fundación trata datos de menores de edad en el marco exclusivo de la prestación de servicios educativos. Este tratamiento requiere el consentimiento expreso del padre, madre o representante legal.</p><p>Los representantes legales pueden, en cualquier momento, acceder a los datos del menor bajo su tutela, solicitar su rectificación y, cuando proceda legalmente, su supresión. Para ejercer estos derechos deberán acreditar su condición mediante la documentación correspondiente (partida de nacimiento o resolución judicial de tutela).</p>"
      },
      {
        "numero": "11",
        "titulo": "Contacto del Responsable de Protección de Datos",
        "cuerpoHtml": "<p>Para cualquier consulta, solicitud o reclamación relacionada con el tratamiento de sus datos personales:</p><ul><li>Correo electrónico: protecciondatos@atenas.edu.ec</li><li>Teléfono: +593 2854281 ext. 111</li><li>Dirección: Calle Gabriel Román y Av. Pedro Vásconez, Izamba, Ambato, Ecuador</li></ul>"
      },
      {
        "numero": "12",
        "titulo": "Vigencia y Modificaciones",
        "cuerpoHtml": "<p>La presente Política de Privacidad entra en vigor el <strong>30 de septiembre de 2024</strong> y permanecerá vigente hasta que sea sustituida por una versión actualizada.</p><p>La Fundación Cultural y Educativa Ambato se reserva el derecho de modificar esta política para adaptarla a cambios normativos o a las necesidades propias de la institución. Los cambios serán notificados a través de los canales de comunicación institucionales (correo a representantes legales y publicación en el sitio web).</p><p>Se recomienda revisar periódicamente la versión actualizada disponible en este sitio web.</p>"
      }
    ],
    "ctaPie": {
      "titulo": "¿Tienes dudas sobre esta política?",
      "descripcion": "Escríbenos a protecciondatos@atenas.edu.ec o llámanos al +593 2854281 ext. 111. Te respondemos en un máximo de 15 días hábiles.",
      "ctaLabel": "Ir a Contactos →",
      "ctaHref": "/contactos"
    }
  }$$::jsonb,
  'Política de Privacidad – Clientes y Familias — Unidad Educativa Atenas',
  'Política de privacidad de la Fundación Cultural y Educativa Ambato para estudiantes y representantes legales. Conozca cómo tratamos sus datos personales conforme a la LOPDP.',
  true
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'politicas/clientes');

-- ─── 2c. /politicas/proveedores — documento de política (plantilla S) ─
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'politicas/proveedores',
  'tpl_s_documento_politica',
  'Política de Privacidad — Proveedores',
  $${
    "hero": {
      "badge": "POLÍTICA DE PRIVACIDAD",
      "title": "Para Proveedores",
      "subtitle": "Versión 1.0 · Vigente desde el 30 de septiembre de 2024",
      "ghostText": "PRIVACIDAD",
      "bgImageSrc": ""
    },
    "meta": {
      "versionLabel": "Versión 1.0",
      "audiencia": "Proveedores",
      "fechaVigencia": "Vigente desde el 30 de septiembre de 2024"
    },
    "tituloDocumento": "Política de Privacidad para Proveedores",
    "secciones": [
      {
        "numero": "1",
        "titulo": "Responsable del Tratamiento",
        "cuerpoHtml": "<p>El responsable del tratamiento de sus datos personales es la <strong>Fundación Cultural y Educativa Ambato</strong>, con RUC 1890050863001, con domicilio en calle Gabriel Román y Av. Pedro Vásconez, Izamba, Ambato, Ecuador.</p><p>Para consultas relativas a protección de datos puede contactarnos en: <strong>protecciondatos@atenas.edu.ec</strong> · Teléfono: +593 2854281 ext. 111.</p>"
      },
      {
        "numero": "2",
        "titulo": "Finalidad del Tratamiento y Datos Personales Tratados",
        "cuerpoHtml": "<p>La Fundación trata datos personales de sus proveedores (personas naturales o representantes legales y contactos de personas jurídicas) para las siguientes finalidades:</p><ul><li>Gestión y formalización de contratos: datos de identificación, RUC, representación legal y documentos habilitantes.</li><li>Comunicación comercial y administrativa: datos de contacto para coordinación de pedidos, entregas y servicios.</li><li>Pagos y facturación: datos bancarios y tributarios necesarios para la liquidación de obligaciones económicas.</li><li>Evaluación y calificación de proveedores: historial de cumplimiento para el registro interno de proveedores calificados.</li><li>Cumplimiento normativo: verificación de obligaciones tributarias, laborales y de seguridad social.</li></ul>"
      },
      {
        "numero": "3",
        "titulo": "Legitimación del Tratamiento",
        "cuerpoHtml": "<p>La legitimación para el tratamiento de sus datos personales se basa en:</p><ul><li>La ejecución del contrato de provisión de bienes o servicios suscrito con la Fundación.</li><li>El cumplimiento de obligaciones legales en materia tributaria, laboral y de contratación pública.</li><li>El interés legítimo de la Fundación para gestionar de forma eficiente sus relaciones con proveedores.</li></ul>"
      },
      {
        "numero": "4",
        "titulo": "Destinatarios de los Datos",
        "cuerpoHtml": "<p>Los datos personales de proveedores podrán ser compartidos, cuando sea estrictamente necesario, con:</p><ul><li>Personal administrativo y financiero interno de la institución para la gestión de contratos y pagos.</li><li>Organismos de control y autoridades competentes (SRI, SERCOP, auditoría externa) cuando la ley así lo exija.</li><li>Sistemas de gestión financiera y contable utilizados por la institución, bajo acuerdos de confidencialidad.</li></ul><p>En ningún caso se cederán datos a terceros con fines distintos a los indicados sin el consentimiento previo del titular.</p>"
      },
      {
        "numero": "5",
        "titulo": "Transferencias Internacionales de Datos",
        "cuerpoHtml": "<p>La Fundación no realiza transferencias internacionales de datos personales de proveedores, salvo que exista una obligación legal que lo requiera o el titular haya otorgado su consentimiento expreso.</p>"
      },
      {
        "numero": "6",
        "titulo": "Período de Retención de los Datos",
        "cuerpoHtml": "<p>Los datos personales de proveedores serán conservados:</p><ul><li>Durante la vigencia de la relación contractual con la institución.</li><li>Por un período mínimo de 7 años tras la finalización del contrato, para atender posibles reclamaciones y cumplir con obligaciones tributarias y legales.</li></ul><p>Una vez cumplidos los plazos, los datos serán eliminados o anonimizados de forma segura.</p>"
      },
      {
        "numero": "7",
        "titulo": "Derechos del Titular y Proceso para Ejercerlos",
        "cuerpoHtml": "<p>De conformidad con la Ley Orgánica de Protección de Datos Personales (LOPDP), el titular tiene derecho a:</p><ul><li>Acceso: conocer qué datos personales trata la Fundación y con qué finalidad.</li><li>Rectificación: solicitar la corrección de datos inexactos o incompletos.</li><li>Cancelación o Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios.</li><li>Oposición: oponerse al tratamiento de sus datos en las circunstancias previstas por la ley.</li><li>Portabilidad: recibir sus datos en un formato estructurado y de lectura mecánica.</li><li>Limitación del tratamiento: solicitar la restricción del tratamiento en los casos que la ley prevé.</li></ul><p>Para ejercer cualquiera de estos derechos, envíe una solicitud escrita a <strong>protecciondatos@atenas.edu.ec</strong> indicando el derecho que desea ejercer y adjuntando copia de su cédula de identidad o pasaporte. La Fundación responderá en un plazo máximo de 15 días hábiles.</p>"
      },
      {
        "numero": "8",
        "titulo": "Uso de Cookies",
        "cuerpoHtml": "<p>El sitio web institucional (atenas.edu.ec) puede utilizar cookies técnicas, de análisis y de preferencias. El usuario puede gestionarlas desde la configuración de su navegador. Para más información, consulte la Política para Clientes y Familias.</p>"
      },
      {
        "numero": "9",
        "titulo": "Seguridad de los Datos",
        "cuerpoHtml": "<p>La Fundación ha implementado medidas técnicas y organizativas para proteger los datos personales de sus proveedores frente a acceso no autorizado, alteración, pérdida o divulgación:</p><ul><li>Control de acceso basado en roles para los sistemas internos.</li><li>Cifrado de datos en tránsito mediante protocolos SSL/TLS.</li><li>Copias de seguridad periódicas y procedimientos de recuperación.</li><li>Formación del personal en protección de datos personales.</li></ul>"
      },
      {
        "numero": "10",
        "titulo": "Personas Naturales y Representantes Legales",
        "cuerpoHtml": "<p>La presente política aplica a personas naturales que actúan como proveedores y a los representantes legales y contactos designados por personas jurídicas proveedoras. Se presume que todos los titulares de datos tratados en este contexto son mayores de edad.</p>"
      },
      {
        "numero": "11",
        "titulo": "Contacto del Responsable de Protección de Datos",
        "cuerpoHtml": "<p>Para cualquier consulta, solicitud o reclamación relacionada con el tratamiento de sus datos personales:</p><ul><li>Correo electrónico: protecciondatos@atenas.edu.ec</li><li>Teléfono: +593 2854281 ext. 111</li><li>Dirección: Calle Gabriel Román y Av. Pedro Vásconez, Izamba, Ambato, Ecuador</li></ul>"
      },
      {
        "numero": "12",
        "titulo": "Vigencia y Modificaciones",
        "cuerpoHtml": "<p>La presente Política de Privacidad entra en vigor el <strong>30 de septiembre de 2024</strong> y permanecerá vigente hasta que sea sustituida por una versión actualizada.</p><p>La Fundación se reserva el derecho de modificarla para adaptarla a cambios normativos o a las necesidades institucionales. Las modificaciones serán comunicadas a través del sitio web institucional y por los canales de comunicación habituales con proveedores.</p>"
      }
    ],
    "ctaPie": {
      "titulo": "¿Tienes dudas sobre esta política?",
      "descripcion": "Escríbenos a protecciondatos@atenas.edu.ec o llámanos al +593 2854281 ext. 111. Te respondemos en un máximo de 15 días hábiles.",
      "ctaLabel": "Ir a Contactos →",
      "ctaHref": "/contactos"
    }
  }$$::jsonb,
  'Política de Privacidad – Proveedores — Unidad Educativa Atenas',
  'Política de privacidad de la Fundación Cultural y Educativa Ambato para proveedores de bienes y servicios. Conozca cómo tratamos sus datos personales conforme a la LOPDP.',
  true
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'politicas/proveedores');

-- ─── 2d. /portal-familiar — portal de accesos (plantilla T) ───────
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'portal-familiar',
  'tpl_t_portal_accesos',
  'Portal Familiar',
  $${
    "hero": {
      "eyebrow": "Portal Familiar",
      "title": "Bienvenido a la familia Atenas",
      "description": "Selecciona la opción que mejor se ajuste a tu caso. Si recién solicitaste admisión, consulta el estado de tu trámite. Si ya eres parte del colegio, accede a Idukay."
    },
    "intro": {
      "titulo": "",
      "descripcion": ""
    },
    "cards": [
      {
        "badge": "Postulantes",
        "title": "Seguimiento de Admisión",
        "description": "¿Llenaste la solicitud de admisión y quieres saber en qué etapa va? Ingresa con tu número de seguimiento (ATN-YYYY-XXXXXX) y consulta el estado en tiempo real.",
        "bullets": [
          "Estado actualizado del proceso",
          "Pipeline visual de 7 etapas",
          "Sin necesidad de crear cuenta"
        ],
        "ctaLabel": "Consultar mi solicitud",
        "ctaHref": "/admisiones/seguimiento",
        "accentColor": "gold"
      },
      {
        "badge": "Familias matriculadas",
        "title": "Plataforma Idukay",
        "description": "¿Tu hijo ya es estudiante de Atenas? Accede a Idukay para ver calificaciones, comunicados, calendario académico y estado de cuenta.",
        "bullets": [
          "Calificaciones y reportes",
          "Comunicados oficiales",
          "Calendario y estado de cuenta"
        ],
        "ctaLabel": "Ir a Idukay",
        "ctaHref": "https://idukay.net/colegios/#/login",
        "accentColor": "navy"
      }
    ],
    "notaPie": {
      "tituloNegrita": "¿Aún no postulas?",
      "texto": "Si quieres iniciar el proceso de admisión para tu hijo o hija, visita la sección de Admisiones y completa el formulario en línea.",
      "linkLabel": "Inicia tu proceso de admisión →",
      "linkHref": "/admisiones"
    }
  }$$::jsonb,
  'Portal Familiar — Unidad Educativa Atenas',
  'Accede al seguimiento de tu solicitud de admisión o a la plataforma educativa Idukay desde el portal familiar de la Unidad Educativa Atenas.',
  true
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'portal-familiar');
