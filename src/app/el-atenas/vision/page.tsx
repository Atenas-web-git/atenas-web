import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Visión — Unidad Educativa Atenas",
  description:
    "Somos la organización responsable de la formación de personas felices e íntegras, con conciencia social y capacidades para triunfar.",
};

export default function VisionPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Visión"
          subtitle="La imagen que inspira y define el horizonte de nuestra institución."
        />
        <SeccionTexto
          badge="VISIÓN"
          heading="Nuestra Visión"
          paragraphs={[
            "Somos la Organización responsable de la formación de personas felices e íntegras, con conciencia social, capacidades para triunfar y conocedores de su aporte para crear un mundo más pacífico.",
            "Esta visión nos impulsa a superar constantemente nuestros estándares educativos y a fortalecer el vínculo entre la institución, las familias y la comunidad.",
          ]}
          note="Visión institucional en actualización — se revisará el horizonte temporal para el nuevo ciclo estratégico."
        />
        <FooterCTA />
      </main>
    </>
  );
}
