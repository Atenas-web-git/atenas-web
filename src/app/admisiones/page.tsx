import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroAdmisiones } from "@/components/admisiones/HeroAdmisiones";
import { ProcesoAdmisiones } from "@/components/admisiones/ProcesoAdmisiones";
import { NivelesAdmisiones } from "@/components/admisiones/NivelesAdmisiones";
import { ExplorarAdmisiones } from "@/components/admisiones/ExplorarAdmisiones";
import { VisitaAdmisiones } from "@/components/admisiones/VisitaAdmisiones";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Admisiones — Unidad Educativa Atenas",
  description:
    "Conoce el proceso de admisión del Colegio Atenas en Ambato, Ecuador. Niveles desde Inicial hasta Bachillerato Internacional IB. Solicita tu visita.",
  keywords:
    "admisiones colegio Ambato, inscripciones Unidad Educativa Atenas, proceso de admisión colegio IB Ecuador, matrícula colegio Ambato",
  openGraph: {
    title: "Admisiones — Unidad Educativa Atenas",
    description:
      "Inicia el proceso de admisión en el Colegio Atenas de Ambato. Bachillerato IB, certificación ISO 9001 y formación integral desde Inicial hasta BGU.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuáles son los niveles educativos que ofrece el Colegio Atenas en Ambato?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La Unidad Educativa Atenas ofrece Educación Inicial (3–5 años), Educación General Básica Elemental y Media (1.° a 7.° grado), Educación General Básica Superior (8.° a 10.° grado) y Bachillerato Internacional IB (1.° a 3.° de bachillerato).",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo es el proceso de admisión en la Unidad Educativa Atenas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El proceso consta de 4 pasos: 1) Solicitud de información, 2) Visita a las instalaciones, 3) Entrevista familiar y evaluación diagnóstica, 4) Confirmación de matrícula. Puedes iniciar el proceso en línea desde nuestra página de admisiones.",
      },
    },
    {
      "@type": "Question",
      name: "¿El Colegio Atenas tiene el Bachillerato Internacional (IB)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La Unidad Educativa Atenas es un colegio acreditado por la International Baccalaureate Organization (IBO) y ofrece el Diploma del Bachillerato Internacional (IBDP) en Izamba, Ambato, Ecuador.",
      },
    },
    {
      "@type": "Question",
      name: "¿Dónde está ubicado el Colegio Atenas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Estamos ubicados en la Calle Gabriel Román s/n y Av. Pedro Vásconez, parroquia Izamba, Ambato, Tungurahua, Ecuador. Código postal 180103.",
      },
    },
    {
      "@type": "Question",
      name: "¿A qué número puedo llamar para información sobre admisiones?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Puedes llamarnos al +593 3 285-4281 o escribirnos a admisiones@atenas.edu.ec. Atendemos de lunes a viernes de 07:00 a 17:00.",
      },
    },
    {
      "@type": "Question",
      name: "¿El Colegio Atenas tiene certificación ISO 9001?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. La Unidad Educativa Atenas cuenta con certificación ISO 9001 en gestión de calidad educativa, lo que garantiza procesos institucionales estandarizados y mejora continua.",
      },
    },
  ],
};

export default function AdmisionesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        <HeroAdmisiones />
        <ProcesoAdmisiones />
        <NivelesAdmisiones />
        <ExplorarAdmisiones />
        <VisitaAdmisiones />
        <FooterCTA />
      </main>
    </>
  );
}
