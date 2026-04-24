import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { ListasGrid } from "@/components/matriculas/ListasGrid";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Listas de Útiles 2026–2027 | Atenas",
  description: "Descarga la lista de útiles escolares por nivel educativo para el año lectivo 2026–2027 en la Unidad Educativa Atenas.",
};

export default function ListasPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS · LISTAS"
          title="Listas de Útiles"
          subtitle="Consulta los materiales escolares requeridos por nivel para el año lectivo 2026–2027."
          ghostText="LISTAS"
        />
        <NavMatriculas current="listas" />
        <ListasGrid />
        <FooterCTA />
      </main>
    </>
  );
}
