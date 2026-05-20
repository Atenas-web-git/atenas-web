/**
 * Catálogo de modelos disponibles por proveedor de IA del chatbot.
 *
 * Cuando el cliente cambia el proveedor desde
 * /admin/configuracion/chatbot, el dropdown de modelo se filtra a estas
 * opciones. Si en el futuro hay un modelo nuevo, basta con agregarlo
 * acá — el resto del sistema lo recoge automáticamente.
 */

import type { ChatbotProvider } from "@/lib/cms/getConfiguracion";

export type ModelOption = {
  id: string;
  label: string;
  /** Pista corta sobre el balance velocidad / capacidad / costo. */
  hint: string;
};

export const MODELS_BY_PROVIDER: Record<ChatbotProvider, ModelOption[]> = {
  gemini: [
    {
      id: "gemini-2.5-flash",
      label: "Gemini 2.5 Flash",
      hint: "Recomendado · última generación Flash: rápida, económica y con mejor comprensión.",
    },
    {
      id: "gemini-2.0-flash",
      label: "Gemini 2.0 Flash",
      hint: "Rápido, contexto enorme, tier gratuito generoso.",
    },
    {
      id: "gemini-1.5-flash",
      label: "Gemini 1.5 Flash",
      hint: "Generación anterior. Rápido y muy económico.",
    },
    {
      id: "gemini-1.5-pro",
      label: "Gemini 1.5 Pro",
      hint: "Generación anterior, más capaz que Flash. Pagado.",
    },
  ],
  anthropic: [
    {
      id: "claude-opus-4-7",
      label: "Claude Opus 4.7",
      hint: "Máxima calidad. Más caro.",
    },
    {
      id: "claude-sonnet-4-6",
      label: "Claude Sonnet 4.6",
      hint: "Balance calidad / costo. Recomendado.",
    },
    {
      id: "claude-haiku-4-5-20251001",
      label: "Claude Haiku 4.5",
      hint: "Más rápido y económico.",
    },
  ],
  openai: [
    {
      id: "gpt-5-mini",
      label: "GPT-5 mini",
      hint: "Recomendado · generación GPT-5 en versión rápida y económica.",
    },
    {
      id: "gpt-5",
      label: "GPT-5",
      hint: "Máxima capacidad de OpenAI. Más caro y algo más lento.",
    },
    {
      id: "gpt-4o-mini",
      label: "GPT-4o mini",
      hint: "Generación anterior. Rápido y económico.",
    },
    {
      id: "gpt-4o",
      label: "GPT-4o",
      hint: "Generación anterior, modelo capaz de la familia 4o.",
    },
  ],
};

export const PROVIDER_LABELS: Record<ChatbotProvider, string> = {
  gemini: "Google Gemini",
  anthropic: "Anthropic Claude",
  openai: "OpenAI",
};

/**
 * Devuelve el modelo válido más cercano para el `provider` dado.
 * Si `current` no existe en la lista, retorna el primero.
 */
export function resolveModel(provider: ChatbotProvider, current: string): string {
  const opts = MODELS_BY_PROVIDER[provider] ?? [];
  if (opts.find((m) => m.id === current)) return current;
  return opts[0]?.id ?? "gemini-1.5-flash";
}
