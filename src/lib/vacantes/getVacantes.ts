/**
 * Vacantes de «Trabaja con nosotros».
 *
 * El colegio publica sus vacantes en un Google Sites aparte porque el sitio no
 * tenía dónde ponerlas. Esto las trae al panel: talento humano abre y cierra
 * ofertas como edita cualquier otro contenido.
 */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Los tipos y constantes viven en ./tipos — puro, sin dependencias de
// servidor — para que los componentes de cliente puedan importarlos.
export {
  CATEGORIAS_VACANTE,
  CATEGORIA_VACANTE_INFO,
  venciPorFecha,
} from "./tipos";
export type { CategoriaVacante, Vacante } from "./tipos";

import type { Vacante } from "./tipos";

const COLUMNAS =
  "id, slug, titulo, resumen, categoria, descripcion, formacion, experiencia, " +
  "habilidades, imagen_url, formulario_id, activa, orden, cierra_en";

function normalizar(fila: Record<string, unknown>): Vacante {
  return {
    ...(fila as unknown as Vacante),
    habilidades: Array.isArray(fila.habilidades)
      ? (fila.habilidades as string[])
      : [],
  };
}

/**
 * Una vacante se considera cerrada cuando pasó su fecha de cierre, aunque
 * nadie la haya desactivado. Se compara solo la fecha: una vacante que cierra
 * «el 20» debe aceptar postulaciones durante todo el día 20.
 */
function estaVigente(v: Vacante): boolean {
  if (!v.activa) return false;
  if (!v.cierra_en) return true;
  const hoy = new Date().toISOString().slice(0, 10);
  return v.cierra_en >= hoy;
}

/** Vacantes que se muestran en el sitio, ya ordenadas. */
export async function getVacantesPublicas(): Promise<Vacante[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vacantes")
      .select(COLUMNAS)
      .eq("activa", true)
      .order("orden")
      .order("titulo");

    if (error || !data) return [];
    return data.map((f) => normalizar(f as unknown as Record<string, unknown>)).filter(estaVigente);
  } catch {
    return [];
  }
}

/** Una vacante por su dirección. Devuelve null si no existe o ya cerró. */
export async function getVacantePublica(slug: string): Promise<Vacante | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vacantes")
      .select(COLUMNAS)
      .eq("slug", slug)
      .eq("activa", true)
      .maybeSingle();

    if (error || !data) return null;
    const vacante = normalizar(data as unknown as Record<string, unknown>);
    return estaVigente(vacante) ? vacante : null;
  } catch {
    return null;
  }
}

/** Todas, incluidas las inactivas y vencidas. Solo para el panel. */
export async function listarVacantes(): Promise<Vacante[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vacantes")
    .select(COLUMNAS)
    .order("orden")
    .order("titulo");

  if (error || !data) {
    console.error("[vacantes]", error?.message);
    return [];
  }
  return data.map((f) => normalizar(f as unknown as Record<string, unknown>));
}

export async function getVacantePorId(id: string): Promise<Vacante | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vacantes")
    .select(COLUMNAS)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return normalizar(data as unknown as Record<string, unknown>);
}
