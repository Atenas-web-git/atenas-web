import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import type { ContenidoPlantillaE } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

/**
 * Fallbacks hardcoded por slug. Si la página equivalente en el CMS está en
 * borrador o no existe, se usa este contenido. Los slugs disponibles están
 * limitados a estas 4 claves (estructural — para añadir slugs nuevos hay
 * que añadirlos también aquí y al `generateStaticParams`).
 */
const FALLBACKS: Record<string, ContenidoPlantillaE> = {
  olimpiadas: {
    hero: {
      badge: "RECONOCIMIENTOS ACADÉMICOS",
      title: "Olimpiadas",
      subtitle:
        "Estudiantes que compiten en olimpiadas nacionales e internacionales de matemáticas, física, química y más — representando a Atenas con brillantez.",
      ghostText: "OLIMPIADAS",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Olimpiadas",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.",
      items: [
        {
          icon: "🥇", deporte: "Olimpiadas", titulo: "Medalla de Oro — Matemáticas", year: "2023",
          categoria: "Olimpiada Nacional Estudiantil", highlight: true,
          photos: [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
          ],
        },
        {
          icon: "🥈", deporte: "Olimpiadas", titulo: "Medalla de Plata — Física", year: "2023",
          categoria: "Olimpiada Nacional de Ciencias",
          photos: [
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
          ],
        },
        {
          icon: "🏅", deporte: "Olimpiadas", titulo: "Tercer Lugar — Química", year: "2022",
          categoria: "Olimpiada Internacional Iberoamericana",
          photos: [
            "https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
          ],
        },
      ],
    },
    galeria: {
      titulo: "Galería — Olimpiadas",
      subtitulo: "Momentos que celebramos juntos",
      photos: [
        { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80", alt: "Premiación olimpiadas" },
        { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Equipo de matemáticas" },
        { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=600&q=80", alt: "Competencia química" },
        { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Medallas" },
        { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80", alt: "Celebración" },
      ],
    },
  },
  ib: {
    hero: {
      badge: "RECONOCIMIENTOS ACADÉMICOS",
      title: "Diploma IB",
      subtitle:
        "Bachillerato Internacional con una tasa de aprobación del 95% — estudiantes Atenas que alcanzaron el nivel más alto del mundo académico.",
      ghostText: "DIPLOMA IB",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Diploma IB",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.",
      items: [
        {
          icon: "★", deporte: "Diploma IB", titulo: "Puntaje Máximo — 45/45", year: "2023",
          categoria: "Bachillerato Internacional · Promoción 2023", highlight: true,
          photos: [
            "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80",
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
          ],
        },
        {
          icon: "★", deporte: "Diploma IB", titulo: "Top 5% Mundial — Economía HL", year: "2022",
          categoria: "IB Diploma Programme · Resultados globales",
          photos: [
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
            "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80",
          ],
        },
      ],
    },
    galeria: {
      titulo: "Galería — Diploma IB",
      subtitulo: "Momentos que celebramos juntos",
      photos: [
        { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80", alt: "Ceremonia IB" },
        { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80", alt: "Diploma IB" },
        { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "Graduados" },
        { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=500&q=80", alt: "Celebración" },
        { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80", alt: "Aula IB" },
      ],
    },
  },
  cambridge: {
    hero: {
      badge: "RECONOCIMIENTOS ACADÉMICOS",
      title: "Cambridge",
      subtitle:
        "Certificaciones Cambridge International que abren puertas a universidades del mundo — más de 40 certificados anuales con distinción.",
      ghostText: "CAMBRIDGE",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Cambridge",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.",
      items: [
        {
          icon: "🌐", deporte: "Cambridge", titulo: "40 Certificados con Distinción", year: "2023",
          categoria: "Cambridge International AS & A Levels", highlight: true,
          photos: [
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80",
            "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80",
          ],
        },
        {
          icon: "🌐", deporte: "Cambridge", titulo: "Outstanding Cambridge Learner", year: "2022",
          categoria: "Top in Ecuador — Mathematics",
          photos: [
            "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80",
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80",
          ],
        },
      ],
    },
    galeria: {
      titulo: "Galería — Cambridge",
      subtitulo: "Momentos que celebramos juntos",
      photos: [
        { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80", alt: "Certificados Cambridge" },
        { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=500&q=80", alt: "Ceremonia" },
        { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "Estudiantes" },
        { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80", alt: "Diplomas" },
        { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80", alt: "Premio" },
      ],
    },
  },
  ciencia: {
    hero: {
      badge: "RECONOCIMIENTOS ACADÉMICOS",
      title: "Ciencia y Tecnología",
      subtitle:
        "Proyectos científicos y tecnológicos premiados a nivel nacional — estudiantes Atenas que innovan y resuelven problemas reales del mundo.",
      ghostText: "CIENCIA",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Ciencia y Tecnología",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento.",
      items: [
        {
          icon: "🔬", deporte: "Ciencia y Tech", titulo: "1er Lugar — Feria de Ciencias", year: "2022",
          categoria: "Feria Nacional de Ciencia y Tecnología", highlight: true,
          photos: [
            "https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80",
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
          ],
        },
        {
          icon: "💡", deporte: "Ciencia y Tech", titulo: "Mejor Innovación Tecnológica", year: "2023",
          categoria: "Concurso Nacional SENESCYT",
          photos: [
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
            "https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80",
          ],
        },
      ],
    },
    galeria: {
      titulo: "Galería — Ciencia y Tecnología",
      subtitulo: "Momentos que celebramos juntos",
      photos: [
        { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80", alt: "Feria de ciencias" },
        { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Proyecto ganador" },
        { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", alt: "Exposición" },
        { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=500&q=80", alt: "Premio" },
        { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Equipo" },
      ],
    },
  },
};

interface Props {
  params: Promise<{ logro: string }>;
}

export function generateStaticParams() {
  return Object.keys(FALLBACKS).map((logro) => ({ logro }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { logro } = await params;
  const fallback = FALLBACKS[logro];
  if (!fallback) return { title: "No encontrado" };

  const pagina = await getPagina(`reconocimientos/academicos/${logro}`);
  return {
    title:
      pagina?.meta_title ??
      `${fallback.hero.title} — Reconocimientos Académicos | Atenas`,
    description: pagina?.meta_description ?? fallback.hero.subtitle ?? "",
  };
}

export default async function LogroAcademicoPage({ params }: Props) {
  const { logro } = await params;
  const fallback = FALLBACKS[logro];
  if (!fallback) notFound();

  const pagina = await getPagina(`reconocimientos/academicos/${logro}`);
  const c = (pagina?.contenido as ContenidoPlantillaE | undefined) ?? fallback;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={c.hero.badge ?? "RECONOCIMIENTOS ACADÉMICOS"}
          title={c.hero.title}
          subtitle={c.hero.subtitle ?? ""}
          ghostText={c.hero.ghostText ?? ""}
          footnote={c.hero.footnote ?? undefined}
          bgImageSrc={c.hero.bgImageSrc ?? undefined}
        />
        <NavReconocimientos current="academicos" />
        <LogrosDestacados
          heading={c.logros.heading}
          subheading={c.logros.subheading}
          logros={c.logros.items}
        />
        <GaleriaLogros
          titulo={c.galeria.titulo}
          subtitulo={c.galeria.subtitulo}
          photos={c.galeria.photos}
        />
        <FooterCTA />
      </main>
    </>
  );
}
