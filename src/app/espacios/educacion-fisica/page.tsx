import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Educación Física y Deporte | Atenas",
  description:
    "El programa deportivo de la Unidad Educativa Atenas promueve el bienestar físico, el trabajo en equipo y la formación de hábitos saludables desde la infancia.",
};

export default function EducacionFisicaPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ESPACIOS DE DESARROLLO"
          title="Ed. Física"
          subtitle="Deporte, bienestar y disciplina — formando cuerpos y mentes que rinden al máximo nivel."
          ghostText="DEPORTE"
        />
        <NavEspacios current="educacion-fisica" />
        <SeccionEspacioDetalle
          badge="Educación Física y Deporte"
          heading="Más que ejercicio: una cultura de bienestar"
          paragraphs={[
            "La educación física en Atenas es un espacio de formación integral donde el movimiento es un medio para desarrollar disciplina, liderazgo y trabajo en equipo. Nuestros programas abarcan desde las clases regulares hasta equipos de competencia a nivel provincial y nacional.",
            "El deporte enseña a ganar y a perder con dignidad, a perseverar ante la dificultad y a confiar en los compañeros. Estas son habilidades para la vida que el estudiante lleva consigo mucho más allá de la cancha.",
          ]}
          tags={["Deporte", "Bienestar", "Equipo", "Salud", "Competencia"]}
          nota="Atenas cuenta con instalaciones deportivas completas: canchas de básquet, fútbol y vóley, además de espacios para atletismo. Nuestros equipos han representado a la institución en campeonatos provinciales con resultados destacados."
          ficha={[
            { label: "Niveles",       value: "Todos los niveles" },
            { label: "Modalidad",     value: "Presencial" },
            { label: "Competencia",   value: "Provincial y nacional", highlight: true },
            { label: "Coordinación",  value: "Dpto. de Ed. Física" },
          ]}
          photoSrc="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80"
          photoAlt="Estudiantes en actividad deportiva"
        />
        <ActividadesEspacio
          title="Lo que hacemos en Ed. Física"
          photoSrc="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80"
          photoCaption="Competencia deportiva — Ambato"
          actividades={[
            { icon: "⚽", title: "Fútbol y básquetbol",      desc: "Disciplinas principales con equipos de competencia en ligas provinciales." },
            { icon: "🏆", title: "Torneos intercolegiales",  desc: "Participación en competencias regionales y nacionales que forman el carácter.", highlight: true },
            { icon: "🤸", title: "Atletismo y gimnasia",     desc: "Desarrollo de capacidades físicas básicas: velocidad, fuerza, equilibrio y agilidad." },
            { icon: "🏊", title: "Natación",                 desc: "Programa de natación con piscina propia que enseña técnica y seguridad acuática." },
            { icon: "🧘", title: "Bienestar y salud",        desc: "Educación en hábitos saludables, nutrición y manejo del estrés para el rendimiento." },
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
