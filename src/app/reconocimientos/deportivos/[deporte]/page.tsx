import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";

interface DeporteConfig {
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

const DEPORTES: Record<string, DeporteConfig> = {
  basquetbol: {
    nombre: "Básquetbol",
    ghostText: "BASKET",
    subtitle: "Campeones provinciales con un equipo que demuestra disciplina, trabajo en equipo y orgullo ateniense en cada cancha.",
    logros: [
      {
        icon: "🥇", deporte: "Básquetbol", titulo: "Campeones Provinciales", year: "2023",
        categoria: "Categoría masculina sub-18", highlight: true,
        photos: [
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80",
          "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&q=80",
          "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=700&q=80",
        ],
      },
      {
        icon: "🏅", deporte: "Básquetbol", titulo: "Subcampeones Regionales", year: "2022",
        categoria: "Categoría femenina sub-16",
        photos: [
          "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=700&q=80",
          "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80",
        ],
      },
      {
        icon: "🏆", deporte: "Básquetbol", titulo: "Liga Intercolegial — 1er Lugar", year: "2021",
        categoria: "Torneo provincial · Tungurahua",
        photos: [
          "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=700&q=80",
        ],
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80", alt: "Equipo masculino" },
      { src: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80", alt: "Entrenamiento" },
      { src: "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=600&q=80", alt: "Partido final" },
      { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80", alt: "Ceremonia" },
      { src: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80", alt: "Trofeo" },
    ],
  },
  atletismo: {
    nombre: "Atletismo",
    ghostText: "ATLETAS",
    subtitle: "Velocistas y fondistas que representan a Atenas en los Juegos Nacionales Estudiantiles con medallas y récords que inspiran.",
    logros: [
      {
        icon: "🥇", deporte: "Atletismo", titulo: "Medalla de Oro Nacional", year: "2022",
        categoria: "Juegos Nacionales Estudiantiles", highlight: true,
        photos: [
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80",
          "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=700&q=80",
        ],
      },
      {
        icon: "🏅", deporte: "Atletismo", titulo: "Oro Regional — 100m planos", year: "2023",
        categoria: "Zona 3 · Categoría sub-16",
        photos: [
          "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=700&q=80",
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80",
        ],
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80", alt: "Pista de atletismo" },
      { src: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80", alt: "Carrera" },
      { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80", alt: "Llegada" },
      { src: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80", alt: "Medallas" },
      { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80", alt: "Celebración" },
    ],
  },
  futbol: {
    nombre: "Fútbol",
    ghostText: "FÚTBOL",
    subtitle: "Un equipo que juega con corazón ateniense — campeones provinciales y referentes del fútbol intercolegial en Tungurahua.",
    logros: [
      {
        icon: "🏆", deporte: "Fútbol", titulo: "Liga Provincial — Primer Lugar", year: "2023",
        categoria: "Categoría mixta · Ambato", highlight: true,
        photos: [
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80",
          "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=700&q=80",
          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&q=80",
        ],
      },
      {
        icon: "🥇", deporte: "Fútbol", titulo: "Torneo Intercolegial", year: "2022",
        categoria: "Categoría masculina sub-18",
        photos: [
          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=700&q=80",
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80",
        ],
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80", alt: "Equipo de fútbol" },
      { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80", alt: "Partido" },
      { src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", alt: "Gol" },
      { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80", alt: "Copa" },
      { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80", alt: "Celebración" },
    ],
  },
  natacion: {
    nombre: "Natación",
    ghostText: "AGUA",
    subtitle: "Nadadores de élite que conquistan las piscinas regionales y nacionales con técnica y perseverancia.",
    logros: [
      {
        icon: "🥇", deporte: "Natación", titulo: "Medalla de Oro Regional", year: "2021",
        categoria: "Zona 3 — 200m libre", highlight: true,
        photos: [
          "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80",
        ],
      },
    ],
    gallery: [
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80", alt: "Natación" },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Largada" },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", alt: "Medalla" },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Podio" },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Equipo" },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DEPORTES).map((deporte) => ({ deporte }));
}

export async function generateMetadata({ params }: { params: Promise<{ deporte: string }> }): Promise<Metadata> {
  const { deporte } = await params;
  const config = DEPORTES[deporte];
  if (!config) return { title: "No encontrado" };
  return {
    title: `${config.nombre} — Reconocimientos Deportivos | Atenas`,
    description: config.subtitle,
  };
}

export default async function DeportePage({ params }: { params: Promise<{ deporte: string }> }) {
  const { deporte } = await params;
  const config = DEPORTES[deporte];
  if (!config) notFound();

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="RECONOCIMIENTOS DEPORTIVOS"
          title={config.nombre}
          subtitle={config.subtitle}
          ghostText={config.ghostText}
        />
        <NavReconocimientos current="deportivos" />
        <LogrosDestacados
          heading={`Nuestros logros en ${config.nombre}`}
          subheading="Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato."
          logros={config.logros}
        />
        <GaleriaLogros
          titulo={`Galería — ${config.nombre}`}
          subtitulo="Momentos históricos de nuestros atletas"
          photos={config.gallery}
        />
        <FooterCTA />
      </main>
    </>
  );
}
