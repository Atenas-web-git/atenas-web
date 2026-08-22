import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowUp, ArrowDown, Eye, EyeOff, Plus, Trophy } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { reordenarCategoriaAction } from "./actions";

export default async function ReconocimientosIndexPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();

  const [{ data: categorias = [] }, { data: subCounts = [] }, { data: logroCounts = [] }] =
    await Promise.all([
      supabase
        .from("reconocimientos_categorias")
        .select("id, slug, nombre, orden, visible")
        .order("orden", { ascending: true }),
      supabase.from("reconocimientos_subcategorias").select("categoria_id"),
      supabase.from("reconocimientos_logros").select("categoria_id"),
    ]);

  const subCountByCat = new Map<number, number>();
  for (const s of subCounts ?? []) {
    subCountByCat.set(s.categoria_id, (subCountByCat.get(s.categoria_id) ?? 0) + 1);
  }
  const logroCountByCat = new Map<number, number>();
  for (const l of logroCounts ?? []) {
    logroCountByCat.set(l.categoria_id, (logroCountByCat.get(l.categoria_id) ?? 0) + 1);
  }

  const cats = categorias ?? [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Contenido
      </Link>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Reconocimientos
          </h1>
          <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
            Categorías de reconocimientos (académicos, deportivos, profesionales…). Cada
            categoría aparece como una sección pública en{" "}
            <code style={codeStyle}>/reconocimientos/[slug]</code> con sus subcategorías,
            logros destacados y galería de fotos.
          </p>
        </div>
        <Link
          href="/admin/contenido/reconocimientos/nueva"
          className="flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90"
          style={btnPrimary}
        >
          <Plus size={14} strokeWidth={2.5} />
          Nueva categoría
        </Link>
      </div>

      {cats.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <Trophy size={32} strokeWidth={2} color="#A0AABA" />
          <p style={{ fontSize: 14, color: "#6B6660", margin: "12px 0 0", textAlign: "center" }}>
            Aún no hay categorías de reconocimientos. Crea la primera arriba.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
                {["Orden", "Nombre", "Slug", "Subcategorías", "Logros", "Estado", ""].map((h) => (
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
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #F4F1EB" }}>
                  <td style={{ padding: "10px 16px", whiteSpace: "nowrap" }}>
                    <div className="flex items-center gap-1">
                      <form action={reordenarCategoriaAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="direccion" value="up" />
                        <button
                          type="submit"
                          disabled={i === 0}
                          className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={iconBtn}
                          aria-label="Mover arriba"
                        >
                          <ArrowUp size={13} strokeWidth={2.5} />
                        </button>
                      </form>
                      <form action={reordenarCategoriaAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="direccion" value="down" />
                        <button
                          type="submit"
                          disabled={i === cats.length - 1}
                          className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
                          style={iconBtn}
                          aria-label="Mover abajo"
                        >
                          <ArrowDown size={13} strokeWidth={2.5} />
                        </button>
                      </form>
                      <span style={{ fontSize: 12, color: "#6B6660", marginLeft: 4 }}>
                        {c.orden}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <Link
                      href={`/admin/contenido/reconocimientos/${c.id}`}
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1A2B4A",
                        textDecoration: "none",
                      }}
                    >
                      {c.nombre}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      fontSize: 13,
                      color: "#6B6660",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    /reconocimientos/{c.slug}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#1A2B4A" }}>
                    {subCountByCat.get(c.id) ?? 0}
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#1A2B4A" }}>
                    {logroCountByCat.get(c.id) ?? 0}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      className="inline-flex items-center gap-1 px-2 rounded-full"
                      style={{
                        height: 20,
                        background: c.visible ? "#DCFCE7" : "#FEF3C7",
                        fontSize: 11,
                        fontWeight: 700,
                        color: c.visible ? "#065F46" : "#92400E",
                        letterSpacing: 0.3,
                      }}
                    >
                      {c.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                      {c.visible ? "VISIBLE" : "OCULTO"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <Link
                      href={`/admin/contenido/reconocimientos/${c.id}`}
                      className="inline-flex items-center px-3 rounded-md transition-opacity hover:opacity-70"
                      style={{
                        height: 28,
                        background: "#F4F1EB",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1A2B4A",
                        textDecoration: "none",
                      }}
                    >
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  height: 36,
  background: "#1A2B4A",
  fontSize: 14,
  color: "#FFFFFF",
  fontWeight: 600,
  textDecoration: "none",
};

const iconBtn: React.CSSProperties = {
  width: 22,
  height: 22,
  background: "#F4F1EB",
  color: "#1A2B4A",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

const codeStyle: React.CSSProperties = {
  background: "#F4F1EB",
  padding: "1px 6px",
  borderRadius: 4,
  fontFamily: "ui-monospace, monospace",
  fontSize: 13,
};
