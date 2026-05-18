/**
 * Tipos, constantes y helpers PUROS del footer global del sitio.
 *
 * Vive aparte de `getConfiguracion.ts` porque ese archivo importa
 * `@/lib/supabase/server` (que arrastra `next/headers`) y eso rompe los
 * client components que solo necesitan los types (patrón #25).
 *
 * El footer es el bloque `FooterCTA` que aparece al pie de TODAS las
 * páginas del sitio público. Datos de contacto (teléfono, correo) +
 * redes sociales se leen de `configuracion_global['contacto']` para NO
 * duplicar — este módulo solo guarda lo que es exclusivo del footer.
 */

export type FooterCTAButton = {
  label: string;
  href: string;
};

export type FooterAliado = {
  /** Nombre completo del aliado (tooltip / aria-label). */
  label: string;
  /** Abreviatura visible dentro del chip. */
  abbr: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterConfig = {
  /** Foto de fondo con efecto parallax. */
  bgImage: string;
  /** Titular grande blanco centrado. */
  headline: string;
  /** Párrafo descriptivo bajo el titular. */
  subtitle: string;
  /** CTA rojo (acción primaria). */
  ctaPrimary: FooterCTAButton;
  /** CTA outline (acción secundaria). */
  ctaSecondary: FooterCTAButton;
  /** Texto pequeño dorado sobre el grupo de aliados (ej. "Aliados Estratégicos"). */
  aliadosLabel: string;
  /** Chips de aliados estratégicos. */
  aliados: FooterAliado[];
  /** Links secundarios del pie del footer. */
  links: FooterLink[];
  /** Línea de copyright al final. */
  copyright: string;
};

export const FOOTER_DEFAULT: FooterConfig = {
  bgImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80",
  headline: "Sé parte del Atenas.",
  subtitle:
    "Conoce nuestra propuesta educativa y da el primer paso hacia una formación de excelencia.",
  ctaPrimary: { label: "Agenda una visita", href: "/admisiones#visita" },
  ctaSecondary: { label: "Proceso de admisión", href: "/admisiones" },
  aliadosLabel: "Aliados Estratégicos",
  aliados: [
    { label: "Bachillerato Internacional (IB)", abbr: "IB World School" },
    { label: "Ministerio de Educación del Ecuador", abbr: "MinEduc" },
    { label: "Cambridge English", abbr: "Cambridge" },
    { label: "Federación Ecuatoriana de Colegios de Excelencia", abbr: "FCEA" },
  ],
  links: [
    { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
    { label: "Política", href: "/politicas" },
    { label: "Quejas y Sugerencias", href: "/servicios/quejas-sugerencias" },
    { label: "Documentos institucionales", href: "/documentos-institucionales" },
    { label: "Facturación", href: "/facturacion" },
  ],
  copyright: "© 2026 Unidad Educativa Atenas · Ambato, Ecuador",
};

export function mergeFooter(input: Partial<FooterConfig> | null): FooterConfig {
  if (!input) return FOOTER_DEFAULT;

  const mergeBtn = (
    b: Partial<FooterCTAButton> | undefined,
    def: FooterCTAButton
  ): FooterCTAButton => ({
    label: b?.label?.trim() || def.label,
    href: b?.href?.trim() || def.href,
  });

  const aliados: FooterAliado[] = Array.isArray(input.aliados)
    ? input.aliados
        .map((a) => ({
          label: String(a?.label ?? "").trim(),
          abbr: String(a?.abbr ?? "").trim(),
        }))
        .filter((a) => a.label && a.abbr)
    : FOOTER_DEFAULT.aliados;

  const links: FooterLink[] = Array.isArray(input.links)
    ? input.links
        .map((l) => ({
          label: String(l?.label ?? "").trim(),
          href: String(l?.href ?? "").trim(),
        }))
        .filter((l) => l.label && l.href)
    : FOOTER_DEFAULT.links;

  return {
    bgImage: input.bgImage?.trim() || FOOTER_DEFAULT.bgImage,
    headline: input.headline?.trim() || FOOTER_DEFAULT.headline,
    subtitle: input.subtitle?.trim() || FOOTER_DEFAULT.subtitle,
    ctaPrimary: mergeBtn(input.ctaPrimary, FOOTER_DEFAULT.ctaPrimary),
    ctaSecondary: mergeBtn(input.ctaSecondary, FOOTER_DEFAULT.ctaSecondary),
    aliadosLabel: input.aliadosLabel?.trim() || FOOTER_DEFAULT.aliadosLabel,
    aliados: aliados.length > 0 ? aliados : FOOTER_DEFAULT.aliados,
    links: links.length > 0 ? links : FOOTER_DEFAULT.links,
    copyright: input.copyright?.trim() || FOOTER_DEFAULT.copyright,
  };
}
