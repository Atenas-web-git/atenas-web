import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { TablaDocumentos } from "@/components/documentos/TablaDocumentos";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Documentos Institucionales | Unidad Educativa Atenas",
  description:
    "Descarga los documentos oficiales de la Unidad Educativa Atenas: resoluciones, contratos, políticas y formularios vigentes para el año lectivo 2026–2027.",
};

export default function DocumentosInstitucionales() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="DOCUMENTOS INSTITUCIONALES"
          title="Documentos Institucionales"
          subtitle="Resoluciones, contratos, políticas y formularios para familias y estudiantes de la Unidad Educativa Atenas."
          ghostText="DOCUMENTOS"
        />
        <TablaDocumentos />
        <FooterCTA />
      </main>
    </>
  );
}
