"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  defaultContenidoPlantillaR,
  defaultContenidoPlantillaS,
  defaultContenidoPlantillaT,
} from "../plantillas";

export type PaginaActionState = { error: string | null; ok: boolean };

const SLUG_REGEX = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;
/** Acepta el slug especial "/" (página Home) además del regex normal. */
function isValidSlug(slug: string): boolean {
  return slug === "/" || SLUG_REGEX.test(slug);
}

/**
 * Slugs cuyo primer segmento no puede ser usado para páginas del CMS:
 * o son rutas del sistema (admin, api), o son módulos dedicados que
 * tienen su propia jerarquía y bloquearían la edición desde el editor
 * genérico.
 */
const PRIMER_SEGMENTO_RESERVADO = new Set([
  "admin",
  "api",
  "_next",
  "_vercel",
  "reconocimientos",
  "documentos-institucionales",
  "cronograma-anual",
]);

function isSlugReservado(slug: string): boolean {
  if (slug === "/") return false; // Home es la excepción
  const firstSegment = slug.split("/")[0];
  return PRIMER_SEGMENTO_RESERVADO.has(firstSegment);
}

const PLANTILLAS_VALIDAS = [
  "tpl_a_hero_texto",
  "tpl_b_hero_grid",
  "tpl_c_hero_pasos",
  "tpl_d_hero_detalle",
  "tpl_f_hero_academico",
  "tpl_g_landing_ib",
  "tpl_h_landing_niveles",
  "tpl_i_historia",
  "tpl_j_landing_matriculas",
  "tpl_k_ficha_servicio",
  "tpl_l_ficha_espacio",
  "tpl_m_home",
  "tpl_n_trabaja",
  "tpl_o_admision_nivel",
  "tpl_p_admisiones_landing",
  "tpl_q_contactos_pagina",
  "tpl_r_grid_personas",
  "tpl_s_documento_politica",
  "tpl_t_portal_accesos",
];

/**
 * Plantillas K (ficha servicio), L (ficha espacio), N (trabaja con nosotros)
 * y O (admisión por nivel) NO pueden usarse para páginas nuevas creadas
 * desde el editor genérico: dependen de rutas físicas específicas y/o
 * componentes hardcoded.
 *
 * Las páginas ya creadas con esas plantillas siguen siendo editables; solo se
 * bloquea la creación de nuevas.
 */
const PLANTILLAS_BLOQUEADAS_NUEVAS = new Set([
  "tpl_k_ficha_servicio",
  "tpl_l_ficha_espacio",
  "tpl_n_trabaja",
  "tpl_o_admision_nivel",
  "tpl_p_admisiones_landing",
  "tpl_q_contactos_pagina",
]);

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [
      ROLES.SUPERADMIN,
      ROLES.EDITOR_COMM,
      ROLES.EDITOR_ACADEMICO,
    ])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

/**
 * Crea una nueva página en estado borrador con contenido por defecto
 * según la plantilla elegida. Redirige al editor.
 */
export async function crearPaginaAction(
  _prev: PaginaActionState,
  formData: FormData
): Promise<PaginaActionState> {
  const user = await assertEditor();

  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const titulo = String(formData.get("titulo") ?? "").trim();
  const plantilla = String(formData.get("plantilla") ?? "");

  if (!slug) return { error: "El slug es obligatorio.", ok: false };
  if (!isValidSlug(slug)) {
    return {
      error: "Slug inválido. Usa solo minúsculas, números, guiones y barras (/).",
      ok: false,
    };
  }
  if (isSlugReservado(slug)) {
    return {
      error:
        "Slug reservado. No puedes usar prefijos del sistema (admin, api) ni de módulos dedicados (reconocimientos, documentos-institucionales, cronograma-anual). Edita esos módulos desde su sección propia.",
      ok: false,
    };
  }
  if (!titulo) return { error: "El título interno es obligatorio.", ok: false };
  if (!PLANTILLAS_VALIDAS.includes(plantilla)) {
    return { error: "Plantilla no válida.", ok: false };
  }
  if (PLANTILLAS_BLOQUEADAS_NUEVAS.has(plantilla)) {
    return {
      error:
        "Esta plantilla solo se usa para fichas existentes de servicios y espacios. Para crear una página nueva con texto, hero y bloques, usa Plantilla A, B, C, D o F.",
      ok: false,
    };
  }

  const supabase = createAdminClient();

  // Contenido por defecto (depende de la plantilla)
  let contenidoDefault: Record<string, unknown> = {};

  if (plantilla === "tpl_a_hero_texto") {
    contenidoDefault = {
      hero: {
        badge: "QUIÉNES SOMOS",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
      },
      seccion: {
        badge: titulo.toUpperCase(),
        heading: titulo,
        paragraphs: ["Primer párrafo del contenido."],
        note: null,
        imageSrc: null,
        imageAlt: null,
      },
    };
  } else if (plantilla === "tpl_b_hero_grid") {
    contenidoDefault = {
      hero: {
        badge: "QUIÉNES SOMOS",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
      },
      seccion: {
        badge: titulo.toUpperCase(),
        heading: titulo,
        description: "Una breve descripción del grid de tarjetas.",
        items: [
          {
            icon: "star",
            title: "Primer pilar",
            description: "Descripción del primer pilar.",
          },
        ],
      },
    };
  } else if (plantilla === "tpl_c_hero_pasos") {
    contenidoDefault = {
      hero: {
        badge: "PROCESO",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
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
  } else if (plantilla === "tpl_d_hero_detalle") {
    contenidoDefault = {
      hero: {
        badge: "MATRÍCULAS",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
      },
      stats: [
        { valor: "—", label: "Stat 1" },
        { valor: "—", label: "Stat 2" },
      ],
      tabla: {
        heading: "Estructura de costos",
        columnas: ["Concepto", "Detalle"],
        filas: [{ celdas: ["Primera fila", "—"] }],
        acentoPrimeraColumna: true,
      },
    };
  } else if (plantilla === "tpl_f_hero_academico") {
    contenidoDefault = {
      hero: {
        badge: "ACADÉMICO",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
      },
      stats: [
        { label: "Programa", value: "—" },
        { label: "Nivel", value: "—" },
        { label: "Institución", value: "Unidad Educativa Atenas" },
      ],
      intro: {
        badge: titulo.toUpperCase(),
        heading: titulo,
        paragraphs: ["Primer párrafo de la página."],
        chipsLabel: "Componentes",
        chips: [],
        photos: ["", "", ""],
        badgeCollage: "ATENAS ★",
      },
      seccionInferior: { tipo: "ninguna" },
    };
  } else if (plantilla === "tpl_i_historia") {
    contenidoDefault = {
      hero: {
        ghostText: titulo.toUpperCase(),
        badge: "AÑOS DE HISTORIA",
        titleLine1: titulo,
        titleLine2: "",
        subtitle: "",
        caption: "",
      },
      fundacion: {
        badge: "Nuestros Orígenes",
        heading: "Cómo empezó todo",
        paragraph1: "",
        paragraph2: "",
        fotoPrincipal: "",
        fotoSecundaria1: "",
        fotoSecundaria2: "",
      },
      trayectoria: {
        badge: "Nuestra Trayectoria",
        heading: "Hitos que marcaron nuestra historia",
        ghostText: "",
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
        attribution: "Unidad Educativa Atenas",
      },
    };
  } else if (plantilla === "tpl_j_landing_matriculas") {
    contenidoDefault = {
      hero: {
        badge: "MATRÍCULAS",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
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
  } else if (plantilla === "tpl_k_ficha_servicio") {
    contenidoDefault = {
      hero: {
        badge: "SERVICIOS INSTITUCIONALES",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
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
  } else if (plantilla === "tpl_m_home") {
    contenidoDefault = {
      hero: {
        videoYoutubeUrl: "",
        startSeconds: 0,
        endSeconds: 0,
        bgImageSrc: "",
        titleLines: [titulo],
        subtitle: "",
        videoLinkText: "REPRODUCIR VIDEO",
        videoLinkUrl: "",
      },
      tagline: {
        eyebrow: "Nuestra razón de ser",
        line1: "Primera línea con {palabra clave} subrayada,",
        line2: "y segunda línea sin subrayado.",
      },
      hscroll: {
        ghostLabel: "Vive el Atenas",
        slides: [
          { tab: "ACADÉMICO", badgeText: "Potencial", headingLight: "", headingBold: "", body: "", mobileBody: "", metrics: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }], imagenPrincipal: "", imagenSecundaria: "" },
          { tab: "BACHILLERATO IB", badgeText: "IB", headingLight: "", headingBold: "", body: "", mobileBody: "", metrics: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }], imagenPrincipal: "", imagenSecundaria: "" },
          { tab: "DEPORTE", badgeText: "Campeones", headingLight: "", headingBold: "", body: "", mobileBody: "", metrics: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }], imagenPrincipal: "", imagenSecundaria: "" },
          { tab: "COMUNIDAD", badgeText: "Valores", headingLight: "", headingBold: "", body: "", mobileBody: "", metrics: [{ value: "", label: "" }, { value: "", label: "" }, { value: "", label: "" }], imagenPrincipal: "", imagenSecundaria: "" },
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
  } else if (plantilla === "tpl_l_ficha_espacio") {
    contenidoDefault = {
      hero: {
        badge: "ESPACIOS DE DESARROLLO",
        title: titulo,
        subtitle: "",
        ghostText: titulo.toUpperCase(),
      },
      detalle: {
        badge: titulo,
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
  } else if (plantilla === "tpl_r_grid_personas") {
    const defaults = defaultContenidoPlantillaR();
    contenidoDefault = {
      ...defaults,
      hero: { ...defaults.hero, title: titulo, ghostText: titulo.toUpperCase() },
      seccion: { ...defaults.seccion, heading: titulo },
    } as unknown as Record<string, unknown>;
  } else if (plantilla === "tpl_s_documento_politica") {
    const defaults = defaultContenidoPlantillaS();
    contenidoDefault = {
      ...defaults,
      hero: {
        ...defaults.hero,
        title: titulo,
        ghostText: titulo.toUpperCase(),
      },
      tituloDocumento: titulo,
    } as unknown as Record<string, unknown>;
  } else if (plantilla === "tpl_t_portal_accesos") {
    const defaults = defaultContenidoPlantillaT();
    contenidoDefault = {
      ...defaults,
      hero: { ...defaults.hero, title: titulo },
    } as unknown as Record<string, unknown>;
  }

  const { data, error } = await supabase
    .from("paginas")
    .insert({
      slug,
      plantilla,
      titulo,
      contenido: contenidoDefault,
      meta_title: `${titulo} — Unidad Educativa Atenas`,
      meta_description: "",
      publicada: false,
      updated_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe una página con ese slug.", ok: false };
    }
    return { error: "No se pudo crear la página.", ok: false };
  }

  revalidatePath("/admin/contenido/paginas");
  redirect(`/admin/contenido/paginas/${data.id}`);
}

/**
 * Guarda los cambios del editor de página. Recibe el JSON completo del
 * contenido + los campos meta + el toggle publicada.
 */
export async function guardarPaginaAction(
  _prev: PaginaActionState,
  formData: FormData
): Promise<PaginaActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "");
  const titulo = String(formData.get("titulo") ?? "").trim();
  const metaTitle = String(formData.get("meta_title") ?? "").trim();
  const metaDescription = String(formData.get("meta_description") ?? "").trim();
  const publicada = formData.get("publicada") === "on";
  const contenidoRaw = String(formData.get("contenido") ?? "");

  if (!id) return { error: "ID inválido.", ok: false };
  if (!titulo) return { error: "El título interno es obligatorio.", ok: false };

  let contenido: unknown;
  try {
    contenido = JSON.parse(contenidoRaw);
  } catch {
    return { error: "El contenido no es JSON válido.", ok: false };
  }

  const supabase = createAdminClient();

  // Recuperar el slug para revalidar la ruta pública
  const { data: existing } = await supabase
    .from("paginas")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("paginas")
    .update({
      titulo,
      contenido,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      publicada,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) return { error: "No se pudo guardar.", ok: false };

  revalidatePath("/admin/contenido/paginas");
  revalidatePath(`/admin/contenido/paginas/${id}`);
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
  return { error: null, ok: true };
}

/**
 * Cambia la plantilla de una página existente.
 *
 * Estrategia: si el contenido actual tiene un bloque `hero` y la plantilla
 * destino también soporta `hero` (toda la mayoría: A, B, C, D, F, J, K, L),
 * se preserva ese hero. El resto del JSONB se reinicia con los defaults de
 * la nueva plantilla. Esto permite migrar entre plantillas sin perder el
 * trabajo del Hero (que suele ser el más cuidado).
 *
 * **No se permite cambiar a/desde** páginas con slug que pertenezcan a un
 * módulo dedicado (Reconocimientos, Cronograma, Documentos) — esas no son
 * gestionadas desde la tabla `paginas`. Verificado por el slug.
 *
 * **Las plantillas K y L** (fichas) solo aplican a páginas con slug bajo
 * /servicios/* o /espacios/*. La validación viene del editor (UI) que
 * solo ofrece las plantillas válidas para cada caso.
 */
export async function cambiarPlantillaAction(
  _prev: PaginaActionState,
  formData: FormData
): Promise<PaginaActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "");
  const nuevaPlantilla = String(formData.get("plantilla") ?? "");

  if (!id) return { error: "ID inválido.", ok: false };
  if (!PLANTILLAS_VALIDAS.includes(nuevaPlantilla)) {
    return { error: "Plantilla no válida.", ok: false };
  }
  if (PLANTILLAS_BLOQUEADAS_NUEVAS.has(nuevaPlantilla)) {
    return {
      error:
        "No se puede cambiar a esta plantilla — solo se usa en /servicios/[slug] y /espacios/[slug] que dependen de datos hardcoded.",
      ok: false,
    };
  }

  const supabase = createAdminClient();

  // Leer la página actual
  const { data: pagina } = await supabase
    .from("paginas")
    .select("slug, plantilla, titulo, contenido")
    .eq("id", id)
    .maybeSingle();
  if (!pagina) return { error: "Página no encontrada.", ok: false };

  if (pagina.plantilla === nuevaPlantilla) {
    return { error: "La plantilla ya está seleccionada.", ok: false };
  }

  // Preservar el hero si existe en el contenido actual y la nueva plantilla lo soporta.
  const heroActual = (pagina.contenido as Record<string, unknown> | null)?.hero;
  const PLANTILLAS_CON_HERO = new Set([
    "tpl_a_hero_texto",
    "tpl_b_hero_grid",
    "tpl_c_hero_pasos",
    "tpl_d_hero_detalle",
    "tpl_f_hero_academico",
    "tpl_j_landing_matriculas",
    "tpl_k_ficha_servicio",
    "tpl_l_ficha_espacio",
  ]);
  const conservaHero =
    !!heroActual && PLANTILLAS_CON_HERO.has(nuevaPlantilla);

  // Construir contenido nuevo con defaults — duplicamos lógica de crearPaginaAction
  // pero conservando el título original.
  const titulo = pagina.titulo;
  let contenidoNuevo: Record<string, unknown> = {};

  if (nuevaPlantilla === "tpl_a_hero_texto") {
    contenidoNuevo = {
      hero: { badge: "", title: titulo, subtitle: "", ghostText: titulo.toUpperCase() },
      seccion: { badge: titulo.toUpperCase(), heading: titulo, paragraphs: ["Primer párrafo."], note: null, imageSrc: null, imageAlt: null },
    };
  } else if (nuevaPlantilla === "tpl_b_hero_grid") {
    contenidoNuevo = {
      hero: { badge: "", title: titulo, subtitle: "", ghostText: titulo.toUpperCase() },
      seccion: { badge: titulo.toUpperCase(), heading: titulo, description: "", items: [] },
    };
  } else if (nuevaPlantilla === "tpl_c_hero_pasos") {
    contenidoNuevo = {
      hero: { badge: "", title: titulo, subtitle: "", ghostText: titulo.toUpperCase() },
      intro: { badge: titulo.toUpperCase(), heading: titulo, descripcion: "" },
      pasos: { badge: "PROCESO", titulo: "Pasos", items: [] },
    };
  } else if (nuevaPlantilla === "tpl_d_hero_detalle") {
    contenidoNuevo = {
      hero: { badge: "", title: titulo, subtitle: "", ghostText: titulo.toUpperCase() },
      intro: { badge: titulo.toUpperCase(), heading: titulo, paragraphs: [] },
      stats: [],
      tabla: { heading: "Estructura", columnas: ["Concepto", "Detalle"], filas: [{ celdas: ["—", "—"] }] },
    };
  } else if (nuevaPlantilla === "tpl_f_hero_academico") {
    contenidoNuevo = {
      hero: { badge: "ACADÉMICO", title: titulo, subtitle: "", ghostText: titulo.toUpperCase() },
      stats: [
        { label: "Programa", value: "—" },
        { label: "Nivel", value: "—" },
        { label: "Institución", value: "Unidad Educativa Atenas" },
      ],
      intro: { badge: "Sección académica", heading: titulo, paragraphs: [""], chips: [], photos: ["", "", ""], badgeCollage: "ATENAS ★" },
      seccionInferior: { tipo: "ninguna" },
    };
  } else if (
    nuevaPlantilla === "tpl_g_landing_ib" ||
    nuevaPlantilla === "tpl_h_landing_niveles" ||
    nuevaPlantilla === "tpl_i_historia" ||
    nuevaPlantilla === "tpl_j_landing_matriculas" ||
    nuevaPlantilla === "tpl_m_home"
  ) {
    // Landings con bloques específicos: contenidoNuevo queda como objeto vacío con hero
    // y el editor de la plantilla se encarga de completar con defaults faltantes.
    contenidoNuevo = { hero: heroActual ?? { badge: "", title: titulo, subtitle: "" } };
  } else if (nuevaPlantilla === "tpl_r_grid_personas") {
    const defaults = defaultContenidoPlantillaR();
    contenidoNuevo = {
      ...defaults,
      hero: { ...defaults.hero, title: titulo, ghostText: titulo.toUpperCase() },
      seccion: { ...defaults.seccion, heading: titulo },
    } as unknown as Record<string, unknown>;
  } else if (nuevaPlantilla === "tpl_s_documento_politica") {
    const defaults = defaultContenidoPlantillaS();
    contenidoNuevo = {
      ...defaults,
      hero: {
        ...defaults.hero,
        title: titulo,
        ghostText: titulo.toUpperCase(),
      },
      tituloDocumento: titulo,
    } as unknown as Record<string, unknown>;
  } else if (nuevaPlantilla === "tpl_t_portal_accesos") {
    const defaults = defaultContenidoPlantillaT();
    contenidoNuevo = {
      ...defaults,
      hero: { ...defaults.hero, title: titulo },
    } as unknown as Record<string, unknown>;
  }

  // Si decidimos conservar el hero, lo sobreescribimos con el actual
  if (conservaHero) {
    contenidoNuevo.hero = heroActual;
  }

  const { error } = await supabase
    .from("paginas")
    .update({
      plantilla: nuevaPlantilla,
      contenido: contenidoNuevo,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23514") {
      return {
        error:
          "La nueva plantilla no es válida a nivel de BD. Verifica el CHECK constraint en la tabla `paginas`.",
        ok: false,
      };
    }
    return { error: `No se pudo cambiar la plantilla: ${error.message}`, ok: false };
  }

  revalidatePath("/admin/contenido/paginas");
  revalidatePath(`/admin/contenido/paginas/${id}`);
  if (pagina.slug) revalidatePath(`/${pagina.slug}`);

  return { error: null, ok: true };
}

export async function eliminarPaginaAction(
  _prev: PaginaActionState,
  formData: FormData
): Promise<PaginaActionState> {
  await assertEditor();

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();
  const { data: existing } = await supabase
    .from("paginas")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("paginas").delete().eq("id", id);
  if (error) return { error: "No se pudo eliminar.", ok: false };

  revalidatePath("/admin/contenido/paginas");
  if (existing?.slug) {
    revalidatePath(`/${existing.slug}`);
  }
  redirect("/admin/contenido/paginas");
}

/**
 * Asigna (o quita) el formulario que se pinta al final de una página.
 *
 * Va en una acción propia y no dentro de `guardarPaginaAction` a propósito:
 * cada plantilla tiene su propio editor —hay veinte— y meter el campo en el
 * formulario de guardado obligaría a tocar los veinte archivos. Aquí es un
 * solo control en la cabecera del editor, común a todas las plantillas.
 */
export async function asignarFormularioAction(
  _prev: PaginaActionState,
  formData: FormData
): Promise<PaginaActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "ID inválido.", ok: false };

  const formularioId = String(formData.get("formulario_id") ?? "").trim();

  const supabase = createAdminClient();

  // Comprobar que existe antes de guardarlo: la clave foránea lo rechazaría
  // igual, pero con un error de Postgres que no dice nada al editor.
  if (formularioId) {
    const { data: existe } = await supabase
      .from("formularios")
      .select("id")
      .eq("id", formularioId)
      .maybeSingle();
    if (!existe) {
      return { error: "Ese formulario ya no existe.", ok: false };
    }
  }

  const { data: pagina } = await supabase
    .from("paginas")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("paginas")
    .update({ formulario_id: formularioId || null, updated_by: user.id })
    .eq("id", id);

  if (error) return { error: "No se pudo guardar.", ok: false };

  revalidatePath(`/admin/contenido/paginas/${id}`);
  if (pagina?.slug) revalidatePath(`/${pagina.slug}`);
  return { error: null, ok: true };
}
