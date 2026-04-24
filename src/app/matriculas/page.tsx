import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { ProcesoMatricula } from "@/components/matriculas/ProcesoMatricula";
import { DisciplinaShowcase } from "@/components/reconocimientos/DisciplinaShowcase";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Matrículas 2026–2027 | Unidad Educativa Atenas",
  description: "Conoce el proceso de matrícula, valores, listas de útiles y autorizaciones bancarias para el año lectivo 2026–2027 en la Unidad Educativa Atenas.",
};

const CATEGORIAS = [
  {
    slug: "proceso",
    icon: "📋",
    nombre: "Proceso",
    count: "5",
    countLabel: "pasos simples",
    photoSrc: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
    basePath: "/matriculas",
  },
  {
    slug: "valores",
    icon: "💰",
    nombre: "Valores",
    count: "6",
    countLabel: "niveles educativos",
    photoSrc: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80",
    basePath: "/matriculas",
  },
  {
    slug: "listas",
    icon: "📝",
    nombre: "Listas de Útiles",
    count: "6",
    countLabel: "listas por nivel",
    photoSrc: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&q=80",
    basePath: "/matriculas",
  },
  {
    slug: "autorizaciones",
    icon: "🏦",
    nombre: "Autorizaciones",
    count: "3",
    countLabel: "bancos disponibles",
    photoSrc: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&q=80",
    basePath: "/matriculas",
  },
];

export default function MatriculasPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="MATRÍCULAS 2026–2027"
          title="Proceso de Matrícula"
          subtitle="Todo lo que necesitas para formalizar el ingreso o reingreso de tu hijo en la Unidad Educativa Atenas."
          ghostText="MATRÍCULAS"
        />
        <NavMatriculas />
        <FechasBanner />
        <DisciplinaShowcase
          heading="Todo lo que necesitas para matricularte"
          ctaText="Ver detalle"
          disciplinas={CATEGORIAS}
        />
        <ProcesoMatricula />
        <FooterCTA />
      </main>
    </>
  );
}
