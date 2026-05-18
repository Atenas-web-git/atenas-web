-- ============================================================
-- Migración 041 — Páginas hardcoded restantes (footer + contactos + trabaja)
-- Backoffice Atenas — sesión 33
--
-- Convierte en editables desde el backoffice las tres últimas
-- piezas hardcoded importantes del sitio público:
--
--   1. Footer global (FooterCTA) — `configuracion_global['footer']`
--      Editable: bgImage, headline, subtítulo, 2 CTAs, aliados estratégicos,
--      links del pie, copyright. Datos de contacto + redes sociales siguen
--      leyéndose de `configuracion_global['contacto']` (NO se duplican).
--
--   2. Página /contactos — `configuracion_global['contactos_pagina']`
--      Hero (textos + ghostText + bgImage), tarjeta flotante del hero,
--      sección "Canales de atención" (3 tarjetas con extensiones, dirección
--      y email), formulario (textos + estado de éxito), embed de Google Maps.
--      Teléfono central + dirección + horario + email siguen leyéndose de
--      `configuracion_global['contacto']`.
--
--   3. Plantilla nueva `tpl_n_trabaja` + seed de la página
--      /trabaja-con-nosotros usando esa plantilla. Editable: hero, sección
--      de valores con tarjetas (icono Lucide + foto + título + descripción),
--      textos del formulario wizard. La lógica del wizard (campos, CARGOS,
--      AREAS, FORMACION, DISPONIBILIDAD) se mantiene en código.
--
-- IDEMPOTENTE: re-ejecutable. Si los seeds ya existen NO se sobrescriben.
-- ============================================================

-- ─── 1. Seed inicial de configuracion_global['footer'] ───────────
INSERT INTO configuracion_global (key, value, descripcion)
SELECT
  'footer',
  $$
  {
    "bgImage": "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80",
    "headline": "Sé parte del Atenas.",
    "subtitle": "Conoce nuestra propuesta educativa y da el primer paso hacia una formación de excelencia.",
    "ctaPrimary": {
      "label": "Agenda una visita",
      "href": "/admisiones#visita"
    },
    "ctaSecondary": {
      "label": "Proceso de admisión",
      "href": "/admisiones"
    },
    "aliadosLabel": "Aliados Estratégicos",
    "aliados": [
      { "label": "Bachillerato Internacional (IB)", "abbr": "IB World School" },
      { "label": "Ministerio de Educación del Ecuador", "abbr": "MinEduc" },
      { "label": "Cambridge English", "abbr": "Cambridge" },
      { "label": "Federación Ecuatoriana de Colegios de Excelencia", "abbr": "FCEA" }
    ],
    "links": [
      { "label": "Trabaja con nosotros", "href": "/trabaja-con-nosotros" },
      { "label": "Política", "href": "/politicas" },
      { "label": "Quejas y Sugerencias", "href": "/servicios/quejas-sugerencias" },
      { "label": "Documentos institucionales", "href": "/documentos-institucionales" },
      { "label": "Facturación", "href": "/facturacion" }
    ],
    "copyright": "© 2026 Unidad Educativa Atenas · Ambato, Ecuador"
  }
  $$::jsonb,
  'Footer global del sitio (FooterCTA): foto de fondo con parallax, headline, subtitle, 2 CTAs, aliados estratégicos en chips, links del pie y copyright. Contacto + redes sociales se leen de configuracion_global[contacto].'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'footer'
);

-- ─── 2. Seed inicial de configuracion_global['contactos_pagina'] ──
INSERT INTO configuracion_global (key, value, descripcion)
SELECT
  'contactos_pagina',
  $$
  {
    "hero": {
      "eyebrow": "Unidad Educativa Atenas",
      "titleLine1": "Estamos",
      "titleLine2": "aquí para ti.",
      "description": "Escríbenos, llámanos o visítanos.\nNuestro equipo está listo para orientarte en todo lo que necesites.",
      "caption": "Calle Gabriel Román s/n y Av. Pedro Vásconez · Izamba, Ambato",
      "ghostText": "CONTACTOS",
      "bgImage": "https://images.unsplash.com/photo-1604960198403-53793a3916b5?w=1440&q=80",
      "tarjeta": {
        "titulo": "Contáctanos",
        "subtitulo": "Respuesta rápida garantizada"
      }
    },
    "canales": {
      "eyebrow": "Información de contacto",
      "heading": "Canales de atención",
      "bannerImagen": "https://images.unsplash.com/photo-1758270703733-3663d99c9dd7?w=1440&q=80",
      "tarjetaTelefono": {
        "titulo": "Teléfono Central",
        "extensiones": [
          { "ext": "100", "dept": "Recepción / Asistente General", "primary": true },
          { "ext": "140", "dept": "Secretaría Colegio", "primary": false },
          { "ext": "150", "dept": "Secretaría Escuela", "primary": false },
          { "ext": "260", "dept": "Secretaría IB", "primary": false },
          { "ext": "190", "dept": "Tesorería", "primary": false },
          { "ext": "135", "dept": "Admisiones", "primary": false },
          { "ext": "112 / 180", "dept": "Servicio al Cliente", "primary": false }
        ]
      },
      "tarjetaDireccion": {
        "titulo": "Dirección y Horario",
        "horarioLaboral": "Lunes a Viernes  ·  7:30 – 15:30",
        "horarioFinde": "Sábado y Domingo  ·  Cerrado"
      },
      "tarjetaEmail": {
        "titulo": "Correo Electrónico",
        "descripcion": "Para consultas sobre admisiones, matrículas y servicios institucionales. Respondemos en máximo 48 horas.",
        "ctaLabel": "Enviar correo"
      }
    },
    "formulario": {
      "eyebrow": "Escríbenos",
      "heading": "Envíanos un mensaje",
      "subtitle": "Te responderemos en máximo 48 horas hábiles.",
      "submitLabel": "Enviar mensaje",
      "successTitle": "¡Mensaje enviado!",
      "successText": "Gracias por contactarnos. Nuestro equipo te responderá pronto."
    },
    "mapa": {
      "embedUrl": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.913587059848!2d-78.58488182487221!3d-1.22019589876816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d380d94d5ebf2d%3A0x48c002fa0be9f24a!2sUnidad%20Educativa%20Atenas!5e0!3m2!1ses!2sec!4v1776877754704!5m2!1ses!2sec",
      "badgeText": "Izamba · Ambato, Ecuador"
    }
  }
  $$::jsonb,
  'Contenido editable de la página /contactos: hero (textos + tarjeta flotante), sección Canales de atención (3 tarjetas), formulario y mapa. Datos de contacto (teléfono, dirección, horario, email principal, redes) se leen de configuracion_global[contacto].'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'contactos_pagina'
);

-- ─── 3. Plantilla N — tpl_n_trabaja para /trabaja-con-nosotros ────
-- Ampliar CHECK constraint para incluir la nueva plantilla.
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
    'tpl_n_trabaja'
  ));

-- 3.1 Seed de la página /trabaja-con-nosotros con plantilla N.
-- Idempotente: si ya existe la página NO se sobrescribe.
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES (
  'trabaja-con-nosotros',
  'tpl_n_trabaja',
  'Trabaja con Nosotros',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'eyebrow',     'UNIDAD EDUCATIVA ATENAS',
      'titleLine1',  'Trabaja con',
      'titleLine2',  'Nosotros',
      'description', 'Forma parte de un equipo comprometido con la educación de excelencia. Buscamos profesionales apasionados por transformar vidas.',
      'caption',     'Unidad Educativa Atenas · Izamba, Ambato',
      'ghostText',   'TRABAJA',
      'bgImage',     'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1440&q=80'
    ),
    'valores', jsonb_build_object(
      'eyebrow',     'Recursos Humanos',
      'heading',     'Únete a nuestro equipo',
      'description', 'Buscamos profesionales apasionados por la educación. Completa el formulario y forma parte de nuestra base de datos de candidatos para futuras convocatorias.',
      'items', jsonb_build_array(
        jsonb_build_object(
          'imagen',      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
          'iconName',    'briefcase',
          'color',       'gold',
          'titulo',      'Estabilidad Laboral',
          'descripcion', 'Institución con más de 50 años de trayectoria, reconocida a nivel nacional como colegio IB.'
        ),
        jsonb_build_object(
          'imagen',      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
          'iconName',    'award',
          'color',       'navy',
          'titulo',      'Desarrollo Profesional',
          'descripcion', 'Capacitaciones continuas, programa IB reconocido internacionalmente y red de colaboración docente.'
        ),
        jsonb_build_object(
          'imagen',      'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80',
          'iconName',    'heart',
          'color',       'red',
          'titulo',      'Impacto Real',
          'descripcion', 'Formamos líderes desde Educación Inicial hasta Bachillerato IB, marcando una diferencia en la comunidad.'
        )
      )
    ),
    'formulario', jsonb_build_object(
      'heading',      'Completa tu postulación',
      'subtitle',     'Formulario en 2 pasos · Los datos serán enviados al equipo de RRHH de la Unidad Educativa Atenas.',
      'step1Label',   'Datos Personales',
      'step2Label',   'Perfil Profesional',
      'successTitle', '¡Postulación enviada!',
      'successText',  'Hemos recibido tu información. El equipo de RRHH la revisará y se contactará contigo si tu perfil avanza al siguiente paso.'
    )
  ),
  'Trabaja con Nosotros — Unidad Educativa Atenas',
  'Forma parte del equipo de la Unidad Educativa Atenas. Completa tu postulación y únete a una institución con más de 50 años formando líderes en Ambato, Ecuador.',
  true
)) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (
  SELECT 1 FROM paginas WHERE slug = 'trabaja-con-nosotros'
);
