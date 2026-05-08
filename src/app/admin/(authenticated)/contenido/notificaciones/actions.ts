"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  TIPOS_VALIDOS,
  MODOS_VISUALES_VALIDOS,
  type TipoNotificacion,
  type ModoVisualPopup,
} from "./constants";

export type NotifActionState = { error: string | null; ok: boolean };

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

function parseDate(raw: unknown): string | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;
  // Aceptamos `datetime-local` (YYYY-MM-DDTHH:mm) y lo convertimos a ISO
  const date = new Date(str);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

/** Crea una notificación nueva en estado activo y redirige al editor. */
export async function crearNotificacionAction(
  _prev: NotifActionState,
  formData: FormData
): Promise<NotifActionState> {
  const user = await assertEditor();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "") as TipoNotificacion;

  if (!titulo) return { error: "El título es obligatorio.", ok: false };
  if (!TIPOS_VALIDOS.includes(tipo)) {
    return { error: "Tipo de notificación inválido.", ok: false };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("notificaciones")
    .insert({
      titulo,
      tipo,
      contenido_html: "<p></p>",
      activa: true,
      prioridad: 0,
      fecha_inicio: new Date().toISOString(),
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "No se pudo crear la notificación.", ok: false };
  }

  revalidatePath("/admin/contenido/notificaciones");
  redirect(`/admin/contenido/notificaciones/${data.id}`);
}

/** Guarda los cambios del editor de notificación. */
export async function guardarNotificacionAction(
  _prev: NotifActionState,
  formData: FormData
): Promise<NotifActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const tipo = String(formData.get("tipo") ?? "") as TipoNotificacion;
  const modoVisualRaw = String(formData.get("modo_visual") ?? "plantilla_imagen_texto") as ModoVisualPopup;
  const modoVisual = MODOS_VISUALES_VALIDOS.includes(modoVisualRaw)
    ? modoVisualRaw
    : "plantilla_imagen_texto";
  const contenidoHtml = String(formData.get("contenido_html") ?? "");
  const imagenUrl = String(formData.get("imagen_url") ?? "").trim();
  const ctaTexto = String(formData.get("cta_texto") ?? "").trim();
  const ctaUrl = String(formData.get("cta_url") ?? "").trim();
  const fechaInicio = parseDate(formData.get("fecha_inicio"));
  const fechaFin = parseDate(formData.get("fecha_fin"));
  const prioridad = parseInt(String(formData.get("prioridad") ?? "0"), 10) || 0;
  const activa = formData.get("activa") === "on";

  if (!id) return { error: "ID inválido.", ok: false };
  if (!titulo) return { error: "El título es obligatorio.", ok: false };
  if (!TIPOS_VALIDOS.includes(tipo)) return { error: "Tipo inválido.", ok: false };
  if (!fechaInicio) return { error: "La fecha de inicio es obligatoria.", ok: false };
  if (fechaFin && fechaInicio && new Date(fechaFin) <= new Date(fechaInicio)) {
    return {
      error: "La fecha de fin debe ser posterior a la de inicio.",
      ok: false,
    };
  }
  if ((ctaTexto && !ctaUrl) || (!ctaTexto && ctaUrl)) {
    return {
      error: "Para el CTA debes completar tanto el texto como la URL, o dejar ambos vacíos.",
      ok: false,
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("notificaciones")
    .update({
      titulo,
      tipo,
      modo_visual: modoVisual,
      contenido_html: contenidoHtml,
      imagen_url: imagenUrl || null,
      cta_texto: ctaTexto || null,
      cta_url: ctaUrl || null,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      prioridad,
      activa,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) return { error: "No se pudo guardar.", ok: false };

  revalidatePath("/admin/contenido/notificaciones");
  revalidatePath(`/admin/contenido/notificaciones/${id}`);
  // Revalidar todo el sitio público porque las notificaciones se renderizan en navbar
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function toggleActivaAction(
  _prev: NotifActionState,
  formData: FormData
): Promise<NotifActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "");
  const activa = formData.get("activa") === "on";

  if (!id) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("notificaciones")
    .update({ activa, updated_by: user.id })
    .eq("id", id);

  if (error) return { error: "No se pudo actualizar.", ok: false };

  revalidatePath("/admin/contenido/notificaciones");
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

export async function eliminarNotificacionAction(
  _prev: NotifActionState,
  formData: FormData
): Promise<NotifActionState> {
  await assertEditor();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase.from("notificaciones").delete().eq("id", id);

  if (error) return { error: "No se pudo eliminar.", ok: false };

  revalidatePath("/admin/contenido/notificaciones");
  revalidatePath("/", "layout");
  redirect("/admin/contenido/notificaciones");
}
