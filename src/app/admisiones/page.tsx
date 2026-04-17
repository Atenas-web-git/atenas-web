import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroAdmisiones } from "@/components/admisiones/HeroAdmisiones";
import { ProcesoAdmisiones } from "@/components/admisiones/ProcesoAdmisiones";
import { NivelesAdmisiones } from "@/components/admisiones/NivelesAdmisiones";
import { VisitaAdmisiones } from "@/components/admisiones/VisitaAdmisiones";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Admisiones — Unidad Educativa Atenas",
  description:
    "Conoce el proceso de admisión del Colegio Atenas. Niveles desde Inicial hasta Bachillerato Internacional IB en Ambato, Ecuador.",
};

export default function AdmisionesPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroAdmisiones />
        <ProcesoAdmisiones />
        <NivelesAdmisiones />
        <VisitaAdmisiones />
        <FooterCTA />
      </main>
    </>
  );
}
