import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Programa de Idiomas | Atenas",
  description:
    "El programa de idiomas de la Unidad Educativa Atenas ofrece inglés intensivo, certificaciones Cambridge y un entorno de inmersión bilingüe desde los primeros años.",
};

export default function IdiomaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ESPACIOS DE DESARROLLO"
          title="Idioma"
          subtitle="Un entorno bilingüe que abre puertas al mundo desde los primeros años de formación."
          ghostText="IDIOMA"
        />
        <NavEspacios current="idioma" />
        <SeccionEspacioDetalle
          badge="Programa de Idiomas"
          heading="Inglés con propósito y profundidad"
          paragraphs={[
            "El programa de idiomas de Atenas va más allá del inglés como asignatura: es un entorno de inmersión que acompaña al estudiante desde Inicial hasta Bachillerato. La metodología combina comunicación real, pensamiento crítico y preparación para exámenes internacionales.",
            "Nuestros estudiantes acceden a certificaciones Cambridge (KET, PET, FCE, CAE) que son reconocidas por universidades y empleadores en todo el mundo, con acompañamiento personalizado durante cada etapa.",
          ]}
          tags={["Inglés", "Cambridge", "Bilingüismo", "Certificaciones", "Comunicación"]}
          nota="El nivel de inglés al graduarse de Atenas es equivalente a B2-C1 del Marco Europeo, lo que permite a nuestros egresados acceder directamente a programas universitarios internacionales sin examen de suficiencia adicional."
          ficha={[
            { label: "Niveles",       value: "Inicial a Bachillerato" },
            { label: "Modalidad",     value: "Presencial" },
            { label: "Certificación", value: "Cambridge", highlight: true },
            { label: "Coordinación",  value: "Dpto. de Idiomas" },
          ]}
          photoSrc="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80"
          photoAlt="Estudiantes en clase de inglés"
        />
        <ActividadesEspacio
          title="Lo que hacemos en Idioma"
          photoSrc="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80"
          photoCaption="Clase de inglés — Ambato"
          actividades={[
            { icon: "🗣️", title: "Conversación intensiva",   desc: "Clases enfocadas en fluidez oral, escucha activa y confianza al comunicarse." },
            { icon: "📝", title: "Preparación Cambridge",    desc: "Entrenamiento estructurado para los exámenes KET, PET, FCE y CAE.", highlight: true },
            { icon: "🎭", title: "Teatro en inglés",         desc: "Obras y performances donde el idioma cobra vida en contextos reales y creativos." },
            { icon: "📰", title: "Debate y oratoria",        desc: "Argumentación y presentaciones en inglés que desarrollan pensamiento crítico." },
            { icon: "🌐", title: "Clubes de conversación",   desc: "Espacios extracurriculares para practicar con pares en un ambiente distendido." },
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
