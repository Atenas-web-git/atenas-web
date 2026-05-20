"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import type { ChatbotConfig } from "@/lib/cms/getConfiguracion";
import { MODELS_BY_PROVIDER } from "@/lib/chatbot/models";

export type ChatbotActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarChatbotAction(
  _prev: ChatbotActionState,
  formData: FormData
): Promise<ChatbotActionState> {
  const user = await assertSuperadmin();

  const payloadRaw = String(formData.get("payload") ?? "");
  let value: ChatbotConfig;
  try {
    value = JSON.parse(payloadRaw);
  } catch {
    return { error: "Payload inválido.", ok: false };
  }

  // Validaciones
  const validProviders = ["gemini", "anthropic", "openai"] as const;
  if (!validProviders.includes(value.provider)) {
    return { error: "Proveedor inválido.", ok: false };
  }
  const validModels = MODELS_BY_PROVIDER[value.provider]?.map((m) => m.id) ?? [];
  if (!validModels.includes(value.model)) {
    return {
      error: `El modelo "${value.model}" no está en el catálogo del proveedor ${value.provider}.`,
      ok: false,
    };
  }
  if (value.activo && !value.apiKey.trim()) {
    return {
      error: "Si activas el chatbot, debes configurar una API key del proveedor.",
      ok: false,
    };
  }
  if (!value.systemPrompt.trim()) {
    return { error: "El system prompt no puede estar vacío.", ok: false };
  }
  if (!value.welcomeMessage.trim()) {
    return { error: "El mensaje de bienvenida no puede estar vacío.", ok: false };
  }
  if (!value.fallbackMessage.trim()) {
    return { error: "El mensaje de fallback no puede estar vacío.", ok: false };
  }

  // Si la apiKey viene "MASKED" (••••...) significa que el usuario NO cambió
  // la key existente. Conservamos la que ya está en BD.
  let finalApiKey = value.apiKey;
  if (/^•+$/.test(value.apiKey)) {
    const supa = createAdminClient();
    const { data } = await supa
      .from("configuracion_global")
      .select("value")
      .eq("key", "chatbot")
      .maybeSingle();
    const current = (data?.value as { apiKey?: string } | null) ?? null;
    finalApiKey = current?.apiKey ?? "";
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "chatbot",
      value: { ...value, apiKey: finalApiKey },
      descripcion:
        'Chatbot IA "Ateneo": provider + modelo + API key + prompts. Si activo, reemplaza al WhatsApp.',
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[chatbot]", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admin/configuracion/chatbot");
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}
