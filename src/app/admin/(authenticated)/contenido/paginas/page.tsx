import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, ChevronRight, Globe, FileEdit } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { PLANTILLAS } from "../plantillas";

function formatDate(iso: string | null): string {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function PaginasListPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const sp = await searchParams;
  const filtro = sp.estado ?? "todas";

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("paginas")
    .select("id, slug, titulo, plantilla, publicada, updated_at")
    .order("updated_at", { ascending: false });

  if (filtro === "publicadas") query = query.eq("publicada", true);
  if (filtro === "borrador") query = query.eq("publicada", false);

  const { data: paginas } = await query;
  const filas = paginas ?? [];

  // Contadores para los tabs
  const [{ count: totalCount }, { count: publicadasCount }, { count: borradorCount }] =
    await Promise.all([
      supabase.from("paginas").select("*", { count: "exact", head: true }),
      supabase.from("paginas").select("*", { count: "exact", head: true }).eq("publicada", true),
      supabase.from("paginas").select("*", { count: "exact", head: true }).eq("publicada", false),
    ]);

  const tabs = [
    { key: "todas", label: "Todas", count: totalCount ?? 0 },
    { key: "publicadas", label: "Publicadas", count: publicadasCount ?? 0 },
    { key: "borrador", label: "Borrador", count: borradorCount ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Contenido
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Páginas
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            {totalCount ?? 0} página{totalCount === 1 ? "" : "s"} en el catálogo
          </p>
        </div>
        <Link
          href="/admin/contenido/paginas/nueva"
          className="flex items-center gap-2 px-4 rounded-md transition-opacity hover:opacity-80"
          style={{
            height: 38,
            background: "#1A2B4A",
            color: "#FFFFFF",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Crear nueva página
        </Link>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 self-start"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 10,
          padding: 4,
        }}
      >
        {tabs.map((t) => {
          const isActive = filtro === t.key;
          return (
            <Link
              key={t.key}
              href={t.key === "todas" ? "/admin/contenido/paginas" : `/admin/contenido/paginas?estado=${t.key}`}
              className="flex items-center gap-2 px-4 transition-all"
              style={{
                height: 32,
                background: isActive ? "#1A2B4A" : "transparent",
                color: isActive ? "#FFFFFF" : "#6B6660",
                borderRadius: 7,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {t.label}
              <span
                className="inline-flex items-center justify-center rounded-full"
                style={{
                  height: 18,
                  minWidth: 22,
                  paddingLeft: 6,
                  paddingRight: 6,
                  background: isActive ? "rgba(255,255,255,0.15)" : "#F4F1EB",
                  fontSize: 11,
                  fontWeight: 600,
                  color: isActive ? "#FFFFFF" : "#6B6660",
                }}
              >
                {t.count}
              </span>
            </Link>
          );
        })}
      </div>

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
              No hay páginas que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {filas.map((p, i) => {
              const tpl = PLANTILLAS[p.plantilla as keyof typeof PLANTILLAS];
              return (
                <li
                  key={p.id}
                  className="flex items-center gap-3 px-6 py-4"
                  style={{
                    borderBottom: i === filas.length - 1 ? "none" : "1px solid #E8E4DD",
                  }}
                >
                  <Link
                    href={`/admin/contenido/paginas/${p.id}`}
                    className="flex items-center gap-4 flex-1 min-w-0 transition-opacity hover:opacity-80"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        background: "#F4F1EB",
                        borderRadius: 8,
                      }}
                    >
                      <FileEdit size={18} color="#1A2B4A" strokeWidth={2} />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#1A2B4A",
                          }}
                        >
                          {p.titulo}
                        </span>
                        <span
                          className="inline-flex items-center px-2 rounded-full"
                          style={{
                            height: 20,
                            background: p.publicada ? "#D1FAE5" : "#F4F1EB",
                            fontSize: 10,
                            fontWeight: 700,
                            color: p.publicada ? "#065F46" : "#6B6660",
                            letterSpacing: 0.3,
                          }}
                        >
                          {p.publicada ? "Publicada" : "Borrador"}
                        </span>
                        <span
                          className="inline-flex items-center px-2 rounded-full"
                          style={{
                            height: 20,
                            background: "#EFF6FF",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#1E40AF",
                            letterSpacing: 0.3,
                          }}
                          title={tpl?.nombre ?? p.plantilla}
                        >
                          Plantilla {tpl?.letra ?? "?"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <code
                          style={{
                            fontSize: 11,
                            color: "#6B6660",
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          /{p.slug}
                        </code>
                        <span style={{ fontSize: 11, color: "#A0AABA" }}>·</span>
                        <span style={{ fontSize: 11, color: "#A0AABA" }}>
                          Editado {formatDate(p.updated_at)}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#A0AABA" strokeWidth={2} />
                  </Link>
                  {p.publicada && (
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 transition-opacity hover:opacity-70 flex-shrink-0"
                      style={{
                        height: 28,
                        fontSize: 11,
                        color: "#C9A84C",
                        fontWeight: 600,
                        textDecoration: "none",
                        borderRadius: 4,
                      }}
                      title="Ver página pública"
                    >
                      <Globe size={11} strokeWidth={2.5} />
                      Ver pública
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
