import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroIB } from "@/components/ib/HeroIB";
import { NucleoIB } from "@/components/ib/NucleoIB";
import { MateriasIB } from "@/components/ib/MateriasIB";
import { ProcesoIB } from "@/components/ib/ProcesoIB";
import { ExplorarIB } from "@/components/ib/ExplorarIB";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Bachillerato Internacional IB — Unidad Educativa Atenas",
  description:
    "El único colegio en el centro del país con el Programa del Diploma IB acreditado. CAS, Monografía, Teoría del Conocimiento y 6 grupos de asignaturas para universidades del mundo.",
  keywords:
    "bachillerato IB Ambato, colegio IB Ecuador, Programa del Diploma IB, colegio bilingüe Ambato, universidades internacionales Ecuador",
  openGraph: {
    title: "Bachillerato Internacional IB — Unidad Educativa Atenas",
    description:
      "El único colegio IB acreditado en el centro de Ecuador. Diploma IB reconocido por universidades del mundo, en Ambato.",
  },
};

const ibSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOccupationalProgram",
  name: "Programa del Diploma del Bachillerato Internacional (IBDP)",
  description:
    "Programa de bachillerato de dos años acreditado por la International Baccalaureate Organization. Reconocido por universidades en más de 90 países. Incluye CAS, Monografía y Teoría del Conocimiento.",
  url: "https://atenas.edu.ec/academico/ib",
  provider: {
    "@type": "EducationalOrganization",
    "@id": "https://atenas.edu.ec/#organization",
    name: "Unidad Educativa Atenas",
  },
  educationalProgramMode: "full-time",
  educationalCredentialAwarded: "Diploma del Bachillerato Internacional (IB Diploma)",
  occupationalCredentialAwarded: "IB Diploma — International Baccalaureate",
  programPrerequisites: "Educación General Básica Superior aprobada",
  timeToComplete: "P2Y",
  inLanguage: ["es", "en"],
  offers: {
    "@type": "Offer",
    category: "Bachillerato Internacional",
    seller: { "@id": "https://atenas.edu.ec/#organization" },
  },
};

export default function IBPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ibSchema) }}
      />
      <Navbar />
      <main>
        <HeroIB />
        <NucleoIB />
        <MateriasIB />
        <ProcesoIB />
        <ExplorarIB />
        <FooterCTA />
      </main>
    </>
  );
}
