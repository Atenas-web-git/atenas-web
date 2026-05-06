## Supabase — Migraciones y scripts

Estructura del directorio:

```
supabase/
├── solicitudes_admision.sql       (Fase 1) tabla original del formulario público
├── migrations/
│   ├── 001_profiles_roles.sql       (Fase 2) auth + 4 roles + helpers RLS
│   ├── 002_admisiones_extension.sql amplía solicitudes + historial + cupos
│   └── 003_correos_anos_adjuntos.sql años lectivos + plantillas + adjuntos + Storage
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
5. `seed/roles.sql`
6. `seed/plantillas_correo.sql` — solo la primera vez (sobrescribe ediciones manuales si se vuelve a correr)
7. Crear primer usuario en `Authentication → Users` (UI)
8. `scripts/create_first_superadmin.sql` reemplazando `<USER_UUID>` por el UID del paso 7

## Variables de entorno requeridas

`.env.local` (y Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # solo en backend / no exponer al cliente
RESEND_API_KEY=                     # opcional hasta configurar DNS
```
