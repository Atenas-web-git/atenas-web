import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Expresión Cultural | Atenas",
  description:
    "El espacio de Cultura en la Unidad Educativa Atenas fomenta la creatividad artística a través de música, artes plásticas, teatro y danza.",
};

export default function CulturaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ESPACIOS DE DESARROLLO"
          title="Cultura"
          subtitle="Arte, música, teatro y danza — la expresión creativa como lenguaje universal de formación."
          ghostText="CULTURA"
        />
        <NavEspacios current="cultura" />
        <SeccionEspacioDetalle
          badge="Expresión Cultural"
          heading="La creatividad como forma de conocer el mundo"
          paragraphs={[
            "El espacio cultural de Atenas reconoce que el arte no es complemento sino centro de una formación integral. Música, teatro, danza y artes plásticas son disciplinas que desarrollan sensibilidad, disciplina y pensamiento creativo en cada estudiante.",
            "Desde los festivales internos hasta las presentaciones abiertas a la comunidad, los estudiantes tienen escenarios reales donde mostrar su talento y construir confianza en sí mismos.",
          ]}
          tags={["Arte", "Música", "Teatro", "Danza", "Creatividad"]}
          nota="En Atenas creemos que un niño que aprende a tocar un instrumento, actuar o pintar desarrolla habilidades cognitivas y emocionales que complementan y potencian su desempeño en todas las áreas académicas."
          ficha={[
            { label: "Niveles",       value: "Todos los niveles" },
            { label: "Modalidad",     value: "Presencial" },
            { label: "Presentación",  value: "Festival anual", highlight: true },
            { label: "Coordinación",  value: "Dpto. de Cultura" },
          ]}
          photoSrc="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=700&q=80"
          photoAlt="Estudiantes en presentación cultural"
        />
        <ActividadesEspacio
          title="Lo que hacemos en Cultura"
          photoSrc="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&q=80"
          photoCaption="Festival Cultural — Atenas"
          actividades={[
            { icon: "🎵", title: "Banda y orquesta",         desc: "Formación instrumental y agrupaciones musicales que participan en eventos locales." },
            { icon: "🎭", title: "Teatro escolar",           desc: "Montajes y obras que desarrollan expresión, memoria y trabajo en equipo.", highlight: true },
            { icon: "💃", title: "Danza y folclore",         desc: "Expresión corporal y danzas tradicionales que conectan con la identidad cultural." },
            { icon: "🎨", title: "Artes plásticas",          desc: "Pintura, escultura y diseño como medios de comunicación visual y creación." },
            { icon: "🎤", title: "Coro institucional",       desc: "Agrupación vocal que representa a Atenas en eventos y competencias regionales." },
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
