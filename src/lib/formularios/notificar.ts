/**
 * Correos del motor de formularios.
 *
 * Dos envíos por respuesta:
 *   1. El aviso interno al colegio, con todas las respuestas.
 *   2. La confirmación a quien rellenó el formulario, si está activada.
 *
 * Se apoya en `buildPremiumEmail`, el mismo render de marca que usan los
 * correos de admisiones. Los cinco formularios escritos a mano arman su HTML
 * con literales incrustados, y por eso cada uno se ve distinto y ninguno
 * cambió cuando se retiró el dorado.
 *
 * SECUENCIAL, nunca en paralelo: con SMTP dos envíos a la vez abren dos
 * conexiones y el servidor del colegio corta la segunda.
 */

import { sendEmail } from "@/lib/email/sendEmail";
import { buildPremiumEmail, type DataBlockItem } from "@/lib/email/buildPremiumEmail";
import { escapeHtml } from "@/lib/email/escapeHtml";
import { CORREO_PURPOSES, type CorreoPurpose } from "@/lib/cms/correos";
import { esCorreoUnico, valorLegible } from "./validar";
import type { ArchivoRespuesta, DatosRespuesta, Formulario } from "./tipos";

/**
 * Dirección del sitio para los enlaces de los correos.
 *
 * NUNCA se deriva de la petición. `req.nextUrl.origin` se construye con la
 * cabecera Host, que la elige quien envía el formulario: bastaría con mandar
 * un Host falso para que el botón «Ver en el panel» del correo que recibe el
 * colegio apuntara a una copia de la pantalla de acceso. Alguien de secretaría
 * haría clic desde un correo legítimo y escribiría ahí su contraseña.
 */
export const URL_SITIO = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://atenas-web-eosin.vercel.app"
).replace(/\/+$/, "");

/**
 * Sustituye {campo} por el valor de la respuesta. Se usa en los asuntos, para
 * que el colegio pueda escribir «Nueva postulación — {nombres}» desde el panel.
 */
export function rellenarTokens(
  plantilla: string,
  datos: DatosRespuesta,
  extra: Record<string, string> = {}
): string {
  return plantilla.replace(/\{([a-z0-9_]+)\}/gi, (coincidencia, clave: string) => {
    if (clave in extra) return extra[clave];
    if (clave in datos) return valorLegible(datos[clave]);
    return coincidencia;
  });
}

/** El preset guardado puede ser inválido si alguien lo editó a mano en base. */
function presetSeguro(valor: string): CorreoPurpose {
  return CORREO_PURPOSES.includes(valor as CorreoPurpose)
    ? (valor as CorreoPurpose)
    : "contactos";
}

function tamanoLegible(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Aviso interno. Devuelve si el correo salió, para poder marcarlo en la
 * bandeja: hoy un fallo de envío es completamente invisible.
 */
export async function notificarInterno(args: {
  formulario: Formulario;
  datos: DatosRespuesta;
  archivos: ArchivoRespuesta[];
  numero: number;
  urlPanel: string;
}): Promise<boolean> {
  const { formulario, datos, archivos, numero, urlPanel } = args;

  const destinatarios = formulario.notificar_a.filter((c) => c.trim());
  if (destinatarios.length === 0) {
    console.error(
      `[formularios] "${formulario.slug}" no tiene destinatarios: la respuesta ` +
        `#${numero} quedó guardada pero nadie recibió aviso.`
    );
    return false;
  }

  const dataBlock: DataBlockItem[] = formulario.campos
    .filter((campo) => campo.tipo !== "archivo")
    .map((campo) => ({
      label: campo.etiqueta,
      value: valorLegible(datos[campo.key] ?? null) || "—",
    }));

  for (const archivo of archivos) {
    const campo = formulario.campos.find((c) => c.key === archivo.key);
    dataBlock.push({
      label: campo?.etiqueta ?? "Archivo adjunto",
      value: `${archivo.filename} (${tamanoLegible(archivo.size_bytes)})`,
    });
  }

  const cuerpoHtml = `
    <p>Se recibió una respuesta nueva del formulario
    <strong>${escapeHtml(formulario.nombre)}</strong>.</p>
    ${
      archivos.length > 0
        ? `<p>Incluye ${archivos.length} archivo${archivos.length === 1 ? "" : "s"} adjunto${
            archivos.length === 1 ? "" : "s"
          }. Por privacidad no se envían por correo: se descargan desde el panel.</p>`
        : ""
    }
  `;

  const html = await buildPremiumEmail({
    acento: "navy",
    eyebrow: `Respuesta #${numero}`,
    titulo: formulario.titulo || formulario.nombre,
    cuerpoHtml,
    dataBlock,
    ctaLabel: "Ver en el panel",
    ctaUrl: urlPanel,
    helperText: "Este aviso se generó automáticamente desde el sitio web.",
  });

  const asunto = formulario.asunto?.trim()
    ? rellenarTokens(formulario.asunto, datos, { numero: String(numero) })
    : `Nueva respuesta — ${formulario.nombre} #${numero}`;

  const resultado = await sendEmail({
    purpose: presetSeguro(formulario.preset_correo),
    to: destinatarios,
    subject: asunto,
    html,
    context: `formularios/${formulario.slug} (interno)`,
  }).catch((e) => {
    console.error(`[formularios] fallo enviando el aviso interno:`, e);
    return { ok: false } as { ok: boolean };
  });

  if (!resultado.ok) {
    console.error(
      `[formularios] el aviso interno de "${formulario.slug}" #${numero} NO salió.`
    );
  }

  return resultado.ok === true;
}

/**
 * Confirmación a quien envió el formulario. Best-effort de verdad: si falla,
 * la respuesta ya está guardada y el colegio ya tiene su aviso.
 */
export async function confirmarAlRemitente(args: {
  formulario: Formulario;
  datos: DatosRespuesta;
  numero: number;
}): Promise<void> {
  const { formulario, datos, numero } = args;

  if (!formulario.confirmacion_activa) return;
  if (!formulario.campo_correo) return;

  const destino = valorLegible(datos[formulario.campo_correo] ?? null).trim();

  // Se valida que sea UNA dirección, no que «tenga una arroba». `sendEmail`
  // parte el destinatario por comas y puntos y coma: con solo comprobar la
  // arroba, quien rellena el formulario podría escribir
  // «yo@x.com,victima@y.com,…» y hacer que el servidor de correo del colegio
  // mandara ese mensaje a una lista elegida por él, con el asunto también
  // controlado por él a través de los tokens {campo}.
  if (!esCorreoUnico(destino)) {
    if (destino) {
      console.error(
        `[formularios] "${formulario.slug}": no se envió confirmación, la ` +
          `dirección recibida no es una dirección única válida.`
      );
    }
    return;
  }

  const cuerpo =
    formulario.confirmacion_cuerpo?.trim() ||
    "Hemos recibido tu información. Nuestro equipo la revisará y te contactará si tu perfil avanza en el proceso.";

  const html = await buildPremiumEmail({
    acento: "navy",
    eyebrow: "Confirmación",
    titulo: formulario.confirmacion_asunto?.trim() || "Recibimos tu información",
    // El cuerpo lo escribe el colegio desde el panel en texto plano, así que
    // se escapa y se convierte a párrafos. No se admite HTML del editor aquí:
    // este correo sale hacia fuera y el CMS todavía no sanea lo que publica.
    cuerpoHtml: cuerpo
      .split(/\n{2,}/)
      .map((parrafo) => `<p>${escapeHtml(parrafo.trim()).replace(/\n/g, "<br />")}</p>`)
      .join(""),
    helperText: "Este mensaje es automático, no hace falta responderlo.",
  });

  const asunto = formulario.confirmacion_asunto?.trim()
    ? rellenarTokens(formulario.confirmacion_asunto, datos, { numero: String(numero) })
    : `Recibimos tu información — ${formulario.nombre}`;

  await sendEmail({
    purpose: presetSeguro(formulario.preset_correo),
    to: destino,
    subject: asunto,
    html,
    context: `formularios/${formulario.slug} (confirmación)`,
  }).catch((e) => {
    console.error("[formularios] fallo enviando la confirmación:", e);
  });
}
