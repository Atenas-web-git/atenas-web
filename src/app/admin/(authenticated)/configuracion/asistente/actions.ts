"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import type { AsistenteConfig } from "@/lib/cms/getConfiguracion";
import { MODELS_BY_PROVIDER } from "@/lib/chatbot/models";

export type AsistenteActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarAsistenteAction(
  _prev: AsistenteActionState,
  formData: FormData
): Promise<AsistenteActionState> {
  const user = await assertSuperadmin();

  const payloadRaw = String(formData.get("payload") ?? "");
  let value: AsistenteConfig;
  try {
    value = JSON.parse(payloadRaw);
  } catch {
    return { error: "Payload inválido.", ok: false };
  }

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
      error: "Si activas el asistente, debes configurar una API key del proveedor.",
      ok: false,
    };
  }
  const maxHistoryMessages =
    typeof value.maxHistoryMessages === "number" && value.maxHistoryMessages > 0
      ? Math.min(Math.round(value.maxHistoryMessages), 30)
      : 10;
  const notasColegio = typeof value.notasColegio === "string" ? value.notasColegio.slice(0, 12000) : "";

  // Si la apiKey viene enmascarada (••••) el usuario NO la cambió: se
  // conserva la que ya está en la base.
  let finalApiKey = value.apiKey.trim();
  if (/^•+/.test(finalApiKey)) {
    const supa = createAdminClient();
    const { data } = await supa
      .from("configuracion_global")
      .select("value")
      .eq("key", "asistente")
      .maybeSingle();
    const current = (data?.value as { apiKey?: string } | null) ?? null;
    finalApiKey = current?.apiKey ?? "";
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "asistente",
      value: {
        activo: value.activo,
        provider: value.provider,
        model: value.model,
        apiKey: finalApiKey,
        maxHistoryMessages,
        notasColegio,
      },
      descripcion:
        "Asistente del panel: provider + modelo + API key + notas del colegio. Si activo, aparece el botón «Ayuda» en todo el panel.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[asistente]", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admin/configuracion/asistente");
  // El botón «Ayuda» se monta desde el layout del panel: hay que refrescarlo
  // para que aparezca o desaparezca sin esperar a una recarga.
  revalidatePath("/admin", "layout");
  return { error: null, ok: true };
}
