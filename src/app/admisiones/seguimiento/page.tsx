import type { Metadata } from "next";
import {
  getConfiguracion,
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
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
  const raw = await getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos");
  const textos = mergeAdmisionesTextos(raw).seguimiento;

  return (
    <SeguimientoClient
      headerTitle={textos.headerTitle}
      backLabel={textos.backLabel}
      introTitle={textos.introTitle}
      introDescription={textos.introDescription}
    />
  );
}
