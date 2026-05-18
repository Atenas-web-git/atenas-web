-- ============================================================
-- Migración 043 — Admisiones editables (landing + 4 niveles + textos chicos)
-- Backoffice Atenas — sesión 34
--
-- Convierte en editables las páginas hardcoded del flujo de admisiones:
--
--   1. configuracion_global['admisiones_landing']
--      Contenido editable de la página /admisiones:
--      hero (con stats bar + badge floating + 3 fotos del collage),
--      sección "Proceso" (5 pasos auto-numerados + 2 fotos),
--      sección "Niveles" (5 cards con título/grados/edad + highlight),
--      sección "Explorar" (4 cards a las sub-páginas por nivel),
--      sección "Visita" (CTA + horario + dirección + collage),
--      FAQ schema (Q&A para JSON-LD).
--
--   2. configuracion_global['admisiones_textos']
--      Textos chicos de /admisiones/formulario y /admisiones/seguimiento.
--      Solo encabezados — la lógica del wizard de postulación y la
--      búsqueda de estado permanece en código.
--
--   3. Plantilla nueva tpl_o_admision_nivel + 4 filas en `paginas`
--      con slugs admisiones/inicial, admisiones/egb-elemental-media,
--      admisiones/egb-superior, admisiones/ib.
--      Editable por nivel: hero, sección de detalle (heading + párrafos
--      + documentos + nota + ficha técnica), textos del CTA y el banner
--      de proceso (5 pasos de admisión específicos del nivel).
--
-- IDEMPOTENTE: re-ejecutable. Si los seeds ya existen NO se sobrescriben.
-- ============================================================

-- ─── 1. Seed configuracion_global['admisiones_landing'] ──────────
INSERT INTO configuracion_global (key, value, descripcion)
SELECT
  'admisiones_landing',
  $$
  {
    "hero": {
      "eyebrow": "PROCESO DE ADMISIÓN 2026",
      "titleLine1": "Tu futuro",
      "titleLine2": "empieza aquí.",
      "subtitlePre": "Únete a la comunidad",
      "subtitleHighlight": "Atenas",
      "subtitlePost": "y forma parte de cinco décadas de excelencia educativa en Ecuador.",
      "ghostText": "ADMISIONES",
      "bgImage": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1440&q=80",
      "badgeValue": "2026",
      "badgeLabel": "INSCRIPCIONES ABIERTAS",
      "floatingPhotos": [
        "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80"
      ],
      "ctaPrimary": { "label": "Iniciar proceso", "href": "/admisiones/formulario" },
      "ctaSecondary": { "label": "Agendar visita", "href": "#visita" },
      "stats": [
        { "value": "50+",    "label": "Años de excelencia" },
        { "value": "5.000+", "label": "Familias que nos eligen" },
        { "value": "1°",     "label": "Programa IB en Ambato" }
      ]
    },
    "proceso": {
      "eyebrow": "Cómo unirse",
      "headingPre": "El camino hacia",
      "headingHighlight": "el Atenas.",
      "description": "Un proceso claro, humano y transparente para que tu familia se incorpore a la comunidad Atenas con total confianza.",
      "fotoPrincipal": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
      "fotoSecundaria": "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80",
      "badgeFloating": "CUPOS LIMITADOS 2026",
      "pasos": [
        { "num": "01", "title": "Solicitud en línea",     "desc": "Completa el formulario de pre-inscripción con los datos del estudiante y el nivel educativo deseado." },
        { "num": "02", "title": "Entrevista familiar",    "desc": "Coordinamos una reunión con las autoridades del colegio para conocer a la familia y al estudiante." },
        { "num": "03", "title": "Evaluación diagnóstica", "desc": "El estudiante realiza una evaluación de diagnóstico acorde a su nivel. Es formativa, no eliminatoria." },
        { "num": "04", "title": "Revisión de documentos", "desc": "Entrega de libreta de calificaciones, copia de cédula y certificado de salud del año anterior." },
        { "num": "05", "title": "Matriculación",          "desc": "Una vez aprobado el proceso, se coordina la firma del contrato y el pago de matrícula." }
      ]
    },
    "niveles": {
      "eyebrow": "Niveles Educativos",
      "headingPre": "Elige el nivel",
      "headingHighlight": "correcto.",
      "description": "Desde los primeros pasos en Inicial hasta el Diploma Internacional IB, acompañamos a cada estudiante en cada etapa de su formación.",
      "fotoPrincipal": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",
      "fotoSecundaria": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
      "badgeFloating": "BACHILLERATO IB · AMBATO",
      "items": [
        { "num": "01",  "title": "Inicial",                    "grades": "Pre-Kinder y Kinder", "age": "3-5 años",   "highlight": false },
        { "num": "02",  "title": "Básica Elemental",            "grades": "1ro a 4to EGB",       "age": "5-9 años",   "highlight": false },
        { "num": "03",  "title": "Básica Media-Superior",       "grades": "5to a 10mo EGB",      "age": "10-14 años", "highlight": false },
        { "num": "04",  "title": "Bachillerato General",        "grades": "1ro a 3ro BGU",       "age": "15-17 años", "highlight": false },
        { "num": "IB★", "title": "Bachillerato Internacional",  "grades": "Diploma IB",          "age": "1ro a 3ro",  "highlight": true  }
      ]
    },
    "explorar": {
      "eyebrow": "Proceso por nivel",
      "heading": "Conoce los requisitos de tu nivel",
      "description": "Cada nivel tiene su propio proceso, documentos y requisitos. Selecciona el que corresponde al estudiante para ver la información completa.",
      "items": [
        { "slug": "inicial",             "icon": "🌱", "title": "Educación Inicial",   "grades": "Pre-Kinder y Kinder",  "age": "3 – 5 años",  "desc": "Los primeros pasos: metodologías Montessori, Reggio Emilia y ABN en un entorno bilingüe y estimulante.", "highlight": false },
        { "slug": "egb-elemental-media", "icon": "📚", "title": "EGB Elemental y Media","grades": "1ro a 7mo grado",      "age": "6 – 12 años", "desc": "Formación bilingüe con pensamiento lógico-matemático, valores y bases académicas sólidas.", "highlight": false },
        { "slug": "egb-superior",        "icon": "🔬", "title": "EGB Superior",         "grades": "8vo a 10mo grado",     "age": "12 – 15 años","desc": "Etapa de preparación para el Bachillerato IB: inglés avanzado, ciencias y liderazgo.", "highlight": false },
        { "slug": "ib",                  "icon": "★",  "title": "Bachillerato IB",      "grades": "1ro y 2do Bachillerato","age": "14 – 17 años","desc": "Programa del Diploma Internacional. Cupos limitados, selección por mérito académico.", "highlight": true }
      ]
    },
    "visita": {
      "eyebrow": "Visita el Campus",
      "headingPre": "Ven a conocer",
      "headingHighlight": "el Atenas.",
      "description": "Agenda una visita guiada y descubre nuestras instalaciones, metodología y el ambiente que hace especial a Atenas. Sin compromiso.",
      "ubicacion": "Ambato, Ecuador",
      "horarioCorto": "Lun – Vie · 08:00–16:00",
      "ctaPrimary":   { "label": "Agendar visita", "href": "mailto:admisiones@atenas.edu.ec" },
      "ctaSecondary": { "label": "Ver proceso",    "href": "#proceso" },
      "contactoLine": "(03) 282-1234 · admisiones@atenas.edu.ec",
      "fotos": [
        "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
        "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80"
      ],
      "badgeFloating": {
        "linea1": "Lun a Vie",
        "linea2": "08:00 – 16:00"
      }
    },
    "faq": [
      {
        "pregunta": "¿Cuáles son los niveles educativos que ofrece el Colegio Atenas en Ambato?",
        "respuesta": "La Unidad Educativa Atenas ofrece Educación Inicial (3–5 años), Educación General Básica Elemental y Media (1.° a 7.° grado), Educación General Básica Superior (8.° a 10.° grado) y Bachillerato Internacional IB (1.° a 3.° de bachillerato)."
      },
      {
        "pregunta": "¿Cómo es el proceso de admisión en la Unidad Educativa Atenas?",
        "respuesta": "El proceso consta de 4 pasos: 1) Solicitud de información, 2) Visita a las instalaciones, 3) Entrevista familiar y evaluación diagnóstica, 4) Confirmación de matrícula. Puedes iniciar el proceso en línea desde nuestra página de admisiones."
      },
      {
        "pregunta": "¿El Colegio Atenas tiene el Bachillerato Internacional (IB)?",
        "respuesta": "Sí. La Unidad Educativa Atenas es un colegio acreditado por la International Baccalaureate Organization (IBO) y ofrece el Diploma del Bachillerato Internacional (IBDP) en Izamba, Ambato, Ecuador."
      },
      {
        "pregunta": "¿Dónde está ubicado el Colegio Atenas?",
        "respuesta": "Estamos ubicados en la Calle Gabriel Román s/n y Av. Pedro Vásconez, parroquia Izamba, Ambato, Tungurahua, Ecuador. Código postal 180103."
      },
      {
        "pregunta": "¿A qué número puedo llamar para información sobre admisiones?",
        "respuesta": "Puedes llamarnos al +593 3 285-4281 o escribirnos a admisiones@atenas.edu.ec. Atendemos de lunes a viernes de 07:00 a 17:00."
      },
      {
        "pregunta": "¿El Colegio Atenas tiene certificación ISO 9001?",
        "respuesta": "Sí. La Unidad Educativa Atenas cuenta con certificación ISO 9001 en gestión de calidad educativa, lo que garantiza procesos institucionales estandarizados y mejora continua."
      }
    ]
  }
  $$::jsonb,
  'Contenido editable de la página /admisiones (landing): hero con stats + collage, sección Proceso (5 pasos), sección Niveles (5 cards), sección Explorar (4 cards a sub-páginas), sección Visita (CTA + horario) y FAQ schema (JSON-LD para SEO).'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'admisiones_landing'
);

-- ─── 2. Seed configuracion_global['admisiones_textos'] ───────────
INSERT INTO configuracion_global (key, value, descripcion)
SELECT
  'admisiones_textos',
  $$
  {
    "formulario": {
      "headerTitle": "Proceso de Admisión",
      "backLabel": "← Volver al sitio"
    },
    "seguimiento": {
      "headerTitle": "Seguimiento de Solicitud",
      "backLabel": "← Volver al sitio",
      "introTitle": "Consulta el estado de tu solicitud",
      "introDescription": "Ingresa el número de seguimiento que recibiste por correo al iniciar tu proceso de admisión."
    }
  }
  $$::jsonb,
  'Textos editables de las páginas chicas de admisiones: /admisiones/formulario (header) y /admisiones/seguimiento (header + intro de búsqueda). La lógica del wizard y la búsqueda permanece en código.'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'admisiones_textos'
);

-- ─── 3. Plantilla O — tpl_o_admision_nivel ────────────────────────
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
    'tpl_n_trabaja',
    'tpl_o_admision_nivel'
  ));

-- 3.1 Helper: ficha estándar de pasos (idéntica para los 4 niveles).
-- Sale del componente <PasosAdmision> hardcoded.
-- Se inyecta en cada fila para que el cliente pueda personalizarla por nivel.
-- Nota: doble dolar SQL para preservar caracteres especiales.

-- 3.2 Seed Educación Inicial
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES (
  'admisiones/inicial',
  'tpl_o_admision_nivel',
  'Admisión Educación Inicial',
  $$
  {
    "nivelKey": "inicial",
    "nivelLabel": "Educación Inicial",
    "hero": {
      "badge": "ADMISIONES",
      "title": "Admisión a Educación Inicial",
      "subtitle": "Pre-Kinder y Kinder — Los primeros pasos de una formación de por vida en la Unidad Educativa Atenas.",
      "ghostText": "INICIAL",
      "bgImage": ""
    },
    "detalle": {
      "badge": "Educación Inicial — Pre-Kinder y Kinder",
      "heading": "Requisitos para ingresar a Educación Inicial",
      "paragraphs": [
        "La Educación Inicial en Atenas es el punto de partida de una formación integral basada en las metodologías Montessori, Reggio Emilia y ABN. Para ingresar, el niño o niña debe cumplir con los rangos de edad establecidos por el Ministerio de Educación.",
        "El proceso de admisión es sencillo y acompañado: nuestro equipo guía a las familias en cada paso para asegurar una transición tranquila y feliz para el estudiante."
      ],
      "documents": [
        "Cédula del representante",
        "Partida de nacimiento",
        "Certificado médico",
        "Carnet de vacunas",
        "Fotos tamaño carnet",
        "Formulario de inscripción"
      ],
      "note": "Para Pre-Kinder el niño debe cumplir 3 años antes del 31 de diciembre del año lectivo. Para Kinder, 4 años en la misma fecha.",
      "ficha": [
        { "label": "Niveles",          "value": "Pre-Kinder y Kinder", "highlight": false },
        { "label": "Edad Pre-Kinder",  "value": "3 años cumplidos",    "highlight": false },
        { "label": "Edad Kinder",      "value": "4 años cumplidos",    "highlight": false },
        { "label": "Promedio mínimo",  "value": "No aplica",            "highlight": false },
        { "label": "Inicio",           "value": "Septiembre",          "highlight": false }
      ],
      "ctaTitulo": "¿Quieres conocer el colegio?",
      "ctaDescripcion": "Agenda una visita guiada y conoce nuestras instalaciones de primera mano.",
      "ctaLabel": "Agendar visita al colegio",
      "ctaHref": "/contactos"
    },
    "pasos": {
      "eyebrow": "Proceso de admisión",
      "heading": "5 pasos para ingresar al colegio",
      "items": [
        { "num": "01", "title": "Presentación de documentos", "desc": "Entrega de partida de nacimiento, cédula del representante, carnet de vacunas y certificado médico." },
        { "num": "02", "title": "Entrevista familiar",        "desc": "Conversación con el equipo docente para conocer al niño/a y a la familia." },
        { "num": "03", "title": "Observación pedagógica",     "desc": "Sesión breve y lúdica para identificar el desarrollo del niño/a." },
        { "num": "04", "title": "Revisión del comité",        "desc": "El equipo de admisiones revisa el expediente y confirma el cupo." },
        { "num": "05", "title": "Inducción familiar",         "desc": "Reunión de bienvenida con las familias antes del inicio del año escolar." }
      ]
    },
    "ctaSolicitud": {
      "eyebrow": "Solicitud de Admisión",
      "heading": "Da el primer paso hacia el futuro de tu hijo",
      "descripcionPre": "Completa la solicitud formal de admisión para",
      "descripcionPost": ". Son solo 4 pasos y nuestro equipo te contactará en menos de 48 horas hábiles.",
      "beneficios": [ "4 pasos simples", "Sin costo ni compromiso", "Respuesta en 48 h hábiles" ],
      "ctaPrimary":   { "label": "Iniciar solicitud de admisión →", "href": "/admisiones/formulario?nivel=Educaci%C3%B3n%20Inicial" },
      "ctaSecondary": { "label": "Agendar una visita",              "href": "/contactos" },
      "nota": "El formulario no genera compromiso. Tu información es confidencial."
    }
  }
  $$::jsonb,
  'Admisión Educación Inicial — Unidad Educativa Atenas',
  'Requisitos y proceso de admisión para Educación Inicial (Pre-Kinder y Kinder) en la Unidad Educativa Atenas, Ambato.',
  true
)) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'admisiones/inicial');

-- 3.3 Seed EGB Elemental y Media
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES (
  'admisiones/egb-elemental-media',
  'tpl_o_admision_nivel',
  'Admisión EGB Elemental y Media',
  $$
  {
    "nivelKey": "egb-elemental-media",
    "nivelLabel": "EGB Elemental y Media",
    "hero": {
      "badge": "ADMISIONES",
      "title": "Admisión EGB Elemental y Media",
      "subtitle": "1ro a 7mo grado — Formación sólida en valores, bilinguismo y pensamiento crítico desde la infancia.",
      "ghostText": "EGB",
      "bgImage": ""
    },
    "detalle": {
      "badge": "EGB Elemental y Media — 1ro a 7mo grado",
      "heading": "Requisitos para ingresar a EGB Elemental y Media",
      "paragraphs": [
        "La EGB Elemental y Media en Atenas ofrece una formación bilingüe, humanista y con énfasis en el desarrollo del pensamiento lógico-matemático. Aceptamos estudiantes de transferencia que cumplan los requisitos académicos y documentales establecidos.",
        "El proceso incluye una evaluación diagnóstica para identificar el nivel del estudiante y garantizar que su integración al grupo sea exitosa."
      ],
      "documents": [
        "Notas del año anterior",
        "Cédula del representante",
        "Partida de nacimiento",
        "Certificado de matrícula anterior",
        "Certificado médico",
        "Fotos tamaño carnet"
      ],
      "note": "Para estudiantes que provienen de otros establecimientos se requiere el historial académico completo y el certificado de no adeudar valores al colegio de origen.",
      "ficha": [
        { "label": "Niveles",         "value": "1ro a 7mo grado",  "highlight": false },
        { "label": "Edad aprox.",     "value": "6 – 12 años",      "highlight": false },
        { "label": "Promedio mínimo", "value": "7 / 10",            "highlight": true  },
        { "label": "Evaluación",      "value": "Diagnóstica",       "highlight": false },
        { "label": "Inicio",          "value": "Septiembre",       "highlight": false }
      ],
      "ctaTitulo": "¿Quieres conocer el colegio?",
      "ctaDescripcion": "Agenda una visita guiada y conoce nuestras instalaciones de primera mano.",
      "ctaLabel": "Agendar visita al colegio",
      "ctaHref": "/contactos"
    },
    "pasos": {
      "eyebrow": "Proceso de admisión",
      "heading": "5 pasos para ingresar al colegio",
      "items": [
        { "num": "01", "title": "Presentación de documentos", "desc": "Entrega de notas del año anterior, cédula del representante y certificado médico." },
        { "num": "02", "title": "Evaluación DECE",            "desc": "El Departamento de Consejería evalúa el perfil emocional y vocacional del estudiante." },
        { "num": "03", "title": "Pruebas académicas",         "desc": "Evaluación de razonamiento verbal y matemático para verificar el nivel requerido." },
        { "num": "04", "title": "Revisión del comité",        "desc": "El equipo de admisiones analiza el expediente completo y toma la decisión." },
        { "num": "05", "title": "Orientación e inducción",    "desc": "Sesión con el coordinador, familias y futuros estudiantes antes de iniciar el año." }
      ]
    },
    "ctaSolicitud": {
      "eyebrow": "Solicitud de Admisión",
      "heading": "Da el primer paso hacia el futuro de tu hijo",
      "descripcionPre": "Completa la solicitud formal de admisión para",
      "descripcionPost": ". Son solo 4 pasos y nuestro equipo te contactará en menos de 48 horas hábiles.",
      "beneficios": [ "4 pasos simples", "Sin costo ni compromiso", "Respuesta en 48 h hábiles" ],
      "ctaPrimary":   { "label": "Iniciar solicitud de admisión →", "href": "/admisiones/formulario?nivel=EGB%20Elemental%20y%20Media" },
      "ctaSecondary": { "label": "Agendar una visita",              "href": "/contactos" },
      "nota": "El formulario no genera compromiso. Tu información es confidencial."
    }
  }
  $$::jsonb,
  'Admisión EGB Elemental y Media — Unidad Educativa Atenas',
  'Requisitos y proceso de admisión para EGB Elemental y Media (1ro a 7mo grado) en la Unidad Educativa Atenas, Ambato.',
  true
)) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'admisiones/egb-elemental-media');

-- 3.4 Seed EGB Superior
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES (
  'admisiones/egb-superior',
  'tpl_o_admision_nivel',
  'Admisión EGB Superior',
  $$
  {
    "nivelKey": "egb-superior",
    "nivelLabel": "EGB Superior",
    "hero": {
      "badge": "ADMISIONES",
      "title": "Admisión EGB Superior",
      "subtitle": "8vo a 10mo grado — La etapa previa al Bachillerato IB, con exigencia académica y formación en liderazgo.",
      "ghostText": "SUPERIOR",
      "bgImage": ""
    },
    "detalle": {
      "badge": "EGB Superior — 8vo a 10mo grado",
      "heading": "Requisitos para ingresar a EGB Superior",
      "paragraphs": [
        "La EGB Superior es la etapa de preparación para el Bachillerato, con especial énfasis en el desarrollo del pensamiento analítico, el inglés avanzado y las bases científicas que el Programa del Diploma IB requiere.",
        "Los estudiantes de 8vo a 10mo que ingresan a Atenas pasan por un proceso de evaluación diagnóstica para asegurar su integración exitosa al nivel académico del colegio."
      ],
      "documents": [
        "Notas de los últimos 2 años",
        "Cédula del representante",
        "Partida de nacimiento",
        "Certificado de matrícula anterior",
        "Certificado médico",
        "Fotos tamaño carnet"
      ],
      "note": "Los estudiantes de 10mo que demuestren el perfil requerido tienen prioridad en el proceso de postulación al Bachillerato IB del siguiente año lectivo.",
      "ficha": [
        { "label": "Niveles",         "value": "8vo a 10mo grado",         "highlight": false },
        { "label": "Edad aprox.",     "value": "12 – 15 años",              "highlight": false },
        { "label": "Promedio mínimo", "value": "7.5 / 10",                  "highlight": true  },
        { "label": "Evaluación",      "value": "Diagnóstica + entrevista",  "highlight": false },
        { "label": "Inicio",          "value": "Septiembre",                "highlight": false }
      ],
      "ctaTitulo": "¿Quieres conocer el colegio?",
      "ctaDescripcion": "Agenda una visita guiada y conoce nuestras instalaciones de primera mano.",
      "ctaLabel": "Agendar visita al colegio",
      "ctaHref": "/contactos"
    },
    "pasos": {
      "eyebrow": "Proceso de admisión",
      "heading": "5 pasos para ingresar al colegio",
      "items": [
        { "num": "01", "title": "Presentación de documentos", "desc": "Entrega de notas de los últimos 2 años, cédula del representante y certificado médico." },
        { "num": "02", "title": "Evaluación DECE",            "desc": "El Departamento de Consejería evalúa el perfil emocional y vocacional del estudiante." },
        { "num": "03", "title": "Pruebas académicas",         "desc": "Evaluación de razonamiento verbal y matemático para verificar el nivel requerido." },
        { "num": "04", "title": "Revisión del comité",        "desc": "El equipo de admisiones analiza el expediente completo y toma la decisión." },
        { "num": "05", "title": "Orientación e inducción",    "desc": "Sesión con el coordinador, familias y futuros estudiantes antes de iniciar el año." }
      ]
    },
    "ctaSolicitud": {
      "eyebrow": "Solicitud de Admisión",
      "heading": "Da el primer paso hacia el futuro de tu hijo",
      "descripcionPre": "Completa la solicitud formal de admisión para",
      "descripcionPost": ". Son solo 4 pasos y nuestro equipo te contactará en menos de 48 horas hábiles.",
      "beneficios": [ "4 pasos simples", "Sin costo ni compromiso", "Respuesta en 48 h hábiles" ],
      "ctaPrimary":   { "label": "Iniciar solicitud de admisión →", "href": "/admisiones/formulario?nivel=EGB%20Superior" },
      "ctaSecondary": { "label": "Agendar una visita",              "href": "/contactos" },
      "nota": "El formulario no genera compromiso. Tu información es confidencial."
    }
  }
  $$::jsonb,
  'Admisión EGB Superior — Unidad Educativa Atenas',
  'Requisitos y proceso de admisión para EGB Superior (8vo a 10mo grado) en la Unidad Educativa Atenas, Ambato.',
  true
)) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'admisiones/egb-superior');

-- 3.5 Seed Bachillerato IB
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES (
  'admisiones/ib',
  'tpl_o_admision_nivel',
  'Admisión Bachillerato IB',
  $$
  {
    "nivelKey": "ib",
    "nivelLabel": "Bachillerato IB",
    "hero": {
      "badge": "ADMISIONES",
      "title": "Admisión al Bachillerato IB",
      "subtitle": "Todo lo que necesitas saber para postular al Programa del Diploma en la Unidad Educativa Atenas.",
      "ghostText": "INGRESO",
      "bgImage": ""
    },
    "detalle": {
      "badge": "Bachillerato Internacional — Diploma IB",
      "heading": "Requisitos para ingresar al Programa del Diploma",
      "paragraphs": [
        "El Programa del Diploma IB es exigente y transformador. Para ingresar, el estudiante debe demostrar un perfil académico sólido, disposición para el trabajo autónomo y compromiso con el aprendizaje integral que el Diploma demanda durante dos años.",
        "El proceso es riguroso porque el programa lo es. Cada estudiante es evaluado en sus capacidades académicas, su perfil emocional y su madurez para asumir los retos del Diploma."
      ],
      "documents": [
        "Notas de 8vo a 10mo",
        "Cédula de identidad",
        "Certificado médico",
        "Formulario de postulación",
        "Fotos tamaño carnet"
      ],
      "note": "Las admisiones para el Programa del Diploma IB abren una vez al año. El número de cupos es limitado y se asignan en estricto orden de mérito académico.",
      "ficha": [
        { "label": "Nivel",            "value": "1ro y 2do Bachillerato", "highlight": false },
        { "label": "Edad requerida",   "value": "14 – 15 años",            "highlight": false },
        { "label": "Promedio mínimo",  "value": "8 / 10",                  "highlight": true  },
        { "label": "Cupos",            "value": "Limitados",                "highlight": false },
        { "label": "Inicio",           "value": "Septiembre",              "highlight": false }
      ],
      "ctaTitulo": "¿Quieres conocer el colegio?",
      "ctaDescripcion": "Agenda una visita guiada y conoce nuestras instalaciones de primera mano.",
      "ctaLabel": "Agendar visita al colegio",
      "ctaHref": "/contactos"
    },
    "pasos": {
      "eyebrow": "Proceso de admisión",
      "heading": "5 pasos para ingresar al colegio",
      "items": [
        { "num": "01", "title": "Presentación de documentos", "desc": "Entrega de notas de 8vo a 10mo, cédula de identidad, formulario de postulación y certificado médico." },
        { "num": "02", "title": "Evaluación DECE",            "desc": "El Departamento de Consejería evalúa el perfil emocional y vocacional del estudiante." },
        { "num": "03", "title": "Pruebas académicas",         "desc": "Evaluación de razonamiento verbal y matemático para verificar el nivel requerido." },
        { "num": "04", "title": "Revisión del comité",        "desc": "El equipo de admisiones analiza el expediente completo y toma la decisión." },
        { "num": "05", "title": "Orientación e inducción",    "desc": "Sesión con el coordinador, familias y futuros estudiantes antes de iniciar el año." }
      ]
    },
    "ctaSolicitud": {
      "eyebrow": "Solicitud de Admisión",
      "heading": "Da el primer paso hacia el futuro de tu hijo",
      "descripcionPre": "Completa la solicitud formal de admisión para",
      "descripcionPost": ". Son solo 4 pasos y nuestro equipo te contactará en menos de 48 horas hábiles.",
      "beneficios": [ "4 pasos simples", "Sin costo ni compromiso", "Respuesta en 48 h hábiles" ],
      "ctaPrimary":   { "label": "Iniciar solicitud de admisión →", "href": "/admisiones/formulario?nivel=Bachillerato%20IB" },
      "ctaSecondary": { "label": "Agendar una visita",              "href": "/contactos" },
      "nota": "El formulario no genera compromiso. Tu información es confidencial."
    }
  }
  $$::jsonb,
  'Admisión Bachillerato IB — Unidad Educativa Atenas',
  'Requisitos, documentos y proceso de admisión para el Programa del Diploma IB en la Unidad Educativa Atenas, Ambato. Cupos limitados.',
  true
)) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'admisiones/ib');
