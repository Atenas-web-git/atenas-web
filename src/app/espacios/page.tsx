import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionGridB } from "@/components/cms/SeccionGridB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import type {
  ContenidoPlantillaB,
  TarjetaPlantillaB,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "espacios";

const FALLBACK_HERO = {
  badge: "UNIDAD EDUCATIVA ATENAS",
  title: "Espacios de Desarrollo",
  subtitle:
    "Más allá del aula — siete dimensiones que forman el estudiante completo: ético, creativo, activo y global.",
  ghostText: "ESPACIOS",
};

const FALLBACK_SECCION = {
  badge: "TODOS LOS ESPACIOS",
  heading: "Explora cada espacio de desarrollo",
  description:
    "Cada espacio tiene su propio enfoque, actividades y coordinación. Selecciona el que te interesa para conocer los detalles completos.",
};

const FALLBACK_ITEMS: TarjetaPlantillaB[] = [
  {
    icon: "feather",
    title: "VASE",
    subtitle: "Valores, Actitudes, Servicio y Espiritualidad",
    description:
      "Formación del carácter a través del servicio comunitario, la reflexión personal y el liderazgo ético.",
    color: "gold",
    href: "/espacios/vase",
    ctaText: "Explorar espacio",
  },
  {
    icon: "star",
    title: "CAS",
    subtitle: "Creativity, Activity, Service",
    description:
      "Componente central del IB donde cada estudiante diseña su portafolio de proyectos creativos y de servicio.",
    color: "gold",
    highlight: true,
    href: "/espacios/cas",
    ctaText: "Explorar espacio",
  },
  {
    icon: "globe",
    title: "Idioma",
    subtitle: "Programa de inglés Cambridge",
    description:
      "Entorno bilingüe con certificaciones Cambridge desde Inicial hasta el graduado de Bachillerato.",
    color: "gold",
    href: "/espacios/idioma",
    ctaText: "Explorar espacio",
  },
  {
    icon: "theater",
    title: "Cultura",
    subtitle: "Arte, Música, Teatro y Danza",
    description:
      "Expresión creativa como pilar de la formación integral, con festival anual y agrupaciones institucionales.",
    color: "gold",
    href: "/espacios/cultura",
    ctaText: "Explorar espacio",
  },
  {
    icon: "trophy",
    title: "Ed. Física",
    subtitle: "Deporte y Bienestar",
    description:
      "Equipos de competencia provincial y programas de bienestar que forman hábitos saludables de por vida.",
    color: "gold",
    href: "/espacios/educacion-fisica",
    ctaText: "Explorar espacio",
  },
  {
    icon: "plane",
    title: "Intercambio",
    subtitle: "Programa Internacional",
    description:
      "Experiencias educativas en el exterior que forman ciudadanos globales con perspectiva multicultural.",
    color: "gold",
    href: "/espacios/intercambio",
    ctaText: "Explorar espacio",
  },
  {
    // No «trophy»: ese ya es el de Ed. Física y dos tarjetas de deporte con el
    // mismo icono en la misma grilla se leen como la misma cosa.
    icon: "medal",
    title: "Escuelas permanentes",
    subtitle: "Extracurriculares",
    description:
      "Escuelas de fútbol y básquet que funcionan durante todo el año lectivo, fuera del horario de clases.",
    color: "gold",
    href: "/espacios/extracurriculares",
    ctaText: "Explorar espacio",
  },
];

const FALLBACK_META = {
  meta_title: "Espacios de Desarrollo | Atenas",
  meta_description:
    "Descubre los espacios de desarrollo integral de la Unidad Educativa Atenas: VASE, CAS, Idioma, Cultura, Educación Física, Intercambio Internacional y escuelas extracurriculares.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function EspaciosPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaB | undefined) ?? null;

  const hero = {
    badge: c?.hero?.badge ?? FALLBACK_HERO.badge,
    title: c?.hero?.title ?? FALLBACK_HERO.title,
    subtitle: c?.hero?.subtitle ?? FALLBACK_HERO.subtitle,
    ghostText: c?.hero?.ghostText ?? FALLBACK_HERO.ghostText,
    footnote: c?.hero?.footnote ?? undefined,
    bgImageSrc: c?.hero?.bgImageSrc ?? undefined,
  };

  const items = c?.seccion?.items?.length ? c.seccion.items : FALLBACK_ITEMS;

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
        <SeccionGridB
          badge={c?.seccion?.badge ?? FALLBACK_SECCION.badge}
          heading={c?.seccion?.heading ?? FALLBACK_SECCION.heading}
          description={c?.seccion?.description ?? FALLBACK_SECCION.description}
          items={items}
          cols={3}
          bgColor="var(--color-cream)"
        />
        <FooterCTA />
      </main>
    </>
  );
}
