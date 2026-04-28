import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroContactos } from "@/components/contactos/HeroContactos";
import { InfoContactos } from "@/components/contactos/InfoContactos";
import { FormContactos } from "@/components/contactos/FormContactos";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Contactos — Unidad Educativa Atenas",
  description:
    "Contáctanos por teléfono (03 2854281), correo o visítanos en Calle Gabriel Román s/n y Av. Pedro Vásconez, Izamba, Ambato, Ecuador.",
  keywords:
    "contacto colegio Ambato, dirección Unidad Educativa Atenas, teléfono colegio Izamba Ambato, correo admisiones Atenas",
  openGraph: {
    title: "Contactos — Unidad Educativa Atenas",
    description:
      "Encuéntranos en Calle Gabriel Román s/n, Izamba, Ambato. Teléfono: 03 2854281 · admisiones@atenas.edu.ec",
  },
};

export default function ContactosPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroContactos />
        <InfoContactos />
        <FormContactos />
        <FooterCTA />
      </main>
    </>
  );
}
