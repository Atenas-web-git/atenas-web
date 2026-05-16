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

// ─── Contacto — canales de comunicación ───────────────────────

export type TelefonoContacto = {
  /** Etiqueta del teléfono (ej. "Admisiones", "Marketing"). */
  label: string;
  /** Número en formato internacional (ej. "+593 99 762 2994"). */
  numero: string;
  /** Extensión opcional. Vacío si no aplica. */
  extension: string;
  /** Si este número también recibe WhatsApp. */
  esWhatsApp: boolean;
};

export type EmailContacto = {
  /** Etiqueta del email (ej. "Admisiones", "Información general"). */
  label: string;
  /** Email institucional. */
  email: string;
};

export type RedesSociales = {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  x: string;
  linkedin: string;
};

export type WhatsAppConfig = {
  /** Número sin signos ni espacios, formato `593997622994` (lo usa wa.me/). */
  numero: string;
  /** Mensaje pre-llenado al abrir WhatsApp. */
  mensaje: string;
  /** Si está activo el FloatingBoot de WhatsApp en el sitio público. */
  activo: boolean;
};

export type Contacto = {
  telefonos: TelefonoContacto[];
  emails: EmailContacto[];
  redes: RedesSociales;
  whatsapp: WhatsAppConfig;
  /** Horario de atención mostrado en footer / contacto (ej. "07:00 — 17:00 L–V"). */
  horario: string;
};

export const CONTACTO_DEFAULT: Contacto = {
  telefonos: [
    { label: "Marketing / Redes sociales", numero: "+593 98 256 1737", extension: "", esWhatsApp: false },
    { label: "Admisiones", numero: "+593 99 762 2994", extension: "", esWhatsApp: true },
    { label: "Secretaría / Recepción", numero: "+593 3 2854281", extension: "100", esWhatsApp: false },
  ],
  emails: [
    { label: "Información general", email: "atenas@atenas.edu.ec" },
    { label: "Admisiones", email: "admisiones@atenas.edu.ec" },
    { label: "Marketing / Redes", email: "redessociales@atenas.edu.ec" },
  ],
  redes: {
    facebook: "https://www.facebook.com/atenasambato",
    instagram: "https://www.instagram.com/ueatenas.ambato",
    youtube: "https://www.youtube.com/@UnidadEducativaAtenasOficial",
    tiktok: "",
    x: "",
    linkedin: "",
  },
  whatsapp: {
    numero: "593997622994",
    mensaje: "Hola, me gustaría recibir información sobre la Unidad Educativa Atenas.",
    activo: true,
  },
  horario: "07:00 — 17:00 (Lunes a Viernes)",
};

export function mergeContacto(input: Partial<Contacto> | null): Contacto {
  if (!input) return CONTACTO_DEFAULT;
  return {
    telefonos:
      Array.isArray(input.telefonos) && input.telefonos.length > 0
        ? input.telefonos
        : CONTACTO_DEFAULT.telefonos,
    emails:
      Array.isArray(input.emails) && input.emails.length > 0
        ? input.emails
        : CONTACTO_DEFAULT.emails,
    redes: { ...CONTACTO_DEFAULT.redes, ...(input.redes ?? {}) },
    whatsapp: { ...CONTACTO_DEFAULT.whatsapp, ...(input.whatsapp ?? {}) },
    horario: input.horario?.trim() || CONTACTO_DEFAULT.horario,
  };
}

// ─── Integraciones — claves API de terceros ───────────────────

export type Integraciones = {
  /** Google Tag Manager Container ID (ej. "GTM-XXXXXXX"). */
  gtmId: string;
  /** Google Analytics 4 Measurement ID (ej. "G-XXXXXXX"). */
  ga4Id: string;
  /** Facebook Pixel ID (numérico, 15-16 dígitos). */
  facebookPixel: string;
  /** TikTok Pixel ID (ej. "CXXXXXXXXXXXXXXXXXXX"). */
  tiktokPixel: string;
  /** URL completa de Calendly del colegio (ej. https://calendly.com/atenas/visita). */
  calendlyUrl: string;
  /** Valor del meta tag de verificación de propiedad de Meta/Facebook. */
  metaVerify: string;
  /** Valor del meta tag de verificación de Google Search Console. */
  googleVerify: string;
};

export const INTEGRACIONES_DEFAULT: Integraciones = {
  gtmId: "",
  ga4Id: "",
  facebookPixel: "",
  tiktokPixel: "",
  calendlyUrl: "",
  metaVerify: "",
  googleVerify: "",
};

export function mergeIntegraciones(input: Partial<Integraciones> | null): Integraciones {
  if (!input) return INTEGRACIONES_DEFAULT;
  return { ...INTEGRACIONES_DEFAULT, ...input };
}

// ─── SEO defaults globales ────────────────────────────────────

export type Seo = {
  /** Title cuando la página NO tiene meta_title propio. */
  titleDefault: string;
  /** Template para páginas con meta_title propio. Usa "%s" como placeholder. */
  titleTemplate: string;
  /** Description default cuando la página no tiene meta_description propio. */
  description: string;
  /** Keywords (separadas por coma, formato libre). */
  keywords: string;
  /** Ruta de la imagen OG default (relativa al dominio, ej. "/opengraph-image"). */
  ogImage: string;
  /** Locale OG (ej. "es_EC", "es_ES"). */
  ogLocale: string;
  /** Nombre del sitio (OG siteName). */
  siteName: string;
  /** Tipo de Twitter card. */
  twitterCard: "summary" | "summary_large_image";
  /** Si los motores de búsqueda deben indexar el sitio. */
  robotsIndex: boolean;
  /** Si los motores deben seguir los links. */
  robotsFollow: boolean;
};

export const SEO_DEFAULT: Seo = {
  titleDefault: "Unidad Educativa Atenas — 50 años formando líderes",
  titleTemplate: "%s | Unidad Educativa Atenas",
  description:
    "Institución educativa de referencia en Ambato, Ecuador. Bachillerato Internacional IB acreditado, certificación ISO 9001 y 50 años formando líderes en Izamba, Tungurahua.",
  keywords:
    "colegio Ambato, Unidad Educativa Atenas, bachillerato IB Ecuador, mejor colegio Ambato, colegio IB Ecuador, colegio Izamba, colegio privado Ambato, bachillerato internacional Ambato, colegio IB Tungurahua, educación inicial Ambato, colegio bilingüe Ambato, inscripciones colegio Ambato, ISO 9001 educación Ecuador",
  ogImage: "/opengraph-image",
  ogLocale: "es_EC",
  siteName: "Unidad Educativa Atenas",
  twitterCard: "summary_large_image",
  robotsIndex: true,
  robotsFollow: true,
};

export function mergeSeo(input: Partial<Seo> | null): Seo {
  if (!input) return SEO_DEFAULT;
  const twitter: Seo["twitterCard"] =
    input.twitterCard === "summary" || input.twitterCard === "summary_large_image"
      ? input.twitterCard
      : SEO_DEFAULT.twitterCard;
  return {
    titleDefault: input.titleDefault?.trim() || SEO_DEFAULT.titleDefault,
    titleTemplate: input.titleTemplate?.trim() || SEO_DEFAULT.titleTemplate,
    description: input.description?.trim() || SEO_DEFAULT.description,
    keywords: input.keywords?.trim() || SEO_DEFAULT.keywords,
    ogImage: input.ogImage?.trim() || SEO_DEFAULT.ogImage,
    ogLocale: input.ogLocale?.trim() || SEO_DEFAULT.ogLocale,
    siteName: input.siteName?.trim() || SEO_DEFAULT.siteName,
    twitterCard: twitter,
    robotsIndex: typeof input.robotsIndex === "boolean" ? input.robotsIndex : SEO_DEFAULT.robotsIndex,
    robotsFollow: typeof input.robotsFollow === "boolean" ? input.robotsFollow : SEO_DEFAULT.robotsFollow,
  };
}

// ─── Mega-menú (configuración global del panel desplegable) ────────
export type MegaMenuConfig = {
  /** Imagen de fondo del panel izquierdo del mega-menú desplegado. */
  bgImage: string;
  /** Línea de texto bajo el logo del panel izquierdo (multi-línea con \n). */
  tagline: string;
};

export const MEGA_MENU_DEFAULT: MegaMenuConfig = {
  bgImage: "/images/00_politicas-de-seguridad-1536x864.jpg",
  tagline: "50 años formando líderes\ncon valores y excelencia.",
};

export function mergeMegaMenu(input: Partial<MegaMenuConfig> | null): MegaMenuConfig {
  if (!input) return MEGA_MENU_DEFAULT;
  return {
    bgImage: input.bgImage?.trim() || MEGA_MENU_DEFAULT.bgImage,
    tagline: input.tagline?.trim() || MEGA_MENU_DEFAULT.tagline,
  };
}

// ─── Gestor de correos (provider + presets) ────────────────────
// Movido a `@/lib/cms/correos` para que los client components puedan
// importar los tipos sin arrastrar `next/headers`. Se re-exporta acá
// para mantener compatibilidad con código que ya importa desde este
// archivo (servidor) — pero las nuevas referencias deberían usar
// `@/lib/cms/correos` directamente.
export {
  CORREO_PURPOSES,
  CORREO_PURPOSE_LABELS,
  CORREOS_DEFAULT,
  mergeCorreos,
} from "./correos";
export type {
  CorreoPurpose,
  CorreoPreset,
  ResendConfig,
  SmtpConfig,
  CorreosConfig,
} from "./correos";
