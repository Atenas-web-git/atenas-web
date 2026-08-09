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
import { createAdminClient } from "@/lib/supabase/admin";
import { getFormulario } from "@/lib/formularios/getFormulario";
import { normalizarDatos, validarRespuesta } from "@/lib/formularios/validar";
import {
  URL_SITIO,
  confirmarAlRemitente,
  notificarInterno,
} from "@/lib/formularios/notificar";
import {
  MAX_MB_ARCHIVO,
  type ArchivoRespuesta,
} from "@/lib/formularios/tipos";
import { identificadorDe, registrarIntento } from "@/lib/security/rateLimit";
import { quizaPurgar } from "@/lib/formularios/purgarHuerfanos";

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
    //
    // Los archivos NO viajan en esta petición: el navegador ya los subió
    // directo a Storage con un permiso firmado (ver ./subida) y aquí solo
    // llega su ruta. Es lo que permite aceptar un audio de más de 4,5 MB, que
    // es el techo del cuerpo de una petición en Vercel.
    const entrada: Record<string, unknown> = {};
    const rutasEntrantes = new Map<string, string>();

    for (const campo of formulario.campos) {
      if (campo.tipo === "archivo") {
        const ruta = String(formData.get(`__ruta_${campo.key}`) ?? "").trim();
        // Se acepta solo si tiene la forma exacta que genera el endpoint de
        // subida Y está dentro de la carpeta de ESTE formulario. Sin lo
        // segundo, alguien podría adjuntar a su postulación la hoja de vida
        // que otra persona subió a otro formulario.
        if (ruta && new RegExp(`^${slug}/[A-Za-z0-9._-]+$`).test(ruta)) {
          rutasEntrantes.set(campo.key, ruta);
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
      [...rutasEntrantes.keys()]
    );

    if (Object.keys(errores).length > 0) {
      return NextResponse.json({ errores }, { status: 400 });
    }

    // ─── Confirmar los archivos ya subidos ───────────────────
    //
    // Se comprueba contra Storage que cada ruta EXISTE de verdad. El permiso
    // de subida se pide antes de subir, así que una ruta firmada no prueba que
    // haya llegado nada: sin esta comprobación, una postulación podría quedar
    // con una hoja de vida que no está, y el colegio lo descubriría al ir a
    // descargarla.
    const supabase = createAdminClient();
    const subidos: ArchivoRespuesta[] = [];

    for (const [key, ruta] of rutasEntrantes) {
      const carpeta = ruta.slice(0, ruta.lastIndexOf("/"));
      const nombre = ruta.slice(ruta.lastIndexOf("/") + 1);

      const { data: encontrados } = await supabase.storage
        .from(BUCKET)
        .list(carpeta, { search: nombre, limit: 1 });

      const archivo = encontrados?.find((f) => f.name === nombre);
      if (!archivo) {
        return NextResponse.json(
          {
            errores: {
              [key]: "El archivo no terminó de subirse. Vuelve a adjuntarlo.",
            },
          },
          { status: 400 }
        );
      }

      const campo = formulario.campos.find((c) => c.key === key);
      const maxMb = Math.min(campo?.maxMb ?? MAX_MB_ARCHIVO, MAX_MB_ARCHIVO);
      const tamano = Number(archivo.metadata?.size ?? 0);

      // El tamaño se vuelve a mirar aquí porque al pedir el permiso lo declara
      // el cliente, y lo declarado no obliga a nada.
      if (tamano > maxMb * 1024 * 1024) {
        await supabase.storage.from(BUCKET).remove([ruta]);
        return NextResponse.json(
          { errores: { [key]: `El archivo supera el límite de ${maxMb} MB.` } },
          { status: 400 }
        );
      }

      subidos.push({
        key,
        // El nombre real se recupera quitando el identificador aleatorio que
        // el servidor antepuso al firmar.
        filename: nombre.replace(/^[0-9a-f-]{36}_/i, "").slice(-120),
        storage_path: ruta,
        size_bytes: tamano,
        mime_type: String(archivo.metadata?.mimetype ?? "application/octet-stream"),
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

    // De vez en cuando, barrer los archivos que otras personas dejaron a medias
    // en este formulario. No se espera: la respuesta ya está guardada y quien
    // envió no tiene por qué aguardar a una tarea de mantenimiento.
    quizaPurgar(slug, formulario.id);

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
