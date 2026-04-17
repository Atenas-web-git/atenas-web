import { Navbar } from "@/components/home/Navbar";
import { HeroComunidad } from "@/components/comunidad/HeroComunidad";
import { AudienciasComunidad } from "@/components/comunidad/AudienciasComunidad";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata = {
  title: "Comunidad — Unidad Educativa Atenas",
  description:
    "Un espacio para cada integrante de la familia Atenas. Alumno, padre/madre, docente y alumni — todos en casa desde 1976.",
};

export default function ComunidadPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroComunidad />
        <AudienciasComunidad />
        <FooterCTA />
      </main>
    </>
  );
}
