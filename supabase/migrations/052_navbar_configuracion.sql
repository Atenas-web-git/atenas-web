-- ============================================================
-- Migración 052 — Configuración global de la barra de navegación.
--
-- Permite editar desde `/admin/configuracion/navbar` todos los elementos
-- de la barra superior fija: badge "50 AÑOS" (con logo opcional cuando el
-- cliente lo entregue), CTAs Portal Familiar y Tour Virtual, visibilidad
-- de búsqueda y campanita, label del botón MENÚ.
--
-- El logo principal del colegio se sigue editando desde Marca.
-- Las categorías del mega-menú se siguen editando desde Mega-menú.
--
-- IDEMPOTENTE: si la fila ya existe NO se sobrescribe.
-- ============================================================

INSERT INTO configuracion_global (key, value, updated_at)
SELECT
  'navbar',
  $${
    "aniversarioBadge": {
      "visible": true,
      "label": "50 AÑOS",
      "logoSrc": ""
    },
    "ctaPortal": {
      "visible": true,
      "label": "PORTAL FAMILIAR",
      "href": "/portal-familiar"
    },
    "ctaTour": {
      "visible": true,
      "label": "TOUR VIRTUAL",
      "href": "/paseo-virtual"
    },
    "busqueda": { "visible": false },
    "campana": { "visible": true },
    "menuLabel": "MENÚ"
  }$$::jsonb,
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'navbar'
);
