import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavAdmisiones } from "@/components/admisiones/NavAdmisiones";
import { SeccionAdmisionDetalle } from "@/components/admisiones/SeccionAdmisionDetalle";
import { PasosAdmision } from "@/components/admisiones/PasosAdmision";
import { FormularioAdmision } from "@/components/admisiones/FormularioAdmision";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Admisión Educación Inicial — Unidad Educativa Atenas",
  description:
    "Requisitos y proceso de admisión para Educación Inicial (Pre-Kinder y Kinder) en la Unidad Educativa Atenas, Ambato.",
};

export default function AdmisionInicialPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ADMISIONES"
          title="Admisión a Educación Inicial"
          subtitle="Pre-Kinder y Kinder — Los primeros pasos de una formación de por vida en la Unidad Educativa Atenas."
          ghostText="INICIAL"
        />
        <NavAdmisiones current="inicial" />
        <SeccionAdmisionDetalle
          badge="Educación Inicial — Pre-Kinder y Kinder"
          heading="Requisitos para ingresar a Educación Inicial"
          paragraphs={[
            "La Educación Inicial en Atenas es el punto de partida de una formación integral basada en las metodologías Montessori, Reggio Emilia y ABN. Para ingresar, el niño o niña debe cumplir con los rangos de edad establecidos por el Ministerio de Educación.",
            "El proceso de admisión es sencillo y acompañado: nuestro equipo guía a las familias en cada paso para asegurar una transición tranquila y feliz para el estudiante.",
          ]}
          documents={[
            "Cédula del representante",
            "Partida de nacimiento",
            "Certificado médico",
            "Carnet de vacunas",
            "Fotos tamaño carnet",
            "Formulario de inscripción",
          ]}
          note="Para Pre-Kinder el niño debe cumplir 3 años antes del 31 de diciembre del año lectivo. Para Kinder, 4 años en la misma fecha."
          ficha={[
            { label: "Niveles",          value: "Pre-Kinder y Kinder" },
            { label: "Edad Pre-Kinder",  value: "3 años cumplidos" },
            { label: "Edad Kinder",      value: "4 años cumplidos" },
            { label: "Promedio mínimo",  value: "No aplica" },
            { label: "Inicio",           value: "Septiembre" },
          ]}
        />
        <PasosAdmision />
        <FormularioAdmision nivelDefault="Educación Inicial" />
        <FooterCTA />
      </main>
    </>
  );
}
