import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

type FormularioCMS = {
  destinatarioEmail?: string;
  asuntoEmail?: string;
};

const FALLBACK_DESTINATARIO = "secretaria@atenas.edu.ec";
const FALLBACK_ASUNTO = "Nueva {tipo} — {nombre}";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lee la configuración del formulario desde el CMS por seguridad —
 * el cliente NO puede pasar el destinatarioEmail directamente.
 */
async function loadFormularioConfig(
  servicioSlug: string
): Promise<FormularioCMS | null> {
  if (!servicioSlug) return null;
  // Anti-injection: solo aceptamos slugs simples de la forma "<slug>".
  const safeSlug = `servicios/${servicioSlug.replace(/[^a-z0-9-]/g, "")}`;
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("paginas")
      .select("contenido")
      .eq("slug", safeSlug)
      .eq("publicada", true)
      .maybeSingle();
    if (!data) return null;
    const contenido = data.contenido as { formulario?: FormularioCMS } | null;
    return contenido?.formulario ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await req.json();
    const { nombre, correo, tipo, descripcion, servicioSlug } = body ?? {};

    if (!nombre || !correo || !tipo || !descripcion) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Resolución segura del destinatario y del asunto desde el CMS.
    const cmsConfig = await loadFormularioConfig(
      typeof servicioSlug === "string" ? servicioSlug : "quejas-sugerencias"
    );
    const destinatarioRaw =
      cmsConfig?.destinatarioEmail?.trim() || FALLBACK_DESTINATARIO;
    const destinatario = EMAIL_REGEX.test(destinatarioRaw)
      ? destinatarioRaw
      : FALLBACK_DESTINATARIO;
    const asuntoTpl = cmsConfig?.asuntoEmail?.trim() || FALLBACK_ASUNTO;
    const subject = asuntoTpl
      .replace(/\{nombre\}/g, String(nombre))
      .replace(/\{tipo\}/g, String(tipo));

    await resend.emails.send({
      from: "Formulario Web <noreply@atenas.edu.ec>",
      to: [destinatario],
      replyTo: correo,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A2B4A;">
          <div style="background: #1A2B4A; padding: 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #C9A84C; margin: 0; font-size: 20px;">Nueva comunicación institucional</h2>
            <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 14px;">
              Recibida desde el formulario web — ${new Date().toLocaleDateString("es-EC", { dateStyle: "long" })}
            </p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 160px;">Nombre</td>
                <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #1A2B4A;">${nombre}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo</td>
                <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${correo}" style="color: #C9A84C;">${correo}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Tipo</td>
                <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: #9e1915;">${tipo}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Descripción</td>
                <td style="padding: 12px 0; font-size: 14px; color: #1A2B4A; line-height: 1.6;">${descripcion}</td>
              </tr>
            </table>
          </div>
          <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 16px;">
            Formulario web — Unidad Educativa Atenas · atenas.edu.ec
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando comunicación:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
