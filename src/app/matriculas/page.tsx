import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { ProcesoMatricula } from "@/components/matriculas/ProcesoMatricula";
import { DisciplinaShowcase, type Disciplina } from "@/components/reconocimientos/DisciplinaShowcase";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import {
  defaultContenidoPlantillaJ,
  type ContenidoPlantillaJ,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "matriculas";

const FALLBACK: ContenidoPlantillaJ = defaultContenidoPlantillaJ();

const FALLBACK_META = {
  meta_title: "Matrículas 2026–2027 | Unidad Educativa Atenas",
  meta_description:
    "Proceso de matrícula, valores de pensión y autorizaciones bancarias para el año lectivo 2026–2027 en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    keywords:
      "matrículas colegio Ambato 2026, inscripciones Unidad Educativa Atenas, pensiones colegio IB Ambato",
    openGraph: {
      title: pagina?.meta_title ?? FALLBACK_META.meta_title,
      description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    },
  };
}

export default async function MatriculasPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaJ | undefined) ?? FALLBACK;

  // Mapear los items del schema al shape que espera DisciplinaShowcase
  const disciplinas: Disciplina[] = c.showcase.items.map((it) => ({
    slug: it.slug,
    icon: it.icon,
    nombre: it.nombre,
    count: it.count,
    countLabel: it.countLabel,
    photoSrc: it.photoSrc,
    basePath: it.basePath,
  }));

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
        <NavMatriculas />
        <FechasBanner />
        <DisciplinaShowcase
          heading={c.showcase.heading}
          ctaText={c.showcase.ctaText}
          disciplinas={disciplinas}
        />
        <ProcesoMatricula proceso={c.proceso} />
        <FooterCTA />
      </main>
    </>
  );
}
