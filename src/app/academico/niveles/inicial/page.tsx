import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionNivelDetalle } from "@/components/academico/SeccionNivelDetalle";
import { NavNiveles } from "@/components/academico/NavNiveles";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Educación Inicial — Unidad Educativa Atenas",
  description:
    "Metodología Montessori, Reggio Emilia y ABN para los primeros años. Inglés integrado desde Pre-Kinder en la Unidad Educativa Atenas, Ambato.",
};

export default function InicialPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ACADÉMICO"
          title="Educación Inicial"
          subtitle="Metodología Montessori, Reggio Emilia y ABN para los primeros años de vida."
          ghostText="INICIAL"
        />
        <SeccionNivelDetalle
          badge="Educación Inicial"
          heading="Metodologías de clase mundial"
          grades="Pre-Kinder y Kinder"
          ages="3–5 años"
          paragraphs={[
            "Nuestra metodología en Educación Inicial está basada en las filosofías de María Montessori, Reggio Emilia y ABN (Algoritmos Basados en Números), abordando el orden, la concentración, el respeto por los otros y por sí mismo, la autonomía, la independencia, la iniciativa, la capacidad de elegir, el desarrollo de la voluntad y la autodisciplina.",
            "El entorno de aprendizaje está diseñado para despertar la curiosidad natural del niño, permitiéndole explorar, descubrir y construir su propio conocimiento en un ambiente estructurado, respetuoso y estimulante.",
          ]}
          methods={["Montessori", "Reggio Emilia", "ABN"]}
          note="Una hora diaria de inglés totalmente integrada al entorno escolar desde los primeros años, con enfoque natural y lúdico. Los estudiantes integran los aprendizajes paralelamente a los contenidos en español."
          photos={[
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
            "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&q=80",
            "https://images.unsplash.com/photo-1571210862729-78a52d3779a2?w=600&q=80",
          ]}
        />
        <NavNiveles current="inicial" />
        <FooterCTA />
      </main>
    </>
  );
}
