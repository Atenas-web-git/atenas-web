/**
 * POST /api/formularios/[slug]/subida
 *
 * Da permiso para subir UN archivo directamente a Supabase Storage, sin pasar
 * por nuestro servidor.
 *
 * POR QUÉ NO SE SUBE POR EL ENDPOINT NORMAL
 *
 * Vercel corta el cuerpo de una petición en 4,5 MB. El audio de presentación
 * que el colegio pide a los docentes de idiomas admite 100 MB en su formulario
 * de Google: por el camino normal no llega, y falla con un error de plataforma
 * que no dice nada. Aquí el navegador sube contra Supabase, que no tiene ese
 * límite, y a nosotros solo nos llega la ruta.
 *
 * ESTE ENDPOINT ES PÚBLICO — quien postula no tiene sesión. De ahí que:
 *
 *  · Solo firma rutas de campos que existen y son de tipo archivo en ESE
 *    formulario. No se puede pedir permiso para subir donde uno quiera.
 *  · La ruta la construye el servidor con un identificador aleatorio; el
 *    nombre que manda el cliente solo se usa, ya saneado, como sufijo.
 *  · Comprueba extensión, tipo y tamaño ANTES de firmar.
 *  · Cuenta contra el mismo limitador que el envío, para que pedir permisos en
 *    bucle no salga gratis.
 *
 * El permiso caduca solo, y una ruta firmada no permite leer nada: el bucket
 * sigue siendo privado y las descargas se firman aparte desde el panel.
 */

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFormulario } from "@/lib/formularios/getFormulario";
import {
  EXTENSIONES_ARCHIVO_DEFAULT,
  MAX_MB_ARCHIVO,
  MIME_ARCHIVO_PERMITIDOS,
} from "@/lib/formularios/tipos";
import { identificadorDe, registrarIntento } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const BUCKET = "formularios-archivos";

/** Permisos por IP y hora. Más holgado que los envíos: un formulario puede
 *  tener varios campos de archivo y la persona puede cambiar de idea. */
const MAX_PERMISOS_POR_HORA = 40;
const VENTANA_MINUTOS = 60;

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
      return NextResponse.json({ error: "No disponible." }, { status: 404 });
    }

    const intentos = await registrarIntento(
      `subida:${slug}`,
      identificadorDe(req),
      VENTANA_MINUTOS
    );
    if (intentos > MAX_PERMISOS_POR_HORA) {
      return NextResponse.json(
        { error: "Demasiados intentos. Espera un momento." },
        { status: 429 }
      );
    }

    const cuerpo = (await req.json().catch(() => null)) as {
      key?: string;
      filename?: string;
      size?: number;
      mime?: string;
    } | null;

    if (!cuerpo?.key || !cuerpo.filename) {
      return NextResponse.json({ error: "Petición incompleta." }, { status: 400 });
    }

    // El campo tiene que existir en ESTE formulario y ser de tipo archivo.
    const campo = formulario.campos.find(
      (c) => c.key === cuerpo.key && c.tipo === "archivo"
    );
    if (!campo) {
      return NextResponse.json(
        { error: "Ese campo no admite archivos." },
        { status: 400 }
      );
    }

    const maxMb = Math.min(campo.maxMb ?? MAX_MB_ARCHIVO, MAX_MB_ARCHIVO);
    if (typeof cuerpo.size === "number" && cuerpo.size > maxMb * 1024 * 1024) {
      return NextResponse.json(
        { error: `El archivo supera el límite de ${maxMb} MB.` },
        { status: 400 }
      );
    }

    const admitidas = campo.acepta?.length
      ? campo.acepta
      : EXTENSIONES_ARCHIVO_DEFAULT;
    const ext = extension(cuerpo.filename);
    if (!admitidas.includes(ext)) {
      return NextResponse.json(
        { error: `Formato no admitido. Usa ${admitidas.join(", ")}.` },
        { status: 400 }
      );
    }

    if (cuerpo.mime && !MIME_ARCHIVO_PERMITIDOS.includes(cuerpo.mime)) {
      return NextResponse.json(
        { error: "Ese tipo de archivo no se admite." },
        { status: 400 }
      );
    }

    // La ruta la decide el servidor. Del nombre del cliente solo se conserva
    // un sufijo saneado, para que el panel muestre algo reconocible.
    const nombreSeguro = cuerpo.filename
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(-80);
    const ruta = `${slug}/${randomUUID()}_${nombreSeguro}`;

    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(ruta);

    if (error || !data) {
      console.error("[formularios] no se pudo firmar la subida:", error?.message);
      return NextResponse.json(
        { error: "No se pudo preparar la subida. Intenta de nuevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ruta: data.path,
      token: data.token,
      bucket: BUCKET,
    });
  } catch (e) {
    console.error(`[formularios] excepción firmando subida en "${slug}":`, e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
