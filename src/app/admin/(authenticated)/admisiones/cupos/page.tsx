import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import { NIVELES } from "../constants";
import { AdmisionesSubNav } from "../SubNav";
import { CuposFormClient } from "./CuposFormClient";

export default async function CuposPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const sp = await searchParams;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  // Cargar años lectivos activos desde la BD
  const { data: anosData } = await supabase
    .from("anos_lectivos")
    .select("codigo, nombre, activo")
    .eq("activo", true)
    .order("codigo", { ascending: true });

  const anos = anosData ?? [];
  const codigos = anos.map((a) => a.codigo);

  // Si no hay años configurados, mostrar mensaje
  if (anos.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <AdmisionesSubNav />
        <div
          className="flex flex-col items-center justify-center gap-4 py-16 px-6"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
          }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            Aún no hay años lectivos configurados.
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

  const [{ data: cuposData }, ...conteos] = await Promise.all([
    supabase
      .from("cupos_admision")
      .select("nivel, cupos_total, cupos_ocupados")
      .eq("ano_lectivo", anoLectivo),
    ...NIVELES.map(async (nivel) => {
      const [{ count: matriculados }, { count: esperando }] = await Promise.all([
        supabase
          .from("solicitudes_admision")
          .select("*", { count: "exact", head: true })
          .eq("est_nivel", nivel)
          .eq("estado", "matriculado"),
        supabase
          .from("solicitudes_admision")
          .select("*", { count: "exact", head: true })
          .eq("est_nivel", nivel)
          .eq("estado", "lista_espera"),
      ]);
      return { nivel, ocupados: matriculados ?? 0, esperando: esperando ?? 0 };
    }),
  ]);

  const cupos = NIVELES.map((nivel, i) => {
    const conf = (cuposData ?? []).find((c) => c.nivel === nivel);
    const live = conteos[i];
    return {
      nivel,
      cupos_total: conf?.cupos_total ?? 0,
      ocupados: live?.ocupados ?? 0,
      esperando: live?.esperando ?? 0,
    };
  });

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Gestión de Cupos
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            Configura los cupos disponibles por nivel educativo
          </p>
        </div>

        {/* Tabs año lectivo */}
        <div
          className="flex items-center flex-wrap"
          style={{
            border: "1px solid #E8E4DD",
            borderRadius: 8,
            background: "#FFFFFF",
            overflow: "hidden",
          }}
        >
          {anos.map((ano) => {
            const isActive = ano.codigo === anoLectivo;
            return (
              <Link
                key={ano.codigo}
                href={`/admin/admisiones/cupos?ano=${ano.codigo}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 36,
                  paddingLeft: 16,
                  paddingRight: 16,
                  background: isActive ? "#1A2B4A" : "transparent",
                  color: isActive ? "#FFFFFF" : "#6B6660",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.15s ease",
                }}
              >
                {ano.codigo}
              </Link>
            );
          })}
        </div>
      </div>

      <CuposFormClient anoLectivo={anoLectivo} cupos={cupos} />
    </div>
  );
}
