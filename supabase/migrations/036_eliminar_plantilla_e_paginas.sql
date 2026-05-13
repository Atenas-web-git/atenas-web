-- ============================================================
-- Migración 036 — Limpieza Plantilla E del catálogo de páginas
-- Backoffice Atenas — Fase 4 (sesión 31)
-- Requiere: 026 (CHECK con tpl_e_hero_galeria) + 034 (seed plantilla E) + 035 (módulo dedicado)
--
-- Con la migración 035 se introduce el módulo dedicado de Reconocimientos
-- (5 tablas) que reemplaza a la Plantilla E del catálogo general de páginas.
-- Esta migración elimina las 10 filas seed del seed de la 034 (las 2 landings
-- + 8 detalles) de la tabla `paginas`.
--
-- NO se modifica el CHECK constraint `paginas_plantilla_check`: el valor
-- 'tpl_e_hero_galeria' sigue válido a nivel BD por si en el futuro quisiera
-- reintroducirse, pero el frontend ya no expone la plantilla en el editor.
--
-- IDEMPOTENTE: re-ejecutable. Si las filas ya están borradas, no hace nada.
-- ============================================================

DELETE FROM paginas
WHERE plantilla = 'tpl_e_hero_galeria'
  AND slug IN (
    'reconocimientos/academicos',
    'reconocimientos/academicos/olimpiadas',
    'reconocimientos/academicos/ib',
    'reconocimientos/academicos/cambridge',
    'reconocimientos/academicos/oratoria',
    'reconocimientos/deportivos',
    'reconocimientos/deportivos/basquetbol',
    'reconocimientos/deportivos/atletismo',
    'reconocimientos/deportivos/futbol',
    'reconocimientos/deportivos/natacion'
  );
