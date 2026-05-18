-- ============================================================
-- Migración 045 — Mover página /contactos a una fila de `paginas`
-- (plantilla nueva Q `tpl_q_contactos_pagina`).
--
-- Cambios:
--
-- 1. Extender CHECK constraint con `tpl_q_contactos_pagina`.
--
-- 2. Migrar el contenido de `configuracion_global['contactos_pagina']`
--    a una nueva fila de `paginas` con slug = 'contactos',
--    plantilla = 'tpl_q_contactos_pagina'. El JSON se copia tal cual
--    (no hay transformación de schema necesaria — el formato ya es el
--    correcto desde la migración 041/042).
--
-- 3. Deja en pie `configuracion_global['contactos_pagina']` por si el
--    cliente quiere ver el JSON viejo. La app ya no lo lee.
--
-- IDEMPOTENTE: re-ejecutable. Si la fila ya existe NO se sobrescribe.
-- ============================================================

-- ─── 1. Ampliar CHECK constraint ───────────────────────────────────
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
    'tpl_m_home',
    'tpl_n_trabaja',
    'tpl_o_admision_nivel',
    'tpl_p_admisiones_landing',
    'tpl_q_contactos_pagina'
  ));

-- ─── 2. Migrar el contenido ─────────────────────────────────────────
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'contactos',
  'tpl_q_contactos_pagina',
  'Página /contactos',
  CASE
    WHEN cg.value IS NULL THEN '{}'::jsonb
    ELSE cg.value
  END,
  'Contactos — Unidad Educativa Atenas',
  'Contáctanos por teléfono (03 2854281), correo o visítanos en Calle Gabriel Román s/n y Av. Pedro Vásconez, Izamba, Ambato, Ecuador.',
  true
FROM (
  SELECT value FROM configuracion_global WHERE key = 'contactos_pagina'
  UNION ALL
  SELECT NULL::jsonb WHERE NOT EXISTS (
    SELECT 1 FROM configuracion_global WHERE key = 'contactos_pagina'
  )
) AS cg
WHERE NOT EXISTS (
  SELECT 1 FROM paginas WHERE slug = 'contactos'
);
