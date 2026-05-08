"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type CronogramaActionState = { error: string | null; ok: boolean };

const COLORES_VALIDOS = ["gold", "red", "teal", "navy", "purple"] as const;
type ColorPeriodo = (typeof COLORES_VALIDOS)[number];

const SLUG_REGEX = /^[a-z0-9-]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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
  revalidatePath("/admin/contenido/cronograma");
  revalidatePath("/admin/contenido/cronograma/tipos");
  revalidatePath("/admin/contenido/cronograma/periodos");
  revalidatePath("/cronograma-anual");
}

// ───────────────────────────────────────────────────────────
// TIPOS
// ───────────────────────────────────────────────────────────

export async function guardarTipoAction(
  _prev: CronogramaActionState,
  formData: FormData
): Promise<CronogramaActionState> {
  await assertEditor();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const nombre = String(formData.get("nombre") ?? "").trim();

  if (!slug) return { error: "El slug es obligatorio.", ok: false };
  if (!SLUG_REGEX.test(slug))
    return { error: "Slug inválido. Usa solo minúsculas, números y guiones.", ok: false };
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };

  const supabase = createAdminClient();

  if (id) {
    // Update: NO tocamos `orden` (eso se mueve con las flechas del listado)
    const { error } = await supabase
      .from("cronograma_tipos")
      .update({ slug, nombre })
      .eq("id", id);
    if (error) {
      if (error.code === "23505")
        return { error: "Ya existe un tipo con ese slug.", ok: false };
      return { error: error.message, ok: false };
    }
  } else {
    // Insert: auto-orden = max(orden) + 10
    const { data: maxRow } = await supabase
      .from("cronograma_tipos")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrden = (maxRow?.orden ?? 0) + 10;

    const { error } = await supabase
      .from("cronograma_tipos")
      .insert({ slug, nombre, orden: nextOrden });
    if (error) {
      if (error.code === "23505")
        return { error: "Ya existe un tipo con ese slug.", ok: false };
      return { error: error.message, ok: false };
    }
  }

  revalidatePublic();
  return { error: null, ok: true };
}

export async function reordenarTipoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  const direccion = String(formData.get("direccion") ?? "");
  if (!id || (direccion !== "up" && direccion !== "down")) return;

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cronograma_tipos")
    .select("id, orden")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  // Buscar vecino inmediato: para "up" el de orden menor más cercano,
  // para "down" el de orden mayor más cercano.
  const vecinoQuery =
    direccion === "up"
      ? supabase
          .from("cronograma_tipos")
          .select("id, orden")
          .lt("orden", current.orden)
          .order("orden", { ascending: false })
      : supabase
          .from("cronograma_tipos")
          .select("id, orden")
          .gt("orden", current.orden)
          .order("orden", { ascending: true });

  const { data: vecino } = await vecinoQuery.limit(1).maybeSingle();
  if (!vecino) return;

  await supabase
    .from("cronograma_tipos")
    .update({ orden: vecino.orden })
    .eq("id", current.id);
  await supabase
    .from("cronograma_tipos")
    .update({ orden: current.orden })
    .eq("id", vecino.id);

  revalidatePublic();
}

export async function eliminarTipoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  if (!id) return;
  const supabase = createAdminClient();
  const { error } = await supabase.from("cronograma_tipos").delete().eq("id", id);
  // 23503 = FK constraint: el tipo tiene eventos asociados
  if (error && error.code !== "23503") throw new Error(error.message);
  revalidatePublic();
}

// ───────────────────────────────────────────────────────────
// PERÍODOS
// ───────────────────────────────────────────────────────────

export async function guardarPeriodoAction(
  _prev: CronogramaActionState,
  formData: FormData
): Promise<CronogramaActionState> {
  await assertEditor();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const colorRaw = String(formData.get("color") ?? "navy").trim();
  const anoLectivo = String(formData.get("ano_lectivo_codigo") ?? "").trim();

  if (!slug) return { error: "El slug es obligatorio.", ok: false };
  if (!SLUG_REGEX.test(slug))
    return { error: "Slug inválido. Usa solo minúsculas, números y guiones.", ok: false };
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };
  const color = COLORES_VALIDOS.includes(colorRaw as ColorPeriodo)
    ? (colorRaw as ColorPeriodo)
    : "navy";

  const supabase = createAdminClient();

  if (id) {
    // Update: NO tocamos `orden` (eso se mueve con las flechas del listado)
    const { error } = await supabase
      .from("cronograma_periodos")
      .update({
        slug,
        nombre,
        color,
        ano_lectivo_codigo: anoLectivo || null,
      })
      .eq("id", id);
    if (error) {
      if (error.code === "23505")
        return { error: "Ya existe un período con ese slug.", ok: false };
      return { error: error.message, ok: false };
    }
  } else {
    // Insert: auto-orden = max(orden) + 10
    const { data: maxRow } = await supabase
      .from("cronograma_periodos")
      .select("orden")
      .order("orden", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrden = (maxRow?.orden ?? 0) + 10;

    const { error } = await supabase
      .from("cronograma_periodos")
      .insert({
        slug,
        nombre,
        color,
        ano_lectivo_codigo: anoLectivo || null,
        orden: nextOrden,
      });
    if (error) {
      if (error.code === "23505")
        return { error: "Ya existe un período con ese slug.", ok: false };
      return { error: error.message, ok: false };
    }
  }

  revalidatePublic();
  return { error: null, ok: true };
}

export async function reordenarPeriodoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  const direccion = String(formData.get("direccion") ?? "");
  if (!id || (direccion !== "up" && direccion !== "down")) return;

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("cronograma_periodos")
    .select("id, orden")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  const vecinoQuery =
    direccion === "up"
      ? supabase
          .from("cronograma_periodos")
          .select("id, orden")
          .lt("orden", current.orden)
          .order("orden", { ascending: false })
      : supabase
          .from("cronograma_periodos")
          .select("id, orden")
          .gt("orden", current.orden)
          .order("orden", { ascending: true });

  const { data: vecino } = await vecinoQuery.limit(1).maybeSingle();
  if (!vecino) return;

  await supabase
    .from("cronograma_periodos")
    .update({ orden: vecino.orden })
    .eq("id", current.id);
  await supabase
    .from("cronograma_periodos")
    .update({ orden: current.orden })
    .eq("id", vecino.id);

  revalidatePublic();
}

export async function eliminarPeriodoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  if (!id) return;
  const supabase = createAdminClient();
  const { error } = await supabase.from("cronograma_periodos").delete().eq("id", id);
  if (error && error.code !== "23503") throw new Error(error.message);
  revalidatePublic();
}

// ───────────────────────────────────────────────────────────
// EVENTOS
// ───────────────────────────────────────────────────────────

function parseEventoForm(formData: FormData): {
  ok: false;
  error: string;
} | {
  ok: true;
  data: {
    titulo: string;
    descripcion: string | null;
    periodo_id: number;
    tipo_id: number;
    fecha_inicio: string;
    fecha_fin: string | null;
    publicado: boolean;
  };
} {
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const periodoId = Number(formData.get("periodo_id") ?? 0);
  const tipoId = Number(formData.get("tipo_id") ?? 0);
  const fechaInicio = String(formData.get("fecha_inicio") ?? "").trim();
  const fechaFin = String(formData.get("fecha_fin") ?? "").trim();
  const publicado = formData.get("publicado") === "on";

  if (!titulo) return { ok: false, error: "El título es obligatorio." };
  if (!periodoId) return { ok: false, error: "Selecciona un período." };
  if (!tipoId) return { ok: false, error: "Selecciona un tipo de evento." };
  if (!fechaInicio || !DATE_REGEX.test(fechaInicio))
    return { ok: false, error: "La fecha de inicio es obligatoria (formato AAAA-MM-DD)." };
  if (fechaFin && !DATE_REGEX.test(fechaFin))
    return { ok: false, error: "La fecha de fin tiene formato inválido (AAAA-MM-DD)." };
  if (fechaFin && fechaFin < fechaInicio)
    return { ok: false, error: "La fecha de fin debe ser igual o posterior a la de inicio." };

  return {
    ok: true,
    data: {
      titulo,
      descripcion: descripcion || null,
      periodo_id: periodoId,
      tipo_id: tipoId,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin || null,
      publicado,
    },
  };
}

export async function crearEventoAction(
  _prev: CronogramaActionState,
  formData: FormData
): Promise<CronogramaActionState> {
  const user = await assertEditor();
  const parsed = parseEventoForm(formData);
  if (!parsed.ok) return { error: parsed.error, ok: false };

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("cronograma_eventos")
    .insert({ ...parsed.data, subido_por: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "No se pudo crear el evento.", ok: false };
  }

  revalidatePublic();
  redirect(`/admin/contenido/cronograma/${data.id}`);
}

export async function actualizarEventoAction(
  _prev: CronogramaActionState,
  formData: FormData
): Promise<CronogramaActionState> {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  if (!id) return { error: "ID inválido.", ok: false };

  const parsed = parseEventoForm(formData);
  if (!parsed.ok) return { error: parsed.error, ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("cronograma_eventos")
    .update(parsed.data)
    .eq("id", id);

  if (error) return { error: error.message, ok: false };

  revalidatePublic();
  return { error: null, ok: true };
}

export async function eliminarEventoAction(formData: FormData) {
  await assertEditor();
  const id = Number(formData.get("id") ?? 0);
  if (!id) return;

  const supabase = createAdminClient();
  await supabase.from("cronograma_eventos").delete().eq("id", id);
  revalidatePublic();
  redirect("/admin/contenido/cronograma");
}

// ───────────────────────────────────────────────────────────
// HERO
// ───────────────────────────────────────────────────────────

export async function guardarHeroCronogramaAction(
  _prev: CronogramaActionState,
  formData: FormData
): Promise<CronogramaActionState> {
  const user = await assertEditor();

  const badge = String(formData.get("badge") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const ghostText = String(formData.get("ghostText") ?? "").trim();
  const footnote = String(formData.get("footnote") ?? "").trim();
  const bgImageSrc = String(formData.get("bgImageSrc") ?? "").trim();

  if (!title) return { error: "El título es obligatorio.", ok: false };

  const value = {
    badge: badge || null,
    title,
    subtitle: subtitle || null,
    ghostText: ghostText || null,
    footnote: footnote || null,
    bgImageSrc: bgImageSrc || null,
  };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("configuracion_global")
    .upsert(
      {
        key: "cronograma_pagina_hero",
        value,
        descripcion:
          "Hero (cabecera) de la página pública /cronograma-anual.",
        updated_by: user.id,
      },
      { onConflict: "key" }
    );

  if (error) return { error: "No se pudo guardar.", ok: false };

  revalidatePath("/admin/contenido/cronograma/hero");
  revalidatePath("/cronograma-anual");
  return { error: null, ok: true };
}
