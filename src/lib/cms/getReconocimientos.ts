import { createClient } from "@/lib/supabase/server";

// ─── Tipos públicos ────────────────────────────────────────────

export type ReconocimientoCategoria = {
  id: number;
  slug: string;
  nombre: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroGhostText: string;
  heroBgImage: string | null;
  heroFootnote: string | null;
  showcaseHeading: string;
  showcaseCtaText: string;
  logrosHeading: string;
  logrosSubheading: string;
  galeriaTitulo: string;
  galeriaSubtitulo: string;
  metaTitle: string | null;
  metaDescription: string | null;
  orden: number;
  visible: boolean;
};

export type ReconocimientoSubcategoria = {
  id: number;
  categoriaId: number;
  slug: string;
  nombre: string;
  icon: string;
  countValue: string;
  countLabel: string;
  photoSrc: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroGhostText: string;
  heroBgImage: string | null;
  heroFootnote: string | null;
  logrosHeading: string;
  logrosSubheading: string;
  galeriaTitulo: string;
  galeriaSubtitulo: string;
  metaTitle: string | null;
  metaDescription: string | null;
  orden: number;
  visible: boolean;
};

export type ReconocimientoLogro = {
  id: number;
  categoriaId: number;
  subcategoriaId: number | null;
  icon: string;
  titulo: string;
  year: string;
  descripcion: string;
  highlight: boolean;
  orden: number;
  fotos: string[];
};

export type ReconocimientoFotoGaleria = {
  id: number;
  src: string;
  alt: string;
  orden: number;
};

// ─── Lectura pública ───────────────────────────────────────────

function mapCategoria(row: Record<string, unknown>): ReconocimientoCategoria {
  return {
    id: row.id as number,
    slug: row.slug as string,
    nombre: row.nombre as string,
    heroBadge: (row.hero_badge as string) ?? "RECONOCIMIENTOS",
    heroTitle: (row.hero_title as string) ?? "",
    heroSubtitle: (row.hero_subtitle as string) ?? "",
    heroGhostText: (row.hero_ghost_text as string) ?? "",
    heroBgImage: (row.hero_bg_image as string) ?? null,
    heroFootnote: (row.hero_footnote as string) ?? null,
    showcaseHeading: (row.showcase_heading as string) ?? "Por disciplina",
    showcaseCtaText: (row.showcase_cta_text as string) ?? "Ver logros",
    logrosHeading: (row.logros_heading as string) ?? "Logros destacados",
    logrosSubheading: (row.logros_subheading as string) ?? "",
    galeriaTitulo: (row.galeria_titulo as string) ?? "Galería",
    galeriaSubtitulo: (row.galeria_subtitulo as string) ?? "",
    metaTitle: (row.meta_title as string) ?? null,
    metaDescription: (row.meta_description as string) ?? null,
    orden: (row.orden as number) ?? 0,
    visible: Boolean(row.visible),
  };
}

function mapSubcategoria(row: Record<string, unknown>): ReconocimientoSubcategoria {
  return {
    id: row.id as number,
    categoriaId: row.categoria_id as number,
    slug: row.slug as string,
    nombre: row.nombre as string,
    icon: (row.icon as string) ?? "🏆",
    countValue: (row.count_value as string) ?? "0",
    countLabel: (row.count_label as string) ?? "Logros",
    photoSrc: (row.photo_src as string) ?? "",
    heroBadge: (row.hero_badge as string) ?? "",
    heroTitle: (row.hero_title as string) ?? "",
    heroSubtitle: (row.hero_subtitle as string) ?? "",
    heroGhostText: (row.hero_ghost_text as string) ?? "",
    heroBgImage: (row.hero_bg_image as string) ?? null,
    heroFootnote: (row.hero_footnote as string) ?? null,
    logrosHeading: (row.logros_heading as string) ?? "",
    logrosSubheading: (row.logros_subheading as string) ?? "",
    galeriaTitulo: (row.galeria_titulo as string) ?? "",
    galeriaSubtitulo: (row.galeria_subtitulo as string) ?? "",
    metaTitle: (row.meta_title as string) ?? null,
    metaDescription: (row.meta_description as string) ?? null,
    orden: (row.orden as number) ?? 0,
    visible: Boolean(row.visible),
  };
}

function mapLogro(row: Record<string, unknown>, fotos: string[]): ReconocimientoLogro {
  return {
    id: row.id as number,
    categoriaId: row.categoria_id as number,
    subcategoriaId: (row.subcategoria_id as number) ?? null,
    icon: (row.icon as string) ?? "🏆",
    titulo: (row.titulo as string) ?? "",
    year: (row.year as string) ?? "",
    descripcion: (row.descripcion as string) ?? "",
    highlight: Boolean(row.highlight),
    orden: (row.orden as number) ?? 0,
    fotos,
  };
}

/**
 * Lista todas las categorías visibles ordenadas por `orden`.
 * Devuelve [] si Supabase falla o no hay datos.
 */
export async function getCategoriasReconocimientos(): Promise<ReconocimientoCategoria[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reconocimientos_categorias")
      .select("*")
      .eq("visible", true)
      .order("orden", { ascending: true });
    if (error || !data) return [];
    return data.map(mapCategoria);
  } catch {
    return [];
  }
}

/**
 * Lee una categoría por slug. Devuelve null si no existe o no es visible.
 */
export async function getCategoriaReconocimiento(
  slug: string
): Promise<ReconocimientoCategoria | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reconocimientos_categorias")
      .select("*")
      .eq("slug", slug)
      .eq("visible", true)
      .maybeSingle();
    if (error || !data) return null;
    return mapCategoria(data);
  } catch {
    return null;
  }
}

/**
 * Lista las subcategorías visibles de una categoría, ordenadas.
 */
export async function getSubcategoriasReconocimientos(
  categoriaId: number
): Promise<ReconocimientoSubcategoria[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reconocimientos_subcategorias")
      .select("*")
      .eq("categoria_id", categoriaId)
      .eq("visible", true)
      .order("orden", { ascending: true });
    if (error || !data) return [];
    return data.map(mapSubcategoria);
  } catch {
    return [];
  }
}

/**
 * Lee una subcategoría específica por slugs (categoría + subcategoría).
 * Devuelve { categoria, subcategoria } si existe y es visible, o null si no.
 */
export async function getSubcategoriaReconocimiento(
  categoriaSlug: string,
  subcategoriaSlug: string
): Promise<{ categoria: ReconocimientoCategoria; subcategoria: ReconocimientoSubcategoria } | null> {
  const categoria = await getCategoriaReconocimiento(categoriaSlug);
  if (!categoria) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reconocimientos_subcategorias")
      .select("*")
      .eq("categoria_id", categoria.id)
      .eq("slug", subcategoriaSlug)
      .eq("visible", true)
      .maybeSingle();
    if (error || !data) return null;
    return { categoria, subcategoria: mapSubcategoria(data) };
  } catch {
    return null;
  }
}

/**
 * Lista los logros visibles de una categoría (todos o filtrados por
 * subcategoría), con sus fotos pre-cargadas y ordenadas.
 */
export async function getLogrosReconocimientos(opts: {
  categoriaId: number;
  subcategoriaId?: number | null;
  soloHighlight?: boolean;
  limite?: number;
}): Promise<ReconocimientoLogro[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("reconocimientos_logros")
      .select("*")
      .eq("categoria_id", opts.categoriaId)
      .eq("visible", true);

    if (opts.subcategoriaId !== undefined && opts.subcategoriaId !== null) {
      query = query.eq("subcategoria_id", opts.subcategoriaId);
    }
    if (opts.soloHighlight) {
      query = query.eq("highlight", true);
    }

    query = query.order("orden", { ascending: true });
    if (opts.limite) query = query.limit(opts.limite);

    const { data: logros, error } = await query;
    if (error || !logros) return [];

    if (logros.length === 0) return [];

    const ids = logros.map((l) => l.id);
    const { data: fotos } = await supabase
      .from("reconocimientos_logro_fotos")
      .select("logro_id, src, orden")
      .in("logro_id", ids)
      .order("orden", { ascending: true });

    const fotosByLogro = new Map<number, string[]>();
    for (const f of fotos ?? []) {
      const arr = fotosByLogro.get(f.logro_id) ?? [];
      arr.push(f.src);
      fotosByLogro.set(f.logro_id, arr);
    }

    return logros.map((l) => mapLogro(l, fotosByLogro.get(l.id) ?? []));
  } catch {
    return [];
  }
}

/**
 * Lista las fotos de la galería para un scope (categoría o subcategoría).
 */
export async function getGaleriaReconocimientos(
  scope: "categoria" | "subcategoria",
  scopeId: number
): Promise<ReconocimientoFotoGaleria[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reconocimientos_galeria_fotos")
      .select("id, src, alt, orden")
      .eq("scope", scope)
      .eq("scope_id", scopeId)
      .order("orden", { ascending: true });
    if (error || !data) return [];
    return data.map((row) => ({
      id: row.id as number,
      src: (row.src as string) ?? "",
      alt: (row.alt as string) ?? "",
      orden: (row.orden as number) ?? 0,
    }));
  } catch {
    return [];
  }
}
