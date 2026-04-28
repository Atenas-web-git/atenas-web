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
    "Cinco décadas formando líderes con propósito en el corazón de Ambato. Fundada en 1976, referente de calidad educativa en Ecuador con bachillerato IB y certificación ISO 9001.",
  keywords:
    "historia Unidad Educativa Atenas, 50 años colegio Ambato, fundación 1976 colegio Ambato, mejor colegio historia Tungurahua",
  openGraph: {
    title: "50 Años de Historia — Unidad Educativa Atenas",
    description:
      "Desde 1976, formando líderes con propósito en Ambato, Ecuador. Cinco décadas de excelencia educativa con bachillerato IB y certificación ISO 9001.",
  },
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
