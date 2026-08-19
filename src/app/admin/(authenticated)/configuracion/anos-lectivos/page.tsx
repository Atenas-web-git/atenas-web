import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { contarPlazas } from "@/lib/admisiones/cupos";
import { CrearAnoForm } from "./CrearAnoForm";
import { AnoLectivoRow } from "./AnoLectivoRow";

export default async function AnosLectivosPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();

  const { data: anos } = await supabase
    .from("anos_lectivos")
    .select("codigo, nombre, fecha_inicio, fecha_fin, activo")
    .order("codigo", { ascending: false });

  // Conteo de cupos y solicitudes vinculadas a cada año
  const codigos = (anos ?? []).map((a) => a.codigo);
  const conteos = await Promise.all(
    codigos.map(async (codigo) => {
      const [{ data: cuposRows }, { count: solicCount }] = await Promise.all([
        // Se traen TODAS las filas del año y las cuenta `contarPlazas`, la
        // misma función que usa el guardia de borrado. Antes esta pantalla
        // miraba solo las filas de nivel y el guardia las sumaba todas: un año
        // configurado solo por año escolar salía como «0 cupos» con la papelera
        // habilitada, y al pulsarla el servidor la rechazaba.
        supabase
          .from("cupos_admision")
          .select("nivel, grado, cupos_total")
          .eq("ano_lectivo", codigo),
        supabase
          .from("solicitudes_admision")
          .select("*", { count: "exact", head: true })
          .eq("anio_ingreso", codigo),
      ]);
      const plazas = contarPlazas(cuposRows ?? []);
      return { codigo, cupos_count: plazas, solic_count: solicCount ?? 0 };
    })
  );

  const filas = (anos ?? []).map((a) => {
    const c = conteos.find((x) => x.codigo === a.codigo);
    return {
      ...a,
      cupos_count: c?.cupos_count ?? 0,
      solic_count: c?.solic_count ?? 0,
    };
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/configuracion"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Configuración
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Años lectivos
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Gestiona los años lectivos disponibles para cupos y formularios.
        </p>
      </div>

      <CrearAnoForm />

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {filas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Aún no hay años lectivos registrados. Crea el primero arriba.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
                {["Código", "Nombre", "Inicio", "Fin", "Estado", "Vinculados", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6B6660",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((ano) => (
                <AnoLectivoRow key={ano.codigo} ano={ano} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
