import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";

interface LogroConfig {
  nombre: string;
  ghostText: string;
  subtitle: string;
  logros: {
    icon: string;
    deporte: string;
    titulo: string;
    year: string;
    categoria: string;
    photos: string[];
    highlight?: boolean;
  }[];
  gallery: { src: string; alt: string }[];
}

const LOGROS_ACADEMICOS: Record<string, LogroConfig> = {
  olimpiadas: {
    nombre: "Olimpiadas",
    ghostText: "OLIMPIADAS",
    subtitle: "Estudiantes que compiten en olimpiadas nacionales e internacionales de matemáticas, física, química y más — representando a Atenas con brillantez.",
    logros: [
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
    gallery: [
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80", alt: "Premiación olimpiadas" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Equipo de matemáticas" },
      { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=600&q=80", alt: "Competencia química" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Medallas" },
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80", alt: "Celebración" },
    ],
  },
  ib: {
    nombre: "Diploma IB",
    ghostText: "DIPLOMA IB",
    subtitle: "Bachillerato Internacional con una tasa de aprobación del 95% — estudiantes Atenas que alcanzaron el nivel más alto del mundo académico.",
    logros: [
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
    gallery: [
      { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80", alt: "Ceremonia IB" },
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80", alt: "Diploma IB" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "Graduados" },
      { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=500&q=80", alt: "Celebración" },
      { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80", alt: "Aula IB" },
    ],
  },
  cambridge: {
    nombre: "Cambridge",
    ghostText: "CAMBRIDGE",
    subtitle: "Certificaciones Cambridge International que abren puertas a universidades del mundo — más de 40 certificados anuales con distinción.",
    logros: [
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
    gallery: [
      { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80", alt: "Certificados Cambridge" },
      { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=500&q=80", alt: "Ceremonia" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80", alt: "Estudiantes" },
      { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80", alt: "Diplomas" },
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80", alt: "Premio" },
    ],
  },
  ciencia: {
    nombre: "Ciencia y Tecnología",
    ghostText: "CIENCIA",
    subtitle: "Proyectos científicos y tecnológicos premiados a nivel nacional — estudiantes Atenas que innovan y resuelven problemas reales del mundo.",
    logros: [
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
    gallery: [
      { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80", alt: "Feria de ciencias" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Proyecto ganador" },
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80", alt: "Exposición" },
      { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=500&q=80", alt: "Premio" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Equipo" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(LOGROS_ACADEMICOS).map((logro) => ({ logro }));
}

export async function generateMetadata({ params }: { params: Promise<{ logro: string }> }): Promise<Metadata> {
  const { logro } = await params;
  const config = LOGROS_ACADEMICOS[logro];
  if (!config) return { title: "No encontrado" };
  return {
    title: `${config.nombre} — Reconocimientos Académicos | Atenas`,
    description: config.subtitle,
  };
}

export default async function LogroAcademicoPage({ params }: { params: Promise<{ logro: string }> }) {
  const { logro } = await params;
  const config = LOGROS_ACADEMICOS[logro];
  if (!config) notFound();

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="RECONOCIMIENTOS ACADÉMICOS"
          title={config.nombre}
          subtitle={config.subtitle}
          ghostText={config.ghostText}
        />
        <NavReconocimientos current="academicos" />
        <LogrosDestacados
          heading={`Nuestros logros en ${config.nombre}`}
          subheading="Toca los puntos de cada tarjeta para navegar entre las fotos del reconocimiento."
          logros={config.logros}
        />
        <GaleriaLogros
          titulo={`Galería — ${config.nombre}`}
          subtitulo="Momentos que celebramos juntos"
          photos={config.gallery}
        />
        <FooterCTA />
      </main>
    </>
  );
}
