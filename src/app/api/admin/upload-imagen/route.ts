import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/**
 * POST /api/admin/upload-imagen
 *
 * Sube una imagen al bucket `contenido` de Supabase Storage y registra
 * la entrada en la tabla `imagenes`. Devuelve la URL pública.
 *
 * Form fields esperados:
 * - file: archivo de imagen (max 10MB, formatos JPEG/PNG/WebP/GIF/AVIF)
 * - prefix: opcional, prefijo de path (ej. "paginas/el-atenas-mision/hero")
 * - alt: opcional, texto alternativo
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
    const prefix = String(formData.get("prefix") ?? "general").trim().toLowerCase();
    const alt = String(formData.get("alt") ?? "").trim();

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No se recibió el archivo." }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "El archivo supera el límite de 10 MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Formato no admitido. Usa JPEG, PNG, WebP, GIF o AVIF (recibido: ${file.type || "desconocido"}).`,
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
      console.error("[upload-imagen]", uploadError);
      return NextResponse.json(
        { error: "No se pudo subir el archivo." },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from("contenido")
      .getPublicUrl(storagePath);

    const publicUrl = publicUrlData.publicUrl;

    // Registrar en la tabla `imagenes` para tener catálogo
    await supabase.from("imagenes").insert({
      url: publicUrl,
      storage_path: storagePath,
      alt_text: alt || null,
      tamano_bytes: file.size,
      mime_type: file.type,
      uploaded_by: user.id,
    });

    return NextResponse.json({
      url: publicUrl,
      alt_text: alt || null,
    });
  } catch (err) {
    console.error("[upload-imagen]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
