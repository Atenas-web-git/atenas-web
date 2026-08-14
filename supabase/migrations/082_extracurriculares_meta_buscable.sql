-- ============================================================
-- Migración 082 — La página de extracurriculares no se encontraba buscando
-- Backoffice Atenas — sesión 51 (2026-08-14)
-- Requiere: 081_seed_espacio_extracurriculares.sql ejecutada
--
-- Corrige la meta-descripción sembrada por la 081.
--
-- POR QUÉ. El buscador del sitio (`search_index`, migración 055) indexa de
-- cada página solo tres cosas: `titulo` con peso A, `meta_description` con
-- peso B y `slug` con peso C. **El contenido NO se indexa.**
--
-- Con la descripción original, comprobado en producción:
--
--   «escuelas»          → la encuentra
--   «permanentes»       → la encuentra
--   «deportiva»         → la encuentra
--   «extracurriculares» → NO la encuentra
--   «fútbol», «básquet» → NO la encuentra
--
-- Las tres que fallan son justo las que escribiría un padre. «Fútbol» y
-- «básquet» solo estaban en el cuerpo, que no se indexa; y aunque
-- «extracurriculares» está en el slug, `to_tsvector` trata
-- `espacios/extracurriculares` como un token de ruta, no como dos palabras,
-- así que ese peso C no sirve de nada.
--
-- El arreglo es meter esas palabras en la meta-descripción, que sí pesa.
--
-- IDEMPOTENTE Y NO DESTRUCTIVA: solo toca la fila si la descripción sigue
-- siendo exactamente la que sembró la 081. Si alguien del colegio ya la
-- editó desde el panel, no se pisa.
-- ============================================================

UPDATE paginas
SET meta_description =
  'Actividades extracurriculares en la Unidad Educativa Atenas: escuelas permanentes de fútbol y básquet, con entrenamiento continuo durante todo el año lectivo, fuera del horario regular de clases.'
WHERE slug = 'espacios/extracurriculares'
  AND meta_description =
    'Las escuelas permanentes de la Unidad Educativa Atenas ofrecen formación deportiva continua, fuera del horario regular de clases.';
