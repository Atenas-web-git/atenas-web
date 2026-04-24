import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { ProcesoMatricula } from "@/components/matriculas/ProcesoMatricula";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Proceso de Matrícula 2026–2027 | Atenas",
  description: "Conoce los 5 pasos para matricularte en la Unidad Educativa Atenas para el año lectivo 2026–2027.",
};

export default function ProcesoPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS · PROCESO"
          title="Cómo matricularte"
          subtitle="Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027."
          ghostText="PROCESO"
        />
        <NavMatriculas current="proceso" />
        <FechasBanner />
        <ProcesoMatricula />
        <FooterCTA />
      </main>
    </>
  );
}
