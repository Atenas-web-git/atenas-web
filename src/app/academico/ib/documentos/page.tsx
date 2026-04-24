import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Documentos IB — Unidad Educativa Atenas",
  description:
    "Documentos oficiales del Programa del Diploma IB en la Unidad Educativa Atenas: guías, reglamentos y recursos para estudiantes y familias.",
};

const CARDS = [
  {
    title: "Guía del Programa del Diploma",
    description:
      "Documento oficial del IBO con la estructura completa del Diploma, requisitos de evaluación, núcleo del programa y criterios de acreditación.",
  },
  {
    title: "Reglamento del Diploma IB",
    description:
      "Normativa institucional que regula la participación, los derechos y las obligaciones de los estudiantes del Programa del Diploma en Atenas.",
  },
  {
    title: "Guía de la Monografía",
    description:
      "Orientaciones paso a paso para la elaboración del ensayo de investigación independiente de 4 000 palabras exigido por el IBO.",
  },
  {
    title: "Guía CAS",
    description:
      "Lineamientos para el componente Creatividad, Actividad y Servicio: objetivos de aprendizaje, portafolio y requisitos de reflexión.",
  },
  {
    title: "Política Académica de Honestidad",
    description:
      "Principios y procedimientos institucionales sobre integridad académica, citación de fuentes y consecuencias de las faltas dentro del Programa IB.",
  },
  {
    title: "Política de Evaluación",
    description:
      "Criterios de evaluación interna y externa, ponderaciones, fechas límite de entrega y procedimientos de revisión de notas del IBO.",
  },
  {
    title: "Política de Inclusión y Necesidades Especiales",
    description:
      "Protocolo para solicitar arreglos de evaluación especiales ante el IBO para estudiantes con necesidades de aprendizaje diagnosticadas.",
  },
];

export default function DocumentosIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Documentos IB"
          subtitle="Recursos oficiales del Programa del Diploma para que estudiantes y familias conozcan el programa a fondo."
          ghostText="DOCS"
        />
        <NavIB current="documentos" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="Todo lo que necesitas saber sobre el Diploma IB"
          headingHighlight="Diploma IB"
          paragraphs={[
            "El Programa del Diploma IB funciona bajo una normativa clara y pública. En Atenas ponemos a disposición de toda la comunidad los documentos oficiales y las políticas institucionales que rigen el proceso educativo de nuestros bachilleres.",
            "La transparencia documental es parte fundamental de la cultura IB: entender las reglas, los criterios y los recursos disponibles es la base para que estudiantes y familias tomen decisiones informadas.",
          ]}
          methods={["Monografía", "CAS", "TdC", "Evaluación interna", "Evaluación externa IBO", "Honestidad académica"]}
          note="Todos los documentos están disponibles en formato digital. Para solicitar copias impresas o aclaraciones, comunícate con la Coordinación IB."
          photos={[
            "https://images.unsplash.com/photo-1568667256549-094345857637?w=600&q=80",
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&q=80",
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
          ]}
          cardsSectionBadge="Documentos disponibles"
          cardsSectionTitle="Recursos oficiales del Programa del Diploma"
          cardsBgPhoto="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1400&q=80"
          cards={CARDS}
          cardsColumns={4}
        />
        <FooterCTA />
      </main>
    </>
  );
}
