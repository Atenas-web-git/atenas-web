import type { Metadata } from "next";
import {
  getConfiguracion,
  mergeAdmisionesTextos,
  mergeContacto,
  type AdmisionesTextosConfig,
  type Contacto,
} from "@/lib/cms/getConfiguracion";
import { SeguimientoClient } from "./SeguimientoClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Seguimiento de Solicitud — Unidad Educativa Atenas",
  description:
    "Consulta el estado de tu solicitud de admisión con el número de seguimiento que recibiste por correo.",
  robots: { index: false, follow: false },
};

export default async function SeguimientoPage() {
  const [rawTextos, rawContacto] = await Promise.all([
    getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos"),
    getConfiguracion<Partial<Contacto>>("contacto"),
  ]);
  const textos = mergeAdmisionesTextos(rawTextos).seguimiento;
  const contacto = mergeContacto(rawContacto);

  // Email de contacto para las dudas — preferimos el que tenga "admis" en
  // el label, sino el primero de la lista.
  const contactoEmail =
    contacto.emails.find((e) => e.label.toLowerCase().includes("admis"))?.email ||
    contacto.emails[0]?.email ||
    "";

  return (
    <SeguimientoClient
      headerTitle={textos.headerTitle}
      backLabel={textos.backLabel}
      introTitle={textos.introTitle}
      introDescription={textos.introDescription}
      contactoEmail={contactoEmail}
    />
  );
}
