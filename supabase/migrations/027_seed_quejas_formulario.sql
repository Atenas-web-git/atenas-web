-- ============================================================
-- Migración 027 — Bloque `formulario` para /servicios/quejas-sugerencias
-- Backoffice Atenas — Fase 3 (sesión 28)
-- Requiere: 025_seed_servicios_plantilla_k.sql ejecutada
--
-- Añade al JSONB `contenido` de la ficha "Quejas y Sugerencias" el
-- bloque `formulario` con la configuración editable del formulario
-- (textos del header, lista de tipos, mensajes de éxito, correo
-- destinatario y asunto del email enviado por Resend).
--
-- El servidor (`/api/quejas`) lee el destinatarioEmail directamente
-- de aquí (no del cliente) por seguridad.
--
-- IDEMPOTENTE: el UPDATE solo se aplica si el bloque `formulario` no
-- existe todavía. Re-ejecutarlo no sobrescribe ediciones manuales.
-- ============================================================

UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{formulario}',
  jsonb_build_object(
    'headerTitle',       'Envía tu comunicación',
    'headerSubtitle',    'Responderemos en un máximo de 5 días hábiles.',
    'tipos',             jsonb_build_array('Queja', 'Sugerencia', 'Reconocimiento', 'Consulta'),
    'submitText',        'Enviar comunicación',
    'successTitle',      '¡Mensaje recibido!',
    'successText',       'Hemos recibido tu comunicación. Te responderemos al correo indicado en un plazo máximo de 5 días hábiles.',
    'destinatarioEmail', 'secretaria@atenas.edu.ec',
    'asuntoEmail',       'Nueva {tipo} — {nombre}'
  )
)
WHERE slug = 'servicios/quejas-sugerencias'
  AND NOT (contenido ? 'formulario');
