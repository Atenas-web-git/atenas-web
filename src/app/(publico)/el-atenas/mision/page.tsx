import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { CTADescargas } from "@/components/cms/CTADescargas";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";

// ISR: revalida cada 60 segundos. Los cambios desde el backoffice
// también disparan revalidatePath inmediato.
export const revalidate = 60;

const SLUG = "el-atenas/mision";

// Contenido fallback (idéntico al original) para casos donde la página
// no esté publicada en BD: garantiza que la ruta nunca se rompe.
const FALLBACK = {
  hero: {
    title: "Misión",
    subtitle: "El propósito que guía cada decisión de nuestra comunidad educativa.",
  },
  seccion: {
    badge: "MISIÓN",
    heading: "Nuestra Misión",
    paragraphs: [
      "Crecemos y aprendemos juntos, fortaleciendo nuestros principios y valores, desarrollando las capacidades y habilidades de nuestra comunidad de forma crítica y creativa para contribuir a un mundo mejor.",
      "Esta misión define el propósito compartido de toda la comunidad Atenas: estudiantes, docentes, familias y directivos trabajan juntos hacia un mismo horizonte.",
    ],
  },
  meta_title: "Misión — Unidad Educativa Atenas",
  meta_description:
    "Crecemos y aprendemos juntos, fortaleciendo nuestros principios y valores para contribuir a un mundo mejor.",
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
  descargas?: {
    label?: string;
    href?: string;
    descripcion?: string;
  };
  anchorId?: string;
};

export default async function MisionPage() {
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
          anchorId={c.anchorId}
        />
        {c.descargas && (
          <CTADescargas
            label={c.descargas.label}
            href={c.descargas.href}
            descripcion={c.descargas.descripcion}
          />
        )}
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
