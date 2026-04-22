import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Política de Calidad — Unidad Educativa Atenas",
  description:
    "Educamos y formamos jóvenes competentes, responsables y de servicio mediante la mejora continua y la excelencia educativa.",
};

export default function PoliticaCalidadPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Política de Calidad"
          subtitle="Nuestro compromiso con la excelencia educativa y la mejora continua."
          ghostText="CALIDAD"
        />
        <SeccionTexto
          badge="POLÍTICA DE CALIDAD"
          heading="Comprometidos con la Excelencia"
          paragraphs={[
            "Educamos y formamos jóvenes competentes, responsables y de servicio. Trabajamos para la satisfacción de nuestros clientes internos y externos mediante el cumplimiento de requisitos, la mejora continua de los procesos, una organización efectiva, personal especializado y comprometido, una infraestructura adecuada, la participación de la familia y el funcionamiento sustentable de la Institución.",
            "Esta política orienta cada proceso educativo y administrativo de la Unidad Educativa Atenas, en consonancia con nuestras certificaciones nacionales e internacionales de calidad.",
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
