import { createClient } from "@/lib/supabase/server";

export type DocumentoCategoriaPublica = {
  id: number;
  slug: string;
  nombre: string;
  icono: string | null;
  color: "gold" | "red" | "teal" | "navy" | "purple";
  orden: number;
};

export type DocumentoPublico = {
  id: number;
  titulo: string;
  descripcion: string | null;
  categoria_id: number;
  drive_url: string;
  orden: number;
};

/**
 * Lee categorías y documentos publicados para el listado público
 * en `/documentos-institucionales`. Devuelve null si Supabase falla
 * (la página puede caer al FALLBACK hardcoded).
 *
 * Solo trae documentos con `drive_url` no vacío para no mostrar
 * fichas sin link funcional.
 */
export async function getDocumentosPublicos(): Promise<{
  categorias: DocumentoCategoriaPublica[];
  documentos: DocumentoPublico[];
} | null> {
  try {
    const supabase = await createClient();

    const [{ data: categorias, error: errCats }, { data: documentos, error: errDocs }] =
      await Promise.all([
        supabase
          .from("documentos_categorias")
          .select("id, slug, nombre, icono, color, orden")
          .order("orden", { ascending: true }),
        supabase
          .from("documentos")
          .select("id, titulo, descripcion, categoria_id, drive_url, orden")
          .eq("publicado", true)
          .neq("drive_url", "")
          .order("categoria_id", { ascending: true })
          .order("orden", { ascending: true }),
      ]);

    if (errCats || errDocs) return null;

    return {
      categorias: (categorias ?? []) as DocumentoCategoriaPublica[],
      documentos: (documentos ?? []) as DocumentoPublico[],
    };
  } catch {
    return null;
  }
}
