import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { PoliticasGrid } from "@/components/politicas/PoliticasGrid";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Política de Privacidad | Unidad Educativa Atenas",
  description:
    "Información sobre el tratamiento de datos personales de la Fundación Cultural y Educativa Ambato, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
};

export default function PoliticasPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="UNIDAD EDUCATIVA ATENAS"
          title="Políticas Institucionales"
          subtitle="Transparencia en el tratamiento de datos personales de nuestra comunidad educativa, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador."
          ghostText="POLÍTICAS"
        />
        <PoliticasGrid />
        <FooterCTA />
      </main>
    </>
  );
}
