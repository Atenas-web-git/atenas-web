-- ============================================================
-- Migración 033 — SEO defaults globales editables
-- Backoffice Atenas — Fase 4 (sesión 30)
-- Requiere: 011_configuracion_global.sql ejecutada
--
-- Siembra una entrada en `configuracion_global` con clave `seo` que
-- contiene los metadatos por defecto del sitio:
--   - titleDefault   : title cuando la página no tiene meta_title propio
--   - titleTemplate  : template para páginas con meta_title (ej. "%s | Atenas")
--   - description    : description default
--   - keywords       : palabras clave separadas por coma
--   - ogImage        : ruta de la imagen OG default (relativa al dominio)
--   - ogLocale       : ej. "es_EC", "es_ES"
--   - siteName       : nombre del sitio (OG siteName)
--   - twitterCard    : "summary" | "summary_large_image"
--   - robotsIndex    : si los motores de búsqueda deben indexar el sitio
--   - robotsFollow   : si los motores deben seguir los links
--
-- El root layout convierte `metadata` estático a `generateMetadata()` async
-- que lee esta entrada y la combina con marca.institucion y contacto para
-- producir el `<head>` final + el JSON-LD.
--
-- Backoffice: `/admin/configuracion/seo` (solo superadmin).
--
-- IDEMPOTENTE: si la clave ya existe, NO se sobrescribe.
-- ============================================================

INSERT INTO configuracion_global (key, value, descripcion)
VALUES (
  'seo',
  jsonb_build_object(
    'titleDefault',  'Unidad Educativa Atenas — 50 años formando líderes',
    'titleTemplate', '%s | Unidad Educativa Atenas',
    'description',   'Institución educativa de referencia en Ambato, Ecuador. Bachillerato Internacional IB acreditado, certificación ISO 9001 y 50 años formando líderes en Izamba, Tungurahua.',
    'keywords',      'colegio Ambato, Unidad Educativa Atenas, bachillerato IB Ecuador, mejor colegio Ambato, colegio IB Ecuador, colegio Izamba, colegio privado Ambato, bachillerato internacional Ambato, colegio IB Tungurahua, educación inicial Ambato, colegio bilingüe Ambato, inscripciones colegio Ambato, ISO 9001 educación Ecuador',
    'ogImage',       '/opengraph-image',
    'ogLocale',      'es_EC',
    'siteName',      'Unidad Educativa Atenas',
    'twitterCard',   'summary_large_image',
    'robotsIndex',   true,
    'robotsFollow',  true
  ),
  'Defaults SEO globales del sitio: title, description, keywords, OG image, Twitter card, locale y robots. Cada página puede sobrescribir title y description con `meta_title` y `meta_description` propios (ya editable en cada plantilla). Esta clave también alimenta el JSON-LD del SEO local.'
)
ON CONFLICT (key) DO NOTHING;
