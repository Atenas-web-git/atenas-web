import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { sendFormConfirmation } from "@/lib/email/sendFormConfirmation";

export const runtime = "nodejs";

function generarNumero(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ATN-${year}-${rand}`;
}

function row(label: string, value: string) {
  return `
    <tr style="border-bottom:1px solid #f0ece7;">
      <td style="padding:10px 0;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;width:180px;">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:var(--color-navy);">${value || "—"}</td>
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
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:var(--color-navy);">
      <div style="background:var(--color-navy);padding:32px;border-radius:8px 8px 0 0;">
        <p style="color:var(--color-gold);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Módulo de Admisiones</p>
        <h2 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Nueva solicitud formal recibida</h2>
        <p style="color:rgba(255,255,255,0.60);margin:8px 0 0;font-size:13px;">${data.fecha}</p>
      </div>
      <div style="background:#EFF6FF;padding:20px 32px;border-left:4px solid var(--color-gold);">
        <p style="margin:0;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">N° de seguimiento</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:var(--color-navy);">${data.numero}</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e8e4df;border-top:none;">
        <p style="font-size:12px;font-weight:700;color:var(--color-gold);letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Estudiante</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${row("Nombres", data.est_nombres)}
          ${row("Apellidos", data.est_apellidos)}
          ${row("Fecha de nacimiento", data.est_fecha_nac)}
          ${row("Nivel", `<strong style="color:var(--color-gold)">${data.est_nivel}</strong>`)}
        </table>
        <p style="font-size:12px;font-weight:700;color:var(--color-gold);letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Representante</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${row("Nombres", data.rep_nombres)}
          ${row("Apellidos", data.rep_apellidos)}
          ${row("Relación", data.rep_relacion)}
          ${row("Correo", `<a href="mailto:${data.rep_correo}" style="color:var(--color-gold)">${data.rep_correo}</a>`)}
          ${row("Teléfono", data.rep_telefono)}
        </table>
        ${(data.como_enterado || data.anio_ingreso || data.comentarios) ? `
        <p style="font-size:12px;font-weight:700;color:var(--color-gold);letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Información adicional</p>
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

    // Normalizar el año lectivo (formulario podría enviar en-dash o hyphen)
    const anoLectivoNorm = String(anio_ingreso || "").replace(/[–—]/g, "-").trim();

    // Auto-derivación a lista de espera: si hay configuración de cupos para
    // este nivel + año y los matriculados llenan los cupos, la nueva solicitud
    // entra como "lista_espera" en vez de "pendiente".
    let estadoInicial = "pendiente";
    if (anoLectivoNorm) {
      const [{ data: cupoConf }, { count: matriculados }] = await Promise.all([
        supabase
          .from("cupos_admision")
          .select("cupos_total")
          .eq("nivel", est_nivel)
          .eq("ano_lectivo", anoLectivoNorm)
          .maybeSingle(),
        supabase
          .from("solicitudes_admision")
          .select("*", { count: "exact", head: true })
          .eq("est_nivel", est_nivel)
          .eq("estado", "matriculado"),
      ]);

      const total = cupoConf?.cupos_total ?? 0;
      if (total > 0 && (matriculados ?? 0) >= total) {
        estadoInicial = "lista_espera";
      }
    }

    const { error } = await supabase.from("solicitudes_admision").insert({
      numero,
      est_nombres, est_apellidos,
      est_fecha_nac: est_fecha_nac || null,
      est_nivel,
      rep_nombres, rep_apellidos,
      rep_relacion: rep_relacion || null,
      rep_correo, rep_telefono,
      como_enterado: como_enterado || null,
      anio_ingreso: anoLectivoNorm || null,
      comentarios: comentarios || null,
      estado: estadoInicial,
    });

    if (error) throw error;

    // Enviar emails en paralelo — best-effort, no bloquea la respuesta
    const trackingUrl = `https://atenas.edu.ec/admisiones/seguimiento?numero=${encodeURIComponent(numero)}`;
    await Promise.allSettled([
      // 1. Notificación interna al admin (purpose admisiones-confirmacion → preset.notifyTo)
      sendEmail({
        purpose: "admisiones-confirmacion",
        subject: `Solicitud formal — ${est_nivel} — N° ${numero}`,
        html: emailInterno({
          numero, fecha,
          est_nombres, est_apellidos, est_fecha_nac: est_fecha_nac || "—", est_nivel,
          rep_nombres, rep_apellidos, rep_relacion: rep_relacion || "—",
          rep_correo, rep_telefono,
          como_enterado: como_enterado || "", anio_ingreso: anio_ingreso || "", comentarios: comentarios || "",
        }),
        context: "POST /api/admisiones/solicitud (interno)",
      }),
      // 2. Confirmación al postulante — usa plantilla editable de plantillas_correo_formularios
      sendFormConfirmation({
        tipo: "admisiones-confirmacion",
        to: rep_correo,
        variables: {
          rep_nombres,
          est_nombres,
          est_apellidos,
          est_nivel,
          numero,
          url_seguimiento: trackingUrl,
        },
        context: "POST /api/admisiones/solicitud (familia)",
      }),
    ]);

    return NextResponse.json({ ok: true, numero });
  } catch (err) {
    console.error("[admisiones/solicitud]", err);
    return NextResponse.json({ error: "Error al guardar la solicitud" }, { status: 500 });
  }
}
