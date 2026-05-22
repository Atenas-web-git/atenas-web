"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  CORREO_PURPOSES,
  mergeCorreos,
  type CorreosConfig,
  type CorreoPreset,
  type CorreoPurpose,
} from "@/lib/cms/correos";
import { getConfiguracion } from "@/lib/cms/getConfiguracion";
import { sendEmail } from "@/lib/email/sendEmail";

export type CorreosActionState = { error: string | null; ok: boolean };

/** Resultado de la prueba de envío manual. */
export type TestEmailResult = {
  ok: boolean;
  /** Provider usado (resend / smtp). */
  provider: string;
  /** Remitente (From) que se intentó usar. */
  fromUsed: string;
  /** Destinatario de la prueba. */
  toUsed: string;
  /** ID del envío si fue exitoso. */
  messageId?: string;
  /** Mensaje de error textual del proveedor si falló. */
  error?: string;
  /** Pista de diagnóstico interpretada a partir del error. */
  hint?: string;
};

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
  const smtpPort = Number.isFinite(portRaw) && portRaw > 0 ? portRaw : 587;
  const smtp: CorreosConfig["smtp"] = {
    host: String(formData.get("smtp_host") ?? "").trim(),
    port: smtpPort,
    // El modo seguro se deriva del puerto (465 = TLS implícito).
    secure: smtpPort === 465,
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

/**
 * Envía un correo de prueba real usando la configuración GUARDADA
 * (provider + credenciales + preset de "Formulario de contactos").
 *
 * Sirve para diagnosticar por qué no llegan los correos: replica
 * exactamente el camino del formulario de contactos y devuelve el
 * resultado crudo del proveedor (éxito con messageId o el error textual
 * de SMTP/Resend), que normalmente queda oculto en los logs del servidor.
 */
export async function probarEnvioCorreoAction(
  destinatario: string
): Promise<TestEmailResult> {
  await assertSuperadmin();

  // Leemos la config guardada (la misma que usa el formulario real).
  const raw = await getConfiguracion<Partial<CorreosConfig>>("correos");
  const config = mergeCorreos(raw);
  const preset = config.presets.contactos;
  const providerDefaults =
    config.provider === "smtp" ? config.smtp : config.resend;
  const fromUsed =
    preset.fromEmail || providerDefaults.defaultFrom || "(sin remitente)";

  const to = (destinatario ?? "").trim();
  if (!EMAIL_REGEX.test(to)) {
    return {
      ok: false,
      provider: config.provider,
      fromUsed,
      toUsed: to,
      error: "El correo de destino para la prueba no es válido.",
    };
  }

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A2B4A;">
      <div style="background:#1A2B4A;padding:28px;border-radius:8px 8px 0 0;">
        <h2 style="color:#C9A84C;margin:0;font-size:18px;">Correo de prueba</h2>
      </div>
      <div style="background:#fff;padding:28px;border:1px solid #e8e4df;border-top:none;border-radius:0 0 8px 8px;">
        <p style="font-size:14px;line-height:1.7;margin:0;">
          Si estás leyendo esto, el envío de correos del sitio
          <strong>funciona correctamente</strong>. Esta es una prueba enviada
          desde la configuración de correos del backoffice de Atenas Web.
        </p>
        <p style="font-size:12px;color:#888;margin:18px 0 0;">
          Fecha: ${new Date().toLocaleString("es-EC")}
        </p>
      </div>
    </div>`;

  const result = await sendEmail({
    purpose: "contactos",
    to,
    subject: "Prueba de envío — Atenas Web",
    html,
    context: "test-send (configuracion/correos)",
  });

  // Interpretamos el error para dar una pista accionable.
  let hint: string | undefined;
  if (!result.ok && result.error) {
    const e = result.error.toLowerCase();
    if (
      e.includes("wrong version number") ||
      e.includes("ssl routines") ||
      e.includes("tls_validate") ||
      e.includes("packet length too long")
    ) {
      hint =
        "El puerto y el tipo de conexión no coinciden. Usa el puerto 465 o " +
        "el 587 — el sistema ajusta solo el modo de seguridad según el " +
        "puerto. Si el error persiste con uno, guarda con el otro y reintenta.";
    } else if (
      e.includes("sender") ||
      e.includes("not owned") ||
      e.includes("not allowed") ||
      e.includes("relay") ||
      e.includes("does not match") ||
      e.includes("553") ||
      e.includes("550")
    ) {
      hint =
        `El servidor rechazó el remitente. Con SMTP, el "From" debe ser una ` +
        `dirección que la cuenta autenticada (${config.smtp.user || "—"}) tenga ` +
        `permiso de usar. Pon ese mismo correo como "From" del preset de ` +
        `contactos —y como From por defecto—, o crea la dirección como alias ` +
        `en tu proveedor de correo.`;
    } else if (
      e.includes("invalid login") ||
      e.includes("535") ||
      e.includes("authentication") ||
      e.includes("auth") ||
      e.includes("credentials") ||
      e.includes("password")
    ) {
      hint =
        "El servidor rechazó el usuario o la contraseña SMTP. Verifícalos; " +
        "algunos proveedores exigen una 'contraseña de aplicación' en vez de " +
        "la contraseña normal de la cuenta.";
    } else if (
      e.includes("timeout") ||
      e.includes("econn") ||
      e.includes("connect") ||
      e.includes("getaddrinfo") ||
      e.includes("enotfound")
    ) {
      hint =
        "No se pudo conectar al servidor SMTP. Revisa que el host y el " +
        "puerto sean correctos.";
    }
  }

  return {
    ok: result.ok,
    provider: result.provider ?? config.provider,
    fromUsed,
    toUsed: to,
    messageId: result.id,
    error: result.error,
    hint,
  };
}
