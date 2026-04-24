import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionNivelDetalle } from "@/components/academico/SeccionNivelDetalle";
import { NavNiveles } from "@/components/academico/NavNiveles";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "EGB Superior — Unidad Educativa Atenas",
  description:
    "Etapa de consolidación y transición hacia el bachillerato. 8vo a 10mo EGB en la Unidad Educativa Atenas, Ambato.",
};

export default function EGBSuperiorPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ACADÉMICO"
          title="EGB Superior"
          subtitle="Consolidación académica y preparación para el bachillerato en un entorno de excelencia."
          ghostText="SUPERIOR"
        />
        <SeccionNivelDetalle
          badge="EGB Superior"
          heading="Consolidación y preparación para el bachillerato"
          grades="8vo a 10mo EGB"
          ages="12–14 años"
          paragraphs={[
            "La EGB Superior es una etapa de consolidación donde los estudiantes afianzan todas las áreas del conocimiento y desarrollan habilidades de pensamiento crítico, investigación y comunicación que los preparan para el bachillerato.",
            "Contamos con acompañamiento docente personalizado, orientación vocacional progresiva e inglés avanzado, asegurando que cada estudiante llegue al bachillerato con una base sólida y la confianza necesaria para elegir su camino.",
          ]}
          methods={["Inglés avanzado", "Orientación vocacional", "Pensamiento crítico"]}
          note="El contenido pedagógico detallado de este nivel estará disponible próximamente, en coordinación con el equipo académico de la Unidad Educativa Atenas."
          photos={[
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
            "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80",
          ]}
        />
        <NavNiveles current="egb-superior" />
        <FooterCTA />
      </main>
    </>
  );
}
