-- ============================================================
-- Migración 024 — Plantilla J + seed /matriculas (landing)
-- Backoffice Atenas — Fase 3 (sesión 28)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- 1. Amplía el CHECK constraint de `paginas.plantilla` para incluir
--    `tpl_j_landing_matriculas`.
-- 2. Siembra la página `matriculas` (landing) con la plantilla J
--    (3 bloques: Hero + Showcase de 3 categorías + Proceso de
--    matrícula con collage y 5 pasos), replicando el contenido
--    actual hardcodeado.
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
    'tpl_j_landing_matriculas'
  ));

-- 2. Seed de /matriculas
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'matriculas',
    'tpl_j_landing_matriculas',
    'Matrículas 2026–2027',
    jsonb_build_object(

      'hero', jsonb_build_object(
        'badge',     'MATRÍCULAS 2026–2027',
        'title',     'Proceso de Matrícula',
        'subtitle',  'Todo lo que necesitas para formalizar el ingreso o reingreso de tu hijo en la Unidad Educativa Atenas.',
        'ghostText', 'MATRÍCULAS'
      ),

      'showcase', jsonb_build_object(
        'heading', 'Todo lo que necesitas para matricularte',
        'ctaText', 'Ver detalle',
        'items', jsonb_build_array(
          jsonb_build_object(
            'slug',       'proceso',
            'icon',       '📋',
            'nombre',     'Proceso',
            'count',      '5',
            'countLabel', 'pasos simples',
            'photoSrc',   'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
            'basePath',   '/matriculas'
          ),
          jsonb_build_object(
            'slug',       'valores',
            'icon',       '💰',
            'nombre',     'Valores',
            'count',      '6',
            'countLabel', 'niveles educativos',
            'photoSrc',   'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80',
            'basePath',   '/matriculas'
          ),
          jsonb_build_object(
            'slug',       'autorizaciones',
            'icon',       '🏦',
            'nombre',     'Autorizaciones',
            'count',      '3',
            'countLabel', 'bancos disponibles',
            'photoSrc',   'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&q=80',
            'basePath',   '/matriculas'
          )
        )
      ),

      'proceso', jsonb_build_object(
        'badge',    'Proceso de Matrícula · 2026–2027',
        'heading',  'Cómo matricularte en Atenas',
        'subtitle', 'Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027.',
        'fotos', jsonb_build_array(
          'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
          'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80'
        ),
        'pasos', jsonb_build_array(
          jsonb_build_object('num', '01', 'titulo', 'Completa el formulario en línea',
                             'desc', 'Accede al portal y llena los datos del estudiante y la familia.'),
          jsonb_build_object('num', '02', 'titulo', 'Entrega la documentación',
                             'desc', 'Cédula o pasaporte, fotos tamaño carné, certificados médicos y académicos.'),
          jsonb_build_object('num', '03', 'titulo', 'Entrevista familiar',
                             'desc', 'Reunión breve con el equipo académico para conocerse y resolver dudas.'),
          jsonb_build_object('num', '04', 'titulo', 'Revisión y aprobación',
                             'desc', 'El comité evalúa la solicitud en un plazo de 5 días hábiles.'),
          jsonb_build_object('num', '05', 'titulo', 'Firma de contrato y pago',
                             'desc', 'Formaliza la matrícula en secretaría y completa el proceso de pago.',
                             'isRed', true)
        )
      )
    ),
    'Matrículas 2026–2027 | Unidad Educativa Atenas',
    'Proceso de matrícula, valores de pensión y autorizaciones bancarias para el año lectivo 2026–2027 en la Unidad Educativa Atenas, Ambato.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
