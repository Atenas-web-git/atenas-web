import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "VASE — Valores, Actitudes, Servicio y Espiritualidad | Atenas",
  description:
    "El programa VASE de la Unidad Educativa Atenas forma el carácter de sus estudiantes a través de valores, servicio comunitario y liderazgo ético.",
};

export default function VasePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ESPACIOS DE DESARROLLO"
          title="VASE"
          subtitle="Valores, Actitudes, Servicio y Espiritualidad — formando el carácter que el mundo necesita."
          ghostText="VASE"
        />
        <NavEspacios current="vase" />
        <SeccionEspacioDetalle
          badge="VASE — Valores, Actitudes, Servicio y Espiritualidad"
          heading="Un espacio para construir carácter"
          paragraphs={[
            "VASE es el espacio donde los estudiantes desarrollan su dimensión ética, espiritual y de servicio. A través de proyectos comunitarios, reflexión personal y actividades de liderazgo, cada alumno construye el carácter que el mundo necesita.",
            "Este programa transversal se integra en todas las etapas educativas, reforzando los valores institucionales y el compromiso social como pilares de la formación integral.",
          ]}
          tags={["Liderazgo", "Servicio", "Valores", "Espiritualidad", "Comunidad"]}
          nota="VASE no es una asignatura más — es una forma de ser y estar en el mundo que cada estudiante de Atenas desarrolla a lo largo de toda su trayectoria escolar."
          ficha={[
            { label: "Niveles",       value: "Todos los niveles" },
            { label: "Modalidad",     value: "Presencial" },
            { label: "Frecuencia",    value: "Semanal", highlight: true },
            { label: "Coordinación",  value: "Dirección Pastoral" },
          ]}
          photoSrc="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=700&q=80"
          photoAlt="Estudiantes en proyecto comunitario"
        />
        <ActividadesEspacio
          title="Lo que hacemos en VASE"
          photoSrc="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&q=80"
          photoCaption="Proyecto comunitario — Ambato"
          actividades={[
            { icon: "🕊", title: "Retiros espirituales",    desc: "Jornadas de reflexión para fortalecer la dimensión interior del estudiante." },
            { icon: "🌱", title: "Proyectos comunitarios",  desc: "Iniciativas de servicio que conectan al estudiante con la comunidad local." },
            { icon: "⭐", title: "Liderazgo estudiantil",   desc: "Formación de líderes con valores éticos y visión de transformación social.", highlight: true },
            { icon: "🤝", title: "Voluntariado social",     desc: "Acción directa en la comunidad a través de campañas y programas de apoyo." },
            { icon: "🙏", title: "Celebraciones litúrgicas",desc: "Momentos de encuentro espiritual que integran la fe con la vida escolar." },
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
