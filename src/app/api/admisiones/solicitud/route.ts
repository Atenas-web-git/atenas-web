import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

function generarNumero(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ATN-${year}-${rand}`;
}

function row(label: string, value: string) {
  return `
    <tr style="border-bottom:1px solid #f0ece7;">
      <td style="padding:10px 0;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;width:180px;">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:#1A2B4A;">${value || "—"}</td>
    </tr>`;
}

function emailInterno(data: {
  numero: string; fecha: string;
  est_nombres: string; est_apellidos: string; est_fecha_nac: string; est_nivel: string;
  rep_nombres: string; rep_apellidos: string; rep_relacion: string;
  rep_correo: string; rep_telefono: string;
  como_enterado: string; anio_ingreso: string; comentarios: string;
}) {
  return `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#1A2B4A;">
      <div style="background:#1A2B4A;padding:32px;border-radius:8px 8px 0 0;">
        <p style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Módulo de Admisiones</p>
        <h2 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Nueva solicitud formal recibida</h2>
        <p style="color:rgba(255,255,255,0.60);margin:8px 0 0;font-size:13px;">${data.fecha}</p>
      </div>
      <div style="background:#EFF6FF;padding:20px 32px;border-left:4px solid #C9A84C;">
        <p style="margin:0;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">N° de seguimiento</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#1A2B4A;">${data.numero}</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e8e4df;border-top:none;">
        <p style="font-size:12px;font-weight:700;color:#C9A84C;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Estudiante</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${row("Nombres", data.est_nombres)}
          ${row("Apellidos", data.est_apellidos)}
          ${row("Fecha de nacimiento", data.est_fecha_nac)}
          ${row("Nivel", `<strong style="color:#C9A84C">${data.est_nivel}</strong>`)}
        </table>
        <p style="font-size:12px;font-weight:700;color:#C9A84C;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Representante</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${row("Nombres", data.rep_nombres)}
          ${row("Apellidos", data.rep_apellidos)}
          ${row("Relación", data.rep_relacion)}
          ${row("Correo", `<a href="mailto:${data.rep_correo}" style="color:#C9A84C">${data.rep_correo}</a>`)}
          ${row("Teléfono", data.rep_telefono)}
        </table>
        ${(data.como_enterado || data.anio_ingreso || data.comentarios) ? `
        <p style="font-size:12px;font-weight:700;color:#C9A84C;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Información adicional</p>
        <table style="width:100%;border-collapse:collapse;">
          ${data.como_enterado ? row("¿Cómo se enteró?", data.como_enterado) : ""}
          ${data.anio_ingreso ? row("Año de ingreso", data.anio_ingreso) : ""}
          ${data.comentarios ? row("Comentarios", data.comentarios) : ""}
        </table>` : ""}
      </div>
      <p style="color:#aaa;font-size:11px;text-align:center;margin-top:16px;">
        Unidad Educativa Atenas · admisiones@atenas.edu.ec
      </p>
    </div>`;
}

function emailFamilia(data: {
  numero: string; rep_nombres: string; est_nombres: string; est_nivel: string;
}) {
  const trackingUrl = `https://atenas.edu.ec/admisiones/seguimiento?numero=${encodeURIComponent(data.numero)}`;
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1A2B4A;">
      <div style="background:#1A2B4A;padding:40px 36px 32px;border-radius:8px 8px 0 0;">
        <p style="color:#C9A84C;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 14px;">Unidad Educativa Atenas</p>
        <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;line-height:1.2;">¡Solicitud de admisión recibida!</h1>
        <p style="color:rgba(255,255,255,0.65);margin:12px 0 0;font-size:14px;line-height:1.6;">
          Hola, <strong style="color:#fff">${data.rep_nombres}</strong>. Hemos recibido la solicitud formal de admisión para <strong style="color:#C9A84C">${data.est_nombres}</strong> al nivel de <strong style="color:#C9A84C">${data.est_nivel}</strong>.
        </p>
      </div>
      <div style="background:#fff;padding:36px;border:1px solid #e8e4df;border-top:none;">
        <p style="font-size:13px;color:#6B7280;margin:0 0 20px;line-height:1.65;">
          Nuestro equipo de admisiones revisará la información y se pondrá en contacto contigo en un plazo de <strong style="color:#1A2B4A">48 horas hábiles</strong>. Guarda este número para hacer seguimiento de tu solicitud:
        </p>
        <div style="background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:8px;padding:20px 24px;text-align:center;margin:0 0 28px;">
          <p style="font-size:11px;font-weight:700;color:#6B7280;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 6px;">Tu número de seguimiento</p>
          <p style="font-size:28px;font-weight:800;color:#1A2B4A;margin:0;letter-spacing:1px;">${data.numero}</p>
        </div>
        <p style="font-size:13px;font-weight:700;color:#1A2B4A;margin:0 0 12px;">¿Qué sigue?</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          <tr><td style="padding:8px 0;vertical-align:top;width:28px;">
            <span style="display:inline-block;width:20px;height:20px;background:#16A34A;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#fff;">1</span>
          </td><td style="padding:8px 0;font-size:13px;color:#374151;line-height:1.5;">Recibirás una llamada o correo de nuestro equipo para coordinar los próximos pasos.</td></tr>
          <tr><td style="padding:8px 0;vertical-align:top;">
            <span style="display:inline-block;width:20px;height:20px;background:#16A34A;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#fff;">2</span>
          </td><td style="padding:8px 0;font-size:13px;color:#374151;line-height:1.5;">Si corresponde, agendaremos una visita al colegio y una entrevista con el equipo directivo.</td></tr>
          <tr><td style="padding:8px 0;vertical-align:top;">
            <span style="display:inline-block;width:20px;height:20px;background:#16A34A;border-radius:50%;text-align:center;line-height:20px;font-size:11px;font-weight:700;color:#fff;">3</span>
          </td><td style="padding:8px 0;font-size:13px;color:#374151;line-height:1.5;">Una vez completado el proceso, te informaremos oficialmente sobre la admisión.</td></tr>
        </table>
        <a href="${trackingUrl}"
          style="display:block;background:#1A2B4A;color:#fff;text-decoration:none;text-align:center;padding:14px 24px;border-radius:6px;font-size:14px;font-weight:700;margin-bottom:20px;">
          Consultar estado de mi solicitud →
        </a>
        <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0;line-height:1.6;">
          ¿Tienes dudas? Escríbenos a <a href="mailto:admisiones@atenas.edu.ec" style="color:#C9A84C;">admisiones@atenas.edu.ec</a>
        </p>
      </div>
      <p style="color:#bbb;font-size:11px;text-align:center;margin:16px 0 0;">
        Unidad Educativa Atenas · Izamba, Ambato, Ecuador · atenas.edu.ec
      </p>
    </div>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      est_nombres, est_apellidos, est_fecha_nac, est_nivel,
      rep_nombres, rep_apellidos, rep_relacion, rep_correo, rep_telefono,
      como_enterado, anio_ingreso, comentarios,
    } = body;

    if (!est_nombres || !est_apellidos || !est_nivel ||
        !rep_nombres || !rep_apellidos || !rep_correo || !rep_telefono) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    const supabase = await createClient();
    const numero = generarNumero();
    const fecha = new Date().toLocaleDateString("es-EC", { dateStyle: "long" });

    const { error } = await supabase.from("solicitudes_admision").insert({
      numero,
      est_nombres, est_apellidos,
      est_fecha_nac: est_fecha_nac || null,
      est_nivel,
      rep_nombres, rep_apellidos,
      rep_relacion: rep_relacion || null,
      rep_correo, rep_telefono,
      como_enterado: como_enterado || null,
      anio_ingreso: anio_ingreso || null,
      comentarios: comentarios || null,
      estado: "pendiente",
    });

    if (error) throw error;

    // Enviar emails en paralelo — no bloquean si Resend aún no está configurado
    if (process.env.RESEND_API_KEY) {
      await Promise.allSettled([
        resend.emails.send({
          from: "Admisiones Atenas <noreply@atenas.edu.ec>",
          to: ["admisiones@atenas.edu.ec"],
          replyTo: rep_correo,
          subject: `Solicitud formal — ${est_nivel} — N° ${numero}`,
          html: emailInterno({
            numero, fecha,
            est_nombres, est_apellidos, est_fecha_nac: est_fecha_nac || "—", est_nivel,
            rep_nombres, rep_apellidos, rep_relacion: rep_relacion || "—",
            rep_correo, rep_telefono,
            como_enterado: como_enterado || "", anio_ingreso: anio_ingreso || "", comentarios: comentarios || "",
          }),
        }),
        resend.emails.send({
          from: "Admisiones Atenas <noreply@atenas.edu.ec>",
          to: [rep_correo],
          subject: `Tu solicitud fue recibida — N° ${numero}`,
          html: emailFamilia({ numero, rep_nombres, est_nombres, est_nivel }),
        }),
      ]);
    }

    return NextResponse.json({ ok: true, numero });
  } catch (err) {
    console.error("[admisiones/solicitud]", err);
    return NextResponse.json({ error: "Error al guardar la solicitud" }, { status: 500 });
  }
}
