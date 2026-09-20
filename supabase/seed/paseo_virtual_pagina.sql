-- =============================================================================
-- Ficha de la página del paseo virtual en el CMS
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- El buscador del sitio y el chatbot Ateneo leen la tabla `paginas`. Como el
-- paseo virtual nació como página con archivo propio y sin ficha, **una familia
-- que buscaba «tour», «360» o «recorrido» no encontraba nada**, y el chatbot
-- no sabía que existía aunque le preguntaran por las instalaciones.
--
-- Esta fila arregla las dos cosas y, de paso, deja el titular y el SEO en manos
-- del colegio.
--
-- POR QUÉ UNA PLANTILLA PROPIA
--
-- `tpl_u_paseo_virtual` tiene exactamente los tres campos que la página pinta.
-- Reaprovechar otra plantilla habría dejado en el editor secciones que nadie
-- pinta: controles que se guardan y no hacen nada.
--
-- ⚠️ Correr DESPUÉS de desplegar el código. Si la fila existe antes, el editor
-- del panel no sabe qué hacer con una plantilla que todavía no conoce.
-- =============================================================================

insert into public.paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
select
  'paseo-virtual',
  'tpl_u_paseo_virtual',
  'Paseo virtual 360°',
  jsonb_build_object(
    'hero', jsonb_build_object(
      'badge', 'CONOCE EL CAMPUS',
      'title', 'Paseo virtual 360°',
      'intro', 'Arrastra con el dedo o el ratón para mirar alrededor, y toca los puntos para pasar de un espacio a otro.'
    )
  ),
  'Paseo Virtual 360° — Unidad Educativa Atenas',
  -- Las palabras de aquí son las que encuentra el buscador del sitio: tour,
  -- recorrido, instalaciones y los espacios que la gente busca por su nombre.
  'Recorrido virtual 360° por el campus de la Unidad Educativa Atenas: aulas, laboratorios, biblioteca, auditorio, canchas y áreas de inicial. Un tour por las instalaciones sin salir de casa.',
  true
where not exists (select 1 from public.paginas where slug = 'paseo-virtual');
