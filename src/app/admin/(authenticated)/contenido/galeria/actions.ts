"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type GaleriaActionState = { error: string | null; ok: boolean };

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [
      ROLES.SUPERADMIN,
      ROLES.EDITOR_COMM,
      ROLES.EDITOR_ACADEMICO,
    ])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function actualizarAltAction(
  _prev: GaleriaActionState,
  formData: FormData
): Promise<GaleriaActionState> {
  await assertEditor();

  const id = String(formData.get("id") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();

  if (!id) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("imagenes")
    .update({ alt_text: alt || null })
    .eq("id", id);

  if (error) return { error: "No se pudo actualizar el texto alternativo.", ok: false };

  revalidatePath("/admin/contenido/galeria");
  return { error: null, ok: true };
}

export async function eliminarImagenAction(
  _prev: GaleriaActionState,
  formData: FormData
): Promise<GaleriaActionState> {
  await assertEditor();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();

  const { data: img, error: readError } = await supabase
    .from("imagenes")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (readError || !img) return { error: "Imagen no encontrada.", ok: false };

  if (img.storage_path) {
    const { error: storageError } = await supabase.storage
      .from("contenido")
      .remove([img.storage_path]);
    if (storageError) {
      console.error("[galeria] storage delete:", storageError);
    }
  }

  const { error: dbError } = await supabase.from("imagenes").delete().eq("id", id);
  if (dbError) return { error: "No se pudo eliminar el registro.", ok: false };

  revalidatePath("/admin/contenido/galeria");
  return { error: null, ok: true };
}
