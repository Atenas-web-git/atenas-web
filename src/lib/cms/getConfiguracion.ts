import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Lee una entrada de la tabla `configuracion_global` por su key.
 * Devuelve `null` si la key no existe o si Supabase falla (para que el
 * componente caller pueda usar contenido fallback hardcoded).
 *
 * Usa la clave anónima, así que solo alcanza las keys que la política RLS
 * expone al público (marca, contacto, footer, navbar, seo, mega_menu…).
 * Para las keys con credenciales — `correos` y `chatbot` — usar
 * `getConfiguracionPrivada()`.
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

/**
 * Igual que `getConfiguracion()`, pero con la service_role key, que salta RLS.
 *
 * Existe para las keys que guardan credenciales (`correos` → contraseña SMTP y
 * API key de Resend; `chatbot` → API key del modelo). Desde la migración 068
 * esas keys NO son legibles con la clave anónima: cualquiera podría pedírselas
 * a PostgREST desde el navegador, porque la clave anónima viaja en el bundle.
 *
 * ⚠️ SOLO desde servidor — route handlers, server actions y server components.
 * Llamarla desde un archivo con "use client" filtraría las credenciales al
 * navegador, que es justo lo que esta función existe para evitar.
 */
export async function getConfiguracionPrivada<T = unknown>(
  key: string
): Promise<T | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("configuracion_global")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      // A diferencia de getConfiguracion(), aquí NO fallamos en silencio: de
      // esta lectura dependen los correos y el chatbot, y sin rastro en los
      // logs un fallo se manifiesta como "los correos dejaron de salir" sin
      // ninguna pista. Causa típica: falta SUPABASE_SERVICE_ROLE_KEY.
      console.error(`[getConfiguracionPrivada] Error leyendo "${key}":`, error.message);
      return null;
    }
    if (!data) return null;
    return data.value as T;
  } catch (e) {
    console.error(`[getConfiguracionPrivada] Excepción leyendo "${key}":`, e);
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
    /** Ciudad y país (ej. "Ambato, Ecuador"). Usado en footer de emails y JSON-LD. */
    ciudad: string;
    /** URL completa del sitio (ej. "https://atenas.edu.ec"). Usado en footer de emails. */
    sitioWeb: string;
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
    ciudad: "Ambato, Ecuador",
    sitioWeb: "https://atenas.edu.ec",
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
export type MegaMenuCtaButton = {
  label: string;
  href: string;
};

// ─── Chatbot IA "Ateneo" ──────────────────────────────────────

export type ChatbotProvider = "gemini" | "anthropic" | "openai";

export type ChatbotConfig = {
  /** Si está activo Y apiKey no vacía, reemplaza al FloatingBoot WhatsApp. */
  activo: boolean;
  /** Proveedor de IA. */
  provider: ChatbotProvider;
  /** Modelo específico del proveedor (ej. "gemini-1.5-flash"). */
  model: string;
  /** API key del proveedor. Vacía = chatbot no operativo. */
  apiKey: string;
  /** System prompt — personalidad y reglas del asistente. */
  systemPrompt: string;
  /** Texto del globo de sugerencia junto al botón flotante. */
  bubbleText: string;
  /** Mensaje inicial al abrir el chat. */
  welcomeMessage: string;
  /** Mensaje cuando el chatbot no tiene respuesta. */
  fallbackMessage: string;
  /** Label del CTA de fallback (ej. "Ir a Contactos"). */
  fallbackCtaLabel: string;
  /** URL del CTA de fallback (ej. "/contactos"). */
  fallbackCtaUrl: string;
  /** Cuántos mensajes pasados se mandan al LLM por turno (control de tokens). */
  maxHistoryMessages: number;
  /**
   * Conocimiento adicional NO publicado en la web. Texto libre (markdown)
   * que se concatena al knowledge base en cada conversación. Útil para
   * FAQ internos, fechas de vacaciones, info administrativa, etc.
   */
  extraKnowledge: string;
};

export const CHATBOT_DEFAULT: ChatbotConfig = {
  activo: false,
  provider: "gemini",
  model: "gemini-1.5-flash",
  apiKey: "",
  systemPrompt:
    'Eres Ateneo, el asistente virtual oficial de la Unidad Educativa Atenas (Ambato, Ecuador). Responde solo sobre el colegio. Tono formal pero cercano, sin emojis, 2-4 oraciones. Si no tienes información, sugiere visitar /contactos.',
  bubbleText: "¿Tienes alguna pregunta sobre Atenas?",
  welcomeMessage:
    "¡Hola! Soy Ateneo, asistente virtual de la Unidad Educativa Atenas. ¿En qué puedo ayudarte?",
  fallbackMessage:
    "No tengo información suficiente para responder eso. Te recomiendo escribirnos desde la página de contactos y un miembro del equipo te ayudará personalmente.",
  fallbackCtaLabel: "Ir a Contactos",
  fallbackCtaUrl: "/contactos",
  maxHistoryMessages: 12,
  extraKnowledge: "",
};

export function mergeChatbot(input: Partial<ChatbotConfig> | null): ChatbotConfig {
  if (!input) return CHATBOT_DEFAULT;
  const validProviders: ChatbotProvider[] = ["gemini", "anthropic", "openai"];
  const provider: ChatbotProvider = validProviders.includes(input.provider as ChatbotProvider)
    ? (input.provider as ChatbotProvider)
    : "gemini";
  return {
    activo: input.activo ?? CHATBOT_DEFAULT.activo,
    provider,
    model: input.model?.trim() || CHATBOT_DEFAULT.model,
    apiKey: input.apiKey ?? "",
    systemPrompt: input.systemPrompt?.trim() || CHATBOT_DEFAULT.systemPrompt,
    bubbleText: input.bubbleText?.trim() || CHATBOT_DEFAULT.bubbleText,
    welcomeMessage: input.welcomeMessage?.trim() || CHATBOT_DEFAULT.welcomeMessage,
    fallbackMessage: input.fallbackMessage?.trim() || CHATBOT_DEFAULT.fallbackMessage,
    fallbackCtaLabel: input.fallbackCtaLabel?.trim() || CHATBOT_DEFAULT.fallbackCtaLabel,
    fallbackCtaUrl: input.fallbackCtaUrl?.trim() || CHATBOT_DEFAULT.fallbackCtaUrl,
    maxHistoryMessages:
      typeof input.maxHistoryMessages === "number" && input.maxHistoryMessages > 0
        ? Math.min(input.maxHistoryMessages, 50)
        : CHATBOT_DEFAULT.maxHistoryMessages,
    extraKnowledge: typeof input.extraKnowledge === "string" ? input.extraKnowledge : "",
  };
}

export function chatbotIsLive(c: ChatbotConfig): boolean {
  return c.activo && c.apiKey.trim().length > 10;
}

// ─── Diseño global de correos transaccionales ─────────────────

/**
 * Identidad común a los 10 correos transaccionales (pipeline admisiones +
 * confirmaciones de formularios). Vive en `configuracion_global['correos_diseno']`
 * (migración 053).
 *
 * El resto del footer (dirección, teléfono, redes, copyright) se deriva
 * automáticamente de Marca + Contacto al renderizar el email.
 */
export type CorreosDiseno = {
  /** Variante del logo en el header del email. */
  logoVariant: "white_on_navy" | "color_on_white";
  /** Texto legal corto al pie del footer. Aplica a los 10 correos. */
  textoLegal: string;
};

export const CORREOS_DISENO_DEFAULT: CorreosDiseno = {
  logoVariant: "white_on_navy",
  textoLegal:
    "Este correo es transaccional y fue enviado por la Unidad Educativa Atenas en respuesta a un trámite o consulta que iniciaste. Si lo recibiste por error, responde a este correo y lo daremos de baja.",
};

export function mergeCorreosDiseno(
  input: Partial<CorreosDiseno> | null
): CorreosDiseno {
  if (!input) return CORREOS_DISENO_DEFAULT;
  const variant = input.logoVariant === "color_on_white" ? "color_on_white" : "white_on_navy";
  return {
    logoVariant: variant,
    textoLegal: input.textoLegal?.trim() || CORREOS_DISENO_DEFAULT.textoLegal,
  };
}

// ─── Navbar (barra de navegación superior) ────────────────────

/**
 * Configuración de la barra de navegación fija que aparece en todas las
 * páginas del sitio público. Vive en `configuracion_global['navbar']`
 * (migración 052). Si la fila no existe o falla, la app usa
 * `NAVBAR_DEFAULT` y la UI mantiene el comportamiento original.
 */
export type NavbarConfig = {
  /** Badge conmemorativo "50 AÑOS" al lado del logo. Si hay logoSrc, lo reemplaza. */
  aniversarioBadge: {
    visible: boolean;
    label: string;
    /** URL del logo conmemorativo. Si está presente, reemplaza el texto del badge. */
    logoSrc: string;
  };
  /** CTA primario al lado izquierdo (default: Portal Familiar). */
  ctaPortal: {
    visible: boolean;
    label: string;
    href: string;
  };
  /** CTA secundario con borde dorado (default: Tour Virtual). */
  ctaTour: {
    visible: boolean;
    label: string;
    href: string;
  };
  /** Icono de búsqueda. Hoy el botón no es funcional; se puede ocultar. */
  busqueda: {
    visible: boolean;
  };
  /** Campanita de notificaciones. Si se oculta, no aparece nunca. */
  campana: {
    visible: boolean;
  };
  /** Label del botón principal "MENÚ" (rojo). */
  menuLabel: string;
};

export const NAVBAR_DEFAULT: NavbarConfig = {
  aniversarioBadge: { visible: true, label: "50 AÑOS", logoSrc: "" },
  ctaPortal: { visible: true, label: "PORTAL FAMILIAR", href: "/portal-familiar" },
  ctaTour: { visible: true, label: "TOUR VIRTUAL", href: "/paseo-virtual" },
  busqueda: { visible: true },
  campana: { visible: true },
  menuLabel: "MENÚ",
};

export function mergeNavbar(input: Partial<NavbarConfig> | null): NavbarConfig {
  if (!input) return NAVBAR_DEFAULT;
  return {
    aniversarioBadge: {
      visible: input.aniversarioBadge?.visible ?? NAVBAR_DEFAULT.aniversarioBadge.visible,
      label:
        input.aniversarioBadge?.label?.trim() ||
        NAVBAR_DEFAULT.aniversarioBadge.label,
      logoSrc: input.aniversarioBadge?.logoSrc?.trim() ?? "",
    },
    ctaPortal: {
      visible: input.ctaPortal?.visible ?? NAVBAR_DEFAULT.ctaPortal.visible,
      label: input.ctaPortal?.label?.trim() || NAVBAR_DEFAULT.ctaPortal.label,
      href: input.ctaPortal?.href?.trim() || NAVBAR_DEFAULT.ctaPortal.href,
    },
    ctaTour: {
      visible: input.ctaTour?.visible ?? NAVBAR_DEFAULT.ctaTour.visible,
      label: input.ctaTour?.label?.trim() || NAVBAR_DEFAULT.ctaTour.label,
      href: input.ctaTour?.href?.trim() || NAVBAR_DEFAULT.ctaTour.href,
    },
    busqueda: {
      visible: input.busqueda?.visible ?? NAVBAR_DEFAULT.busqueda.visible,
    },
    campana: {
      visible: input.campana?.visible ?? NAVBAR_DEFAULT.campana.visible,
    },
    menuLabel: input.menuLabel?.trim() || NAVBAR_DEFAULT.menuLabel,
  };
}

export type MegaMenuConfig = {
  /** Imagen de fondo del panel izquierdo del mega-menú desplegado. */
  bgImage: string;
  /** Línea de texto bajo el logo del panel izquierdo (multi-línea con \n). */
  tagline: string;
  /**
   * Franja inferior del mega-menú con CTA + 4 botones + teléfono.
   * El teléfono se DERIVA automáticamente de
   * `configuracion_global['contacto'].telefonos[0]`, no se duplica acá.
   */
  ctaFooter: {
    /** Texto antes de los botones (ej. "¿Listo para ser parte del Atenas?"). */
    pretitle: string;
    /**
     * Los 4 botones (orden fijo: rojo, dorado outline, blanco outline ×2).
     * El estilo está hardcoded por posición — solo se editan label y href.
     */
    buttons: MegaMenuCtaButton[];
  };
};

export const MEGA_MENU_DEFAULT: MegaMenuConfig = {
  bgImage: "/images/00_politicas-de-seguridad-1536x864.jpg",
  tagline: "50 años formando líderes\ncon valores y excelencia.",
  ctaFooter: {
    pretitle: "¿Listo para ser parte del Atenas?",
    buttons: [
      { label: "Solicitar Admisión", href: "/admisiones" },
      { label: "Tour Virtual",        href: "/paseo-virtual" },
      { label: "Cronograma",          href: "/cronograma-anual" },
      { label: "Contactos",           href: "/contactos" },
    ],
  },
};

export function mergeMegaMenu(input: Partial<MegaMenuConfig> | null): MegaMenuConfig {
  if (!input) return MEGA_MENU_DEFAULT;
  const buttonsRaw = input.ctaFooter?.buttons;
  const buttons: MegaMenuCtaButton[] = Array.isArray(buttonsRaw)
    ? buttonsRaw
        .map((b) => ({
          label: String(b?.label ?? "").trim(),
          href: String(b?.href ?? "").trim(),
        }))
        .filter((b) => b.label && b.href)
    : MEGA_MENU_DEFAULT.ctaFooter.buttons;
  return {
    bgImage: input.bgImage?.trim() || MEGA_MENU_DEFAULT.bgImage,
    tagline: input.tagline?.trim() || MEGA_MENU_DEFAULT.tagline,
    ctaFooter: {
      pretitle:
        input.ctaFooter?.pretitle?.trim() || MEGA_MENU_DEFAULT.ctaFooter.pretitle,
      buttons: buttons.length > 0 ? buttons : MEGA_MENU_DEFAULT.ctaFooter.buttons,
    },
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

// ─── Footer global ─────────────────────────────────────────────
// Tipos puros en @/lib/cms/footer (patrón #25). Re-export aquí para
// que server components que importan getConfiguracion sigan funcionando.
export { FOOTER_DEFAULT, mergeFooter } from "./footer";
export type {
  FooterConfig,
  FooterCTAButton,
  FooterAliado,
  FooterLink,
} from "./footer";

// ─── /contactos página ─────────────────────────────────────────
// Tipos puros en @/lib/cms/contactosPagina (patrón #25).
export { CONTACTOS_PAGINA_DEFAULT, mergeContactosPagina } from "./contactosPagina";
export type { ContactosPaginaConfig, ExtensionContacto } from "./contactosPagina";

// ─── /admisiones landing ───────────────────────────────────────
// Tipos puros en @/lib/cms/admisionesLanding (patrón #25).
export { ADMISIONES_LANDING_DEFAULT, mergeAdmisionesLanding } from "./admisionesLanding";
export type {
  AdmisionesLandingConfig,
  AdmisionesCTA,
  AdmisionesStat,
  AdmisionesProcesoPaso,
  AdmisionesNivelCard,
  AdmisionesExplorarCard,
  AdmisionesFAQItem,
} from "./admisionesLanding";

// ─── /admisiones textos chicos (formulario + seguimiento) ──────
export { ADMISIONES_TEXTOS_DEFAULT, mergeAdmisionesTextos } from "./admisionesTextos";
export type { AdmisionesTextosConfig } from "./admisionesTextos";
