import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionGridB } from "@/components/cms/SeccionGridB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import type {
  ContenidoPlantillaB,
  TarjetaPlantillaB,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "servicios";

const FALLBACK_HERO = {
  badge: "UNIDAD EDUCATIVA ATENAS",
  title: "Servicios Institucionales",
  subtitle:
    "Todos los recursos y servicios disponibles para el bienestar y desarrollo de nuestra comunidad educativa.",
  ghostText: "SERVICIOS",
};

const FALLBACK_SECCION = {
  badge: "TODOS LOS SERVICIOS",
  heading: "¿En qué podemos ayudarte?",
  description:
    "Conoce todos los servicios disponibles para estudiantes, representantes legales y docentes de la Unidad Educativa Atenas.",
};

const FALLBACK_ITEMS: TarjetaPlantillaB[] = [
  {
    icon: "utensils",
    title: "Bar Escolar",
    description:
      "Menú nutritivo y variado para estudiantes y docentes durante el horario escolar.",
    color: "gold",
    href: "/servicios/bar-cafeteria",
    ctaText: "Ver servicio",
  },
  {
    icon: "book-open",
    title: "Biblioteca",
    description:
      "Amplia colección bibliográfica física y digital disponible para toda la comunidad educativa.",
    color: "gold",
    href: "/servicios/biblioteca",
    ctaText: "Ver servicio",
  },
  {
    icon: "bus",
    title: "Transporte",
    description:
      "Rutas de transporte seguro y puntual desde y hacia el colegio para todos los estudiantes.",
    color: "gold",
    href: "/servicios/transporte",
    ctaText: "Ver servicio",
  },
  {
    icon: "heart-pulse",
    title: "Dispensario Médico",
    description: "Atención médica inmediata y primeros auxilios durante la jornada escolar.",
    color: "gold",
    href: "/servicios/dispensario-medico",
    ctaText: "Ver servicio",
  },
  {
    icon: "key",
    title: "Llave del Aprendizaje",
    description:
      "Sistema de casilleros personales para guardar útiles y pertenencias de forma segura.",
    color: "gold",
    href: "/servicios/llave-aprendizaje",
    ctaText: "Ver servicio",
  },
  {
    icon: "award",
    title: "Becas",
    description:
      "Programas de financiamiento para estudiantes con excelencia académica y necesidad.",
    color: "gold",
    href: "/servicios/becas",
    ctaText: "Ver servicio",
  },
  {
    icon: "shield-check",
    title: "Seguro Estudiantil",
    description: "Cobertura integral de accidentes y emergencias para todos los estudiantes.",
    color: "gold",
    href: "/servicios/seguro-estudiantil",
    ctaText: "Ver servicio",
  },
  {
    icon: "message-circle",
    title: "Quejas y Sugerencias",
    description:
      "Canal oficial para compartir retroalimentación y ayudarnos a mejorar continuamente.",
    color: "red",
    href: "/servicios/quejas-sugerencias",
    ctaText: "Enviar comunicación",
  },
];

const FALLBACK_META = {
  meta_title: "Servicios | Atenas",
  meta_description:
    "Conoce todos los servicios disponibles para estudiantes, representantes legales y docentes de la Unidad Educativa Atenas: bar, biblioteca, transporte, dispensario médico, casilleros, becas, seguro estudiantil y canal de quejas.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function ServiciosPage() {
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
          cols={4}
          bgColor="#F5F1EB"
        />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
