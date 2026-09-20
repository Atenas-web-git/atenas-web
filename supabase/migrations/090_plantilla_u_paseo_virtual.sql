-- =============================================================================
-- 090 — Plantilla U y ficha de la página del paseo virtual
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- El buscador del sitio y el chatbot Ateneo leen la tabla `paginas`. El paseo
-- virtual nació como página con archivo propio y **sin ficha**, así que para
-- los dos no existía: una familia que buscaba «tour», «360» o «recorrido» no
-- encontraba nada, y al preguntarle a Ateneo por las instalaciones no ofrecía
-- el recorrido.
--
-- POR QUÉ UNA PLANTILLA NUEVA Y NO UNA DE LAS VEINTE
--
-- `tpl_u_paseo_virtual` tiene exactamente los tres textos que la página pinta:
-- la línea superior, el título y la frase de cómo se usa. Reaprovechar otra
-- plantilla habría llenado el editor de secciones que nadie pinta — controles
-- que se guardan y no hacen nada, que es el fallo que este proyecto lleva
-- meses persiguiendo.
--
-- El recorrido en sí —los 63 espacios, sus fotos y sus accesos— se sigue
-- administrando en Contenido › Paseo virtual. El editor lo dice y enlaza ahí.
--
-- ⚠️ ORDEN: esta migración va DESPUÉS de desplegar el código. Si la fila
-- existiera antes, el panel abriría una página con una plantilla que todavía
-- no conoce.
-- =============================================================================

-- ─── 1. La lista de plantillas permitidas, con la nueva ─────────────────────
--
-- La restricción vive en la base a propósito: es lo que impidió, el 2026-09-20,
-- que se creara la ficha con una plantilla que el panel aún no podía editar.

alter table paginas drop constraint if exists paginas_plantilla_check;
alter table paginas
  add constraint paginas_plantilla_check
  check (plantilla in (
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
    'tpl_m_home',
    'tpl_n_trabaja',
    'tpl_o_admision_nivel',
    'tpl_p_admisiones_landing',
    'tpl_q_contactos_pagina',
    'tpl_r_grid_personas',
    'tpl_s_documento_politica',
    'tpl_t_portal_accesos',
    'tpl_u_paseo_virtual'
  ));

-- ─── 2. La ficha de /paseo-virtual ──────────────────────────────────────────
--
-- Idempotente: si ya existe, no se toca. Las palabras de `meta_description`
-- son las que encuentra el buscador del sitio —tour, recorrido, instalaciones
-- y los espacios que la gente busca por su nombre—, porque la vista
-- `search_index` pesa el título, la descripción y el slug, y nada más.

insert into paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
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
  'Recorrido virtual 360° por el campus de la Unidad Educativa Atenas: aulas, laboratorios, biblioteca, auditorio, canchas y áreas de inicial. Un tour por las instalaciones sin salir de casa.',
  true
where not exists (select 1 from paginas where slug = 'paseo-virtual');
