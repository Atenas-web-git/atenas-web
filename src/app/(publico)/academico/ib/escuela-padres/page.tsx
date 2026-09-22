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

const SLUG = "academico/ib/escuela-padres";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "BACHILLERATO IB",
    title: "Escuela de Padres IB",
    subtitle: "El acompañamiento familiar es parte esencial del éxito en el Programa del Diploma. Aquí encontrarás todo lo que necesitas.",
    ghostText: "FAMILIA",
  },
  stats: [
    { label: "Programa", value: "Diploma del IB" },
    { label: "Nivel", value: "1ro y 2do Bachillerato" },
    { label: "Acreditación", value: "IBO — International Baccalaureate" },
  ],
  intro: {
    badge: "Bachillerato Internacional",
    heading: "Familias informadas, estudiantes que brillan en el mundo",
    headingHighlight: "brillan en el mundo",
    paragraphs: [
      "El IBO reconoce a las familias como parte activa de la comunidad de aprendizaje. En Atenas hemos diseñado un programa de acompañamiento para madres, padres y representantes.",
    ],
    chipsLabel: "Componentes",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS IB ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "Escuela de Padres IB — Unidad Educativa Atenas",
  meta_description:
    "Programa de acompañamiento para familias del Bachillerato IB en la Unidad Educativa Atenas: talleres, recursos y canal directo con la coordinación.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function EscuelaPadresIBPage() {
  // El formulario que el colegio haya asignado a esta página.
  const pagina = await getPagina("academico/ib/escuela-padres");

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
        <NavIB current="escuela-padres" />
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
