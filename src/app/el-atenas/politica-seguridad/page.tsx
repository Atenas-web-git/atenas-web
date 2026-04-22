import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Política de Seguridad — Unidad Educativa Atenas",
  description:
    "Comprometidos con la seguridad, salud en el trabajo y el bienestar de toda la comunidad educativa.",
};

export default function PoliticaSeguridadPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Política de Seguridad"
          subtitle="Seguridad y bienestar para cada miembro de nuestra comunidad."
          ghostText="SEGURIDAD"
        />
        <SeccionTexto
          badge="POLÍTICA DE SEGURIDAD"
          heading="Seguridad y Salud en el Trabajo"
          paragraphs={[
            "La Fundación Cultural y Educativa Ambato, dedicada a brindar educación de calidad, está comprometida con la seguridad y salud en el trabajo en todas las áreas de la institución, respetando el medio ambiente, el marco legal y las normativas establecidas en el país.",
            "Para este fin, se asignan los recursos necesarios y se promueve el mejoramiento continuo de las condiciones de trabajo, garantizando un entorno seguro y saludable para estudiantes, docentes, personal administrativo y visitantes.",
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
