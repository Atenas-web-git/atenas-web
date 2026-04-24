import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { DisciplinaShowcase } from "@/components/reconocimientos/DisciplinaShowcase";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Reconocimientos Deportivos | Atenas",
  description:
    "Los atletas de la Unidad Educativa Atenas compiten y ganan en campeonatos provinciales y nacionales. Conoce nuestros logros deportivos por disciplina.",
};

const DISCIPLINAS = [
  {
    slug: "basquetbol",
    icon: "🏀",
    nombre: "Básquetbol",
    count: 8,
    countLabel: "Medallas y títulos",
    photoSrc: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80",
    basePath: "/reconocimientos/deportivos",
  },
  {
    slug: "atletismo",
    icon: "🏃",
    nombre: "Atletismo",
    count: 5,
    countLabel: "Medallas nacionales",
    photoSrc: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80",
    basePath: "/reconocimientos/deportivos",
  },
  {
    slug: "futbol",
    icon: "⚽",
    nombre: "Fútbol",
    count: 12,
    countLabel: "Títulos provinciales",
    photoSrc: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
    basePath: "/reconocimientos/deportivos",
  },
  {
    slug: "natacion",
    icon: "🏊",
    nombre: "Natación",
    count: 3,
    countLabel: "Oros regionales",
    photoSrc: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80",
    basePath: "/reconocimientos/deportivos",
  },
];

const LOGROS = [
  {
    icon: "🥇",
    deporte: "Básquetbol",
    titulo: "Campeones Provinciales",
    year: "2023",
    categoria: "Categoría masculina sub-18",
    highlight: true,
    photos: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80",
      "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&q=80",
      "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=700&q=80",
    ],
  },
  {
    icon: "🏅",
    deporte: "Atletismo",
    titulo: "Medalla de Oro Nacional",
    year: "2022",
    categoria: "Juegos Nacionales Estudiantiles",
    photos: [
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80",
      "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=700&q=80",
    ],
  },
  {
    icon: "🏆",
    deporte: "Fútbol",
    titulo: "Liga Provincial — Primer Lugar",
    year: "2023",
    categoria: "Categoría mixta · Ambato",
    photos: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80",
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=700&q=80",
      "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&q=80",
    ],
  },
];

const GALLERY_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80", alt: "Básquetbol" },
  { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80", alt: "Atletismo" },
  { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", alt: "Fútbol" },
  { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Natación" },
  { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80", alt: "Celebración" },
];

export default function DeportivosPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="RECONOCIMIENTOS"
          title="Reconocimientos Deportivos"
          subtitle="Atletas que representan a Atenas con excelencia — campeonatos provinciales, nacionales y logros que enorgullecen a toda la comunidad."
          ghostText="DEPORTE"
        />
        <NavReconocimientos current="deportivos" />
        <DisciplinaShowcase
          disciplinas={DISCIPLINAS}
          verTodosHref="/reconocimientos/deportivos"
        />
        <LogrosDestacados
          heading="Campeones que representan a Atenas en todo el país"
          subheading="Cada tarjeta es un álbum de fotos del campeonato — toca los puntos para ver todos los momentos."
          logros={LOGROS}
        />
        <GaleriaLogros
          titulo="Galería de Logros"
          subtitulo="Momentos que quedan en la historia del colegio"
          photos={GALLERY_PHOTOS}
        />
        <FooterCTA />
      </main>
    </>
  );
}
