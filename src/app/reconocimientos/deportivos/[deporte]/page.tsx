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

const FALLBACKS: Record<string, ContenidoPlantillaE> = {
  basquetbol: {
    hero: {
      badge: "RECONOCIMIENTOS DEPORTIVOS",
      title: "Básquetbol",
      subtitle:
        "Campeones provinciales con un equipo que demuestra disciplina, trabajo en equipo y orgullo ateniense en cada cancha.",
      ghostText: "BASKET",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Básquetbol",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.",
      items: [
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
    },
    galeria: {
      titulo: "Galería — Básquetbol",
      subtitulo: "Momentos históricos de nuestros atletas",
      photos: [
        { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80", alt: "Equipo masculino" },
        { src: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80", alt: "Entrenamiento" },
        { src: "https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?w=600&q=80", alt: "Partido final" },
        { src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80", alt: "Ceremonia" },
        { src: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=500&q=80", alt: "Trofeo" },
      ],
    },
  },
  atletismo: {
    hero: {
      badge: "RECONOCIMIENTOS DEPORTIVOS",
      title: "Atletismo",
      subtitle:
        "Velocistas y fondistas que representan a Atenas en los Juegos Nacionales Estudiantiles con medallas y récords que inspiran.",
      ghostText: "ATLETAS",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Atletismo",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.",
      items: [
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
    },
    galeria: {
      titulo: "Galería — Atletismo",
      subtitulo: "Momentos históricos de nuestros atletas",
      photos: [
        { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=700&q=80", alt: "Pista de atletismo" },
        { src: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80", alt: "Carrera" },
        { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80", alt: "Llegada" },
        { src: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?w=500&q=80", alt: "Medallas" },
        { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=500&q=80", alt: "Celebración" },
      ],
    },
  },
  futbol: {
    hero: {
      badge: "RECONOCIMIENTOS DEPORTIVOS",
      title: "Fútbol",
      subtitle:
        "Un equipo que juega con corazón ateniense — campeones provinciales y referentes del fútbol intercolegial en Tungurahua.",
      ghostText: "FÚTBOL",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Fútbol",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.",
      items: [
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
    },
    galeria: {
      titulo: "Galería — Fútbol",
      subtitulo: "Momentos históricos de nuestros atletas",
      photos: [
        { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80", alt: "Equipo de fútbol" },
        { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80", alt: "Partido" },
        { src: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80", alt: "Gol" },
        { src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&q=80", alt: "Copa" },
        { src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&q=80", alt: "Celebración" },
      ],
    },
  },
  natacion: {
    hero: {
      badge: "RECONOCIMIENTOS DEPORTIVOS",
      title: "Natación",
      subtitle:
        "Nadadores de élite que conquistan las piscinas regionales y nacionales con técnica y perseverancia.",
      ghostText: "AGUA",
    },
    showcase: { verTodosHref: "", items: [] },
    logros: {
      heading: "Nuestros logros en Natación",
      subheading: "Toca los puntos de cada tarjeta para navegar entre las fotos del campeonato.",
      items: [
        {
          icon: "🥇", deporte: "Natación", titulo: "Medalla de Oro Regional", year: "2021",
          categoria: "Zona 3 — 200m libre", highlight: true,
          photos: [
            "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80",
          ],
        },
      ],
    },
    galeria: {
      titulo: "Galería — Natación",
      subtitulo: "Momentos históricos de nuestros atletas",
      photos: [
        { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80", alt: "Natación" },
        { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Largada" },
        { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", alt: "Medalla" },
        { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Podio" },
        { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&q=80", alt: "Equipo" },
      ],
    },
  },
};

interface Props {
  params: Promise<{ deporte: string }>;
}

export function generateStaticParams() {
  return Object.keys(FALLBACKS).map((deporte) => ({ deporte }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { deporte } = await params;
  const fallback = FALLBACKS[deporte];
  if (!fallback) return { title: "No encontrado" };

  const pagina = await getPagina(`reconocimientos/deportivos/${deporte}`);
  return {
    title:
      pagina?.meta_title ??
      `${fallback.hero.title} — Reconocimientos Deportivos | Atenas`,
    description: pagina?.meta_description ?? fallback.hero.subtitle ?? "",
  };
}

export default async function DeportePage({ params }: Props) {
  const { deporte } = await params;
  const fallback = FALLBACKS[deporte];
  if (!fallback) notFound();

  const pagina = await getPagina(`reconocimientos/deportivos/${deporte}`);
  const c = (pagina?.contenido as ContenidoPlantillaE | undefined) ?? fallback;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={c.hero.badge ?? "RECONOCIMIENTOS DEPORTIVOS"}
          title={c.hero.title}
          subtitle={c.hero.subtitle ?? ""}
          ghostText={c.hero.ghostText ?? ""}
          footnote={c.hero.footnote ?? undefined}
          bgImageSrc={c.hero.bgImageSrc ?? undefined}
        />
        <NavReconocimientos current="deportivos" />
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
