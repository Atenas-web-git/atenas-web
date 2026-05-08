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
  | "tpl_e_hero_galeria"
  | "tpl_f_hero_academico"
  | "tpl_g_landing_ib"
  | "tpl_h_landing_niveles";

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
    descripcion: "Hero seguido de un grid de tarjetas con icono, título y descripción. Cada tarjeta puede llevar subtítulo, link a otra ruta, color (gold/red) y marca de destacado.",
    ejemploSlugs: ["el-atenas/valores", "servicios", "espacios"],
    implementada: true,
  },
  tpl_c_hero_pasos: {
    slug: "tpl_c_hero_pasos",
    letra: "C",
    nombre: "Hero + tarjetas + pasos numerados",
    descripcion: "Hero, tarjetas opcionales (ej. bancos, proveedores), pasos numerados auto-secuenciales y nota al pie.",
    ejemploSlugs: ["matriculas/autorizaciones", "matriculas/proceso", "admisiones/*"],
    implementada: true,
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
  tpl_f_hero_academico: {
    slug: "tpl_f_hero_academico",
    letra: "F",
    nombre: "Hero + ficha académica + tarjetas/plataformas",
    descripcion: "Hero + stats strip + intro con párrafos/chips/nota/3 fotos en collage + sección oscura opcional con tarjetas (con foto de fondo) o plataformas. Pensada para subpáginas de IB y Niveles.",
    ejemploSlugs: ["academico/ib/*", "academico/niveles/*"],
    implementada: true,
  },
  tpl_g_landing_ib: {
    slug: "tpl_g_landing_ib",
    letra: "G",
    nombre: "Landing IB (5 bloques fijos)",
    descripcion: "Landing del Programa IB con 5 bloques editables: Hero con collage flotante + stats bar, Núcleo (3 componentes + 2 fotos), Materias (6 grupos), Proceso (timeline + aliados + CTA), y Explorar (grid de 7 secciones).",
    ejemploSlugs: ["academico/ib"],
    implementada: true,
  },
  tpl_h_landing_niveles: {
    slug: "tpl_h_landing_niveles",
    letra: "H",
    nombre: "Landing Niveles (4 bloques fijos)",
    descripcion: "Landing académica con 4 bloques editables: Hero con collage flotante + chips, Niveles (5 cards educativos), Metodologías (strip + 4 cards), CTA con stats card.",
    ejemploSlugs: ["academico/niveles"],
    implementada: true,
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
  /** Línea pequeña dorada bajo el título (ej. "Valores, Actitudes, Servicio…"). */
  subtitle?: string;
  /** Si está presente, la tarjeta es un link a esa URL (interna o externa). */
  href?: string;
  /** Variante de color del acento. Default: "gold". */
  color?: "gold" | "red";
  /** Marca la tarjeta como destacada (borde dorado más intenso). */
  highlight?: boolean;
  /** Texto del CTA al final de la tarjeta. Solo aparece si hay `href`. */
  ctaText?: string;
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

// ─── Plantilla C (Hero + tarjetas + pasos + nota) ────────────

export type FilaTarjetaPlantillaC = {
  /** ej. "Tipo", "N° de cuenta", "Titular", "RUC". */
  label: string;
  /** ej. "Cuenta Corriente", "12345-6". */
  value: string;
  /** Si true, el value se pinta en dorado y bold (típico para datos clave). */
  destacado?: boolean;
};

export type TarjetaPlantillaC = {
  /** Color hex del punto de identificación (ej. color del banco). */
  color?: string;
  titulo: string;
  filas: FilaTarjetaPlantillaC[];
};

export type PasoPlantillaC = {
  /** Texto del paso. La numeración se genera automáticamente (01, 02, 03...). */
  texto: string;
  /** Si true, el paso se pinta en rojo (útil para destacar el paso final). */
  destacado?: boolean;
};

export type GaleriaPlantillaC = {
  /** Foto principal (mobile + desktop). */
  src1: string;
  alt1?: string;
  /** Foto secundaria (mobile + desktop). */
  src2: string;
  alt2?: string;
  /** Foto terciaria (solo desktop). */
  src3?: string;
  alt3?: string;
};

export type ContenidoPlantillaC = {
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
    descripcion?: string;
  };
  /** Galería en collage (2 fotos en mobile, 3 en desktop). Aparece dentro de la sección de pasos. */
  galeria?: GaleriaPlantillaC;
  tarjetas?: {
    titulo?: string;
    items: TarjetaPlantillaC[];
  };
  pasos?: {
    badge?: string;
    titulo?: string;
    items: PasoPlantillaC[];
  };
  nota?: {
    icono?: string;
    texto: string;
  };
};

/** Default vacío para crear una página nueva con plantilla C. */
export function defaultContenidoPlantillaC(): ContenidoPlantillaC {
  return {
    hero: {
      badge: "PROCESO",
      title: "Nueva página de proceso",
      subtitle: "",
      ghostText: "PROCESO",
    },
    pasos: {
      titulo: "Pasos a seguir",
      items: [
        { texto: "Primer paso del proceso." },
        { texto: "Segundo paso del proceso." },
        { texto: "Tercer paso del proceso." },
      ],
    },
  };
}

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

// ─── Plantilla F (Hero + ficha académica + tarjetas/plataformas) ────────

export type StatPlantillaF = {
  /** Texto pequeño dorado en mayúsculas (ej. "Programa", "Grados"). */
  label: string;
  /** Texto principal en navy (ej. "Diploma del IB", "1ro a 7mo EGB"). */
  value: string;
};

export type ChipPlantillaF = {
  /** Texto del chip (ej. "CAS", "Montessori"). */
  texto: string;
};

export type PlataformaPlantillaF = {
  /** Nombre de la plataforma (ej. "Mangahigh", "ALEKS"). */
  name: string;
  /** Descripción corta de la plataforma. */
  detail: string;
};

export type TarjetaPlantillaF = {
  title: string;
  description: string;
};

/** Variante visual de la sección oscura inferior. */
export type SeccionInferiorPlantillaF =
  | { tipo: "ninguna" }
  | {
      tipo: "tarjetas";
      badge?: string;
      titulo?: string;
      bgPhoto?: string;
      columnas: 3 | 4 | 5;
      items: TarjetaPlantillaF[];
    }
  | {
      tipo: "plataformas";
      badge?: string;
      titulo?: string;
      bgPhoto?: string;
      items: PlataformaPlantillaF[];
    };

export type ContenidoPlantillaF = {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  /** Strip de stats sobre fondo blanco (3 stats: label + value). */
  stats: [StatPlantillaF, StatPlantillaF, StatPlantillaF];
  intro: {
    badge: string;
    heading: string;
    /** Si está presente, esa parte del heading se pinta con un brush dorado debajo. */
    headingHighlight?: string;
    paragraphs: string[];
    /** Texto que aparece sobre los chips (ej. "Componentes", "Metodologías"). */
    chipsLabel?: string;
    chips: ChipPlantillaF[];
    /** Nota destacada con borde dorado a la izquierda. */
    note?: string;
    /** 3 fotos para el collage en desktop. La primera se usa también en mobile. */
    photos: [string, string, string];
    /** Texto del badge dorado flotante sobre el collage (ej. "ATENAS IB ★"). */
    badgeCollage?: string;
  };
  /** Sección oscura inferior. Si tipo="ninguna" no se renderiza. */
  seccionInferior: SeccionInferiorPlantillaF;
};

/** Default vacío para crear una página nueva con plantilla F. */
export function defaultContenidoPlantillaF(): ContenidoPlantillaF {
  return {
    hero: {
      badge: "ACADÉMICO",
      title: "Nueva página académica",
      subtitle: "",
      ghostText: "",
    },
    stats: [
      { label: "Programa", value: "—" },
      { label: "Nivel", value: "—" },
      { label: "Institución", value: "Unidad Educativa Atenas" },
    ],
    intro: {
      badge: "Sección académica",
      heading: "Encabezado de la página",
      paragraphs: ["Primer párrafo (se muestra más grande)."],
      chipsLabel: "Componentes",
      chips: [{ texto: "Chip 1" }],
      photos: ["", "", ""],
      badgeCollage: "ATENAS ★",
    },
    seccionInferior: { tipo: "ninguna" },
  };
}

// ─── Plantilla G (Landing IB — 5 bloques) ──────────────────────

export type CTAItem = { text: string; href: string };

export type ContenidoPlantillaG = {
  /** Bloque 1: Hero con collage flotante + stats bar */
  hero: {
    bgImageSrc?: string;
    ghostText: string;
    badge: string;
    /** Título partido en 2 líneas (línea 2 va en dorado). */
    titleLine1: string;
    titleLine2: string;
    /** Subtítulo con un fragmento subrayado en dorado. */
    subtitle: string;
    subtitleHighlight: string;
    ctaPrimary: CTAItem;
    ctaSecondary: CTAItem;
    /** 3 fotos del collage flotante derecha (desktop). */
    floatingPhotos: [string, string, string];
    /** Badge dorado flotante sobre el collage (2 líneas). */
    floatingBadgeLine1: string;
    floatingBadgeLine2: string;
    chips: { texto: string }[];
    /** 4 stats en la barra inferior del hero. */
    stats: [
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
    ];
  };
  /** Bloque 2: Núcleo del Diploma (3 componentes + foto sidebar) */
  nucleo: {
    badge: string;
    heading: string;
    headingHighlight: string;
    descripcion: string;
    componentes: {
      icon: string;
      title: string;
      sub: string;
      desc: string;
      highlight?: boolean;
    }[];
    /** 2 fotos en la columna lateral derecha (desktop). */
    fotoPrincipal: { src: string; caption: string };
    fotoSecundaria: { src: string; caption: string };
  };
  /** Bloque 3: 6 grupos de asignaturas + nota HL/SL */
  materias: {
    badge: string;
    heading: string;
    headingHighlight: string;
    descripcion: string;
    grupos: {
      num: string;
      title: string;
      detail: string;
      /** Color de la tarjeta: white (default), navy o gold. */
      color?: "white" | "navy" | "gold";
    }[];
    /** Nota HL/SL al pie de la sección. */
    nota: string;
  };
  /** Bloque 4: Proceso de admisión (timeline + aliados + CTA) */
  proceso: {
    bgImageSrc?: string;
    badge: string;
    heading: string;
    headingHighlight: string;
    pasos: { num: string; title: string; desc: string }[];
    aliados: {
      titulo: string;
      items: { name: string; short: string }[];
    };
    cta: {
      titulo: string;
      descripcion: string;
      btnText: string;
      btnHref: string;
    };
  };
  /** Bloque 5: Explorar el Programa (grid de secciones IB) */
  explorar: {
    badge: string;
    heading: string;
    descripcion: string;
    /** Cada sección enlaza a /academico/ib/[slug]. */
    secciones: {
      slug: string;
      icon: string;
      title: string;
      desc: string;
    }[];
  };
};

/** Default vacío para crear una página nueva con plantilla G. */
export function defaultContenidoPlantillaG(): ContenidoPlantillaG {
  return {
    hero: {
      ghostText: "DIPLOMA IB",
      badge: "BACHILLERATO INTERNACIONAL",
      titleLine1: "Piensa global.",
      titleLine2: "Diploma IB.",
      subtitle: "El único colegio en el centro del país con el Programa del Diploma IB acreditado.",
      subtitleHighlight: "Programa del Diploma IB",
      ctaPrimary: { text: "Solicitar información", href: "#proceso" },
      ctaSecondary: { text: "Agendar visita", href: "/admisiones#visita" },
      floatingPhotos: ["", "", ""],
      floatingBadgeLine1: "ÚNICO EN EL CENTRO",
      floatingBadgeLine2: "DEL PAÍS ★",
      chips: [],
      stats: [
        { value: "—", label: "Stat 1" },
        { value: "—", label: "Stat 2" },
        { value: "—", label: "Stat 3" },
        { value: "—", label: "Stat 4" },
      ],
    },
    nucleo: {
      badge: "El núcleo del Diploma",
      heading: "Tres componentes que definen a un graduado IB.",
      headingHighlight: "definen a un graduado IB.",
      descripcion: "",
      componentes: [],
      fotoPrincipal: { src: "", caption: "" },
      fotoSecundaria: { src: "", caption: "" },
    },
    materias: {
      badge: "Currículo IB",
      heading: "6 grupos de asignaturas.",
      headingHighlight: "asignaturas.",
      descripcion: "",
      grupos: [],
      nota: "",
    },
    proceso: {
      badge: "Admisión al programa",
      heading: "Proceso de ingreso a 1ro IB.",
      headingHighlight: "a 1ro IB.",
      pasos: [],
      aliados: { titulo: "Aliados del programa", items: [] },
      cta: {
        titulo: "¿Listo para dar el paso?",
        descripcion: "",
        btnText: "Agendar visita al colegio",
        btnHref: "/admisiones#visita",
      },
    },
    explorar: {
      badge: "Explora el Programa",
      heading: "Todo lo que necesitas saber sobre el IB",
      descripcion: "",
      secciones: [],
    },
  };
}

// ─── Plantilla H (Landing Niveles — 4 bloques) ─────────────────

export type ContenidoPlantillaH = {
  /** Bloque 1: Hero con collage flotante */
  hero: {
    bgImageSrc?: string;
    ghostText: string;
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    subtitleHighlight: string;
    floatingPhotos: [string, string, string];
    /** Badge dorado flotante: número grande + label pequeño. */
    floatingBadgeValue: string;
    floatingBadgeLabel: string;
    chips: { texto: string; highlight?: boolean }[];
  };
  /** Bloque 2: Niveles educativos (5 cards en fila desktop) */
  niveles: {
    badge: string;
    heading: string;
    headingHighlight: string;
    descripcion: string;
    /** 3 fotos del collage en el header. */
    headerPhotos: [string, string, string];
    /** Badge dorado flotante sobre el collage. */
    badgeAcreditado: string;
    items: {
      num: string;
      title: string;
      grades: string;
      age: string;
      methods: string[];
      desc: string;
      note?: string;
      badge?: string;
      highlight?: boolean;
    }[];
  };
  /** Bloque 3: Metodologías (strip de 3 fotos + 4 cards) */
  metodologias: {
    badge: string;
    heading: string;
    headingHighlight: string;
    /** 3 fotos del strip horizontal con caption. */
    strip: { src: string; caption: string }[];
    /** 4 cards de metodologías (icono emoji + foto top). */
    cards: {
      icon: string;
      img: string;
      scope: string;
      title: string;
      desc: string;
      dark?: boolean;
    }[];
  };
  /** Bloque 4: CTA con stats card lateral */
  cta: {
    bgImageSrc?: string;
    ghostText: string;
    badge: string;
    heading: string;
    headingHighlight: string;
    descripcion: string;
    chips: { texto: string }[];
    btnText: string;
    btnHref: string;
    /** 3 stats en la tarjeta lateral (la del medio se renderiza con highlight dorado). */
    stats: [
      { value: string; label: string; sub: string },
      { value: string; label: string; sub: string },
      { value: string; label: string; sub: string },
    ];
    /** Foto pequeña al final de la stats card. */
    statsCardImg: string;
  };
};

/** Default vacío para crear una página nueva con plantilla H. */
export function defaultContenidoPlantillaH(): ContenidoPlantillaH {
  return {
    hero: {
      ghostText: "ACADÉMICO",
      badge: "NIVELES EDUCATIVOS",
      titleLine1: "Formación",
      titleLine2: "integral.",
      subtitle: "",
      subtitleHighlight: "",
      floatingPhotos: ["", "", ""],
      floatingBadgeValue: "5",
      floatingBadgeLabel: "NIVELES EDUCATIVOS",
      chips: [],
    },
    niveles: {
      badge: "Formación por nivel",
      heading: "Cinco niveles, un mismo compromiso.",
      headingHighlight: "un mismo compromiso.",
      descripcion: "",
      headerPhotos: ["", "", ""],
      badgeAcreditado: "IB ACREDITADO ★",
      items: [],
    },
    metodologias: {
      badge: "Diferenciadores pedagógicos",
      heading: "Metodologías que marcan la diferencia.",
      headingHighlight: "marcan la diferencia.",
      strip: [],
      cards: [],
    },
    cta: {
      ghostText: "IB DIPLOMA",
      badge: "El diferenciador Atenas",
      heading: "Bachillerato Internacional IB.",
      headingHighlight: "Internacional IB.",
      descripcion: "",
      chips: [],
      btnText: "Conocer el Programa IB",
      btnHref: "/academico/ib",
      stats: [
        { value: "—", label: "", sub: "" },
        { value: "—", label: "", sub: "" },
        { value: "—", label: "", sub: "" },
      ],
      statsCardImg: "",
    },
  };
}
