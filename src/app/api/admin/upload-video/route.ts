import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB — videos de fondo deben ser livianos
const ALLOWED_MIME = ["video/mp4", "video/webm"];

/**
 * POST /api/admin/upload-video
 *
 * Sube un video liviano al bucket `contenido` de Supabase Storage para
 * usarlo como fondo en loop (hero del Home, etc.). Devuelve la URL pública.
 *
 * Límite estricto de 15 MB — un video de fondo debe ser corto, sin audio
 * y comprimido. Formatos: MP4 (H.264) y WebM.
 *
 * Form fields:
 * - file: archivo de video
 * - prefix: opcional, prefijo de path (ej. "paginas/home/hero-video")
 *
 * Solo accesible para roles superadmin, editor_comm o editor_academico.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (
      !user ||
      !hasAnyRole(user, [
        ROLES.SUPERADMIN,
        ROLES.EDITOR_COMM,
        ROLES.EDITOR_ACADEMICO,
      ])
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    const prefix = String(formData.get("prefix") ?? "videos").trim().toLowerCase();

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No se recibió el archivo." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error:
            "El video supera el límite de 15 MB. Para fondos en loop usa un video corto, sin audio y comprimido.",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Formato no admitido. Usa MP4 o WebM (recibido: ${file.type || "desconocido"}).`,
        },
        { status: 400 }
      );
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const safePrefix = prefix.replace(/[^a-zA-Z0-9_/-]/g, "-");
    const storagePath = `${safePrefix}/${Date.now()}_${safeName}`;

    const supabase = createAdminClient();
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from("contenido")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload-video]", uploadError);
      return NextResponse.json(
        { error: "No se pudo subir el video." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("contenido")
      .getPublicUrl(storagePath);

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (err) {
    console.error("[upload-video]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
