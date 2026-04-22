import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Misión — Unidad Educativa Atenas",
  description:
    "Crecemos y aprendemos juntos, fortaleciendo nuestros principios y valores para contribuir a un mundo mejor.",
};

export default function MisionPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          title="Misión"
          subtitle="El propósito que guía cada decisión de nuestra comunidad educativa."
        />
        <SeccionTexto
          badge="MISIÓN"
          heading="Nuestra Misión"
          paragraphs={[
            "Crecemos y aprendemos juntos, fortaleciendo nuestros principios y valores, desarrollando las capacidades y habilidades de nuestra comunidad de forma crítica y creativa para contribuir a un mundo mejor.",
            "Esta misión define el propósito compartido de toda la comunidad Atenas: estudiantes, docentes, familias y directivos trabajan juntos hacia un mismo horizonte.",
          ]}
        />
        <FooterCTA />
      </main>
    </>
  );
}
