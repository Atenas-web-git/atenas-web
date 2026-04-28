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
  title: "Admisión Bachillerato IB — Unidad Educativa Atenas",
  description:
    "Requisitos, documentos y proceso de admisión para el Programa del Diploma IB en la Unidad Educativa Atenas, Ambato. Cupos limitados.",
};

export default function AdmisionIBPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="ADMISIONES"
          title="Admisión al Bachillerato IB"
          subtitle="Todo lo que necesitas saber para postular al Programa del Diploma en la Unidad Educativa Atenas."
          ghostText="INGRESO"
        />
        <NavAdmisiones current="ib" />
        <SeccionAdmisionDetalle
          badge="Bachillerato Internacional — Diploma IB"
          heading="Requisitos para ingresar al Programa del Diploma"
          paragraphs={[
            "El Programa del Diploma IB es exigente y transformador. Para ingresar, el estudiante debe demostrar un perfil académico sólido, disposición para el trabajo autónomo y compromiso con el aprendizaje integral que el Diploma demanda durante dos años.",
            "El proceso es riguroso porque el programa lo es. Cada estudiante es evaluado en sus capacidades académicas, su perfil emocional y su madurez para asumir los retos del Diploma.",
          ]}
          documents={[
            "Notas de 8vo a 10mo",
            "Cédula de identidad",
            "Certificado médico",
            "Formulario de postulación",
            "Fotos tamaño carnet",
          ]}
          note="Las admisiones para el Programa del Diploma IB abren una vez al año. El número de cupos es limitado y se asignan en estricto orden de mérito académico."
          ficha={[
            { label: "Nivel",            value: "1ro y 2do Bachillerato" },
            { label: "Edad requerida",   value: "14 – 15 años" },
            { label: "Promedio mínimo",  value: "8 / 10", highlight: true },
            { label: "Cupos",            value: "Limitados" },
            { label: "Inicio",           value: "Septiembre" },
          ]}
        />
        <PasosAdmision />
        <CTAIniciarSolicitud nivel="Bachillerato IB" />
        <FormularioAdmision nivelDefault="Bachillerato IB" />
        <FooterCTA />
      </main>
    </>
  );
}
