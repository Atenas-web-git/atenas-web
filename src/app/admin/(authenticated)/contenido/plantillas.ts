/**
 * Catálogo de plantillas del CMS — fijo en código.
 *
 * Cada plantilla define el schema del JSONB `contenido` y la metadata
 * que se muestra en la UI del backoffice. NO se modifican desde la UI.
 */

export type PlantillaSlug =
  | "tpl_a_hero_texto"
  | "tpl_b_hero_grid"
  | "tpl_c_hero_pasos"
  | "tpl_d_hero_detalle"
  | "tpl_e_hero_galeria";

export type PlantillaInfo = {
  slug: PlantillaSlug;
  letra: string;
  nombre: string;
  descripcion: string;
  ejemploSlugs: string[];
  implementada: boolean;
};

export const PLANTILLAS: Record<PlantillaSlug, PlantillaInfo> = {
  tpl_a_hero_texto: {
    slug: "tpl_a_hero_texto",
    letra: "A",
    nombre: "Hero + texto institucional",
    descripcion: "Hero con título y subtítulo seguido de una sección de texto con párrafos formateables y nota opcional.",
    ejemploSlugs: ["el-atenas/mision", "el-atenas/vision"],
    implementada: true,
  },
  tpl_b_hero_grid: {
    slug: "tpl_b_hero_grid",
    letra: "B",
    nombre: "Hero + lista de tarjetas",
    descripcion: "Hero seguido de un grid de tarjetas con icono, título y descripción.",
    ejemploSlugs: ["el-atenas/valores"],
    implementada: false,
  },
  tpl_c_hero_pasos: {
    slug: "tpl_c_hero_pasos",
    letra: "C",
    nombre: "Hero + pasos numerados",
    descripcion: "Hero seguido de una serie de pasos numerados con icono y descripción.",
    ejemploSlugs: ["admisiones (proceso de 5 pasos)"],
    implementada: false,
  },
  tpl_d_hero_detalle: {
    slug: "tpl_d_hero_detalle",
    letra: "D",
    nombre: "Hero + tabla / detalle",
    descripcion: "Hero seguido de stats y tabla informativa.",
    ejemploSlugs: ["academico/niveles", "matriculas/valores"],
    implementada: false,
  },
  tpl_e_hero_galeria: {
    slug: "tpl_e_hero_galeria",
    letra: "E",
    nombre: "Hero + galería",
    descripcion: "Hero seguido de una galería de imágenes (3 columnas o collage).",
    ejemploSlugs: ["reconocimientos/*"],
    implementada: false,
  },
};

export const PLANTILLAS_LIST: PlantillaInfo[] = Object.values(PLANTILLAS);

// ─── Schemas tipados por plantilla ────────────────────────────

export type ContenidoPlantillaA = {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  seccion: {
    badge: string;
    heading: string;
    paragraphs: string[];
    note?: string | null;
    imageSrc?: string | null;
    imageAlt?: string | null;
  };
};

/** Default vacío para crear una página nueva con plantilla A. */
export function defaultContenidoPlantillaA(): ContenidoPlantillaA {
  return {
    hero: {
      badge: "QUIÉNES SOMOS",
      title: "Nueva página",
      subtitle: "",
      ghostText: "",
    },
    seccion: {
      badge: "SECCIÓN",
      heading: "Encabezado de la sección",
      paragraphs: ["Primer párrafo (se muestra más grande y oscuro)."],
      note: null,
      imageSrc: null,
      imageAlt: null,
    },
  };
}
