import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavEspacios } from "@/components/espacios/NavEspacios";
import { SeccionEspacioDetalle } from "@/components/espacios/SeccionEspacioDetalle";
import { ActividadesEspacio } from "@/components/espacios/ActividadesEspacio";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "CAS — Creativity, Activity, Service | Atenas",
  description:
    "El programa CAS del Bachillerato Internacional en Atenas forma estudiantes activos, creativos y comprometidos con el servicio a su comunidad.",
};

export default function CasPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ESPACIOS DE DESARROLLO"
          title="CAS"
          subtitle="Creativity, Activity, Service — el corazón del Bachillerato Internacional que transforma ideas en acción."
          ghostText="CAS"
        />
        <NavEspacios current="cas" />
        <SeccionEspacioDetalle
          badge="CAS — Creativity, Activity, Service"
          heading="Aprender haciendo, crecer sirviendo"
          paragraphs={[
            "CAS es uno de los componentes centrales del Bachillerato Internacional y exige que cada estudiante viva su formación más allá del aula. A través de proyectos creativos, actividad física y servicio genuino, los alumnos desarrollan autonomía, empatía y responsabilidad social.",
            "Cada estudiante diseña su propio portafolio CAS, documenta su proceso de aprendizaje y reflexiona sobre su crecimiento personal. Es un viaje de dos años que deja una huella real en la comunidad.",
          ]}
          tags={["IB", "Creatividad", "Actividad", "Servicio", "Portafolio"]}
          nota="CAS no es opcional en el IB — es el espacio donde los aprendizajes académicos cobran sentido al aplicarse al mundo real. En Atenas, este programa está acompañado de cerca por coordinadores dedicados."
          ficha={[
            { label: "Niveles",       value: "1.º y 2.º Bachillerato" },
            { label: "Modalidad",     value: "Presencial y campo" },
            { label: "Duración",      value: "2 años IB", highlight: true },
            { label: "Coordinación",  value: "Coordinación IB" },
          ]}
          photoSrc="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=700&q=80"
          photoAlt="Estudiantes en proyecto CAS"
        />
        <ActividadesEspacio
          title="Lo que hacemos en CAS"
          photoSrc="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900&q=80"
          photoCaption="Proyecto CAS — Ambato"
          actividades={[
            { icon: "🎨", title: "Proyectos creativos",      desc: "Arte, música, diseño y producción audiovisual como expresión del talento individual." },
            { icon: "🏃", title: "Actividad física",         desc: "Deportes, expediciones y retos físicos que fortalecen el cuerpo y la resiliencia." },
            { icon: "🤝", title: "Servicio comunitario",     desc: "Iniciativas reales de impacto local, diseñadas y lideradas por los propios estudiantes.", highlight: true },
            { icon: "📓", title: "Portafolio reflexivo",     desc: "Documentación y reflexión continua del proceso de aprendizaje en plataforma IB." },
            { icon: "🌍", title: "Proyectos colaborativos",  desc: "Trabajo en equipo interdisciplinario para abordar desafíos de la comunidad." },
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
