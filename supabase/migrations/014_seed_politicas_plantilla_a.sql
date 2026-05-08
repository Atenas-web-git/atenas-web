-- ============================================================
-- Migración 014 — Seed de Política de Calidad y Política de Seguridad
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- Siembra las páginas `el-atenas/politica-calidad` y
-- `el-atenas/politica-seguridad` con plantilla A (Hero + texto),
-- replicando el contenido actual hardcodeado.
--
-- IDEMPOTENTE: si una página ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'el-atenas/politica-calidad',
    'tpl_a_hero_texto',
    'Política de Calidad',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'title',     'Política de Calidad',
        'subtitle',  'Nuestro compromiso con la excelencia educativa y la mejora continua.',
        'ghostText', 'CALIDAD'
      ),
      'seccion', jsonb_build_object(
        'badge',      'POLÍTICA DE CALIDAD',
        'heading',    'Comprometidos con la Excelencia',
        'paragraphs', jsonb_build_array(
          'Educamos y formamos jóvenes competentes, responsables y de servicio. Trabajamos para la satisfacción de nuestros clientes internos y externos mediante el cumplimiento de requisitos, la mejora continua de los procesos, una organización efectiva, personal especializado y comprometido, una infraestructura adecuada, la participación de la familia y el funcionamiento sustentable de la Institución.',
          'Esta política orienta cada proceso educativo y administrativo de la Unidad Educativa Atenas, en consonancia con nuestras certificaciones nacionales e internacionales de calidad.'
        )
      )
    ),
    'Política de Calidad — Unidad Educativa Atenas',
    'Educamos y formamos jóvenes competentes, responsables y de servicio mediante la mejora continua y la excelencia educativa.',
    true
  ),
  (
    'el-atenas/politica-seguridad',
    'tpl_a_hero_texto',
    'Política de Seguridad',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'title',     'Política de Seguridad',
        'subtitle',  'Seguridad y bienestar para cada miembro de nuestra comunidad.',
        'ghostText', 'SEGURIDAD'
      ),
      'seccion', jsonb_build_object(
        'badge',      'POLÍTICA DE SEGURIDAD',
        'heading',    'Seguridad y Salud en el Trabajo',
        'paragraphs', jsonb_build_array(
          'La Fundación Cultural y Educativa Ambato, dedicada a brindar educación de calidad, está comprometida con la seguridad y salud en el trabajo en todas las áreas de la institución, respetando el medio ambiente, el marco legal y las normativas establecidas en el país.',
          'Para este fin, se asignan los recursos necesarios y se promueve el mejoramiento continuo de las condiciones de trabajo, garantizando un entorno seguro y saludable para estudiantes, docentes, personal administrativo y visitantes.'
        )
      )
    ),
    'Política de Seguridad — Unidad Educativa Atenas',
    'Comprometidos con la seguridad, salud en el trabajo y el bienestar de toda la comunidad educativa.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
