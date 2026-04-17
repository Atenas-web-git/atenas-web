import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroHistoria } from "@/components/historia/HeroHistoria";
import { FundacionHistoria } from "@/components/historia/FundacionHistoria";
import { TimelineHistoria } from "@/components/historia/TimelineHistoria";
import { CifrasHistoria } from "@/components/historia/CifrasHistoria";
import { CitaHistoria } from "@/components/historia/CitaHistoria";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Historia & 50 Años — Unidad Educativa Atenas",
  description:
    "Cinco décadas formando líderes con propósito en el corazón de Ambato. Desde 1976, referentes de calidad en Ecuador.",
};

export default function HistoriaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroHistoria />
        <FundacionHistoria />
        <TimelineHistoria />
        <CifrasHistoria />
        <CitaHistoria />
        <FooterCTA />
      </main>
    </>
  );
}
