import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroContactos } from "@/components/contactos/HeroContactos";
import { InfoContactos } from "@/components/contactos/InfoContactos";
import { FormContactos } from "@/components/contactos/FormContactos";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Contactos — Unidad Educativa Atenas",
  description:
    "Contáctanos por teléfono, correo o visítanos en persona. Estamos en Calle Gabriel Román s/n y Av. Pedro Vásconez, Izamba, Ambato, Ecuador.",
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
