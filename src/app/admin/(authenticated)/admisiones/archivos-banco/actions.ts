"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type ArchivosBancoActionState = { error: string | null; ok: boolean };

// 4 MB, no 10: por encima de eso el archivo no llega. Ver el comentario de
// `experimental.serverActions` en next.config.ts.
const MAX_BYTES = 4 * 1024 * 1024;

async function assertAdmisiones() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) {
    throw new Error("No autorizado");
  }
  return user;
}

/**
 * Sube un archivo al bucket `admisiones-adjuntos` bajo `banco/` y lo registra
 * en `admisiones_archivos_banco`. Pensado para PDFs, imágenes, docx que el
 * equipo de admisiones quiere reutilizar entre múltiples solicitudes.
 */
export async function subirArchivoBancoAction(
  _prev: ArchivosBancoActionState,
  formData: FormData
): Promise<ArchivosBancoActionState> {
  const user = await assertAdmisiones();

  const file = formData.get("file") as File | null;
  const nombreInput = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const categoria = String(formData.get("categoria") ?? "").trim() || null;

  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo.", ok: false };
  }
  if (file.size > MAX_BYTES) {
    return { error: "El archivo supera el límite de 10 MB.", ok: false };
  }

  const supabase = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `banco/${Date.now()}_${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("admisiones-adjuntos")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { error: `No se pudo subir el archivo: ${uploadError.message}`, ok: false };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("admisiones-adjuntos")
    .getPublicUrl(storagePath);

  const { error: dbError } = await supabase.from("admisiones_archivos_banco").insert({
    nombre: nombreInput || file.name,
    descripcion: descripcion || null,
    storage_path: storagePath,
    archivo_url: publicUrl,
    tipo_mime: file.type || null,
    tamano_bytes: file.size,
    categoria,
    activo: true,
    orden: 0,
    created_by: user.id,
  });

  if (dbError) {
    await supabase.storage.from("admisiones-adjuntos").remove([storagePath]);
    return { error: `No se pudo registrar: ${dbError.message}`, ok: false };
  }

  revalidatePath("/admin/admisiones/archivos-banco");
  return { error: null, ok: true };
}

/**
 * Actualiza metadatos de un archivo del banco (sin reemplazar el archivo).
 * Para cambiar el archivo en sí, eliminar y volver a subir.
 */
export async function actualizarArchivoBancoAction(
  _prev: ArchivosBancoActionState,
  formData: FormData
): Promise<ArchivosBancoActionState> {
  await assertAdmisiones();

  const id = String(formData.get("id") ?? "");
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim() || null;
  const categoria = String(formData.get("categoria") ?? "").trim() || null;
  const activo = formData.get("activo") === "on";

  if (!id) return { error: "ID inválido.", ok: false };
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("admisiones_archivos_banco")
    .update({
      nombre,
      descripcion,
      categoria,
      activo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: `No se pudo guardar: ${error.message}`, ok: false };
  revalidatePath("/admin/admisiones/archivos-banco");
  return { error: null, ok: true };
}

/**
 * Elimina un archivo del banco. Por CASCADE también borra las asociaciones
 * en `plantillas_correo_archivos` y `solicitud_archivos_banco`.
 */
export async function eliminarArchivoBancoAction(formData: FormData): Promise<void> {
  await assertAdmisiones();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = createAdminClient();
  const { data: archivo } = await supabase
    .from("admisiones_archivos_banco")
    .select("storage_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("admisiones_archivos_banco").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Borrar el archivo físico del bucket
  if (archivo?.storage_path) {
    await supabase.storage.from("admisiones-adjuntos").remove([archivo.storage_path]);
  }

  revalidatePath("/admin/admisiones/archivos-banco");
}
