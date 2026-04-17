import { Navbar } from "@/components/home/Navbar";
import { HeroIB } from "@/components/ib/HeroIB";
import { NucleoIB } from "@/components/ib/NucleoIB";
import { MateriasIB } from "@/components/ib/MateriasIB";
import { ProcesoIB } from "@/components/ib/ProcesoIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata = {
  title: "Bachillerato Internacional IB — Unidad Educativa Atenas",
  description:
    "El único colegio en el centro del país con el Programa del Diploma IB acreditado. CAS, Monografía, Teoría del Conocimiento y 6 grupos de asignaturas para universidades del mundo.",
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
        <FooterCTA />
      </main>
    </>
  );
}
