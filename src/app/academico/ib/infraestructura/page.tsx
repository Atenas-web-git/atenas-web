import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Infraestructura IB — Unidad Educativa Atenas",
  description:
    "Instalaciones y recursos especializados que apoyan el aprendizaje del Programa del Diploma IB en la Unidad Educativa Atenas, Ambato.",
};

const CARDS = [
  {
    title: "Laboratorio de Ciencias",
    description:
      "Equipado con instrumentos de precisión para experimentos de Biología, Química y Física a nivel de diploma. Cumple los estándares IB para trabajo experimental.",
  },
  {
    title: "Sala Multimedia IB",
    description:
      "Espacio exclusivo para las clases del Diploma con proyección 4K, sistema de videoconferencia y acceso a bases de datos académicas internacionales.",
  },
  {
    title: "Biblioteca y Centro de Recursos",
    description:
      "Colección actualizada de textos en inglés y español, acceso a eLibro y a la Biblioteca Virtual Institucional con más de 80 000 títulos digitales.",
  },
  {
    title: "Aulas de Debate y TdC",
    description:
      "Diseñadas con disposición flexible para favorecer el diálogo socrático y las sesiones de Teoría del Conocimiento que exige el Programa del Diploma.",
  },
  {
    title: "Laboratorio de Tecnología",
    description:
      "Equipos con software especializado para proyectos de Matemáticas con Tecnología, Informática y gestión de datos estadísticos en Ciencias.",
  },
  {
    title: "Espacio CAS",
    description:
      "Área de coordinación de Creatividad, Actividad y Servicio donde los estudiantes planifican y documentan sus proyectos con acompañamiento docente.",
  },
];

export default function InfraestructuraIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Infraestructura IB"
          subtitle="Espacios y recursos pensados para el rigor académico y la exploración que exige el Programa del Diploma."
          ghostText="ESPACIOS"
        />
        <NavIB current="infraestructura" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="Instalaciones al nivel de los mejores colegios IB del mundo"
          headingHighlight="mejores colegios IB del mundo"
          paragraphs={[
            "El Programa del Diploma exige entornos de aprendizaje especializados. En Atenas hemos invertido en laboratorios, espacios de debate y tecnología que permiten a nuestros estudiantes desarrollar el trabajo experimental y la investigación que el IBO requiere.",
            "Cada espacio ha sido diseñado o adaptado específicamente para las demandas del Diploma: desde el laboratorio de ciencias certificado hasta las aulas de Teoría del Conocimiento con disposición flexible.",
          ]}
          methods={["Laboratorio certificado IB", "Biblioteca digital", "Videoconferencia", "Software académico", "Espacios CAS"]}
          note="Nuestras instalaciones son evaluadas periódicamente por el IBO como parte del proceso de acreditación y visitas de verificación."
          photos={[
            "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
            "https://images.unsplash.com/photo-1581093804475-577d72e13cba?w=600&q=80",
            "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&q=80",
          ]}
          cardsSectionBadge="Instalaciones"
          cardsSectionTitle="Espacios diseñados para el aprendizaje del siglo XXI"
          cardsBgPhoto="https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80"
          cards={CARDS}
          cardsColumns={3}
        />
        <FooterCTA />
      </main>
    </>
  );
}
