import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Políticas IB — Unidad Educativa Atenas",
  description:
    "Políticas institucionales que rigen el Programa del Diploma IB en la Unidad Educativa Atenas: honestidad académica, evaluación, inclusión y bienestar.",
};

const CARDS = [
  {
    title: "Política de Honestidad Académica",
    description:
      "Define los principios de integridad que guían el trabajo de estudiantes y docentes, incluyendo criterios de citación y consecuencias de las faltas académicas.",
  },
  {
    title: "Política de Evaluación",
    description:
      "Establece los procedimientos de evaluación interna y externa, criterios de calificación, retroalimentación y mecanismos de revisión de notas del IBO.",
  },
  {
    title: "Política de Inclusión y Accesibilidad",
    description:
      "Marco para garantizar que todos los estudiantes, independientemente de sus necesidades, tengan acceso equitativo al Programa del Diploma.",
  },
  {
    title: "Política de Bienestar Estudiantil",
    description:
      "Compromisos institucionales para apoyar la salud mental, el equilibrio emocional y la gestión del estrés durante los dos años del Diploma.",
  },
  {
    title: "Política de Admisión al Programa",
    description:
      "Criterios de selección y proceso de admisión para el ingreso al Programa del Diploma IB en 1ro de Bachillerato.",
  },
  {
    title: "Política de Uso de Tecnología",
    description:
      "Lineamientos sobre el uso responsable de herramientas digitales, inteligencia artificial y recursos en línea en el marco del Programa del Diploma.",
  },
  {
    title: "Política de Idiomas",
    description:
      "Definición del perfil lingüístico del colegio y los criterios para la selección de las asignaturas de Lengua A y Lengua B en el Diploma.",
  },
];

export default function PoliticasIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Políticas del Programa IB"
          subtitle="Un marco claro y transparente que protege la integridad del Diploma y el bienestar de cada estudiante."
          ghostText="NORMAS"
        />
        <NavIB current="politicas" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="Claridad y coherencia en cada aspecto del Programa"
          headingHighlight="cada aspecto del Programa"
          paragraphs={[
            "Las políticas del Programa del Diploma IB no son restricciones; son compromisos que la institución asume con sus estudiantes, familias y con el IBO. Cada política fue desarrollada en consulta con la comunidad escolar y es revisada anualmente.",
            "Conocerlas es el primer paso para participar con confianza en el programa: saber qué se espera, cómo se evalúa y qué apoyo recibirás en cada etapa del proceso.",
          ]}
          methods={["Honestidad académica", "Evaluación IB", "Inclusión", "Bienestar", "Uso de tecnología", "Idiomas", "Admisión"]}
          note="Todas las políticas institucionales son documentos públicos disponibles en la Coordinación IB. Se revisan y actualizan cada año lectivo en coordinación con el IBO."
          photos={[
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
            "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80",
          ]}
          cardsSectionBadge="Marco de políticas"
          cardsSectionTitle="Políticas institucionales del Programa del Diploma IB"
          cardsBgPhoto="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1400&q=80"
          cards={CARDS}
          cardsColumns={4}
        />
        <FooterCTA />
      </main>
    </>
  );
}
