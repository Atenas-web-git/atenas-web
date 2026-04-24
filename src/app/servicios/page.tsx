import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { GridServicios } from "@/components/servicios/GridServicios";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Servicios | Atenas",
  description:
    "Conoce todos los servicios disponibles para estudiantes, representantes legales y docentes de la Unidad Educativa Atenas: bar, biblioteca, transporte, dispensario médico, casilleros, becas, seguro estudiantil y canal de quejas.",
};

export default function ServiciosPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="UNIDAD EDUCATIVA ATENAS"
          title="Servicios Institucionales"
          subtitle="Todos los recursos y servicios disponibles para el bienestar y desarrollo de nuestra comunidad educativa."
          ghostText="SERVICIOS"
        />
        <GridServicios />
        <FooterCTA />
      </main>
    </>
  );
}
