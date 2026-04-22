import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDirectorio } from "@/components/el-atenas/SeccionDirectorio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Directiva de Padres de Familia — Unidad Educativa Atenas",
  description:
    "Conoce a los representantes de la directiva de padres y madres de familia de la Unidad Educativa Atenas.",
};

export default function DirectivaPPFFPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Directiva PPFF"
          subtitle="Los padres y madres de familia que representan a nuestra comunidad."
          ghostText="DIRECTIVA"
        />
        <SeccionDirectorio
          badge="DIRECTIVA PPFF"
          heading="Directiva de Padres de Familia"
          period="Pendiente de actualización"
          items={[
            { cargo: "Presidente/a", nombre: "Información pendiente" },
            { cargo: "Vicepresidente/a", nombre: "Información pendiente" },
            { cargo: "Secretario/a", nombre: "Información pendiente" },
            { cargo: "Tesorero/a", nombre: "Información pendiente" },
          ]}
          note="Los datos de la Directiva de Padres y Madres de Familia serán actualizados una vez confirmados por la institución."
        />
        <FooterCTA />
      </main>
    </>
  );
}
