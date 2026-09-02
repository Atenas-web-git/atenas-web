-- =============================================================================
-- 086 — El buscador de solicitudes encuentra sin tildes
-- -----------------------------------------------------------------------------
-- Medido el 2026-08-19 con los datos reales del colegio:
--
--     «Pérez» → encuentra a María José Pérez Romero
--     «Perez» → no encuentra nada
--
-- `ilike` compara carácter a carácter y no sabe que `e` y `é` son la misma
-- letra. Casi nadie escribe tildes al buscar, y menos con prisa en ventanilla:
-- secretaría teclea «Perez», no encuentra a la familia y concluye que la
-- solicitud no existe. En periodo de admisiones eso se convierte en «el sistema
-- perdió mi postulación».
--
-- Y no es un caso raro en Ecuador: Pérez, Gómez, Martínez, Hernández, Rodríguez.
--
-- CÓMO SE RESUELVE
--
-- Una columna generada con el texto ya sin tildes y en minúsculas, y el
-- buscador comparando contra ella. PostgREST no permite llamar funciones en el
-- filtro —`unaccent(columna) ilike …` no se puede expresar por REST—, así que
-- la normalización tiene que estar ya hecha en la fila.
--
-- ⚠️ ORDEN DE DESPLIEGUE: esta migración va ANTES que el código. El filtro
-- nuevo busca sobre `busqueda`, y sin la columna el listado de solicitudes
-- responde error. Es la regla que ya estuvo a punto de romper la 074 y la 079.
-- =============================================================================

-- `unaccent` es la que quita las tildes. En Supabase las extensiones viven en
-- el esquema `extensions`.
create extension if not exists unaccent with schema extensions;

-- `pg_trgm` es la que hace que el índice de más abajo sirva de algo: un índice
-- normal no se puede usar cuando el patrón empieza por comodín (`%perez%`), y
-- todas las búsquedas del panel son de esa forma.
create extension if not exists pg_trgm with schema extensions;

-- -----------------------------------------------------------------------------
-- Envoltorio inmutable de unaccent
--
-- Una columna generada exige una función IMMUTABLE, y `unaccent(text)` es solo
-- STABLE: depende del diccionario activo, que se puede cambiar en caliente.
-- La forma de dos argumentos recibe el diccionario explícito, así que su
-- resultado sí depende únicamente de la entrada y se puede declarar inmutable
-- sin mentir.
-- -----------------------------------------------------------------------------
create or replace function public.unaccent_inmutable(texto text)
returns text
language sql
immutable
strict
parallel safe
set search_path = ''
as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, texto)
$$;

comment on function public.unaccent_inmutable(text) is
  'unaccent con el diccionario fijado, para poder usarlo en columnas generadas e índices. Ver migración 086.';

-- -----------------------------------------------------------------------------
-- La columna de búsqueda
--
-- Junta los tres campos por los que busca el panel —número de solicitud,
-- nombres y apellidos del estudiante— ya normalizados. Al ser GENERATED ALWAYS
-- … STORED, Postgres la mantiene sola: no hace falta trigger, ni recalcularla
-- al editar, ni acordarse de nada al insertar.
--
-- Concatenar también arregla algo que hoy no funciona: buscar «Maria Perez»
-- —nombre y apellido juntos— no devolvía nada, porque ningún campo por separado
-- contiene las dos palabras.
-- -----------------------------------------------------------------------------
alter table public.solicitudes_admision
  add column if not exists busqueda text
  generated always as (
    public.unaccent_inmutable(
      lower(
        coalesce(numero, '') || ' ' ||
        coalesce(est_nombres, '') || ' ' ||
        coalesce(est_apellidos, '')
      )
    )
  ) stored;

comment on column public.solicitudes_admision.busqueda is
  'Número, nombres y apellidos sin tildes y en minúsculas. La mantiene Postgres; no se escribe a mano. Contra ella busca filtrarSolicitudes().';

-- Índice trigram: es el que permite que `busqueda ilike '%perez%'` no recorra
-- la tabla entera. Con las solicitudes de hoy da igual; con las de dentro de
-- tres años, no.
create index if not exists solicitudes_admision_busqueda_trgm
  on public.solicitudes_admision
  using gin (busqueda extensions.gin_trgm_ops);

-- -----------------------------------------------------------------------------
-- COMPROBACIÓN — ejecutar estas tres al aplicar la migración
-- -----------------------------------------------------------------------------
--
-- 1) El caso de la ficha. Debe devolver la solicitud de Pérez Romero:
--
--      select numero, est_apellidos, busqueda
--        from public.solicitudes_admision
--       where busqueda ilike '%perez%';
--
-- 2) La columna rellena en todas las filas que ya existían. Al ser generada,
--    Postgres la calcula para las anteriores al añadirla. Debe dar 0:
--
--      select count(*) from public.solicitudes_admision
--       where busqueda is null or btrim(busqueda) = '';
--
-- 3) LA IMPORTANTE, y la que no es obvia: que Postgres y JavaScript normalicen
--    IGUAL. La columna la rellena `unaccent`; el buscador normaliza en el
--    navegador con `normalize("NFD")`. Son dos implementaciones distintas
--    haciendo lo mismo, y si difieren en un carácter la búsqueda no encuentra
--    y no avisa.
--
--    Esto muestra qué produce Postgres para los apellidos que de verdad
--    aparecen aquí:
--
--      select apellido, public.unaccent_inmutable(lower(apellido)) as segun_postgres
--        from (values ('Pérez'),('Gómez'),('Martínez'),('Hernández'),
--                     ('Rodríguez'),('Núñez'),('Peña'),('Muñoz'),
--                     ('Ordóñez'),('Chávez'),('Añazco'),('Iñiguez'))
--             as t(apellido);
--
--    JavaScript, con la misma entrada, produce:
--      perez · gomez · martinez · hernandez · rodriguez · nunez · pena ·
--      munoz · ordonez · chavez · anazco · iniguez
--
--    Si alguna fila NO coincide con esa lista, el buscador fallará justo con
--    ese apellido. Anotarlo y avisar antes de dar la tarea por cerrada.
-- -----------------------------------------------------------------------------
