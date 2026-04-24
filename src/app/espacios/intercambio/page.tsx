import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Programa de Intercambio Internacional | Atenas",
  description:
    "El programa de intercambio de la Unidad Educativa Atenas conecta a sus estudiantes con instituciones del mundo, ampliando perspectivas y formando ciudadanos globales.",
};

export default function IntercambioPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ESPACIOS DE DESARROLLO"
          title="Intercambio"
          subtitle="Experiencias internacionales que amplían horizontes y forman ciudadanos del mundo."
          ghostText="GLOBAL"
        />
        <NavEspacios current="intercambio" />
        <SeccionEspacioDetalle
          badge="Programa de Intercambio Internacional"
          heading="El mundo como aula de aprendizaje"
          paragraphs={[
            "El programa de intercambio de Atenas abre la puerta para que nuestros estudiantes vivan experiencias educativas en el extranjero, conviviendo con familias locales, aprendiendo nuevos idiomas y descubriendo otras culturas. A su vez, recibimos estudiantes internacionales que enriquecen nuestra comunidad.",
            "Estos programas están diseñados para ampliar perspectivas, desarrollar independencia y construir redes de amistad global que acompañan a los jóvenes durante toda su vida.",
          ]}
          tags={["Internacional", "Intercambio", "Culturas", "Viajes", "Globalización"]}
          nota="Los programas de intercambio están disponibles para estudiantes de EGB Superior y Bachillerato que cumplan con los requisitos académicos y de idioma. Las plazas son limitadas y se asignan por mérito y motivación."
          ficha={[
            { label: "Niveles",       value: "EGB Superior y Bachillerato" },
            { label: "Modalidad",     value: "Presencial internacional" },
            { label: "Duración",      value: "2 a 12 semanas", highlight: true },
            { label: "Coordinación",  value: "Relaciones Internacionales" },
          ]}
          photoSrc="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80"
          photoAlt="Estudiantes en programa internacional"
        />
        <ActividadesEspacio
          title="Lo que hacemos en Intercambio"
          photoSrc="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80"
          photoCaption="Programa internacional — Atenas"
          actividades={[
            { icon: "✈️", title: "Intercambios al exterior",  desc: "Estancias en colegios asociados de Europa, América del Norte y América Latina." },
            { icon: "🏠", title: "Familias anfitrionas",      desc: "Convivencia con familias locales que garantizan inmersión cultural completa.", highlight: true },
            { icon: "🌏", title: "Estudiantes internacionales", desc: "Recepción de estudiantes extranjeros que comparten sus culturas con nuestra comunidad." },
            { icon: "🎓", title: "Cursos de verano",          desc: "Programas intensivos de idiomas y cultura en instituciones del extranjero." },
            { icon: "🤝", title: "Red de alumni global",      desc: "Conexión permanente con ex-estudiantes de intercambio alrededor del mundo." },
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
