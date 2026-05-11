-- ============================================================
-- Migración 030 — Identidad visual editable (marca)
-- Backoffice Atenas — Fase 4 (sesión 29)
-- Requiere: 011_configuracion_global.sql ejecutada
--
-- Siembra una entrada en `configuracion_global` con clave `marca` que
-- contiene la identidad visual del sitio: logos, paleta de colores,
-- tipografía e información institucional global (la que alimenta los
-- datos del JSON-LD del SEO local).
--
-- El frontend lee esta entrada desde el root layout (Server Component)
-- y la inyecta como CSS variables en `<html>` para que cualquier
-- componente pueda usar `var(--color-navy)`, etc.
--
-- Backoffice: `/admin/configuracion/marca` (solo superadmin).
--
-- IDEMPOTENTE: si la clave ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO configuracion_global (key, value, descripcion)
VALUES (
  'marca',
  jsonb_build_object(
    'logos', jsonb_build_object(
      'principal', '',
      'blanco',    '',
      'escudo',    '',
      'favicon',   '',
      'ogDefault', ''
    ),
    'paleta', jsonb_build_object(
      'navy',     '#1A2B4A',
      'rojo',     '#9e1915',
      'dorado',   '#C9A84C',
      'offWhite', '#F8F5F0',
      'dark',     '#2C2C2C'
    ),
    'tipografia', 'Poppins',
    'institucion', jsonb_build_object(
      'nombre',        'Unidad Educativa Atenas',
      'ruc',           '',
      'direccion',     'Calle Gabriel Román s/n y Av. Pedro Vásconez, Izamba, Ambato',
      'anioFundacion', 1976
    )
  ),
  'Identidad visual del sitio: logos (principal, blanco, escudo, favicon, OG por defecto), paleta de colores institucionales, tipografía e información institucional global usada por el JSON-LD del SEO.'
)
ON CONFLICT (key) DO NOTHING;
