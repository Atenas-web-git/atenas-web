import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "el-atenas/vision";

const FALLBACK = {
  hero: {
    title: "Visión",
    subtitle: "La imagen que inspira y define el horizonte de nuestra institución.",
  },
  seccion: {
    badge: "VISIÓN",
    heading: "Nuestra Visión",
    paragraphs: [
      "Somos la Organización responsable de la formación de personas felices e íntegras, con conciencia social, capacidades para triunfar y conocedores de su aporte para crear un mundo más pacífico.",
      "Esta visión nos impulsa a superar constantemente nuestros estándares educativos y a fortalecer el vínculo entre la institución, las familias y la comunidad.",
    ],
    note: "Visión institucional en actualización — se revisará el horizonte temporal para el nuevo ciclo estratégico.",
  },
  meta_title: "Visión — Unidad Educativa Atenas",
  meta_description:
    "Somos la organización responsable de la formación de personas felices e íntegras, con conciencia social y capacidades para triunfar.",
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

export default async function VisionPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoTplA) ?? {};

  const hero = {
    badge: c.hero?.badge ?? undefined,
    title: c.hero?.title ?? FALLBACK.hero.title,
    subtitle: c.hero?.subtitle ?? FALLBACK.hero.subtitle,
    ghostText: c.hero?.ghostText ?? undefined,
    footnote: c.hero?.footnote ?? undefined,
    bgImageSrc: c.hero?.bgImageSrc ?? undefined,
  };

  const seccion = {
    badge: c.seccion?.badge ?? FALLBACK.seccion.badge,
    heading: c.seccion?.heading ?? FALLBACK.seccion.heading,
    paragraphs: c.seccion?.paragraphs?.length ? c.seccion.paragraphs : FALLBACK.seccion.paragraphs,
    note: c.seccion?.note ?? FALLBACK.seccion.note,
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
