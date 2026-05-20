import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/sendEmail";
import type { EstadoAdmision } from "./constants";
import {
  buildPremiumEmail,
  type AcentoCorreo,
} from "@/lib/email/buildPremiumEmail";

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

/**
 * Carga TODOS los adjuntos que deben anexarse al correo de una solicitud
 * cuando esta cambia a un determinado estado. Combina 3 fuentes:
 *
 *   1. `solicitud_adjuntos`        — archivos subidos manualmente para esta solicitud
 *   2. `plantillas_correo_archivos` — archivos del banco vinculados a la plantilla
 *                                     del estado (se adjuntan AUTOMÁTICAMENTE cada
 *                                     vez que esa plantilla se envíe)
 *   3. `solicitud_archivos_banco`  — archivos del banco vinculados a ESTA solicitud
 *                                     (caso de un documento personalizado)
 *
 * Las fuentes 2 y 3 son nuevas desde la migración 039 (sprint mediano).
 * Deduplica por `storage_path` para evitar enviar dos veces el mismo archivo.
 */
async function loadAdjuntos(
  solicitudId: string | undefined,
  estado: string | undefined
) {
  if (!solicitudId) return [];

  const supabase = createAdminClient();

  type BancoRel =
    | { nombre: string | null; storage_path: string | null }
    | { nombre: string | null; storage_path: string | null }[]
    | null;

  const [
    { data: manuales },
    plantillaRes,
    { data: vinculadosSolicitud },
  ] = await Promise.all([
    supabase
      .from("solicitud_adjuntos")
      .select("filename, storage_path")
      .eq("solicitud_id", solicitudId),
    estado
      ? supabase
          .from("plantillas_correo_archivos")
          .select("admisiones_archivos_banco(nombre, storage_path)")
          .eq("estado", estado)
      : Promise.resolve({ data: [] as Array<{ admisiones_archivos_banco: BancoRel }> }),
    supabase
      .from("solicitud_archivos_banco")
      .select("admisiones_archivos_banco(nombre, storage_path)")
      .eq("solicitud_id", solicitudId),
  ]);

  const vinculadosPlantilla = (plantillaRes.data ?? []) as Array<{
    admisiones_archivos_banco: BancoRel;
  }>;

  // Lista unificada deduplicada por storage_path
  const archivos: Array<{ filename: string; storage_path: string }> = [];
  const seenPaths = new Set<string>();

  const addArchivo = (filename: string | null, path: string | null) => {
    if (!filename || !path || seenPaths.has(path)) return;
    seenPaths.add(path);
    archivos.push({ filename, storage_path: path });
  };

  for (const m of manuales ?? []) {
    addArchivo(m.filename, m.storage_path);
  }
  const flattenBanco = (row: { admisiones_archivos_banco: BancoRel }) => {
    const b = row.admisiones_archivos_banco;
    return Array.isArray(b) ? b[0] : b;
  };
  for (const row of vinculadosPlantilla) {
    const banco = flattenBanco(row);
    if (banco) addArchivo(banco.nombre, banco.storage_path);
  }
  for (const row of (vinculadosSolicitud ?? []) as Array<{
    admisiones_archivos_banco: BancoRel;
  }>) {
    const banco = flattenBanco(row);
    if (banco) addArchivo(banco.nombre, banco.storage_path);
  }

  if (archivos.length === 0) return [];

  const downloads = await Promise.all(
    archivos.map(async (a) => {
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
  const supabase = createAdminClient();
  const { data: plantilla } = await supabase
    .from("plantillas_correo_admision")
    .select(
      "titulo, asunto, cuerpo_html, activo, acento, eyebrow, hero_image_url, cta_label, cta_url, helper_text"
    )
    .eq("estado", nuevoEstado)
    .maybeSingle();

  if (!plantilla || !plantilla.activo) return;

  const subject = fillTemplate(plantilla.asunto ?? "", solicitud);
  const titulo = fillTemplate(plantilla.titulo ?? "", solicitud);
  const contenido = fillTemplate(plantilla.cuerpo_html ?? "", solicitud);
  const eyebrow = fillTemplate(plantilla.eyebrow ?? "", solicitud);
  const ctaLabel = fillTemplate(plantilla.cta_label ?? "", solicitud);
  const ctaUrl = fillTemplate(plantilla.cta_url ?? "", solicitud);
  const helperText = fillTemplate(plantilla.helper_text ?? "", solicitud);

  const acento: AcentoCorreo =
    plantilla.acento === "red" || plantilla.acento === "gold"
      ? plantilla.acento
      : "navy";

  const html = await buildPremiumEmail({
    acento,
    eyebrow,
    titulo,
    cuerpoHtml: contenido,
    heroImageUrl: plantilla.hero_image_url || undefined,
    dataBlock: [
      { label: "N° SEGUIMIENTO", value: solicitud.numero },
      { label: "POSTULANTE", value: `${solicitud.est_nombres} ${solicitud.est_apellidos ?? ""}`.trim() },
      { label: "NIVEL", value: solicitud.est_nivel },
    ],
    ctaLabel,
    ctaUrl,
    helperText,
  });

  const adjuntos = await loadAdjuntos(solicitud.id, nuevoEstado);

  const result = await sendEmail({
    purpose: "admisiones-pipeline",
    to: solicitud.rep_correo,
    subject,
    html,
    attachments:
      adjuntos.length > 0
        ? adjuntos.map((a) => ({ filename: a.filename, content: a.content }))
        : undefined,
    context: `notifyEstadoChange estado=${nuevoEstado} numero=${solicitud.numero}`,
  });

  if (!result.ok && !result.skipped) {
    console.error("[notifyEstadoChange]", result.error);
  }
}
