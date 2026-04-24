import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { CronogramaAnual } from "@/components/cronograma/CronogramaAnual";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Cronograma Anual 2026–2027 | Atenas",
  description:
    "Calendario del año lectivo Sierra 2026–2027 de la Unidad Educativa Atenas. Consulta fechas de evaluaciones, feriados, ceremonias y actividades académicas.",
};

export default function CronogramaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="UNIDAD EDUCATIVA ATENAS"
          title="Cronograma Anual 2026 – 2027"
          subtitle="Calendario del año lectivo Sierra con todas las fechas clave para estudiantes, familias y docentes."
          ghostText="CRONOGRAMA"
        />
        <CronogramaAnual />
        <FooterCTA />
      </main>
    </>
  );
}
