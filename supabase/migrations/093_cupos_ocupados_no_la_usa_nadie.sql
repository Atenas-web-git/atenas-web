-- =============================================================================
-- 093 — Dejar dicho que `cupos_ocupados` no la usa nadie
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- `cupos_admision.cupos_ocupados` existe desde la migración 002, con dos CHECK
-- que la vigilan, y **no la lee ni la escribe una sola línea de código**.
-- Comprobado el 2026-09-22 en el barrido de controles fantasma: las únicas
-- apariciones de ese nombre en todo el repositorio son las tres líneas de la
-- propia 002. En producción vale 0 en todas las filas.
--
-- La ocupación real **se calcula**, no se guarda: la pantalla de Cupos cuenta
-- las solicitudes en estado «matriculado» de ese nivel y año
-- (`admisiones/cupos/page.tsx`). Es lo correcto — un contador guardado se
-- desincroniza en cuanto alguien cambia un estado— pero deja una columna que
-- parece la fuente de la verdad y no lo es.
--
-- POR QUÉ NO SE BORRA
--
-- Borrarla es irreversible y no arregla nada: no molesta, no miente a ningún
-- usuario —no se ve en ninguna pantalla— y el único riesgo real es que alguien
-- la lea en el esquema y se fíe de ella. Para eso basta con que el esquema lo
-- diga, que es lo que hace esta migración.
--
-- ⚠️ Si algún día se decide guardar la ocupación de verdad, hay que hacerlo con
-- un trigger sobre `solicitudes_admision`, no a mano desde el panel, y revisar
-- el CHECK `cupos_ocupados <= cupos_total`: hoy no estorba porque el valor es
-- siempre 0, pero con datos reales impediría bajar un cupo por debajo de los
-- ya matriculados, que es justo lo que a veces hay que hacer.
--
-- ORDEN: no necesita despliegue. Solo cambia un comentario del esquema.
-- =============================================================================

begin;

comment on column public.cupos_admision.cupos_ocupados is
  'SIN USO desde siempre (comprobado 2026-09-22): ninguna línea de código la lee ni la escribe, y vale 0 en todas las filas. La ocupación se CALCULA contando las solicitudes matriculadas de ese nivel y año en admisiones/cupos/page.tsx. No te fíes de esta columna: si algún día se rellena, será por un trigger, y entonces hay que revisar el CHECK cupos_ocupados <= cupos_total. Ver migración 093.';

commit;

-- =============================================================================
-- COMPROBACIÓN
-- =============================================================================
--
--   select col_description('public.cupos_admision'::regclass,
--            (select attnum from pg_attribute
--              where attrelid = 'public.cupos_admision'::regclass
--                and attname = 'cupos_ocupados'));
--
-- Y para confirmar que sigue sin usarse:
--
--   select count(*) filter (where cupos_ocupados <> 0) as rellenas,
--          count(*) as total
--     from public.cupos_admision;
--
-- Esperado: rellenas = 0.
-- =============================================================================
