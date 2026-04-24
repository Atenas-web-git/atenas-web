import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { ExplorarEspacios } from "@/components/espacios/ExplorarEspacios";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Espacios de Desarrollo | Atenas",
  description:
    "Descubre los espacios de desarrollo integral de la Unidad Educativa Atenas: VASE, CAS, Idioma, Cultura, Educación Física e Intercambio Internacional.",
};

export default function EspaciosPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="UNIDAD EDUCATIVA ATENAS"
          title="Espacios de Desarrollo"
          subtitle="Más allá del aula — seis dimensiones que forman el estudiante completo: ético, creativo, activo y global."
          ghostText="ESPACIOS"
        />
        <ExplorarEspacios />
        <FooterCTA />
      </main>
    </>
  );
}
