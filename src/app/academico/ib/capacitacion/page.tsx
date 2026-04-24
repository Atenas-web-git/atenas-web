import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionIBDetalle } from "@/components/ib/SeccionIBDetalle";
import { NavIB } from "@/components/ib/NavIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Capacitación Docente IB — Unidad Educativa Atenas",
  description:
    "El equipo docente del Bachillerato IB de la Unidad Educativa Atenas cuenta con certificaciones oficiales del IBO y formación continua en metodología internacional.",
};

const CARDS = [
  {
    title: "Talleres Categoría 1 IBO",
    description:
      "Formación introductoria oficial del IBO para docentes que se incorporan al Programa del Diploma. Cubre filosofía, evaluación y planificación de unidades.",
  },
  {
    title: "Talleres Categoría 2 y 3",
    description:
      "Formación avanzada para docentes con experiencia en el Diploma. Profundiza en diseño de tareas de evaluación interna y técnicas pedagógicas específicas.",
  },
  {
    title: "Formación en TdC",
    description:
      "Capacitación especializada para los docentes responsables de Teoría del Conocimiento: facilitación de debates, criterios de ensayo y presentación.",
  },
  {
    title: "Coordinación Monografía",
    description:
      "Entrenamiento para supervisores de la Monografía: acompañamiento al proceso de investigación, sesiones de reflexión y criterios de evaluación.",
  },
  {
    title: "Comunidades de Aprendizaje IB",
    description:
      "Participación en redes de docentes IB de América Latina para compartir buenas prácticas, materiales y estrategias de evaluación.",
  },
  {
    title: "Actualización Curricular Continua",
    description:
      "Revisión anual de las guías de asignatura del IBO y actualización de las unidades de indagación según los cambios en los programas de evaluación.",
  },
];

export default function CapacitacionIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="BACHILLERATO IB"
          title="Capacitación Docente IB"
          subtitle="Detrás de cada estudiante IB hay un docente certificado por el IBO y comprometido con la excelencia educativa."
          ghostText="DOCENTES"
        />
        <NavIB current="capacitacion" />
        <SeccionIBDetalle
          badge="Bachillerato Internacional"
          heading="Docentes certificados que inspiran el pensamiento global"
          headingHighlight="pensamiento global"
          paragraphs={[
            "El éxito del Programa del Diploma depende en gran medida de la calidad de su cuerpo docente. En Atenas, todos los profesores del Diploma cuentan con certificación oficial del IBO y participan en programas de formación continua cada año.",
            "Nuestros docentes no solo enseñan contenidos: facilitan el pensamiento crítico, guían procesos de investigación independiente y forman parte activa de las redes de educadores IB de América Latina.",
          ]}
          methods={["Talleres IBO Cat. 1", "Talleres IBO Cat. 2/3", "TdC", "Monografía", "Comunidades IB", "Actualización curricular"]}
          note="El Colegio Atenas invierte cada año en la formación y certificación de su equipo docente IB, garantizando que cada asignatura esté cubierta por un especialista certificado por el IBO."
          photos={[
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
            "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80",
            "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80",
          ]}
          cardsSectionBadge="Programa de formación"
          cardsSectionTitle="Modalidades de capacitación docente IB"
          cardsBgPhoto="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1400&q=80"
          cards={CARDS}
          cardsColumns={3}
        />
        <FooterCTA />
      </main>
    </>
  );
}
