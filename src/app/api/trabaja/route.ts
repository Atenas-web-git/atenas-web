import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const data = await req.json();
    const {
      nombres, correo, identificacion, fechaNacimiento, genero, discapacidad,
      cargo, formacion, area, certificadoB2, disponibilidad, expectativaSalarial, enlaceCV,
    } = data;

    if (!nombres || !correo || !identificacion || !fechaNacimiento || !cargo || !formacion || !area) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const fecha = new Date().toLocaleDateString("es-EC", { dateStyle: "long" });

    await resend.emails.send({
      from: "Formulario Web <noreply@atenas.edu.ec>",
      to: ["rrhh@atenas.edu.ec"],
      replyTo: correo,
      subject: `Nueva postulación — ${nombres} — ${cargo}`,
      html: `
        <div style="font-family: sans-serif; max-width: 620px; margin: 0 auto; color: #1A2B4A;">
          <div style="background: #1A2B4A; padding: 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #C9A84C; margin: 0; font-size: 20px;">Nueva postulación de empleo</h2>
            <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 14px;">
              Recibida desde el formulario web — ${fecha}
            </p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: #C9A84C; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px;">Datos Personales</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 200px;">Nombres</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: #1A2B4A;">${nombres}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo</td>
                <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${correo}" style="color: #C9A84C;">${correo}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Identificación</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${identificacion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Fecha de Nacimiento</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${fechaNacimiento}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Género</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${genero || "No indicado"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Discapacidad</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${discapacidad || "No indicado"}</td>
              </tr>
            </table>

            <h3 style="color: #C9A84C; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px;">Perfil Profesional</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 200px;">Cargo de Interés</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: #1A2B4A;">${cargo}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Nivel de Formación</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${formacion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Área</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${area}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Certificado B2</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${certificadoB2 || "No indicado"}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Disponibilidad</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${disponibilidad || "No indicado"}</td>
              </tr>
              <tr style="border-bottom: ${enlaceCV ? "1px solid #f0ece7" : "none"};">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Expectativa Salarial</td>
                <td style="padding: 10px 0; font-size: 14px; color: #1A2B4A;">${expectativaSalarial ? `$${expectativaSalarial} USD/mes` : "No indicado"}</td>
              </tr>
              ${enlaceCV ? `<tr>
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">CV / Portafolio</td>
                <td style="padding: 10px 0; font-size: 14px;"><a href="${enlaceCV}" style="color: #C9A84C; word-break: break-all;">${enlaceCV}</a></td>
              </tr>` : ""}
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
    console.error("Error enviando postulación:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
