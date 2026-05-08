-- ============================================================
-- Migración 017 — Plantilla G + seed landing /academico/ib
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_g_landing_ib` y `tpl_h_landing_niveles`.
-- 2. Siembra la landing `/academico/ib` con plantilla G (5 bloques:
--    Hero + Núcleo + Materias + Proceso + Explorar).
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
    'tpl_h_landing_niveles'
  ));

-- 2. Seed landing IB
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'academico/ib',
    'tpl_g_landing_ib',
    'Bachillerato Internacional IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'bgImageSrc', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1440&q=80',
        'ghostText', 'DIPLOMA IB',
        'badge', 'BACHILLERATO INTERNACIONAL',
        'titleLine1', 'Piensa global.',
        'titleLine2', 'Diploma IB.',
        'subtitle', 'El único colegio en el centro del país con el Programa del Diploma IB acreditado. Formamos jóvenes solidarios, informados y ávidos de conocimiento para universidades nacionales e internacionales.',
        'subtitleHighlight', 'jóvenes solidarios, informados y ávidos de conocimiento',
        'ctaPrimary',   jsonb_build_object('text', 'Solicitar información', 'href', '#proceso'),
        'ctaSecondary', jsonb_build_object('text', 'Agendar visita',       'href', '/admisiones#visita'),
        'floatingPhotos', jsonb_build_array(
          'https://atenas.edu.ec/wp-content/uploads/2023/03/FOTOGRAFIA-IB-1024x798.jpg',
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80'
        ),
        'floatingBadgeLine1', 'ÚNICO EN EL CENTRO',
        'floatingBadgeLine2', 'DEL PAÍS ★',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'CAS'),
          jsonb_build_object('texto', 'Monografía'),
          jsonb_build_object('texto', 'Teoría del Conocimiento'),
          jsonb_build_object('texto', '16-18 años')
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('value', 'ÚNICO', 'label', 'En el centro del país'),
          jsonb_build_object('value', '150+',  'label', 'Universidades que reconocen el IB'),
          jsonb_build_object('value', '4.000', 'label', 'Palabras — Extended Essay'),
          jsonb_build_object('value', '90+',   'label', 'Países con colegios IB')
        )
      ),

      'nucleo', jsonb_build_object(
        'badge', 'El núcleo del Diploma',
        'heading', 'Tres componentes que definen a un graduado IB.',
        'headingHighlight', 'definen a un graduado IB.',
        'descripcion', 'Más allá de las asignaturas, el Diploma IB exige un compromiso real con el mundo a través de tres pilares fundamentales.',
        'componentes', jsonb_build_array(
          jsonb_build_object(
            'icon', '🎨',
            'title', 'CAS',
            'sub',   'Creatividad, Actividad y Servicio',
            'desc',  'Desarrolla creatividad, actividad física y compromiso con el servicio comunitario. 150 horas de experiencias fuera del aula que forman el carácter, el liderazgo y la responsabilidad social.'
          ),
          jsonb_build_object(
            'icon', '📝',
            'title', 'Monografía',
            'sub',   'Extended Essay — 4.000 palabras',
            'desc',  'Trabajo de investigación independiente de 4.000 palabras sobre un tema de elección del estudiante. Desarrolla pensamiento crítico, análisis profundo y escritura académica de nivel universitario.'
          ),
          jsonb_build_object(
            'icon', '🌍',
            'title', 'Teoría del Conocimiento',
            'sub',   'Theory of Knowledge (TdC)',
            'desc',  'Asignatura que cuestiona cómo sabemos lo que sabemos. Debate filosófico, ensayo argumentativo y análisis de las formas de conocimiento que desarrollan el pensamiento reflexivo.',
            'highlight', true
          )
        ),
        'fotoPrincipal', jsonb_build_object(
          'src', 'https://atenas.edu.ec/wp-content/uploads/2023/03/FOTOGRAFIA-IB-1024x798.jpg',
          'caption', 'Estudiantes del Programa IB en Atenas'
        ),
        'fotoSecundaria', jsonb_build_object(
          'src', 'https://atenas.edu.ec/wp-content/uploads/2023/03/Nucleo-1.jpg',
          'caption', 'El núcleo del Diploma IB'
        )
      ),

      'materias', jsonb_build_object(
        'badge', 'Currículo IB',
        'heading', '6 grupos de asignaturas.',
        'headingHighlight', 'asignaturas.',
        'descripcion', 'Cada estudiante selecciona una asignatura de cada grupo: al menos 3 a nivel superior (HL) y 3 a nivel medio (SL).',
        'grupos', jsonb_build_array(
          jsonb_build_object('num', '01', 'title', 'Estudios en Lengua y Literatura', 'detail', 'Español e inglés a nivel literario y crítico',          'color', 'white'),
          jsonb_build_object('num', '02', 'title', 'Adquisición de Lenguas',           'detail', 'Inglés como lengua B — nivel avanzado',                  'color', 'white'),
          jsonb_build_object('num', '03', 'title', 'Individuos y Sociedades',          'detail', 'Historia, Economía, Psicología, Geografía',              'color', 'white'),
          jsonb_build_object('num', '04', 'title', 'Ciencias',                         'detail', 'Biología, Química, Física, Informática',                 'color', 'navy'),
          jsonb_build_object('num', '05', 'title', 'Matemáticas',                      'detail', 'Análisis y Abordajes · Aplicaciones e Interpretación',   'color', 'navy'),
          jsonb_build_object('num', '06', 'title', 'Artes',                            'detail', 'Teatro, Artes Visuales, Música',                          'color', 'gold')
        ),
        'nota', 'HL (Higher Level) — mínimo 240 horas de estudio · SL (Standard Level) — mínimo 150 horas · Los estudiantes eligen su combinación según sus metas universitarias.'
      ),

      'proceso', jsonb_build_object(
        'bgImageSrc', 'https://atenas.edu.ec/wp-content/uploads/2023/03/FOTOGRAFIA-IB-1024x798.jpg',
        'badge', 'Admisión al programa',
        'heading', 'Proceso de ingreso a 1ro IB.',
        'headingHighlight', 'a 1ro IB.',
        'pasos', jsonb_build_array(
          jsonb_build_object('num', '01', 'title', 'Presentación de documentación',  'desc', 'Entrega de notas, certificados y formulario de postulación al Programa IB.'),
          jsonb_build_object('num', '02', 'title', 'Evaluación DECE',                 'desc', 'El Departamento de Consejería Estudiantil evalúa el perfil emocional y vocacional del estudiante.'),
          jsonb_build_object('num', '03', 'title', 'Evaluaciones académicas',         'desc', 'Prueba de razonamiento verbal y matemático para verificar el nivel requerido por el programa.'),
          jsonb_build_object('num', '04', 'title', 'Revisión del comité de admisión', 'desc', 'El equipo IB del Atenas analiza el expediente completo y toma la decisión de admisión.'),
          jsonb_build_object('num', '05', 'title', 'Orientación al programa',         'desc', 'Sesión de inducción con el coordinador IB, familias y futuros estudiantes antes de iniciar.')
        ),
        'aliados', jsonb_build_object(
          'titulo', 'Aliados del programa',
          'items', jsonb_build_array(
            jsonb_build_object('name', 'International Baccalaureate Organization', 'short', 'IBO'),
            jsonb_build_object('name', 'Pearson',                                   'short', 'Pearson'),
            jsonb_build_object('name', 'Universidad San Francisco de Quito',        'short', 'USFQ'),
            jsonb_build_object('name', 'EF Education',                              'short', 'EF'),
            jsonb_build_object('name', 'SGS',                                       'short', 'SGS')
          )
        ),
        'cta', jsonb_build_object(
          'titulo',      '¿Listo para dar el paso?',
          'descripcion', 'El proceso de admisión IB abre cada año. Agenda una visita para conocer el programa de cerca.',
          'btnText',     'Agendar visita al colegio',
          'btnHref',     '/admisiones#visita'
        )
      ),

      'explorar', jsonb_build_object(
        'badge', 'Explora el Programa',
        'heading', 'Todo lo que necesitas saber sobre el IB',
        'descripcion', 'Desde los atributos del perfil hasta la capacitación de los docentes: cada sección responde una pregunta clave sobre el Programa del Diploma en Atenas.',
        'secciones', jsonb_build_array(
          jsonb_build_object('slug', 'atributos',       'icon', '★',     'title', 'Atributos del Perfil IB', 'desc', 'Los 10 rasgos que definen a cada estudiante del Diploma: indagadores, íntegros, equilibrados y más.'),
          jsonb_build_object('slug', 'infraestructura', 'icon', '🏛',     'title', 'Infraestructura IB',       'desc', 'Laboratorios, aulas de debate, biblioteca digital y espacios CAS diseñados para el nivel del Diploma.'),
          jsonb_build_object('slug', 'documentos',      'icon', '📄',     'title', 'Documentos IB',            'desc', 'Guías oficiales del IBO, reglamentos, política de honestidad académica y recursos del programa.'),
          jsonb_build_object('slug', 'escuela-padres',  'icon', '👨‍👩‍👧', 'title', 'Escuela de Padres',       'desc', 'Talleres, sesiones informativas y canal directo con la coordinación para acompañar el proceso IB.'),
          jsonb_build_object('slug', 'visitas',         'icon', '🗺',     'title', 'Visitas al Programa',      'desc', 'Conoce las instalaciones IB en persona: visita guiada, día de observación o charla con estudiantes.'),
          jsonb_build_object('slug', 'politicas',       'icon', '📋',     'title', 'Políticas del Programa',   'desc', 'Marco institucional: evaluación, inclusión, honestidad académica, bienestar y uso de tecnología.'),
          jsonb_build_object('slug', 'capacitacion',    'icon', '🎓',     'title', 'Capacitación Docente',     'desc', 'Equipo certificado por el IBO con formación continua en metodología internacional y evaluación.')
        )
      )
    ),
    'Bachillerato Internacional IB — Unidad Educativa Atenas',
    'El único colegio en el centro del país con el Programa del Diploma IB acreditado. CAS, Monografía, Teoría del Conocimiento y 6 grupos de asignaturas para universidades del mundo.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
