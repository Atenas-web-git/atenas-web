import { FechasBannerClient } from "./FechasBannerClient";
import {
  getConfiguracion,
  type FechasMatriculas,
} from "@/lib/cms/getConfiguracion";

const FALLBACK: FechasMatriculas = {
  ano_lectivo: "Año lectivo 2026–2027",
  etapas: [
    { etapa: "Inscripciones", rango: "3 – 28 feb 2026" },
    { etapa: "Matrículas nuevas", rango: "3 – 14 mar 2026" },
    { etapa: "Reingreso", rango: "17 – 21 mar 2026" },
  ],
  cta_texto: "Iniciar proceso",
  cta_url: "/matriculas/proceso",
};

/**
 * Server wrapper. Lee la configuración global `fechas_matriculas` desde
 * Supabase y la pasa al componente cliente. Las páginas que usan
 * <FechasBanner /> deben tener `export const revalidate = 60` para que
 * los cambios desde el backoffice se reflejen en máximo 60 segundos.
 */
export async function FechasBanner() {
  const data = await getConfiguracion<FechasMatriculas>("fechas_matriculas");
  return <FechasBannerClient data={data ?? FALLBACK} />;
}
