import { Navbar } from "@/components/home/Navbar";
import { HeroAcademico } from "@/components/academico/HeroAcademico";
import { NivelesDetalle } from "@/components/academico/NivelesDetalle";
import { MetodologiasAcademico } from "@/components/academico/MetodologiasAcademico";
import { CTAAcademico } from "@/components/academico/CTAAcademico";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata = {
  title: "Niveles Educativos — Unidad Educativa Atenas",
  description:
    "Desde Educación Inicial hasta el Diploma IB: cinco niveles con metodologías de excelencia en la Unidad Educativa Atenas, Ambato.",
};

export default function AcademicoNivelesPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAcademico />
        <NivelesDetalle />
        <MetodologiasAcademico />
        <CTAAcademico />
        <FooterCTA />
      </main>
    </>
  );
}
