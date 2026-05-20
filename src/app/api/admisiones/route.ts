import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
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
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: var(--color-navy);">
        <div style="background: var(--color-navy); padding: 32px; border-radius: 8px 8px 0 0;">
          <h2 style="color: var(--color-gold); margin: 0; font-size: 20px;">Nueva solicitud de admisión</h2>
          <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 14px;">
            Recibida desde el formulario web — ${new Date().toLocaleDateString("es-EC", { dateStyle: "long" })}
          </p>
        </div>
        <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 180px;">Representante</td>
              <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: var(--color-navy);">${s.representante}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Estudiante</td>
              <td style="padding: 12px 0; font-size: 14px; font-weight: 600; color: var(--color-navy);">${s.estudiante}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo</td>
              <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${s.correo}" style="color: var(--color-gold);">${s.correo}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">WhatsApp / Tel.</td>
              <td style="padding: 12px 0; font-size: 14px; color: var(--color-navy);">${s.telefono}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0ece7;">
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Nivel de interés</td>
              <td style="padding: 12px 0; font-size: 14px; font-weight: 700; color: var(--color-gold);">${s.nivel}</td>
            </tr>
            ${mensaje ? `
            <tr>
              <td style="padding: 12px 0; font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; vertical-align: top;">Mensaje</td>
              <td style="padding: 12px 0; font-size: 14px; color: var(--color-navy); line-height: 1.6;">${s.mensaje}</td>
            </tr>
            ` : ""}
          </table>
        </div>
        <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 16px;">
          Formulario web — Unidad Educativa Atenas · atenas.edu.ec
        </p>
      </div>
    `;

    const res = await sendEmail({
      purpose: "admisiones-confirmacion",
      // Destinatario: el preset.notifyTo (configurable desde /admin/configuracion/correos)
      subject: `Nueva solicitud de admisión — ${nivel}`,
      html,
      context: "POST /api/admisiones",
    });

    if (!res.ok) {
      console.error("[api/admisiones] sendEmail failed:", res.error);
      // Best-effort: el correo es un side-effect. Devolvemos 200 igual.
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando email de admisión:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
