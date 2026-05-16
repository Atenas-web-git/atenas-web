import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { SeccionDetalle } from "@/components/cms/SeccionDetalle";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "matriculas/valores";

const FALLBACK = {
  hero: {
    badge: "MATRÍCULAS · VALORES",
    title: "Valores de Matrícula",
    subtitle:
      "Estructura de costos por nivel para el año lectivo 2026–2027. Valores referenciales sujetos a confirmación oficial.",
    ghostText: "VALORES",
  },
  intro: {
    badge: "VALORES 2026–2027",
    heading: "Estructura de costos por nivel",
    paragraphs: [
      "Valores referenciales para el año lectivo 2026–2027. Para confirmación oficial, contáctate con secretaría.",
    ],
  },
  tabla: {
    columnas: ["Nivel", "Grados", "Matrícula", "Pensión mensual"],
    filas: [
      { celdas: ["Inicial", "1ro y 2do Inicial", "$750", "$420"] },
      { celdas: ["EGB Elemental", "1ro – 4to EGB", "$800", "$450"] },
      { celdas: ["EGB Media", "5to – 7mo EGB", "$850", "$480"] },
      { celdas: ["EGB Superior", "8vo – 10mo EGB", "$900", "$510"] },
      { celdas: ["BGU", "1ro – 3ro BGU", "$950", "$545"] },
      { celdas: ["IB Diploma", "1ro – 2do IB", "$1.200", "$680"] },
    ],
    acentoPrimeraColumna: true,
    destacarUltimaColumna: true,
  },
  nota: {
    icono: "ℹ️",
    texto:
      "Los valores indicados son referenciales. La institución puede ajustarlos para el período 2026–2027. Comunícate con secretaría al <strong>032 456 789</strong> o visítanos en Izamba, Ambato.",
  },
  meta_title: "Valores de Matrícula 2026–2027 | Atenas",
  meta_description:
    "Estructura de costos por nivel educativo para el año lectivo 2026–2027 en la Unidad Educativa Atenas.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK.meta_title,
    description: pagina?.meta_description ?? FALLBACK.meta_description,
  };
}

type ContenidoTplD = {
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  intro?: {
    badge?: string;
    heading?: string;
    paragraphs?: string[];
  };
  stats?: Array<{ valor: string; label: string }>;
  tabla?: {
    badge?: string;
    heading?: string;
    descripcion?: string;
    columnas: string[];
    filas: Array<{ celdas: string[]; destacada?: boolean }>;
    acentoPrimeraColumna?: boolean;
    destacarUltimaColumna?: boolean;
  };
  nota?: {
    icono?: string;
    texto: string;
  };
  anchorId?: string;
};

export default async function ValoresPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoTplD) ?? {};

  const hero = {
    badge: c.hero?.badge ?? FALLBACK.hero.badge,
    title: c.hero?.title ?? FALLBACK.hero.title,
    subtitle: c.hero?.subtitle ?? FALLBACK.hero.subtitle,
    ghostText: c.hero?.ghostText ?? FALLBACK.hero.ghostText,
    footnote: c.hero?.footnote ?? undefined,
    bgImageSrc: c.hero?.bgImageSrc ?? undefined,
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
        <NavMatriculas current="valores" />
        <FechasBanner />
        <SeccionDetalle
          intro={c.intro ?? FALLBACK.intro}
          stats={c.stats}
          tabla={c.tabla ?? FALLBACK.tabla}
          nota={c.nota ?? FALLBACK.nota}
          anchorId={c.anchorId}
        />
        <FooterCTA />
      </main>
    </>
  );
}
