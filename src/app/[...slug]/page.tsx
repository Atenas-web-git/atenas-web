// Catch-all dinámico del CMS.
//
// Sirve cualquier página publicada en `paginas` cuyo slug NO esté cubierto
// por una ruta física en `src/app/...`. Next.js da prioridad a rutas
// físicas, así que las páginas existentes (Misión, Visión, Servicios, etc.)
// siguen sirviéndose por sus archivos `page.tsx` específicos como antes.
//
// Cuando el editor crea una página nueva con un slug arbitrario que NO
// coincide con ninguna ruta física existente, este catch-all la sirve
// renderizándola con el componente `PlantillaRenderer`.
//
// Plantillas soportadas: A, B, C, D, F, G, H, I, J, M (las "genéricas").
// Las K y L (fichas de servicio/espacio) están bloqueadas en el editor
// para slugs nuevos porque dependen de datos hardcoded de cada item.
//
// ISR: revalida cada 60s + revalidatePath invalida al editar.
// dynamicParams = true para que slugs nuevos se sirvan on-demand sin
// rebuild.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPagina } from "@/lib/cms/getPagina";
import {
  PlantillaRenderer,
  PLANTILLAS_SOPORTADAS_CATCH_ALL,
} from "@/components/cms/PlantillaRenderer";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string[] }> };

/**
 * Prefijos reservados — slugs cuyo primer segmento coincide con uno de estos
 * NUNCA se sirven desde el catch-all. Cubre rutas del sistema (admin, api)
 * y rutas físicas conocidas que tienen su propio comportamiento (módulos
 * dedicados, rutas dinámicas con datos hardcoded).
 *
 * Las rutas físicas que SÍ leen de `paginas` con su slug (ej. el-atenas/mision)
 * NO entran aquí porque Next.js las prioriza naturalmente sobre el catch-all.
 * El catch-all solo se activa cuando la ruta física no existe.
 */
const PREFIJOS_RESERVADOS = new Set([
  "admin",
  "api",
  "_next",
  "_vercel",
  "reconocimientos", // módulo dedicado con su propia jerarquía
  "documentos-institucionales", // módulo dedicado
  "cronograma-anual", // módulo dedicado
]);

function isReservedSlug(slug: string): boolean {
  if (!slug) return true; // raíz está cubierta por app/page.tsx
  const firstSegment = slug.split("/")[0];
  return PREFIJOS_RESERVADOS.has(firstSegment);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const slugStr = (slug ?? []).join("/");
  if (isReservedSlug(slugStr)) return { title: "No encontrado" };

  const pagina = await getPagina(slugStr);
  if (!pagina) return { title: "No encontrado" };

  return {
    title: pagina.meta_title ?? pagina.titulo,
    description: pagina.meta_description ?? undefined,
    openGraph: pagina.og_image_url
      ? { images: [pagina.og_image_url] }
      : undefined,
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  const slugStr = (slug ?? []).join("/");

  if (isReservedSlug(slugStr)) notFound();

  const pagina = await getPagina(slugStr);
  if (!pagina) notFound();

  if (!PLANTILLAS_SOPORTADAS_CATCH_ALL.has(pagina.plantilla)) {
    // Plantillas K y L (fichas de servicio/espacio) y otras no soportadas
    // por el catch-all viven en sus rutas físicas dedicadas.
    notFound();
  }

  return (
    <PlantillaRenderer
      plantilla={pagina.plantilla}
      contenido={pagina.contenido}
    />
  );
}
