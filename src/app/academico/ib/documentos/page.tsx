import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import { getPlantillaF } from "@/lib/cms/getPlantillaF";
import type { ContenidoPlantillaF } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "academico/ib/documentos";

const FALLBACK: ContenidoPlantillaF = {
  hero: {
    badge: "BACHILLERATO IB",
    title: "Documentos IB",
    subtitle: "Recursos oficiales del Programa del Diploma para que estudiantes y familias conozcan el programa a fondo.",
    ghostText: "DOCS",
  },
  stats: [
    { label: "Programa", value: "Diploma del IB" },
    { label: "Nivel", value: "1ro y 2do Bachillerato" },
    { label: "Acreditación", value: "IBO — International Baccalaureate" },
  ],
  intro: {
    badge: "Bachillerato Internacional",
    heading: "Todo lo que necesitas saber sobre el Diploma IB",
    headingHighlight: "Diploma IB",
    paragraphs: [
      "El Programa del Diploma IB funciona bajo una normativa clara y pública. En Atenas ponemos a disposición de toda la comunidad los documentos oficiales y las políticas institucionales.",
    ],
    chipsLabel: "Componentes",
    chips: [],
    photos: ["", "", ""],
    badgeCollage: "ATENAS IB ★",
  },
  seccionInferior: { tipo: "ninguna" },
};

const FALLBACK_META = {
  meta_title: "Documentos IB — Unidad Educativa Atenas",
  meta_description:
    "Documentos oficiales del Programa del Diploma IB en la Unidad Educativa Atenas: guías, reglamentos y recursos para estudiantes y familias.",
};

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPlantillaF(SLUG);
  return {
    title: data?.meta_title ?? FALLBACK_META.meta_title,
    description: data?.meta_description ?? FALLBACK_META.meta_description,
  };
}

export default async function DocumentosIBPage() {
  // El formulario que el colegio haya asignado a esta página.
  const pagina = await getPagina("academico/ib/documentos");

  const data = await getPlantillaF(SLUG);
  const c = data?.contenido ?? FALLBACK;
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={c.hero.badge}
          title={c.hero.title}
          subtitle={c.hero.subtitle}
          ghostText={c.hero.ghostText}
          footnote={c.hero.footnote}
          bgImageSrc={c.hero.bgImageSrc}
        />
        <NavIB current="documentos" />
        <SeccionDetalleAcademico
          stats={c.stats}
          intro={c.intro}
          seccionInferior={c.seccionInferior}
        />
        {/* Formulario que el colegio asigne desde Contenido › Páginas. Si no
            hay ninguno, no se pinta nada. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
