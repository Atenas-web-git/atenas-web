-- ============================================================
-- Migración 007 — Seed de Valores como plantilla B
-- Backoffice Atenas — Fase 3 (CMS plantilla B)
-- Requiere: 006_cms_paginas.sql ejecutada
--
-- No crea tablas nuevas (la 006 ya soporta tpl_b_hero_grid en el CHECK
-- constraint). Solo siembra la página `el-atenas/valores` con los 9
-- valores institucionales actuales si la página no existe todavía.
--
-- IDEMPOTENTE: si la página ya existe (o fue editada manualmente desde
-- el backoffice), no se sobrescribe.
-- ============================================================

INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT * FROM (VALUES
  (
    'el-atenas/valores',
    'tpl_b_hero_grid',
    'Valores',
    jsonb_build_object(
      'hero', jsonb_build_object(
        'badge', 'QUIÉNES SOMOS',
        'title', 'Valores',
        'subtitle', 'Los pilares que definen el carácter de nuestra comunidad educativa.',
        'ghostText', 'VALORES'
      ),
      'seccion', jsonb_build_object(
        'badge', 'VALORES',
        'heading', 'Nuestros Valores Institucionales',
        'description', 'Nueve pilares que guían la vida de toda la comunidad educativa: estudiantes, docentes y familias.',
        'items', jsonb_build_array(
          jsonb_build_object(
            'icon', 'shield',
            'title', 'Respeto',
            'description', 'Es un derecho inalienable de todo ser humano. Reconocemos nuestra individualidad y valoramos la de los demás.'
          ),
          jsonb_build_object(
            'icon', 'eye',
            'title', 'Verdad',
            'description', 'Hablamos y actuamos de manera coherente con nuestra conciencia y convicciones personales, siendo auténticos y valientes.'
          ),
          jsonb_build_object(
            'icon', 'heart',
            'title', 'Solidaridad',
            'description', 'Extendemos la mano voluntariamente a quien lo necesita, sintiendo como algo propio el sufrimiento de nuestro prójimo.'
          ),
          jsonb_build_object(
            'icon', 'star',
            'title', 'Responsabilidad',
            'description', 'Hacemos lo que tenemos que hacer en el momento oportuno y asumimos las consecuencias de nuestras decisiones.'
          ),
          jsonb_build_object(
            'icon', 'scale',
            'title', 'Justicia',
            'description', 'Somos objetivos y neutrales en la toma de decisiones, comprometidos con la verdad, la conciencia social y la mejora del ambiente.'
          ),
          jsonb_build_object(
            'icon', 'award',
            'title', 'Integridad',
            'description', 'Actuamos de forma honesta y responsable considerando el sentido de la justicia en todas las acciones que desarrollamos.'
          ),
          jsonb_build_object(
            'icon', 'users',
            'title', 'Compañerismo',
            'description', 'Comprender, apoyar y ayudar a los demás sin buscar algo a cambio, basado en una actitud de colaboración compartida por todos.'
          ),
          jsonb_build_object(
            'icon', 'target',
            'title', 'Perseverancia',
            'description', 'Nos esforzamos continuamente para alcanzar lo que nos proponemos y buscamos soluciones a las dificultades que puedan surgir.'
          ),
          jsonb_build_object(
            'icon', 'anchor',
            'title', 'Lealtad',
            'description', 'Mantener una actitud de fidelidad, honestidad y coherencia en las acciones y decisiones, incluso en situaciones difíciles.'
          )
        )
      )
    ),
    'Valores — Unidad Educativa Atenas',
    'Los nueve valores institucionales que guían la vida de nuestra comunidad educativa: Respeto, Verdad, Solidaridad y más.',
    true
  )
) AS data(slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE paginas.slug = data.slug);
