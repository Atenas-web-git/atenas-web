-- ============================================================
-- Migración 026 — Plantilla L + seed /espacios/* (6 fichas)
-- Backoffice Atenas — Fase 3 (sesión 28)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_l_ficha_espacio`.
-- 2. Siembra las 6 fichas de espacios de desarrollo (VASE, CAS, Idioma,
--    Cultura, Ed. Física, Intercambio) con la plantilla L (Hero +
--    Detalle con tags/ficha/nota/foto + Actividades con foto parallax),
--    replicando el contenido actual hardcodeado en `src/data/espacios.ts`.
--
-- Las URLs públicas se sirven desde la ruta dinámica
-- `/espacios/[espacio]/page.tsx` (las 6 carpetas individuales fueron
-- eliminadas en la misma sesión).
--
-- IDEMPOTENTE: si la página ya existe, NO se sobrescribe.
-- ============================================================

-- 1. Ampliar CHECK constraint
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
    'tpl_l_ficha_espacio'
  ));

-- 2. Seed de las 6 fichas de espacios
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES

  -- ─── VASE ──────────────────────────────────────────────────
  (
    'espacios/vase',
    'tpl_l_ficha_espacio',
    'VASE',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        'title',     'VASE',
        'subtitle',  'Valores, Actitudes, Servicio y Espiritualidad — formando el carácter que el mundo necesita.',
        'ghostText', 'VASE'
      ),
      'detalle', jsonb_build_object(
        'badge',   'VASE — Valores, Actitudes, Servicio y Espiritualidad',
        'heading', 'Un espacio para construir carácter',
        'paragraphs', jsonb_build_array(
          'VASE es el espacio donde los estudiantes desarrollan su dimensión ética, espiritual y de servicio. A través de proyectos comunitarios, reflexión personal y actividades de liderazgo, cada alumno construye el carácter que el mundo necesita.',
          'Este programa transversal se integra en todas las etapas educativas, reforzando los valores institucionales y el compromiso social como pilares de la formación integral.'
        ),
        'tags', jsonb_build_array('Liderazgo', 'Servicio', 'Valores', 'Espiritualidad', 'Comunidad'),
        'nota', 'VASE no es una asignatura más — es una forma de ser y estar en el mundo que cada estudiante de Atenas desarrolla a lo largo de toda su trayectoria escolar.',
        'ficha', jsonb_build_array(
          jsonb_build_object('label', 'Niveles',      'value', 'Todos los niveles'),
          jsonb_build_object('label', 'Modalidad',    'value', 'Presencial'),
          jsonb_build_object('label', 'Frecuencia',   'value', 'Semanal',                 'highlight', true),
          jsonb_build_object('label', 'Coordinación', 'value', 'Dirección Pastoral')
        ),
        'photoSrc', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=700&q=80',
        'photoAlt', 'Estudiantes en proyecto comunitario'
      ),
      'actividades', jsonb_build_object(
        'title',        'Lo que hacemos en VASE',
        'photoSrc',     'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&q=80',
        'photoCaption', 'Proyecto comunitario — Ambato',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '🕊',  'title', 'Retiros espirituales',     'desc', 'Jornadas de reflexión para fortalecer la dimensión interior del estudiante.'),
          jsonb_build_object('icon', '🌱', 'title', 'Proyectos comunitarios',   'desc', 'Iniciativas de servicio que conectan al estudiante con la comunidad local.'),
          jsonb_build_object('icon', '⭐', 'title', 'Liderazgo estudiantil',     'desc', 'Formación de líderes con valores éticos y visión de transformación social.', 'highlight', true),
          jsonb_build_object('icon', '🤝', 'title', 'Voluntariado social',       'desc', 'Acción directa en la comunidad a través de campañas y programas de apoyo.'),
          jsonb_build_object('icon', '🙏', 'title', 'Celebraciones litúrgicas',  'desc', 'Momentos de encuentro espiritual que integran la fe con la vida escolar.')
        )
      )
    ),
    'VASE — Valores, Actitudes, Servicio y Espiritualidad | Atenas',
    'El programa VASE de la Unidad Educativa Atenas forma el carácter de sus estudiantes a través de valores, servicio comunitario y liderazgo ético.',
    true
  ),

  -- ─── CAS ───────────────────────────────────────────────────
  (
    'espacios/cas',
    'tpl_l_ficha_espacio',
    'CAS',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        'title',     'CAS',
        'subtitle',  'Creativity, Activity, Service — el corazón del Bachillerato Internacional que transforma ideas en acción.',
        'ghostText', 'CAS'
      ),
      'detalle', jsonb_build_object(
        'badge',   'CAS — Creativity, Activity, Service',
        'heading', 'Aprender haciendo, crecer sirviendo',
        'paragraphs', jsonb_build_array(
          'CAS es uno de los componentes centrales del Bachillerato Internacional y exige que cada estudiante viva su formación más allá del aula. A través de proyectos creativos, actividad física y servicio genuino, los alumnos desarrollan autonomía, empatía y responsabilidad social.',
          'Cada estudiante diseña su propio portafolio CAS, documenta su proceso de aprendizaje y reflexiona sobre su crecimiento personal. Es un viaje de dos años que deja una huella real en la comunidad.'
        ),
        'tags', jsonb_build_array('IB', 'Creatividad', 'Actividad', 'Servicio', 'Portafolio'),
        'nota', 'CAS no es opcional en el IB — es el espacio donde los aprendizajes académicos cobran sentido al aplicarse al mundo real. En Atenas, este programa está acompañado de cerca por coordinadores dedicados.',
        'ficha', jsonb_build_array(
          jsonb_build_object('label', 'Niveles',      'value', '1.º y 2.º Bachillerato'),
          jsonb_build_object('label', 'Modalidad',    'value', 'Presencial y campo'),
          jsonb_build_object('label', 'Duración',     'value', '2 años IB',          'highlight', true),
          jsonb_build_object('label', 'Coordinación', 'value', 'Coordinación IB')
        ),
        'photoSrc', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=700&q=80',
        'photoAlt', 'Estudiantes en proyecto CAS'
      ),
      'actividades', jsonb_build_object(
        'title',        'Lo que hacemos en CAS',
        'photoSrc',     'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900&q=80',
        'photoCaption', 'Proyecto CAS — Ambato',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '🎨', 'title', 'Proyectos creativos',     'desc', 'Arte, música, diseño y producción audiovisual como expresión del talento individual.'),
          jsonb_build_object('icon', '🏃', 'title', 'Actividad física',        'desc', 'Deportes, expediciones y retos físicos que fortalecen el cuerpo y la resiliencia.'),
          jsonb_build_object('icon', '🤝', 'title', 'Servicio comunitario',    'desc', 'Iniciativas reales de impacto local, diseñadas y lideradas por los propios estudiantes.', 'highlight', true),
          jsonb_build_object('icon', '📓', 'title', 'Portafolio reflexivo',    'desc', 'Documentación y reflexión continua del proceso de aprendizaje en plataforma IB.'),
          jsonb_build_object('icon', '🌍', 'title', 'Proyectos colaborativos', 'desc', 'Trabajo en equipo interdisciplinario para abordar desafíos de la comunidad.')
        )
      )
    ),
    'CAS — Creativity, Activity, Service | Atenas',
    'El programa CAS del Bachillerato Internacional en Atenas forma estudiantes activos, creativos y comprometidos con el servicio a su comunidad.',
    true
  ),

  -- ─── Idioma ────────────────────────────────────────────────
  (
    'espacios/idioma',
    'tpl_l_ficha_espacio',
    'Idioma',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        'title',     'Idioma',
        'subtitle',  'Un entorno bilingüe que abre puertas al mundo desde los primeros años de formación.',
        'ghostText', 'IDIOMA'
      ),
      'detalle', jsonb_build_object(
        'badge',   'Programa de Idiomas',
        'heading', 'Inglés con propósito y profundidad',
        'paragraphs', jsonb_build_array(
          'El programa de idiomas de Atenas va más allá del inglés como asignatura: es un entorno de inmersión que acompaña al estudiante desde Inicial hasta Bachillerato. La metodología combina comunicación real, pensamiento crítico y preparación para exámenes internacionales.',
          'Nuestros estudiantes acceden a certificaciones Cambridge (KET, PET, FCE, CAE) que son reconocidas por universidades y empleadores en todo el mundo, con acompañamiento personalizado durante cada etapa.'
        ),
        'tags', jsonb_build_array('Inglés', 'Cambridge', 'Bilingüismo', 'Certificaciones', 'Comunicación'),
        'nota', 'El nivel de inglés al graduarse de Atenas es equivalente a B2-C1 del Marco Europeo, lo que permite a nuestros egresados acceder directamente a programas universitarios internacionales sin examen de suficiencia adicional.',
        'ficha', jsonb_build_array(
          jsonb_build_object('label', 'Niveles',       'value', 'Inicial a Bachillerato'),
          jsonb_build_object('label', 'Modalidad',     'value', 'Presencial'),
          jsonb_build_object('label', 'Certificación', 'value', 'Cambridge',           'highlight', true),
          jsonb_build_object('label', 'Coordinación',  'value', 'Dpto. de Idiomas')
        ),
        'photoSrc', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80',
        'photoAlt', 'Estudiantes en clase de inglés'
      ),
      'actividades', jsonb_build_object(
        'title',        'Lo que hacemos en Idioma',
        'photoSrc',     'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
        'photoCaption', 'Clase de inglés — Ambato',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '🗣️', 'title', 'Conversación intensiva',   'desc', 'Clases enfocadas en fluidez oral, escucha activa y confianza al comunicarse.'),
          jsonb_build_object('icon', '📝', 'title', 'Preparación Cambridge',   'desc', 'Entrenamiento estructurado para los exámenes KET, PET, FCE y CAE.', 'highlight', true),
          jsonb_build_object('icon', '🎭', 'title', 'Teatro en inglés',        'desc', 'Obras y performances donde el idioma cobra vida en contextos reales y creativos.'),
          jsonb_build_object('icon', '📰', 'title', 'Debate y oratoria',       'desc', 'Argumentación y presentaciones en inglés que desarrollan pensamiento crítico.'),
          jsonb_build_object('icon', '🌐', 'title', 'Clubes de conversación',  'desc', 'Espacios extracurriculares para practicar con pares en un ambiente distendido.')
        )
      )
    ),
    'Programa de Idiomas | Atenas',
    'El programa de idiomas de la Unidad Educativa Atenas ofrece inglés intensivo, certificaciones Cambridge y un entorno de inmersión bilingüe desde los primeros años.',
    true
  ),

  -- ─── Cultura ───────────────────────────────────────────────
  (
    'espacios/cultura',
    'tpl_l_ficha_espacio',
    'Cultura',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        'title',     'Cultura',
        'subtitle',  'Arte, música, teatro y danza — la expresión creativa como lenguaje universal de formación.',
        'ghostText', 'CULTURA'
      ),
      'detalle', jsonb_build_object(
        'badge',   'Expresión Cultural',
        'heading', 'La creatividad como forma de conocer el mundo',
        'paragraphs', jsonb_build_array(
          'El espacio cultural de Atenas reconoce que el arte no es complemento sino centro de una formación integral. Música, teatro, danza y artes plásticas son disciplinas que desarrollan sensibilidad, disciplina y pensamiento creativo en cada estudiante.',
          'Desde los festivales internos hasta las presentaciones abiertas a la comunidad, los estudiantes tienen escenarios reales donde mostrar su talento y construir confianza en sí mismos.'
        ),
        'tags', jsonb_build_array('Arte', 'Música', 'Teatro', 'Danza', 'Creatividad'),
        'nota', 'En Atenas creemos que un niño que aprende a tocar un instrumento, actuar o pintar desarrolla habilidades cognitivas y emocionales que complementan y potencian su desempeño en todas las áreas académicas.',
        'ficha', jsonb_build_array(
          jsonb_build_object('label', 'Niveles',      'value', 'Todos los niveles'),
          jsonb_build_object('label', 'Modalidad',    'value', 'Presencial'),
          jsonb_build_object('label', 'Presentación', 'value', 'Festival anual',  'highlight', true),
          jsonb_build_object('label', 'Coordinación', 'value', 'Dpto. de Cultura')
        ),
        'photoSrc', 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=700&q=80',
        'photoAlt', 'Estudiantes en presentación cultural'
      ),
      'actividades', jsonb_build_object(
        'title',        'Lo que hacemos en Cultura',
        'photoSrc',     'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&q=80',
        'photoCaption', 'Festival Cultural — Atenas',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '🎵', 'title', 'Banda y orquesta',  'desc', 'Formación instrumental y agrupaciones musicales que participan en eventos locales.'),
          jsonb_build_object('icon', '🎭', 'title', 'Teatro escolar',    'desc', 'Montajes y obras que desarrollan expresión, memoria y trabajo en equipo.', 'highlight', true),
          jsonb_build_object('icon', '💃', 'title', 'Danza y folclore',  'desc', 'Expresión corporal y danzas tradicionales que conectan con la identidad cultural.'),
          jsonb_build_object('icon', '🎨', 'title', 'Artes plásticas',   'desc', 'Pintura, escultura y diseño como medios de comunicación visual y creación.'),
          jsonb_build_object('icon', '🎤', 'title', 'Coro institucional','desc', 'Agrupación vocal que representa a Atenas en eventos y competencias regionales.')
        )
      )
    ),
    'Expresión Cultural | Atenas',
    'El espacio de Cultura en la Unidad Educativa Atenas fomenta la creatividad artística a través de música, artes plásticas, teatro y danza.',
    true
  ),

  -- ─── Educación Física ──────────────────────────────────────
  (
    'espacios/educacion-fisica',
    'tpl_l_ficha_espacio',
    'Educación Física',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        'title',     'Ed. Física',
        'subtitle',  'Deporte, bienestar y disciplina — formando cuerpos y mentes que rinden al máximo nivel.',
        'ghostText', 'DEPORTE'
      ),
      'detalle', jsonb_build_object(
        'badge',   'Educación Física y Deporte',
        'heading', 'Más que ejercicio: una cultura de bienestar',
        'paragraphs', jsonb_build_array(
          'La educación física en Atenas es un espacio de formación integral donde el movimiento es un medio para desarrollar disciplina, liderazgo y trabajo en equipo. Nuestros programas abarcan desde las clases regulares hasta equipos de competencia a nivel provincial y nacional.',
          'El deporte enseña a ganar y a perder con dignidad, a perseverar ante la dificultad y a confiar en los compañeros. Estas son habilidades para la vida que el estudiante lleva consigo mucho más allá de la cancha.'
        ),
        'tags', jsonb_build_array('Deporte', 'Bienestar', 'Equipo', 'Salud', 'Competencia'),
        'nota', 'Atenas cuenta con instalaciones deportivas completas: canchas de básquet, fútbol y vóley, además de espacios para atletismo. Nuestros equipos han representado a la institución en campeonatos provinciales con resultados destacados.',
        'ficha', jsonb_build_array(
          jsonb_build_object('label', 'Niveles',      'value', 'Todos los niveles'),
          jsonb_build_object('label', 'Modalidad',    'value', 'Presencial'),
          jsonb_build_object('label', 'Competencia',  'value', 'Provincial y nacional', 'highlight', true),
          jsonb_build_object('label', 'Coordinación', 'value', 'Dpto. de Ed. Física')
        ),
        'photoSrc', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80',
        'photoAlt', 'Estudiantes en actividad deportiva'
      ),
      'actividades', jsonb_build_object(
        'title',        'Lo que hacemos en Ed. Física',
        'photoSrc',     'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80',
        'photoCaption', 'Competencia deportiva — Ambato',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '⚽', 'title', 'Fútbol y básquetbol',     'desc', 'Disciplinas principales con equipos de competencia en ligas provinciales.'),
          jsonb_build_object('icon', '🏆', 'title', 'Torneos intercolegiales', 'desc', 'Participación en competencias regionales y nacionales que forman el carácter.', 'highlight', true),
          jsonb_build_object('icon', '🤸', 'title', 'Atletismo y gimnasia',    'desc', 'Desarrollo de capacidades físicas básicas: velocidad, fuerza, equilibrio y agilidad.'),
          jsonb_build_object('icon', '🏊', 'title', 'Natación',                'desc', 'Programa de natación con piscina propia que enseña técnica y seguridad acuática.'),
          jsonb_build_object('icon', '🧘', 'title', 'Bienestar y salud',       'desc', 'Educación en hábitos saludables, nutrición y manejo del estrés para el rendimiento.')
        )
      )
    ),
    'Educación Física y Deporte | Atenas',
    'El programa deportivo de la Unidad Educativa Atenas promueve el bienestar físico, el trabajo en equipo y la formación de hábitos saludables desde la infancia.',
    true
  ),

  -- ─── Intercambio ───────────────────────────────────────────
  (
    'espacios/intercambio',
    'tpl_l_ficha_espacio',
    'Intercambio Internacional',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'ESPACIOS DE DESARROLLO',
        'title',     'Intercambio',
        'subtitle',  'Experiencias internacionales que amplían horizontes y forman ciudadanos del mundo.',
        'ghostText', 'GLOBAL'
      ),
      'detalle', jsonb_build_object(
        'badge',   'Programa de Intercambio Internacional',
        'heading', 'El mundo como aula de aprendizaje',
        'paragraphs', jsonb_build_array(
          'El programa de intercambio de Atenas abre la puerta para que nuestros estudiantes vivan experiencias educativas en el extranjero, conviviendo con familias locales, aprendiendo nuevos idiomas y descubriendo otras culturas. A su vez, recibimos estudiantes internacionales que enriquecen nuestra comunidad.',
          'Estos programas están diseñados para ampliar perspectivas, desarrollar independencia y construir redes de amistad global que acompañan a los jóvenes durante toda su vida.'
        ),
        'tags', jsonb_build_array('Internacional', 'Intercambio', 'Culturas', 'Viajes', 'Globalización'),
        'nota', 'Los programas de intercambio están disponibles para estudiantes de EGB Superior y Bachillerato que cumplan con los requisitos académicos y de idioma. Las plazas son limitadas y se asignan por mérito y motivación.',
        'ficha', jsonb_build_array(
          jsonb_build_object('label', 'Niveles',      'value', 'EGB Superior y Bachillerato'),
          jsonb_build_object('label', 'Modalidad',    'value', 'Presencial internacional'),
          jsonb_build_object('label', 'Duración',     'value', '2 a 12 semanas',           'highlight', true),
          jsonb_build_object('label', 'Coordinación', 'value', 'Relaciones Internacionales')
        ),
        'photoSrc', 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80',
        'photoAlt', 'Estudiantes en programa internacional'
      ),
      'actividades', jsonb_build_object(
        'title',        'Lo que hacemos en Intercambio',
        'photoSrc',     'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80',
        'photoCaption', 'Programa internacional — Atenas',
        'items', jsonb_build_array(
          jsonb_build_object('icon', '✈️', 'title', 'Intercambios al exterior',   'desc', 'Estancias en colegios asociados de Europa, América del Norte y América Latina.'),
          jsonb_build_object('icon', '🏠', 'title', 'Familias anfitrionas',        'desc', 'Convivencia con familias locales que garantizan inmersión cultural completa.', 'highlight', true),
          jsonb_build_object('icon', '🌏', 'title', 'Estudiantes internacionales', 'desc', 'Recepción de estudiantes extranjeros que comparten sus culturas con nuestra comunidad.'),
          jsonb_build_object('icon', '🎓', 'title', 'Cursos de verano',            'desc', 'Programas intensivos de idiomas y cultura en instituciones del extranjero.'),
          jsonb_build_object('icon', '🤝', 'title', 'Red de alumni global',        'desc', 'Conexión permanente con ex-estudiantes de intercambio alrededor del mundo.')
        )
      )
    ),
    'Programa de Intercambio Internacional | Atenas',
    'El programa de intercambio de la Unidad Educativa Atenas conecta a sus estudiantes con instituciones del mundo, ampliando perspectivas y formando ciudadanos globales.',
    true
  )

) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
