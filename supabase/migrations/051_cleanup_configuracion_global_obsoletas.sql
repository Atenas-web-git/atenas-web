-- ============================================================
-- Migración 051 — Cleanup de filas obsoletas en configuracion_global.
--
-- Las claves `admisiones_landing` y `contactos_pagina` se introdujeron en la
-- sesión 33 y se migraron a la tabla `paginas` con plantillas P y Q en las
-- migraciones 044 y 045 (sesión 34). La app ya NO lee de
-- `configuracion_global` para esas dos páginas — se quedaron como respaldo
-- por seguridad.
--
-- Han pasado varias sesiones sin issues, así que las borramos para reducir
-- ruido y evitar confusión al cliente cuando revise las configuraciones.
--
-- IDEMPOTENTE: re-ejecutable. DELETE de una key inexistente no falla.
-- ============================================================

DELETE FROM configuracion_global
WHERE key IN ('admisiones_landing', 'contactos_pagina');
