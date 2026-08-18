import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import {
  calcularMetricas,
  type SolicitudMetrica,
  type CambioDeEstado,
} from "@/lib/admisiones/metricas";
import {
  getConfiguracion,
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
} from "@/lib/cms/getConfiguracion";
import { AdmisionesSubNav } from "../SubNav";
import { MetricasView } from "./MetricasView";

/** Cuántas filas pide cada viaje. Por debajo del tope de PostgREST. */
const BLOQUE = 1000;

/**
 * Trae una tabla entera, en bloques.
 *
 * Una consulta sin `.range()` **no devuelve todas las filas**: PostgREST corta
 * en `db-max-rows` —mil por defecto— y responde 200 sin avisar de nada. El
 * código no tiene forma de notar que le faltan datos.
 *
 * Aquí eso no sería un error visible sino números equivocados: con ocho estados
 * de pipeline, `solicitudes_historial` cruza el tope alrededor de las 130
 * solicitudes, y a partir de ahí solicitudes atendidas ayer aparecerían como
 * detenidas hace meses, porque su último cambio de estado se habría quedado
 * fuera. Justo lo que un tablero no puede hacer.
 *
 * El `.order("created_at")` no es decorativo: sin orden explícito, el subconjunto
 * que devuelve cada bloque es arbitrario y podrían repetirse o perderse filas
 * entre una página y la siguiente.
 */
async function traerTodo<T>(
  tabla: "solicitudes_admision" | "solicitudes_historial",
  columnas: string
): Promise<T[]> {
  const supabase = createAdminClient();
  const filas: T[] = [];
  let desde = 0;
  // Se para cuando un bloque vuelve vacío, no cuando vuelve más corto de lo
  // pedido. Si el tope del servidor fuera menor que `BLOQUE` —se configura en
  // Supabase y nadie de aquí lo controla—, todos los bloques llegarían cortos
  // y parar por eso sería volver a truncar en silencio, que es justo lo que
  // esta función existe para evitar.
  for (let vuelta = 0; vuelta < 100; vuelta++) {
    const { data, error } = await supabase
      .from(tabla)
      .select(columnas)
      .order("created_at", { ascending: true })
      .range(desde, desde + BLOQUE - 1);
    if (error || !data || data.length === 0) break;
    filas.push(...(data as T[]));
    desde += data.length;
  }
  return filas;
}

/**
 * Aparte y no `Date.now()` dentro del componente: la regla `react-hooks/purity`
 * marca como error llamar a una función impura durante el render, y el resto
 * del panel ya resuelve esto igual.
 */
function ahora(): number {
  return Date.now();
}

export default async function MetricasPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const sp = await searchParams;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  const [{ data: anosData }, textosRaw] = await Promise.all([
    supabase
      .from("anos_lectivos")
      .select("codigo, activo")
      .eq("activo", true)
      .order("codigo", { ascending: true }),
    // El umbral de «detenido» lo edita el colegio en Configuración › Admisiones.
    getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos"),
  ]);

  const codigos = (anosData ?? []).map((a) => a.codigo as string);
  const { diasParaEstancada } = mergeAdmisionesTextos(textosRaw).metricas;

  if (codigos.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <AdmisionesSubNav />
        <div
          className="flex flex-col items-center justify-center gap-4 py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            Aún no hay años lectivos configurados, así que no hay nada que medir.
          </p>
          {hasRole(user, ROLES.SUPERADMIN) && (
            <Link
              href="/admin/configuracion/anos-lectivos"
              className="px-4 rounded-md transition-opacity hover:opacity-80"
              style={{
                height: 38,
                display: "inline-flex",
                alignItems: "center",
                background: "#1A2B4A",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Configurar años lectivos →
            </Link>
          )}
        </div>
      </div>
    );
  }

  const anoLectivo = codigos.includes(sp.ano ?? "") ? (sp.ano as string) : codigos[0];

  const [solicitudes, historial] = await Promise.all([
    traerTodo<SolicitudMetrica>(
      "solicitudes_admision",
      "id, numero, estado, est_nombres, est_apellidos, est_nivel, est_institucion_origen, anio_ingreso, created_at"
    ),
    traerTodo<CambioDeEstado>(
      "solicitudes_historial",
      "solicitud_id, estado_nuevo, created_at"
    ),
  ]);

  const metricas = calcularMetricas(
    solicitudes,
    anoLectivo,
    codigos,
    historial,
    ahora(),
    diasParaEstancada
  );

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />
      <MetricasView metricas={metricas} anoLectivo={anoLectivo} anos={codigos} />
    </div>
  );
}
