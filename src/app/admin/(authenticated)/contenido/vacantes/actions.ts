"use server";

/**
 * Gestión de vacantes.
 *
 * AUTORIZACIÓN: cada acción llama a `assertEditor()`. No hay envoltorio que lo
 * garantice, así que una acción nueva que se olvide del guard queda abierta a
 * cualquiera con sesión en el panel.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { puedeVerVacantes } from "@/lib/auth/areas";
import {
  CATEGORIAS_VACANTE,
  type CategoriaVacante,
} from "@/lib/vacantes/getVacantes";

export type VacanteActionState = { error: string | null; ok: boolean };

const SLUG_REGEX = /^[a-z0-9-]+$/;

async function assertEditor() {
  const user = await getCurrentUser();
  if (!user || !puedeVerVacantes(user)) {
    throw new Error("No autorizado");
  }
  return user;
}

function revalidar(slug?: string) {
  revalidatePath("/admin/contenido/vacantes");
  revalidatePath("/trabaja-con-nosotros");
  if (slug) revalidatePath(`/trabaja-con-nosotros/${slug}`);
}

function categoriaSegura(valor: string): CategoriaVacante {
  return CATEGORIAS_VACANTE.includes(valor as CategoriaVacante)
    ? (valor as CategoriaVacante)
    : "abierta";
}

/** Las habilidades se escriben una por línea. */
function parsearLista(bruto: string): string[] {
  return bruto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 30);
}

// ───────────────────────────────────────────────────────────

export async function crearVacanteAction(
  _prev: VacanteActionState,
  formData: FormData
): Promise<VacanteActionState> {
  await assertEditor();

  const titulo = String(formData.get("titulo") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (!titulo) return { error: "Ponle un título a la vacante.", ok: false };
  if (!slug) return { error: "La dirección es obligatoria.", ok: false };
  if (!SLUG_REGEX.test(slug)) {
    return {
      error:
        "La dirección solo admite minúsculas, números y guiones. Por ejemplo: docente-de-ingles.",
      ok: false,
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vacantes")
    .insert({
      titulo,
      slug,
      categoria: categoriaSegura(String(formData.get("categoria") ?? "")),
      // Nace desactivada: así se puede redactar con calma sin que aparezca a
      // medias en el sitio. Se publica desde el editor.
      activa: false,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe una vacante con esa dirección.", ok: false };
    }
    return { error: error.message, ok: false };
  }

  revalidar();
  redirect(`/admin/contenido/vacantes/${data.id}`);
}

export async function guardarVacanteAction(
  _prev: VacanteActionState,
  formData: FormData
): Promise<VacanteActionState> {
  const user = await assertEditor();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Falta el identificador.", ok: false };

  const titulo = String(formData.get("titulo") ?? "").trim();
  if (!titulo) return { error: "Ponle un título a la vacante.", ok: false };

  const activa = formData.get("activa") === "on";
  const formularioId = String(formData.get("formulario_id") ?? "").trim();

  // Una vacante publicada sin formulario es una oferta a la que nadie puede
  // postular: se ve el perfil y no hay dónde dejar los datos.
  if (activa && !formularioId) {
    return {
      error:
        "Para publicar la vacante hace falta elegir con qué formulario se postula. Sin eso, quien entre no tendrá dónde dejar sus datos.",
      ok: false,
    };
  }

  const cierraEn = String(formData.get("cierra_en") ?? "").trim();

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("vacantes")
    .update({
      titulo,
      resumen: String(formData.get("resumen") ?? "").trim() || null,
      categoria: categoriaSegura(String(formData.get("categoria") ?? "")),
      descripcion: String(formData.get("descripcion") ?? "").trim() || null,
      formacion: String(formData.get("formacion") ?? "").trim() || null,
      experiencia: String(formData.get("experiencia") ?? "").trim() || null,
      habilidades: parsearLista(String(formData.get("habilidades") ?? "")),
      imagen_url: String(formData.get("imagen_url") ?? "").trim() || null,
      formulario_id: formularioId || null,
      activa,
      orden: Number(formData.get("orden") ?? 0) || 0,
      cierra_en: cierraEn || null,
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) return { error: error.message, ok: false };

  const { data: fila } = await supabase
    .from("vacantes")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  revalidar(fila?.slug);
  return { error: null, ok: true };
}

/**
 * Borra la vacante. Las postulaciones NO se van con ella: viven en la bandeja
 * de su formulario, que es una tabla aparte. Aun así se avisa en la interfaz,
 * porque quien borra una vacante suele creer que se lleva todo por delante.
 */
export async function borrarVacanteAction(id: string): Promise<void> {
  await assertEditor();

  const supabase = createAdminClient();
  const { data: fila } = await supabase
    .from("vacantes")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("vacantes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidar(fila?.slug);
  redirect("/admin/contenido/vacantes");
}
