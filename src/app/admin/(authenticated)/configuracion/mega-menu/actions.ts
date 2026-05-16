"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";

export type MegaMenuActionState = { error: string | null; ok: boolean };

/**
 * Guarda la configuración GLOBAL del mega-menú (imagen de fondo del panel
 * izquierdo y tagline bajo el logo). Vive en `configuracion_global['mega_menu']`
 * (key-value JSONB, mismo patrón que `marca`, `contacto`, `seo`).
 */
export async function actualizarConfigGlobalMegaMenuAction(
  _prev: MegaMenuActionState,
  formData: FormData
): Promise<MegaMenuActionState> {
  await assertSuperadmin();
  const supabase = createAdminClient();

  const bgImage = String(formData.get("bgImage") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();

  const payload = { bgImage, tagline };

  // Upsert por key (PK) en configuracion_global
  const { error } = await supabase
    .from("configuracion_global")
    .upsert(
      { key: "mega_menu", value: payload, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );

  if (error) {
    console.error("[mega-menu config global]:", error);
    return { error: "No se pudo guardar la configuración global.", ok: false };
  }

  revalidatePublic();
  return { error: null, ok: true };
}

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

function revalidatePublic() {
  // El mega-menú aparece en TODO el sitio (root layout lo renderiza).
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion/mega-menu");
}

// ─── Crear ─────────────────────────────────────────────────────

export async function crearItemAction(
  _prev: MegaMenuActionState,
  formData: FormData
): Promise<MegaMenuActionState> {
  await assertSuperadmin();
  const supabase = createAdminClient();

  const parentIdRaw = String(formData.get("parent_id") ?? "").trim();
  const parent_id = parentIdRaw || null;
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim() || null;

  if (!label) return { error: "La etiqueta es obligatoria.", ok: false };

  // Calcular el siguiente orden dentro del mismo grupo.
  const orderQuery = parent_id
    ? supabase.from("menu_items").select("orden").eq("parent_id", parent_id).order("orden", { ascending: false }).limit(1)
    : supabase.from("menu_items").select("orden").is("parent_id", null).order("orden", { ascending: false }).limit(1);
  const { data: last } = await orderQuery.maybeSingle();
  const orden = ((last?.orden as number | undefined) ?? 0) + 10;

  const external = href?.startsWith("http") ?? false;

  const { error } = await supabase.from("menu_items").insert({
    parent_id,
    label,
    href,
    external,
    orden,
    visible: true,
  });

  if (error) {
    console.error("[mega-menu] crear:", error);
    return { error: "No se pudo crear el item.", ok: false };
  }

  revalidatePublic();
  return { error: null, ok: true };
}

// ─── Actualizar ────────────────────────────────────────────────

export async function actualizarItemAction(
  _prev: MegaMenuActionState,
  formData: FormData
): Promise<MegaMenuActionState> {
  await assertSuperadmin();
  const supabase = createAdminClient();

  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const href = String(formData.get("href") ?? "").trim() || null;
  const badge = String(formData.get("badge") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";
  // external lo detectamos automáticamente del href (http/https)
  const external = href?.startsWith("http") ?? false;

  if (!id) return { error: "ID inválido.", ok: false };
  if (!label) return { error: "La etiqueta es obligatoria.", ok: false };

  const { error } = await supabase
    .from("menu_items")
    .update({ label, href, external, badge, visible })
    .eq("id", id);

  if (error) {
    console.error("[mega-menu] actualizar:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePublic();
  return { error: null, ok: true };
}

// ─── Eliminar ──────────────────────────────────────────────────

export async function eliminarItemAction(
  _prev: MegaMenuActionState,
  formData: FormData
): Promise<MegaMenuActionState> {
  await assertSuperadmin();
  const supabase = createAdminClient();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID inválido.", ok: false };

  // CASCADE elimina sub-items automáticamente (FK ON DELETE CASCADE en la tabla).
  const { error } = await supabase.from("menu_items").delete().eq("id", id);

  if (error) {
    console.error("[mega-menu] eliminar:", error);
    return { error: "No se pudo eliminar.", ok: false };
  }

  revalidatePublic();
  return { error: null, ok: true };
}

// ─── Reordenar (↑ / ↓) ─────────────────────────────────────────

export async function reordenarItemAction(
  _prev: MegaMenuActionState,
  formData: FormData
): Promise<MegaMenuActionState> {
  await assertSuperadmin();
  const supabase = createAdminClient();

  const id = String(formData.get("id") ?? "").trim();
  const direccion = String(formData.get("direccion") ?? "") as "up" | "down";

  if (!id) return { error: "ID inválido.", ok: false };
  if (direccion !== "up" && direccion !== "down") {
    return { error: "Dirección inválida.", ok: false };
  }

  // Leer item actual (su orden y su parent_id)
  const { data: current } = await supabase
    .from("menu_items")
    .select("orden, parent_id")
    .eq("id", id)
    .maybeSingle();

  if (!current) return { error: "Item no encontrado.", ok: false };

  // Buscar vecino más cercano en la dirección indicada, dentro del mismo grupo.
  // Patrón #14: queries bifurcadas (sin Infinity como filtro neutro).
  const baseQuery = supabase
    .from("menu_items")
    .select("id, orden")
    .limit(1);

  const filteredQuery =
    current.parent_id === null
      ? baseQuery.is("parent_id", null)
      : baseQuery.eq("parent_id", current.parent_id);

  const orderedQuery =
    direccion === "up"
      ? filteredQuery.lt("orden", current.orden).order("orden", { ascending: false })
      : filteredQuery.gt("orden", current.orden).order("orden", { ascending: true });

  const { data: vecino } = await orderedQuery.maybeSingle();
  if (!vecino) {
    // Ya está en el extremo del grupo — silenciosamente OK.
    return { error: null, ok: true };
  }

  // Intercambiar órdenes
  const { error: e1 } = await supabase
    .from("menu_items")
    .update({ orden: vecino.orden as number })
    .eq("id", id);
  if (e1) {
    console.error("[mega-menu] reordenar 1:", e1);
    return { error: "No se pudo reordenar.", ok: false };
  }
  const { error: e2 } = await supabase
    .from("menu_items")
    .update({ orden: current.orden as number })
    .eq("id", vecino.id as string);
  if (e2) {
    console.error("[mega-menu] reordenar 2:", e2);
    return { error: "No se pudo reordenar.", ok: false };
  }

  revalidatePublic();
  return { error: null, ok: true };
}
