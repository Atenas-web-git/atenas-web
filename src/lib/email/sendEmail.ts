/**
 * Capa unificada de envío de correos para Atenas Web.
 *
 * Centraliza TODOS los envíos del sitio (4 formularios + pipeline de
 * admisiones) detrás de una sola función. Lee la config de
 * `configuracion_global['correos']` y decide:
 *
 *   - Qué provider usar (Resend o SMTP — exclusivos)
 *   - Qué `fromEmail` / `fromName` usar según el `purpose`
 *   - El `to` puede venir del caller, o del preset si es undefined
 *
 * Importante: se ejecuta SOLO en Node runtime (no Edge), porque
 * nodemailer requiere Node APIs. Los API routes que envían correo
 * deben declarar `export const runtime = "nodejs"`.
 */

import { Resend } from "resend";
import nodemailer from "nodemailer";
import { getConfiguracion } from "@/lib/cms/getConfiguracion";
import {
  mergeCorreos,
  type CorreosConfig,
  type CorreoPurpose,
  type CorreoPreset,
} from "@/lib/cms/correos";

export type SendEmailAttachment = {
  filename: string;
  content: Buffer | string;
  contentType?: string;
};

export type SendEmailInput = {
  /** Propósito del correo. Determina el preset (from/notifyTo). */
  purpose: CorreoPurpose;
  /**
   * Destinatario(s). Si se omite, se usa `preset.notifyTo` (útil para
   * correos "internos" al admin del colegio). Si tampoco hay preset
   * con `notifyTo`, lanza error.
   */
  to?: string | string[];
  subject: string;
  html: string;
  /** Override del FROM. Si se omite, se usa `preset.fromEmail` / `fromName`. */
  fromOverride?: { email: string; name?: string };
  attachments?: SendEmailAttachment[];
  /** Para logs / debug. */
  context?: string;
};

export type SendEmailResult = {
  ok: boolean;
  /** ID del envío (Resend) o response (SMTP). Solo si ok=true. */
  id?: string;
  /** Mensaje de error si ok=false. */
  error?: string;
  /** Provider usado en este envío. */
  provider?: "resend" | "smtp";
  /** True si el correo se omitió por configuración (no es error). Ej. provider sin credenciales. */
  skipped?: boolean;
};

function normalizeTo(to: string | string[] | undefined): string[] {
  if (!to) return [];
  if (Array.isArray(to)) return to.filter((s) => s && s.trim());
  return to
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildFromHeader(email: string, name?: string): string {
  return name ? `${name} <${email}>` : email;
}

/**
 * Versión en texto plano del HTML del correo. Adjuntar una parte `text`
 * además del `html` mejora la entregabilidad: los correos solo-HTML
 * puntúan más alto en los filtros de spam (Gmail, Yahoo, Outlook).
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<(br|\/p|\/div|\/tr|\/h[1-6]|\/li)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function resolveFromPreset(
  config: CorreosConfig,
  purpose: CorreoPurpose,
  override?: { email: string; name?: string }
): { email: string; name: string } {
  if (override?.email) {
    return { email: override.email, name: override.name ?? "" };
  }
  const preset: CorreoPreset = config.presets[purpose];
  const providerDefaults =
    config.provider === "smtp" ? config.smtp : config.resend;
  return {
    email: preset.fromEmail || providerDefaults.defaultFrom,
    name: preset.fromName || providerDefaults.defaultFromName,
  };
}

/**
 * Función principal. Lee config de BD, decide provider, envía.
 *
 * NUNCA lanza — siempre devuelve `SendEmailResult`. Los callers deben
 * decidir qué hacer si `ok === false` (típicamente: loggear y seguir
 * — no rompemos UX porque un correo falle).
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  // 1. Resolver config
  const raw = await getConfiguracion<Partial<CorreosConfig>>("correos");
  const config = mergeCorreos(raw);
  const provider = config.provider;

  // 2. Resolver from + to
  const from = resolveFromPreset(config, input.purpose, input.fromOverride);
  const preset = config.presets[input.purpose];
  let toList = normalizeTo(input.to);
  if (toList.length === 0 && preset.notifyTo) {
    toList = normalizeTo(preset.notifyTo);
  }
  if (toList.length === 0) {
    return {
      ok: false,
      error: `No se especificó destinatario para "${input.purpose}" y el preset no tiene notifyTo configurado.`,
      provider,
    };
  }

  const fromHeader = buildFromHeader(from.email, from.name);

  // 3. Despachar al provider
  if (provider === "resend") {
    return sendViaResend({
      apiKey: config.resend.apiKey || process.env.RESEND_API_KEY || "",
      from: fromHeader,
      to: toList,
      subject: input.subject,
      html: input.html,
      attachments: input.attachments,
      context: input.context,
    });
  }

  return sendViaSmtp({
    smtp: config.smtp,
    from: fromHeader,
    to: toList,
    subject: input.subject,
    html: input.html,
    attachments: input.attachments,
    context: input.context,
  });
}

// ─── Resend ────────────────────────────────────────────────────

async function sendViaResend(args: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments?: SendEmailAttachment[];
  context?: string;
}): Promise<SendEmailResult> {
  if (!args.apiKey) {
    return {
      ok: false,
      skipped: true,
      provider: "resend",
      error:
        "Resend no tiene API key configurada. Configúrala en /admin/configuracion/correos o en la env var RESEND_API_KEY.",
    };
  }
  try {
    const resend = new Resend(args.apiKey);
    const res = await resend.emails.send({
      from: args.from,
      to: args.to,
      subject: args.subject,
      html: args.html,
      text: htmlToPlainText(args.html),
      attachments:
        args.attachments && args.attachments.length > 0
          ? args.attachments.map((a) => ({
              filename: a.filename,
              content: a.content,
            }))
          : undefined,
    });
    if (res.error) {
      return { ok: false, error: res.error.message ?? "Error desconocido (Resend)", provider: "resend" };
    }
    return { ok: true, id: res.data?.id, provider: "resend" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sendEmail/resend] ${args.context ?? ""}`, message);
    return { ok: false, error: message, provider: "resend" };
  }
}

// ─── SMTP (nodemailer) ─────────────────────────────────────────

async function sendViaSmtp(args: {
  smtp: CorreosConfig["smtp"];
  from: string;
  to: string[];
  subject: string;
  html: string;
  attachments?: SendEmailAttachment[];
  context?: string;
}): Promise<SendEmailResult> {
  const { smtp } = args;
  if (!smtp.host || !smtp.user || !smtp.pass) {
    return {
      ok: false,
      skipped: true,
      provider: "smtp",
      error:
        "SMTP no está configurado (faltan host, usuario o contraseña). Configúralo en /admin/configuracion/correos.",
    };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });
    const info = await transporter.sendMail({
      from: args.from,
      to: args.to.join(", "),
      subject: args.subject,
      html: args.html,
      text: htmlToPlainText(args.html),
      attachments: args.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });
    return { ok: true, id: info.messageId, provider: "smtp" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[sendEmail/smtp] ${args.context ?? ""}`, message);
    return { ok: false, error: message, provider: "smtp" };
  }
}

// ─── Helpers de conveniencia ───────────────────────────────────

/**
 * Devuelve el preset configurado para un propósito. Útil cuando un
 * caller necesita saber el FROM/notifyTo antes de llamar sendEmail
 * (ej. para mostrarlo en logs o en UI).
 */
export async function getCorreoPreset(
  purpose: CorreoPurpose
): Promise<CorreoPreset> {
  const raw = await getConfiguracion<Partial<CorreosConfig>>("correos");
  const config = mergeCorreos(raw);
  return config.presets[purpose];
}
