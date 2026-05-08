import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "el-atenas/politica-seguridad";

const FALLBACK = {
  hero: {
    title: "Política de Seguridad",
    subtitle: "Seguridad y bienestar para cada miembro de nuestra comunidad.",
    ghostText: "SEGURIDAD",
  },
  seccion: {
    badge: "POLÍTICA DE SEGURIDAD",
    heading: "Seguridad y Salud en el Trabajo",
    paragraphs: [
      "La Fundación Cultural y Educativa Ambato, dedicada a brindar educación de calidad, está comprometida con la seguridad y salud en el trabajo en todas las áreas de la institución, respetando el medio ambiente, el marco legal y las normativas establecidas en el país.",
      "Para este fin, se asignan los recursos necesarios y se promueve el mejoramiento continuo de las condiciones de trabajo, garantizando un entorno seguro y saludable para estudiantes, docentes, personal administrativo y visitantes.",
    ],
  },
  meta_title: "Política de Seguridad — Unidad Educativa Atenas",
  meta_description:
    "Comprometidos con la seguridad, salud en el trabajo y el bienestar de toda la comunidad educativa.",
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

export default async function PoliticaSeguridadPage() {
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
