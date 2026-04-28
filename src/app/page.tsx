import type { Metadata } from "next";
import { Intro } from "@/components/home/Intro";

export const metadata: Metadata = {
  title: "Unidad Educativa Atenas — 50 años formando líderes en Ambato",
  description:
    "La institución referente de Ambato, Ecuador. Bachillerato Internacional IB acreditado, certificación ISO 9001 y 50 años formando líderes con propósito.",
  keywords:
    "colegio Ambato Ecuador, mejor colegio Ambato, bachillerato IB Ecuador, Unidad Educativa Atenas, colegio ISO 9001 Ecuador, colegio Izamba Ambato, colegio bilingüe Ambato",
  openGraph: {
    title: "Unidad Educativa Atenas — 50 años formando líderes en Ambato",
    description:
      "La institución referente de Ambato. Bachillerato IB acreditado, ISO 9001 y 50 años de excelencia educativa en el corazón de Ecuador.",
  },
};
import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { Tagline } from "@/components/home/Tagline";
import { HScroll } from "@/components/home/HScroll";
import { Trayectoria } from "@/components/home/Trayectoria";
import { Niveles } from "@/components/home/Niveles";
import { PorQueAtenas } from "@/components/home/PorQueAtenas";
import { FooterCTA } from "@/components/home/FooterCTA";

export default function Home() {
  return (
    <>
      <Intro />
      <Navbar />
      <main>
        <Hero />
        <Tagline />
        <HScroll />
        <Trayectoria />
        <Niveles />
        <PorQueAtenas />
        <FooterCTA />
      </main>
    </>
  );
}
