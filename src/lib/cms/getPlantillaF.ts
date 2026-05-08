import { getPagina } from "./getPagina";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

/**
 * Lee una página publicada con plantilla F y devuelve el contenido
 * tipado. Si la página no está en BD o no está publicada, devuelve null
 * para que la page pueda caer al fallback hardcoded.
 */
export async function getPlantillaF(slug: string): Promise<{
  contenido: ContenidoPlantillaF;
  meta_title: string | null;
  meta_description: string | null;
} | null> {
  const pagina = await getPagina(slug);
  if (!pagina) return null;
  return {
    contenido: pagina.contenido as unknown as ContenidoPlantillaF,
    meta_title: pagina.meta_title,
    meta_description: pagina.meta_description,
  };
}
