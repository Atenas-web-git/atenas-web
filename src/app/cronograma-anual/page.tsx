import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { CronogramaAnual } from "@/components/cronograma/CronogramaAnual";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getCronogramaPublico } from "@/lib/cms/getCronograma";
import {
  getConfiguracion,
  type CronogramaPaginaHero,
} from "@/lib/cms/getConfiguracion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cronograma Anual 2026–2027 | Atenas",
  description:
    "Calendario del año lectivo Sierra 2026–2027 de la Unidad Educativa Atenas. Consulta fechas de evaluaciones, feriados, ceremonias y actividades académicas.",
};

const FALLBACK_HERO: Required<CronogramaPaginaHero> = {
  badge: "UNIDAD EDUCATIVA ATENAS",
  title: "Cronograma Anual 2026 – 2027",
  subtitle:
    "Calendario del año lectivo Sierra con todas las fechas clave para estudiantes, familias y docentes.",
  ghostText: "CRONOGRAMA",
  footnote: "",
  bgImageSrc: "",
};

export default async function CronogramaPage() {
  const [data, heroConfig] = await Promise.all([
    getCronogramaPublico(),
    getConfiguracion<CronogramaPaginaHero>("cronograma_pagina_hero"),
  ]);

  const periodos = data?.periodos ?? [];
  const tipos = data?.tipos ?? [];
  const eventos = data?.eventos ?? [];

  const hero = {
    badge: heroConfig?.badge?.trim() || FALLBACK_HERO.badge,
    title: heroConfig?.title?.trim() || FALLBACK_HERO.title,
    subtitle: heroConfig?.subtitle?.trim() || FALLBACK_HERO.subtitle,
    ghostText: heroConfig?.ghostText?.trim() || FALLBACK_HERO.ghostText,
    footnote: heroConfig?.footnote?.trim() || undefined,
    bgImageSrc: heroConfig?.bgImageSrc?.trim() || undefined,
  };

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={hero.badge}
          title={hero.title}
          subtitle={hero.subtitle}
          ghostText={hero.ghostText}
          footnote={hero.footnote}
          bgImageSrc={hero.bgImageSrc}
        />
        <CronogramaAnual periodos={periodos} tipos={tipos} eventos={eventos} />
        <FooterCTA />
      </main>
    </>
  );
}
