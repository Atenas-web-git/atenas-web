-- =============================================================================
-- 087 — El historial de cada solicitud dice quién hizo el cambio
-- -----------------------------------------------------------------------------
-- Hoy CADA LÍNEA del historial de CADA solicitud dice «Sistema». Los ocho
-- cambios de estado del pipeline, el alta manual, todo.
--
-- POR QUÉ
--
-- El trigger `log_solicitud_estado_change` (migración 004) guarda
-- `cambiado_por = auth.uid()`. Pero todas las escrituras del panel van por
-- `createAdminClient()`, que es `service_role` puro y no lleva el JWT de nadie:
-- dentro del trigger, `auth.uid()` es NULL. La ficha lo pinta como
-- `full_name ?? "Sistema"`, así que el hueco se lee como si lo hubiera hecho
-- la máquina.
--
-- No es que le falte el autor a un caso raro: **no hay autor en ninguna parte
-- del pipeline**. Con dos personas compartiendo el rol de Admisiones, nadie
-- sabe quién movió a una familia a «No admitido».
--
-- CÓMO SE RESUELVE
--
-- Una columna `ultimo_editor` en la propia solicitud, que la server action
-- escribe **en el mismo UPDATE** que cambia el estado, y que el trigger lee de
-- `NEW`. Se eligió así frente a las dos alternativas:
--
--   · Rellenar `cambiado_por` con otro UPDATE justo después deja una ventana
--     entre el trigger y la corrección, y hay que acordarse en cada sitio.
--   · Pasar el JWT del usuario al cliente en todo el módulo lo arregla de raíz,
--     pero cambia a RLS de usuario TODO el panel, que hoy depende de
--     `service_role` para leer lo que RLS le cerraría. Es otra tarea, y grande.
--
-- Con la columna, autor y cambio viajan juntos en una sola escritura: no hay
-- carrera posible ni un segundo paso que se pueda olvidar.
--
-- ⚠️ ORDEN DE DESPLIEGUE: esta migración va ANTES que el código. El código
-- nuevo escribe `ultimo_editor` y sin la columna el guardado falla — y aquí
-- fallaría al mover una solicitud de estado, que es la acción más usada del
-- módulo.
--
-- COMPATIBLE HACIA ATRÁS: mientras el código viejo siga desplegado, no manda
-- la columna, el trigger cae en `auth.uid()` y todo sigue exactamente como
-- estaba. No hay ventana rota entre aplicar esto y desplegar.
-- =============================================================================

alter table public.solicitudes_admision
  add column if not exists ultimo_editor uuid references auth.users(id) on delete set null;

comment on column public.solicitudes_admision.ultimo_editor is
  'Quién hizo el último cambio desde el panel. Lo escribe la server action en el mismo UPDATE, y el trigger del historial lo lee de NEW. NULL = vino del formulario público. Ver migración 087.';

-- -----------------------------------------------------------------------------
-- El trigger, con el autor
--
-- `coalesce(NEW.ultimo_editor, auth.uid())` y en ese orden: el panel escribe la
-- columna, y si algún día algo entra con el JWT del usuario de verdad,
-- `auth.uid()` sigue sirviendo de respaldo. Si no hay ninguno —el formulario
-- público, que es anónimo— queda NULL, y ahí «Sistema» es la palabra correcta:
-- nadie del colegio hizo ese cambio.
-- -----------------------------------------------------------------------------
create or replace function public.log_solicitud_estado_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (TG_OP = 'INSERT') then
    insert into solicitudes_historial (solicitud_id, estado_anterior, estado_nuevo, cambiado_por)
    values (NEW.id, null, NEW.estado, coalesce(NEW.ultimo_editor, auth.uid()));
  elsif (TG_OP = 'UPDATE' and OLD.estado is distinct from NEW.estado) then
    insert into solicitudes_historial (solicitud_id, estado_anterior, estado_nuevo, cambiado_por)
    values (NEW.id, OLD.estado, NEW.estado, coalesce(NEW.ultimo_editor, auth.uid()));
  end if;

  if (TG_OP = 'UPDATE') then
    NEW.updated_at = now();
  end if;

  return NEW;
end;
$$;

-- -----------------------------------------------------------------------------
-- COMPROBACIÓN
-- -----------------------------------------------------------------------------
--
-- 1) La columna existe y todas las filas la tienen a NULL (nadie la ha escrito
--    todavía, es lo esperado):
--
--      select count(*) as total,
--             count(ultimo_editor) as con_editor
--        from public.solicitudes_admision;
--
-- 2) El historial de hoy, que dirá «Sistema» en todo — es el punto de partida:
--
--      select h.estado_anterior, h.estado_nuevo, h.cambiado_por, p.full_name
--        from public.solicitudes_historial h
--        left join public.profiles p on p.id = h.cambiado_por
--       order by h.created_at desc limit 10;
--
-- 3) Después de desplegar el código y mover UNA solicitud desde el panel, esa
--    misma consulta debe traer el nombre de quien la movió en la fila nueva.
--    Las anteriores se quedan en «Sistema» para siempre: el dato de quién las
--    hizo no existe en ninguna parte y no se puede inventar.
-- -----------------------------------------------------------------------------
