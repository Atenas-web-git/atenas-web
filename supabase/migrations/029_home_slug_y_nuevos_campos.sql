-- ============================================================
-- Migración 029 — Ajustes al Home: rename slug a "/" + nuevos campos
-- Backoffice Atenas — Fase 4 (sesión 29)
-- Requiere: 028_seed_home_plantilla_m.sql ejecutada
--
-- Cambios:
-- 1. Renombra el slug de la página Home de "home" a "/" (la raíz del
--    dominio). El frontend público hace `getPagina("/")` ahora.
-- 2. Añade nuevos campos al contenido JSONB de la página Home (solo
--    si la fila aún no los tiene):
--    - hscroll.slides[].badgeText  → palabra inferior del badge flotante
--    - hscroll.slides[].imagenSecundaria → segunda imagen del collage
--      (slides 2, 3, 4; el slide 1 queda en "")
--    - niveles.cards[].href → URL de destino al clic en cada card
--    - porQueAtenas.cards[].href → URL del CTA "Conoce más"
--
-- IDEMPOTENTE: cada UPDATE solo aplica si el cambio no existe todavía.
-- ============================================================

-- 1. Renombrar el slug "home" → "/"
UPDATE paginas
SET slug = '/'
WHERE slug = 'home'
  AND plantilla = 'tpl_m_home';

-- 2. Reescribir hscroll con los nuevos campos badgeText + imagenSecundaria.
--    Solo se aplica si el primer slide aún no tiene badgeText (señal de
--    que la 028 está aplicada pero la 029 no).
UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{hscroll,slides}',
  jsonb_build_array(
    jsonb_build_object(
      'tab',             'ACADÉMICO',
      'badgeText',       'Potencial',
      'headingLight',    contenido #>> '{hscroll,slides,0,headingLight}',
      'headingBold',     contenido #>> '{hscroll,slides,0,headingBold}',
      'body',            contenido #>> '{hscroll,slides,0,body}',
      'mobileBody',      contenido #>> '{hscroll,slides,0,mobileBody}',
      'metrics',         contenido #> '{hscroll,slides,0,metrics}',
      'imagenPrincipal', contenido #>> '{hscroll,slides,0,imagenPrincipal}',
      'imagenSecundaria', ''
    ),
    jsonb_build_object(
      'tab',             'BACHILLERATO IB',
      'badgeText',       'IB',
      'headingLight',    contenido #>> '{hscroll,slides,1,headingLight}',
      'headingBold',     contenido #>> '{hscroll,slides,1,headingBold}',
      'body',            contenido #>> '{hscroll,slides,1,body}',
      'mobileBody',      contenido #>> '{hscroll,slides,1,mobileBody}',
      'metrics',         contenido #> '{hscroll,slides,1,metrics}',
      'imagenPrincipal', contenido #>> '{hscroll,slides,1,imagenPrincipal}',
      'imagenSecundaria', '/images/IMG_1911-2-1536x1024.jpg'
    ),
    jsonb_build_object(
      'tab',             'DEPORTE',
      'badgeText',       'Campeones',
      'headingLight',    contenido #>> '{hscroll,slides,2,headingLight}',
      'headingBold',     contenido #>> '{hscroll,slides,2,headingBold}',
      'body',            contenido #>> '{hscroll,slides,2,body}',
      'mobileBody',      contenido #>> '{hscroll,slides,2,mobileBody}',
      'metrics',         contenido #> '{hscroll,slides,2,metrics}',
      'imagenPrincipal', contenido #>> '{hscroll,slides,2,imagenPrincipal}',
      'imagenSecundaria', 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80'
    ),
    jsonb_build_object(
      'tab',             'COMUNIDAD',
      'badgeText',       'Valores',
      'headingLight',    contenido #>> '{hscroll,slides,3,headingLight}',
      'headingBold',     contenido #>> '{hscroll,slides,3,headingBold}',
      'body',            contenido #>> '{hscroll,slides,3,body}',
      'mobileBody',      contenido #>> '{hscroll,slides,3,mobileBody}',
      'metrics',         contenido #> '{hscroll,slides,3,metrics}',
      'imagenPrincipal', contenido #>> '{hscroll,slides,3,imagenPrincipal}',
      'imagenSecundaria', 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80'
    )
  )
)
WHERE slug = '/'
  AND plantilla = 'tpl_m_home'
  AND NOT (contenido #> '{hscroll,slides,0}' ? 'badgeText');

-- 3. Reescribir niveles.cards añadiendo `href`.
UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{niveles,cards}',
  jsonb_build_array(
    (contenido #> '{niveles,cards,0}') || jsonb_build_object('href', '/academico/niveles/inicial'),
    (contenido #> '{niveles,cards,1}') || jsonb_build_object('href', '/academico/niveles/egb-elemental-media'),
    (contenido #> '{niveles,cards,2}') || jsonb_build_object('href', '/academico/niveles/egb-superior'),
    (contenido #> '{niveles,cards,3}') || jsonb_build_object('href', '/academico/ib')
  )
)
WHERE slug = '/'
  AND plantilla = 'tpl_m_home'
  AND NOT (contenido #> '{niveles,cards,0}' ? 'href');

-- 4. Reescribir porQueAtenas.cards añadiendo `href`.
UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{porQueAtenas,cards}',
  jsonb_build_array(
    (contenido #> '{porQueAtenas,cards,0}') || jsonb_build_object('href', '/academico'),
    (contenido #> '{porQueAtenas,cards,1}') || jsonb_build_object('href', '/el-atenas/valores'),
    (contenido #> '{porQueAtenas,cards,2}') || jsonb_build_object('href', '/academico/ib'),
    (contenido #> '{porQueAtenas,cards,3}') || jsonb_build_object('href', '/matriculas')
  )
)
WHERE slug = '/'
  AND plantilla = 'tpl_m_home'
  AND NOT (contenido #> '{porQueAtenas,cards,0}' ? 'href');
