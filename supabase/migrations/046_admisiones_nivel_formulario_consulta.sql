-- ============================================================
-- Migración 046 — Bloque `formularioConsulta` editable en las 4 filas
-- de admisiones por nivel (plantilla O).
--
-- Agrega al JSONB `contenido` de cada fila `admisiones/<nivel>` un
-- nuevo bloque con los textos, stats, fotos y mensajes del formulario
-- de consulta "Resolvemos tus dudas" que aparece al final de cada
-- sub-página de admisiones.
--
-- El endpoint /api/admisiones (que recibe los envíos) YA está conectado
-- al sistema de correos centralizado desde sesión 32 — el destinatario
-- se configura desde /admin/configuracion/correos (preset
-- admisiones-confirmacion). No hay cambios de backend.
--
-- IDEMPOTENTE: solo agrega el bloque si no existe.
-- ============================================================

UPDATE paginas
SET contenido = jsonb_set(
  contenido,
  '{formularioConsulta}',
  $$
  {
    "eyebrow": "¿Aún tienes dudas?",
    "heading": "Resolvemos tus preguntas antes de que des el siguiente paso",
    "description": "No tienes que comprometerte con nada todavía. Si tienes preguntas sobre el proceso de admisión, los requisitos, la propuesta académica o simplemente quieres conocer más sobre el Atenas, escríbenos y te respondemos en menos de 24 horas hábiles, sin presiones.",
    "stats": [
      { "value": "50", "suffix": "+", "label": "años formando\nlíderes" },
      { "value": "IB", "suffix": "",  "label": "único diploma acreditado\nen el centro del país" },
      { "value": "24", "suffix": "h", "label": "tiempo máximo\nde respuesta" }
    ],
    "photos": [
      "https://images.unsplash.com/photo-1758270705657-f28eec1a5694?w=600&q=80",
      "https://images.unsplash.com/photo-1602436215510-cbe1c087f46e?w=600&q=80",
      "https://images.unsplash.com/photo-1631599575881-556a8c416881?w=600&q=80"
    ],
    "badgeFloating": "★ ATENAS · 50 AÑOS",
    "formCardHeading": "Escríbenos, con gusto te informamos",
    "formCardSubtitle": "Sin compromiso. Te respondemos en menos de 24 h hábiles.",
    "submitLabel": "Enviar solicitud de información",
    "sendingLabel": "Enviando...",
    "successTitle": "¡Solicitud enviada!",
    "successText": "Nuestro equipo de admisiones se pondrá en contacto contigo dentro de 24 horas hábiles.",
    "errorText": "Ocurrió un error. Por favor intenta de nuevo o escríbenos a admisiones@atenas.edu.ec",
    "privacyTextPre": "Al enviar este formulario aceptas nuestra",
    "privacyLinkLabel": "Política de Privacidad",
    "privacyLinkHref": "/privacidad",
    "privacyTextPost": ". Tus datos serán usados únicamente para responder tu consulta."
  }
  $$::jsonb,
  true  -- create_missing = true
)
WHERE plantilla = 'tpl_o_admision_nivel'
  AND NOT (contenido ? 'formularioConsulta');
