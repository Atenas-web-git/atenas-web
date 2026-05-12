import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { DisciplinaShowcase } from "@/components/reconocimientos/DisciplinaShowcase";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import type { ContenidoPlantillaE } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "reconocimientos/deportivos";

const FALLBACK: ContenidoPlantillaE = {
  hero: {
    badge: "RECONOCIMIENTOS",
    title: "Reconocimientos Deportivos",
    subtitle:
      "Atletas que representan a Atenas con excelencia — campeonatos provinciales, nacionales y logros que enorgullecen a toda la comunidad.",
    ghostText: "DEPORTE",
  },
  showcase: {
    verTodosHref: "/reconocimientos/deportivos",
    items: [
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
    ],
  },
  logros: {
    heading: "Campeones que representan a Atenas en todo el país",
    subheading: "Cada tarjeta es un álbum de fotos del campeonato — toca los puntos para ver todos los momentos.",
    items: [
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
    ],
  },
  galeria: {
    titulo: "Galería de Logros",
    subtitulo: "Momentos que quedan en la historia del colegio",
    photos: [
      { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80", alt: "Básquetbol" },
      { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80", alt: "Atletismo" },
      { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80", alt: "Fútbol" },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Natación" },
      { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80", alt: "Celebración" },
    ],
  },
};

const FALLBACK_META = {
  meta_title: "Reconocimientos Deportivos | Atenas",
  meta_description:
    "Los atletas de la Unidad Educativa Atenas compiten y ganan en campeonatos provinciales y nacionales. Conoce nuestros logros deportivos por disciplina.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function DeportivosPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaE | undefined) ?? FALLBACK;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={c.hero.badge ?? "RECONOCIMIENTOS"}
          title={c.hero.title}
          subtitle={c.hero.subtitle ?? ""}
          ghostText={c.hero.ghostText ?? ""}
          footnote={c.hero.footnote ?? undefined}
          bgImageSrc={c.hero.bgImageSrc ?? undefined}
        />
        <NavReconocimientos current="deportivos" />
        {c.showcase.items.length > 0 && (
          <DisciplinaShowcase
            disciplinas={c.showcase.items}
            verTodosHref={c.showcase.verTodosHref}
          />
        )}
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
