import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { sendFormConfirmation } from "@/lib/email/sendFormConfirmation";
import { escapeHtml } from "@/lib/email/escapeHtml";

// nodemailer (SMTP) requiere Node runtime — explícito para evitar Edge.
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { representante, estudiante, correo, telefono, nivel, mensaje } = await req.json();

    if (!representante || !correo || !nivel) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    // Valores escapados para el HTML del correo interno.
    const s = {
      representante: escapeHtml(representante),
      estudiante: escapeHtml(estudiante || "—"),
      correo: escapeHtml(correo),
      telefono: escapeHtml(telefono || "—"),
      nivel: escapeHtml(nivel),
      mensaje: escapeHtml(mensaje),
    };

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1A2B4A;">
        <div style="background: #1A2B4A; padding: 32px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #9e1915; margin: 0; font-size: 20px;">Nueva solicitud de admisión</h2>
          <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 14px;">
            Recibida desde el formulario web — ${new Date().toLocaleDateString("es-EC", { dateStyle: "long" })}
          </p>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 180px;">Representante</td>
              <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #1A2B4A;">${s.representante}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Estudiante</td>
              <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: #1A2B4A;">${s.estudiante}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo</td>
              <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${s.correo}" style="color: #9e1915;">${s.correo}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">WhatsApp / Tel.</td>
              <td style="padding: 12px 0; font-size: 14px; color: #1A2B4A;">${s.telefono}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Nivel de interés</td>
              <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: #9e1915;">${s.nivel}</td>
            </tr>
            ${mensaje ? `
            <tr>
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Mensaje</td>
              <td style="padding: 12px 0; font-size: 14px; color: #1A2B4A; line-height: 1.6;">${s.mensaje}</td>
            </tr>
            ` : ""}
          </table>
        </div>
        <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 16px;">
          Formulario web — Unidad Educativa Atenas · atenas.edu.ec
        </p>
      </div>
    `;

    // Envío SECUENCIAL (ver nota en /api/contactos): notificación interna
    // al colegio + confirmación al usuario. Best-effort — el correo es un
    // side-effect, devolvemos 200 igual si algo falla.
    await sendEmail({
      purpose: "admisiones-confirmacion",
      // Destinatario interno: el preset.notifyTo, configurable desde
      // /admin/configuracion/correos → "Admisiones — solicitudes y consultas".
      subject: `Nueva solicitud de admisión — ${nivel}`,
      html,
      context: "POST /api/admisiones (interno)",
    }).catch(() => {});
    await sendFormConfirmation({
      tipo: "admisiones-consulta",
      to: String(correo),
      variables: {
        representante: String(representante),
        estudiante: String(estudiante || ""),
        nivel: String(nivel),
      },
      context: "POST /api/admisiones (confirmación)",
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando email de admisión:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
