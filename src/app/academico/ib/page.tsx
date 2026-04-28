import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroIB } from "@/components/ib/HeroIB";
import { NucleoIB } from "@/components/ib/NucleoIB";
import { MateriasIB } from "@/components/ib/MateriasIB";
import { ProcesoIB } from "@/components/ib/ProcesoIB";
import { ExplorarIB } from "@/components/ib/ExplorarIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Bachillerato Internacional IB — Unidad Educativa Atenas",
  description:
    "El único colegio en el centro del país con el Programa del Diploma IB acreditado. CAS, Monografía, Teoría del Conocimiento y 6 grupos de asignaturas para universidades del mundo.",
  keywords:
    "bachillerato IB Ambato, colegio IB Ecuador, Programa del Diploma IB, colegio bilingüe Ambato, universidades internacionales Ecuador",
  openGraph: {
    title: "Bachillerato Internacional IB — Unidad Educativa Atenas",
    description:
      "El único colegio IB acreditado en el centro de Ecuador. Diploma IB reconocido por universidades del mundo, en Ambato.",
  },
};

export default function IBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroIB />
        <NucleoIB />
        <MateriasIB />
        <ProcesoIB />
        <ExplorarIB />
        <FooterCTA />
      </main>
    </>
  );
}
