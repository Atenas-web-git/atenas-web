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
│   ├── 011_configuracion_global.sql      tabla key-value para config global + seed fechas_matriculas (sesión 26)
│   ├── 012_seed_autorizaciones_plantilla_c.sql  seed de /matriculas/autorizaciones como plantilla C (sesión 26)
│   ├── 013_seed_proceso_matricula_plantilla_c.sql  seed de /matriculas/proceso como plantilla C con galería (sesión 26)
│   ├── 014_seed_politicas_plantilla_a.sql       seed de /el-atenas/politica-calidad y /politica-seguridad como plantilla A (sesión 26)
│   ├── 015_seed_servicios_espacios_plantilla_b.sql  seed de /servicios y /espacios como plantilla B con link + color + highlight (sesión 26)
│   ├── 016_seed_ib_niveles_plantilla_f.sql      amplía CHECK constraint con tpl_f + seed de 7 subpáginas IB y 3 subpáginas Niveles (sesión 26)
│   ├── 017_seed_landing_ib_plantilla_g.sql      amplía CHECK constraint con tpl_g + tpl_h + seed landing /academico/ib (5 bloques) (sesión 26)
│   ├── 018_seed_landing_niveles_plantilla_h.sql seed landing /academico/niveles (4 bloques) (sesión 26)
│   ├── 019_documentos_descargables.sql          tablas documentos_categorias + documentos (Google Drive) + RLS + seed 3 categorías y 7 docs en borrador (sesión 27)
│   ├── 020_seed_documentos_pagina_hero.sql      seed del hero editable de /documentos-institucionales en configuracion_global (sesión 27)
│   ├── 021_cronograma_eventos.sql               tablas cronograma_tipos + cronograma_periodos (editables, ligados a año lectivo) + cronograma_eventos + RLS + seed con 18 eventos y 2 quimestres del 2026-2027 (sesión 27)
│   ├── 022_seed_cronograma_pagina_hero.sql      seed del hero editable de /cronograma-anual en configuracion_global (sesión 27)
│   ├── 023_seed_historia_plantilla_i.sql        amplía CHECK constraint con tpl_i + seed /el-atenas/historia con 5 bloques (incluye video YouTube de fondo en Trayectoria) (sesión 28)
│   ├── 024_seed_matriculas_plantilla_j.sql      amplía CHECK constraint con tpl_j + seed /matriculas (landing) con 3 bloques: Hero + Showcase + Proceso (sesión 28)
│   ├── 025_seed_servicios_plantilla_k.sql       amplía CHECK constraint con tpl_k + seed de las 8 fichas /servicios/* (Bar, Biblioteca, Transporte, Dispensario Médico, Llaves, Becas, Seguro, Quejas) (sesión 28)
│   ├── 026_seed_espacios_plantilla_l.sql        amplía CHECK constraint con tpl_l + seed de las 6 fichas /espacios/* (VASE, CAS, Idioma, Cultura, Ed. Física, Intercambio) (sesión 28)
│   └── 027_seed_quejas_formulario.sql           añade bloque `formulario` editable a /servicios/quejas-sugerencias (textos + tipos + destinatario + asunto del email Resend) (sesión 28)
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
13. `migrations/012_seed_autorizaciones_plantilla_c.sql` (seed de /matriculas/autorizaciones; idempotente)
14. `migrations/013_seed_proceso_matricula_plantilla_c.sql` (seed de /matriculas/proceso con galería; idempotente)
15. `migrations/014_seed_politicas_plantilla_a.sql` (seed de /el-atenas/politica-calidad y /politica-seguridad; idempotente)
16. `migrations/015_seed_servicios_espacios_plantilla_b.sql` (seed de /servicios y /espacios; idempotente)
17. `migrations/016_seed_ib_niveles_plantilla_f.sql` (amplía CHECK constraint con tpl_f + seed de 10 subpáginas académicas; idempotente)
18. `migrations/017_seed_landing_ib_plantilla_g.sql` (amplía CHECK constraint con tpl_g + tpl_h + seed landing /academico/ib; idempotente)
19. `migrations/018_seed_landing_niveles_plantilla_h.sql` (seed landing /academico/niveles; idempotente)
20. `migrations/019_documentos_descargables.sql` (tablas documentos + categorías + RLS + seed inicial; idempotente)
21. `migrations/020_seed_documentos_pagina_hero.sql` (seed del hero editable de /documentos-institucionales; idempotente)
22. `migrations/021_cronograma_eventos.sql` (tablas cronograma + RLS + seed inicial; idempotente)
23. `migrations/022_seed_cronograma_pagina_hero.sql` (seed del hero editable de /cronograma-anual; idempotente)
24. `migrations/023_seed_historia_plantilla_i.sql` (amplía CHECK constraint con tpl_i + seed /el-atenas/historia; idempotente)
25. `migrations/024_seed_matriculas_plantilla_j.sql` (amplía CHECK constraint con tpl_j + seed /matriculas; idempotente)
26. `migrations/025_seed_servicios_plantilla_k.sql` (amplía CHECK constraint con tpl_k + seed de las 8 fichas /servicios/*; idempotente)
27. `migrations/026_seed_espacios_plantilla_l.sql` (amplía CHECK constraint con tpl_l + seed de las 6 fichas /espacios/*; idempotente)
28. `migrations/027_seed_quejas_formulario.sql` (añade bloque `formulario` editable a /servicios/quejas-sugerencias; idempotente — solo aplica si el bloque no existe)
29. `seed/roles.sql`
30. `seed/plantillas_correo.sql` — solo la primera vez (sobrescribe ediciones manuales si se vuelve a correr)
31. Crear primer usuario en `Authentication → Users` (UI)
32. `scripts/create_first_superadmin.sql` reemplazando `<USER_UUID>` por el UID del paso 31

## Variables de entorno requeridas

`.env.local` (y Vercel):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # solo en backend / no exponer al cliente
RESEND_API_KEY=                     # opcional hasta configurar DNS
```
