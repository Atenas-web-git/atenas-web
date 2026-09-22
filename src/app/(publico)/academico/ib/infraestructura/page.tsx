import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import { getPlantillaF } from "@/lib/cms/getPlantillaF";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/ib/infraestructura";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "BACHILLERATO IB",
    title: "Infraestructura IB",
    subtitle: "Espacios y recursos pensados para el rigor académico y la exploración que exige el Programa del Diploma.",
    ghostText: "ESPACIOS",
  },
  stats: [
    { label: "Programa", value: "Diploma del IB" },
    { label: "Nivel", value: "1ro y 2do Bachillerato" },
    { label: "Acreditación", value: "IBO — International Baccalaureate" },
  ],
  intro: {
    badge: "Bachillerato Internacional",
    heading: "Instalaciones al nivel de los mejores colegios IB del mundo",
    headingHighlight: "mejores colegios IB del mundo",
    paragraphs: [
      "El Programa del Diploma exige entornos de aprendizaje especializados. En Atenas hemos invertido en laboratorios, espacios de debate y tecnología para nuestros estudiantes.",
    ],
    chipsLabel: "Componentes",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS IB ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "Infraestructura IB — Unidad Educativa Atenas",
  meta_description:
    "Instalaciones y recursos especializados que apoyan el aprendizaje del Programa del Diploma IB en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function InfraestructuraIBPage() {
  // El formulario que el colegio haya asignado a esta página.
  const pagina = await getPagina("academico/ib/infraestructura");

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
        <NavIB current="infraestructura" />
        <SeccionDetalleAcademico
          stats={c.stats}
          intro={c.intro}
          seccionInferior={c.seccionInferior}
        />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
