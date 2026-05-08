import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { PeriodoRow } from "./PeriodoRow";
import { NuevoPeriodoForm } from "./NuevoPeriodoForm";

export default async function PeriodosPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const [periodosRes, anosRes, eventosRes] = await Promise.all([
    supabase
      .from("cronograma_periodos")
      .select("id, slug, nombre, color, ano_lectivo_codigo, orden")
      .order("orden", { ascending: true }),
    supabase
      .from("anos_lectivos")
      .select("codigo, nombre, activo")
      .order("codigo", { ascending: false }),
    supabase
      .from("cronograma_eventos")
      .select("periodo_id"),
  ]);

  const periodos = periodosRes.data ?? [];
  const anos = anosRes.data ?? [];
  const counts = new Map<number, number>();
  for (const e of eventosRes.data ?? []) {
    counts.set(e.periodo_id, (counts.get(e.periodo_id) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/cronograma"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al cronograma
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Períodos académicos
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Define los períodos del año lectivo: quimestres, trimestres, bimestres o lo que
          necesites. Cada período tiene un color que se usa en los badges del frontend
          público. No se pueden borrar si tienen eventos asociados.
        </p>
      </div>

      <NuevoPeriodoForm anosLectivos={anos.map((a) => ({ codigo: a.codigo, nombre: a.nombre ?? a.codigo }))} />

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {periodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Aún no hay períodos. Crea el primero arriba.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
                {["Color", "Nombre", "Slug", "Año lectivo", "Eventos", ""].map((h) => (
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
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periodos.map((p, i) => (
                <PeriodoRow
                  key={p.id}
                  periodo={p}
                  count={counts.get(p.id) ?? 0}
                  isFirst={i === 0}
                  isLast={i === periodos.length - 1}
                  anosLectivos={anos.map((a) => ({ codigo: a.codigo, nombre: a.nombre ?? a.codigo }))}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
