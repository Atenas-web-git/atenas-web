import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavAdmisiones } from "@/components/admisiones/NavAdmisiones";
import { SeccionAdmisionDetalle } from "@/components/admisiones/SeccionAdmisionDetalle";
import { PasosAdmision } from "@/components/admisiones/PasosAdmision";
import { FormularioAdmision } from "@/components/admisiones/FormularioAdmision";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Admisión EGB Superior — Unidad Educativa Atenas",
  description:
    "Requisitos y proceso de admisión para EGB Superior (8vo a 10mo grado) en la Unidad Educativa Atenas, Ambato.",
};

export default function AdmisionEGBSuperiorPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ADMISIONES"
          title="Admisión EGB Superior"
          subtitle="8vo a 10mo grado — La etapa previa al Bachillerato IB, con exigencia académica y formación en liderazgo."
          ghostText="SUPERIOR"
        />
        <NavAdmisiones current="egb-superior" />
        <SeccionAdmisionDetalle
          badge="EGB Superior — 8vo a 10mo grado"
          heading="Requisitos para ingresar a EGB Superior"
          paragraphs={[
            "La EGB Superior es la etapa de preparación para el Bachillerato, con especial énfasis en el desarrollo del pensamiento analítico, el inglés avanzado y las bases científicas que el Programa del Diploma IB requiere.",
            "Los estudiantes de 8vo a 10mo que ingresan a Atenas pasan por un proceso de evaluación diagnóstica para asegurar su integración exitosa al nivel académico del colegio.",
          ]}
          documents={[
            "Notas de los últimos 2 años",
            "Cédula del representante",
            "Partida de nacimiento",
            "Certificado de matrícula anterior",
            "Certificado médico",
            "Fotos tamaño carnet",
          ]}
          note="Los estudiantes de 10mo que demuestren el perfil requerido tienen prioridad en el proceso de postulación al Bachillerato IB del siguiente año lectivo."
          ficha={[
            { label: "Niveles",         value: "8vo a 10mo grado" },
            { label: "Edad aprox.",     value: "12 – 15 años" },
            { label: "Promedio mínimo", value: "7.5 / 10", highlight: true },
            { label: "Evaluación",      value: "Diagnóstica + entrevista" },
            { label: "Inicio",          value: "Septiembre" },
          ]}
        />
        <PasosAdmision />
        <FormularioAdmision nivelDefault="EGB Superior" />
        <FooterCTA />
      </main>
    </>
  );
}
