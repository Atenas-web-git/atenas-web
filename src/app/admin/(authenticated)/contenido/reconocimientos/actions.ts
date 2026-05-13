"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type ReconocimientosActionState = { error: string | null; ok: boolean };

const SLUG_REGEX = /^[a-z0-9-]+$/;

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

function revalidatePublic(slugCategoria?: string, slugSubcategoria?: string) {
  revalidatePath("/admin/contenido/reconocimientos");
  revalidatePath("/reconocimientos");
  if (slugCategoria) {
    revalidatePath(`/reconocimientos/${slugCategoria}`);
    revalidatePath(`/reconocimientos/${slugCategoria}/logros`);
    revalidatePath(`/reconocimientos/${slugCategoria}/galeria`);
    if (slugSubcategoria) {
      revalidatePath(`/reconocimientos/${slugCategoria}/${slugSubcategoria}`);
      revalidatePath(`/reconocimientos/${slugCategoria}/${slugSubcategoria}/galeria`);
    }
  }
}

// ────────────────────────────────────────────────────────────────
// CATEGORÍAS
// ────────────────────────────────────────────────────────────────

export async function guardarCategoriaAction(
  _prev: ReconocimientosActionState,
  formData: FormData
): Promise<ReconocimientosActionState> {
  await assertEditor();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const heroBadge = String(formData.get("heroBadge") ?? "RECONOCIMIENTOS").trim();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const heroGhostText = String(formData.get("heroGhostText") ?? "").trim();
  const heroBgImage = String(formData.get("heroBgImage") ?? "").trim() || null;
  const heroFootnote = String(formData.get("heroFootnote") ?? "").trim() || null;
  const showcaseHeading = String(formData.get("showcaseHeading") ?? "Por disciplina").trim();
  const showcaseCtaText = String(formData.get("showcaseCtaText") ?? "Ver logros").trim();
  const logrosHeading = String(formData.get("logrosHeading") ?? "Logros destacados").trim();
  const logrosSubheading = String(formData.get("logrosSubheading") ?? "").trim();
  const galeriaTitulo = String(formData.get("galeriaTitulo") ?? "Galería").trim();
  const galeriaSubtitulo = String(formData.get("galeriaSubtitulo") ?? "").trim();
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";
  const ordenRaw = String(formData.get("orden") ?? "0").trim();
  const orden = Number.isFinite(Number(ordenRaw)) ? Number(ordenRaw) : 0;

  if (!slug || !SLUG_REGEX.test(slug)) {
    return { error: "Slug inválido (solo minúsculas, números y guiones)", ok: false };
  }
  if (!nombre) return { error: "El nombre es obligatorio", ok: false };
  if (!heroTitle) return { error: "El título del hero es obligatorio", ok: false };

  const supabase = createAdminClient();
  const payload = {
    slug,
    nombre,
    hero_badge: heroBadge,
    hero_title: heroTitle,
    hero_subtitle: heroSubtitle,
    hero_ghost_text: heroGhostText,
    hero_bg_image: heroBgImage,
    hero_footnote: heroFootnote,
    showcase_heading: showcaseHeading,
    showcase_cta_text: showcaseCtaText,
    logros_heading: logrosHeading,
    logros_subheading: logrosSubheading,
    galeria_titulo: galeriaTitulo,
    galeria_subtitulo: galeriaSubtitulo,
    meta_title: metaTitle,
    meta_description: metaDescription,
    visible,
    orden,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    const { error } = await supabase
      .from("reconocimientos_categorias")
      .update(payload)
      .eq("id", id);
    if (error) return { error: `Error al actualizar: ${error.message}`, ok: false };
    revalidatePublic(slug);
    return { error: null, ok: true };
  }

  const { data: inserted, error } = await supabase
    .from("reconocimientos_categorias")
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe una categoría con ese slug", ok: false };
    }
    return { error: `Error al crear: ${error.message}`, ok: false };
  }
  revalidatePublic(slug);
  redirect(`/admin/contenido/reconocimientos/${inserted.id}`);
}

export async function eliminarCategoriaAction(formData: FormData): Promise<void> {
  await assertEditor();
  const id = Number(formData.get("id"));
  if (!id) return;

  const supabase = createAdminClient();
  // Antes de borrar, leer el slug para revalidar
  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("reconocimientos_categorias").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (cat?.slug) revalidatePublic(cat.slug);
  revalidatePath("/admin/contenido/reconocimientos");
  redirect("/admin/contenido/reconocimientos");
}

export async function reordenarCategoriaAction(formData: FormData): Promise<void> {
  await assertEditor();
  const id = Number(formData.get("id"));
  const direccion = String(formData.get("direccion"));
  if (!id || (direccion !== "up" && direccion !== "down")) return;

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("reconocimientos_categorias")
    .select("id, orden")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  const vecinoQuery =
    direccion === "up"
      ? supabase
          .from("reconocimientos_categorias")
          .select("id, orden")
          .lt("orden", current.orden)
          .order("orden", { ascending: false })
      : supabase
          .from("reconocimientos_categorias")
          .select("id, orden")
          .gt("orden", current.orden)
          .order("orden", { ascending: true });
  const { data: vecino } = await vecinoQuery.limit(1).maybeSingle();
  if (!vecino) return;

  await supabase.from("reconocimientos_categorias").update({ orden: vecino.orden }).eq("id", current.id);
  await supabase.from("reconocimientos_categorias").update({ orden: current.orden }).eq("id", vecino.id);

  revalidatePath("/admin/contenido/reconocimientos");
  revalidatePath("/reconocimientos");
}

// ────────────────────────────────────────────────────────────────
// SUBCATEGORÍAS
// ────────────────────────────────────────────────────────────────

export async function guardarSubcategoriaAction(
  _prev: ReconocimientosActionState,
  formData: FormData
): Promise<ReconocimientosActionState> {
  await assertEditor();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const categoriaId = Number(formData.get("categoriaId"));
  if (!categoriaId) return { error: "Falta categoría", ok: false };

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const icon = String(formData.get("icon") ?? "🏆").trim();
  const countValue = String(formData.get("countValue") ?? "0").trim();
  const countLabel = String(formData.get("countLabel") ?? "Logros").trim();
  const photoSrc = String(formData.get("photoSrc") ?? "").trim();
  const heroBadge = String(formData.get("heroBadge") ?? "").trim();
  const heroTitle = String(formData.get("heroTitle") ?? "").trim();
  const heroSubtitle = String(formData.get("heroSubtitle") ?? "").trim();
  const heroGhostText = String(formData.get("heroGhostText") ?? "").trim();
  const heroBgImage = String(formData.get("heroBgImage") ?? "").trim() || null;
  const heroFootnote = String(formData.get("heroFootnote") ?? "").trim() || null;
  const logrosHeading = String(formData.get("logrosHeading") ?? "").trim();
  const logrosSubheading = String(formData.get("logrosSubheading") ?? "").trim();
  const galeriaTitulo = String(formData.get("galeriaTitulo") ?? "").trim();
  const galeriaSubtitulo = String(formData.get("galeriaSubtitulo") ?? "").trim();
  const metaTitle = String(formData.get("metaTitle") ?? "").trim() || null;
  const metaDescription = String(formData.get("metaDescription") ?? "").trim() || null;
  const visible = formData.get("visible") === "on";
  const ordenRaw = String(formData.get("orden") ?? "0").trim();
  const orden = Number.isFinite(Number(ordenRaw)) ? Number(ordenRaw) : 0;

  if (!slug || !SLUG_REGEX.test(slug)) {
    return { error: "Slug inválido (solo minúsculas, números y guiones)", ok: false };
  }
  if (!nombre) return { error: "El nombre es obligatorio", ok: false };

  const supabase = createAdminClient();
  const payload = {
    categoria_id: categoriaId,
    slug,
    nombre,
    icon,
    count_value: countValue,
    count_label: countLabel,
    photo_src: photoSrc,
    hero_badge: heroBadge,
    hero_title: heroTitle,
    hero_subtitle: heroSubtitle,
    hero_ghost_text: heroGhostText,
    hero_bg_image: heroBgImage,
    hero_footnote: heroFootnote,
    logros_heading: logrosHeading,
    logros_subheading: logrosSubheading,
    galeria_titulo: galeriaTitulo,
    galeria_subtitulo: galeriaSubtitulo,
    meta_title: metaTitle,
    meta_description: metaDescription,
    visible,
    orden,
    updated_at: new Date().toISOString(),
  };

  // Para revalidar
  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", categoriaId)
    .maybeSingle();

  if (id) {
    const { error } = await supabase
      .from("reconocimientos_subcategorias")
      .update(payload)
      .eq("id", id);
    if (error) {
      if (error.code === "23505") return { error: "Ya existe una subcategoría con ese slug en esta categoría", ok: false };
      return { error: `Error al actualizar: ${error.message}`, ok: false };
    }
    if (cat?.slug) revalidatePublic(cat.slug, slug);
    return { error: null, ok: true };
  }

  const { data: inserted, error } = await supabase
    .from("reconocimientos_subcategorias")
    .insert(payload)
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return { error: "Ya existe una subcategoría con ese slug en esta categoría", ok: false };
    return { error: `Error al crear: ${error.message}`, ok: false };
  }
  if (cat?.slug) revalidatePublic(cat.slug, slug);
  redirect(`/admin/contenido/reconocimientos/${categoriaId}/subcategorias/${inserted.id}`);
}

export async function eliminarSubcategoriaAction(formData: FormData): Promise<void> {
  await assertEditor();
  const id = Number(formData.get("id"));
  const categoriaId = Number(formData.get("categoriaId"));
  if (!id || !categoriaId) return;

  const supabase = createAdminClient();
  const { data: sub } = await supabase
    .from("reconocimientos_subcategorias")
    .select("slug, categoria_id")
    .eq("id", id)
    .maybeSingle();
  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", categoriaId)
    .maybeSingle();

  const { error } = await supabase.from("reconocimientos_subcategorias").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (cat?.slug) revalidatePublic(cat.slug, sub?.slug);
  redirect(`/admin/contenido/reconocimientos/${categoriaId}`);
}

export async function reordenarSubcategoriaAction(formData: FormData): Promise<void> {
  await assertEditor();
  const id = Number(formData.get("id"));
  const direccion = String(formData.get("direccion"));
  if (!id || (direccion !== "up" && direccion !== "down")) return;

  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("reconocimientos_subcategorias")
    .select("id, orden, categoria_id")
    .eq("id", id)
    .maybeSingle();
  if (!current) return;

  const vecinoQuery =
    direccion === "up"
      ? supabase
          .from("reconocimientos_subcategorias")
          .select("id, orden")
          .eq("categoria_id", current.categoria_id)
          .lt("orden", current.orden)
          .order("orden", { ascending: false })
      : supabase
          .from("reconocimientos_subcategorias")
          .select("id, orden")
          .eq("categoria_id", current.categoria_id)
          .gt("orden", current.orden)
          .order("orden", { ascending: true });
  const { data: vecino } = await vecinoQuery.limit(1).maybeSingle();
  if (!vecino) return;

  await supabase.from("reconocimientos_subcategorias").update({ orden: vecino.orden }).eq("id", current.id);
  await supabase.from("reconocimientos_subcategorias").update({ orden: current.orden }).eq("id", vecino.id);

  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", current.categoria_id)
    .maybeSingle();
  if (cat?.slug) revalidatePublic(cat.slug);
  revalidatePath(`/admin/contenido/reconocimientos/${current.categoria_id}`);
}

// ────────────────────────────────────────────────────────────────
// LOGROS
// ────────────────────────────────────────────────────────────────

export async function guardarLogroAction(
  _prev: ReconocimientosActionState,
  formData: FormData
): Promise<ReconocimientosActionState> {
  await assertEditor();

  const idRaw = formData.get("id");
  const id = idRaw ? Number(idRaw) : null;
  const categoriaId = Number(formData.get("categoriaId"));
  if (!categoriaId) return { error: "Falta categoría", ok: false };

  const subRaw = formData.get("subcategoriaId");
  const subcategoriaId = subRaw && String(subRaw).trim() !== "" ? Number(subRaw) : null;

  const icon = String(formData.get("icon") ?? "🏆").trim();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  const highlight = formData.get("highlight") === "on";
  const visible = formData.get("visible") === "on";
  const ordenRaw = String(formData.get("orden") ?? "0").trim();
  const orden = Number.isFinite(Number(ordenRaw)) ? Number(ordenRaw) : 0;

  // Fotos: campos foto_0, foto_1, ... y foto_alt_N
  const fotos: { src: string; alt: string }[] = [];
  for (let i = 0; i < 30; i++) {
    const src = String(formData.get(`foto_${i}`) ?? "").trim();
    if (src) {
      fotos.push({ src, alt: String(formData.get(`foto_alt_${i}`) ?? "").trim() });
    }
  }

  if (!titulo) return { error: "El título es obligatorio", ok: false };

  const supabase = createAdminClient();
  const payload = {
    categoria_id: categoriaId,
    subcategoria_id: subcategoriaId,
    icon,
    titulo,
    year,
    descripcion,
    highlight,
    visible,
    orden,
    updated_at: new Date().toISOString(),
  };

  let logroId: number;
  if (id) {
    const { error } = await supabase
      .from("reconocimientos_logros")
      .update(payload)
      .eq("id", id);
    if (error) return { error: `Error al actualizar: ${error.message}`, ok: false };
    logroId = id;
  } else {
    const { data: inserted, error } = await supabase
      .from("reconocimientos_logros")
      .insert(payload)
      .select("id")
      .single();
    if (error) return { error: `Error al crear: ${error.message}`, ok: false };
    logroId = inserted.id;
  }

  // Reemplazar las fotos: estrategia simple borrar+insertar (pocas fotos por logro)
  await supabase.from("reconocimientos_logro_fotos").delete().eq("logro_id", logroId);
  if (fotos.length > 0) {
    await supabase.from("reconocimientos_logro_fotos").insert(
      fotos.map((f, i) => ({ logro_id: logroId, src: f.src, alt: f.alt, orden: i + 1 }))
    );
  }

  // Revalidar
  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", categoriaId)
    .maybeSingle();
  let subSlug: string | undefined;
  if (subcategoriaId) {
    const { data: s } = await supabase
      .from("reconocimientos_subcategorias")
      .select("slug")
      .eq("id", subcategoriaId)
      .maybeSingle();
    subSlug = s?.slug;
  }
  if (cat?.slug) revalidatePublic(cat.slug, subSlug);

  if (!id) redirect(`/admin/contenido/reconocimientos/${categoriaId}/logros/${logroId}`);
  return { error: null, ok: true };
}

export async function eliminarLogroAction(formData: FormData): Promise<void> {
  await assertEditor();
  const id = Number(formData.get("id"));
  const categoriaId = Number(formData.get("categoriaId"));
  if (!id || !categoriaId) return;

  const supabase = createAdminClient();
  const { error } = await supabase.from("reconocimientos_logros").delete().eq("id", id);
  if (error) throw new Error(error.message);

  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", categoriaId)
    .maybeSingle();
  if (cat?.slug) revalidatePublic(cat.slug);
  redirect(`/admin/contenido/reconocimientos/${categoriaId}`);
}

// ────────────────────────────────────────────────────────────────
// GALERÍA (categoría o subcategoría)
// ────────────────────────────────────────────────────────────────

export async function actualizarGaleriaAction(
  _prev: ReconocimientosActionState,
  formData: FormData
): Promise<ReconocimientosActionState> {
  await assertEditor();

  const scope = String(formData.get("scope"));
  const scopeId = Number(formData.get("scopeId"));
  const categoriaId = Number(formData.get("categoriaId"));
  if ((scope !== "categoria" && scope !== "subcategoria") || !scopeId) {
    return { error: "Scope inválido", ok: false };
  }

  // Recolectar fotos: campos foto_N + foto_alt_N
  const fotos: { src: string; alt: string }[] = [];
  for (let i = 0; i < 80; i++) {
    const src = String(formData.get(`foto_${i}`) ?? "").trim();
    if (src) {
      fotos.push({ src, alt: String(formData.get(`foto_alt_${i}`) ?? "").trim() });
    }
  }

  const supabase = createAdminClient();
  await supabase
    .from("reconocimientos_galeria_fotos")
    .delete()
    .eq("scope", scope)
    .eq("scope_id", scopeId);

  if (fotos.length > 0) {
    const { error } = await supabase.from("reconocimientos_galeria_fotos").insert(
      fotos.map((f, i) => ({ scope, scope_id: scopeId, src: f.src, alt: f.alt, orden: i + 1 }))
    );
    if (error) return { error: `Error al guardar fotos: ${error.message}`, ok: false };
  }

  // Revalidar
  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("slug")
    .eq("id", categoriaId)
    .maybeSingle();
  let subSlug: string | undefined;
  if (scope === "subcategoria") {
    const { data: s } = await supabase
      .from("reconocimientos_subcategorias")
      .select("slug")
      .eq("id", scopeId)
      .maybeSingle();
    subSlug = s?.slug;
  }
  if (cat?.slug) revalidatePublic(cat.slug, subSlug);

  return { error: null, ok: true };
}
