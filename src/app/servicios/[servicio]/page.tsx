import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICIOS, getServicio, type ServicioItem } from "@/data/servicios";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import {
  DetalleServicio,
  type FormQuejasConfig,
  type RevistaConfig,
} from "@/components/servicios/DetalleServicio";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { getFormularioPublico } from "@/lib/formularios/getFormulario";
import type { ContenidoPlantillaK } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

interface Props {
  params: Promise<{ servicio: string }>;
}

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ servicio: s.slug }));
}

/**
 * Combina el fallback hardcoded de `data/servicios.ts` con el contenido
 * editado en el CMS. Los campos del CMS sobrescriben los del fallback;
 * los valores estructurales (slug, nombre, ghostText) se preservan del
 * fallback si el CMS los deja vacíos.
 */
function mergeServicio(
  fallback: ServicioItem,
  cms: ContenidoPlantillaK | null
): ServicioItem {
  if (!cms) return fallback;

  const heroSubtitle = cms.hero?.subtitle?.trim() || fallback.heroSubtitle;
  const ghostText = cms.hero?.ghostText?.trim() || fallback.ghostText;
  const stats =
    cms.ficha?.stats && cms.ficha.stats.length > 0
      ? cms.ficha.stats.map((s) => ({
          iconName: s.iconName || "circle",
          label: s.label,
          valor: s.valor,
        }))
      : fallback.stats;
  const descripcion =
    cms.ficha?.descripcion && cms.ficha.descripcion.length > 0
      ? cms.ficha.descripcion
      : fallback.descripcion;
  const pasos =
    cms.ficha?.pasos && cms.ficha.pasos.length > 0
      ? cms.ficha.pasos
      : fallback.pasos;
  const fotos: [string, string, string] = cms.ficha?.fotos
    ? [
        cms.ficha.fotos[0] || fallback.fotos[0],
        cms.ficha.fotos[1] || fallback.fotos[1],
        cms.ficha.fotos[2] || fallback.fotos[2],
      ]
    : fallback.fotos;

  return {
    ...fallback,
    iconName: cms.ficha?.iconName || fallback.iconName,
    color: cms.ficha?.color ?? fallback.color,
    ghostText,
    heroSubtitle,
    stats,
    descripcion,
    pasos,
    fotos,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { servicio: slug } = await params;
  const fallback = getServicio(slug);
  if (!fallback) return {};

  const pagina = await getPagina(`servicios/${slug}`);
  return {
    title: pagina?.meta_title ?? `${fallback.nombre} | Servicios | Atenas`,
    description: pagina?.meta_description ?? fallback.descripcionCorta,
  };
}

export default async function ServicioPage({ params }: Props) {
  const { servicio: slug } = await params;
  const fallback = getServicio(slug);
  if (!fallback) notFound();

  const pagina = await getPagina(`servicios/${slug}`);
  const cms = (pagina?.contenido as ContenidoPlantillaK | undefined) ?? null;

  const servicio = mergeServicio(fallback, cms);

  // Los campos del formulario salen del motor. Solo lo llevan las fichas de
  // color rojo —hoy quejas y sugerencias—; el resto muestra pasos numerados.
  const formularioQuejas =
    servicio.color === "red"
      ? await getFormularioPublico("quejas-sugerencias")
      : null;

  const heroBgImage = cms?.hero?.bgImageSrc?.trim() || undefined;
  // Solo se usa cuando el servicio es de color rojo (caso especial con
  // formulario en lugar de pasos, ej. quejas-sugerencias).
  const formConfig: FormQuejasConfig | undefined =
    servicio.color === "red" && cms?.formulario
      ? {
          headerTitle: cms.formulario.headerTitle,
          headerSubtitle: cms.formulario.headerSubtitle,
          tipos: cms.formulario.tipos,
          submitText: cms.formulario.submitText,
          successTitle: cms.formulario.successTitle,
          successText: cms.formulario.successText,
        }
      : undefined;

  // Config de la card "Revista Atenas" (solo se usa en /servicios/biblioteca).
  // Si el CMS no la trae, el componente cae a los defaults hardcoded.
  const revistaConfig: RevistaConfig | undefined =
    slug === "biblioteca" && cms?.revistaAtenas
      ? {
          enabled: cms.revistaAtenas.enabled ?? true,
          eyebrow: cms.revistaAtenas.eyebrow,
          titulo: cms.revistaAtenas.titulo,
          descripcion: cms.revistaAtenas.descripcion,
          ctaText: cms.revistaAtenas.ctaText,
          ctaUrl: cms.revistaAtenas.ctaUrl,
          coverImage: cms.revistaAtenas.coverImage,
          coverAlt: cms.revistaAtenas.coverAlt,
        }
      : undefined;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={cms?.hero?.badge?.trim() || "SERVICIOS INSTITUCIONALES"}
          title={cms?.hero?.title?.trim() || servicio.nombre}
          subtitle={servicio.heroSubtitle}
          ghostText={servicio.ghostText}
          bgImageSrc={heroBgImage}
        />
        <DetalleServicio
          servicio={servicio}
          formConfig={formConfig}
          revistaConfig={revistaConfig}
          formularioMotor={formularioQuejas}
        />
        <FooterCTA />
      </main>
    </>
  );
}
