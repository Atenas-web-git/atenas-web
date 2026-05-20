import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { sendFormConfirmation } from "@/lib/email/sendFormConfirmation";
import { escapeHtml, safeHref } from "@/lib/email/escapeHtml";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
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

    // Valores escapados para interpolar en el HTML del correo interno.
    const s = {
      nombres: escapeHtml(nombres),
      correo: escapeHtml(correo),
      identificacion: escapeHtml(identificacion),
      fechaNacimiento: escapeHtml(fechaNacimiento),
      genero: escapeHtml(genero || "No indicado"),
      discapacidad: escapeHtml(discapacidad || "No indicado"),
      cargo: escapeHtml(cargo),
      formacion: escapeHtml(formacion),
      area: escapeHtml(area),
      certificadoB2: escapeHtml(certificadoB2 || "No indicado"),
      disponibilidad: escapeHtml(disponibilidad || "No indicado"),
      expectativaSalarial: expectativaSalarial
        ? `$${escapeHtml(expectativaSalarial)} USD/mes`
        : "No indicado",
    };
    const cvHref = safeHref(enlaceCV);

    const html = `
        <div style="font-family: sans-serif; max-width: 620px; margin: 0 auto; color: var(--color-navy);">
          <div style="background: var(--color-navy); padding: 32px; border-radius: 8px 8px 0 0;">
            <h2 style="color: var(--color-gold); margin: 0; font-size: 20px;">Nueva postulación de empleo</h2>
            <p style="color: rgba(255,255,255,0.70); margin: 8px 0 0; font-size: 14px;">
              Recibida desde el formulario web — ${fecha}
            </p>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px;">
            <h3 style="color: var(--color-gold); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px;">Datos Personales</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 200px;">Nombres</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 600; color: var(--color-navy);">${s.nombres}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Correo</td>
                <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${s.correo}" style="color: var(--color-gold);">${s.correo}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Identificación</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.identificacion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Fecha de Nacimiento</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.fechaNacimiento}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Género</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.genero}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Discapacidad</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.discapacidad}</td>
              </tr>
            </table>

            <h3 style="color: var(--color-gold); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 14px;">Perfil Profesional</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; width: 200px;">Cargo de Interés</td>
                <td style="padding: 10px 0; font-size: 14px; font-weight: 700; color: var(--color-navy);">${s.cargo}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Nivel de Formación</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.formacion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Área</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.area}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Certificado B2</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.certificadoB2}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0ece7;">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Disponibilidad</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.disponibilidad}</td>
              </tr>
              <tr style="border-bottom: ${cvHref ? "1px solid #f0ece7" : "none"};">
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Expectativa Salarial</td>
                <td style="padding: 10px 0; font-size: 14px; color: var(--color-navy);">${s.expectativaSalarial}</td>
              </tr>
              ${cvHref ? `<tr>
                <td style="padding: 10px 0; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">CV / Portafolio</td>
                <td style="padding: 10px 0; font-size: 14px;"><a href="${cvHref}" style="color: var(--color-gold); word-break: break-all;">${cvHref}</a></td>
              </tr>` : ""}
            </table>
          </div>
          <p style="color: #aaa; font-size: 11px; text-align: center; margin-top: 16px;">
            Formulario web — Unidad Educativa Atenas · atenas.edu.ec
          </p>
        </div>
    `;

    await Promise.allSettled([
      sendEmail({
        purpose: "trabaja",
        subject: `Nueva postulación — ${nombres} — ${cargo}`,
        html,
        context: "POST /api/trabaja (interno)",
      }),
      sendFormConfirmation({
        tipo: "trabaja",
        to: String(correo),
        variables: {
          nombre: String(nombres),
          correo: String(correo),
          cargo: String(cargo),
        },
        context: "POST /api/trabaja (confirmación)",
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando postulación:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
