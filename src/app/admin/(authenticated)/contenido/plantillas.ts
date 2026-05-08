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
    implementada: true,
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
    nombre: "Hero + stats + tabla",
    descripcion: "Hero, párrafo introductorio opcional, stats numéricas, tabla configurable y nota destacada al pie.",
    ejemploSlugs: ["matriculas/valores", "matriculas/autorizaciones", "academico/ib/documentos"],
    implementada: true,
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

// ─── Plantilla B (Hero + grid de tarjetas con icono) ──────────

export type TarjetaPlantillaB = {
  /** Nombre del icono Lucide en kebab-case (ej. "shield", "heart", "anchor"). */
  icon: string;
  title: string;
  description: string;
};

export type ContenidoPlantillaB = {
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
    description?: string;
    items: TarjetaPlantillaB[];
  };
};

// ─── Plantilla D (Hero + stats + tabla + nota) ────────────────

export type StatPlantillaD = {
  valor: string;
  label: string;
};

export type FilaPlantillaD = {
  /** Cada fila tiene N celdas (mismo número que cabeceras de columnas). */
  celdas: string[];
  /** Si está marcada, la fila se renderiza con énfasis (ej. bg navy). */
  destacada?: boolean;
};

export type ContenidoPlantillaD = {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  intro?: {
    badge?: string;
    heading?: string;
    paragraphs?: string[];
  };
  stats?: StatPlantillaD[];
  tabla?: {
    badge?: string;
    heading?: string;
    descripcion?: string;
    /** Cabeceras de columnas. La cantidad determina el número de celdas por fila. */
    columnas: string[];
    filas: FilaPlantillaD[];
    /** Acento de color de la primera columna (rol "etiqueta"). */
    acentoPrimeraColumna?: boolean;
    /** Color destacado para la última columna (típico: precios, valores). */
    destacarUltimaColumna?: boolean;
  };
  nota?: {
    icono?: string;
    texto: string;
  };
};

/** Default vacío para crear una página nueva con plantilla D. */
export function defaultContenidoPlantillaD(): ContenidoPlantillaD {
  return {
    hero: {
      badge: "MATRÍCULAS",
      title: "Nueva ficha técnica",
      subtitle: "",
      ghostText: "FICHA",
    },
    stats: [
      { valor: "—", label: "Stat 1" },
      { valor: "—", label: "Stat 2" },
    ],
    tabla: {
      heading: "Estructura de la tabla",
      columnas: ["Concepto", "Detalle"],
      filas: [{ celdas: ["Fila 1", "—"] }],
      acentoPrimeraColumna: true,
    },
  };
}

/** Default vacío para crear una página nueva con plantilla B. */
export function defaultContenidoPlantillaB(): ContenidoPlantillaB {
  return {
    hero: {
      badge: "QUIÉNES SOMOS",
      title: "Nueva página",
      subtitle: "",
      ghostText: "",
    },
    seccion: {
      badge: "SECCIÓN",
      heading: "Nuestros pilares",
      description: "Una breve descripción del grid de tarjetas.",
      items: [
        {
          icon: "star",
          title: "Primer pilar",
          description: "Descripción del primer pilar de la lista.",
        },
      ],
    },
  };
}
