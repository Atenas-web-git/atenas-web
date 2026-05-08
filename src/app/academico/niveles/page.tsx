import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroAcademico } from "@/components/academico/HeroAcademico";
import { NivelesDetalle } from "@/components/academico/NivelesDetalle";
import { MetodologiasAcademico } from "@/components/academico/MetodologiasAcademico";
import { CTAAcademico } from "@/components/academico/CTAAcademico";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import {
  defaultContenidoPlantillaH,
  type ContenidoPlantillaH,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/niveles";

const FALLBACK: ContenidoPlantillaH = defaultContenidoPlantillaH();

const FALLBACK_META = {
  meta_title: "Niveles Educativos — Unidad Educativa Atenas",
  meta_description:
    "Desde Educación Inicial hasta el Diploma IB: cinco niveles con metodologías de excelencia en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function AcademicoNivelesPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaH | undefined) ?? FALLBACK;

  return (
    <>
      <Navbar />
      <main>
        <HeroAcademico hero={c.hero} />
        <NivelesDetalle niveles={c.niveles} />
        <MetodologiasAcademico metodologias={c.metodologias} />
        <CTAAcademico cta={c.cta} />
        <FooterCTA />
      </main>
    </>
  );
}
