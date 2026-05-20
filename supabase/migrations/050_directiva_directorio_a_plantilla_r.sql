-- ============================================================
-- Migración 050 — Migrar /el-atenas/directiva-ppff y
-- /el-atenas/directorio-fcea a plantilla R (Grid de personas).
--
-- Cambios:
--
-- 1. Extender CHECK constraint con `tpl_r_grid_personas`.
--
-- 2. Crear 2 filas en `paginas`:
--    - `el-atenas/directiva-ppff` → plantilla R (4 cargos placeholder)
--    - `el-atenas/directorio-fcea` → plantilla R (7 personas reales)
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
    'tpl_q_contactos_pagina',
    'tpl_r_grid_personas',
    'tpl_s_documento_politica',
    'tpl_t_portal_accesos'
  ));

-- ─── 2a. /el-atenas/directiva-ppff (plantilla R) ───────────────────
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'el-atenas/directiva-ppff',
  'tpl_r_grid_personas',
  'Directiva PPFF',
  $${
    "hero": {
      "badge": "QUIÉNES SOMOS",
      "title": "Directiva PPFF",
      "subtitle": "Los padres y madres de familia que representan a nuestra comunidad.",
      "ghostText": "DIRECTIVA",
      "bgImageSrc": ""
    },
    "seccion": {
      "badge": "DIRECTIVA PPFF",
      "heading": "Directiva de Padres de Familia",
      "period": "Pendiente de actualización",
      "items": [
        { "cargo": "Presidente/a", "nombre": "Información pendiente" },
        { "cargo": "Vicepresidente/a", "nombre": "Información pendiente" },
        { "cargo": "Secretario/a", "nombre": "Información pendiente" },
        { "cargo": "Tesorero/a", "nombre": "Información pendiente" }
      ],
      "note": "Los datos de la Directiva de Padres y Madres de Familia serán actualizados una vez confirmados por la institución."
    }
  }$$::jsonb,
  'Directiva de Padres de Familia — Unidad Educativa Atenas',
  'Conoce a los representantes de la directiva de padres y madres de familia de la Unidad Educativa Atenas.',
  true
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'el-atenas/directiva-ppff');

-- ─── 2b. /el-atenas/directorio-fcea (plantilla R) ──────────────────
INSERT INTO paginas (slug, plantilla, titulo, contenido, meta_title, meta_description, publicada)
SELECT
  'el-atenas/directorio-fcea',
  'tpl_r_grid_personas',
  'Directorio FCEA',
  $${
    "hero": {
      "badge": "QUIÉNES SOMOS",
      "title": "Directorio FCEA",
      "subtitle": "La Fundación Cultural y Educativa Ambato es la entidad que gestiona y dirige la institución.",
      "ghostText": "DIRECTORIO",
      "bgImageSrc": ""
    },
    "seccion": {
      "badge": "DIRECTORIO FCEA",
      "heading": "Directorio de la Fundación",
      "period": "2021–2026",
      "items": [
        { "cargo": "Presidenta", "nombre": "Francisca Nieto" },
        { "cargo": "Tesorero", "nombre": "Paúl Reyes" },
        { "cargo": "Secretario", "nombre": "Luis Antonio Anda" },
        { "cargo": "Vocal 1 — Entorno físico y ambiental", "nombre": "Kleber Betancourt" },
        { "cargo": "Vocal 2 — Estilo de vida", "nombre": "Monserrath Villacis" },
        { "cargo": "Vocal 3 — Vida en comunidad", "nombre": "Andrea Villagran" },
        { "cargo": "Vocal 4 — Dinámica educativa e institucional", "nombre": "Martha Alava" }
      ],
      "note": "Fundación Cultural y Educativa Ambato — institución sin fines de lucro responsable de la gestión de la Unidad Educativa Atenas."
    }
  }$$::jsonb,
  'Directorio FCEA — Unidad Educativa Atenas',
  'Directorio de la Fundación Cultural y Educativa Ambato, entidad que gestiona la Unidad Educativa Atenas.',
  true
WHERE NOT EXISTS (SELECT 1 FROM paginas WHERE slug = 'el-atenas/directorio-fcea');
