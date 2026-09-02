import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { SeccionPasos } from "@/components/cms/SeccionPasos";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";

export const revalidate = 60;

const SLUG = "matriculas/proceso";

const FALLBACK = {
  hero: {
    badge: "MATRÍCULAS · PROCESO",
    title: "Cómo matricularte",
    subtitle:
      "Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027.",
    ghostText: "PROCESO",
  },
  intro: {
    badge: "PROCESO DE MATRÍCULA · 2026–2027",
    heading: "Cómo matricularte en Atenas",
    descripcion:
      "Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027.",
  },
  galeria: {
    src1: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    alt1: "Aulas Atenas",
    src2: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
    alt2: "Campus Atenas",
    src3: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80",
    alt3: "Estudiantes Atenas",
  },
  pasos: {
    titulo: "Pasos a seguir",
    items: [
      {
        texto:
          "Completa el formulario en línea — Accede al portal y llena los datos del estudiante y la familia.",
      },
      {
        texto:
          "Entrega la documentación — Cédula o pasaporte, fotos tamaño carné, certificados médicos y académicos.",
      },
      {
        texto:
          "Entrevista familiar — Reunión breve con el equipo académico para conocerse y resolver dudas.",
      },
      {
        texto:
          "Revisión y aprobación — El comité evalúa la solicitud en un plazo de 5 días hábiles.",
      },
      {
        texto:
          "Firma de contrato y pago — Formaliza la matrícula en secretaría y completa el proceso de pago.",
        destacado: true,
      },
    ],
  },
  meta_title: "Proceso de Matrícula 2026–2027 | Atenas",
  meta_description:
    "Conoce los 5 pasos para matricularte en la Unidad Educativa Atenas para el año lectivo 2026–2027.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK.meta_title,
    description: pagina?.meta_description ?? FALLBACK.meta_description,
  };
}

type ContenidoTplC = {
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
    descripcion?: string;
  };
  galeria?: {
    src1: string;
    alt1?: string;
    src2: string;
    alt2?: string;
    src3?: string;
    alt3?: string;
  };
  tarjetas?: {
    titulo?: string;
    items: Array<{
      color?: string;
      titulo: string;
      filas: Array<{ label: string; value: string; destacado?: boolean }>;
    }>;
  };
  pasos?: {
    badge?: string;
    titulo?: string;
    items: Array<{ texto: string; destacado?: boolean }>;
  };
  nota?: {
    icono?: string;
    texto: string;
  };
  anchorId?: string;
};

export default async function ProcesoPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoTplC) ?? {};

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
        <NavMatriculas current="proceso" />
        <FechasBanner />
        <SeccionPasos
          intro={c.intro ?? FALLBACK.intro}
          galeria={c.galeria ?? FALLBACK.galeria}
          tarjetas={c.tarjetas}
          pasos={c.pasos ?? FALLBACK.pasos}
          nota={c.nota}
          anchorId={c.anchorId}
        />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
