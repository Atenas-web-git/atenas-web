/**
 * Envía el correo de CONFIRMACIÓN al usuario que llenó un formulario público.
 *
 * Carga la plantilla editable de `plantillas_correo_formularios`, sustituye
 * las variables (`{{nombre}}`, etc.) con los valores reales, envuelve en el
 * wrapper navy de marca y despacha por `sendEmail()`.
 *
 * Es best-effort: si la plantilla está inactiva, falta, o el envío falla,
 * no rompe la UX — solo se loguea. El correo interno al admin (que sí es
 * crítico) se envía por separado en cada endpoint.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import {
  buildPremiumEmail,
  type AcentoCorreo,
  type DataBlockItem,
} from "@/lib/email/buildPremiumEmail";
import type { CorreoPurpose } from "@/lib/cms/correos";

export type TipoPlantillaFormulario =
  | "contactos"
  | "quejas"
  | "trabaja"
  | "admisiones-confirmacion";

function fillTemplate(text: string, vars: Record<string, string>): string {
  let out = text;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{{${k}}}`, v);
  }
  return out;
}

/** Mapea cada tipo de plantilla al CorreoPurpose que define from/preset. */
const PURPOSE_BY_TIPO: Record<TipoPlantillaFormulario, CorreoPurpose> = {
  contactos: "contactos",
  quejas: "quejas",
  trabaja: "trabaja",
  "admisiones-confirmacion": "admisiones-confirmacion",
};

export async function sendFormConfirmation(args: {
  tipo: TipoPlantillaFormulario;
  to: string;
  variables: Record<string, string>;
  context?: string;
}): Promise<void> {
  const { tipo, to, variables, context } = args;
  if (!to || !to.trim()) return;

  const supabase = createAdminClient();
  const { data: plantilla } = await supabase
    .from("plantillas_correo_formularios")
    .select(
      "titulo, asunto, cuerpo_html, activo, acento, eyebrow, hero_image_url, cta_label, cta_url, helper_text"
    )
    .eq("tipo", tipo)
    .maybeSingle();

  if (!plantilla || !plantilla.activo) return;

  const titulo = fillTemplate(plantilla.titulo ?? "", variables);
  const asunto = fillTemplate(plantilla.asunto ?? "", variables);
  const cuerpo = fillTemplate(plantilla.cuerpo_html ?? "", variables);
  const eyebrow = fillTemplate(plantilla.eyebrow ?? "", variables);
  const ctaLabel = fillTemplate(plantilla.cta_label ?? "", variables);
  const ctaUrl = fillTemplate(plantilla.cta_url ?? "", variables);
  const helperText = fillTemplate(plantilla.helper_text ?? "", variables);

  const acento: AcentoCorreo =
    plantilla.acento === "red" || plantilla.acento === "gold"
      ? plantilla.acento
      : "navy";

  // Si es confirmación de admisiones, agregamos el N° de seguimiento al data block
  let dataBlock: DataBlockItem[] | undefined;
  if (tipo === "admisiones-confirmacion" && variables.numero) {
    dataBlock = [{ label: "N° SEGUIMIENTO", value: variables.numero }];
  }

  // Si es admisiones-confirmacion y el editor no definió CTA propio, usamos
  // como fallback "Ver estado de mi solicitud →" apuntando a la URL pública.
  const isAdmConfirm = tipo === "admisiones-confirmacion";
  const finalCtaLabel =
    ctaLabel || (isAdmConfirm && variables.url_seguimiento ? "Ver estado de mi solicitud →" : "");
  const finalCtaUrl =
    ctaUrl || (isAdmConfirm && variables.url_seguimiento ? variables.url_seguimiento : "");

  const html = await buildPremiumEmail({
    acento,
    eyebrow,
    titulo,
    cuerpoHtml: cuerpo,
    heroImageUrl: plantilla.hero_image_url || undefined,
    dataBlock,
    ctaLabel: finalCtaLabel,
    ctaUrl: finalCtaUrl,
    helperText,
  });

  const res = await sendEmail({
    purpose: PURPOSE_BY_TIPO[tipo],
    to,
    subject: asunto,
    html,
    context: context ?? `sendFormConfirmation tipo=${tipo}`,
  });

  if (!res.ok && !res.skipped) {
    console.error(`[sendFormConfirmation tipo=${tipo}]`, res.error);
  }
}
