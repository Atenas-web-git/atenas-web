import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { nombre, correo, tipo, descripcion } = await req.json();

    if (!nombre || !correo || !tipo || !descripcion) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    await resend.emails.send({
      from: "Formulario Web <noreply@atenas.edu.ec>",
      to: ["secretaria@atenas.edu.ec"],
      replyTo: correo,
      subject: `Nueva ${tipo} — ${nombre}`,
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
