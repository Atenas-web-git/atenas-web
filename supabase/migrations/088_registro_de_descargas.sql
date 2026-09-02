-- =============================================================================
-- 088 — Registro de descargas de datos personales
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- Las dos exportaciones del panel se llevan datos personales: la de admisiones
-- saca nombres, FECHAS DE NACIMIENTO DE MENORES, correos y teléfonos de las
-- familias; la de formularios saca lo que cada persona escribió, incluidas las
-- postulaciones de empleo con su hoja de vida.
--
-- Quién puede pedirlas ya está acotado —superadmin y editor de admisiones para
-- el padrón, y el corte por área para los formularios— pero **no quedaba rastro
-- de nadie**. Si mañana ese archivo aparece donde no debe, no hay forma de
-- saber de dónde salió ni cuándo.
--
-- Con dos o tres personas compartiendo el rol de Admisiones, «lo descargó
-- alguien de secretaría» no es una respuesta.
--
-- QUÉ SE GUARDA, Y QUÉ NO
--
-- Se guarda quién, cuándo, qué exportó, con qué filtro y cuántas filas se
-- llevó. **No se guarda el contenido**: este registro existe para saber quién
-- accedió, no para duplicar los datos personales en otra tabla — eso sería
-- crear el mismo problema una segunda vez.
--
-- Los filtros sí, porque distinguen «se llevó una familia» de «se llevó el
-- padrón entero», que es justo lo que hay que poder distinguir.
--
-- ⚠️ ESTE REGISTRO ES ÉL MISMO UN DATO SENSIBLE: dice qué empleado del colegio
-- miró datos de menores y cuándo. Solo lo lee el superadministrador, y cuánto
-- tiempo se conserva es una decisión del colegio que está pendiente.
-- =============================================================================

create table if not exists public.registro_descargas (
  id uuid primary key default gen_random_uuid(),

  -- Quién. `set null` al borrar el usuario y no `cascade`: si alguien deja el
  -- colegio, su registro NO desaparece — que es justo cuando más falta hace.
  usuario_id uuid references auth.users(id) on delete set null,
  -- Copia del nombre en el momento de la descarga. Si el perfil se borra o se
  -- renombra, el registro sigue diciendo quién fue.
  usuario_nombre text,

  /** Qué se exportó: 'admisiones' o 'formulario:<slug>'. */
  recurso text not null,

  /** Los filtros aplicados, tal como llegaron. Distinguen una familia del padrón entero. */
  filtros jsonb not null default '{}'::jsonb,

  /** Cuántas filas se llevó. 0 es un dato válido y útil. */
  filas integer not null default 0,

  created_at timestamptz not null default now()
);

comment on table public.registro_descargas is
  'Quién descargó datos personales, cuándo y cuánto. No guarda el contenido. Ver migración 088.';

-- Las dos consultas que se van a hacer: «las últimas» y «las de esta persona».
create index if not exists registro_descargas_fecha
  on public.registro_descargas (created_at desc);
create index if not exists registro_descargas_usuario
  on public.registro_descargas (usuario_id, created_at desc);

-- -----------------------------------------------------------------------------
-- RLS
--
-- La tabla la escribe `service_role` desde las rutas de exportación, y ese rol
-- se salta RLS. Así que estas políticas no protegen al panel de sí mismo:
-- protegen de que alguien con la clave `anon` —que va en el navegador de
-- cualquier visitante— pueda leer o escribir aquí desde fuera.
--
-- Sin ninguna política y con RLS activo, nadie que no sea service_role puede
-- hacer nada. Es exactamente lo que se quiere: este registro no se consulta
-- desde el navegador.
-- -----------------------------------------------------------------------------
alter table public.registro_descargas enable row level security;

-- Ninguna policy a propósito. Que quede escrito para que nadie lo lea como un
-- olvido y «lo arregle» abriendo la tabla.
