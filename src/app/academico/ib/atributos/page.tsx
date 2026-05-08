import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPlantillaF } from "@/lib/cms/getPlantillaF";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/ib/atributos";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "BACHILLERATO IB",
    title: "Atributos del Perfil IB",
    subtitle: "Diez cualidades que definen a cada estudiante del Programa del Diploma y guían su formación integral.",
    ghostText: "PERFIL",
  },
  stats: [
    { label: "Programa", value: "Diploma del IB" },
    { label: "Nivel", value: "1ro y 2do Bachillerato" },
    { label: "Acreditación", value: "IBO — International Baccalaureate" },
  ],
  intro: {
    badge: "Bachillerato Internacional",
    heading: "10 atributos que forman líderes del mundo",
    headingHighlight: "líderes del mundo",
    paragraphs: [
      "El Perfil de la Comunidad de Aprendizaje del IB describe diez atributos esenciales que los estudiantes desarrollan a lo largo del Programa del Diploma.",
    ],
    chipsLabel: "Componentes",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS IB ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "Atributos del Perfil IB — Unidad Educativa Atenas",
  meta_description:
    "Los 10 atributos del Perfil de la Comunidad de Aprendizaje IB que guían la formación de estudiantes íntegros, indagadores y comprometidos con el mundo.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function AtributosIBPage() {
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
        <NavIB current="atributos" />
        <SeccionDetalleAcademico
          stats={c.stats}
          intro={c.intro}
          seccionInferior={c.seccionInferior}
        />
        <FooterCTA />
      </main>
    </>
  );
}
