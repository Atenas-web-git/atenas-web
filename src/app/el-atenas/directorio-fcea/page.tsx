import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionDirectorio } from "@/components/el-atenas/SeccionDirectorio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Directorio FCEA — Unidad Educativa Atenas",
  description:
    "Directorio de la Fundación Cultural y Educativa Ambato, entidad que gestiona la Unidad Educativa Atenas.",
};

export default function DirectorioFCEAPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Directorio FCEA"
          subtitle="La Fundación Cultural y Educativa Ambato es la entidad que gestiona y dirige la institución."
          ghostText="DIRECTORIO"
        />
        <SeccionDirectorio
          badge="DIRECTORIO FCEA"
          heading="Directorio de la Fundación"
          period="2021–2026"
          items={[
            { cargo: "Presidenta", nombre: "Francisca Nieto" },
            { cargo: "Tesorero", nombre: "Paúl Reyes" },
            { cargo: "Secretario", nombre: "Luis Antonio Anda" },
            { cargo: "Vocal 1 — Entorno físico y ambiental", nombre: "Kleber Betancourt" },
            { cargo: "Vocal 2 — Estilo de vida", nombre: "Monserrath Villacis" },
            { cargo: "Vocal 3 — Vida en comunidad", nombre: "Andrea Villagran" },
            { cargo: "Vocal 4 — Dinámica educativa e institucional", nombre: "Martha Alava" },
          ]}
          note="Fundación Cultural y Educativa Ambato — institución sin fines de lucro responsable de la gestión de la Unidad Educativa Atenas."
        />
        <FooterCTA />
      </main>
    </>
  );
}
