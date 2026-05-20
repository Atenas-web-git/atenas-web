import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { sendFormConfirmation } from "@/lib/email/sendFormConfirmation";
import { escapeHtml } from "@/lib/email/escapeHtml";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { nombre, correo, asunto, mensaje } = data;

    if (!nombre || !correo || !asunto || !mensaje) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const fecha = new Date().toLocaleDateString("es-EC", { dateStyle: "long" });

    // Valores escapados para el HTML del correo interno.
    const s = {
      nombre: escapeHtml(nombre),
      correo: escapeHtml(correo),
      asunto: escapeHtml(asunto),
      mensaje: escapeHtml(mensaje),
    };

    const html = `
        <div style="font-family: sans-serif; max-width: 620px; margin: 0 auto; color: var(--color-navy);">
          <div style="background: var(--color-navy); padding: 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: var(--color-gold); margin: 0; font-size: 20px;">Nuevo mensaje desde el formulario de contacto</h2>
            <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 14px;">
              Recibido desde el formulario web — ${fecha}
            </p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: var(--color-gold); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px;">Datos del remitente</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 160px;">Nombre</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: var(--color-navy);">${s.nombre}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo</td>
                <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${s.correo}" style="color: var(--color-gold);">${s.correo}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Asunto</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: var(--color-navy);">${s.asunto}</td>
              </tr>
            </table>

            <h3 style="color: var(--color-gold); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px;">Mensaje</h3>
            <div style="background: #fafaf7; border-left: 3px solid var(--color-gold); padding: 16px 18px; font-size: 14px; line-height: 1.7; color: var(--color-navy); white-space: pre-wrap;">${s.mensaje}</div>
          </div>
          <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 16px;">
            Formulario web — Unidad Educativa Atenas · atenas.edu.ec
          </p>
        </div>
    `;

    await Promise.allSettled([
      sendEmail({
        purpose: "contactos",
        subject: `Nuevo mensaje — ${asunto}`,
        html,
        context: "POST /api/contactos (interno)",
      }),
      sendFormConfirmation({
        tipo: "contactos",
        to: correo,
        variables: { nombre, correo, asunto },
        context: "POST /api/contactos (confirmación)",
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando contacto:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
