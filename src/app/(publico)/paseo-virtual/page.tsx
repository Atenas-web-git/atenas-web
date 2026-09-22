import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import { VisorPaseo } from "@/components/paseo/VisorPaseo";
import { getPagina } from "@/lib/cms/getPagina";
import { getPaseo } from "@/lib/paseo/getPaseo";
import {
  defaultContenidoPlantillaU,
  type ContenidoPlantillaU,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "paseo-virtual";

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? "Paseo Virtual 360° — Unidad Educativa Atenas",
    description:
      pagina?.meta_description ??
      "Recorre el campus de la Unidad Educativa Atenas sin salir de casa: aulas, laboratorios, biblioteca, canchas y áreas de inicial en 360°.",
    keywords:
      "paseo virtual colegio Ambato, tour 360 Unidad Educativa Atenas, recorrido virtual campus, instalaciones colegio Ambato",
    openGraph: {
      title: pagina?.meta_title ?? "Paseo Virtual 360° — Unidad Educativa Atenas",
      description:
        pagina?.meta_description ??
        "Conoce cada espacio del campus en 360°, desde el celular o la computadora.",
    },
  };
}

export default async function PaseoVirtualPage() {
  const [pagina, escenas] = await Promise.all([getPagina(SLUG), getPaseo()]);

  // La cabecera la escribe el colegio desde Contenido › Páginas. Si la fila
  // todavía no existe —o alguien la despublica— se pintan los textos de
  // reserva, que son los que tenía la página antes de ser editable.
  const c =
    (pagina?.contenido as ContenidoPlantillaU | undefined) ?? defaultContenidoPlantillaU();
  const hero = { ...defaultContenidoPlantillaU().hero, ...(c.hero ?? {}) };

  return (
    <>
      <Navbar />
      <main>
        <header
          style={{
            background: "#1A2B4A",
            color: "#F8F5F0",
            padding: "6.5rem 1.25rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <p style={{ margin: 0, opacity: 0.85, letterSpacing: ".08em", fontSize: ".8125rem", textTransform: "uppercase" }}>
              {hero.badge}
            </p>
            <h1 style={{ margin: ".25rem 0 .5rem", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 700 }}>
              {hero.title}
            </h1>
            <p style={{ margin: 0, maxWidth: "46rem", opacity: 0.92 }}>{hero.intro}</p>
          </div>
        </header>

        <VisorPaseo escenas={escenas} />

        {/* Formulario que el colegio asigne desde Contenido › Páginas. */}
        <BloqueFormulario formularioId={pagina?.formulario_id ?? null} />
        <FooterCTA />
      </main>
    </>
  );
}
