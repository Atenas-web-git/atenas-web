-- ============================================================
-- Migración 023 — Plantilla I + seed /el-atenas/historia
-- Backoffice Atenas — Fase 3 (sesión 28)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_i_historia`.
-- 2. Siembra la página `el-atenas/historia` con la plantilla I (5
--    bloques: Hero + Fundación + Trayectoria con video YouTube +
--    Cifras + Cita), replicando el contenido actual hardcodeado.
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
    'tpl_i_historia'
  ));

-- 2. Seed de /el-atenas/historia
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'el-atenas/historia',
    'tpl_i_historia',
    'Historia & 50 Años',
    jsonb_build_object(

      'hero', jsonb_build_object(
        'bgImageSrc', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80',
        'ghostText', 'HISTORIA',
        'badge',     '50 AÑOS DE HISTORIA',
        'titleLine1', 'Historia &',
        'titleLine2', 'Cincuenta Años',
        'subtitle',   'Cinco décadas formando líderes con propósito en el corazón de Ambato.',
        'caption',    'Fundada en 1976 · Ambato, Ecuador'
      ),

      'fundacion', jsonb_build_object(
        'badge',      'Nuestros Orígenes',
        'heading',    E'Un sueño que\nnació en 1976',
        'paragraph1', 'La Sociedad Cultural y Educativa Ambato fue fundada por un grupo de empresarios encabezados por José Filometor Cuesta Holguín. El 19 de octubre de 1976 se emite la autorización de funcionamiento del Centro Educativo Atenas — primer día de una historia que dura hasta hoy.',
        'paragraph2', 'En 2006 obtuvimos la primera certificación ISO 9001 del centro del país. En 2013, la autorización del Bachillerato Internacional. Hoy somos referentes de calidad en Ecuador.',
        'fotoPrincipal',   'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80',
        'fotoSecundaria1', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
        'fotoSecundaria2', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80'
      ),

      'trayectoria', jsonb_build_object(
        'badge',     'Nuestra Trayectoria',
        'heading',   E'Hitos que marcaron\nnuestra historia',
        'ghostText', '50',
        'bgFotoSrc', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1440&q=80',
        'youtube', jsonb_build_object(
          'videoId',      '0b91AsQRfJM',
          'startSeconds', 28,
          'endSeconds',   55
        ),
        'hitos', jsonb_build_array(
          jsonb_build_object('year', '1976',         'title', 'Fundación',                  'desc', 'Unidad Educativa Atenas abre sus puertas en Ambato'),
          jsonb_build_object('year', '1996',         'title', 'Primera Graduación',         'desc', 'Primera promoción de 36 bachilleres egresada'),
          jsonb_build_object('year', '2006',         'title', 'ISO 9001',                   'desc', 'Primera institución del centro del país en certificarse ISO 9001'),
          jsonb_build_object('year', '2013',         'title', 'Bachillerato Internacional', 'desc', 'Autorización del programa Diploma IB en mayo de 2013'),
          jsonb_build_object('year', '2017–2019',    'title', 'Tecnología e Innovación',    'desc', 'Feria de Universidades y nuevas tecnologías educativas en el aula'),
          jsonb_build_object('year', '2020–2026 ★',  'title', 'Excelencia Nacional',        'desc', '2020: educación online reconocida a nivel nacional. Hoy: referentes de calidad en Ecuador',
                             'highlight', true)
        ),
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80'
        )
      ),

      'cifras', jsonb_build_object(
        'bgImageSrc', 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1440&q=80',
        'badge',      'Nuestros Números',
        'heading',    'Medio siglo en números',
        'stats', jsonb_build_array(
          jsonb_build_object('value', 50,   'suffix', '',  'label', 'Años de historia'),
          jsonb_build_object('value', 5000, 'suffix', '+', 'label', 'Egresados', 'dark', true),
          jsonb_build_object('value', 200,  'suffix', '+', 'label', 'Docentes'),
          jsonb_build_object('value', 1,    'suffix', '',  'label', 'Colegio IB en Ambato', 'isStatic', true, 'staticText', '1 IB')
        )
      ),

      'cita', jsonb_build_object(
        'bgImageSrc',  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80',
        'quote',       E'El Atenas no es solo un colegio —\nes una promesa que se renueva\ngeneración tras generación.',
        'attribution', 'Unidad Educativa Atenas · Desde 1976'
      )
    ),
    'Historia & 50 Años — Unidad Educativa Atenas',
    'Cinco décadas formando líderes con propósito en el corazón de Ambato. Fundada en 1976, referente de calidad educativa en Ecuador con bachillerato IB y certificación ISO 9001.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
