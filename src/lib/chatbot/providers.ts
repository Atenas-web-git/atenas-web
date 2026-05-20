/**
 * Adaptadores para los 3 proveedores de IA soportados por el chatbot.
 *
 * Cada provider expone `chat({ apiKey, model, systemPrompt, messages })`
 * que devuelve la respuesta como texto plano. Si falla, lanza un Error.
 *
 * NO usamos los SDKs oficiales — todas las APIs son HTTPS planas con
 * `fetch`. Mantiene el bundle del server liviano y evita conflictos
 * de versiones con SDKs que cambian rápido.
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
};

export async function chatWithProvider(
  provider: ChatbotProvider,
  args: ChatProviderArgs
): Promise<string> {
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

/* ─── Google Gemini ─────────────────────────────────────────────── */

async function chatGemini(args: ChatProviderArgs): Promise<string> {
  const { apiKey, model, systemPrompt, messages } = args;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  // Gemini espera "user" / "model" como roles, no "assistant".
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 800,
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
  };
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new Error("Gemini devolvió respuesta vacía");
  return text.trim();
}

/* ─── Anthropic Claude ──────────────────────────────────────────── */

async function chatAnthropic(args: ChatProviderArgs): Promise<string> {
  const { apiKey, model, systemPrompt, messages } = args;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.4,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Claude ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    content?: Array<{ type?: string; text?: string }>;
  };
  const text =
    json.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("") ?? "";
  if (!text.trim()) throw new Error("Claude devolvió respuesta vacía");
  return text.trim();
}

/* ─── OpenAI ────────────────────────────────────────────────────── */

async function chatOpenAI(args: ChatProviderArgs): Promise<string> {
  const { apiKey, model, systemPrompt, messages } = args;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI ${res.status}: ${errBody.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = json.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) throw new Error("OpenAI devolvió respuesta vacía");
  return text;
}
