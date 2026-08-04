-- ============================================================
-- Migración 070 — Enlazar /admisiones y /servicios desde el mega-menú.
--
-- Las dos landings están publicadas y funcionando, pero quedaron HUÉRFANAS:
-- no se llega a ellas desde el menú, solo escribiendo la dirección a mano. El
-- seed del mega-menú (032) enlazó sus páginas hijas y se saltó las portadas.
--
--   • Admisiones tiene 5 sub-items (Inicial, EGB Elemental y Media, EGB
--     Superior, Bachillerato IB, Agenda una visita) — falta /admisiones.
--   • Servicios tiene 8 (Bar, Biblioteca, Transporte…) — falta /servicios.
--
-- Que la landing de Admisiones esté huérfana es lo más grave de los dos: es la
-- página que abre el embudo del colegio.
--
-- Mismo patrón que la migración 067, que enlazó /academico/niveles: el enlace
-- entra como PRIMER sub-item de su categoría, con orden 5, delante de los que
-- ya están en 10 y siguientes. Actúa como entrada general antes de las páginas
-- específicas.
--
-- Después de aplicar esto, los dos enlaces se editan como cualquier otro desde
-- Configuración › Mega-menú. No quedan escritos en el código.
--
-- IDEMPOTENTE: cada INSERT comprueba que el enlace no exista ya en esa
-- categoría, así que re-ejecutarla no duplica nada.
-- ============================================================

-- ─── Admisiones ───────────────────────────────────────────────
INSERT INTO menu_items (parent_id, label, href, orden, visible)
SELECT cat.id, 'Proceso de Admisión', '/admisiones', 5, true
FROM menu_items cat
WHERE cat.parent_id IS NULL
  AND cat.label = 'Admisiones'
  AND NOT EXISTS (
    SELECT 1
    FROM menu_items hijo
    WHERE hijo.parent_id = cat.id
      AND hijo.href = '/admisiones'
  );

-- ─── Servicios ────────────────────────────────────────────────
INSERT INTO menu_items (parent_id, label, href, orden, visible)
SELECT cat.id, 'Todos los servicios', '/servicios', 5, true
FROM menu_items cat
WHERE cat.parent_id IS NULL
  AND cat.label = 'Servicios'
  AND NOT EXISTS (
    SELECT 1
    FROM menu_items hijo
    WHERE hijo.parent_id = cat.id
      AND hijo.href = '/servicios'
  );

-- Comprobación tras aplicar: abrir el mega-menú y recorrer las categorías.
-- Solo renderiza la categoría activa, así que mirar el HTML no vale.
