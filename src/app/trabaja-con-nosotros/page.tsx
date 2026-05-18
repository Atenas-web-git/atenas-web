import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { TrabajaHero } from "@/components/trabaja/TrabajaHero";
import { TrabajaValores } from "@/components/trabaja/TrabajaValores";
import { TrabajaForm } from "@/components/trabaja/TrabajaForm";
import { getPagina } from "@/lib/cms/getPagina";
import type {
  ContenidoPlantillaN,
  ValorPlantillaN,
} from "@/app/admin/(authenticated)/contenido/plantillas";

// ISR: la página revalida cada 60s; los cambios desde el backoffice
// también disparan revalidatePath inmediato.
export const revalidate = 60;

const SLUG = "trabaja-con-nosotros";

const FALLBACK_META = {
  title: "Trabaja con Nosotros | Unidad Educativa Atenas",
  description:
    "Forma parte del equipo de la Unidad Educativa Atenas. Completa tu postulación y únete a una institución con más de 50 años formando líderes en Ambato, Ecuador.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.title,
    description: pagina?.meta_description ?? FALLBACK_META.description,
  };
}

export default async function TrabajaConNosotrosPage() {
  const pagina = await getPagina(SLUG);
  const contenido = (pagina?.contenido ?? null) as ContenidoPlantillaN | null;

  // Cada componente acepta props opcionales y cae a sus defaults internos si
  // no se le pasa nada — eso garantiza que si la migración aún no se ejecutó
  // (caso "publicar primero, BD después") la página siga renderizando OK.
  const hero = contenido?.hero;
  const valores = contenido?.valores;
  const formulario = contenido?.formulario;

  return (
    <>
      <Navbar />
      <main>
        <TrabajaHero
          eyebrow={hero?.eyebrow}
          titleLine1={hero?.titleLine1}
          titleLine2={hero?.titleLine2}
          description={hero?.description}
          caption={hero?.caption}
          ghostText={hero?.ghostText}
          bgImage={hero?.bgImage}
        />
        <TrabajaValores
          eyebrow={valores?.eyebrow}
          heading={valores?.heading}
          description={valores?.description}
          items={
            valores?.items && valores.items.length > 0
              ? (valores.items as ValorPlantillaN[])
              : undefined
          }
        />
        <TrabajaForm
          heading={formulario?.heading}
          subtitle={formulario?.subtitle}
          step1Label={formulario?.step1Label}
          step2Label={formulario?.step2Label}
          successTitle={formulario?.successTitle}
          successText={formulario?.successText}
        />
        <FooterCTA />
      </main>
    </>
  );
}
