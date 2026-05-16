/**
 * Tipos, constantes y helpers PUROS del gestor de correos.
 *
 * Vive aparte de `getConfiguracion.ts` porque ese archivo importa
 * `@/lib/supabase/server` (que a su vez importa `next/headers`), lo cual
 * rompe los client components que solo necesitan los types/constants.
 *
 * Sin side-effects, sin imports de servidor — puede importarse desde
 * client components, server components, route handlers y server actions.
 */

/**
 * Propósitos cerrados del sitio. Cada uno tiene un preset con emisor +
 * destinatario por defecto (este último solo se usa para correos
 * "internos" al admin, no para confirmaciones al usuario).
 */
export type CorreoPurpose =
  | "admisiones-pipeline"
  | "admisiones-confirmacion"
  | "quejas"
  | "contactos"
  | "trabaja";

export const CORREO_PURPOSES: CorreoPurpose[] = [
  "admisiones-pipeline",
  "admisiones-confirmacion",
  "quejas",
  "contactos",
  "trabaja",
];

export const CORREO_PURPOSE_LABELS: Record<CorreoPurpose, string> = {
  "admisiones-pipeline": "Admisiones — pipeline (cambios de estado)",
  "admisiones-confirmacion": "Admisiones — confirmación al postulante",
  quejas: "Quejas y sugerencias",
  contactos: "Formulario de contactos",
  trabaja: "Trabaja con nosotros",
};

export type CorreoPreset = {
  fromEmail: string;
  fromName: string;
  notifyTo: string;
};

export type ResendConfig = {
  apiKey: string;
  defaultFrom: string;
  defaultFromName: string;
};

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  defaultFrom: string;
  defaultFromName: string;
};

export type CorreosConfig = {
  provider: "resend" | "smtp";
  resend: ResendConfig;
  smtp: SmtpConfig;
  presets: Record<CorreoPurpose, CorreoPreset>;
};

export const CORREOS_DEFAULT: CorreosConfig = {
  provider: "resend",
  resend: {
    apiKey: "",
    defaultFrom: "noreply@atenas.edu.ec",
    defaultFromName: "Unidad Educativa Atenas",
  },
  smtp: {
    host: "",
    port: 587,
    secure: false,
    user: "",
    pass: "",
    defaultFrom: "noreply@atenas.edu.ec",
    defaultFromName: "Unidad Educativa Atenas",
  },
  presets: {
    "admisiones-pipeline": {
      fromEmail: "admisiones@atenas.edu.ec",
      fromName: "Admisiones Atenas",
      notifyTo: "",
    },
    "admisiones-confirmacion": {
      fromEmail: "admisiones@atenas.edu.ec",
      fromName: "Admisiones Atenas",
      notifyTo: "admisiones@atenas.edu.ec",
    },
    quejas: {
      fromEmail: "atenas@atenas.edu.ec",
      fromName: "Unidad Educativa Atenas",
      notifyTo: "secretaria@atenas.edu.ec",
    },
    contactos: {
      fromEmail: "atenas@atenas.edu.ec",
      fromName: "Unidad Educativa Atenas",
      notifyTo: "info@atenas.edu.ec",
    },
    trabaja: {
      fromEmail: "atenas@atenas.edu.ec",
      fromName: "Unidad Educativa Atenas",
      notifyTo: "rrhh@atenas.edu.ec",
    },
  },
};

export function mergeCorreos(input: Partial<CorreosConfig> | null): CorreosConfig {
  if (!input) return CORREOS_DEFAULT;
  const provider: CorreosConfig["provider"] =
    input.provider === "smtp" || input.provider === "resend"
      ? input.provider
      : CORREOS_DEFAULT.provider;

  const mergeResend = (r?: Partial<ResendConfig>): ResendConfig => ({
    apiKey: r?.apiKey?.trim() ?? CORREOS_DEFAULT.resend.apiKey,
    defaultFrom: r?.defaultFrom?.trim() || CORREOS_DEFAULT.resend.defaultFrom,
    defaultFromName:
      r?.defaultFromName?.trim() || CORREOS_DEFAULT.resend.defaultFromName,
  });

  const mergeSmtp = (s?: Partial<SmtpConfig>): SmtpConfig => ({
    host: s?.host?.trim() ?? CORREOS_DEFAULT.smtp.host,
    port: typeof s?.port === "number" ? s.port : CORREOS_DEFAULT.smtp.port,
    secure: typeof s?.secure === "boolean" ? s.secure : CORREOS_DEFAULT.smtp.secure,
    user: s?.user?.trim() ?? CORREOS_DEFAULT.smtp.user,
    pass: s?.pass ?? CORREOS_DEFAULT.smtp.pass,
    defaultFrom: s?.defaultFrom?.trim() || CORREOS_DEFAULT.smtp.defaultFrom,
    defaultFromName:
      s?.defaultFromName?.trim() || CORREOS_DEFAULT.smtp.defaultFromName,
  });

  const mergePreset = (
    p: Partial<CorreoPreset> | undefined,
    def: CorreoPreset
  ): CorreoPreset => ({
    fromEmail: p?.fromEmail?.trim() || def.fromEmail,
    fromName: p?.fromName?.trim() || def.fromName,
    notifyTo: p?.notifyTo?.trim() ?? def.notifyTo,
  });

  return {
    provider,
    resend: mergeResend(input.resend),
    smtp: mergeSmtp(input.smtp),
    presets: {
      "admisiones-pipeline": mergePreset(
        input.presets?.["admisiones-pipeline"],
        CORREOS_DEFAULT.presets["admisiones-pipeline"]
      ),
      "admisiones-confirmacion": mergePreset(
        input.presets?.["admisiones-confirmacion"],
        CORREOS_DEFAULT.presets["admisiones-confirmacion"]
      ),
      quejas: mergePreset(input.presets?.quejas, CORREOS_DEFAULT.presets.quejas),
      contactos: mergePreset(input.presets?.contactos, CORREOS_DEFAULT.presets.contactos),
      trabaja: mergePreset(input.presets?.trabaja, CORREOS_DEFAULT.presets.trabaja),
    },
  };
}
