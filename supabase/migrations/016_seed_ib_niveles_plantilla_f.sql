-- ============================================================
-- Migración 016 — Plantilla F + seed de subpáginas IB y Niveles
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_f_hero_academico`.
-- 2. Siembra las 10 subpáginas académicas (7 IB + 3 Niveles) con la
--    estructura completa de plantilla F (stats + intro + collage 3 fotos
--    + chips + nota + sección inferior opcional con tarjetas o plataformas).
--
-- IDEMPOTENTE: si una página ya existe, NO se sobrescribe.
-- ============================================================

-- 1. Ampliar CHECK constraint de plantillas
ALTER TABLE paginas DROP CONSTRAINT IF EXISTS paginas_plantilla_check;
ALTER TABLE paginas
  ADD CONSTRAINT paginas_plantilla_check
  CHECK (plantilla IN (
    'tpl_a_hero_texto',
    'tpl_b_hero_grid',
    'tpl_c_hero_pasos',
    'tpl_d_hero_detalle',
    'tpl_e_hero_galeria',
    'tpl_f_hero_academico'
  ));

-- 2. Seed de subpáginas IB y Niveles
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES

  -- ─── /academico/ib/atributos ──────────────────────────────────
  (
    'academico/ib/atributos',
    'tpl_f_hero_academico',
    'Atributos del Perfil IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Atributos del Perfil IB',
        'subtitle', 'Diez cualidades que definen a cada estudiante del Programa del Diploma y guían su formación integral.',
        'ghostText', 'PERFIL'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', '10 atributos que forman líderes del mundo',
        'headingHighlight', 'líderes del mundo',
        'paragraphs', jsonb_build_array(
          'El Perfil de la Comunidad de Aprendizaje del IB describe diez atributos esenciales que los estudiantes desarrollan a lo largo del Programa del Diploma. No son metas aisladas, sino disposiciones que se integran profundamente en cada materia, actividad y proyecto.',
          'En Atenas, estos atributos se cultivan en el aula, en los proyectos de CAS y en cada interacción cotidiana. Son la brújula que orienta a nuestros graduados dentro y fuera de Ecuador.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'CAS'),
          jsonb_build_object('texto', 'Monografía'),
          jsonb_build_object('texto', 'Teoría del Conocimiento'),
          jsonb_build_object('texto', 'Grupos de asignaturas'),
          jsonb_build_object('texto', 'Evaluación externa IB')
        ),
        'note', 'El Perfil de la Comunidad de Aprendizaje se aplica a toda la comunidad escolar: estudiantes, docentes y familias participan activamente en su construcción.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80',
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Los 10 atributos',
        'titulo', 'Perfil de la Comunidad de Aprendizaje IB',
        'bgPhoto', 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1400&q=80',
        'columnas', 5,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Indagadores',          'description', 'Desarrollan curiosidad natural y habilidades para investigar. Aprenden con entusiasmo y mantienen ese amor por el aprendizaje a lo largo de toda su vida.'),
          jsonb_build_object('title', 'Informados e instruidos','description', 'Exploran conceptos, ideas y problemas de importancia local y mundial. Para ello adquieren un conocimiento profundo en una amplia gama de disciplinas.'),
          jsonb_build_object('title', 'Pensadores',           'description', 'Ejercitan la iniciativa para aplicar habilidades de pensamiento crítico y creativo. Toman decisiones razonadas y éticas ante problemas complejos.'),
          jsonb_build_object('title', 'Buenos comunicadores', 'description', 'Se expresan con confianza y creatividad en más de un idioma. Colaboran eficazmente con otros y escuchan activamente perspectivas diversas.'),
          jsonb_build_object('title', 'Íntegros',             'description', 'Actúan con integridad y honestidad, con un profundo sentido de la equidad, la justicia y el respeto por la dignidad de las personas y de los grupos.'),
          jsonb_build_object('title', 'De mente abierta',     'description', 'Valoran críticamente su propia cultura e historia personal. Buscan y consideran los puntos de vista de otros y están dispuestos a aprender de la experiencia.'),
          jsonb_build_object('title', 'Solidarios',           'description', 'Demuestran empatía, compasión y respeto. Tienen un compromiso personal con el servicio y actúan positivamente para mejorar la vida de otros.'),
          jsonb_build_object('title', 'Audaces',              'description', 'Abordan la incertidumbre con previsión y determinación. Exploran ideas y estrategias nuevas con coraje e ingenio, y defienden sus convicciones.'),
          jsonb_build_object('title', 'Equilibrados',         'description', 'Comprenden la importancia del equilibrio entre sus aspectos físico, mental y emocional, y del bienestar propio y ajeno para lograr una vida plena.'),
          jsonb_build_object('title', 'Reflexivos',           'description', 'Evalúan detenidamente el mundo y sus propias ideas y experiencias. Se esfuerzan por comprender sus fortalezas y limitaciones para aprender y crecer.')
        )
      )
    ),
    'Atributos del Perfil IB — Unidad Educativa Atenas',
    'Los 10 atributos del Perfil de la Comunidad de Aprendizaje IB que guían la formación de estudiantes íntegros, indagadores y comprometidos con el mundo.',
    true
  ),

  -- ─── /academico/ib/capacitacion ───────────────────────────────
  (
    'academico/ib/capacitacion',
    'tpl_f_hero_academico',
    'Capacitación Docente IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Capacitación Docente IB',
        'subtitle', 'Detrás de cada estudiante IB hay un docente certificado por el IBO y comprometido con la excelencia educativa.',
        'ghostText', 'DOCENTES'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', 'Docentes certificados que inspiran el pensamiento global',
        'headingHighlight', 'pensamiento global',
        'paragraphs', jsonb_build_array(
          'El éxito del Programa del Diploma depende en gran medida de la calidad de su cuerpo docente. En Atenas, todos los profesores del Diploma cuentan con certificación oficial del IBO y participan en programas de formación continua cada año.',
          'Nuestros docentes no solo enseñan contenidos: facilitan el pensamiento crítico, guían procesos de investigación independiente y forman parte activa de las redes de educadores IB de América Latina.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Talleres IBO Cat. 1'),
          jsonb_build_object('texto', 'Talleres IBO Cat. 2/3'),
          jsonb_build_object('texto', 'TdC'),
          jsonb_build_object('texto', 'Monografía'),
          jsonb_build_object('texto', 'Comunidades IB'),
          jsonb_build_object('texto', 'Actualización curricular')
        ),
        'note', 'El Colegio Atenas invierte cada año en la formación y certificación de su equipo docente IB, garantizando que cada asignatura esté cubierta por un especialista certificado por el IBO.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80',
          'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80',
          'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Programa de formación',
        'titulo', 'Modalidades de capacitación docente IB',
        'bgPhoto', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&q=80',
        'columnas', 3,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Talleres Categoría 1 IBO',      'description', 'Formación introductoria oficial del IBO para docentes que se incorporan al Programa del Diploma. Cubre filosofía, evaluación y planificación de unidades.'),
          jsonb_build_object('title', 'Talleres Categoría 2 y 3',       'description', 'Formación avanzada para docentes con experiencia en el Diploma. Profundiza en diseño de tareas de evaluación interna y técnicas pedagógicas específicas.'),
          jsonb_build_object('title', 'Formación en TdC',                'description', 'Capacitación especializada para los docentes responsables de Teoría del Conocimiento: facilitación de debates, criterios de ensayo y presentación.'),
          jsonb_build_object('title', 'Coordinación Monografía',         'description', 'Entrenamiento para supervisores de la Monografía: acompañamiento al proceso de investigación, sesiones de reflexión y criterios de evaluación.'),
          jsonb_build_object('title', 'Comunidades de Aprendizaje IB',   'description', 'Participación en redes de docentes IB de América Latina para compartir buenas prácticas, materiales y estrategias de evaluación.'),
          jsonb_build_object('title', 'Actualización Curricular Continua','description', 'Revisión anual de las guías de asignatura del IBO y actualización de las unidades de indagación según los cambios en los programas de evaluación.')
        )
      )
    ),
    'Capacitación Docente IB — Unidad Educativa Atenas',
    'El equipo docente del Bachillerato IB de la Unidad Educativa Atenas cuenta con certificaciones oficiales del IBO y formación continua en metodología internacional.',
    true
  ),

  -- ─── /academico/ib/documentos ────────────────────────────────
  (
    'academico/ib/documentos',
    'tpl_f_hero_academico',
    'Documentos IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Documentos IB',
        'subtitle', 'Recursos oficiales del Programa del Diploma para que estudiantes y familias conozcan el programa a fondo.',
        'ghostText', 'DOCS'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', 'Todo lo que necesitas saber sobre el Diploma IB',
        'headingHighlight', 'Diploma IB',
        'paragraphs', jsonb_build_array(
          'El Programa del Diploma IB funciona bajo una normativa clara y pública. En Atenas ponemos a disposición de toda la comunidad los documentos oficiales y las políticas institucionales que rigen el proceso educativo de nuestros bachilleres.',
          'La transparencia documental es parte fundamental de la cultura IB: entender las reglas, los criterios y los recursos disponibles es la base para que estudiantes y familias tomen decisiones informadas.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Monografía'),
          jsonb_build_object('texto', 'CAS'),
          jsonb_build_object('texto', 'TdC'),
          jsonb_build_object('texto', 'Evaluación interna'),
          jsonb_build_object('texto', 'Evaluación externa IBO'),
          jsonb_build_object('texto', 'Honestidad académica')
        ),
        'note', 'Todos los documentos están disponibles en formato digital. Para solicitar copias impresas o aclaraciones, comunícate con la Coordinación IB.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80',
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Documentos disponibles',
        'titulo', 'Recursos oficiales del Programa del Diploma',
        'bgPhoto', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1400&q=80',
        'columnas', 4,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Guía del Programa del Diploma',           'description', 'Documento oficial del IBO con la estructura completa del Diploma, requisitos de evaluación, núcleo del programa y criterios de acreditación.'),
          jsonb_build_object('title', 'Reglamento del Diploma IB',                'description', 'Normativa institucional que regula la participación, los derechos y las obligaciones de los estudiantes del Programa del Diploma en Atenas.'),
          jsonb_build_object('title', 'Guía de la Monografía',                    'description', 'Orientaciones paso a paso para la elaboración del ensayo de investigación independiente de 4 000 palabras exigido por el IBO.'),
          jsonb_build_object('title', 'Guía CAS',                                 'description', 'Lineamientos para el componente Creatividad, Actividad y Servicio: objetivos de aprendizaje, portafolio y requisitos de reflexión.'),
          jsonb_build_object('title', 'Política Académica de Honestidad',         'description', 'Principios y procedimientos institucionales sobre integridad académica, citación de fuentes y consecuencias de las faltas dentro del Programa IB.'),
          jsonb_build_object('title', 'Política de Evaluación',                   'description', 'Criterios de evaluación interna y externa, ponderaciones, fechas límite de entrega y procedimientos de revisión de notas del IBO.'),
          jsonb_build_object('title', 'Política de Inclusión y Necesidades Especiales','description', 'Protocolo para solicitar arreglos de evaluación especiales ante el IBO para estudiantes con necesidades de aprendizaje diagnosticadas.')
        )
      )
    ),
    'Documentos IB — Unidad Educativa Atenas',
    'Documentos oficiales del Programa del Diploma IB en la Unidad Educativa Atenas: guías, reglamentos y recursos para estudiantes y familias.',
    true
  ),

  -- ─── /academico/ib/escuela-padres ────────────────────────────
  (
    'academico/ib/escuela-padres',
    'tpl_f_hero_academico',
    'Escuela de Padres IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Escuela de Padres IB',
        'subtitle', 'El acompañamiento familiar es parte esencial del éxito en el Programa del Diploma. Aquí encontrarás todo lo que necesitas.',
        'ghostText', 'FAMILIA'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', 'Familias informadas, estudiantes que brillan en el mundo',
        'headingHighlight', 'brillan en el mundo',
        'paragraphs', jsonb_build_array(
          'El IBO reconoce a las familias como parte activa de la comunidad de aprendizaje. En Atenas hemos diseñado un programa de acompañamiento para que madres, padres y representantes comprendan el Diploma y apoyen el proceso de sus hijos desde casa.',
          'Desde los talleres de inducción hasta el canal directo con la coordinación, cada actividad está pensada para reducir la incertidumbre y fortalecer la confianza en el proceso educativo.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Talleres presenciales'),
          jsonb_build_object('texto', 'Reuniones trimestrales'),
          jsonb_build_object('texto', 'Canal directo coordinación'),
          jsonb_build_object('texto', 'Recursos digitales'),
          jsonb_build_object('texto', 'Bienestar emocional')
        ),
        'note', 'La participación en el Taller de Inducción IB es obligatoria para todas las familias al inicio del Programa del Diploma.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
          'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80',
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Programa de acompañamiento',
        'titulo', 'Actividades y recursos para familias IB',
        'bgPhoto', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80',
        'columnas', 3,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Taller de Inducción IB',                'description', 'Sesión obligatoria al inicio del programa donde familias comprenden la estructura del Diploma, los componentes del núcleo y el rol de apoyo en casa.'),
          jsonb_build_object('title', 'Sesiones Informativas Trimestrales',    'description', 'Reuniones con la Coordinación IB para revisar avances académicos, fechas clave de entrega y resultados de evaluaciones internas.'),
          jsonb_build_object('title', 'Taller Monografía para Familias',       'description', 'Guía práctica sobre cómo acompañar el proceso de investigación independiente sin interferir en la autoría del estudiante.'),
          jsonb_build_object('title', 'Bienestar y Manejo del Estrés',          'description', 'Charlas con profesionales de psicología sobre estrategias para apoyar el equilibrio emocional de los bachilleres IB en períodos de exámenes.'),
          jsonb_build_object('title', 'Canal Coordinación IB',                  'description', 'Acceso directo al equipo de coordinación para consultas específicas sobre el desempeño académico y los procesos de evaluación del IBO.'),
          jsonb_build_object('title', 'Guía de Recursos Digitales',             'description', 'Orientación sobre las plataformas (Idukay, eLibro, Aleks) y las bases de datos académicas disponibles para que los estudiantes trabajen desde casa.')
        )
      )
    ),
    'Escuela de Padres IB — Unidad Educativa Atenas',
    'Programa de acompañamiento para familias del Bachillerato IB en la Unidad Educativa Atenas: talleres, recursos y canal directo con la coordinación.',
    true
  ),

  -- ─── /academico/ib/infraestructura ───────────────────────────
  (
    'academico/ib/infraestructura',
    'tpl_f_hero_academico',
    'Infraestructura IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Infraestructura IB',
        'subtitle', 'Espacios y recursos pensados para el rigor académico y la exploración que exige el Programa del Diploma.',
        'ghostText', 'ESPACIOS'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', 'Instalaciones al nivel de los mejores colegios IB del mundo',
        'headingHighlight', 'mejores colegios IB del mundo',
        'paragraphs', jsonb_build_array(
          'El Programa del Diploma exige entornos de aprendizaje especializados. En Atenas hemos invertido en laboratorios, espacios de debate y tecnología que permiten a nuestros estudiantes desarrollar el trabajo experimental y la investigación que el IBO requiere.',
          'Cada espacio ha sido diseñado o adaptado específicamente para las demandas del Diploma: desde el laboratorio de ciencias certificado hasta las aulas de Teoría del Conocimiento con disposición flexible.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Laboratorio certificado IB'),
          jsonb_build_object('texto', 'Biblioteca digital'),
          jsonb_build_object('texto', 'Videoconferencia'),
          jsonb_build_object('texto', 'Software académico'),
          jsonb_build_object('texto', 'Espacios CAS')
        ),
        'note', 'Nuestras instalaciones son evaluadas periódicamente por el IBO como parte del proceso de acreditación y visitas de verificación.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
          'https://images.unsplash.com/photo-1581093804475-577d72e13cba?w=600&q=80',
          'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Instalaciones',
        'titulo', 'Espacios diseñados para el aprendizaje del siglo XXI',
        'bgPhoto', 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80',
        'columnas', 3,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Laboratorio de Ciencias',          'description', 'Equipado con instrumentos de precisión para experimentos de Biología, Química y Física a nivel de diploma. Cumple los estándares IB para trabajo experimental.'),
          jsonb_build_object('title', 'Sala Multimedia IB',                'description', 'Espacio exclusivo para las clases del Diploma con proyección 4K, sistema de videoconferencia y acceso a bases de datos académicas internacionales.'),
          jsonb_build_object('title', 'Biblioteca y Centro de Recursos',   'description', 'Colección actualizada de textos en inglés y español, acceso a eLibro y a la Biblioteca Virtual Institucional con más de 80 000 títulos digitales.'),
          jsonb_build_object('title', 'Aulas de Debate y TdC',             'description', 'Diseñadas con disposición flexible para favorecer el diálogo socrático y las sesiones de Teoría del Conocimiento que exige el Programa del Diploma.'),
          jsonb_build_object('title', 'Laboratorio de Tecnología',         'description', 'Equipos con software especializado para proyectos de Matemáticas con Tecnología, Informática y gestión de datos estadísticos en Ciencias.'),
          jsonb_build_object('title', 'Espacio CAS',                        'description', 'Área de coordinación de Creatividad, Actividad y Servicio donde los estudiantes planifican y documentan sus proyectos con acompañamiento docente.')
        )
      )
    ),
    'Infraestructura IB — Unidad Educativa Atenas',
    'Instalaciones y recursos especializados que apoyan el aprendizaje del Programa del Diploma IB en la Unidad Educativa Atenas, Ambato.',
    true
  ),

  -- ─── /academico/ib/politicas ─────────────────────────────────
  (
    'academico/ib/politicas',
    'tpl_f_hero_academico',
    'Políticas del Programa IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Políticas del Programa IB',
        'subtitle', 'Un marco claro y transparente que protege la integridad del Diploma y el bienestar de cada estudiante.',
        'ghostText', 'NORMAS'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', 'Claridad y coherencia en cada aspecto del Programa',
        'headingHighlight', 'cada aspecto del Programa',
        'paragraphs', jsonb_build_array(
          'Las políticas del Programa del Diploma IB no son restricciones; son compromisos que la institución asume con sus estudiantes, familias y con el IBO. Cada política fue desarrollada en consulta con la comunidad escolar y es revisada anualmente.',
          'Conocerlas es el primer paso para participar con confianza en el programa: saber qué se espera, cómo se evalúa y qué apoyo recibirás en cada etapa del proceso.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Honestidad académica'),
          jsonb_build_object('texto', 'Evaluación IB'),
          jsonb_build_object('texto', 'Inclusión'),
          jsonb_build_object('texto', 'Bienestar'),
          jsonb_build_object('texto', 'Uso de tecnología'),
          jsonb_build_object('texto', 'Idiomas'),
          jsonb_build_object('texto', 'Admisión')
        ),
        'note', 'Todas las políticas institucionales son documentos públicos disponibles en la Coordinación IB. Se revisan y actualizan cada año lectivo en coordinación con el IBO.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
          'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Marco de políticas',
        'titulo', 'Políticas institucionales del Programa del Diploma IB',
        'bgPhoto', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80',
        'columnas', 4,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Política de Honestidad Académica',     'description', 'Define los principios de integridad que guían el trabajo de estudiantes y docentes, incluyendo criterios de citación y consecuencias de las faltas académicas.'),
          jsonb_build_object('title', 'Política de Evaluación',                'description', 'Establece los procedimientos de evaluación interna y externa, criterios de calificación, retroalimentación y mecanismos de revisión de notas del IBO.'),
          jsonb_build_object('title', 'Política de Inclusión y Accesibilidad','description', 'Marco para garantizar que todos los estudiantes, independientemente de sus necesidades, tengan acceso equitativo al Programa del Diploma.'),
          jsonb_build_object('title', 'Política de Bienestar Estudiantil',     'description', 'Compromisos institucionales para apoyar la salud mental, el equilibrio emocional y la gestión del estrés durante los dos años del Diploma.'),
          jsonb_build_object('title', 'Política de Admisión al Programa',      'description', 'Criterios de selección y proceso de admisión para el ingreso al Programa del Diploma IB en 1ro de Bachillerato.'),
          jsonb_build_object('title', 'Política de Uso de Tecnología',         'description', 'Lineamientos sobre el uso responsable de herramientas digitales, inteligencia artificial y recursos en línea en el marco del Programa del Diploma.'),
          jsonb_build_object('title', 'Política de Idiomas',                   'description', 'Definición del perfil lingüístico del colegio y los criterios para la selección de las asignaturas de Lengua A y Lengua B en el Diploma.')
        )
      )
    ),
    'Políticas IB — Unidad Educativa Atenas',
    'Políticas institucionales que rigen el Programa del Diploma IB en la Unidad Educativa Atenas: honestidad académica, evaluación, inclusión y bienestar.',
    true
  ),

  -- ─── /academico/ib/visitas ───────────────────────────────────
  (
    'academico/ib/visitas',
    'tpl_f_hero_academico',
    'Visitas al Programa IB',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'BACHILLERATO IB',
        'title', 'Visitas al Programa IB',
        'subtitle', 'Ver para creer. Te invitamos a conocer de primera mano los espacios y el equipo que hacen posible el Diploma en Atenas.',
        'ghostText', 'VISITA'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Programa',     'value', 'Diploma del IB'),
        jsonb_build_object('label', 'Nivel',        'value', '1ro y 2do Bachillerato'),
        jsonb_build_object('label', 'Acreditación', 'value', 'IBO — International Baccalaureate')
      ),
      'intro', jsonb_build_object(
        'badge', 'Bachillerato Internacional',
        'heading', 'Vive la experiencia IB antes de decidir',
        'headingHighlight', 'antes de decidir',
        'paragraphs', jsonb_build_array(
          'Elegir el Programa del Diploma IB es una decisión significativa. Por eso en Atenas abrimos nuestras puertas para que estudiantes y familias conozcan en persona los laboratorios, las aulas, el equipo docente y los bachilleres que ya viven esta experiencia.',
          'Cada modalidad de visita está pensada para responder preguntas distintas: desde el recorrido visual hasta el día de observación en aula real, siempre con acompañamiento de nuestro equipo de coordinación.'
        ),
        'chipsLabel', 'Componentes',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Visita presencial'),
          jsonb_build_object('texto', 'Día en aula'),
          jsonb_build_object('texto', 'Charla con estudiantes'),
          jsonb_build_object('texto', 'Reunión con coordinación'),
          jsonb_build_object('texto', 'Tour virtual 360°')
        ),
        'note', 'Para agendar una visita, contáctate con secretaría al correo admisiones@atenas.edu.ec o llama al (03) 282-XXXX. Las visitas se realizan de martes a jueves en horario de 09:00 a 12:00.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80',
          'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS IB ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'tarjetas',
        'badge', 'Modalidades de visita',
        'titulo', 'Elige la opción que mejor se adapte a ti',
        'bgPhoto', 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80',
        'columnas', 3,
        'items', jsonb_build_array(
          jsonb_build_object('title', 'Visita Guiada General',           'description', 'Recorrido de 60 minutos por las instalaciones IB: laboratorios, aulas de debate, biblioteca y espacios CAS, con presentación de la coordinación.'),
          jsonb_build_object('title', 'Día de Observación en Aula',       'description', 'Estudiantes potenciales de 9no o 10mo pueden asistir como observadores a una clase del Diploma previa coordinación con secretaría.'),
          jsonb_build_object('title', 'Charla con Estudiantes IB',        'description', 'Sesión informal donde bachilleres actuales comparten su experiencia real en el programa, responden preguntas y muestran sus proyectos CAS.'),
          jsonb_build_object('title', 'Reunión con Coordinación IB',      'description', 'Entrevista privada de 30 minutos con el coordinador IB para resolver dudas específicas sobre el proceso de admisión y los requisitos del Diploma.'),
          jsonb_build_object('title', 'Visita Virtual 360°',              'description', 'Recorrido virtual interactivo por las instalaciones del colegio disponible para familias que no pueden asistir presencialmente.'),
          jsonb_build_object('title', 'Visita Delegaciones Institucionales','description', 'Atención especial para grupos de otros colegios o instituciones interesadas en el modelo educativo IB implementado en Atenas.')
        )
      )
    ),
    'Visitas al Programa IB — Unidad Educativa Atenas',
    'Conoce en persona las instalaciones y el equipo del Bachillerato IB de la Unidad Educativa Atenas. Agenda una visita guiada o un día de observación.',
    true
  ),

  -- ─── /academico/niveles/inicial ──────────────────────────────
  (
    'academico/niveles/inicial',
    'tpl_f_hero_academico',
    'Educación Inicial',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'ACADÉMICO',
        'title', 'Educación Inicial',
        'subtitle', 'Metodología Montessori, Reggio Emilia y ABN para los primeros años de vida.',
        'ghostText', 'INICIAL'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Grados',           'value', 'Pre-Kinder y Kinder'),
        jsonb_build_object('label', 'Rango de edades',  'value', '3–5 años'),
        jsonb_build_object('label', 'Institución',      'value', 'Unidad Educativa Atenas')
      ),
      'intro', jsonb_build_object(
        'badge', 'Educación Inicial',
        'heading', 'Metodologías de clase mundial',
        'paragraphs', jsonb_build_array(
          'Nuestra metodología en Educación Inicial está basada en las filosofías de María Montessori, Reggio Emilia y ABN (Algoritmos Basados en Números), abordando el orden, la concentración, el respeto por los otros y por sí mismo, la autonomía, la independencia, la iniciativa, la capacidad de elegir, el desarrollo de la voluntad y la autodisciplina.',
          'El entorno de aprendizaje está diseñado para despertar la curiosidad natural del niño, permitiéndole explorar, descubrir y construir su propio conocimiento en un ambiente estructurado, respetuoso y estimulante.'
        ),
        'chipsLabel', 'Metodologías',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Montessori'),
          jsonb_build_object('texto', 'Reggio Emilia'),
          jsonb_build_object('texto', 'ABN')
        ),
        'note', 'Una hora diaria de inglés totalmente integrada al entorno escolar desde los primeros años, con enfoque natural y lúdico. Los estudiantes integran los aprendizajes paralelamente a los contenidos en español.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
          'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&q=80',
          'https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS ★'
      ),
      'seccionInferior', jsonb_build_object('tipo', 'ninguna')
    ),
    'Educación Inicial — Unidad Educativa Atenas',
    'Metodología Montessori, Reggio Emilia y ABN para los primeros años. Inglés integrado desde Pre-Kinder en la Unidad Educativa Atenas, Ambato.',
    true
  ),

  -- ─── /academico/niveles/egb-elemental-media ──────────────────
  (
    'academico/niveles/egb-elemental-media',
    'tpl_f_hero_academico',
    'EGB Elemental y Media',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'ACADÉMICO',
        'title', 'EGB Elemental y Media',
        'subtitle', 'Formación integral con CLIL, PBL y plataformas digitales de matemáticas de clase mundial.',
        'ghostText', 'EGB'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Grados',           'value', '1ro a 7mo EGB'),
        jsonb_build_object('label', 'Rango de edades',  'value', '5–12 años'),
        jsonb_build_object('label', 'Institución',      'value', 'Unidad Educativa Atenas')
      ),
      'intro', jsonb_build_object(
        'badge', 'EGB Elemental y Media',
        'heading', 'Innovación pedagógica en cada etapa',
        'paragraphs', jsonb_build_array(
          'En las áreas de básica elemental y media, promovemos una formación integral que combina valores, conocimiento e innovación pedagógica, en un ambiente de respeto, colaboración y entusiasmo por aprender. Nuestros estudiantes desarrollan destrezas en las cuatro áreas del aprendizaje, fortalecidas a través del trabajo colaborativo, la lectura comprensiva, la expresión artística y la formación deportiva.',
          'La enseñanza del inglés como segunda lengua se implementa mediante la metodología CLIL (Content and Language Integrated Learning), que promueve la inmersión lingüística y potencia las habilidades productivas y receptivas, complementada con PBL (Project-Based Learning) e integración de asignaturas de History y Science.'
        ),
        'chipsLabel', 'Metodologías',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'CLIL'),
          jsonb_build_object('texto', 'PBL'),
          jsonb_build_object('texto', 'Grammar Communicative'),
          jsonb_build_object('texto', 'ABN (hasta 4to EGB)')
        ),
        'note', 'Mangahigh y ALEKS son plataformas líderes mundiales de matemáticas adaptativas que ajustan el nivel de cada estudiante en tiempo real, garantizando un aprendizaje progresivo y motivador.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80',
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS ★'
      ),
      'seccionInferior', jsonb_build_object(
        'tipo', 'plataformas',
        'badge', 'Plataformas digitales',
        'titulo', 'Herramientas de clase mundial',
        'bgPhoto', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1440&q=80',
        'items', jsonb_build_array(
          jsonb_build_object('name', 'Mangahigh', 'detail', 'Plataforma gamificada de matemáticas para 2do a 5to EGB. Adapta los ejercicios al nivel de cada estudiante con retroalimentación inmediata.'),
          jsonb_build_object('name', 'ALEKS',     'detail', 'Sistema adaptativo de aprendizaje matemático para 6to y 7mo EGB, que evalúa el conocimiento real del estudiante y genera rutas personalizadas.')
        )
      )
    ),
    'EGB Elemental y Media — Unidad Educativa Atenas',
    'Inglés integrado con CLIL, aprendizaje por proyectos y plataformas Mangahigh y ALEKS para matemáticas. 1ro a 7mo EGB en la Unidad Educativa Atenas, Ambato.',
    true
  ),

  -- ─── /academico/niveles/egb-superior ─────────────────────────
  (
    'academico/niveles/egb-superior',
    'tpl_f_hero_academico',
    'EGB Superior',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'ACADÉMICO',
        'title', 'EGB Superior',
        'subtitle', 'Consolidación académica y preparación para el bachillerato en un entorno de excelencia.',
        'ghostText', 'SUPERIOR'
      ),
      'stats', jsonb_build_array(
        jsonb_build_object('label', 'Grados',           'value', '8vo a 10mo EGB'),
        jsonb_build_object('label', 'Rango de edades',  'value', '12–14 años'),
        jsonb_build_object('label', 'Institución',      'value', 'Unidad Educativa Atenas')
      ),
      'intro', jsonb_build_object(
        'badge', 'EGB Superior',
        'heading', 'Consolidación y preparación para el bachillerato',
        'paragraphs', jsonb_build_array(
          'La EGB Superior es una etapa de consolidación donde los estudiantes afianzan todas las áreas del conocimiento y desarrollan habilidades de pensamiento crítico, investigación y comunicación que los preparan para el bachillerato.',
          'Contamos con acompañamiento docente personalizado, orientación vocacional progresiva e inglés avanzado, asegurando que cada estudiante llegue al bachillerato con una base sólida y la confianza necesaria para elegir su camino.'
        ),
        'chipsLabel', 'Metodologías',
        'chips', jsonb_build_array(
          jsonb_build_object('texto', 'Inglés avanzado'),
          jsonb_build_object('texto', 'Orientación vocacional'),
          jsonb_build_object('texto', 'Pensamiento crítico')
        ),
        'note', 'El contenido pedagógico detallado de este nivel estará disponible próximamente, en coordinación con el equipo académico de la Unidad Educativa Atenas.',
        'photos', jsonb_build_array(
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
          'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80',
          'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80'
        ),
        'badgeCollage', 'ATENAS ★'
      ),
      'seccionInferior', jsonb_build_object('tipo', 'ninguna')
    ),
    'EGB Superior — Unidad Educativa Atenas',
    'Etapa de consolidación y transición hacia el bachillerato. 8vo a 10mo EGB en la Unidad Educativa Atenas, Ambato.',
    true
  )

) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
