import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESPACIOS, getEspacio, type EspacioItem } from "@/data/espacios";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios, type EspacioSlug } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import type { ContenidoPlantillaL } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

interface Props {
  params: Promise<{ espacio: string }>;
}

export function generateStaticParams() {
  return ESPACIOS.map((e) => ({ espacio: e.slug }));
}

/**
 * Combina el fallback hardcoded de `data/espacios.ts` con el contenido
 * editado en el CMS. Los campos del CMS sobrescriben los del fallback;
 * los valores estructurales (slug, nombre) se preservan del fallback.
 */
function mergeEspacio(
  fallback: EspacioItem,
  cms: ContenidoPlantillaL | null
): EspacioItem {
  if (!cms) return fallback;

  const detalle = cms.detalle ?? null;
  const actividades = cms.actividades ?? null;

  return {
    ...fallback,
    ghostText: cms.hero?.ghostText?.trim() || fallback.ghostText,
    heroSubtitle: cms.hero?.subtitle?.trim() || fallback.heroSubtitle,
    detalle: detalle
      ? {
          badge: detalle.badge?.trim() || fallback.detalle.badge,
          heading: detalle.heading?.trim() || fallback.detalle.heading,
          paragraphs:
            detalle.paragraphs && detalle.paragraphs.length > 0
              ? detalle.paragraphs
              : fallback.detalle.paragraphs,
          tags:
            detalle.tags && detalle.tags.length > 0
              ? detalle.tags
              : fallback.detalle.tags,
          nota: detalle.nota ?? fallback.detalle.nota,
          ficha:
            detalle.ficha && detalle.ficha.length > 0
              ? detalle.ficha
              : fallback.detalle.ficha,
          photoSrc: detalle.photoSrc?.trim() || fallback.detalle.photoSrc,
          photoAlt: detalle.photoAlt?.trim() || fallback.detalle.photoAlt,
        }
      : fallback.detalle,
    actividades: actividades
      ? {
          title: actividades.title?.trim() || fallback.actividades.title,
          photoSrc: actividades.photoSrc?.trim() || fallback.actividades.photoSrc,
          photoCaption:
            actividades.photoCaption?.trim() || fallback.actividades.photoCaption,
          items:
            actividades.items && actividades.items.length > 0
              ? actividades.items
              : fallback.actividades.items,
        }
      : fallback.actividades,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { espacio: slug } = await params;
  const fallback = getEspacio(slug);
  if (!fallback) return {};

  const pagina = await getPagina(`espacios/${slug}`);
  return {
    title: pagina?.meta_title ?? fallback.metaTitle,
    description: pagina?.meta_description ?? fallback.metaDescription,
  };
}

export default async function EspacioPage({ params }: Props) {
  const { espacio: slug } = await params;
  const fallback = getEspacio(slug);
  if (!fallback) notFound();

  const pagina = await getPagina(`espacios/${slug}`);
  const cms = (pagina?.contenido as ContenidoPlantillaL | undefined) ?? null;
  const espacio = mergeEspacio(fallback, cms);

  const heroBgImage = cms?.hero?.bgImageSrc?.trim() || undefined;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={cms?.hero?.badge?.trim() || "ESPACIOS DE DESARROLLO"}
          title={cms?.hero?.title?.trim() || espacio.nombre}
          subtitle={espacio.heroSubtitle}
          ghostText={espacio.ghostText}
          bgImageSrc={heroBgImage}
        />
        <NavEspacios current={slug as EspacioSlug} />
        <SeccionEspacioDetalle
          badge={espacio.detalle.badge}
          heading={espacio.detalle.heading}
          paragraphs={espacio.detalle.paragraphs}
          tags={espacio.detalle.tags}
          nota={espacio.detalle.nota}
          ficha={espacio.detalle.ficha}
          photoSrc={espacio.detalle.photoSrc}
          photoAlt={espacio.detalle.photoAlt}
        />
        <ActividadesEspacio
          title={espacio.actividades.title}
          photoSrc={espacio.actividades.photoSrc}
          photoCaption={espacio.actividades.photoCaption}
          actividades={espacio.actividades.items}
        />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
