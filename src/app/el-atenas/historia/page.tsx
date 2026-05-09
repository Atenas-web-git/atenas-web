import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroHistoria } from "@/components/historia/HeroHistoria";
import { FundacionHistoria } from "@/components/historia/FundacionHistoria";
import { TimelineHistoria } from "@/components/historia/TimelineHistoria";
import { CifrasHistoria } from "@/components/historia/CifrasHistoria";
import { CitaHistoria } from "@/components/historia/CitaHistoria";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import {
  defaultContenidoPlantillaI,
  type ContenidoPlantillaI,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "el-atenas/historia";

const FALLBACK: ContenidoPlantillaI = defaultContenidoPlantillaI();

const FALLBACK_META = {
  meta_title: "Historia & 50 Años — Unidad Educativa Atenas",
  meta_description:
    "Cinco décadas formando líderes con propósito en el corazón de Ambato. Fundada en 1976, referente de calidad educativa en Ecuador con bachillerato IB y certificación ISO 9001.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    keywords:
      "historia Unidad Educativa Atenas, 50 años colegio Ambato, fundación 1976 colegio Ambato, mejor colegio historia Tungurahua",
    openGraph: {
      title: pagina?.meta_title ?? "50 Años de Historia — Unidad Educativa Atenas",
      description:
        pagina?.meta_description ??
        "Desde 1976, formando líderes con propósito en Ambato, Ecuador. Cinco décadas de excelencia educativa con bachillerato IB y certificación ISO 9001.",
    },
  };
}

export default async function HistoriaPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaI | undefined) ?? FALLBACK;

  return (
    <>
      <Navbar />
      <main>
        <HeroHistoria hero={c.hero} />
        <FundacionHistoria fundacion={c.fundacion} />
        <TimelineHistoria trayectoria={c.trayectoria} />
        <CifrasHistoria cifras={c.cifras} />
        <CitaHistoria cita={c.cita} />
        <FooterCTA />
      </main>
    </>
  );
}
