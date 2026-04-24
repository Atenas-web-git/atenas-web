import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionNivelDetalle } from "@/components/academico/SeccionNivelDetalle";
import { NavNiveles } from "@/components/academico/NavNiveles";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "EGB Elemental y Media — Unidad Educativa Atenas",
  description:
    "Inglés integrado con CLIL, aprendizaje por proyectos y plataformas Mangahigh y ALEKS para matemáticas. 1ro a 7mo EGB en la Unidad Educativa Atenas, Ambato.",
};

export default function EGBElementalMediaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ACADÉMICO"
          title="EGB Elemental y Media"
          subtitle="Formación integral con CLIL, PBL y plataformas digitales de matemáticas de clase mundial."
          ghostText="EGB"
        />
        <SeccionNivelDetalle
          badge="EGB Elemental y Media"
          heading="Innovación pedagógica en cada etapa"
          grades="1ro a 7mo EGB"
          ages="5–12 años"
          paragraphs={[
            "En las áreas de básica elemental y media, promovemos una formación integral que combina valores, conocimiento e innovación pedagógica, en un ambiente de respeto, colaboración y entusiasmo por aprender. Nuestros estudiantes desarrollan destrezas en las cuatro áreas del aprendizaje, fortalecidas a través del trabajo colaborativo, la lectura comprensiva, la expresión artística y la formación deportiva.",
            "La enseñanza del inglés como segunda lengua se implementa mediante la metodología CLIL (Content and Language Integrated Learning), que promueve la inmersión lingüística y potencia las habilidades productivas y receptivas, complementada con PBL (Project-Based Learning) e integración de asignaturas de History y Science.",
          ]}
          methods={["CLIL", "PBL", "Grammar Communicative", "ABN (hasta 4to EGB)"]}
          note="Mangahigh y ALEKS son plataformas líderes mundiales de matemáticas adaptativas que ajustan el nivel de cada estudiante en tiempo real, garantizando un aprendizaje progresivo y motivador."
          platforms={[
            {
              name: "Mangahigh",
              detail:
                "Plataforma gamificada de matemáticas para 2do a 5to EGB. Adapta los ejercicios al nivel de cada estudiante con retroalimentación inmediata.",
            },
            {
              name: "ALEKS",
              detail:
                "Sistema adaptativo de aprendizaje matemático para 6to y 7mo EGB, que evalúa el conocimiento real del estudiante y genera rutas personalizadas.",
            },
          ]}
          photos={[
            "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
          ]}
        />
        <NavNiveles current="egb-elemental-media" />
        <FooterCTA />
      </main>
    </>
  );
}
