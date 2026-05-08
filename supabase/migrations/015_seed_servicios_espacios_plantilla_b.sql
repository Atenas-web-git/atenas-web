-- ============================================================
-- Migración 015 — Seed /servicios y /espacios como plantilla B
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- Siembra las landings `servicios` y `espacios` con plantilla B
-- (Hero + grid de tarjetas con icono, título, subtítulo, color,
-- highlight, link y CTA), replicando el contenido actual hardcodeado.
--
-- IDEMPOTENTE: si una página ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'servicios',
    'tpl_b_hero_grid',
    'Servicios Institucionales',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'UNIDAD EDUCATIVA ATENAS',
        'title',     'Servicios Institucionales',
        'subtitle',  'Todos los recursos y servicios disponibles para el bienestar y desarrollo de nuestra comunidad educativa.',
        'ghostText', 'SERVICIOS'
      ),
      'seccion', jsonb_build_object(
        'badge',       'TODOS LOS SERVICIOS',
        'heading',     '¿En qué podemos ayudarte?',
        'description', 'Conoce todos los servicios disponibles para estudiantes, representantes legales y docentes de la Unidad Educativa Atenas.',
        'items', jsonb_build_array(
          jsonb_build_object(
            'icon',        'utensils',
            'title',       'Bar Escolar',
            'description', 'Menú nutritivo y variado para estudiantes y docentes durante el horario escolar.',
            'color',       'gold',
            'href',        '/servicios/bar-cafeteria',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'book-open',
            'title',       'Biblioteca',
            'description', 'Amplia colección bibliográfica física y digital disponible para toda la comunidad educativa.',
            'color',       'gold',
            'href',        '/servicios/biblioteca',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'bus',
            'title',       'Transporte',
            'description', 'Rutas de transporte seguro y puntual desde y hacia el colegio para todos los estudiantes.',
            'color',       'gold',
            'href',        '/servicios/transporte',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'heart-pulse',
            'title',       'Dispensario Médico',
            'description', 'Atención médica inmediata y primeros auxilios durante la jornada escolar.',
            'color',       'gold',
            'href',        '/servicios/dispensario-medico',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'key',
            'title',       'Llave del Aprendizaje',
            'description', 'Sistema de casilleros personales para guardar útiles y pertenencias de forma segura.',
            'color',       'gold',
            'href',        '/servicios/llave-aprendizaje',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'award',
            'title',       'Becas',
            'description', 'Programas de financiamiento para estudiantes con excelencia académica y necesidad.',
            'color',       'gold',
            'href',        '/servicios/becas',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'shield-check',
            'title',       'Seguro Estudiantil',
            'description', 'Cobertura integral de accidentes y emergencias para todos los estudiantes.',
            'color',       'gold',
            'href',        '/servicios/seguro-estudiantil',
            'ctaText',     'Ver servicio'
          ),
          jsonb_build_object(
            'icon',        'message-circle',
            'title',       'Quejas y Sugerencias',
            'description', 'Canal oficial para compartir retroalimentación y ayudarnos a mejorar continuamente.',
            'color',       'red',
            'href',        '/servicios/quejas-sugerencias',
            'ctaText',     'Enviar comunicación'
          )
        )
      )
    ),
    'Servicios | Atenas',
    'Conoce todos los servicios disponibles para estudiantes, representantes legales y docentes de la Unidad Educativa Atenas: bar, biblioteca, transporte, dispensario médico, casilleros, becas, seguro estudiantil y canal de quejas.',
    true
  ),
  (
    'espacios',
    'tpl_b_hero_grid',
    'Espacios de Desarrollo',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'UNIDAD EDUCATIVA ATENAS',
        'title',     'Espacios de Desarrollo',
        'subtitle',  'Más allá del aula — seis dimensiones que forman el estudiante completo: ético, creativo, activo y global.',
        'ghostText', 'ESPACIOS'
      ),
      'seccion', jsonb_build_object(
        'badge',       'TODOS LOS ESPACIOS',
        'heading',     'Explora cada espacio de desarrollo',
        'description', 'Cada espacio tiene su propio enfoque, actividades y coordinación. Selecciona el que te interesa para conocer los detalles completos.',
        'items', jsonb_build_array(
          jsonb_build_object(
            'icon',        'feather',
            'title',       'VASE',
            'subtitle',    'Valores, Actitudes, Servicio y Espiritualidad',
            'description', 'Formación del carácter a través del servicio comunitario, la reflexión personal y el liderazgo ético.',
            'color',       'gold',
            'href',        '/espacios/vase',
            'ctaText',     'Explorar espacio'
          ),
          jsonb_build_object(
            'icon',        'star',
            'title',       'CAS',
            'subtitle',    'Creativity, Activity, Service',
            'description', 'Componente central del IB donde cada estudiante diseña su portafolio de proyectos creativos y de servicio.',
            'color',       'gold',
            'highlight',   true,
            'href',        '/espacios/cas',
            'ctaText',     'Explorar espacio'
          ),
          jsonb_build_object(
            'icon',        'globe',
            'title',       'Idioma',
            'subtitle',    'Programa de inglés Cambridge',
            'description', 'Entorno bilingüe con certificaciones Cambridge desde Inicial hasta el graduado de Bachillerato.',
            'color',       'gold',
            'href',        '/espacios/idioma',
            'ctaText',     'Explorar espacio'
          ),
          jsonb_build_object(
            'icon',        'theater',
            'title',       'Cultura',
            'subtitle',    'Arte, Música, Teatro y Danza',
            'description', 'Expresión creativa como pilar de la formación integral, con festival anual y agrupaciones institucionales.',
            'color',       'gold',
            'href',        '/espacios/cultura',
            'ctaText',     'Explorar espacio'
          ),
          jsonb_build_object(
            'icon',        'trophy',
            'title',       'Ed. Física',
            'subtitle',    'Deporte y Bienestar',
            'description', 'Equipos de competencia provincial y programas de bienestar que forman hábitos saludables de por vida.',
            'color',       'gold',
            'href',        '/espacios/educacion-fisica',
            'ctaText',     'Explorar espacio'
          ),
          jsonb_build_object(
            'icon',        'plane',
            'title',       'Intercambio',
            'subtitle',    'Programa Internacional',
            'description', 'Experiencias educativas en el exterior que forman ciudadanos globales con perspectiva multicultural.',
            'color',       'gold',
            'href',        '/espacios/intercambio',
            'ctaText',     'Explorar espacio'
          )
        )
      )
    ),
    'Espacios de Desarrollo | Atenas',
    'Descubre los espacios de desarrollo integral de la Unidad Educativa Atenas: VASE, CAS, Idioma, Cultura, Educación Física e Intercambio Internacional.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
