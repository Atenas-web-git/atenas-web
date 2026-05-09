-- ============================================================
-- Migración 025 — Plantilla K + seed /servicios/* (8 fichas)
-- Backoffice Atenas — Fase 3 (sesión 28)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_k_ficha_servicio`.
-- 2. Siembra las 8 fichas de servicios institucionales con la plantilla
--    K (Hero + ficha con icono Lucide + 3 stats + collage de 3 fotos +
--    descripción en párrafos + pasos), replicando el contenido actual
--    hardcodeado en `src/data/servicios.ts`.
--
-- Casos especiales que se preservan en código (no editables desde el CMS):
--   * /servicios/biblioteca renderiza la card de "Revista Atenas".
--   * /servicios/quejas-sugerencias renderiza el formulario de quejas
--     en lugar de la sección de pasos (gracias al color "red").
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
    'tpl_k_ficha_servicio'
  ));

-- 2. Seed de las 8 fichas de servicios
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES

  -- ─── Bar Escolar ──────────────────────────────────────────
  (
    'servicios/bar-cafeteria',
    'tpl_k_ficha_servicio',
    'Bar Escolar',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Bar Escolar',
        'subtitle',  'Menú nutritivo y variado para toda la comunidad educativa de la Unidad Educativa Atenas.',
        'ghostText', 'BAR'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'utensils',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'El Bar Escolar de la Unidad Educativa Atenas ofrece un menú balanceado y nutritivo diseñado para cubrir las necesidades alimenticias de toda la comunidad educativa. Nuestras instalaciones cumplen con todas las normas de higiene y salubridad exigidas por el Ministerio de Educación.',
          'Contamos con opciones variadas que incluyen desayunos y refrigerios, elaborados con ingredientes frescos y de calidad. El personal está capacitado en manipulación de alimentos y atención al cliente.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'map-pin',     'label', 'UBICACIÓN',     'valor', 'Planta baja — Bloque A'),
          jsonb_build_object('iconName', 'alarm-clock', 'label', 'HORARIO',       'valor', '7:00 AM · 13:30 PM'),
          jsonb_build_object('iconName', 'leaf',        'label', 'ALIMENTACIÓN',  'valor', 'Saludable y balanceada')
        ),
        'pasos', jsonb_build_array(
          'Acércate al Bar Escolar ubicado en la planta baja del Bloque A durante el horario de atención.',
          'Revisa el menú del día publicado en el tablero exterior del local.',
          'Realiza tu pedido directamente en ventanilla y recibe tu orden.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80',
          'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80',
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'
        )
      )
    ),
    'Bar Escolar | Servicios | Atenas',
    'Menú nutritivo y variado para estudiantes y docentes durante el horario escolar.',
    true
  ),

  -- ─── Biblioteca ───────────────────────────────────────────
  (
    'servicios/biblioteca',
    'tpl_k_ficha_servicio',
    'Biblioteca',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Biblioteca',
        'subtitle',  'Espacio de investigación y lectura con recursos físicos y digitales para toda la comunidad.',
        'ghostText', 'BIBLIO'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'book-open',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'La Biblioteca de la Unidad Educativa Atenas cuenta con una amplia colección de libros, revistas y recursos digitales para apoyar el proceso de aprendizaje de todos los estudiantes. Es un espacio diseñado para la investigación, el estudio y el fomento de la lectura.',
          'Los estudiantes pueden acceder a libros de texto, literatura general, enciclopedias y bases de datos en línea. El personal bibliotecario está disponible para orientar en la búsqueda de información y gestión de recursos.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'book-marked', 'label', 'COLECCIÓN', 'valor', '+3 000 títulos'),
          jsonb_build_object('iconName', 'alarm-clock', 'label', 'HORARIO',   'valor', '7:30 AM · 15:30 PM'),
          jsonb_build_object('iconName', 'users',       'label', 'ACCESO',    'valor', 'Toda la comunidad')
        ),
        'pasos', jsonb_build_array(
          'Preséntate en la Biblioteca con tu carné estudiantil o cédula de identidad.',
          'Solicita el libro o recurso que necesitas al personal bibliotecario.',
          'Regístra el préstamo y devuelve el material en el plazo acordado.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
          'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80',
          'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&q=80'
        )
      )
    ),
    'Biblioteca | Servicios | Atenas',
    'Amplia colección bibliográfica física y digital disponible para toda la comunidad educativa.',
    true
  ),

  -- ─── Transporte ───────────────────────────────────────────
  (
    'servicios/transporte',
    'tpl_k_ficha_servicio',
    'Transporte Escolar',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Transporte',
        'subtitle',  'Rutas de transporte escolar seguro y puntual para el traslado de nuestros estudiantes.',
        'ghostText', 'TRANSP'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'bus',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'El servicio de transporte escolar de la Unidad Educativa Atenas garantiza el traslado seguro y puntual de los estudiantes. Contamos con unidades modernas, conductores certificados y rutas fijas que cubren los principales sectores de Ambato.',
          'Todas las unidades disponen de rastreo GPS en tiempo real y los conductores mantienen comunicación permanente con la administración del colegio para garantizar la seguridad de cada estudiante durante todo el trayecto.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'map-pin',      'label', 'COBERTURA', 'valor', 'Ciudad de Ambato'),
          jsonb_build_object('iconName', 'alarm-clock',  'label', 'HORARIO',   'valor', '6:30 AM · 13:30 PM'),
          jsonb_build_object('iconName', 'shield-check', 'label', 'SEGURIDAD', 'valor', 'GPS en tiempo real')
        ),
        'pasos', jsonb_build_array(
          'Contacta a Secretaría (ext. 150) al inicio del año lectivo para solicitar el servicio de transporte.',
          'Indica la ruta de interés y verifica la disponibilidad de cupos para tu sector.',
          'Completa el formulario de autorización y realiza el pago correspondiente en Tesorería.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
          'https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80',
          'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80'
        )
      )
    ),
    'Transporte Escolar | Servicios | Atenas',
    'Rutas de transporte seguro y puntual desde y hacia el colegio para todos los estudiantes.',
    true
  ),

  -- ─── Dispensario Médico ──────────────────────────────────
  (
    'servicios/dispensario-medico',
    'tpl_k_ficha_servicio',
    'Dispensario Médico',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Dispensario Médico',
        'subtitle',  'Atención médica y primeros auxilios para el bienestar de nuestros estudiantes durante la jornada escolar.',
        'ghostText', 'MEDICO'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'heart-pulse',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'El Dispensario Médico de la Unidad Educativa Atenas brinda atención de primeros auxilios y seguimiento básico de salud a todos los estudiantes durante la jornada escolar. Contamos con personal médico calificado y equipamiento adecuado para emergencias menores.',
          'En caso de emergencias mayores, activamos el protocolo de derivación a centros de salud cercanos y contactamos de inmediato a los representantes legales del estudiante. La salud y bienestar de nuestra comunidad es nuestra prioridad.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'ambulance',   'label', 'ATENCIÓN',    'valor', 'Primeros auxilios'),
          jsonb_build_object('iconName', 'alarm-clock', 'label', 'HORARIO',     'valor', '7:30 AM · 15:30 PM'),
          jsonb_build_object('iconName', 'phone',       'label', 'EMERGENCIAS', 'valor', 'Ext. 180')
        ),
        'pasos', jsonb_build_array(
          'Diríjete al Dispensario Médico ubicado en la planta baja del edificio principal.',
          'Presenta tu carné estudiantil y describe los síntomas o situación al personal de salud.',
          'Sigue las indicaciones del médico. En caso necesario, se contactará a tu representante.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80',
          'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80'
        )
      )
    ),
    'Dispensario Médico | Servicios | Atenas',
    'Atención médica inmediata y primeros auxilios durante la jornada escolar.',
    true
  ),

  -- ─── Llave del Aprendizaje ───────────────────────────────
  (
    'servicios/llave-aprendizaje',
    'tpl_k_ficha_servicio',
    'Llave del Aprendizaje',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Llave del Aprendizaje',
        'subtitle',  'Casilleros personales para que nuestros estudiantes organicen y protejan sus materiales escolares.',
        'ghostText', 'LLAVES'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'key',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'El programa Llave del Aprendizaje ofrece a cada estudiante un casillero personal donde guardar sus materiales, útiles escolares y pertenencias de manera segura durante la jornada escolar. Este servicio promueve la organización y responsabilidad de los alumnos.',
          'Los casilleros están disponibles en diferentes bloques del colegio y se asignan al inicio del año lectivo. Cada estudiante recibe una llave personal y es responsable del cuidado del espacio asignado.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'map-pin',      'label', 'DISPONIBILIDAD', 'valor', 'Todos los bloques'),
          jsonb_build_object('iconName', 'key',          'label', 'ASIGNACIÓN',     'valor', 'Inicio del año lectivo'),
          jsonb_build_object('iconName', 'shield-check', 'label', 'SEGURIDAD',      'valor', 'Llave personal')
        ),
        'pasos', jsonb_build_array(
          'Solicita tu casillero en Secretaría al inicio del año lectivo, presentando tu matrícula.',
          'Recibe tu llave personal y la asignación del bloque y número de casillero.',
          'Cuida el espacio asignado — reporta cualquier daño o pérdida inmediatamente.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
          'https://images.unsplash.com/photo-1571260898936-4e3c6d30e9a9?w=400&q=80'
        )
      )
    ),
    'Llave del Aprendizaje | Servicios | Atenas',
    'Sistema de casilleros personales para guardar útiles y pertenencias de forma segura.',
    true
  ),

  -- ─── Becas ───────────────────────────────────────────────
  (
    'servicios/becas',
    'tpl_k_ficha_servicio',
    'Becas',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Becas',
        'subtitle',  'Apoyo económico y becas para que el talento no tenga barreras en la Unidad Educativa Atenas.',
        'ghostText', 'BECAS'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'award',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'La Unidad Educativa Atenas cuenta con programas de becas y apoyo económico destinados a estudiantes con excelencia académica o necesidad económica comprobada. Nuestro compromiso es garantizar que ningún talento se quede sin la oportunidad de formarse en Atenas.',
          'Los beneficiarios son seleccionados por un comité académico que evalúa el desempeño, la conducta y la situación socioeconómica de cada candidato. Las becas pueden cubrir parcial o totalmente los valores de matrícula y pensión.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'star',        'label', 'CRITERIO',     'valor', 'Mérito y necesidad'),
          jsonb_build_object('iconName', 'alarm-clock', 'label', 'CONVOCATORIA', 'valor', 'Enero — Febrero'),
          jsonb_build_object('iconName', 'phone',       'label', 'INFORMES',     'valor', 'Ext. 135 Admisiones')
        ),
        'pasos', jsonb_build_array(
          'Solicita el formulario de aplicación a becas en Secretaría durante el período de convocatoria.',
          'Adjunta la documentación requerida: historial académico, situación socioeconómica y carta de motivación.',
          'Espera la resolución del Comité de Becas — los resultados se notifican por correo electrónico.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
          'https://images.unsplash.com/photo-1471970394675-613138e45da3?w=400&q=80',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80'
        )
      )
    ),
    'Becas | Servicios | Atenas',
    'Programas de financiamiento para estudiantes con excelencia académica y necesidad.',
    true
  ),

  -- ─── Seguro Estudiantil ──────────────────────────────────
  (
    'servicios/seguro-estudiantil',
    'tpl_k_ficha_servicio',
    'Seguro Estudiantil',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Seguro Estudiantil',
        'subtitle',  'Cobertura de seguro estudiantil incluida para todos los alumnos matriculados en Atenas.',
        'ghostText', 'SEGURO'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'shield-check',
        'color',    'gold',
        'descripcion', jsonb_build_array(
          'Todos los estudiantes matriculados en la Unidad Educativa Atenas cuentan con seguro estudiantil que cubre accidentes dentro y fuera de las instalaciones del colegio durante actividades académicas y extracurriculares oficiales.',
          'La cobertura incluye atención médica de emergencia, hospitalización por accidente y gastos de medicamentos derivados de incidentes escolares. El proceso de reclamación es ágil y se gestiona directamente a través de Secretaría.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'shield-check', 'label', 'COBERTURA',      'valor', 'Accidentes escolares'),
          jsonb_build_object('iconName', 'users',        'label', 'BENEFICIARIOS',  'valor', 'Todos los estudiantes'),
          jsonb_build_object('iconName', 'phone',        'label', 'RECLAMACIONES',  'valor', 'Ext. 190 Tesorería')
        ),
        'pasos', jsonb_build_array(
          'En caso de accidente, comunícate de inmediato con el Dispensario Médico o Secretaría.',
          'El colegio gestiona los trámites iniciales del seguro y contacta a los representantes.',
          'Para reclamaciones posteriores, presenta el informe médico en Tesorería (ext. 190).'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
          'https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?w=400&q=80',
          'https://images.unsplash.com/photo-1588600878108-578307a3cc9d?w=400&q=80'
        )
      )
    ),
    'Seguro Estudiantil | Servicios | Atenas',
    'Cobertura integral de accidentes y emergencias para todos los estudiantes.',
    true
  ),

  -- ─── Quejas y Sugerencias (color rojo, sin pasos visibles) ──
  -- El bloque `formulario` se añade en la migración 027.
  (
    'servicios/quejas-sugerencias',
    'tpl_k_ficha_servicio',
    'Quejas y Sugerencias',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'SERVICIOS INSTITUCIONALES',
        'title',     'Quejas y Sugerencias',
        'subtitle',  'Canal oficial para quejas, sugerencias y reconocimientos de toda la comunidad educativa.',
        'ghostText', 'QUEJAS'
      ),
      'ficha', jsonb_build_object(
        'iconName', 'message-circle',
        'color',    'red',
        'descripcion', jsonb_build_array(
          'La Unidad Educativa Atenas valora la retroalimentación de su comunidad. Este canal oficial permite a estudiantes, representantes legales y docentes presentar quejas, sugerencias o reconocimientos de forma clara y trazable.',
          'Todas las comunicaciones recibidas son revisadas por el equipo directivo y se garantiza una respuesta en un plazo máximo de 5 días hábiles. Tu opinión es fundamental para seguir mejorando.'
        ),
        'stats', jsonb_build_array(
          jsonb_build_object('iconName', 'alarm-clock',  'label', 'TIEMPO DE RESPUESTA', 'valor', '5 días hábiles'),
          jsonb_build_object('iconName', 'shield-check', 'label', 'CONFIDENCIALIDAD',    'valor', 'Garantizada'),
          jsonb_build_object('iconName', 'users',        'label', 'DISPONIBLE PARA',     'valor', 'Toda la comunidad')
        ),
        'pasos', jsonb_build_array(
          'Completa el formulario con tu nombre, correo de contacto y el tipo de comunicación.',
          'Describe con detalle la situación, sugerencia o reconocimiento que deseas comunicar.',
          'Envía el formulario — recibirás una confirmación por correo y respuesta en máximo 5 días hábiles.'
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'
        )
      )
    ),
    'Quejas y Sugerencias | Servicios | Atenas',
    'Canal oficial para compartir retroalimentación y ayudarnos a mejorar continuamente.',
    true
  )

) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
