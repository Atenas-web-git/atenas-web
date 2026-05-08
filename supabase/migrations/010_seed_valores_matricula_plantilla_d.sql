-- ============================================================
-- Migración 010 — Seed de Valores de Matrícula como plantilla D
-- Backoffice Atenas — Fase 3 (sesión 26)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- Siembra la página `matriculas/valores` con plantilla D (Hero + stats +
-- tabla + nota), replicando el contenido actual hardcodeado.
--
-- IDEMPOTENTE: si la página ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'matriculas/valores',
    'tpl_d_hero_detalle',
    'Valores de Matrícula',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'MATRÍCULAS · VALORES',
        'title', 'Valores de Matrícula',
        'subtitle', 'Estructura de costos por nivel para el año lectivo 2026–2027. Valores referenciales sujetos a confirmación oficial.',
        'ghostText', 'VALORES'
      ),
      'intro', jsonb_build_object(
        'badge', 'VALORES 2026–2027',
        'heading', 'Estructura de costos por nivel',
        'paragraphs', jsonb_build_array(
          'Valores referenciales para el año lectivo 2026–2027. Para confirmación oficial, contáctate con secretaría.'
        )
      ),
      'tabla', jsonb_build_object(
        'columnas', jsonb_build_array('Nivel', 'Grados', 'Matrícula', 'Pensión mensual'),
        'filas', jsonb_build_array(
          jsonb_build_object('celdas', jsonb_build_array('Inicial', '1ro y 2do Inicial', '$750', '$420')),
          jsonb_build_object('celdas', jsonb_build_array('EGB Elemental', '1ro – 4to EGB', '$800', '$450')),
          jsonb_build_object('celdas', jsonb_build_array('EGB Media', '5to – 7mo EGB', '$850', '$480')),
          jsonb_build_object('celdas', jsonb_build_array('EGB Superior', '8vo – 10mo EGB', '$900', '$510')),
          jsonb_build_object('celdas', jsonb_build_array('BGU', '1ro – 3ro BGU', '$950', '$545')),
          jsonb_build_object('celdas', jsonb_build_array('IB Diploma', '1ro – 2do IB', '$1.200', '$680'))
        ),
        'acentoPrimeraColumna', true,
        'destacarUltimaColumna', true
      ),
      'nota', jsonb_build_object(
        'icono', 'ℹ️',
        'texto', 'Los valores indicados son referenciales. La institución puede ajustarlos para el período 2026–2027. Comunícate con secretaría al <strong>032 456 789</strong> o visítanos en Izamba, Ambato.'
      )
    ),
    'Valores de Matrícula 2026–2027 | Atenas',
    'Estructura de costos por nivel educativo para el año lectivo 2026–2027 en la Unidad Educativa Atenas.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
