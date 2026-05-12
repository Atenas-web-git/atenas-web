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

const SLUG = "reconocimientos/academicos";

const FALLBACK: ContenidoPlantillaE = {
  hero: {
    badge: "RECONOCIMIENTOS",
    title: "Reconocimientos Académicos",
    subtitle:
      "Estudiantes que destacan en olimpiadas, el Diploma IB, certificaciones Cambridge y ferias científicas a nivel nacional e internacional.",
    ghostText: "ACADÉMICO",
  },
  showcase: {
    verTodosHref: "/reconocimientos/academicos",
    items: [
      {
        slug: "olimpiadas",
        icon: "🧠",
        nombre: "Olimpiadas",
        count: 20,
        countLabel: "Medallas obtenidas",
        photoSrc: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
        basePath: "/reconocimientos/academicos",
      },
      {
        slug: "ib",
        icon: "★",
        nombre: "Diploma IB",
        count: "95%",
        countLabel: "Tasa de aprobación",
        photoSrc: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&q=80",
        basePath: "/reconocimientos/academicos",
      },
      {
        slug: "cambridge",
        icon: "🌐",
        nombre: "Cambridge",
        count: 40,
        countLabel: "Certificados anuales",
        photoSrc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
        basePath: "/reconocimientos/academicos",
      },
      {
        slug: "ciencia",
        icon: "🔬",
        nombre: "Ciencia y Tech",
        count: 8,
        countLabel: "Proyectos premiados",
        photoSrc: "https://images.unsplash.com/photo-1532094349884-543559059574?w=600&q=80",
        basePath: "/reconocimientos/academicos",
      },
    ],
  },
  logros: {
    heading: "Logros académicos que trascienden fronteras",
    subheading: "Cada tarjeta documenta un hito — toca los puntos para ver las fotos del momento.",
    items: [
      {
        icon: "🥇",
        deporte: "Olimpiadas",
        titulo: "Medalla de Oro — Matemáticas",
        year: "2023",
        categoria: "Olimpiada Nacional Estudiantil",
        highlight: true,
        photos: [
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
          "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
        ],
      },
      {
        icon: "★",
        deporte: "Diploma IB",
        titulo: "Puntaje Máximo — 45/45",
        year: "2023",
        categoria: "Bachillerato Internacional · Promoción 2023",
        photos: [
          "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=700&q=80",
          "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
        ],
      },
      {
        icon: "🔬",
        deporte: "Ciencia y Tech",
        titulo: "1er Lugar — Feria de Ciencias",
        year: "2022",
        categoria: "Feria Nacional de Ciencia y Tecnología",
        photos: [
          "https://images.unsplash.com/photo-1532094349884-543559059574?w=700&q=80",
          "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
        ],
      },
    ],
  },
  galeria: {
    titulo: "Galería Académica",
    subtitulo: "Graduaciones, premios y momentos que celebramos juntos",
    photos: [
      { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80", alt: "Ceremonia de grados" },
      { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&q=80", alt: "Olimpiadas" },
      { src: "https://images.unsplash.com/photo-1627556592933-ffe99c1cd9eb?w=600&q=80", alt: "Diploma IB" },
      { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80", alt: "Cambridge" },
      { src: "https://images.unsplash.com/photo-1532094349884-543559059574?w=500&q=80", alt: "Feria de Ciencias" },
    ],
  },
};

const FALLBACK_META = {
  meta_title: "Reconocimientos Académicos | Atenas",
  meta_description:
    "Los estudiantes de la Unidad Educativa Atenas destacan en olimpiadas, certificaciones internacionales y concursos académicos a nivel nacional e internacional.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function AcademicosPage() {
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
        <NavReconocimientos current="academicos" />
        {c.showcase.items.length > 0 && (
          <DisciplinaShowcase
            verTodosHref={c.showcase.verTodosHref}
            disciplinas={c.showcase.items}
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
