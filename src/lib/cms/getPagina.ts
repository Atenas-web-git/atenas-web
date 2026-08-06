import { createClient } from "@/lib/supabase/server";

export type PaginaPublicada = {
  id: string;
  slug: string;
  plantilla: string;
  titulo: string;
  contenido: Record<string, unknown>;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  /**
   * Formulario del motor que se pinta al final de la página, si la página
   * tiene uno asignado. Va como columna y no dentro de `contenido` para que
   * se pueda poner en cualquiera de las 20 plantillas con un solo control.
   */
  formulario_id: string | null;
};

/**
 * Lee una página publicada por slug. Devuelve null si no existe o si está
 * en borrador. Las RLS de Supabase ya filtran por `publicada = true` para
 * el rol anon, así que es seguro llamarlo desde server components públicos.
 *
 * Si Supabase falla (tabla no existe, error de red, etc.) devuelve null
 * para que la página pueda usar contenido fallback hardcoded.
 */
export async function getPagina(slug: string): Promise<PaginaPublicada | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("paginas")
      .select("id, slug, plantilla, titulo, contenido, meta_title, meta_description, og_image_url, formulario_id")
      .eq("slug", slug)
      .eq("publicada", true)
      .maybeSingle();

    if (error || !data) return null;

    return data as PaginaPublicada;
  } catch {
    return null;
  }
}
