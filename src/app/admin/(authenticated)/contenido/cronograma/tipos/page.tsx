import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { TipoRow } from "./TipoRow";
import { NuevoTipoForm } from "./NuevoTipoForm";

export default async function TiposPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const [tiposRes, eventosRes] = await Promise.all([
    supabase
      .from("cronograma_tipos")
      .select("id, slug, nombre, orden")
      .order("orden", { ascending: true }),
    supabase.from("cronograma_eventos").select("tipo_id"),
  ]);

  const tipos = tiposRes.data ?? [];
  const counts = new Map<number, number>();
  for (const e of eventosRes.data ?? []) {
    counts.set(e.tipo_id, (counts.get(e.tipo_id) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/cronograma"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al cronograma
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Tipos de evento
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Categorías que clasifican los eventos del cronograma (feriado, evaluación,
          ceremonia, deportivo, cultural, etc.). Aparecen como etiqueta debajo de cada
          evento en el frontend público. No se pueden borrar si tienen eventos asociados.
        </p>
      </div>

      <NuevoTipoForm />

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {tipos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Aún no hay tipos. Crea el primero arriba.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
                {["Nombre", "Slug", "Eventos", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 12,
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
              {tipos.map((t, i) => (
                <TipoRow
                  key={t.id}
                  tipo={t}
                  count={counts.get(t.id) ?? 0}
                  isFirst={i === 0}
                  isLast={i === tipos.length - 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
