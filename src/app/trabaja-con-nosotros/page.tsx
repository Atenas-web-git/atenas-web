import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { TrabajaHero } from "@/components/trabaja/TrabajaHero";
import { TrabajaValores } from "@/components/trabaja/TrabajaValores";
import { TrabajaForm } from "@/components/trabaja/TrabajaForm";

export const metadata: Metadata = {
  title: "Trabaja con Nosotros | Unidad Educativa Atenas",
  description:
    "Forma parte del equipo de la Unidad Educativa Atenas. Completa tu postulación y únete a una institución con más de 50 años formando líderes en Ambato, Ecuador.",
};

export default function TrabajaConNosotrosPage() {
  return (
    <>
      <Navbar />
      <main>
        <TrabajaHero />
        <TrabajaValores />
        <TrabajaForm />
        <FooterCTA />
      </main>
    </>
  );
}
