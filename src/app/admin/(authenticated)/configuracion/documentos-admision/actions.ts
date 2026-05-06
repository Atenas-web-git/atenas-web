"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type DocActionState = { error: string | null; ok: boolean };

async function assertEditor() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function createDocumentoAction(
  _prev: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  const user = await assertEditor();

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return { error: "El nombre del documento es obligatorio.", ok: false };
  if (nombre.length > 120) return { error: "El nombre es demasiado largo (máx. 120).", ok: false };

  const supabase = createAdminClient();

  // Calcular el siguiente orden (max + 1)
  const { data: max } = await supabase
    .from("documentos_admision_catalogo")
    .select("orden")
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();

  const siguienteOrden = (max?.orden ?? 0) + 1;

  const { error } = await supabase.from("documentos_admision_catalogo").insert({
    nombre,
    orden: siguienteOrden,
    activo: true,
    updated_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un documento con ese nombre.", ok: false };
    }
    return { error: "No se pudo crear el documento.", ok: false };
  }

  revalidatePath("/admin/configuracion/documentos-admision");
  return { error: null, ok: true };
}

export async function updateDocumentoAction(
  _prev: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const orden = parseInt(String(formData.get("orden") ?? "0"), 10) || 0;
  const activo = formData.get("activo") === "on";

  if (!id) return { error: "ID inválido.", ok: false };
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("documentos_admision_catalogo")
    .update({
      nombre,
      orden,
      activo,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe otro documento con ese nombre.", ok: false };
    }
    return { error: "No se pudo actualizar.", ok: false };
  }

  revalidatePath("/admin/configuracion/documentos-admision");
  return { error: null, ok: true };
}

export async function deleteDocumentoAction(
  _prev: DocActionState,
  formData: FormData
): Promise<DocActionState> {
  await assertEditor();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("documentos_admision_catalogo")
    .delete()
    .eq("id", id);

  if (error) return { error: "No se pudo eliminar.", ok: false };

  revalidatePath("/admin/configuracion/documentos-admision");
  return { error: null, ok: true };
}
