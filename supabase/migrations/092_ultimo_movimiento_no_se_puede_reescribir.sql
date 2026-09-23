-- =============================================================================
-- 092 — Que nadie pueda borrar el reloj de una solicitud
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- El trigger de la 091 no tenía rama `else`:
--
--     if (TG_OP = 'INSERT') then ...
--     elsif (TG_OP = 'UPDATE' and OLD.estado is distinct from NEW.estado) then ...
--     end if;
--
-- Cuando el estado NO cambia, devolvía `NEW` tal cual llegó, así que **lo que
-- trajera el UPDATE en `ultimo_movimiento` se escribía**.
--
-- Hoy ningún camino del panel la manda: los cuatro `update()` de
-- `admisiones/actions.ts` no la incluyen. Pero la política de UPDATE de la
-- migración 002 alcanza a `superadmin` y a `editor_admisiones`, y la clave
-- anónima viaja al navegador: cualquiera de esos dos roles podía hacer un
-- `PATCH` a la API y poner `ultimo_movimiento = now()` en todas las filas de
-- una sola petición. La lista de detenidas quedaría vacía, la campaña de
-- llamadas apuntaría a nadie, y **el historial —que sí es intocable— seguiría
-- diciendo que esas solicitudes llevan meses sin moverse**.
--
-- Cambiar un estado queda auditado. Borrar el reloj, no. Esa asimetría es el
-- problema: la 091 dejó escrito que «si un día no coinciden, es que alguien
-- tocó la tabla saltándose los triggers», y no hacía falta saltárselos.
--
-- Lo encontró el `auditor-seguridad` el 2026-09-22, el mismo día que la 091.
--
-- ORDEN: no necesita despliegue. Es solo la función del trigger; el código no
-- cambia. Se puede aplicar antes o después, y cuanto antes mejor.
-- =============================================================================

begin;

create or replace function public.marcar_movimiento_solicitud()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'INSERT') then
    NEW.ultimo_movimiento := now();
  elsif (OLD.estado is distinct from NEW.estado) then
    NEW.ultimo_movimiento := now();
  else
    -- La rama que faltaba. Da igual lo que venga en el UPDATE: si el estado no
    -- cambió, el reloj se queda donde estaba. Blinda además cualquier futuro
    -- «guardar la ficha entera», que mandaría todas las columnas de vuelta.
    NEW.ultimo_movimiento := OLD.ultimo_movimiento;
  end if;

  return NEW;
end;
$$;

commit;

-- =============================================================================
-- COMPROBACIÓN — correrla al aplicar
-- =============================================================================
--
-- Intenta reescribir el reloj sin cambiar el estado. **No debe moverse.**
-- Sustituye el número por uno real y devuelve todo como estaba: la base es la
-- de producción.
--
--   select numero, estado, ultimo_movimiento
--     from public.solicitudes_admision where numero = 'ADM026-278';
--
--   update public.solicitudes_admision
--      set ultimo_movimiento = now()
--    where numero = 'ADM026-278';
--
--   -- Esperado: la MISMA fecha de antes, no la de ahora.
--   select numero, estado, ultimo_movimiento
--     from public.solicitudes_admision where numero = 'ADM026-278';
--
-- Y que un cambio de estado sí lo mueva, que es lo que no se puede romper al
-- arreglar esto:
--
--   update public.solicitudes_admision set estado = 'postulante'
--    where numero = 'ADM026-278';   -- ⚠️ deja rastro en el historial
--   -- Esperado: ultimo_movimiento = ahora.
--   -- Después, devolver el estado al que tenía.
-- =============================================================================
