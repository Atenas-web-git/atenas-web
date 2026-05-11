import { createClient } from "@/lib/supabase/server";

/**
 * Lee una entrada de la tabla `configuracion_global` por su key.
 * Devuelve `null` si la key no existe o si Supabase falla (para que el
 * componente caller pueda usar contenido fallback hardcoded).
 */
export async function getConfiguracion<T = unknown>(
  key: string
): Promise<T | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("configuracion_global")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) return null;
    return data.value as T;
  } catch {
    return null;
  }
}

// ─── Tipos específicos por key ────────────────────────────────

export type FechasMatriculas = {
  ano_lectivo: string;
  etapas: Array<{ etapa: string; rango: string }>;
  cta_texto?: string;
  cta_url?: string;
};

/** Hero editable de la página pública /documentos-institucionales. */
export type DocumentosPaginaHero = {
  badge?: string;
  title: string;
  subtitle?: string;
  ghostText?: string;
  footnote?: string;
  bgImageSrc?: string;
};

/** Hero editable de la página pública /cronograma-anual. */
export type CronogramaPaginaHero = {
  badge?: string;
  title: string;
  subtitle?: string;
  ghostText?: string;
  footnote?: string;
  bgImageSrc?: string;
};

// ─── Marca / identidad visual ─────────────────────────────────

/**
 * Identidad visual editable del sitio. Se guarda en `configuracion_global`
 * con clave `marca` (migración 030) y se inyecta como CSS variables al
 * `<html>` desde el root layout.
 */
export type Marca = {
  logos: {
    /** Logo principal a color (sobre fondo claro — navbar, footer). */
    principal: string;
    /** Variante blanca del logo (sobre fondo oscuro — mega-menú, hero). */
    blanco: string;
    /** Escudo aislado sin tipografía (variante compacta). */
    escudo: string;
    /** Favicon 32×32 o SVG. */
    favicon: string;
    /** OG image por defecto (1200×630). La usan páginas sin og_image_url propio. */
    ogDefault: string;
  };
  paleta: {
    /** Color institucional primario (default #1A2B4A). */
    navy: string;
    /** Acento primario/interactivo (default #9e1915). */
    rojo: string;
    /** Acento conmemorativo 50 años (default #C9A84C). */
    dorado: string;
    /** Fondo de secciones claras (default #F8F5F0). */
    offWhite: string;
    /** Texto sobre fondos claros (default #2C2C2C). */
    dark: string;
  };
  /**
   * Nombre de la familia de Google Fonts usada como fuente principal.
   * Default "Poppins". El servidor incluye el `<link>` correspondiente.
   */
  tipografia: string;
  institucion: {
    nombre: string;
    ruc: string;
    direccion: string;
    /** Año de fundación. Alimenta el JSON-LD del SEO. */
    anioFundacion: number;
  };
};

/** Defaults usados cuando la entrada `marca` aún no existe en BD. */
export const MARCA_DEFAULT: Marca = {
  logos: {
    principal: "",
    blanco: "",
    escudo: "",
    favicon: "",
    ogDefault: "",
  },
  paleta: {
    navy: "#1A2B4A",
    rojo: "#9e1915",
    dorado: "#C9A84C",
    offWhite: "#F8F5F0",
    dark: "#2C2C2C",
  },
  tipografia: "Poppins",
  institucion: {
    nombre: "Unidad Educativa Atenas",
    ruc: "",
    direccion: "Calle Gabriel Román s/n y Av. Pedro Vásconez, Izamba, Ambato",
    anioFundacion: 1976,
  },
};

/** Mezcla la marca del CMS con los defaults para garantizar todos los campos. */
export function mergeMarca(input: Partial<Marca> | null): Marca {
  if (!input) return MARCA_DEFAULT;
  return {
    logos: { ...MARCA_DEFAULT.logos, ...(input.logos ?? {}) },
    paleta: { ...MARCA_DEFAULT.paleta, ...(input.paleta ?? {}) },
    tipografia: input.tipografia?.trim() || MARCA_DEFAULT.tipografia,
    institucion: { ...MARCA_DEFAULT.institucion, ...(input.institucion ?? {}) },
  };
}
