/**
 * POST /api/formularios/[slug]
 *
 * Endpoint único de todos los formularios creados desde el panel. Sustituye
 * el patrón actual de un endpoint escrito a mano por formulario.
 *
 * ORDEN DELIBERADO: se GUARDA primero y se avisa después.
 *
 * Es la razón de ser de esta tarea. Hoy contactos, quejas y
 * trabaja-con-nosotros solo mandan un correo, con `.catch(() => {})` alrededor
 * y respondiendo 200 pase lo que pase. Cuando el correo falla —y falla, porque
 * mientras el dominio no esté verificado muchos caen en spam o son
 * rechazados— el mensaje desaparece y nadie se entera. Guardando primero, un
 * fallo de correo es como mucho un aviso perdido, nunca el contacto.
 *
 * ANTI-SPAM: hasta ahora no había ninguno en todo el sitio. Aquí van tres
 * capas baratas, en orden de eficacia:
 *   1. Límite de envíos por IP (tabla compartida, migración 069).
 *   2. Campo trampa: un input oculto que una persona nunca rellena.
 *   3. Tiempo mínimo desde que se pintó el formulario.
 * Ninguna sustituye a un captcha, pero el 99% del spam de formularios lo hacen
 * robots que caen en las tres.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFormulario } from "@/lib/formularios/getFormulario";
import { normalizarDatos, validarRespuesta } from "@/lib/formularios/validar";
import {
  URL_SITIO,
  confirmarAlRemitente,
  notificarInterno,
} from "@/lib/formularios/notificar";
import {
  EXTENSIONES_ARCHIVO_DEFAULT,
  MAX_MB_ARCHIVO,
  MIME_ARCHIVO_PERMITIDOS,
  type ArchivoRespuesta,
} from "@/lib/formularios/tipos";
import { identificadorDe, registrarIntento } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const BUCKET = "formularios-archivos";

/** Envíos por IP y hora. Holgado: cuenta también los legítimos. */
const MAX_ENVIOS_POR_HORA = 12;
const VENTANA_MINUTOS = 60;

/**
 * Segundos mínimos entre pintar el formulario y enviarlo.
 *
 * UN segundo, no tres. Este filtro descarta el envío EN SILENCIO, así que un
 * umbral generoso acaba tragándose respuestas legítimas —alguien con el
 * autocompletado del navegador rellena un formulario corto en dos segundos— y
 * perder respuestas en silencio es exactamente lo que este motor existe para
 * evitar. Por debajo de un segundo no hay persona: no da tiempo ni a mover el
 * ratón hasta el botón.
 */
const SEGUNDOS_MINIMOS = 1;

/** Nombres reservados del formulario, no son campos del colegio. */
const CAMPO_TRAMPA = "_confirmacion_web";
const CAMPO_TIEMPO = "_t";

/**
 * Respuesta de éxito falsa para el spam detectado. Devolver un error le dice
 * al robot qué corregir; devolver 200 sin guardar nada lo deja creyendo que
 * funcionó.
 */
function fingirExito() {
  return NextResponse.json({ ok: true });
}

function extension(nombre: string): string {
  const punto = nombre.lastIndexOf(".");
  return punto === -1 ? "" : nombre.slice(punto).toLowerCase();
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const formulario = await getFormulario(slug);
    if (!formulario || !formulario.activo) {
      return NextResponse.json(
        { error: "Este formulario no está disponible." },
        { status: 404 }
      );
    }

    // ─── Límite de envíos ────────────────────────────────────
    const identificador = identificadorDe(req);
    const intentos = await registrarIntento(
      `formulario:${slug}`,
      identificador,
      VENTANA_MINUTOS
    );
    if (intentos > MAX_ENVIOS_POR_HORA) {
      return NextResponse.json(
        {
          error:
            "Has enviado este formulario demasiadas veces. Intenta de nuevo más tarde.",
        },
        { status: 429 }
      );
    }

    const formData = await req.formData();

    // ─── Campo trampa ────────────────────────────────────────
    const trampa = String(formData.get(CAMPO_TRAMPA) ?? "").trim();
    if (trampa !== "") return fingirExito();

    // ─── Tiempo mínimo ───────────────────────────────────────
    const marcaTiempo = Number(formData.get(CAMPO_TIEMPO));
    if (
      Number.isFinite(marcaTiempo) &&
      marcaTiempo > 0 &&
      Date.now() - marcaTiempo < SEGUNDOS_MINIMOS * 1000
    ) {
      return fingirExito();
    }

    // ─── Reunir valores ──────────────────────────────────────
    const entrada: Record<string, unknown> = {};
    const archivosEntrantes = new Map<string, File>();

    for (const campo of formulario.campos) {
      if (campo.tipo === "archivo") {
        const valor = formData.get(campo.key);
        if (valor instanceof File && valor.size > 0) {
          archivosEntrantes.set(campo.key, valor);
        }
        continue;
      }

      if (campo.tipo === "seleccion_multiple") {
        entrada[campo.key] = formData.getAll(campo.key).map((v) => String(v));
        continue;
      }

      const valor = formData.get(campo.key);
      entrada[campo.key] = valor === null ? null : String(valor);
    }

    const datos = normalizarDatos(formulario.campos, entrada);
    const errores = validarRespuesta(
      formulario.campos,
      datos,
      [...archivosEntrantes.keys()]
    );

    if (Object.keys(errores).length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    // ─── Comprobar los archivos antes de subir nada ──────────
    for (const [key, archivo] of archivosEntrantes) {
      const campo = formulario.campos.find((c) => c.key === key);
      const maxMb = Math.min(campo?.maxMb ?? MAX_MB_ARCHIVO, MAX_MB_ARCHIVO);

      if (archivo.size > maxMb * 1024 * 1024) {
        return NextResponse.json(
          {
            errores: {
              [key]: `El archivo supera el límite de ${maxMb} MB.`,
            },
          },
          { status: 400 }
        );
      }

      const admitidas = campo?.acepta?.length
        ? campo.acepta
        : EXTENSIONES_ARCHIVO_DEFAULT;
      const ext = extension(archivo.name);

      // Se comprueban las DOS cosas: la extensión la elige quien sube el
      // archivo y se cambia renombrando, así que el tipo declarado tiene que
      // cuadrar también con la lista de formatos que aceptamos.
      if (!admitidas.includes(ext)) {
        return NextResponse.json(
          {
            errores: {
              [key]: `Formato no admitido. Usa ${admitidas.join(", ")}.`,
            },
          },
          { status: 400 }
        );
      }

      // Sin cortocircuito por `archivo.type` vacío: una parte del formulario
      // enviada sin cabecera de tipo se saltaba la comprobación entera, que es
      // justo lo que haría quien quisiera subir algo que no toca.
      if (!MIME_ARCHIVO_PERMITIDOS.includes(archivo.type)) {
        return NextResponse.json(
          {
            errores: {
              [key]: "Ese tipo de archivo no se admite.",
            },
          },
          { status: 400 }
        );
      }
    }

    // ─── Subir ───────────────────────────────────────────────
    const supabase = createAdminClient();
    const subidos: ArchivoRespuesta[] = [];

    for (const [key, archivo] of archivosEntrantes) {
      const nombreSeguro = archivo.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
      const ruta = `${slug}/${randomUUID()}_${nombreSeguro}`;
      const buffer = Buffer.from(await archivo.arrayBuffer());

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(ruta, buffer, {
          contentType: archivo.type || "application/octet-stream",
          upsert: false,
        });

      if (error) {
        console.error(`[formularios] no se pudo subir "${ruta}":`, error.message);
        // Limpiar lo que ya se subió: si no se puede completar el envío, no
        // deben quedar archivos sueltos de una respuesta que no existe.
        if (subidos.length > 0) {
          await supabase.storage
            .from(BUCKET)
            .remove(subidos.map((a) => a.storage_path));
        }
        return NextResponse.json(
          { errores: { [key]: "No se pudo subir el archivo. Intenta de nuevo." } },
          { status: 500 }
        );
      }

      subidos.push({
        key,
        filename: archivo.name.slice(-120),
        storage_path: ruta,
        size_bytes: archivo.size,
        mime_type: archivo.type || "application/octet-stream",
      });
    }

    // ─── Guardar ─────────────────────────────────────────────
    const { data: creada, error: errorInsert } = await supabase
      .rpc("insertar_respuesta_formulario", {
        p_formulario_id: formulario.id,
        p_datos: datos,
        p_archivos: subidos,
      })
      .single();

    if (errorInsert || !creada) {
      console.error(
        `[formularios] no se pudo guardar la respuesta de "${slug}":`,
        errorInsert?.message
      );
      if (subidos.length > 0) {
        await supabase.storage
          .from(BUCKET)
          .remove(subidos.map((a) => a.storage_path));
      }
      return NextResponse.json(
        { error: "No se pudo registrar tu envío. Intenta de nuevo." },
        { status: 500 }
      );
    }

    const { id: respuestaId, numero } = creada as { id: string; numero: number };

    // ─── Avisar ──────────────────────────────────────────────
    // A partir de aquí la respuesta ya está a salvo: pase lo que pase con el
    // correo, se responde ok.
    const enviado = await notificarInterno({
      formulario,
      datos,
      archivos: subidos,
      numero,
      urlPanel: `${URL_SITIO}/admin/contenido/formularios/${formulario.id}/respuestas`,
    });

    await confirmarAlRemitente({ formulario, datos, numero });

    if (enviado) {
      await supabase
        .from("formulario_respuestas")
        .update({ correo_enviado: true })
        .eq("id", respuestaId);
    }

    // No se devuelve el número de respuesta: es un contador correlativo, y
    // enviando el formulario dos veces cualquiera sabría cuántas
    // postulaciones lleva recibidas el colegio y a qué ritmo. Quien rellena el
    // formulario ve el mensaje de gracias, no el número.
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(`[formularios] excepción en "${slug}":`, e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
