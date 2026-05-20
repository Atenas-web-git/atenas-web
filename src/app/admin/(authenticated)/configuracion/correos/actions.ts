"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  CORREO_PURPOSES,
  type CorreosConfig,
  type CorreoPreset,
  type CorreoPurpose,
} from "@/lib/cms/correos";

export type CorreosActionState = { error: string | null; ok: boolean };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarCorreosAction(
  _prev: CorreosActionState,
  formData: FormData
): Promise<CorreosActionState> {
  const user = await assertSuperadmin();

  const providerRaw = String(formData.get("provider") ?? "resend");
  const provider: CorreosConfig["provider"] =
    providerRaw === "smtp" ? "smtp" : "resend";

  // Secretos enmascarados: si el campo viene solo con bullets, el editor
  // no lo cambió → conservamos el valor real guardado en BD.
  const isMasked = (s: string) => /^•+$/.test(s.trim());
  const supabaseRead = createAdminClient();
  const { data: currentRow } = await supabaseRead
    .from("configuracion_global")
    .select("value")
    .eq("key", "correos")
    .maybeSingle();
  const currentCfg = (currentRow?.value as Partial<CorreosConfig> | null) ?? null;

  const rawResendApiKey = String(formData.get("resend_apiKey") ?? "").trim();
  const rawSmtpPass = String(formData.get("smtp_pass") ?? "");

  const resend: CorreosConfig["resend"] = {
    apiKey: isMasked(rawResendApiKey)
      ? currentCfg?.resend?.apiKey ?? ""
      : rawResendApiKey,
    defaultFrom: String(formData.get("resend_defaultFrom") ?? "").trim(),
    defaultFromName: String(formData.get("resend_defaultFromName") ?? "").trim(),
  };

  const portRaw = Number(formData.get("smtp_port"));
  const smtp: CorreosConfig["smtp"] = {
    host: String(formData.get("smtp_host") ?? "").trim(),
    port: Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 587,
    secure: formData.get("smtp_secure") === "on",
    user: String(formData.get("smtp_user") ?? "").trim(),
    pass: isMasked(rawSmtpPass) ? currentCfg?.smtp?.pass ?? "" : rawSmtpPass,
    defaultFrom: String(formData.get("smtp_defaultFrom") ?? "").trim(),
    defaultFromName: String(formData.get("smtp_defaultFromName") ?? "").trim(),
  };

  // Validaciones mínimas según provider activo
  if (provider === "resend") {
    if (resend.defaultFrom && !EMAIL_REGEX.test(resend.defaultFrom)) {
      return { error: "El email por defecto de Resend no es válido.", ok: false };
    }
  } else {
    if (!smtp.host) {
      return { error: "Debes indicar el host SMTP.", ok: false };
    }
    if (!smtp.user) {
      return { error: "Debes indicar el usuario SMTP.", ok: false };
    }
    if (smtp.defaultFrom && !EMAIL_REGEX.test(smtp.defaultFrom)) {
      return { error: "El email por defecto de SMTP no es válido.", ok: false };
    }
  }

  const presets = {} as Record<CorreoPurpose, CorreoPreset>;
  for (const p of CORREO_PURPOSES) {
    const fromEmail = String(formData.get(`preset_${p}_fromEmail`) ?? "").trim();
    const fromName = String(formData.get(`preset_${p}_fromName`) ?? "").trim();
    const notifyTo = String(formData.get(`preset_${p}_notifyTo`) ?? "").trim();

    if (fromEmail && !EMAIL_REGEX.test(fromEmail)) {
      return { error: `El "From" de "${p}" no es un email válido.`, ok: false };
    }
    // notifyTo puede ser varios separados por coma
    if (notifyTo) {
      const parts = notifyTo.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (!EMAIL_REGEX.test(part)) {
          return { error: `"Notificar a" de "${p}" tiene un email inválido: ${part}`, ok: false };
        }
      }
    }

    presets[p] = { fromEmail, fromName, notifyTo };
  }

  const value: CorreosConfig = { provider, resend, smtp, presets };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "correos",
      value,
      descripcion:
        "Gestor de correos: provider activo (Resend o SMTP), credenciales y presets de remitente/destinatario por propósito.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[correos] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admin/configuracion/correos");
  return { error: null, ok: true };
}
