import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CategoriaRow } from "./CategoriaRow";
import { NuevaCategoriaForm } from "./NuevaCategoriaForm";

export default async function CategoriasPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data: categorias = [] } = await supabase
    .from("documentos_categorias")
    .select("id, slug, nombre, icono, color, orden")
    .order("orden", { ascending: true });

  // Conteo de documentos por categoría (para mostrar en la fila + bloquear delete)
  const { data: counts = [] } = await supabase
    .from("documentos")
    .select("categoria_id");

  const countByCat = new Map<number, number>();
  for (const c of counts ?? []) {
    countByCat.set(c.categoria_id, (countByCat.get(c.categoria_id) ?? 0) + 1);
  }

  const cats = categorias ?? [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/documentos"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Documentos
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Categorías de documentos
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Categorías que agrupan los documentos en el frontend público (ej.{" "}
          <em>Contratos</em>, <em>Políticas</em>, <em>Formularios</em>). Cada una tiene un icono
          de Lucide y un color de paleta. No se pueden borrar si tienen documentos asociados.
        </p>
      </div>

      <NuevaCategoriaForm />

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Aún no hay categorías. Crea la primera arriba.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
                {["Color", "Nombre", "Slug", "Icono", "Docs", "Orden", ""].map((h) => (
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
              {cats.map((c, i) => (
                <CategoriaRow
                  key={c.id}
                  cat={c}
                  count={countByCat.get(c.id) ?? 0}
                  isFirst={i === 0}
                  isLast={i === cats.length - 1}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
