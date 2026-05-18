-- ============================================================
-- Migración 047 — Bloque `ctaFooter` editable en el mega-menú.
--
-- Agrega al JSON de `configuracion_global['mega_menu']` un nuevo
-- sub-objeto `ctaFooter` con:
--
--   - `pretitle` ("¿Listo para ser parte del Atenas?")
--   - `buttons` — array de 4 botones (Solicitar Admisión, Tour Virtual,
--     Cronograma, Contactos). Estilo fijo por posición.
--
-- El teléfono que aparece a la derecha en desktop NO se duplica acá:
-- se deriva automáticamente de `configuracion_global['contacto']
-- .telefonos[0]` (numero + extensión).
--
-- Si la fila `mega_menu` no existe aún (cliente nunca abrió el editor
-- del mega-menú), se crea con los defaults completos.
--
-- IDEMPOTENTE: solo agrega el bloque si no existe.
-- ============================================================

-- ─── Caso 1: la fila no existe — la creamos completa ───────────────
INSERT INTO configuracion_global (key, value, descripcion)
SELECT
  'mega_menu',
  $$
  {
    "bgImage": "/images/00_politicas-de-seguridad-1536x864.jpg",
    "tagline": "50 años formando líderes\ncon valores y excelencia.",
    "ctaFooter": {
      "pretitle": "¿Listo para ser parte del Atenas?",
      "buttons": [
        { "label": "Solicitar Admisión", "href": "/admisiones" },
        { "label": "Tour Virtual",        "href": "/paseo-virtual" },
        { "label": "Cronograma",          "href": "/cronograma-anual" },
        { "label": "Contactos",           "href": "/contactos" }
      ]
    }
  }
  $$::jsonb,
  'Configuración global del mega-menú: foto de fondo + tagline del panel izquierdo, y franja inferior con CTA + 4 botones editables. Teléfono se deriva de configuracion_global[contacto].'
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'mega_menu'
);

-- ─── Caso 2: la fila existe pero no tiene ctaFooter — lo añadimos ──
UPDATE configuracion_global
SET value = jsonb_set(
  value,
  '{ctaFooter}',
  $$
  {
    "pretitle": "¿Listo para ser parte del Atenas?",
    "buttons": [
      { "label": "Solicitar Admisión", "href": "/admisiones" },
      { "label": "Tour Virtual",        "href": "/paseo-virtual" },
      { "label": "Cronograma",          "href": "/cronograma-anual" },
      { "label": "Contactos",           "href": "/contactos" }
    ]
  }
  $$::jsonb,
  true  -- create_missing = true
)
WHERE key = 'mega_menu'
  AND NOT (value ? 'ctaFooter');
