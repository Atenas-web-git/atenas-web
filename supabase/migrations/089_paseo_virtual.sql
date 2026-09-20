-- =============================================================================
-- 089 — Paseo virtual 360°
-- -----------------------------------------------------------------------------
-- QUÉ PROBLEMA RESUELVE
--
-- El paseo virtual del colegio vive fuera del sitio, en `atenas.edu.ec/UEAtenas`,
-- hecho en 2016 con un programa que cerró en 2018. Funciona, pero **nadie lo
-- puede administrar**: cambiar una foto significa volver a generar el tour
-- entero con un programa descontinuado.
--
-- Estas dos tablas son el paseo dentro de la plataforma: las escenas y los
-- puntos que llevan de una a otra. El colegio contrató la Opción B de la
-- propuesta, que incluye poder administrarlo sin pedírnoslo.
--
-- QUÉ ADMINISTRA EL COLEGIO, Y QUÉ NO
--
-- Sí: el título y la descripción de cada espacio, el grupo al que pertenece, el
-- orden, la foto y si se publica o no.
--
-- No: **mover los puntos**. Sus coordenadas se migran del tour viejo y se
-- editan desde el código, no desde el panel. Decidido con Esteban el
-- 2026-09-19: un editor visual sobre la esfera es la parte cara, y se puede
-- añadir después sin rehacer nada.
--
-- DÓNDE ESTÁN LAS FOTOS
--
-- En el bucket PRIVADO `paseo`, en `<carpeta>/v<version_imagen>/<cara>.webp`.
-- Seis caras de cubo por escena más una miniatura. Al visitante lo sirve el
-- sitio, no Supabase: servirlas directo agotaría la transferencia gratuita en
-- unas 400 visitas, y al agotarse el paseo dejaría de cargar.
-- =============================================================================

-- ─── Escenas ────────────────────────────────────────────────────────────────

create table if not exists public.paseo_escenas (
  id uuid primary key default gen_random_uuid(),

  /** Lo que va en la URL: `/paseo-virtual/biblioteca`. */
  slug text not null unique,

  titulo text not null,
  descripcion text,

  /** Grupo del menú: Administrativo, Bloque C, Zonas Recreativas… */
  grupo text not null,
  orden_grupo smallint not null default 99,
  orden smallint not null default 99,

  /**
   * Prefijo de las imágenes dentro del bucket. Se conserva el nombre de carpeta
   * del tour viejo (`biblioteca_83`) porque es el que ya está subido, y
   * renombrarlo obligaría a volver a subir 441 archivos para no ganar nada.
   */
  carpeta text not null,

  /**
   * Sube de 1 a 2 cuando el colegio reemplaza la foto. El camino de la imagen
   * la lleva dentro, así que el cambio se ve al instante: sin esto habría que
   * esperar a que caduque la caché del CDN, que está puesta en un año.
   */
  version_imagen smallint not null default 1 check (version_imagen > 0),

  /** Hacia dónde mira la cámara al entrar. Grados, como los usa el visor. */
  vista_yaw numeric(7,3) not null default 0 check (vista_yaw between -180 and 180),
  vista_pitch numeric(7,3) not null default 0 check (vista_pitch between -90 and 90),
  vista_fov numeric(5,2) not null default 60 check (vista_fov between 10 and 120),

  publicada boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.paseo_escenas is
  'Espacios del paseo virtual 360°. Las fotos viven en el bucket privado `paseo`. Ver migración 089.';

create index if not exists paseo_escenas_orden
  on public.paseo_escenas (orden_grupo, orden);

drop trigger if exists trg_paseo_escenas_updated_at on public.paseo_escenas;
create trigger trg_paseo_escenas_updated_at
  before update on public.paseo_escenas
  for each row execute function touch_updated_at();

-- ─── Puntos de navegación ───────────────────────────────────────────────────

create table if not exists public.paseo_puntos (
  id uuid primary key default gen_random_uuid(),

  escena_id uuid not null references public.paseo_escenas(id) on delete cascade,

  /**
   * ⚠️ `restrict` A PROPÓSITO, no `cascade`.
   *
   * Borrar la Biblioteca no puede hacer desaparecer en silencio los 3 puntos de
   * otros espacios que llevaban a ella: el colegio vería tres accesos menos sin
   * saber por qué. Con `restrict`, la base se niega y el panel tiene que decir
   * «a esta escena llegan 3 accesos» y obligar a resolverlo.
   *
   * En este proyecto ya pasó lo contrario: borrar una pregunta de un formulario
   * escondía lo que la gente había contestado.
   */
  destino_id uuid not null references public.paseo_escenas(id) on delete restrict,

  /** Dónde se pinta el punto dentro de la esfera. Grados. */
  yaw numeric(7,3) not null check (yaw between -180 and 180),
  pitch numeric(7,3) not null check (pitch between -90 and 90),

  /** Lo que se lee al pasar el dedo o el ratón: «Biblioteca», «Canchas». */
  etiqueta text not null default '',

  /**
   * Cuatro puntos del tour viejo no tenían texto. Se rellenaron con el nombre
   * del sitio al que llevan y quedan marcados, para que el colegio los revise
   * en vez de heredar el hueco.
   */
  etiqueta_automatica boolean not null default false,

  orden smallint not null default 0,

  created_at timestamptz not null default now(),

  /** Un punto que lleva a su propia escena es siempre un error de migración. */
  constraint paseo_puntos_no_a_si_misma check (escena_id <> destino_id)
);

comment on table public.paseo_puntos is
  'Accesos entre espacios del paseo. Sus coordenadas vienen del tour de 2016. Ver migración 089.';

create index if not exists paseo_puntos_escena on public.paseo_puntos (escena_id, orden);
create index if not exists paseo_puntos_destino on public.paseo_puntos (destino_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────
--
-- Lee cualquiera, pero solo lo publicado: el paseo es una página pública.
-- Escriben el superadministrador y el rol de comunicaciones, que es el de
-- marketing — el mismo equipo que pidió el paseo.

alter table public.paseo_escenas enable row level security;
alter table public.paseo_puntos  enable row level security;

drop policy if exists paseo_escenas_select_public on public.paseo_escenas;
create policy paseo_escenas_select_public
  on public.paseo_escenas for select
  using (publicada = true);

drop policy if exists paseo_escenas_todo_editores on public.paseo_escenas;
create policy paseo_escenas_todo_editores
  on public.paseo_escenas for all
  using (user_has_role('superadmin') or user_has_role('editor_comm'))
  with check (user_has_role('superadmin') or user_has_role('editor_comm'));

-- Un punto se ve si su escena se ve. Si no, el mapa del colegio se podría
-- reconstruir desde una escena despublicada.
drop policy if exists paseo_puntos_select_public on public.paseo_puntos;
create policy paseo_puntos_select_public
  on public.paseo_puntos for select
  using (
    exists (
      select 1 from public.paseo_escenas e
      where e.id = paseo_puntos.escena_id and e.publicada = true
    )
  );

drop policy if exists paseo_puntos_todo_editores on public.paseo_puntos;
create policy paseo_puntos_todo_editores
  on public.paseo_puntos for all
  using (user_has_role('superadmin') or user_has_role('editor_comm'))
  with check (user_has_role('superadmin') or user_has_role('editor_comm'));

-- ─── El bucket ──────────────────────────────────────────────────────────────
--
-- `paseo` se creó el 2026-09-19 desde la API, privado y aceptando solo
-- `image/webp` con 8 MB por archivo. Se deja anotado aquí porque un bucket no
-- aparece en ninguna migración y, si el proyecto se levantara de cero, esto
-- sería lo único que lo recordaría.
--
-- **No se le añade ninguna policy de storage a propósito**: al bucket solo
-- entra el servidor con la clave de servicio. Si algún día el navegador tuviera
-- que leerlo directo, eso es otra decisión y otra migración.
