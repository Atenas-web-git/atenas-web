import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";
import { NavNiveles } from "@/components/academico/NavNiveles";
import { CTAAdmisionNivel } from "@/components/academico/CTAAdmisionNivel";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import { getPlantillaF } from "@/lib/cms/getPlantillaF";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/niveles/egb-superior";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "ACADÉMICO",
    title: "EGB Superior",
    subtitle: "Consolidación académica y preparación para el bachillerato en un entorno de excelencia.",
    ghostText: "SUPERIOR",
  },
  stats: [
    { label: "Grados", value: "8vo a 10mo EGB" },
    { label: "Rango de edades", value: "12–14 años" },
    { label: "Institución", value: "Unidad Educativa Atenas" },
  ],
  intro: {
    badge: "EGB Superior",
    heading: "Consolidación y preparación para el bachillerato",
    paragraphs: [
      "La EGB Superior es una etapa de consolidación donde los estudiantes afianzan todas las áreas del conocimiento y desarrollan habilidades de pensamiento crítico, investigación y comunicación.",
    ],
    chipsLabel: "Metodologías",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "EGB Superior — Unidad Educativa Atenas",
  meta_description:
    "Etapa de consolidación y transición hacia el bachillerato. 8vo a 10mo EGB en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function EGBSuperiorPage() {
  // El formulario que el colegio haya asignado a esta página.
  const pagina = await getPagina("academico/niveles/egb-superior");

  const data = await getPlantillaF(SLUG);
  const c = data?.contenido ?? FALLBACK;
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={c.hero.badge}
          title={c.hero.title}
          subtitle={c.hero.subtitle}
          ghostText={c.hero.ghostText}
          footnote={c.hero.footnote}
          bgImageSrc={c.hero.bgImageSrc}
        />
        <SeccionDetalleAcademico
          stats={c.stats}
          intro={c.intro}
          seccionInferior={c.seccionInferior}
        />
        {!c.ctaAdmision?.oculto && (
        <CTAAdmisionNivel
          nivel="EGB Superior"
          href={c.ctaAdmision?.href ?? "/admisiones/egb-superior"}
          eyebrow={c.ctaAdmision?.eyebrow}
          heading={c.ctaAdmision?.heading}
          descripcion={c.ctaAdmision?.descripcion}
          ctaLabel={c.ctaAdmision?.ctaLabel}
          secundarioLabel={c.ctaAdmision?.secundarioLabel ?? "Ver requisitos y proceso"}
          secundarioHref={c.ctaAdmision?.secundarioHref ?? "/admisiones/egb-superior#proceso"}
        />
        )}
        <NavNiveles current="egb-superior" />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
