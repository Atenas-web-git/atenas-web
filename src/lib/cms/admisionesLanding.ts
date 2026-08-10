/**
 * Tipos, constantes y helpers PUROS para el contenido editable de la
 * página pública /admisiones (landing).
 *
 * Vive aparte de `getConfiguracion.ts` para que los client components
 * puedan importar los tipos sin arrastrar `next/headers` (patrón #25).
 */

export type AdmisionesCTA = {
  label: string;
  href: string;
};

export type AdmisionesStat = {
  value: string;
  label: string;
};

export type AdmisionesProcesoPaso = {
  num: string;
  title: string;
  desc: string;
};

export type AdmisionesNivelCard = {
  /** Texto del badge superior izquierdo de la card (ej. "01", "IB★"). */
  num: string;
  title: string;
  grades: string;
  age: string;
  /** Si true, la card se pinta con acento dorado destacado. */
  highlight: boolean;
};

export type AdmisionesExplorarCard = {
  /** Slug interno (ej. "inicial"). Se concatena con "/admisiones/" si no hay `href` explícito. */
  slug: string;
  /** Emoji decorativo (ej. "🌱"). */
  icon: string;
  title: string;
  grades: string;
  age: string;
  desc: string;
  highlight: boolean;
  /** Texto del CTA al pie de la card. Si vacío, usa "Ver requisitos". */
  ctaLabel: string;
  /** URL del CTA. Si vacío, se construye automáticamente como `/admisiones/${slug}`. */
  href: string;
};

export type AdmisionesFAQItem = {
  pregunta: string;
  respuesta: string;
};

export type AdmisionesLandingConfig = {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    /** Antes del fragmento subrayado. */
    subtitlePre: string;
    /** Fragmento que se subraya en dorado. */
    subtitleHighlight: string;
    /** Después del fragmento subrayado. */
    subtitlePost: string;
    ghostText: string;
    bgImage: string;
    /** Texto grande del badge flotante (ej. "2026"). */
    badgeValue: string;
    /** Texto chico del badge flotante (ej. "INSCRIPCIONES ABIERTAS"). */
    badgeLabel: string;
    /** 3 fotos del collage flotante (desktop). */
    floatingPhotos: [string, string, string];
    ctaPrimary: AdmisionesCTA;
    ctaSecondary: AdmisionesCTA;
    /** Stats bar inferior del hero (típicamente 3). */
    stats: AdmisionesStat[];
  };
  proceso: {
    eyebrow: string;
    /** Antes del fragmento subrayado del heading. */
    headingPre: string;
    /** Fragmento que se subraya en dorado. */
    headingHighlight: string;
    description: string;
    fotoPrincipal: string;
    fotoSecundaria: string;
    badgeFloating: string;
    /** Pasos del proceso global (típicamente 5). */
    pasos: AdmisionesProcesoPaso[];
  };
  niveles: {
    eyebrow: string;
    headingPre: string;
    headingHighlight: string;
    description: string;
    fotoPrincipal: string;
    fotoSecundaria: string;
    badgeFloating: string;
    items: AdmisionesNivelCard[];
  };
  explorar: {
    eyebrow: string;
    heading: string;
    description: string;
    items: AdmisionesExplorarCard[];
  };
  visita: {
    eyebrow: string;
    headingPre: string;
    headingHighlight: string;
    description: string;
    /** Texto del icono 📍 (ej. "Ambato, Ecuador"). */
    ubicacion: string;
    /** Texto del icono 🕐 (ej. "Lun – Vie · 08:00–16:00"). */
    horarioCorto: string;
    ctaPrimary: AdmisionesCTA;
    ctaSecondary: AdmisionesCTA;
    /** Línea pequeña con teléfono y correo. */
    contactoLine: string;
    /** 3 fotos del collage izquierdo. */
    fotos: [string, string, string];
    badgeFloating: {
      linea1: string;
      linea2: string;
    };
  };
  /**
   * Sección FAQ visible en /admisiones. También se inyecta como JSON-LD
   * FAQPage (SEO-crítico). Si `items` está vacío, la sección no se
   * renderiza pero el JSON-LD tampoco (consistente).
   */
  faq: {
    eyebrow: string;
    heading: string;
    description: string;
    items: AdmisionesFAQItem[];
  };
};

export const ADMISIONES_LANDING_DEFAULT: AdmisionesLandingConfig = {
  hero: {
    eyebrow: "PROCESO DE ADMISIÓN 2026",
    titleLine1: "Tu futuro",
    titleLine2: "empieza aquí.",
    subtitlePre: "Únete a la comunidad",
    subtitleHighlight: "Atenas",
    subtitlePost:
      "y forma parte de cinco décadas de excelencia educativa en Ecuador.",
    ghostText: "ADMISIONES",
    bgImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1440&q=80",
    badgeValue: "2026",
    badgeLabel: "INSCRIPCIONES ABIERTAS",
    floatingPhotos: [
      "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
    ],
    ctaPrimary: { label: "Iniciar proceso", href: "/admisiones/formulario" },
    ctaSecondary: { label: "Agendar visita", href: "#visita" },
    stats: [
      { value: "50+", label: "Años de excelencia" },
      { value: "5.000+", label: "Familias que nos eligen" },
      { value: "1°", label: "Programa IB en Ambato" },
    ],
  },
  proceso: {
    eyebrow: "Cómo unirse",
    headingPre: "El camino hacia",
    headingHighlight: "el Atenas.",
    description:
      "Un proceso claro, humano y transparente para que tu familia se incorpore a la comunidad Atenas con total confianza.",
    fotoPrincipal:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    fotoSecundaria:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80",
    badgeFloating: "CUPOS LIMITADOS 2026",
    pasos: [
      { num: "01", title: "Solicitud en línea", desc: "Completa el formulario de pre-inscripción con los datos del estudiante y el nivel educativo deseado." },
      { num: "02", title: "Entrevista familiar", desc: "Coordinamos una reunión con las autoridades del colegio para conocer a la familia y al estudiante." },
      { num: "03", title: "Evaluación diagnóstica", desc: "El estudiante realiza una evaluación de diagnóstico acorde a su nivel. Es formativa, no eliminatoria." },
      { num: "04", title: "Revisión de documentos", desc: "Entrega de libreta de calificaciones, copia de cédula y certificado de salud del año anterior." },
      { num: "05", title: "Matriculación", desc: "Una vez aprobado el proceso, se coordina la firma del contrato y el pago de matrícula." },
    ],
  },
  niveles: {
    eyebrow: "Niveles Educativos",
    headingPre: "Elige el nivel",
    headingHighlight: "correcto.",
    description:
      "Desde los primeros pasos en Inicial hasta el Diploma Internacional IB, acompañamos a cada estudiante en cada etapa de su formación.",
    fotoPrincipal:
      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80",
    fotoSecundaria:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
    badgeFloating: "BACHILLERATO IB · AMBATO",
    items: [
      { num: "01",  title: "Inicial",                    grades: "Pre-Kinder y Kinder", age: "3-5 años",   highlight: false },
      { num: "02",  title: "Básica Elemental",            grades: "1ro a 4to EGB",       age: "5-9 años",   highlight: false },
      { num: "03",  title: "Básica Media-Superior",       grades: "5to a 10mo EGB",      age: "10-14 años", highlight: false },
      { num: "04",  title: "Bachillerato General",        grades: "1ro a 3ro BGU",       age: "15-17 años", highlight: false },
      { num: "IB★", title: "Bachillerato Internacional",  grades: "Diploma IB",          age: "1ro a 3ro",  highlight: true  },
    ],
  },
  explorar: {
    eyebrow: "Proceso por nivel",
    heading: "Conoce los requisitos de tu nivel",
    description:
      "Cada nivel tiene su propio proceso, documentos y requisitos. Selecciona el que corresponde al estudiante para ver la información completa.",
    items: [
      { slug: "inicial",             icon: "🌱", title: "Educación Inicial",   grades: "Pre-Kinder y Kinder",   age: "3 – 5 años",  desc: "Los primeros pasos: metodologías Montessori, Reggio Emilia y ABN en un entorno bilingüe y estimulante.", highlight: false, ctaLabel: "Ver requisitos", href: "/admisiones/inicial" },
      { slug: "egb-elemental-media", icon: "📚", title: "EGB Elemental y Media", grades: "1ro a 7mo grado",     age: "6 – 12 años", desc: "Formación bilingüe con pensamiento lógico-matemático, valores y bases académicas sólidas.", highlight: false, ctaLabel: "Ver requisitos", href: "/admisiones/egb-elemental-media" },
      { slug: "egb-superior",        icon: "🔬", title: "EGB Superior",          grades: "8vo a 10mo grado",    age: "12 – 15 años", desc: "Etapa de preparación para el Bachillerato IB: inglés avanzado, ciencias y liderazgo.", highlight: false, ctaLabel: "Ver requisitos", href: "/admisiones/egb-superior" },
      { slug: "ib",                  icon: "★",  title: "Bachillerato IB",       grades: "1ro y 2do Bachillerato", age: "14 – 17 años", desc: "Programa del Diploma Internacional. Cupos limitados, selección por mérito académico.", highlight: true, ctaLabel: "Ver requisitos", href: "/admisiones/ib" },
    ],
  },
  visita: {
    eyebrow: "Visita el Campus",
    headingPre: "Ven a conocer",
    headingHighlight: "el Atenas.",
    description:
      "Agenda una visita guiada y descubre nuestras instalaciones, metodología y el ambiente que hace especial a Atenas. Sin compromiso.",
    ubicacion: "Ambato, Ecuador",
    horarioCorto: "Lun – Vie · 08:00–16:00",
    ctaPrimary: { label: "Agendar visita", href: "mailto:admisiones@atenas.edu.ec" },
    ctaSecondary: { label: "Ver proceso", href: "#proceso" },
    contactoLine: "03 2854281 ext. 135 · admisiones@atenas.edu.ec",
    fotos: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
    ],
    badgeFloating: {
      linea1: "Lun a Vie",
      linea2: "08:00 – 16:00",
    },
  },
  faq: {
    eyebrow: "Preguntas frecuentes",
    heading: "Lo que las familias preguntan más",
    description: "",
    items: [
      { pregunta: "¿Cuáles son los niveles educativos que ofrece el Colegio Atenas en Ambato?", respuesta: "La Unidad Educativa Atenas ofrece Educación Inicial (3–5 años), Educación General Básica Elemental y Media (1.° a 7.° grado), Educación General Básica Superior (8.° a 10.° grado) y Bachillerato Internacional IB (1.° a 3.° de bachillerato)." },
      { pregunta: "¿Cómo es el proceso de admisión en la Unidad Educativa Atenas?",            respuesta: "El proceso consta de 4 pasos: 1) Solicitud de información, 2) Visita a las instalaciones, 3) Entrevista familiar y evaluación diagnóstica, 4) Confirmación de matrícula. Puedes iniciar el proceso en línea desde nuestra página de admisiones." },
      { pregunta: "¿El Colegio Atenas tiene el Bachillerato Internacional (IB)?",              respuesta: "Sí. La Unidad Educativa Atenas es un colegio acreditado por la International Baccalaureate Organization (IBO) y ofrece el Diploma del Bachillerato Internacional (IBDP) en Izamba, Ambato, Ecuador." },
      { pregunta: "¿Dónde está ubicado el Colegio Atenas?",                                    respuesta: "Estamos ubicados en la Calle Gabriel Román s/n y Av. Pedro Vásconez, parroquia Izamba, Ambato, Tungurahua, Ecuador. Código postal 180103." },
      { pregunta: "¿A qué número puedo llamar para información sobre admisiones?",             respuesta: "Puedes llamarnos al +593 3 285-4281 o escribirnos a admisiones@atenas.edu.ec. Atendemos de lunes a viernes de 07:00 a 17:00." },
      { pregunta: "¿El Colegio Atenas tiene certificación ISO 9001?",                          respuesta: "Sí. La Unidad Educativa Atenas cuenta con certificación ISO 9001 en gestión de calidad educativa, lo que garantiza procesos institucionales estandarizados y mejora continua." },
    ],
  },
};

function mergeCTA(
  input: Partial<AdmisionesCTA> | undefined,
  def: AdmisionesCTA
): AdmisionesCTA {
  return {
    label: input?.label?.trim() || def.label,
    href: input?.href?.trim() || def.href,
  };
}

function trimList<T>(
  raw: unknown,
  normalize: (item: unknown) => T | null,
  def: T[]
): T[] {
  if (!Array.isArray(raw)) return def;
  const out: T[] = [];
  for (const item of raw) {
    const v = normalize(item);
    if (v !== null) out.push(v);
  }
  return out.length > 0 ? out : def;
}

export function mergeAdmisionesLanding(
  input: Partial<AdmisionesLandingConfig> | null
): AdmisionesLandingConfig {
  if (!input) return ADMISIONES_LANDING_DEFAULT;
  const def = ADMISIONES_LANDING_DEFAULT;

  const heroFotos = Array.isArray(input.hero?.floatingPhotos)
    ? (input.hero!.floatingPhotos.slice(0, 3).map((p) => String(p ?? "").trim()) as string[])
    : def.hero.floatingPhotos;
  const heroFotosFull: [string, string, string] = [
    heroFotos[0] || def.hero.floatingPhotos[0],
    heroFotos[1] || def.hero.floatingPhotos[1],
    heroFotos[2] || def.hero.floatingPhotos[2],
  ];

  const stats = trimList<AdmisionesStat>(
    input.hero?.stats,
    (raw) => {
      const r = raw as Partial<AdmisionesStat>;
      const value = r?.value?.trim();
      const label = r?.label?.trim();
      return value && label ? { value, label } : null;
    },
    def.hero.stats
  );

  const pasos = trimList<AdmisionesProcesoPaso>(
    input.proceso?.pasos,
    (raw) => {
      const r = raw as Partial<AdmisionesProcesoPaso>;
      const num = r?.num?.trim();
      const title = r?.title?.trim();
      const desc = r?.desc?.trim();
      return num && title && desc ? { num, title, desc } : null;
    },
    def.proceso.pasos
  );

  const nivelesItems = trimList<AdmisionesNivelCard>(
    input.niveles?.items,
    (raw) => {
      const r = raw as Partial<AdmisionesNivelCard>;
      const num = r?.num?.trim();
      const title = r?.title?.trim();
      const grades = r?.grades?.trim();
      const age = r?.age?.trim();
      return num && title && grades && age
        ? { num, title, grades, age, highlight: Boolean(r?.highlight) }
        : null;
    },
    def.niveles.items
  );

  const explorarItems = trimList<AdmisionesExplorarCard>(
    input.explorar?.items,
    (raw) => {
      const r = raw as Partial<AdmisionesExplorarCard>;
      const slug = r?.slug?.trim();
      const title = r?.title?.trim();
      if (!slug || !title) return null;
      const ctaLabel = r?.ctaLabel?.trim() || "Ver requisitos";
      const href = r?.href?.trim() || `/admisiones/${slug}`;
      return {
        slug,
        icon: r?.icon?.trim() || "•",
        title,
        grades: r?.grades?.trim() || "",
        age: r?.age?.trim() || "",
        desc: r?.desc?.trim() || "",
        highlight: Boolean(r?.highlight),
        ctaLabel,
        href,
      };
    },
    def.explorar.items
  );

  const visitaFotos = Array.isArray(input.visita?.fotos)
    ? (input.visita!.fotos.slice(0, 3).map((p) => String(p ?? "").trim()) as string[])
    : def.visita.fotos;
  const visitaFotosFull: [string, string, string] = [
    visitaFotos[0] || def.visita.fotos[0],
    visitaFotos[1] || def.visita.fotos[1],
    visitaFotos[2] || def.visita.fotos[2],
  ];

  // FAQ acepta dos formatos para retro-compatibilidad:
  //   - array plano de items (formato seedado originalmente)
  //   - objeto con { eyebrow, heading, description, items }
  // El frontend siempre consume el formato nuevo.
  const faqInput = input.faq;
  const faqItemsRaw = Array.isArray(faqInput)
    ? faqInput
    : (faqInput as { items?: unknown[] } | undefined)?.items;
  const faqHeader = Array.isArray(faqInput)
    ? undefined
    : (faqInput as Partial<AdmisionesLandingConfig["faq"]> | undefined);
  const faqItems = trimList<AdmisionesFAQItem>(
    faqItemsRaw,
    (raw) => {
      const r = raw as Partial<AdmisionesFAQItem>;
      const pregunta = r?.pregunta?.trim();
      const respuesta = r?.respuesta?.trim();
      return pregunta && respuesta ? { pregunta, respuesta } : null;
    },
    def.faq.items
  );

  return {
    hero: {
      eyebrow: input.hero?.eyebrow?.trim() || def.hero.eyebrow,
      titleLine1: input.hero?.titleLine1?.trim() || def.hero.titleLine1,
      titleLine2: input.hero?.titleLine2?.trim() || def.hero.titleLine2,
      subtitlePre: input.hero?.subtitlePre?.trim() ?? def.hero.subtitlePre,
      subtitleHighlight: input.hero?.subtitleHighlight?.trim() || def.hero.subtitleHighlight,
      subtitlePost: input.hero?.subtitlePost?.trim() ?? def.hero.subtitlePost,
      ghostText: input.hero?.ghostText?.trim() || def.hero.ghostText,
      bgImage: input.hero?.bgImage?.trim() || def.hero.bgImage,
      badgeValue: input.hero?.badgeValue?.trim() || def.hero.badgeValue,
      badgeLabel: input.hero?.badgeLabel?.trim() || def.hero.badgeLabel,
      floatingPhotos: heroFotosFull,
      ctaPrimary: mergeCTA(input.hero?.ctaPrimary, def.hero.ctaPrimary),
      ctaSecondary: mergeCTA(input.hero?.ctaSecondary, def.hero.ctaSecondary),
      stats,
    },
    proceso: {
      eyebrow: input.proceso?.eyebrow?.trim() || def.proceso.eyebrow,
      headingPre: input.proceso?.headingPre?.trim() || def.proceso.headingPre,
      headingHighlight: input.proceso?.headingHighlight?.trim() || def.proceso.headingHighlight,
      description: input.proceso?.description ?? def.proceso.description,
      fotoPrincipal: input.proceso?.fotoPrincipal?.trim() || def.proceso.fotoPrincipal,
      fotoSecundaria: input.proceso?.fotoSecundaria?.trim() || def.proceso.fotoSecundaria,
      badgeFloating: input.proceso?.badgeFloating?.trim() || def.proceso.badgeFloating,
      pasos,
    },
    niveles: {
      eyebrow: input.niveles?.eyebrow?.trim() || def.niveles.eyebrow,
      headingPre: input.niveles?.headingPre?.trim() || def.niveles.headingPre,
      headingHighlight: input.niveles?.headingHighlight?.trim() || def.niveles.headingHighlight,
      description: input.niveles?.description ?? def.niveles.description,
      fotoPrincipal: input.niveles?.fotoPrincipal?.trim() || def.niveles.fotoPrincipal,
      fotoSecundaria: input.niveles?.fotoSecundaria?.trim() || def.niveles.fotoSecundaria,
      badgeFloating: input.niveles?.badgeFloating?.trim() || def.niveles.badgeFloating,
      items: nivelesItems,
    },
    explorar: {
      eyebrow: input.explorar?.eyebrow?.trim() || def.explorar.eyebrow,
      heading: input.explorar?.heading?.trim() || def.explorar.heading,
      description: input.explorar?.description ?? def.explorar.description,
      items: explorarItems,
    },
    visita: {
      eyebrow: input.visita?.eyebrow?.trim() || def.visita.eyebrow,
      headingPre: input.visita?.headingPre?.trim() || def.visita.headingPre,
      headingHighlight: input.visita?.headingHighlight?.trim() || def.visita.headingHighlight,
      description: input.visita?.description ?? def.visita.description,
      ubicacion: input.visita?.ubicacion?.trim() || def.visita.ubicacion,
      horarioCorto: input.visita?.horarioCorto?.trim() || def.visita.horarioCorto,
      ctaPrimary: mergeCTA(input.visita?.ctaPrimary, def.visita.ctaPrimary),
      ctaSecondary: mergeCTA(input.visita?.ctaSecondary, def.visita.ctaSecondary),
      contactoLine: input.visita?.contactoLine?.trim() || def.visita.contactoLine,
      fotos: visitaFotosFull,
      badgeFloating: {
        linea1: input.visita?.badgeFloating?.linea1?.trim() || def.visita.badgeFloating.linea1,
        linea2: input.visita?.badgeFloating?.linea2?.trim() || def.visita.badgeFloating.linea2,
      },
    },
    faq: {
      eyebrow: faqHeader?.eyebrow?.trim() || def.faq.eyebrow,
      heading: faqHeader?.heading?.trim() || def.faq.heading,
      description: faqHeader?.description ?? def.faq.description,
      items: faqItems,
    },
  };
}
