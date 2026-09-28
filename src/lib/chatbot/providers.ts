/**
 * Adaptadores para los 3 proveedores de IA soportados.
 *
 * Los usan dos cosas: el chatbot público «Ateneo» (`/api/chatbot`) y el
 * asistente del panel (`/api/asistente`). Cada provider expone la misma
 * llamada y devuelve la respuesta como texto plano. Si falla, lanza un Error.
 *
 * NO usamos los SDKs oficiales — todas las APIs son HTTPS planas con
 * `fetch`. Mantiene el bundle del server liviano y evita conflictos
 * de versiones con SDKs que cambian rápido.
 *
 * Lo que cambió el 2026-09-27, al llegar el asistente del panel:
 *
 * - `chatWithProviderDetallado()` devuelve también los tokens consumidos,
 *   para anotar lo que cuesta cada pregunta. `chatWithProvider()` sigue
 *   devolviendo solo el texto: el chatbot no cambia.
 * - `contexto`: un segundo bloque de sistema que cambia en cada turno (en qué
 *   pantalla está el usuario). Va SEPARADO y DESPUÉS del `systemPrompt` para
 *   que la parte estable —el manual entero— se pueda servir desde caché.
 * - Claude: ya no se manda `temperature` a los modelos que la rechazan
 *   —Opus 4.7 en adelante devuelven 400 y el chatbot habría contestado
 *   siempre con el mensaje de respaldo—, y se pide razonamiento bajo donde
 *   existe el parámetro.
 */

import type { ChatbotProvider } from "@/lib/cms/getConfiguracion";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatProviderArgs = {
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: ChatMessage[];
  /**
   * Instrucciones que cambian en cada turno. Van después del `systemPrompt`
   * para no invalidar su caché.
   */
  contexto?: string;
  /** Tope de tokens de la respuesta visible. 800 si no se indica. */
  maxTokens?: number;
  /**
   * Cuánto razona el modelo antes de responder, en los que lo permiten.
   * «minimo» es lo más rápido; «bajo» piensa un poco (el asistente del panel,
   * que tiene que cruzar un manual largo con lo que hay en pantalla).
   */
  esfuerzo?: "minimo" | "bajo";
  /**
   * Pedir al proveedor que guarde el `systemPrompt` en caché. Claude necesita
   * que se le marque; OpenAI y Gemini lo hacen solos por prefijo.
   */
  cachearSistema?: boolean;
};

/** Tokens del turno. `entrada` va a precio completo; `cache` es lo servido desde caché. */
export type ChatUso = { entrada: number; cache: number; salida: number };

export type ChatResultado = { text: string; uso: ChatUso };

const MAX_TOKENS_DEFECTO = 800;

export async function chatWithProvider(
  provider: ChatbotProvider,
  args: ChatProviderArgs
): Promise<string> {
  return (await chatWithProviderDetallado(provider, args)).text;
}

export async function chatWithProviderDetallado(
  provider: ChatbotProvider,
  args: ChatProviderArgs
): Promise<ChatResultado> {
  switch (provider) {
    case "gemini":
      return chatGemini(args);
    case "anthropic":
      return chatAnthropic(args);
    case "openai":
      return chatOpenAI(args);
    default:
      throw new Error(`Provider no soportado: ${provider}`);
  }
}

function entero(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;
}

/* ─── Google Gemini ─────────────────────────────────────────────── */

async function chatGemini(args: ChatProviderArgs): Promise<ChatResultado> {
  const { apiKey, model, systemPrompt, contexto, messages } = args;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Gemini espera "user" / "model" como roles, no "assistant".
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }, ...(contexto ? [{ text: contexto }] : [])],
    },
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: args.maxTokens ?? MAX_TOKENS_DEFECTO,
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      cachedContentTokenCount?: number;
      candidatesTokenCount?: number;
      thoughtsTokenCount?: number;
    };
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new Error("Gemini devolvió respuesta vacía");

  const u = json.usageMetadata ?? {};
  const cache = entero(u.cachedContentTokenCount);
  return {
    text: text.trim(),
    uso: {
      entrada: Math.max(0, entero(u.promptTokenCount) - cache),
      cache,
      salida: entero(u.candidatesTokenCount) + entero(u.thoughtsTokenCount),
    },
  };
}

/* ─── Anthropic Claude ──────────────────────────────────────────── */

/**
 * Desde Opus 4.7, Claude devuelve 400 si se le manda `temperature`, `top_p`
 * o `top_k`: el muestreo lo controla el razonamiento adaptativo. Sonnet 4.6 y
 * Haiku 4.5 sí la aceptan todavía.
 */
const CLAUDE_SIN_TEMPERATURE = /^claude-(opus-5|opus-4-[78]|sonnet-5|fable|mythos)/;

/** Modelos que aceptan `output_config.effort` (Opus 4.6 en adelante y Sonnet 4.6+). */
const CLAUDE_CON_ESFUERZO = /^claude-(opus-5|opus-4-[678]|sonnet-5|sonnet-4-6|fable|mythos)/;

async function chatAnthropic(args: ChatProviderArgs): Promise<ChatResultado> {
  const { apiKey, model, systemPrompt, contexto, messages, esfuerzo, cachearSistema } = args;

  // El sistema va en bloques: el primero (estable) se marca para caché, el
  // segundo (lo que cambia por turno) no. Un solo string lo invalidaría todo
  // cada vez que el usuario cambia de pantalla.
  //
  // TTL de una hora y no los cinco minutos por defecto: escribirla cuesta el
  // doble, pero quien edita el panel pregunta, trabaja diez minutos y vuelve a
  // preguntar; con cinco minutos la caché caduca entre pregunta y pregunta.
  // Se mide con `tokens_cache` en `asistente_uso`.
  const system: Array<Record<string, unknown>> = [
    cachearSistema
      ? { type: "text", text: systemPrompt, cache_control: { type: "ephemeral", ttl: "1h" } }
      : { type: "text", text: systemPrompt },
  ];
  if (contexto) system.push({ type: "text", text: contexto });

  const body: Record<string, unknown> = {
    model,
    max_tokens: args.maxTokens ?? MAX_TOKENS_DEFECTO,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  };
  if (!CLAUDE_SIN_TEMPERATURE.test(model)) body.temperature = 0.4;
  if (esfuerzo && CLAUDE_CON_ESFUERZO.test(model)) {
    // Claude no tiene «minimal»: lo más bajo es «low».
    body.output_config = { effort: "low" };
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Claude ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>;
    stop_reason?: string;
    usage?: {
      input_tokens?: number;
      cache_creation_input_tokens?: number;
      cache_read_input_tokens?: number;
      output_tokens?: number;
    };
  };
  if (json.stop_reason === "refusal") {
    throw new Error("Claude declinó responder (stop_reason: refusal)");
  }
  const text =
    json.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("") ?? "";
  if (!text.trim()) throw new Error("Claude devolvió respuesta vacía");

  const u = json.usage ?? {};
  return {
    text: text.trim(),
    uso: {
      // Escribir la caché se cobra más caro que una entrada normal, así que
      // cuenta como entrada, no como caché.
      entrada: entero(u.input_tokens) + entero(u.cache_creation_input_tokens),
      cache: entero(u.cache_read_input_tokens),
      salida: entero(u.output_tokens),
    },
  };
}

/* ─── OpenAI ────────────────────────────────────────────────────── */

async function chatOpenAI(args: ChatProviderArgs): Promise<ChatResultado> {
  const { apiKey, model, systemPrompt, contexto, messages, esfuerzo } = args;
  const maxTokens = args.maxTokens ?? MAX_TOKENS_DEFECTO;

  // La familia GPT-5 (y los modelos de razonamiento o1/o3) cambian el
  // contrato del endpoint de Chat Completions respecto a GPT-4o:
  //  - usan `max_completion_tokens` en vez de `max_tokens`,
  //  - solo aceptan la `temperature` por defecto (no se envía),
  //  - admiten `reasoning_effort` para acelerar las respuestas cortas.
  const isReasoningModel = /^(gpt-5|o\d)/i.test(model);

  const body: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...(contexto ? [{ role: "system", content: contexto }] : []),
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  };
  if (isReasoningModel) {
    // 1200 de margen para los tokens internos de razonamiento + la respuesta
    // visible. "minimal" mantiene el chatbot rápido; el asistente pide "low".
    body.max_completion_tokens = maxTokens + 1200;
    body.reasoning_effort = esfuerzo === "bajo" ? "low" : "minimal";
  } else {
    body.max_tokens = maxTokens;
    body.temperature = 0.4;
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: {
      prompt_tokens?: number;
      completion_tokens?: number;
      prompt_tokens_details?: { cached_tokens?: number };
    };
  };
  const text = json.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("OpenAI devolvió respuesta vacía");

  const u = json.usage ?? {};
  const cache = entero(u.prompt_tokens_details?.cached_tokens);
  return {
    text,
    uso: {
      // OpenAI cuenta la caché DENTRO de prompt_tokens; aquí se separa.
      entrada: Math.max(0, entero(u.prompt_tokens) - cache),
      cache,
      salida: entero(u.completion_tokens),
    },
  };
}
