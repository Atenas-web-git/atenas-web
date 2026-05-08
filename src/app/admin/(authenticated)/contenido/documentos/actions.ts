"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type DocumentoActionState = { error: string | null; ok: boolean };

const COLORES_VALIDOS = ["gold", "red", "teal", "navy", "purple"] as const;
type ColorCategoria = (typeof COLORES_VALIDOS)[number];

const SLUG_REGEX = /^[a-z0-9-]+$/;

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

function revalidatePublic() {
  revalidatePath("/admin/contenido/documentos");
  revalidatePath("/admin/contenido/documentos/categorias");
  revalidatePath("/documentos-institucionales");
}

// ───────────────────────────────────────────────────────────
// CATEGORÍAS
// ───────────────────────────────────────────────────────────

export async function guardarCategoriaAction(
  _prev: DocumentoActionState,
  formData: FormData
): Promise<DocumentoActionState> {
  await assertEditor();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const icono = String(formData.get("icono") ?? "").trim();
  const colorRaw = String(formData.get("color") ?? "gold").trim();
  const ordenRaw = String(formData.get("orden") ?? "0").trim();

  if (!slug) return { error: "El slug es obligatorio.", ok: false };
  if (!SLUG_REGEX.test(slug)) {
    return { error: "Slug inválido. Usa solo minúsculas, números y guiones.", ok: false };
  }
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };
  const color = COLORES_VALIDOS.includes(colorRaw as ColorCategoria)
    ? (colorRaw as ColorCategoria)
    : "gold";
  const orden = Number.isFinite(Number(ordenRaw)) ? Number(ordenRaw) : 0;

  const supabase = createAdminClient();

  if (id) {
    const { error } = await supabase
      .from("documentos_categorias")
      .update({ slug, nombre, icono: icono || null, color, orden })
      .eq("id", id);
    if (error) {
      if (error.code === "23505") {
        return { error: "Ya existe una categoría con ese slug.", ok: false };
      }
      return { error: error.message, ok: false };
    }
  } else {
    const { error } = await supabase
      .from("documentos_categorias")
      .insert({ slug, nombre, icono: icono || null, color, orden });
    if (error) {
      if (error.code === "23505") {
        return { error: "Ya existe una categoría con ese slug.", ok: false };
      }
      return { error: error.message, ok: false };
    }
  }

  revalidatePublic();
  return { error: null, ok: true };
}

export async function eliminarCategoriaAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  if (!id) return;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("documentos_categorias")
    .delete()
    .eq("id", id);

  // Si tiene documentos asociados, el ON DELETE RESTRICT lo bloquea con
  // 23503. No lanzamos: el usuario debe primero mover los documentos.
  if (error && error.code !== "23503") {
    throw new Error(error.message);
  }
  revalidatePublic();
}

export async function reordenarCategoriaAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  const direccion = String(formData.get("direccion") ?? "");
  if (!id || (direccion !== "up" && direccion !== "down")) return;

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("documentos_categorias")
    .select("id, orden")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  // Buscar el vecino inmediato: para "up" el de orden menor más cercano,
  // para "down" el de orden mayor más cercano.
  const vecinoQuery =
    direccion === "up"
      ? supabase
          .from("documentos_categorias")
          .select("id, orden")
          .lt("orden", current.orden)
          .order("orden", { ascending: false })
      : supabase
          .from("documentos_categorias")
          .select("id, orden")
          .gt("orden", current.orden)
          .order("orden", { ascending: true });

  const { data: vecino } = await vecinoQuery.limit(1).maybeSingle();
  if (!vecino) return;

  // Intercambio en dos updates (orden tiene UNIQUE? no — pero de todas
  // formas evitamos colisiones temporales escribiendo en orden distinto).
  await supabase
    .from("documentos_categorias")
    .update({ orden: vecino.orden })
    .eq("id", current.id);
  await supabase
    .from("documentos_categorias")
    .update({ orden: current.orden })
    .eq("id", vecino.id);

  revalidatePublic();
}

// ───────────────────────────────────────────────────────────
// DOCUMENTOS
// ───────────────────────────────────────────────────────────

export async function crearDocumentoAction(
  _prev: DocumentoActionState,
  formData: FormData
): Promise<DocumentoActionState> {
  const user = await assertEditor();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const categoriaId = Number(formData.get("categoria_id") ?? 0);
  const driveUrl = String(formData.get("drive_url") ?? "").trim();
  const publicado = formData.get("publicado") === "on";

  if (!titulo) return { error: "El título es obligatorio.", ok: false };
  if (!categoriaId) return { error: "Selecciona una categoría.", ok: false };
  if (!driveUrl) return { error: "El link del documento es obligatorio.", ok: false };

  const supabase = createAdminClient();

  // Auto-orden: max(orden) + 10 dentro de la misma categoría, así
  // los nuevos documentos quedan al final por defecto y el cliente
  // puede reordenarlos con flechas en el listado si quiere otro orden.
  const { data: maxRow } = await supabase
    .from("documentos")
    .select("orden")
    .eq("categoria_id", categoriaId)
    .order("orden", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrden = (maxRow?.orden ?? 0) + 10;

  const { data, error } = await supabase
    .from("documentos")
    .insert({
      titulo,
      descripcion: descripcion || null,
      categoria_id: categoriaId,
      drive_url: driveUrl,
      orden: nextOrden,
      publicado,
      subido_por: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "No se pudo guardar el documento.", ok: false };
  }

  revalidatePublic();
  redirect(`/admin/contenido/documentos/${data.id}`);
}

export async function actualizarDocumentoAction(
  _prev: DocumentoActionState,
  formData: FormData
): Promise<DocumentoActionState> {
  await assertEditor();

  const id = Number(formData.get("id") ?? 0);
  if (!id) return { error: "ID inválido.", ok: false };

  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const categoriaId = Number(formData.get("categoria_id") ?? 0);
  const driveUrl = String(formData.get("drive_url") ?? "").trim();
  const publicado = formData.get("publicado") === "on";

  if (!titulo) return { error: "El título es obligatorio.", ok: false };
  if (!categoriaId) return { error: "Selecciona una categoría.", ok: false };
  if (!driveUrl) return { error: "El link del documento es obligatorio.", ok: false };

  const supabase = createAdminClient();
  // Nota: NO tocamos `orden` en update — eso se maneja desde los
  // botones ↑ ↓ del listado para evitar que el cliente tenga que
  // recordar números en el formulario.
  const { error } = await supabase
    .from("documentos")
    .update({
      titulo,
      descripcion: descripcion || null,
      categoria_id: categoriaId,
      drive_url: driveUrl,
      publicado,
    })
    .eq("id", id);

  if (error) return { error: error.message, ok: false };

  revalidatePublic();
  return { error: null, ok: true };
}

export async function eliminarDocumentoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  if (!id) return;

  const supabase = createAdminClient();
  await supabase.from("documentos").delete().eq("id", id);
  revalidatePublic();
  redirect("/admin/contenido/documentos");
}

export async function togglePublicadoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  const publicado = formData.get("publicado") === "true";
  if (!id) return;

  const supabase = createAdminClient();
  await supabase
    .from("documentos")
    .update({ publicado: !publicado })
    .eq("id", id);
  revalidatePublic();
}

export async function reordenarDocumentoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  const direccion = String(formData.get("direccion") ?? "");
  if (!id || (direccion !== "up" && direccion !== "down")) return;

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("documentos")
    .select("id, orden, categoria_id")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  // Reordena solo dentro de la misma categoría. Buscar vecino inmediato.
  const vecinoQuery =
    direccion === "up"
      ? supabase
          .from("documentos")
          .select("id, orden")
          .eq("categoria_id", current.categoria_id)
          .lt("orden", current.orden)
          .order("orden", { ascending: false })
      : supabase
          .from("documentos")
          .select("id, orden")
          .eq("categoria_id", current.categoria_id)
          .gt("orden", current.orden)
          .order("orden", { ascending: true });

  const { data: vecino } = await vecinoQuery.limit(1).maybeSingle();
  if (!vecino) return;

  await supabase
    .from("documentos")
    .update({ orden: vecino.orden })
    .eq("id", current.id);
  await supabase
    .from("documentos")
    .update({ orden: current.orden })
    .eq("id", vecino.id);

  revalidatePublic();
}
