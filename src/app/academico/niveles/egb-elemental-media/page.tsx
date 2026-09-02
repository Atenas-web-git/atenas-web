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

const SLUG = "academico/niveles/egb-elemental-media";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "ACADÉMICO",
    title: "EGB Elemental y Media",
    subtitle: "Formación integral con CLIL, PBL y plataformas digitales de matemáticas de clase mundial.",
    ghostText: "EGB",
  },
  stats: [
    { label: "Grados", value: "1ro a 7mo EGB" },
    { label: "Rango de edades", value: "5–12 años" },
    { label: "Institución", value: "Unidad Educativa Atenas" },
  ],
  intro: {
    badge: "EGB Elemental y Media",
    heading: "Innovación pedagógica en cada etapa",
    paragraphs: [
      "Promovemos una formación integral que combina valores, conocimiento e innovación pedagógica, en un ambiente de respeto, colaboración y entusiasmo por aprender.",
    ],
    chipsLabel: "Metodologías",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "EGB Elemental y Media — Unidad Educativa Atenas",
  meta_description:
    "Inglés integrado con CLIL, aprendizaje por proyectos y plataformas Mangahigh y ALEKS para matemáticas. 1ro a 7mo EGB en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function EGBElementalMediaPage() {
  // El formulario que el colegio haya asignado a esta página.
  const pagina = await getPagina("academico/niveles/egb-elemental-media");

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
          nivel="EGB Elemental y Media"
          href={c.ctaAdmision?.href ?? "/admisiones/egb-elemental-media"}
          eyebrow={c.ctaAdmision?.eyebrow}
          heading={c.ctaAdmision?.heading}
          descripcion={c.ctaAdmision?.descripcion}
          ctaLabel={c.ctaAdmision?.ctaLabel}
          secundarioLabel={c.ctaAdmision?.secundarioLabel ?? "Ver requisitos y proceso"}
          secundarioHref={c.ctaAdmision?.secundarioHref ?? "/admisiones/egb-elemental-media#proceso"}
        />
        )}
        <NavNiveles current="egb-elemental-media" />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
