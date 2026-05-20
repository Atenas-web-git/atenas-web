-- ============================================================
-- Migración 053 — Rediseño premium de los templates de correos.
--
-- Cambios:
--
-- 1. Configuración global `correos_diseno` con la identidad común a los 10
--    correos: variante de logo (white_on_navy / color_on_white) y texto
--    legal del footer. El resto de la identidad (dirección, teléfono,
--    redes) se deriva automáticamente de Marca + Contacto.
--
-- 2. Columnas nuevas en `plantillas_correo_admision` y
--    `plantillas_correo_formularios` para la personalización por template:
--    - acento ('navy' | 'red' | 'gold')
--    - eyebrow (texto pequeño antes del título grande)
--    - hero_image_url (imagen banner opcional)
--    - cta_label / cta_url (botón opcional al final del cuerpo)
--    - helper_text (línea pequeña debajo del CTA, ej. "o responde a este correo")
--
-- 3. Defaults de acento según el mapeo aprobado:
--    Pipeline (6 estados reales): revisando=navy, entrevista_agendada=red,
--              lista_espera=navy, aceptado=gold, matriculado=gold, rechazado=navy
--    Forms (4 tipos): contactos=navy, trabaja=navy,
--                     admisiones-confirmacion=navy, quejas=red
--
-- 4. Eyebrow + hero por defecto del correo "admitido" (es el único con
--    imagen hero por default).
--
-- IDEMPOTENTE: ALTER TABLE ADD COLUMN IF NOT EXISTS + UPSERT.
-- ============================================================

-- ─── 1. Configuración global `correos_diseno` ─────────────────────
INSERT INTO configuracion_global (key, value, descripcion, updated_at)
SELECT
  'correos_diseno',
  $${
    "logoVariant": "white_on_navy",
    "textoLegal": "Este correo es transaccional y fue enviado por la Unidad Educativa Atenas en respuesta a un trámite o consulta que iniciaste. Si lo recibiste por error, responde a este correo y lo daremos de baja."
  }$$::jsonb,
  'Identidad visual común a los 10 correos (logo variant + texto legal). El resto del footer se deriva de Marca + Contacto.',
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'correos_diseno'
);

-- ─── 2. Columnas nuevas en plantillas_correo_admision ─────────────
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS acento         text NOT NULL DEFAULT 'navy';
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS eyebrow        text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS cta_label      text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS cta_url        text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_admision ADD COLUMN IF NOT EXISTS helper_text    text NOT NULL DEFAULT '';

ALTER TABLE plantillas_correo_admision DROP CONSTRAINT IF EXISTS plantillas_acento_check;
ALTER TABLE plantillas_correo_admision
  ADD CONSTRAINT plantillas_acento_check
  CHECK (acento IN ('navy', 'red', 'gold'));

-- ─── 2b. Columnas nuevas en plantillas_correo_formularios ─────────
ALTER TABLE plantillas_correo_formularios ADD COLUMN IF NOT EXISTS acento         text NOT NULL DEFAULT 'navy';
ALTER TABLE plantillas_correo_formularios ADD COLUMN IF NOT EXISTS eyebrow        text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_formularios ADD COLUMN IF NOT EXISTS hero_image_url text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_formularios ADD COLUMN IF NOT EXISTS cta_label      text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_formularios ADD COLUMN IF NOT EXISTS cta_url        text NOT NULL DEFAULT '';
ALTER TABLE plantillas_correo_formularios ADD COLUMN IF NOT EXISTS helper_text    text NOT NULL DEFAULT '';

ALTER TABLE plantillas_correo_formularios DROP CONSTRAINT IF EXISTS plantillas_form_acento_check;
ALTER TABLE plantillas_correo_formularios
  ADD CONSTRAINT plantillas_form_acento_check
  CHECK (acento IN ('navy', 'red', 'gold'));

-- ─── 3. Setear acentos por defecto según el mapeo aprobado ────────
-- Pipeline admisiones
UPDATE plantillas_correo_admision SET acento = 'red'
  WHERE estado = 'entrevista_agendada' AND acento = 'navy';
UPDATE plantillas_correo_admision SET acento = 'gold'
  WHERE estado IN ('aceptado', 'matriculado') AND acento = 'navy';

-- Formularios
UPDATE plantillas_correo_formularios SET acento = 'red'
  WHERE tipo = 'quejas' AND acento = 'navy';

-- ─── 4. Defaults de eyebrow para los correos "premium" ────────────
-- Estos son los únicos con eyebrow + CTA por defecto. El resto los puede
-- agregar el editor desde la UI cuando quiera.
UPDATE plantillas_correo_admision
SET
  eyebrow = '¡Felicitaciones!',
  cta_label = 'Ver estado de mi solicitud →',
  helper_text = 'o responde a este correo si tienes preguntas.'
WHERE estado = 'aceptado' AND eyebrow = '';

UPDATE plantillas_correo_admision
SET
  eyebrow = 'Bienvenido a la familia Atenas',
  cta_label = 'Ver estado de mi solicitud →',
  helper_text = 'o responde a este correo si tienes preguntas.'
WHERE estado = 'matriculado' AND eyebrow = '';
