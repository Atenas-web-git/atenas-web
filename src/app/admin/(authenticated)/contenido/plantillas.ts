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
  | "tpl_f_hero_academico"
  | "tpl_g_landing_ib"
  | "tpl_h_landing_niveles"
  | "tpl_i_historia"
  | "tpl_j_landing_matriculas"
  | "tpl_k_ficha_servicio"
  | "tpl_l_ficha_espacio"
  | "tpl_m_home";

export type PlantillaCategoria =
  | "texto-institucional"
  | "procesos-matriculas"
  | "academico"
  | "landings-ricas"
  | "fichas"
  | "home";

export const PLANTILLA_CATEGORIAS: {
  key: PlantillaCategoria;
  label: string;
  description: string;
}[] = [
  {
    key: "texto-institucional",
    label: "Texto institucional",
    description: "Páginas explicativas: misión, visión, valores, descripciones generales.",
  },
  {
    key: "procesos-matriculas",
    label: "Procesos y matrículas",
    description: "Flujos con pasos numerados, valores, tablas, datos bancarios.",
  },
  {
    key: "academico",
    label: "Académico",
    description: "Subpáginas IB y niveles educativos con stats, chips y collage.",
  },
  {
    key: "landings-ricas",
    label: "Landings ricas",
    description: "Páginas principales con varios bloques fijos (IB, niveles, historia, matrículas).",
  },
  {
    key: "fichas",
    label: "Fichas (servicios y espacios)",
    description: "Ficha técnica de un servicio o espacio (formulario opcional).",
  },
  {
    key: "home",
    label: "Home",
    description: "Página principal del sitio.",
  },
];

export type PlantillaInfo = {
  slug: PlantillaSlug;
  letra: string;
  nombre: string;
  descripcion: string;
  ejemploSlugs: string[];
  implementada: boolean;
  categoria: PlantillaCategoria;
};

export const PLANTILLAS: Record<PlantillaSlug, PlantillaInfo> = {
  tpl_a_hero_texto: {
    slug: "tpl_a_hero_texto",
    letra: "A",
    nombre: "Hero + texto institucional",
    descripcion: "Hero con título y subtítulo seguido de una sección de texto con párrafos formateables y nota opcional.",
    ejemploSlugs: ["el-atenas/mision", "el-atenas/vision"],
    implementada: true,
    categoria: "texto-institucional",
  },
  tpl_b_hero_grid: {
    slug: "tpl_b_hero_grid",
    letra: "B",
    nombre: "Hero + lista de tarjetas",
    descripcion: "Hero seguido de un grid de tarjetas con icono, título y descripción. Cada tarjeta puede llevar subtítulo, link a otra ruta, color (gold/red) y marca de destacado.",
    ejemploSlugs: ["el-atenas/valores", "servicios", "espacios"],
    implementada: true,
    categoria: "texto-institucional",
  },
  tpl_c_hero_pasos: {
    slug: "tpl_c_hero_pasos",
    letra: "C",
    nombre: "Hero + tarjetas + pasos numerados",
    descripcion: "Hero, tarjetas opcionales (ej. bancos, proveedores), pasos numerados auto-secuenciales y nota al pie.",
    ejemploSlugs: ["matriculas/autorizaciones", "matriculas/proceso", "admisiones/*"],
    implementada: true,
    categoria: "procesos-matriculas",
  },
  tpl_d_hero_detalle: {
    slug: "tpl_d_hero_detalle",
    letra: "D",
    nombre: "Hero + stats + tabla",
    descripcion: "Hero, párrafo introductorio opcional, stats numéricas, tabla configurable y nota destacada al pie.",
    ejemploSlugs: ["matriculas/valores", "matriculas/autorizaciones", "academico/ib/documentos"],
    implementada: true,
    categoria: "procesos-matriculas",
  },
  tpl_f_hero_academico: {
    slug: "tpl_f_hero_academico",
    letra: "F",
    nombre: "Hero + ficha académica + tarjetas/plataformas",
    descripcion: "Hero + stats strip + intro con párrafos/chips/nota/3 fotos en collage + sección oscura opcional con tarjetas (con foto de fondo) o plataformas. Pensada para subpáginas de IB y Niveles.",
    ejemploSlugs: ["academico/ib/*", "academico/niveles/*"],
    implementada: true,
    categoria: "academico",
  },
  tpl_g_landing_ib: {
    slug: "tpl_g_landing_ib",
    letra: "G",
    nombre: "Landing IB (5 bloques fijos)",
    descripcion: "Landing del Programa IB con 5 bloques editables: Hero con collage flotante + stats bar, Núcleo (3 componentes + 2 fotos), Materias (6 grupos), Proceso (timeline + aliados + CTA), y Explorar (grid de 7 secciones).",
    ejemploSlugs: ["academico/ib"],
    implementada: true,
    categoria: "landings-ricas",
  },
  tpl_h_landing_niveles: {
    slug: "tpl_h_landing_niveles",
    letra: "H",
    nombre: "Landing Niveles (4 bloques fijos)",
    descripcion: "Landing académica con 4 bloques editables: Hero con collage flotante + chips, Niveles (5 cards educativos), Metodologías (strip + 4 cards), CTA con stats card.",
    ejemploSlugs: ["academico/niveles"],
    implementada: true,
    categoria: "landings-ricas",
  },
  tpl_i_historia: {
    slug: "tpl_i_historia",
    letra: "I",
    nombre: "Historia (5 bloques con video YouTube)",
    descripcion: "Plantilla narrativa con 5 bloques: Hero con foto de fondo + ghost text, Fundación (texto + 3 fotos), Trayectoria (video YouTube en loop como fondo + 6 hitos + 3 fotos), Cifras (4 stats con contador animado), Cita destacada con fondo parallax.",
    ejemploSlugs: ["el-atenas/historia"],
    implementada: true,
    categoria: "landings-ricas",
  },
  tpl_j_landing_matriculas: {
    slug: "tpl_j_landing_matriculas",
    letra: "J",
    nombre: "Landing Matrículas (showcase + proceso)",
    descripcion: "Landing de la entrada al flujo de matrículas con 3 bloques: Hero, Showcase (3 cards con icono+foto+contador+link a las subpáginas), Proceso (collage de 3 fotos + 5 pasos numerados con último destacado en rojo). El banner de fechas es global (configuracion_global) y la nav lateral entre páginas hermanas es hardcoded.",
    ejemploSlugs: ["matriculas"],
    implementada: true,
    categoria: "landings-ricas",
  },
  tpl_k_ficha_servicio: {
    slug: "tpl_k_ficha_servicio",
    letra: "K",
    nombre: "Ficha de servicio (stats + collage + pasos)",
    descripcion: "Ficha de un servicio institucional: Hero + 3 stats con icono Lucide + collage de 3 fotos + descripción en párrafos + 3 pasos numerados. El icono y color del servicio son editables. Casos especiales (formulario de quejas, card de Revista Atenas) se conservan según el slug de la página.",
    ejemploSlugs: ["servicios/bar-cafeteria", "servicios/biblioteca", "servicios/transporte"],
    implementada: true,
    categoria: "fichas",
  },
  tpl_l_ficha_espacio: {
    slug: "tpl_l_ficha_espacio",
    letra: "L",
    nombre: "Ficha de espacio (detalle + actividades)",
    descripcion: "Ficha de un espacio de desarrollo: Hero + sección de detalle (párrafos, tags, ficha técnica de 4 filas, nota destacada, foto lateral) + sección oscura de Actividades (foto de fondo con parallax, título y lista de 4-6 actividades con emoji + descripción). La nav lateral entre espacios hermanos es hardcoded.",
    ejemploSlugs: ["espacios/cas", "espacios/cultura", "espacios/idioma", "espacios/vase"],
    implementada: true,
    categoria: "fichas",
  },
  tpl_m_home: {
    slug: "tpl_m_home",
    letra: "M",
    nombre: "Home (6 bloques con video YouTube en hero)",
    descripcion: "Página principal del sitio. 6 bloques editables: Hero (video YouTube en loop como fondo + título multilínea + subtítulo + link a YouTube), Tagline (eyebrow + título con underline en palabra clave), Scroll horizontal (4 slides Académico/IB/Deporte/Comunidad), Trayectoria (50 años con stats animadas), Niveles educativos (4 cards) y Por qué Atenas (header + 4 cards). La Intro animada de carga, la Navbar y el FooterCTA son globales y no se editan desde aquí.",
    ejemploSlugs: ["home"],
    implementada: true,
    categoria: "home",
  },
};

export const PLANTILLAS_LIST: PlantillaInfo[] = Object.values(PLANTILLAS);

// ─── Schemas tipados por plantilla ────────────────────────────

/** Botón opcional "Descargar más información" (Google Drive u otro link). */
export type DescargaInfo = {
  /** Texto del botón. Si vacío → no se renderiza la sección. */
  label?: string;
  /** URL destino (Google Drive, PDF, etc.). Si vacía → no se renderiza la sección. */
  href?: string;
  /** Texto descriptivo arriba del botón (opcional). */
  descripcion?: string;
};

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
  /** Bloque opcional: si tiene `label` y `href`, se renderiza un CTA al final. */
  descargas?: DescargaInfo;
  /** ID de anclaje opcional. Si está poblado, el `<section>` lleva `id={anchorId}` y se puede linkear con `/slug#anchorId`. */
  anchorId?: string;
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
  /** ID de anclaje opcional. Permite enlazar con `/slug#anchorId`. */
  anchorId?: string;
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
  /** ID de anclaje opcional. Permite enlazar con `/slug#anchorId`. */
  anchorId?: string;
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
  /** ID de anclaje opcional. Permite enlazar con `/slug#anchorId`. */
  anchorId?: string;
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
  /** Bloque opcional: botón CTA "Descargar más información" (Google Drive, PDF, etc.). */
  descargas?: DescargaInfo;
  /** ID de anclaje opcional. Permite enlazar con `/slug#anchorId`. */
  anchorId?: string;
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

// ─── Plantilla I (Historia — narrativa con video YouTube) ──────

export type HitoTrayectoriaPlantillaI = {
  /** Año o rango (ej. "1976", "2017–2019", "2020–2026 ★"). */
  year: string;
  title: string;
  desc: string;
  /** Si true, la tarjeta del hito se pinta con borde dorado destacado. */
  highlight?: boolean;
};

export type StatCifrasPlantillaI = {
  /** Valor numérico para el contador animado (ej. 50, 5000). */
  value: number;
  /** Sufijo opcional después del valor (ej. "+"). */
  suffix?: string;
  label: string;
  /** Si true, la tarjeta tiene fondo navy oscuro. */
  dark?: boolean;
  /**
   * Si true, NO se anima el contador y se muestra `staticText` (o el
   * value tal cual). Útil para casos como "1 IB" o textos no numéricos.
   */
  isStatic?: boolean;
  /**
   * Texto que se muestra cuando `isStatic = true`. Si está vacío, se
   * muestra `value + suffix`.
   */
  staticText?: string;
};

export type ContenidoPlantillaI = {
  /** Bloque 1: Hero con foto de fondo + ghost text + título a 2 líneas */
  hero: {
    bgImageSrc?: string;
    ghostText: string;
    badge: string;
    titleLine1: string;
    titleLine2: string;     // se pinta en dorado
    subtitle: string;
    caption?: string;
  };

  /** Bloque 2: Fundación (texto a la izquierda + collage de 3 fotos a la derecha) */
  fundacion: {
    badge: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;     // texto destacado debajo de la línea dorada
    fotoPrincipal: string;  // grande izquierda
    fotoSecundaria1: string; // arriba derecha
    fotoSecundaria2: string; // abajo derecha
  };

  /** Bloque 3: Trayectoria (video YouTube de fondo opcional + grid de hitos + strip de fotos) */
  trayectoria: {
    badge: string;
    heading: string;
    /** Texto enorme decorativo de fondo (ej. "50"). */
    ghostText?: string;
    /** Foto de respaldo (visible mientras el video carga / si no hay video). */
    bgFotoSrc?: string;
    /**
     * Video de YouTube de fondo en loop. Si no se llena, solo se ve la
     * foto de respaldo.
     */
    youtube?: {
      videoId: string;
      startSeconds?: number;
      endSeconds?: number;
    };
    hitos: HitoTrayectoriaPlantillaI[];
    /** 3 fotos en strip al pie del bloque (desktop). */
    fotos: [string, string, string];
  };

  /** Bloque 4: Cifras (4 stats con contador animado) */
  cifras: {
    bgImageSrc?: string;
    badge: string;
    heading: string;
    stats: StatCifrasPlantillaI[];
  };

  /** Bloque 5: Cita destacada con fondo parallax */
  cita: {
    bgImageSrc?: string;
    /** Cita principal. Acepta saltos con \n para separar líneas. */
    quote: string;
    /** Atribución pequeña debajo (ej. "Unidad Educativa Atenas · Desde 1976"). */
    attribution: string;
  };
};

/** Default vacío para crear una página nueva con plantilla I. */
export function defaultContenidoPlantillaI(): ContenidoPlantillaI {
  return {
    hero: {
      ghostText: "HISTORIA",
      badge: "AÑOS DE HISTORIA",
      titleLine1: "Historia &",
      titleLine2: "Cincuenta Años",
      subtitle: "Cinco décadas formando líderes con propósito.",
      caption: "Fundada en 1976 · Ambato, Ecuador",
    },
    fundacion: {
      badge: "Nuestros Orígenes",
      heading: "Un sueño que nació en 1976",
      paragraph1: "",
      paragraph2: "",
      fotoPrincipal: "",
      fotoSecundaria1: "",
      fotoSecundaria2: "",
    },
    trayectoria: {
      badge: "Nuestra Trayectoria",
      heading: "Hitos que marcaron nuestra historia",
      ghostText: "50",
      hitos: [],
      fotos: ["", "", ""],
    },
    cifras: {
      badge: "Nuestros Números",
      heading: "Medio siglo en números",
      stats: [],
    },
    cita: {
      quote: "",
      attribution: "Unidad Educativa Atenas · Desde 1976",
    },
  };
}

// ─── Plantilla J (Landing Matrículas) ────────────────────────

export type ShowcaseItemPlantillaJ = {
  /** Slug interno usado para construir el link `${basePath}/${slug}`. */
  slug: string;
  /** Emoji que aparece como icono de la card. */
  icon: string;
  nombre: string;
  /** Texto destacado (ej. "5", "6", "3"). */
  count: string;
  /** Texto pequeño debajo del count (ej. "pasos simples", "niveles educativos"). */
  countLabel: string;
  /** Foto de la card. */
  photoSrc: string;
  /** Ruta base a la que se concatena el slug. Default: "/matriculas". */
  basePath: string;
};

export type PasoMatriculaPlantillaJ = {
  num: string;
  titulo: string;
  desc: string;
  /** Si true, la tarjeta del paso se pinta con fondo rojo (típico para el paso final de pago). */
  isRed?: boolean;
};

export type ContenidoPlantillaJ = {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };

  /** Bloque Showcase: 3 cards con icono+foto+contador que linkean a las subpáginas. */
  showcase: {
    heading: string;
    ctaText: string;
    items: ShowcaseItemPlantillaJ[];
  };

  /** Bloque Proceso: collage de 3 fotos + intro + 5 pasos numerados. */
  proceso: {
    badge: string;
    heading: string;
    subtitle: string;
    fotos: [string, string, string];
    pasos: PasoMatriculaPlantillaJ[];
  };
};

/** Default vacío para crear una página nueva con plantilla J. */
export function defaultContenidoPlantillaJ(): ContenidoPlantillaJ {
  return {
    hero: {
      badge: "MATRÍCULAS",
      title: "Proceso de Matrícula",
      subtitle: "",
      ghostText: "MATRÍCULAS",
    },
    showcase: {
      heading: "Todo lo que necesitas para matricularte",
      ctaText: "Ver detalle",
      items: [],
    },
    proceso: {
      badge: "Proceso de Matrícula",
      heading: "Cómo matricularte",
      subtitle: "",
      fotos: ["", "", ""],
      pasos: [],
    },
  };
}

// ─── Plantilla K (Ficha de servicio) ──────────────────────────

export type StatPlantillaK = {
  /** Nombre Lucide en kebab-case (ej. "map-pin", "alarm-clock"). */
  iconName: string;
  /** Etiqueta corta en mayúsculas (ej. "UBICACIÓN"). */
  label: string;
  /** Valor de la stat (ej. "Planta baja — Bloque A"). */
  valor: string;
};

export type FormularioPlantillaK = {
  /** Título grande dentro del header rojo del formulario. */
  headerTitle: string;
  /** Bajada del header. */
  headerSubtitle: string;
  /** Opciones del dropdown "Tipo" (ej. ["Queja", "Sugerencia", "Reconocimiento"]). */
  tipos: string[];
  /** Texto del botón de envío. */
  submitText: string;
  /** Encabezado del estado de éxito. */
  successTitle: string;
  /** Cuerpo del estado de éxito. */
  successText: string;
  /** Correo institucional al que llegan los envíos. Solo lectura del servidor. */
  destinatarioEmail: string;
  /**
   * Subject del correo enviado por Resend. Soporta tokens {nombre} y {tipo}
   * (se reemplazan en runtime). Ej. "Nueva {tipo} — {nombre}".
   */
  asuntoEmail: string;
};

export type ContenidoPlantillaK = {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  ficha: {
    /** Nombre Lucide del servicio (ej. "utensils", "book-open"). */
    iconName: string;
    /** "gold" o "red" — color de acento de la ficha. */
    color: "gold" | "red";
    /** Párrafos de descripción del servicio. */
    descripcion: string[];
    /** 3 stats con icono+label+valor en la franja superior. */
    stats: StatPlantillaK[];
    /** Lista de pasos numerados (no se muestra si color === "red"). */
    pasos: string[];
    /** Collage: foto principal + 2 secundarias. */
    fotos: [string, string, string];
  };
  /**
   * Configuración del formulario que reemplaza la sección de pasos cuando
   * `ficha.color === "red"`. Pensado hoy para `servicios/quejas-sugerencias`.
   * Si está ausente se usan los defaults hardcoded.
   */
  formulario?: FormularioPlantillaK;
  /**
   * Configuración de la card "Revista Atenas" que aparece SOLO en
   * `/servicios/biblioteca`. Si está ausente o `enabled: false`, no
   * se renderiza. Si está presente y enabled, todos los textos y la URL
   * son editables desde el backoffice.
   */
  revistaAtenas?: RevistaAtenasConfig;
};

/** Card "Revista Atenas" editable (solo aplica a /servicios/biblioteca). */
export type RevistaAtenasConfig = {
  /** Si false, la card no se renderiza aunque biblioteca tenga este bloque. */
  enabled: boolean;
  /** Eyebrow pequeño dorado (ej. "RECURSO DESTACADO"). */
  eyebrow?: string;
  /** Título principal de la card (ej. "Revista Atenas"). */
  titulo?: string;
  /** Párrafo descriptivo bajo el título. */
  descripcion?: string;
  /** Texto del botón CTA. */
  ctaText?: string;
  /** URL del botón. Si es externa, se abre en nueva pestaña. */
  ctaUrl?: string;
  /** Foto de portada de la revista (aparece a la derecha de la card en desktop). */
  coverImage?: string;
  /** Alt text de la foto de portada. */
  coverAlt?: string;
};

/** Default vacío para crear una página nueva con plantilla K. */
export function defaultContenidoPlantillaK(): ContenidoPlantillaK {
  return {
    hero: {
      badge: "SERVICIOS INSTITUCIONALES",
      title: "Nuevo servicio",
      subtitle: "",
      ghostText: "",
    },
    ficha: {
      iconName: "circle",
      color: "gold",
      descripcion: ["Primer párrafo descriptivo del servicio."],
      stats: [
        { iconName: "map-pin", label: "UBICACIÓN", valor: "" },
        { iconName: "alarm-clock", label: "HORARIO", valor: "" },
        { iconName: "users", label: "ACCESO", valor: "" },
      ],
      pasos: ["Primer paso para acceder al servicio."],
      fotos: ["", "", ""],
    },
  };
}

// ─── Plantilla L (Ficha de espacio) ───────────────────────────

export type FichaItemPlantillaL = {
  /** Etiqueta corta (ej. "Niveles", "Modalidad"). */
  label: string;
  /** Valor (ej. "Todos los niveles"). */
  value: string;
  /** Si true, el value se pinta en dorado y bold. */
  highlight?: boolean;
};

export type ActividadPlantillaL = {
  /** Emoji al inicio de la card (ej. "🎵", "✈️"). */
  icon: string;
  title: string;
  desc: string;
  /** Si true, la card se pinta en dorado destacado. */
  highlight?: boolean;
};

export type ContenidoPlantillaL = {
  hero: {
    badge?: string;
    title: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  /** Bloque "Detalle": párrafos + tags + ficha técnica + nota + foto lateral. */
  detalle: {
    badge: string;
    heading: string;
    paragraphs: string[];
    tags: string[];
    nota: string;
    ficha: FichaItemPlantillaL[];
    photoSrc: string;
    photoAlt: string;
  };
  /** Bloque "Actividades": sección oscura con foto de fondo + título + lista. */
  actividades: {
    title: string;
    photoSrc: string;
    photoCaption: string;
    items: ActividadPlantillaL[];
  };
};

/** Default vacío para crear una página nueva con plantilla L. */
export function defaultContenidoPlantillaL(): ContenidoPlantillaL {
  return {
    hero: {
      badge: "ESPACIOS DE DESARROLLO",
      title: "Nuevo espacio",
      subtitle: "",
      ghostText: "",
    },
    detalle: {
      badge: "Espacio de desarrollo",
      heading: "Encabezado del espacio",
      paragraphs: ["Primer párrafo descriptivo del espacio."],
      tags: [],
      nota: "",
      ficha: [
        { label: "Niveles", value: "Todos los niveles" },
        { label: "Modalidad", value: "Presencial" },
      ],
      photoSrc: "",
      photoAlt: "",
    },
    actividades: {
      title: "Lo que hacemos",
      photoSrc: "",
      photoCaption: "",
      items: [],
    },
  };
}

// ─── Plantilla M (Home — 6 bloques con video YouTube) ─────────

/** Hero del Home — fondo con video YouTube en loop. */
export type HeroPlantillaM = {
  /**
   * URL de YouTube (formato libre: watch?v=, youtu.be/, /embed/, /shorts/).
   * Si está vacío se usa la foto de fondo `bgImageSrc` como fallback.
   */
  videoYoutubeUrl: string;
  /** Segundo de inicio del loop (default 0). */
  startSeconds: number;
  /** Segundo de fin del loop. Si es 0 o menor que start, no se aplica loop por tiempo. */
  endSeconds: number;
  /** Imagen de fondo cuando no hay video (o como cover mientras carga). */
  bgImageSrc: string;
  /**
   * Líneas del título en blanco (cada línea con su propia animación stagger).
   * El título actual del sitio: ["Formando líderes", "que transforman", "el Ecuador."].
   */
  titleLines: string[];
  /** Subtítulo / bajada bajo el título. */
  subtitle: string;
  /** Texto del link inferior (ej. "REPRODUCIR VIDEO"). */
  videoLinkText: string;
  /**
   * URL pública del video en YouTube (a la que el visitante va al hacer click
   * en "REPRODUCIR VIDEO"). Generalmente la misma de `videoYoutubeUrl`.
   */
  videoLinkUrl: string;
};

/** Tagline — eyebrow + título 2 líneas con underline animado. */
export type TaglinePlantillaM = {
  /** Etiqueta superior (ej. "Nuestra razón de ser"). */
  eyebrow: string;
  /**
   * Primera línea del título — completar la palabra/frase clave entre
   * "{" y "}" para que se aplique el underline dorado animado.
   * Ej.: "La {institución referente} de Ambato,"
   */
  line1: string;
  /** Segunda línea del título (sin underline). */
  line2: string;
};

/** Slide del HScroll (4 fijos: Académico, IB, Deporte, Comunidad). */
export type SlideHScrollPlantillaM = {
  /** Tab visible en la franja inferior y en la palabra superior del badge (ej. "ACADÉMICO"). */
  tab: string;
  /**
   * Palabra inferior del badge flotante (ej. "Potencial", "IB", "Campeones",
   * "Valores"). Aparece debajo de la palabra del tab dentro del círculo oscuro
   * que flota sobre el panel izquierdo del slide.
   */
  badgeText: string;
  /** Línea light del heading (ej. "Docentes de"). */
  headingLight: string;
  /** Línea bold/rojo del heading (ej. "Excepción."). */
  headingBold: string;
  /** Cuerpo desktop. */
  body: string;
  /** Cuerpo corto para mobile carousel. */
  mobileBody: string;
  /** 3 métricas (value + label). */
  metrics: { value: string; label: string }[];
  /**
   * Imagen principal del slide. En el slide 1 (Académico) ocupa todo el panel
   * izquierdo (full-bleed). En slides 2-4 (IB, Deporte, Comunidad) es la
   * imagen grande del collage izquierdo.
   */
  imagenPrincipal: string;
  /**
   * Imagen secundaria del collage. Solo se usa en slides 2-4 (IB, Deporte,
   * Comunidad). En el slide 1 se ignora. Posición y dimensiones fijas por
   * diseño Pencil.
   */
  imagenSecundaria: string;
};

export type HScrollPlantillaM = {
  /** Etiqueta superior decorativa visible en la sección. */
  ghostLabel: string;
  /** 4 slides en orden Académico → IB → Deporte → Comunidad. */
  slides: [
    SlideHScrollPlantillaM,
    SlideHScrollPlantillaM,
    SlideHScrollPlantillaM,
    SlideHScrollPlantillaM,
  ];
};

/** Stat editable dentro de Trayectoria. */
export type StatTrayectoriaPlantillaM = {
  /** Valor numérico (se anima con count-up). Si no es número, se muestra tal cual. */
  value: string;
  /** Sufijo después del número (ej. "+", "%"). */
  suffix: string;
  /** Etiqueta debajo del número. */
  label: string;
};

export type TrayectoriaPlantillaM = {
  /** Etiqueta corta arriba del título (ej. "Nuestra Trayectoria"). */
  eyebrow: string;
  /** Líneas del título (típicamente 2). */
  titleLines: string[];
  /** Subtítulo de un párrafo. */
  subtitle: string;
  /** Texto enorme decorativo del fondo (ej. "50 AÑOS"). */
  ghostText: string;
  /** Foto de fondo con parallax. */
  bgImageSrc: string;
  /** Stats animadas (típicamente 3). */
  stats: StatTrayectoriaPlantillaM[];
};

/** Card de un nivel educativo. */
export type CardNivelPlantillaM = {
  /** Eyebrow corto en mayúsculas (ej. "INICIAL"). */
  label: string;
  /**
   * Título visible. Usa "\n" para forzar quiebres de línea en desktop
   * (ej. "Educación\nInicial").
   */
  title: string;
  /** Descripción mostrada al hacer hover en desktop. */
  desc: string;
  /** Foto de fondo de la card. */
  img: string;
  /** Título corto alternativo para mobile (si vacío se usa `title`). */
  mobileTitle: string;
  /** Label alternativo para mobile (si vacío se usa `label`). */
  mobileLabel: string;
  /**
   * URL a la que va el visitante al hacer clic en la card. Interna
   * (ej. "/academico/niveles/inicial") o externa (https://…). Si está
   * vacía, la card no es clickeable.
   */
  href: string;
};

export type NivelesPlantillaM = {
  /** Etiqueta corta arriba del título (ej. "Niveles Educativos"). */
  eyebrow: string;
  /**
   * Líneas del título grande (desktop). Cada línea con su weight/opacity.
   * El sitio actual usa 5 líneas: "AQUÍ" / "EXPLORARÁS," / "CRECERÁS" /
   * "Y" (light, opacidad 0.6) / "BRILLARÁS.".
   */
  titleLines: { text: string; weight: 300 | 400 | 700; opacity: number }[];
  /** Título mobile (3 líneas — más corto y compacto). */
  mobileTitleLines: string[];
  /** Las 4 cards de niveles. */
  cards: [
    CardNivelPlantillaM,
    CardNivelPlantillaM,
    CardNivelPlantillaM,
    CardNivelPlantillaM,
  ];
};

/** Card de "Por qué Atenas". */
export type CardPorQuePlantillaM = {
  /** Eyebrow (ej. "Académico"). */
  label: string;
  /** Eyebrow alternativo para mobile (en mayúsculas). */
  mobileLabel: string;
  /** Título desktop. */
  title: string;
  /** Título alternativo para mobile (más corto). */
  mobileTitle: string;
  /** Descripción de la card. */
  desc: string;
  /** Foto. */
  img: string;
  /**
   * URL a la que va el visitante al hacer clic en el CTA "Conoce más"
   * (y en toda la card en mobile). Si está vacía, la card no es clickeable.
   */
  href: string;
};

export type PorQueAtenasPlantillaM = {
  /** Texto enorme decorativo de fondo (ej. "SÉ MÁS"). */
  ghostText: string;
  /** Eyebrow corto (ej. "Por qué Atenas"). */
  eyebrow: string;
  /** Primera parte del título — fuente light (ej. "Descubre incluso"). */
  titleLight: string;
  /** Segunda parte del título — fuente bold rojo, con underline (ej. "más."). */
  titleBold: string;
  /** Subtítulo (solo se ve en desktop). */
  subtitle: string;
  /** Las 4 cards. */
  cards: [
    CardPorQuePlantillaM,
    CardPorQuePlantillaM,
    CardPorQuePlantillaM,
    CardPorQuePlantillaM,
  ];
};

export type ContenidoPlantillaM = {
  hero: HeroPlantillaM;
  tagline: TaglinePlantillaM;
  hscroll: HScrollPlantillaM;
  trayectoria: TrayectoriaPlantillaM;
  niveles: NivelesPlantillaM;
  porQueAtenas: PorQueAtenasPlantillaM;
};

/** Default vacío para crear una página nueva con plantilla M. */
export function defaultContenidoPlantillaM(): ContenidoPlantillaM {
  return {
    hero: {
      videoYoutubeUrl: "",
      startSeconds: 0,
      endSeconds: 0,
      bgImageSrc: "",
      titleLines: ["Título del hero"],
      subtitle: "",
      videoLinkText: "REPRODUCIR VIDEO",
      videoLinkUrl: "",
    },
    tagline: {
      eyebrow: "Nuestra razón de ser",
      line1: "La {institución referente} de Ambato,",
      line2: "para toda la vida.",
    },
    hscroll: {
      ghostLabel: "Vive el Atenas",
      slides: [
        {
          tab: "ACADÉMICO",
          badgeText: "Potencial",
          headingLight: "",
          headingBold: "",
          body: "",
          mobileBody: "",
          metrics: [
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
          ],
          imagenPrincipal: "",
          imagenSecundaria: "",
        },
        {
          tab: "BACHILLERATO IB",
          badgeText: "IB",
          headingLight: "",
          headingBold: "",
          body: "",
          mobileBody: "",
          metrics: [
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
          ],
          imagenPrincipal: "",
          imagenSecundaria: "",
        },
        {
          tab: "DEPORTE",
          badgeText: "Campeones",
          headingLight: "",
          headingBold: "",
          body: "",
          mobileBody: "",
          metrics: [
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
          ],
          imagenPrincipal: "",
          imagenSecundaria: "",
        },
        {
          tab: "COMUNIDAD",
          badgeText: "Valores",
          headingLight: "",
          headingBold: "",
          body: "",
          mobileBody: "",
          metrics: [
            { value: "", label: "" },
            { value: "", label: "" },
            { value: "", label: "" },
          ],
          imagenPrincipal: "",
          imagenSecundaria: "",
        },
      ],
    },
    trayectoria: {
      eyebrow: "Nuestra Trayectoria",
      titleLines: ["", ""],
      subtitle: "",
      ghostText: "50 AÑOS",
      bgImageSrc: "",
      stats: [
        { value: "50", suffix: "+", label: "Años de excelencia" },
        { value: "1200", suffix: "+", label: "Estudiantes activos" },
        { value: "IB", suffix: "", label: "Bachillerato Internacional" },
      ],
    },
    niveles: {
      eyebrow: "Niveles Educativos",
      titleLines: [
        { text: "AQUÍ", weight: 700, opacity: 1 },
        { text: "EXPLORARÁS,", weight: 700, opacity: 1 },
        { text: "CRECERÁS", weight: 700, opacity: 1 },
        { text: "Y", weight: 300, opacity: 0.6 },
        { text: "BRILLARÁS.", weight: 700, opacity: 1 },
      ],
      mobileTitleLines: ["Aquí explorarás,", "crecerás", "y brillarás."],
      cards: [
        { label: "INICIAL", title: "", desc: "", img: "", mobileTitle: "", mobileLabel: "", href: "/academico/niveles/inicial" },
        { label: "BÁSICA", title: "", desc: "", img: "", mobileTitle: "", mobileLabel: "", href: "/academico/niveles/egb-elemental-media" },
        { label: "BGU", title: "", desc: "", img: "", mobileTitle: "", mobileLabel: "", href: "/academico/niveles/egb-superior" },
        { label: "IB", title: "", desc: "", img: "", mobileTitle: "", mobileLabel: "", href: "/academico/ib" },
      ],
    },
    porQueAtenas: {
      ghostText: "SÉ MÁS",
      eyebrow: "Por qué Atenas",
      titleLight: "Descubre incluso",
      titleBold: "más.",
      subtitle: "",
      cards: [
        { label: "", mobileLabel: "", title: "", mobileTitle: "", desc: "", img: "", href: "/academico" },
        { label: "", mobileLabel: "", title: "", mobileTitle: "", desc: "", img: "", href: "/el-atenas/valores" },
        { label: "", mobileLabel: "", title: "", mobileTitle: "", desc: "", img: "", href: "/academico/ib" },
        { label: "", mobileLabel: "", title: "", mobileTitle: "", desc: "", img: "", href: "/matriculas" },
      ],
    },
  };
}

