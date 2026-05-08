import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPlantillaF } from "@/lib/cms/getPlantillaF";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/ib/visitas";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "BACHILLERATO IB",
    title: "Visitas al Programa IB",
    subtitle: "Ver para creer. Te invitamos a conocer de primera mano los espacios y el equipo que hacen posible el Diploma en Atenas.",
    ghostText: "VISITA",
  },
  stats: [
    { label: "Programa", value: "Diploma del IB" },
    { label: "Nivel", value: "1ro y 2do Bachillerato" },
    { label: "Acreditación", value: "IBO — International Baccalaureate" },
  ],
  intro: {
    badge: "Bachillerato Internacional",
    heading: "Vive la experiencia IB antes de decidir",
    headingHighlight: "antes de decidir",
    paragraphs: [
      "Elegir el Programa del Diploma IB es una decisión significativa. Por eso en Atenas abrimos nuestras puertas para que estudiantes y familias conozcan en persona los espacios y el equipo.",
    ],
    chipsLabel: "Componentes",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS IB ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "Visitas al Programa IB — Unidad Educativa Atenas",
  meta_description:
    "Conoce en persona las instalaciones y el equipo del Bachillerato IB de la Unidad Educativa Atenas. Agenda una visita guiada o un día de observación.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function VisitasIBPage() {
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
        <NavIB current="visitas" />
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
