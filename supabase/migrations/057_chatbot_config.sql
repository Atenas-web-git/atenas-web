-- ============================================================
-- Migración 057 — Configuración del chatbot IA "Ateneo".
--
-- Crea la fila `configuracion_global['chatbot']` con la config del
-- chatbot virtual que aparece como botón flotante en el sitio público.
--
-- Cuando esta config tiene `activo = true` Y `apiKey` no vacía, el
-- chatbot reemplaza al botón flotante de WhatsApp. Sino, prevalece el
-- WhatsApp configurado en `configuracion_global['contacto'].whatsapp`.
--
-- Soporta 3 providers: Google Gemini (default), Anthropic Claude, OpenAI.
--
-- IDEMPOTENTE: si la fila ya existe NO se sobrescribe.
-- ============================================================

INSERT INTO configuracion_global (key, value, descripcion, updated_at)
SELECT
  'chatbot',
  $${
    "activo": false,
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "apiKey": "",
    "systemPrompt": "Eres Ateneo, el asistente virtual oficial de la Unidad Educativa Atenas (Ambato, Ecuador). Tu rol es ayudar a padres de familia, postulantes y estudiantes a encontrar información sobre el colegio.\n\nReglas:\n- Responde SOLO sobre temas del colegio Atenas (admisiones, niveles educativos, programa IB, matrículas, servicios, espacios, cronograma, política de privacidad, contacto, etc.). Para cualquier otro tema, redirige amablemente a la página de contactos.\n- Usa un tono formal pero cercano. Trata de \"tú\" al usuario. Lenguaje claro, sin emojis.\n- Sé conciso: respuestas de 2–4 oraciones cuando sea posible.\n- Si no tienes información suficiente para responder con seguridad, di explícitamente que no tienes esa información y sugiere consultar la página de contactos.\n- NUNCA inventes datos (fechas, valores, nombres, requisitos). Si no aparecen en el contenido del sitio, di que no los tienes.\n- Cuando referencies una sección, menciona la ruta entre paréntesis, ej. \"(ver /admisiones)\".",
    "welcomeMessage": "¡Hola! Soy Ateneo, asistente virtual de la Unidad Educativa Atenas. ¿En qué puedo ayudarte?",
    "fallbackMessage": "No tengo información suficiente para responder eso. Te recomiendo escribirnos desde la página de contactos y un miembro del equipo te ayudará personalmente.",
    "fallbackCtaLabel": "Ir a Contactos",
    "fallbackCtaUrl": "/contactos",
    "maxHistoryMessages": 12
  }$$::jsonb,
  'Chatbot IA "Ateneo": provider (Gemini/Claude/OpenAI), modelo, API key, prompts y mensajes editables. Si activo, reemplaza al botón flotante de WhatsApp.',
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM configuracion_global WHERE key = 'chatbot'
);
