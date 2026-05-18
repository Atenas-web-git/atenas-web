import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroContactos } from "@/components/contactos/HeroContactos";
import { InfoContactos } from "@/components/contactos/InfoContactos";
import { FormContactos } from "@/components/contactos/FormContactos";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getConfiguracion,
  mergeContacto,
  type Contacto,
} from "@/lib/cms/getConfiguracion";
import {
  mergeContactosPagina,
  type ContactosPaginaConfig,
} from "@/lib/cms/contactosPagina";

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

/**
 * Toma los datos primarios de contacto (teléfono central + dirección
 * cruda + email principal) desde `configuracion_global['contacto']` y
 * los normaliza para inyectarlos en los componentes de /contactos.
 *
 * El teléfono "central" es el primer telefónico de la lista. El email
 * principal es el primero del array. Si no hay nada en BD, se usan los
 * defaults razonables del colegio.
 */
function deriveContactoPrimario(contacto: Contacto) {
  const tel = contacto.telefonos[0];
  const telefonoPrincipal = tel?.numero || "03 2854281";
  const telefonoExtension = tel?.extension
    ? `ext. ${tel.extension} ${tel.label}`.trim()
    : tel?.label || "ext. 100 Recepción";

  const email = contacto.emails[0];
  const emailPrincipal = email?.email || "admisiones@atenas.edu.ec";

  return { telefonoPrincipal, telefonoExtension, emailPrincipal };
}

export default async function ContactosPage() {
  const [rawPagina, rawContacto] = await Promise.all([
    getConfiguracion<Partial<ContactosPaginaConfig>>("contactos_pagina"),
    getConfiguracion<Partial<Contacto>>("contacto"),
  ]);
  const pagina = mergeContactosPagina(rawPagina);
  const contacto = mergeContacto(rawContacto);
  const primario = deriveContactoPrimario(contacto);

  return (
    <>
      <Navbar />
      <main>
        <HeroContactos
          hero={pagina.hero}
          telefonoPrincipal={primario.telefonoPrincipal}
          telefonoExtension={primario.telefonoExtension}
        />
        <InfoContactos
          canales={pagina.canales}
          telefonoPrincipal={primario.telefonoPrincipal}
          emailPrincipal={primario.emailPrincipal}
        />
        <FormContactos formulario={pagina.formulario} mapa={pagina.mapa} />
        <FooterCTA />
      </main>
    </>
  );
}
