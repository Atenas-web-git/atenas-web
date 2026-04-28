import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroAdmisiones } from "@/components/admisiones/HeroAdmisiones";
import { ProcesoAdmisiones } from "@/components/admisiones/ProcesoAdmisiones";
import { NivelesAdmisiones } from "@/components/admisiones/NivelesAdmisiones";
import { ExplorarAdmisiones } from "@/components/admisiones/ExplorarAdmisiones";
import { VisitaAdmisiones } from "@/components/admisiones/VisitaAdmisiones";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Admisiones — Unidad Educativa Atenas",
  description:
    "Conoce el proceso de admisión del Colegio Atenas en Ambato, Ecuador. Niveles desde Inicial hasta Bachillerato Internacional IB. Solicita tu visita.",
  keywords:
    "admisiones colegio Ambato, inscripciones Unidad Educativa Atenas, proceso de admisión colegio IB Ecuador, matrícula colegio Ambato",
  openGraph: {
    title: "Admisiones — Unidad Educativa Atenas",
    description:
      "Inicia el proceso de admisión en el Colegio Atenas de Ambato. Bachillerato IB, certificación ISO 9001 y formación integral desde Inicial hasta BGU.",
  },
};

export default function AdmisionesPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAdmisiones />
        <ProcesoAdmisiones />
        <NivelesAdmisiones />
        <ExplorarAdmisiones />
        <VisitaAdmisiones />
        <FooterCTA />
      </main>
    </>
  );
}
