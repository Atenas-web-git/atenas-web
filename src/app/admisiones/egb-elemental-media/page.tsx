import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavAdmisiones } from "@/components/admisiones/NavAdmisiones";
import { SeccionAdmisionDetalle } from "@/components/admisiones/SeccionAdmisionDetalle";
import { PasosAdmision } from "@/components/admisiones/PasosAdmision";
import { CTAIniciarSolicitud } from "@/components/admisiones/CTAIniciarSolicitud";
import { FormularioAdmision } from "@/components/admisiones/FormularioAdmision";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Admisión EGB Elemental y Media — Unidad Educativa Atenas",
  description:
    "Requisitos y proceso de admisión para EGB Elemental y Media (1ro a 7mo grado) en la Unidad Educativa Atenas, Ambato.",
};

export default function AdmisionEGBEMPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ADMISIONES"
          title="Admisión EGB Elemental y Media"
          subtitle="1ro a 7mo grado — Formación sólida en valores, bilinguismo y pensamiento crítico desde la infancia."
          ghostText="EGB"
        />
        <NavAdmisiones current="egb-elemental-media" />
        <SeccionAdmisionDetalle
          badge="EGB Elemental y Media — 1ro a 7mo grado"
          heading="Requisitos para ingresar a EGB Elemental y Media"
          paragraphs={[
            "La EGB Elemental y Media en Atenas ofrece una formación bilingüe, humanista y con énfasis en el desarrollo del pensamiento lógico-matemático. Aceptamos estudiantes de transferencia que cumplan los requisitos académicos y documentales establecidos.",
            "El proceso incluye una evaluación diagnóstica para identificar el nivel del estudiante y garantizar que su integración al grupo sea exitosa.",
          ]}
          documents={[
            "Notas del año anterior",
            "Cédula del representante",
            "Partida de nacimiento",
            "Certificado de matrícula anterior",
            "Certificado médico",
            "Fotos tamaño carnet",
          ]}
          note="Para estudiantes que provienen de otros establecimientos se requiere el historial académico completo y el certificado de no adeudar valores al colegio de origen."
          ficha={[
            { label: "Niveles",         value: "1ro a 7mo grado" },
            { label: "Edad aprox.",     value: "6 – 12 años" },
            { label: "Promedio mínimo", value: "7 / 10", highlight: true },
            { label: "Evaluación",      value: "Diagnóstica" },
            { label: "Inicio",          value: "Septiembre" },
          ]}
        />
        <PasosAdmision />
        <CTAIniciarSolicitud nivel="EGB Elemental y Media" />
        <FormularioAdmision nivelDefault="EGB Elemental y Media" />
        <FooterCTA />
      </main>
    </>
  );
}
