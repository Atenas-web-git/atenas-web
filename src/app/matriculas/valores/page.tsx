import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { ValoresMatricula } from "@/components/matriculas/ValoresMatricula";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Valores de Matrícula 2026–2027 | Atenas",
  description: "Estructura de costos por nivel educativo para el año lectivo 2026–2027 en la Unidad Educativa Atenas.",
};

export default function ValoresPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS · VALORES"
          title="Valores de Matrícula"
          subtitle="Estructura de costos por nivel para el año lectivo 2026–2027. Valores referenciales sujetos a confirmación oficial."
          ghostText="VALORES"
        />
        <NavMatriculas current="valores" />
        <FechasBanner />
        <ValoresMatricula />
        <FooterCTA />
      </main>
    </>
  );
}
