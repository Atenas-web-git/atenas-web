-- ============================================================
-- Migración 028 — Plantilla M + seed /home (página principal)
-- Backoffice Atenas — Fase 4 (sesión 29)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_m_home`.
-- 2. Siembra la página `home` (slug "home") con la plantilla M (6
--    bloques: Hero con video YouTube + Tagline + HScroll 4 slides +
--    Trayectoria 50 años + Niveles 4 cards + Por qué Atenas 4 cards),
--    replicando el contenido actual hardcodeado en `src/app/page.tsx`
--    y los componentes de `src/components/home/`.
--
-- Notas:
-- * El Hero arranca SIN video YouTube. El cliente puede pegarlo desde
--   el editor — formato libre (watch?v=, youtu.be/, /embed/, /shorts/).
-- * Mientras no haya video, se usa la foto `bgImageSrc` como fondo.
-- * Las 6 carpetas hardcoded del Home siguen vivas y funcionan como
--   componentes que reciben props — esta migración solo carga los
--   datos en BD para que el editor pueda modificarlos.
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
    'tpl_l_ficha_espacio',
    'tpl_m_home'
  ));

-- 2. Seed de la página Home
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES (
  'home',
  'tpl_m_home',
  'Home',
  jsonb_build_object(

    'hero', jsonb_build_object(
      'videoYoutubeUrl', '',
      'startSeconds',    0,
      'endSeconds',      0,
      'bgImageSrc',      '/images/00_politicas-de-seguridad-1536x864.jpg',
      'titleLines',      jsonb_build_array('Formando líderes', 'que transforman', 'el Ecuador.'),
      'subtitle',        'Una educación de excelencia desde 1976.',
      'videoLinkText',   'REPRODUCIR VIDEO',
      'videoLinkUrl',    ''
    ),

    'tagline', jsonb_build_object(
      'eyebrow', 'Nuestra razón de ser',
      'line1',   'La {institución referente} de Ambato,',
      'line2',   'para toda la vida.'
    ),

    'hscroll', jsonb_build_object(
      'ghostLabel', 'Vive el Atenas',
      'slides', jsonb_build_array(
        jsonb_build_object(
          'tab',             'ACADÉMICO',
          'headingLight',    'Docentes de',
          'headingBold',     'Excepción.',
          'body',            'Docentes con maestrías y certificaciones internacionales. La primera institución del centro del Ecuador en alcanzar la certificación ISO 9001 — un estándar global de calidad educativa.',
          'mobileBody',      'Docentes con maestrías y certificaciones internacionales. Primera institución del centro del Ecuador con certificación ISO 9001.',
          'metrics', jsonb_build_array(
            jsonb_build_object('value', 'ISO 9001',   'label', 'Certificación Internacional'),
            jsonb_build_object('value', 'IB Diploma', 'label', 'Único en el centro del Ecuador'),
            jsonb_build_object('value', '1,200+',     'label', 'Estudiantes formados')
          ),
          'imagenPrincipal', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1080&q=80'
        ),
        jsonb_build_object(
          'tab',             'BACHILLERATO IB',
          'headingLight',    'Bachillerato',
          'headingBold',     'Internacional.',
          'body',            'El único programa de Bachillerato Internacional del centro del Ecuador. Desde 2013 el Atenas forma a sus estudiantes para ingresar a las mejores universidades del mundo, en alianza con IBO, USFQ y EF Education.',
          'mobileBody',      'El único programa IB del centro del Ecuador. Desde 2013 formamos estudiantes para ingresar a las mejores universidades del mundo.',
          'metrics', jsonb_build_array(
            jsonb_build_object('value', '2013',        'label', 'Autorización IB'),
            jsonb_build_object('value', '6 áreas',     'label', 'Del Diploma IB'),
            jsonb_build_object('value', 'USFQ · IBO',  'label', 'Alianzas internacionales')
          ),
          'imagenPrincipal', '/images/IMG_1932-vis-1-1536x1197.jpg'
        ),
        jsonb_build_object(
          'tab',             'DEPORTE',
          'headingLight',    'Deporte de',
          'headingBold',     'Campeones.',
          'body',            'Más de 50 medallas nacionales en 9 disciplinas deportivas. Campeones latinoamericanos de BMX y múltiples títulos intercolegiales que posicionan al Atenas como referente deportivo del centro del Ecuador.',
          'mobileBody',      'Más de 50 medallas nacionales en 9 disciplinas. Campeones latinoamericanos de BMX y múltiples títulos intercolegiales.',
          'metrics', jsonb_build_array(
            jsonb_build_object('value', '50+',           'label', 'Medallas nacionales'),
            jsonb_build_object('value', '9 disciplinas', 'label', 'Deporte escolar'),
            jsonb_build_object('value', 'Latam BMX',     'label', 'Campeones 2017')
          ),
          'imagenPrincipal', '/images/00_politicas-de-seguridad-1536x864.jpg'
        ),
        jsonb_build_object(
          'tab',             'COMUNIDAD',
          'headingLight',    '50 años de',
          'headingBold',     'Comunidad.',
          'body',            'Una comunidad de miles de graduados que llevan los valores del Atenas al mundo. El proyecto VASE forma personas comprometidas con el respeto, la solidaridad y la verdad desde 1976.',
          'mobileBody',      'Una comunidad de miles de graduados que llevan los valores del Atenas al mundo. El proyecto VASE desde 1976.',
          'metrics', jsonb_build_array(
            jsonb_build_object('value', '1976',    'label', 'Año de fundación'),
            jsonb_build_object('value', '50 años', 'label', 'De historia institucional'),
            jsonb_build_object('value', 'VASE',    'label', 'Valores, Acción y Servicio')
          ),
          'imagenPrincipal', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1080&q=80'
        )
      )
    ),

    'trayectoria', jsonb_build_object(
      'eyebrow',     'Nuestra Trayectoria',
      'titleLines',  jsonb_build_array('Cinco décadas formando', 'líderes con propósito.'),
      'subtitle',    'Desde 1976, el Atenas ha sido el espacio donde generaciones de ambateños encontraron su camino hacia la excelencia.',
      'ghostText',   '50 AÑOS',
      'bgImageSrc',  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80',
      'stats', jsonb_build_array(
        jsonb_build_object('value', '50',   'suffix', '+', 'label', 'Años de excelencia'),
        jsonb_build_object('value', '1200', 'suffix', '+', 'label', 'Estudiantes activos'),
        jsonb_build_object('value', 'IB',   'suffix', '',  'label', 'Bachillerato Internacional')
      )
    ),

    'niveles', jsonb_build_object(
      'eyebrow', 'Niveles Educativos',
      'titleLines', jsonb_build_array(
        jsonb_build_object('text', 'AQUÍ',        'weight', 700, 'opacity', 1),
        jsonb_build_object('text', 'EXPLORARÁS,', 'weight', 700, 'opacity', 1),
        jsonb_build_object('text', 'CRECERÁS',    'weight', 700, 'opacity', 1),
        jsonb_build_object('text', 'Y',           'weight', 300, 'opacity', 0.6),
        jsonb_build_object('text', 'BRILLARÁS.',  'weight', 700, 'opacity', 1)
      ),
      'mobileTitleLines', jsonb_build_array('Aquí explorarás,', 'crecerás', 'y brillarás.'),
      'cards', jsonb_build_array(
        jsonb_build_object(
          'label',       'INICIAL',
          'title',       E'Educación\nInicial',
          'desc',        'Educación inicial con amor, juego y desarrollo sensorial para los más pequeños.',
          'img',         '/images/IMG_1889-2-2-1536x1226.jpg',
          'mobileTitle', 'Maternal y Kínder',
          'mobileLabel', ''
        ),
        jsonb_build_object(
          'label',       'BÁSICA',
          'title',       E'Educación\nBásica',
          'desc',        'Formación integral con excelencia académica desde los primeros años escolares.',
          'img',         '/images/IMG_1911-2-1536x1024.jpg',
          'mobileTitle', 'Educación General Básica',
          'mobileLabel', ''
        ),
        jsonb_build_object(
          'label',       'BGU',
          'title',       E'Bachillerato\nGeneral',
          'desc',        'Bachillerato General Unificado con énfasis en ciencias, matemáticas y humanidades.',
          'img',         '/images/IMG_1932-vis-1-1536x1197.jpg',
          'mobileTitle', 'Bachillerato General Unificado',
          'mobileLabel', ''
        ),
        jsonb_build_object(
          'label',       'IB',
          'title',       E'Bachillerato\nInternacional',
          'desc',        'El único programa IB en el centro del Ecuador. Apertura a las mejores universidades del mundo.',
          'img',         '/images/00_politicas-de-seguridad-1536x864.jpg',
          'mobileTitle', 'Diploma IB — Reconocido mundial',
          'mobileLabel', 'BACHILLERATO IB'
        )
      )
    ),

    'porQueAtenas', jsonb_build_object(
      'ghostText',  'SÉ MÁS',
      'eyebrow',    'Por qué Atenas',
      'titleLight', 'Descubre incluso',
      'titleBold',  'más.',
      'subtitle',   'Cuatro razones por las que familias de Ambato eligen el Atenas, año tras año.',
      'cards', jsonb_build_array(
        jsonb_build_object(
          'label',       'Académico',
          'mobileLabel', 'ACADÉMICO',
          'title',       'Excelencia que abre puertas',
          'mobileTitle', 'Educación de alto nivel',
          'desc',        'Programas con certificación ISO 9001 y el único Bachillerato IB en el centro del Ecuador.',
          'img',         '/images/IMG_1889-2-2-1536x1226.jpg'
        ),
        jsonb_build_object(
          'label',       'Identidad',
          'mobileLabel', 'IDENTIDAD',
          'title',       'Valores para toda la vida',
          'mobileTitle', 'Formados con propósito',
          'desc',        'Nuestro modelo VASE forma personas íntegras con Valores, Autonomía, Solidaridad y Excelencia.',
          'img',         'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80'
        ),
        jsonb_build_object(
          'label',       'Bachillerato IB',
          'mobileLabel', 'BACHILLERATO IB',
          'title',       'Visión global',
          'mobileTitle', 'Reconocido mundialmente',
          'desc',        'Reconocido por más de 5,000 universidades en el mundo. Aprendizaje en inglés con método CLIL.',
          'img',         'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=640&q=80'
        ),
        jsonb_build_object(
          'label',       'Comunidad',
          'mobileLabel', 'COMUNIDAD',
          'title',       'Una familia que crece',
          'mobileTitle', 'Más que un colegio',
          'desc',        '50 años construyendo comunidad. Familias, docentes y graduados que llevan el Atenas para toda la vida.',
          'img',         'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=640&q=80'
        )
      )
    )

  ),
  'Unidad Educativa Atenas — 50 años formando líderes en Ambato',
  'La institución referente de Ambato, Ecuador. Bachillerato Internacional IB acreditado, certificación ISO 9001 y 50 años formando líderes con propósito.',
  true
)) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
