import type { Metadata } from "next";
import { Intro } from "@/components/home/Intro";
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Tagline } from "@/components/home/Tagline";
import { HScroll } from "@/components/home/HScroll";
import { Trayectoria } from "@/components/home/Trayectoria";
import { Niveles } from "@/components/home/Niveles";
import { PorQueAtenas } from "@/components/home/PorQueAtenas";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import type { ContenidoPlantillaM } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

// El Home se almacena en BD con slug "/" (la raíz del dominio).
const SLUG = "/";

const FALLBACK_META = {
  meta_title: "Unidad Educativa Atenas — 50 años formando líderes en Ambato",
  meta_description:
    "La institución referente de Ambato, Ecuador. Bachillerato Internacional IB acreditado, certificación ISO 9001 y 50 años formando líderes con propósito.",
};

const FALLBACK: ContenidoPlantillaM = {
  hero: {
    videoYoutubeUrl: "",
    startSeconds: 0,
    endSeconds: 0,
    bgImageSrc: "/images/00_politicas-de-seguridad-1536x864.jpg",
    titleLines: ["Formando líderes", "que transforman", "el Ecuador."],
    subtitle: "Una educación de excelencia desde 1976.",
    videoLinkText: "REPRODUCIR VIDEO",
    videoLinkUrl: "",
  },
  tagline: {
    eyebrow: "Nuestra razón de ser",
    line1: "La {institución referente} de Ambato,",
    line2: "para toda la vida.",
  },
  hscroll: {
    ghostLabel: "Vive el Atenas",
    slides: [
      {
        tab: "ACADÉMICO",
        badgeText: "Potencial",
        headingLight: "Docentes de",
        headingBold: "Excepción.",
        body:
          "Docentes con maestrías y certificaciones internacionales. La primera institución del centro del Ecuador en alcanzar la certificación ISO 9001 — un estándar global de calidad educativa.",
        mobileBody:
          "Docentes con maestrías y certificaciones internacionales. Primera institución del centro del Ecuador con certificación ISO 9001.",
        metrics: [
          { value: "ISO 9001", label: "Certificación Internacional" },
          { value: "IB Diploma", label: "Único en el centro del Ecuador" },
          { value: "1,200+", label: "Estudiantes formados" },
        ],
        imagenPrincipal:
          "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1080&q=80",
        imagenSecundaria: "",
      },
      {
        tab: "BACHILLERATO IB",
        badgeText: "IB",
        headingLight: "Bachillerato",
        headingBold: "Internacional.",
        body:
          "El único programa de Bachillerato Internacional del centro del Ecuador. Desde 2013 el Atenas forma a sus estudiantes para ingresar a las mejores universidades del mundo, en alianza con IBO, USFQ y EF Education.",
        mobileBody:
          "El único programa IB del centro del Ecuador. Desde 2013 formamos estudiantes para ingresar a las mejores universidades del mundo.",
        metrics: [
          { value: "2013", label: "Autorización IB" },
          { value: "6 áreas", label: "Del Diploma IB" },
          { value: "USFQ · IBO", label: "Alianzas internacionales" },
        ],
        imagenPrincipal: "/images/IMG_1932-vis-1-1536x1197.jpg",
        imagenSecundaria: "/images/IMG_1911-2-1536x1024.jpg",
      },
      {
        tab: "DEPORTE",
        badgeText: "Campeones",
        headingLight: "Deporte de",
        headingBold: "Campeones.",
        body:
          "Más de 50 medallas nacionales en 9 disciplinas deportivas. Campeones latinoamericanos de BMX y múltiples títulos intercolegiales que posicionan al Atenas como referente deportivo del centro del Ecuador.",
        mobileBody:
          "Más de 50 medallas nacionales en 9 disciplinas. Campeones latinoamericanos de BMX y múltiples títulos intercolegiales.",
        metrics: [
          { value: "50+", label: "Medallas nacionales" },
          { value: "9 disciplinas", label: "Deporte escolar" },
          { value: "Latam BMX", label: "Campeones 2017" },
        ],
        imagenPrincipal: "/images/00_politicas-de-seguridad-1536x864.jpg",
        imagenSecundaria:
          "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80",
      },
      {
        tab: "COMUNIDAD",
        badgeText: "Valores",
        headingLight: "50 años de",
        headingBold: "Comunidad.",
        body:
          "Una comunidad de miles de graduados que llevan los valores del Atenas al mundo. El proyecto VASE forma personas comprometidas con el respeto, la solidaridad y la verdad desde 1976.",
        mobileBody:
          "Una comunidad de miles de graduados que llevan los valores del Atenas al mundo. El proyecto VASE desde 1976.",
        metrics: [
          { value: "1976", label: "Año de fundación" },
          { value: "50 años", label: "De historia institucional" },
          { value: "VASE", label: "Valores, Acción y Servicio" },
        ],
        imagenPrincipal:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1080&q=80",
        imagenSecundaria:
          "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80",
      },
    ],
  },
  trayectoria: {
    eyebrow: "Nuestra Trayectoria",
    titleLines: ["Cinco décadas formando", "líderes con propósito."],
    subtitle:
      "Desde 1976, el Atenas ha sido el espacio donde generaciones de ambateños encontraron su camino hacia la excelencia.",
    ghostText: "50 AÑOS",
    bgImageSrc:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80",
    stats: [
      { value: "50", suffix: "+", label: "Años de excelencia" },
      { value: "1200", suffix: "+", label: "Estudiantes activos" },
      { value: "IB", suffix: "", label: "Bachillerato Internacional" },
    ],
  },
  niveles: {
    eyebrow: "Niveles Educativos",
    titleLines: [
      { text: "AQUÍ", weight: 700, opacity: 1 },
      { text: "EXPLORARÁS,", weight: 700, opacity: 1 },
      { text: "CRECERÁS", weight: 700, opacity: 1 },
      { text: "Y", weight: 300, opacity: 0.6 },
      { text: "BRILLARÁS.", weight: 700, opacity: 1 },
    ],
    mobileTitleLines: ["Aquí explorarás,", "crecerás", "y brillarás."],
    cards: [
      {
        label: "INICIAL",
        title: "Educación\nInicial",
        desc: "Educación inicial con amor, juego y desarrollo sensorial para los más pequeños.",
        img: "/images/IMG_1889-2-2-1536x1226.jpg",
        mobileTitle: "Maternal y Kínder",
        mobileLabel: "",
        href: "/academico/niveles/inicial",
      },
      {
        label: "BÁSICA",
        title: "Educación\nBásica",
        desc: "Formación integral con excelencia académica desde los primeros años escolares.",
        img: "/images/IMG_1911-2-1536x1024.jpg",
        mobileTitle: "Educación General Básica",
        mobileLabel: "",
        href: "/academico/niveles/egb-elemental-media",
      },
      {
        label: "BGU",
        title: "Bachillerato\nGeneral",
        desc: "Bachillerato General Unificado con énfasis en ciencias, matemáticas y humanidades.",
        img: "/images/IMG_1932-vis-1-1536x1197.jpg",
        mobileTitle: "Bachillerato General Unificado",
        mobileLabel: "",
        href: "/academico/niveles/egb-superior",
      },
      {
        label: "IB",
        title: "Bachillerato\nInternacional",
        desc: "El único programa IB en el centro del Ecuador. Apertura a las mejores universidades del mundo.",
        img: "/images/00_politicas-de-seguridad-1536x864.jpg",
        mobileTitle: "Diploma IB — Reconocido mundial",
        mobileLabel: "BACHILLERATO IB",
        href: "/academico/ib",
      },
    ],
  },
  porQueAtenas: {
    ghostText: "SÉ MÁS",
    eyebrow: "Por qué Atenas",
    titleLight: "Descubre incluso",
    titleBold: "más.",
    subtitle: "Cuatro razones por las que familias de Ambato eligen el Atenas, año tras año.",
    cards: [
      {
        label: "Académico",
        mobileLabel: "ACADÉMICO",
        title: "Excelencia que abre puertas",
        mobileTitle: "Educación de alto nivel",
        desc:
          "Programas con certificación ISO 9001 y el único Bachillerato IB en el centro del Ecuador.",
        img: "/images/IMG_1889-2-2-1536x1226.jpg",
        href: "/academico/niveles",
      },
      {
        label: "Identidad",
        mobileLabel: "IDENTIDAD",
        title: "Valores para toda la vida",
        mobileTitle: "Formados con propósito",
        desc:
          "Nuestro modelo VASE forma personas íntegras con Valores, Autonomía, Solidaridad y Excelencia.",
        img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80",
        href: "/el-atenas/valores",
      },
      {
        label: "Bachillerato IB",
        mobileLabel: "BACHILLERATO IB",
        title: "Visión global",
        mobileTitle: "Reconocido mundialmente",
        desc:
          "Reconocido por más de 5,000 universidades en el mundo. Aprendizaje en inglés con método CLIL.",
        img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=640&q=80",
        href: "/academico/ib",
      },
      {
        label: "Comunidad",
        mobileLabel: "COMUNIDAD",
        title: "Una familia que crece",
        mobileTitle: "Más que un colegio",
        desc:
          "50 años construyendo comunidad. Familias, docentes y graduados que llevan el Atenas para toda la vida.",
        img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=640&q=80",
        href: "/matriculas",
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    keywords:
      "colegio Ambato Ecuador, mejor colegio Ambato, bachillerato IB Ecuador, Unidad Educativa Atenas, colegio ISO 9001 Ecuador, colegio Izamba Ambato, colegio bilingüe Ambato",
    openGraph: {
      title: pagina?.meta_title ?? FALLBACK_META.meta_title,
      description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    },
  };
}

export default async function Home() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaM | undefined) ?? FALLBACK;

  return (
    <>
      <Intro />
      <Navbar />
      <main>
        <Hero hero={c.hero} />
        <Tagline tagline={c.tagline} />
        <HScroll hscroll={c.hscroll} />
        <Trayectoria trayectoria={c.trayectoria} />
        <Niveles niveles={c.niveles} />
        <PorQueAtenas porQueAtenas={c.porQueAtenas} />
        <FooterCTA />
      </main>
    </>
  );
}
