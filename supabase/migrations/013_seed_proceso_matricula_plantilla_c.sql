-- ============================================================
-- Migración 013 — Seed /matriculas/proceso como plantilla C
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- Siembra la página `matriculas/proceso` con plantilla C extendida
-- (Hero + intro + galería de 3 fotos + 5 pasos numerados con el último
-- destacado en rojo), replicando el contenido actual hardcodeado.
--
-- IDEMPOTENTE: si la página ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'matriculas/proceso',
    'tpl_c_hero_pasos',
    'Proceso de Matrícula',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge',     'MATRÍCULAS · PROCESO',
        'title',     'Cómo matricularte',
        'subtitle',  'Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027.',
        'ghostText', 'PROCESO'
      ),
      'intro', jsonb_build_object(
        'badge',       'PROCESO DE MATRÍCULA · 2026–2027',
        'heading',     'Cómo matricularte en Atenas',
        'descripcion', 'Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027.'
      ),
      'galeria', jsonb_build_object(
        'src1', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
        'alt1', 'Aulas Atenas',
        'src2', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80',
        'alt2', 'Campus Atenas',
        'src3', 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80',
        'alt3', 'Estudiantes Atenas'
      ),
      'pasos', jsonb_build_object(
        'titulo', 'Pasos a seguir',
        'items', jsonb_build_array(
          jsonb_build_object(
            'texto', 'Completa el formulario en línea — Accede al portal y llena los datos del estudiante y la familia.'
          ),
          jsonb_build_object(
            'texto', 'Entrega la documentación — Cédula o pasaporte, fotos tamaño carné, certificados médicos y académicos.'
          ),
          jsonb_build_object(
            'texto', 'Entrevista familiar — Reunión breve con el equipo académico para conocerse y resolver dudas.'
          ),
          jsonb_build_object(
            'texto', 'Revisión y aprobación — El comité evalúa la solicitud en un plazo de 5 días hábiles.'
          ),
          jsonb_build_object(
            'texto',     'Firma de contrato y pago — Formaliza la matrícula en secretaría y completa el proceso de pago.',
            'destacado', true
          )
        )
      )
    ),
    'Proceso de Matrícula 2026–2027 | Atenas',
    'Conoce los 5 pasos para matricularte en la Unidad Educativa Atenas para el año lectivo 2026–2027.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
