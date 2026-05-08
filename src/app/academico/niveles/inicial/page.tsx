import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";
import { NavNiveles } from "@/components/academico/NavNiveles";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPlantillaF } from "@/lib/cms/getPlantillaF";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/niveles/inicial";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "ACADÉMICO",
    title: "Educación Inicial",
    subtitle: "Metodología Montessori, Reggio Emilia y ABN para los primeros años de vida.",
    ghostText: "INICIAL",
  },
  stats: [
    { label: "Grados", value: "Pre-Kinder y Kinder" },
    { label: "Rango de edades", value: "3–5 años" },
    { label: "Institución", value: "Unidad Educativa Atenas" },
  ],
  intro: {
    badge: "Educación Inicial",
    heading: "Metodologías de clase mundial",
    paragraphs: [
      "Nuestra metodología en Educación Inicial está basada en las filosofías de María Montessori, Reggio Emilia y ABN.",
    ],
    chipsLabel: "Metodologías",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "Educación Inicial — Unidad Educativa Atenas",
  meta_description:
    "Metodología Montessori, Reggio Emilia y ABN para los primeros años. Inglés integrado desde Pre-Kinder en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function InicialPage() {
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
        <NavNiveles current="inicial" />
        <FooterCTA />
      </main>
    </>
  );
}
