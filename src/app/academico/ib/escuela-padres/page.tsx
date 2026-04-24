import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Escuela de Padres IB — Unidad Educativa Atenas",
  description:
    "Programa de acompañamiento para familias del Bachillerato IB en la Unidad Educativa Atenas: talleres, recursos y canal directo con la coordinación.",
};

const CARDS = [
  {
    title: "Taller de Inducción IB",
    description:
      "Sesión obligatoria al inicio del programa donde familias comprenden la estructura del Diploma, los componentes del núcleo y el rol de apoyo en casa.",
  },
  {
    title: "Sesiones Informativas Trimestrales",
    description:
      "Reuniones con la Coordinación IB para revisar avances académicos, fechas clave de entrega y resultados de evaluaciones internas.",
  },
  {
    title: "Taller Monografía para Familias",
    description:
      "Guía práctica sobre cómo acompañar el proceso de investigación independiente sin interferir en la autoría del estudiante.",
  },
  {
    title: "Bienestar y Manejo del Estrés",
    description:
      "Charlas con profesionales de psicología sobre estrategias para apoyar el equilibrio emocional de los bachilleres IB en períodos de exámenes.",
  },
  {
    title: "Canal Coordinación IB",
    description:
      "Acceso directo al equipo de coordinación para consultas específicas sobre el desempeño académico y los procesos de evaluación del IBO.",
  },
  {
    title: "Guía de Recursos Digitales",
    description:
      "Orientación sobre las plataformas (Idukay, eLibro, Aleks) y las bases de datos académicas disponibles para que los estudiantes trabajen desde casa.",
  },
];

export default function EscuelaPadresIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Escuela de Padres IB"
          subtitle="El acompañamiento familiar es parte esencial del éxito en el Programa del Diploma. Aquí encontrarás todo lo que necesitas."
          ghostText="FAMILIA"
        />
        <NavIB current="escuela-padres" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="Familias informadas, estudiantes que brillan en el mundo"
          headingHighlight="brillan en el mundo"
          paragraphs={[
            "El IBO reconoce a las familias como parte activa de la comunidad de aprendizaje. En Atenas hemos diseñado un programa de acompañamiento para que madres, padres y representantes comprendan el Diploma y apoyen el proceso de sus hijos desde casa.",
            "Desde los talleres de inducción hasta el canal directo con la coordinación, cada actividad está pensada para reducir la incertidumbre y fortalecer la confianza en el proceso educativo.",
          ]}
          methods={["Talleres presenciales", "Reuniones trimestrales", "Canal directo coordinación", "Recursos digitales", "Bienestar emocional"]}
          note="La participación en el Taller de Inducción IB es obligatoria para todas las familias al inicio del Programa del Diploma."
          photos={[
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
            "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80",
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
          ]}
          cardsSectionBadge="Programa de acompañamiento"
          cardsSectionTitle="Actividades y recursos para familias IB"
          cardsBgPhoto="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"
          cards={CARDS}
          cardsColumns={3}
        />
        <FooterCTA />
      </main>
    </>
  );
}
