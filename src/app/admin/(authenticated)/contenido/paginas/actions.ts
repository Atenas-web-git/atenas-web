"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type PaginaActionState = { error: string | null; ok: boolean };

const SLUG_REGEX = /^[a-z0-9-]+(\/[a-z0-9-]+)*$/;
const PLANTILLAS_VALIDAS = [
  "tpl_a_hero_texto",
  "tpl_b_hero_grid",
  "tpl_c_hero_pasos",
  "tpl_d_hero_detalle",
  "tpl_e_hero_galeria",
  "tpl_f_hero_academico",
  "tpl_g_landing_ib",
  "tpl_h_landing_niveles",
  "tpl_i_historia",
  "tpl_j_landing_matriculas",
  "tpl_k_ficha_servicio",
  "tpl_l_ficha_espacio",
];

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
  if (!SLUG_REGEX.test(slug)) {
    return {
      error: "Slug inválido. Usa solo minúsculas, números, guiones y barras (/).",
      ok: false,
    };
  }
  if (!titulo) return { error: "El título interno es obligatorio.", ok: false };
  if (!PLANTILLAS_VALIDAS.includes(plantilla)) {
    return { error: "Plantilla no válida.", ok: false };
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
