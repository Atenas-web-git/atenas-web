import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EstadoAdmision } from "./constants";
import { buildWrappedEmail, debeOcultarCta } from "./email_wrapper";

type SolicitudInfo = {
  id?: string;
  numero: string;
  rep_correo: string;
  rep_nombres: string;
  est_nombres: string;
  est_apellidos?: string;
  est_nivel: string;
};

function fillTemplate(template: string, solicitud: SolicitudInfo): string {
  const trackingUrl = `https://atenas.edu.ec/admisiones/seguimiento?numero=${encodeURIComponent(solicitud.numero)}`;
  return template
    .replaceAll("{{numero}}", solicitud.numero)
    .replaceAll("{{est_nombres}}", solicitud.est_nombres)
    .replaceAll("{{est_apellidos}}", solicitud.est_apellidos ?? "")
    .replaceAll("{{est_nivel}}", solicitud.est_nivel)
    .replaceAll("{{rep_nombres}}", solicitud.rep_nombres)
    .replaceAll("{{url_seguimiento}}", trackingUrl);
}

async function loadAdjuntos(solicitudId: string | undefined) {
  if (!solicitudId) return [];

  const supabase = createAdminClient();
  const { data: adjuntos } = await supabase
    .from("solicitud_adjuntos")
    .select("filename, storage_path")
    .eq("solicitud_id", solicitudId);

  if (!adjuntos || adjuntos.length === 0) return [];

  const downloads = await Promise.all(
    adjuntos.map(async (a) => {
      const { data } = await supabase.storage.from("admisiones-adjuntos").download(a.storage_path);
      if (!data) return null;
      const buffer = Buffer.from(await data.arrayBuffer());
      return { filename: a.filename, content: buffer };
    })
  );

  return downloads.filter((x) => x !== null) as Array<{ filename: string; content: Buffer }>;
}

export async function notifyEstadoChange(
  solicitud: SolicitudInfo,
  nuevoEstado: EstadoAdmision
): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  const supabase = createAdminClient();
  const { data: plantilla } = await supabase
    .from("plantillas_correo_admision")
    .select("titulo, asunto, cuerpo_html, activo")
    .eq("estado", nuevoEstado)
    .maybeSingle();

  if (!plantilla || !plantilla.activo) return;

  const trackingUrl = `https://atenas.edu.ec/admisiones/seguimiento?numero=${encodeURIComponent(solicitud.numero)}`;
  const subject = fillTemplate(plantilla.asunto ?? "", solicitud);
  const titulo = fillTemplate(plantilla.titulo ?? "", solicitud);
  const contenido = fillTemplate(plantilla.cuerpo_html ?? "", solicitud);

  const html = buildWrappedEmail({
    titulo,
    contenido,
    numero: solicitud.numero,
    url_seguimiento: trackingUrl,
    mostrar_cta: !debeOcultarCta(nuevoEstado),
  });

  const adjuntos = await loadAdjuntos(solicitud.id);

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Admisiones Atenas <noreply@atenas.edu.ec>",
      to: [solicitud.rep_correo],
      subject,
      html,
      attachments: adjuntos.length > 0
        ? adjuntos.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    });
  } catch (err) {
    console.error("[notifyEstadoChange]", err);
  }
}
