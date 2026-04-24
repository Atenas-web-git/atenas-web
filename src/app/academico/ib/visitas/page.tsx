import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Visitas al Programa IB — Unidad Educativa Atenas",
  description:
    "Conoce en persona las instalaciones y el equipo del Bachillerato IB de la Unidad Educativa Atenas. Agenda una visita guiada o un día de observación.",
};

const CARDS = [
  {
    title: "Visita Guiada General",
    description:
      "Recorrido de 60 minutos por las instalaciones IB: laboratorios, aulas de debate, biblioteca y espacios CAS, con presentación de la coordinación.",
  },
  {
    title: "Día de Observación en Aula",
    description:
      "Estudiantes potenciales de 9no o 10mo pueden asistir como observadores a una clase del Diploma previa coordinación con secretaría.",
  },
  {
    title: "Charla con Estudiantes IB",
    description:
      "Sesión informal donde bachilleres actuales comparten su experiencia real en el programa, responden preguntas y muestran sus proyectos CAS.",
  },
  {
    title: "Reunión con Coordinación IB",
    description:
      "Entrevista privada de 30 minutos con el coordinador IB para resolver dudas específicas sobre el proceso de admisión y los requisitos del Diploma.",
  },
  {
    title: "Visita Virtual 360°",
    description:
      "Recorrido virtual interactivo por las instalaciones del colegio disponible para familias que no pueden asistir presencialmente.",
  },
  {
    title: "Visita Delegaciones Institucionales",
    description:
      "Atención especial para grupos de otros colegios o instituciones interesadas en el modelo educativo IB implementado en Atenas.",
  },
];

export default function VisitasIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Visitas al Programa IB"
          subtitle="Ver para creer. Te invitamos a conocer de primera mano los espacios y el equipo que hacen posible el Diploma en Atenas."
          ghostText="VISITA"
        />
        <NavIB current="visitas" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="Vive la experiencia IB antes de decidir"
          headingHighlight="antes de decidir"
          paragraphs={[
            "Elegir el Programa del Diploma IB es una decisión significativa. Por eso en Atenas abrimos nuestras puertas para que estudiantes y familias conozcan en persona los laboratorios, las aulas, el equipo docente y los bachilleres que ya viven esta experiencia.",
            "Cada modalidad de visita está pensada para responder preguntas distintas: desde el recorrido visual hasta el día de observación en aula real, siempre con acompañamiento de nuestro equipo de coordinación.",
          ]}
          methods={["Visita presencial", "Día en aula", "Charla con estudiantes", "Reunión con coordinación", "Tour virtual 360°"]}
          note="Para agendar una visita, contáctate con secretaría al correo admisiones@atenas.edu.ec o llama al (03) 282-XXXX. Las visitas se realizan de martes a jueves en horario de 09:00 a 12:00."
          photos={[
            "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80",
            "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&q=80",
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
          ]}
          cardsSectionBadge="Modalidades de visita"
          cardsSectionTitle="Elige la opción que mejor se adapte a ti"
          cardsBgPhoto="https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80"
          cards={CARDS}
          cardsColumns={3}
        />
        <FooterCTA />
      </main>
    </>
  );
}
