import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/sendEmail";
import { sendFormConfirmation } from "@/lib/email/sendFormConfirmation";
import { escapeHtml } from "@/lib/email/escapeHtml";
import {
  ESTADO_INICIAL,
  NIVELES,
} from "@/app/admin/(authenticated)/admisiones/constants";
import { gradoValido } from "@/lib/admisiones/grados";
import { identificadorDe, registrarIntento } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

/**
 * Solicitudes por conexión y hora. Cuenta también las legítimas.
 *
 * Diez y no cinco, a propósito: el límite es por IP, y aquí es normal que
 * varias familias llenen el formulario desde la misma conexión —un cibercafé,
 * la sala de cómputo del propio colegio, el trabajo de un padre—. Con cinco,
 * la tercera familia de la tarde se encontraría la puerta cerrada sin haber
 * hecho nada raro.
 *
 * Contra un script da igual cinco que diez: quien automatiza esto manda miles,
 * y se corta en el mismo sitio. El número solo decide a cuántas familias
 * legítimas molesta de paso.
 */
const MAX_ENVIOS_POR_HORA = 10;
const VENTANA_MINUTOS = 60;

/**
 * Tope de caracteres por campo.
 *
 * Generosos a propósito: caben nombres compuestos ecuatorianos completos —dos
 * nombres y dos apellidos con partículas— y un comentario largo de verdad. No
 * están para dar formato ni para corregir a nadie: están para que exista un
 * techo donde antes no había ninguno.
 *
 * Lo que no aparezca en esta lista NO se acota. Si mañana el formulario gana un
 * campo, hay que añadirlo aquí; se prefiere una lista explícita a un tope
 * genérico para que quede a la vista qué se está limitando y a cuánto.
 */
const TOPES: Record<string, number> = {
  est_nombres: 120,
  est_apellidos: 120,
  est_fecha_nac: 40,
  est_nivel: 60,
  est_grado: 60,
  est_institucion_origen: 160,
  rep_nombres: 120,
  rep_apellidos: 120,
  rep_relacion: 60,
  rep_correo: 254, // el máximo real de una dirección de correo
  rep_telefono: 40,
  como_enterado: 120,
  anio_ingreso: 40,
  comentarios: 2000,
};

/** Cómo se llama cada campo para la familia, no para la base. */
const ETIQUETAS: Record<string, string> = {
  est_nombres: "Nombres del estudiante",
  est_apellidos: "Apellidos del estudiante",
  est_fecha_nac: "Fecha de nacimiento",
  est_nivel: "Nivel",
  est_grado: "Grado",
  est_institucion_origen: "Institución de origen",
  rep_nombres: "Nombres del representante",
  rep_apellidos: "Apellidos del representante",
  rep_relacion: "Relación con el estudiante",
  rep_correo: "Correo electrónico",
  rep_telefono: "Teléfono",
  como_enterado: "Cómo se enteró del colegio",
  anio_ingreso: "Año lectivo",
  comentarios: "Comentarios",
};

function row(label: string, value: string) {
  return `
    <tr style="border-bottom:1px solid #f0ece7;">
      <td style="padding:10px 0;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;width:180px;">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:#1A2B4A;">${value || "—"}</td>
    </tr>`;
}

function emailInterno(raw: {
  numero: string; fecha: string;
  est_nombres: string; est_apellidos: string; est_fecha_nac: string; est_nivel: string;
  est_grado: string;
  est_institucion_origen: string;
  rep_nombres: string; rep_apellidos: string; rep_relacion: string;
  rep_correo: string; rep_telefono: string;
  como_enterado: string; anio_ingreso: string; comentarios: string;
}) {
  // Escapamos TODOS los campos provistos por el usuario antes de
  // interpolarlos en el HTML del correo interno.
  const data = {
    numero: escapeHtml(raw.numero),
    fecha: escapeHtml(raw.fecha),
    est_nombres: escapeHtml(raw.est_nombres),
    est_apellidos: escapeHtml(raw.est_apellidos),
    est_fecha_nac: escapeHtml(raw.est_fecha_nac),
    est_nivel: escapeHtml(raw.est_nivel),
    est_grado: escapeHtml(raw.est_grado ?? ""),
    est_institucion_origen: escapeHtml(raw.est_institucion_origen),
    rep_nombres: escapeHtml(raw.rep_nombres),
    rep_apellidos: escapeHtml(raw.rep_apellidos),
    rep_relacion: escapeHtml(raw.rep_relacion),
    rep_correo: escapeHtml(raw.rep_correo),
    rep_telefono: escapeHtml(raw.rep_telefono),
    como_enterado: escapeHtml(raw.como_enterado),
    anio_ingreso: escapeHtml(raw.anio_ingreso),
    comentarios: escapeHtml(raw.comentarios),
  };
  return `
    <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#1A2B4A;">
      <div style="background:#1A2B4A;padding:32px;border-radius:8px 8px 0 0;">
        <p style="color:#9e1915;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Módulo de Admisiones</p>
        <h2 style="color:#fff;margin:0;font-size:22px;font-weight:700;">Nueva solicitud formal recibida</h2>
        <p style="color:rgba(255,255,255,0.60);margin:8px 0 0;font-size:13px;">${data.fecha}</p>
      </div>
      <div style="background:#EFF6FF;padding:20px 32px;border-left:4px solid #9e1915;">
        <p style="margin:0;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:1px;">N° de seguimiento</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:800;color:#1A2B4A;">${data.numero}</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e8e4df;border-top:none;">
        <p style="font-size:12px;font-weight:700;color:#9e1915;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Estudiante</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${row("Nombres", data.est_nombres)}
          ${row("Apellidos", data.est_apellidos)}
          ${row("Fecha de nacimiento", data.est_fecha_nac)}
          ${row("Nivel", `<strong style="color:#9e1915">${data.est_nivel}</strong>`)}
          ${data.est_grado ? row("Año", `<strong style="color:#9e1915">${data.est_grado}</strong>`) : ""}
          ${data.est_institucion_origen ? row("Institución de origen", data.est_institucion_origen) : ""}
        </table>
        <p style="font-size:12px;font-weight:700;color:#9e1915;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Representante</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;">
          ${row("Nombres", data.rep_nombres)}
          ${row("Apellidos", data.rep_apellidos)}
          ${row("Relación", data.rep_relacion)}
          ${row("Correo", `<a href="mailto:${data.rep_correo}" style="color:#9e1915">${data.rep_correo}</a>`)}
          ${row("Teléfono", data.rep_telefono)}
        </table>
        ${(data.como_enterado || data.anio_ingreso || data.comentarios) ? `
        <p style="font-size:12px;font-weight:700;color:#9e1915;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 12px;">Información adicional</p>
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
      est_nombres, est_apellidos, est_fecha_nac, est_nivel, est_grado,
      est_institucion_origen,
      rep_nombres, rep_apellidos, rep_relacion, rep_correo, rep_telefono,
      como_enterado, anio_ingreso, comentarios,
    } = body;

    if (!est_nombres || !est_apellidos || !est_nivel ||
        !rep_nombres || !rep_apellidos || !rep_correo || !rep_telefono) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
    }

    /*
      LÍMITE DE ENVÍOS — mismo patrón que el motor de formularios.

      Antes no había ninguno: un script llenaba `solicitudes_admision` de filas
      sin esfuerzo, y cada una dispara un correo a admisiones. No hace falta
      cuenta ni permisos, solo repetir el POST.

      Se registra ANTES de validar el resto a propósito: si se contara después,
      quien manda basura tendría envíos gratis mientras no pase la validación,
      que es justo el caso que hay que frenar.

      Cinco por hora es holgado para una familia real —una solicitud por hijo, y
      alguna repetición por nervios— y corta en seco al script. El límite cuenta
      también los envíos legítimos, como en el motor.
    */
    const identificador = identificadorDe(req);
    const intentos = await registrarIntento(
      "admisiones:solicitud",
      identificador,
      VENTANA_MINUTOS
    );
    if (intentos > MAX_ENVIOS_POR_HORA) {
      return NextResponse.json(
        {
          error:
            "Se han recibido demasiadas solicitudes desde esta conexión. " +
            "Espera un momento e inténtalo de nuevo, o escríbenos por WhatsApp.",
        },
        { status: 429 }
      );
    }

    /*
      TOPES DE LONGITUD

      Antes solo se comprobaba que los campos no estuvieran vacíos. Un anónimo
      podía mandar un `comentarios` de megabytes que entraba a la base, al
      correo interno de admisiones y al Excel que abre secretaría.

      Neutralizar fórmulas en el CSV (ficha del 2026-08-14) protege el archivo,
      pero no impide que el contenido entre. Esto es la fuente.

      Los topes son generosos: caben nombres compuestos ecuatorianos completos y
      un comentario largo de verdad. No están para dar formato, están para que
      exista un techo.
    */
    const demasiadoLargo = Object.entries(TOPES).find(([campo, tope]) => {
      const valor = body[campo];
      return typeof valor === "string" && valor.length > tope;
    });

    if (demasiadoLargo) {
      const [campo, tope] = demasiadoLargo;
      return NextResponse.json(
        {
          error: `El campo «${ETIQUETAS[campo] ?? campo}» es demasiado largo (máximo ${tope} caracteres).`,
        },
        { status: 400 }
      );
    }

    /*
      Y el nivel, que sí llega del navegador y NO se validaba.

      `est_grado` se validaba contra el catálogo desde antes, pero `est_nivel`
      entraba como texto libre: acababa tal cual en la columna «Nivel» de la
      exportación y en los cortes por nivel del dashboard de métricas, donde un
      valor inventado crea una categoría fantasma que nadie sabe de dónde salió.
    */
    // `NIVELES` es `as const`, así que su `includes` solo acepta los cuatro
    // literales. Aquí llega texto del navegador, que es justo lo que hay que
    // comprobar, así que se trata la lista como lo que es en este punto: textos.
    if (!(NIVELES as readonly string[]).includes(String(est_nivel))) {
      return NextResponse.json(
        { error: "El nivel educativo seleccionado no es válido." },
        { status: 400 }
      );
    }

    // Se decide UNA vez y la usan el insert y el correo. Antes el correo
    // mandaba el valor crudo del navegador: con un par imposible, admisiones
    // leía «Año: 3ro EGB» y la ficha del panel decía «No indicado».
    const gradoGuardado = gradoValido(est_nivel, String(est_grado ?? ""))
      ? String(est_grado)
      : null;

    const supabase = await createClient();

    // Año a 3 dígitos para el código de admisión: 2026 → "026", 2027 → "027".
    const yearActual = new Date().getFullYear();
    const anoCodigo = String(yearActual % 100).padStart(3, "0");

    // Número secuencial atómico desde Postgres (función SECURITY DEFINER).
    // El admin puede ajustar el contador desde /admin/configuracion/admisiones-textos.
    const { data: seqData, error: seqError } = await supabase.rpc(
      "siguiente_numero_admision",
      { p_ano: anoCodigo }
    );
    if (seqError || typeof seqData !== "number") {
      console.error("[/api/admisiones/solicitud] error obteniendo número:", seqError);
      return NextResponse.json(
        { error: "No se pudo generar el número de seguimiento" },
        { status: 500 }
      );
    }
    const numero = `ADM${anoCodigo}-${String(seqData).padStart(3, "0")}`;
    const fecha = new Date().toLocaleDateString("es-EC", { dateStyle: "long" });

    // Normalizar el año lectivo (formulario podría enviar en-dash o hyphen).
    const anoLectivoNorm = String(anio_ingreso || "").replace(/[–—]/g, "-").trim();

    // Estado inicial fijo "interesado" (se eliminó la auto-derivación a
    // lista_espera por cupos llenos — el estado "lista_espera" ya no existe
    // en el pipeline nuevo, lo maneja el admin manualmente).

    const { error } = await supabase.from("solicitudes_admision").insert({
      numero,
      est_nombres, est_apellidos,
      est_fecha_nac: est_fecha_nac || null,
      est_nivel,
      // Se guarda solo si de verdad pertenece a ese nivel: el par llega del
      // navegador y «3ro EGB» en Bachillerato es una combinación imposible que
      // nadie detectaría hasta leer la solicitud a mano.
      est_grado: gradoGuardado,
      est_institucion_origen: est_institucion_origen || null,
      rep_nombres, rep_apellidos,
      rep_relacion: rep_relacion || null,
      rep_correo, rep_telefono,
      como_enterado: como_enterado || null,
      anio_ingreso: anoLectivoNorm || null,
      comentarios: comentarios || null,
      estado: ESTADO_INICIAL,
    });

    if (error) throw error;

    // Envío SECUENCIAL (ver nota en /api/contactos): evita abrir 2 conexiones
    // SMTP a la vez. Best-effort — no bloquea la respuesta.
    const trackingUrl = `https://atenas.edu.ec/admisiones/seguimiento?numero=${encodeURIComponent(numero)}`;
    // 1. Notificación interna al admin (purpose admisiones-confirmacion → preset.notifyTo)
    await sendEmail({
      purpose: "admisiones-confirmacion",
      subject: `Solicitud formal — ${est_nivel} — N° ${numero}`,
      html: emailInterno({
        numero, fecha,
        est_nombres, est_apellidos,
        est_fecha_nac: est_fecha_nac || "—",
        est_nivel,
        est_grado: gradoGuardado ?? "",
        est_institucion_origen: est_institucion_origen || "",
        rep_nombres, rep_apellidos, rep_relacion: rep_relacion || "—",
        rep_correo, rep_telefono,
        como_enterado: como_enterado || "", anio_ingreso: anio_ingreso || "", comentarios: comentarios || "",
      }),
      context: "POST /api/admisiones/solicitud (interno)",
    }).catch(() => {});
    // 2. Confirmación al postulante — usa plantilla editable de plantillas_correo_formularios
    await sendFormConfirmation({
      tipo: "admisiones-confirmacion",
      to: rep_correo,
      variables: {
        rep_nombres,
        est_nombres,
        est_apellidos,
        est_nivel,
        est_institucion_origen: est_institucion_origen || "",
        numero,
        url_seguimiento: trackingUrl,
      },
      context: "POST /api/admisiones/solicitud (familia)",
    }).catch(() => {});

    return NextResponse.json({ ok: true, numero });
  } catch (err) {
    console.error("[admisiones/solicitud]", err);
    return NextResponse.json({ error: "Error al guardar la solicitud" }, { status: 500 });
  }
}
