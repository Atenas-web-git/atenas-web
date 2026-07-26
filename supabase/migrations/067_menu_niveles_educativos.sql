-- ============================================================
-- Migración 067 — Enlazar /academico/niveles desde el mega-menú.
--
-- La landing de Niveles Educativos (plantilla H, sembrada en la
-- migración 018) existe y está publicada, pero quedó huérfana: el
-- seed del mega-menú (032) solo enlazó sus tres subpáginas y el IB,
-- nunca la landing que las agrupa. Se llegaba a ella solo por URL
-- directa.
--
-- Se añade como primer sub-item de "Académico" (orden 5, delante de
-- los que ya están en 10/20/30/40), en el mismo rol de entrada
-- general que /academico/ib tiene para el Bachillerato.
--
-- IDEMPOTENTE: no hace nada si el enlace ya existe o si no encuentra
-- la categoría "Académico".
-- ============================================================

INSERT INTO menu_items (parent_id, label, href, orden, visible)
SELECT cat.id, 'Niveles Educativos', '/academico/niveles', 5, true
FROM menu_items cat
WHERE cat.parent_id IS NULL
  AND cat.label = 'Académico'
  AND NOT EXISTS (
    SELECT 1
    FROM menu_items hijo
    WHERE hijo.parent_id = cat.id
      AND hijo.href = '/academico/niveles'
  );
