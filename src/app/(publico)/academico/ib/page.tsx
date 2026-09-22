import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroIB } from "@/components/ib/HeroIB";
import { NucleoIB } from "@/components/ib/NucleoIB";
import { MateriasIB } from "@/components/ib/MateriasIB";
import { ProcesoIB } from "@/components/ib/ProcesoIB";
import { ExplorarIB } from "@/components/ib/ExplorarIB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import {
  defaultContenidoPlantillaG,
  type ContenidoPlantillaG,
} from "@/app/admin/(authenticated)/contenido/plantillas";
import { jsonParaScript } from "@/lib/cms/htmlSeguro";

export const revalidate = 60;

const SLUG = "academico/ib";

const FALLBACK: ContenidoPlantillaG = defaultContenidoPlantillaG();

const FALLBACK_META = {
  meta_title: "Bachillerato Internacional IB — Unidad Educativa Atenas",
  meta_description:
    "El único colegio en el centro del país con el Programa del Diploma IB acreditado. CAS, Monografía, Teoría del Conocimiento y 6 grupos de asignaturas para universidades del mundo.",
};

const ibSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  name: "Programa del Diploma del Bachillerato Internacional (IBDP)",
  description:
    "Programa de bachillerato de dos años acreditado por la International Baccalaureate Organization. Reconocido por universidades en más de 90 países. Incluye CAS, Monografía y Teoría del Conocimiento.",
  url: "https://atenas.edu.ec/academico/ib",
  provider: {
    "@type": "EducationalOrganization",
    "@id": "https://atenas.edu.ec/#organization",
    name: "Unidad Educativa Atenas",
  },
  educationalProgramMode: "full-time",
  educationalCredentialAwarded: "Diploma del Bachillerato Internacional (IB Diploma)",
  occupationalCredentialAwarded: "IB Diploma — International Baccalaureate",
  programPrerequisites: "Educación General Básica Superior aprobada",
  timeToComplete: "P2Y",
  inLanguage: ["es", "en"],
  offers: {
    "@type": "Offer",
    category: "Bachillerato Internacional",
    seller: { "@id": "https://atenas.edu.ec/#organization" },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.meta_title,
    description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    keywords:
      "bachillerato IB Ambato, colegio IB Ecuador, Programa del Diploma IB, colegio bilingüe Ambato, universidades internacionales Ecuador",
    openGraph: {
      title: pagina?.meta_title ?? FALLBACK_META.meta_title,
      description: pagina?.meta_description ?? FALLBACK_META.meta_description,
    },
  };
}

export default async function IBPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoPlantillaG | undefined) ?? FALLBACK;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonParaScript(ibSchema) }}
      />
      <Navbar />
      <main>
        <HeroIB hero={c.hero} />
        <NucleoIB nucleo={c.nucleo} />
        <MateriasIB materias={c.materias} />
        <ProcesoIB proceso={c.proceso} />
        <ExplorarIB explorar={c.explorar} />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
