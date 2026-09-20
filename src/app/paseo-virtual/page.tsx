import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import { VisorPaseo } from "@/components/paseo/VisorPaseo";
import { getPagina } from "@/lib/cms/getPagina";
import { getPaseo } from "@/lib/paseo/getPaseo";

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
              Conoce el campus
            </p>
            <h1 style={{ margin: ".25rem 0 .5rem", fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 700 }}>
              Paseo virtual 360°
            </h1>
            <p style={{ margin: 0, maxWidth: "46rem", opacity: 0.92 }}>
              Arrastra con el dedo o el ratón para mirar alrededor, y toca los
              puntos para pasar de un espacio a otro.
            </p>
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
