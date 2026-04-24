import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Atributos del Perfil IB — Unidad Educativa Atenas",
  description:
    "Los 10 atributos del Perfil de la Comunidad de Aprendizaje IB que guían la formación de estudiantes íntegros, indagadores y comprometidos con el mundo.",
};

const CARDS = [
  {
    title: "Indagadores",
    description:
      "Desarrollan curiosidad natural y habilidades para investigar. Aprenden con entusiasmo y mantienen ese amor por el aprendizaje a lo largo de toda su vida.",
  },
  {
    title: "Informados e instruidos",
    description:
      "Exploran conceptos, ideas y problemas de importancia local y mundial. Para ello adquieren un conocimiento profundo en una amplia gama de disciplinas.",
  },
  {
    title: "Pensadores",
    description:
      "Ejercitan la iniciativa para aplicar habilidades de pensamiento crítico y creativo. Toman decisiones razonadas y éticas ante problemas complejos.",
  },
  {
    title: "Buenos comunicadores",
    description:
      "Se expresan con confianza y creatividad en más de un idioma. Colaboran eficazmente con otros y escuchan activamente perspectivas diversas.",
  },
  {
    title: "Íntegros",
    description:
      "Actúan con integridad y honestidad, con un profundo sentido de la equidad, la justicia y el respeto por la dignidad de las personas y de los grupos.",
  },
  {
    title: "De mente abierta",
    description:
      "Valoran críticamente su propia cultura e historia personal. Buscan y consideran los puntos de vista de otros y están dispuestos a aprender de la experiencia.",
  },
  {
    title: "Solidarios",
    description:
      "Demuestran empatía, compasión y respeto. Tienen un compromiso personal con el servicio y actúan positivamente para mejorar la vida de otros.",
  },
  {
    title: "Audaces",
    description:
      "Abordan la incertidumbre con previsión y determinación. Exploran ideas y estrategias nuevas con coraje e ingenio, y defienden sus convicciones.",
  },
  {
    title: "Equilibrados",
    description:
      "Comprenden la importancia del equilibrio entre sus aspectos físico, mental y emocional, y del bienestar propio y ajeno para lograr una vida plena.",
  },
  {
    title: "Reflexivos",
    description:
      "Evalúan detenidamente el mundo y sus propias ideas y experiencias. Se esfuerzan por comprender sus fortalezas y limitaciones para aprender y crecer.",
  },
];

export default function AtributosIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Atributos del Perfil IB"
          subtitle="Diez cualidades que definen a cada estudiante del Programa del Diploma y guían su formación integral."
          ghostText="PERFIL"
        />
        <NavIB current="atributos" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="10 atributos que forman líderes del mundo"
          headingHighlight="líderes del mundo"
          paragraphs={[
            "El Perfil de la Comunidad de Aprendizaje del IB describe diez atributos esenciales que los estudiantes desarrollan a lo largo del Programa del Diploma. No son metas aisladas, sino disposiciones que se integran profundamente en cada materia, actividad y proyecto.",
            "En Atenas, estos atributos se cultivan en el aula, en los proyectos de CAS y en cada interacción cotidiana. Son la brújula que orienta a nuestros graduados dentro y fuera de Ecuador.",
          ]}
          methods={["CAS", "Monografía", "Teoría del Conocimiento", "Grupos de asignaturas", "Evaluación externa IB"]}
          note="El Perfil de la Comunidad de Aprendizaje se aplica a toda la comunidad escolar: estudiantes, docentes y familias participan activamente en su construcción."
          photos={[
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
          ]}
          cardsSectionBadge="Los 10 atributos"
          cardsSectionTitle="Perfil de la Comunidad de Aprendizaje IB"
          cardsBgPhoto="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1400&q=80"
          cards={CARDS}
          cardsColumns={5}
        />
        <FooterCTA />
      </main>
    </>
  );
}
