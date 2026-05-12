-- ============================================================
-- Migración 031 — Contacto + Integraciones globales
-- Backoffice Atenas — Fase 4 (sesión 30)
-- Requiere: 011_configuracion_global.sql ejecutada
--
-- Siembra DOS entradas en `configuracion_global`:
--
-- 1) `contacto` — Canales de contacto editables desde
--    `/admin/configuracion/contacto`:
--    - Teléfonos (marketing, admisiones, secretaría) con extensiones
--    - Emails (admisiones, marketing, secretaría, info general)
--    - Redes sociales (Facebook, Instagram, YouTube, TikTok, X)
--    - WhatsApp del FloatingBoot (número internacional + mensaje default)
--    - Horario de atención
--
--    Nota: la dirección institucional vive en `marca.institucion.direccion`
--    (sesión 29) — alimenta el JSON-LD del SEO. Contacto se enfoca en
--    canales activos de comunicación.
--
-- 2) `integraciones` — Claves API editables desde
--    `/admin/configuracion/integraciones`:
--    - Google Tag Manager (GTM-XXXXXXX)
--    - Facebook Pixel ID
--    - TikTok Pixel ID
--    - Google Analytics 4 (G-XXXXXXX)
--    - Calendly URL
--
--    El root layout inyecta automáticamente los <script> correspondientes
--    cuando el ID está presente. Si está vacío, no se inyecta nada.
--
-- IDEMPOTENTE: si las claves ya existen, NO se sobrescriben.
-- ============================================================

-- 1. Contacto — canales de comunicación
INSERT INTO configuracion_global (key, value, descripcion)
VALUES (
  'contacto',
  jsonb_build_object(
    'telefonos', jsonb_build_array(
      jsonb_build_object('label', 'Marketing / Redes sociales', 'numero', '+593 98 256 1737', 'extension', '', 'esWhatsApp', false),
      jsonb_build_object('label', 'Admisiones',                  'numero', '+593 99 762 2994', 'extension', '', 'esWhatsApp', true),
      jsonb_build_object('label', 'Secretaría / Recepción',      'numero', '+593 3 2854281',   'extension', '100', 'esWhatsApp', false)
    ),
    'emails', jsonb_build_array(
      jsonb_build_object('label', 'Información general', 'email', 'atenas@atenas.edu.ec'),
      jsonb_build_object('label', 'Admisiones',          'email', 'admisiones@atenas.edu.ec'),
      jsonb_build_object('label', 'Marketing / Redes',   'email', 'redessociales@atenas.edu.ec')
    ),
    'redes', jsonb_build_object(
      'facebook',  'https://www.facebook.com/atenasambato',
      'instagram', 'https://www.instagram.com/ueatenas.ambato',
      'youtube',   'https://www.youtube.com/@UnidadEducativaAtenasOficial',
      'tiktok',    '',
      'x',         '',
      'linkedin',  ''
    ),
    'whatsapp', jsonb_build_object(
      'numero',   '593997622994',
      'mensaje',  'Hola, me gustaría recibir información sobre la Unidad Educativa Atenas.',
      'activo',   true
    ),
    'horario', '07:00 — 17:00 (Lunes a Viernes)'
  ),
  'Canales de contacto del colegio: teléfonos con sus extensiones, emails institucionales, redes sociales, WhatsApp del FloatingBoot y horario de atención. Se usan en FloatingBoot, JSON-LD del SEO, mega-menú y footer.'
)
ON CONFLICT (key) DO NOTHING;

-- 2. Integraciones — claves API
INSERT INTO configuracion_global (key, value, descripcion)
VALUES (
  'integraciones',
  jsonb_build_object(
    'gtmId',         '',
    'ga4Id',         '',
    'facebookPixel', '',
    'tiktokPixel',   '',
    'calendlyUrl',   '',
    'metaVerify',    '',
    'googleVerify',  ''
  ),
  'Claves API de integraciones de terceros: Google Tag Manager, Google Analytics 4, Facebook Pixel, TikTok Pixel, Calendly y códigos de verificación de propiedad de Google/Meta. Cuando un campo está vacío, el script correspondiente NO se inyecta en el sitio público.'
)
ON CONFLICT (key) DO NOTHING;
