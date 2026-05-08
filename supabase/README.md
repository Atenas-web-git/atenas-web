## Supabase — Migraciones y scripts

Estructura del directorio:

```
supabase/
├── solicitudes_admision.sql       (Fase 1) tabla original del formulario público
├── migrations/
│   ├── 001_profiles_roles.sql       (Fase 2) auth + 4 roles + helpers RLS
│   ├── 002_admisiones_extension.sql amplía solicitudes + historial + cupos
│   ├── 003_correos_anos_adjuntos.sql años lectivos + plantillas + adjuntos + Storage
│   ├── 004_fix_historial_trigger.sql fix SECURITY DEFINER en trigger de historial (visitantes anon no podían insertar solicitudes)
│   ├── 005_documentos_catalogo.sql   catálogo editable de documentos físicos de admisión + seed inicial
│   ├── 006_cms_paginas.sql           (Fase 3) tabla paginas + imagenes + bucket Storage `contenido` + seed Misión/Visión
│   ├── 007_seed_valores_plantilla_b.sql  seed de Valores como plantilla B (sesión 25)
│   ├── 008_notificaciones.sql        (Fase 3) tabla notificaciones + RLS pública filtrada por fechas (sesión 25)
│   ├── 009_notificaciones_modo_visual.sql  modo_visual con 3 valores (imagen_libre / plantilla_imagen_texto / plantilla_diagonal) (sesión 26)
│   ├── 010_seed_valores_matricula_plantilla_d.sql  seed de /matriculas/valores como plantilla D (sesión 26)
│   └── 011_configuracion_global.sql      tabla key-value para config global + seed fechas_matriculas (sesión 26)
├── seed/
│   ├── roles.sql                  cataloga los 4 roles del backoffice
│   └── plantillas_correo.sql      6 plantillas iniciales del pipeline (ejecutar UNA SOLA VEZ)
└── scripts/
    └── create_first_superadmin.sql   bootstrap manual del primer superadmin
```

## Orden de ejecución para arrancar el backoffice

Ejecutar en `Supabase Dashboard → SQL Editor`, en este orden:

1. `solicitudes_admision.sql` (si aún no se ejecutó en sesión anterior)
2. `migrations/001_profiles_roles.sql`
3. `migrations/002_admisiones_extension.sql`
4. `migrations/003_correos_anos_adjuntos.sql`
5. `migrations/004_fix_historial_trigger.sql`
6. `migrations/005_documentos_catalogo.sql` (incluye seed automático si la tabla está vacía)
7. `migrations/006_cms_paginas.sql` (incluye seed de Misión/Visión si la tabla está vacía)
8. `migrations/007_seed_valores_plantilla_b.sql` (seed de Valores como plantilla B; idempotente)
9. `migrations/008_notificaciones.sql` (tabla notificaciones + RLS; sin seed)
10. `migrations/009_notificaciones_modo_visual.sql` (agrega columna modo_visual; idempotente)
11. `migrations/010_seed_valores_matricula_plantilla_d.sql` (seed de /matriculas/valores; idempotente)
12. `migrations/011_configuracion_global.sql` (tabla key-value + seed fechas_matriculas; idempotente)
13. `seed/roles.sql`
14. `seed/plantillas_correo.sql` — solo la primera vez (sobrescribe ediciones manuales si se vuelve a correr)
15. Crear primer usuario en `Authentication → Users` (UI)
16. `scripts/create_first_superadmin.sql` reemplazando `<USER_UUID>` por el UID del paso 15

## Variables de entorno requeridas

`.env.local` (y Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # solo en backend / no exponer al cliente
RESEND_API_KEY=                     # opcional hasta configurar DNS
```
