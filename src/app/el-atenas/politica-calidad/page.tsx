import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "el-atenas/politica-calidad";

const FALLBACK = {
  hero: {
    title: "Política de Calidad",
    subtitle: "Nuestro compromiso con la excelencia educativa y la mejora continua.",
    ghostText: "CALIDAD",
  },
  seccion: {
    badge: "POLÍTICA DE CALIDAD",
    heading: "Comprometidos con la Excelencia",
    paragraphs: [
      "Educamos y formamos jóvenes competentes, responsables y de servicio. Trabajamos para la satisfacción de nuestros clientes internos y externos mediante el cumplimiento de requisitos, la mejora continua de los procesos, una organización efectiva, personal especializado y comprometido, una infraestructura adecuada, la participación de la familia y el funcionamiento sustentable de la Institución.",
      "Esta política orienta cada proceso educativo y administrativo de la Unidad Educativa Atenas, en consonancia con nuestras certificaciones nacionales e internacionales de calidad.",
    ],
  },
  meta_title: "Política de Calidad — Unidad Educativa Atenas",
  meta_description:
    "Educamos y formamos jóvenes competentes, responsables y de servicio mediante la mejora continua y la excelencia educativa.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK.meta_title,
    description: pagina?.meta_description ?? FALLBACK.meta_description,
  };
}

type ContenidoTplA = {
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  seccion?: {
    badge?: string;
    heading?: string;
    paragraphs?: string[];
    note?: string | null;
    imageSrc?: string | null;
    imageAlt?: string | null;
  };
};

export default async function PoliticaCalidadPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoTplA) ?? {};

  const hero = {
    badge: c.hero?.badge ?? undefined,
    title: c.hero?.title ?? FALLBACK.hero.title,
    subtitle: c.hero?.subtitle ?? FALLBACK.hero.subtitle,
    ghostText: c.hero?.ghostText ?? FALLBACK.hero.ghostText,
    footnote: c.hero?.footnote ?? undefined,
    bgImageSrc: c.hero?.bgImageSrc ?? undefined,
  };

  const seccion = {
    badge: c.seccion?.badge ?? FALLBACK.seccion.badge,
    heading: c.seccion?.heading ?? FALLBACK.seccion.heading,
    paragraphs: c.seccion?.paragraphs?.length ? c.seccion.paragraphs : FALLBACK.seccion.paragraphs,
    note: c.seccion?.note ?? undefined,
    imageSrc: c.seccion?.imageSrc ?? undefined,
    imageAlt: c.seccion?.imageAlt ?? undefined,
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
        <SeccionTexto
          badge={seccion.badge}
          heading={seccion.heading}
          paragraphs={seccion.paragraphs}
          note={seccion.note ?? undefined}
          imageSrc={seccion.imageSrc ?? undefined}
          imageAlt={seccion.imageAlt ?? undefined}
        />
        <FooterCTA />
      </main>
    </>
  );
}
