-- =============================================================================
-- 091 — Cuánto lleva parada cada solicitud, en una columna
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- El remarketing de admisiones —contratado y cobrado— empieza por algo simple:
-- que secretaría pueda sacar en un minuto la lista de familias que se quedaron
-- a medias, con su teléfono, y repartir las llamadas.
--
-- El dashboard ya enseña esa lista, pero la calcula **en memoria**: se trae el
-- historial completo de cambios de estado y busca el último de cada solicitud.
-- Eso sirve para pintar una tarjeta; no sirve para filtrar el listado ni para
-- exportarlo, porque el filtro tiene que ocurrir en la base ANTES de paginar.
-- Sin esto, «detenidas más de N días» solo se puede aplicar a la página que ya
-- se trajo, y el archivo saldría con lo que no es.
--
-- POR QUÉ UNA COLUMNA Y NO UNA CONSULTA CON JOIN
--
-- PostgREST no filtra por un agregado de otra tabla. Y meter una vista aparte
-- volvería a dejar dos sitios calculando lo mismo, que es el fallo que este
-- proyecto ya pagó con el conteo de cupos.
--
-- La escribe el mismo evento que escribe el historial —un cambio de estado—,
-- así que no pueden separarse: si un día no coinciden, es que alguien tocó la
-- tabla saltándose los triggers.
--
-- ⚠️ QUÉ CUENTA COMO «MOVIMIENTO»: solo el cambio de estado. NO corregir un
-- apellido, NO añadir una nota. Por eso no vale `updated_at`: con él, una
-- solicitud olvidada durante dos meses parecería recién atendida porque
-- alguien le arregló una tilde.
--
-- ORDEN: esta migración va ANTES de desplegar el código. La columna es nueva y
-- nadie la pide todavía, así que aplicarla sola no rompe nada.
--
-- ⛔️ SI VUELVES A CORRER ESTA, CORRE LA 092 DETRÁS. Este archivo contiene un
-- `create or replace function marcar_movimiento_solicitud()` con el cuerpo
-- VIEJO, sin la rama `else` que añadió la 092. Todo lo demás de aquí es
-- idempotente y por eso invita a re-ejecutarla; la función no lo es: volver a
-- correr la 091 sola revierte la 092 **en silencio** y deja el reloj otra vez
-- reescribible desde fuera.
-- ==============================================================================

-- ─── 1. La columna ──────────────────────────────────────────────────────────

alter table public.solicitudes_admision
  add column if not exists ultimo_movimiento timestamptz;

comment on column public.solicitudes_admision.ultimo_movimiento is
  'Fecha del último CAMBIO DE ESTADO. La escribe el trigger trg_solicitud_movimiento (migración 091). No se mueve al editar datos ni al añadir notas: sirve para saber cuánto lleva parada una solicitud.';

-- ─── 2. Rellenar lo que ya existe ───────────────────────────────────────────
--
-- El último cambio del historial; y si una fila no tuviera historial —se
-- importó por SQL saltándose el trigger—, la fecha en que entró, que es
-- exactamente cuánto lleva sin moverse. Es el mismo respaldo que usa hoy el
-- cálculo del dashboard, para que los dos digan el mismo número.

update public.solicitudes_admision s
   set ultimo_movimiento = coalesce(
         (select max(h.created_at)
            from public.solicitudes_historial h
           where h.solicitud_id = s.id),
         s.created_at
       )
 where s.ultimo_movimiento is null;

-- Con las filas viejas ya rellenas, la columna puede exigirse siempre. El
-- default cubre la ventana entre aplicar esto y desplegar el código: una
-- solicitud que entre por el formulario público en ese rato queda con la fecha
-- correcta aunque el trigger de abajo todavía no existiera.
alter table public.solicitudes_admision
  alter column ultimo_movimiento set default now();

alter table public.solicitudes_admision
  alter column ultimo_movimiento set not null;

-- ─── 3. El trigger que la mantiene ──────────────────────────────────────────
--
-- ⚠️ Va en un trigger PROPIO y BEFORE, no dentro de `log_solicitud_estado_change`.
-- Ese es AFTER (migración 002), y en un trigger AFTER **escribir en NEW no
-- tiene ningún efecto**: Postgres ignora la fila que devuelve. De hecho ahí hay
-- una línea `NEW.updated_at = now()` (migración 087) que no hace nada desde que
-- se escribió; quien mantiene `updated_at` es el código del panel, que lo manda
-- en cada UPDATE. No se toca aquí para no cambiar dos cosas a la vez, pero que
-- quede dicho: esa línea engaña.

create or replace function public.marcar_movimiento_solicitud()
returns trigger
language plpgsql
as $$
begin
  if (TG_OP = 'INSERT') then
    NEW.ultimo_movimiento := now();
  elsif (TG_OP = 'UPDATE' and OLD.estado is distinct from NEW.estado) then
    NEW.ultimo_movimiento := now();
  end if;

  return NEW;
end;
$$;

drop trigger if exists trg_solicitud_movimiento on public.solicitudes_admision;
create trigger trg_solicitud_movimiento
  before insert or update on public.solicitudes_admision
  for each row execute function public.marcar_movimiento_solicitud();

-- ─── 4. Para buscar por ella sin leer la tabla entera ───────────────────────
--
-- El filtro siempre pregunta «las que llevan más de N días», es decir
-- `ultimo_movimiento <= <fecha>`, y las que más importan son las más antiguas.

create index if not exists idx_solicitudes_ultimo_movimiento
  on public.solicitudes_admision (ultimo_movimiento);

-- =============================================================================
-- COMPROBACIÓN — correrla al aplicar
-- =============================================================================
--
-- 1) Ninguna fila sin fecha, y ninguna en el futuro:
--
--      select count(*) filter (where ultimo_movimiento is null)  as sin_fecha,
--             count(*) filter (where ultimo_movimiento > now())  as en_el_futuro,
--             count(*)                                           as total
--        from public.solicitudes_admision;
--
--    Esperado: sin_fecha = 0, en_el_futuro = 0.
--
-- 2) Que la columna diga lo mismo que el historial, que es de donde salía el
--    número del dashboard. Esperado: cero filas.
--
--      select s.numero,
--             s.ultimo_movimiento,
--             max(h.created_at) as ultimo_del_historial
--        from public.solicitudes_admision s
--        join public.solicitudes_historial h on h.solicitud_id = s.id
--       group by s.id, s.numero, s.ultimo_movimiento
--      having abs(extract(epoch from (s.ultimo_movimiento - max(h.created_at)))) > 1;
--
-- 3) Que el trigger funcione, sin dejar rastro. Cambia el estado de una
--    solicitud de prueba y míralo; después devuélvelo a su estado real:
--
--      select numero, estado, ultimo_movimiento from public.solicitudes_admision
--       order by created_at desc limit 3;
--
--    ⚠️ La base es la de producción. Si se hace esta prueba, devolver el estado
--    al que tenía — y recordar que el historial guardará los dos cambios.
-- =============================================================================
