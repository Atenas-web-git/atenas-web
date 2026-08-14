import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { NIVELES, ESTADOS, ESTADO_INFO, type EstadoAdmision } from "./constants";
import { AdmisionesSubNav } from "./SubNav";

const TABS: { key: string; label: string }[] = [
  { key: "todas", label: "Todas" },
  ...ESTADOS.map((e) => ({ key: e, label: ESTADO_INFO[e].label })),
];

const PER_PAGE = 20;

function buildUrl(
  params: { estado?: string; nivel?: string; q?: string; page?: number }
): string {
  const p = new URLSearchParams();
  if (params.estado && params.estado !== "todas") p.set("estado", params.estado);
  if (params.nivel) p.set("nivel", params.nivel);
  if (params.q) p.set("q", params.q);
  if (params.page && params.page > 1) p.set("page", String(params.page));
  const qs = p.toString();
  return `/admin/admisiones${qs ? `?${qs}` : ""}`;
}

function getInitials(nombres: string, apellidos: string): string {
  const n = (nombres ?? "").trim()[0] ?? "";
  const a = (apellidos ?? "").trim()[0] ?? "";
  return (n + a).toUpperCase() || "·";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function loadCounts() {
  const supabase = createAdminClient();
  const results = await Promise.all(
    ESTADOS.map((s) =>
      supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", s)
    )
  );
  return Object.fromEntries(ESTADOS.map((s, i) => [s, results[i].count ?? 0]));
}

export default async function AdmisionesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; nivel?: string; q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const estadoFilter = sp.estado ?? "todas";
  const nivelFilter = sp.nivel ?? "";
  const query = (sp.q ?? "").trim();
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  let dbQuery = supabase
    .from("solicitudes_admision")
    .select(
      "id, numero, est_nombres, est_apellidos, est_nivel, estado, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  if (estadoFilter !== "todas") dbQuery = dbQuery.eq("estado", estadoFilter);
  if (nivelFilter) dbQuery = dbQuery.eq("est_nivel", nivelFilter);
  if (query) {
    dbQuery = dbQuery.or(
      `numero.ilike.%${query}%,est_nombres.ilike.%${query}%,est_apellidos.ilike.%${query}%`
    );
  }

  const [{ data: solicitudes, count }, tabCounts] = await Promise.all([
    dbQuery,
    loadCounts(),
  ]);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);
  const totalCount = Object.values(tabCounts).reduce((a, b) => a + b, 0);

  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #E8E4DD",
    borderRadius: 12,
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Solicitudes de Admisión
          </h1>
          {/*
            «De todos los años lectivos» no sobra: Métricas cuenta un año y
            esta pantalla los cuenta todos. Sin decirlo, las dos dan cifras
            distintas en el mismo panel y quien mire deja de fiarse de las dos.
          */}
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            {totalCount} solicitud{totalCount === 1 ? "" : "es"} en total, de todos los años
            lectivos
          </p>
        </div>
        <a
          href={`/admin/admisiones/exportar${estadoFilter !== "todas" ? `?estado=${estadoFilter}` : ""}${nivelFilter ? `${estadoFilter !== "todas" ? "&" : "?"}nivel=${encodeURIComponent(nivelFilter)}` : ""}`}
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
          <Download size={14} strokeWidth={2} />
          Exportar CSV
        </a>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #E8E4DD" }}>
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = tab.key === estadoFilter;
            const cnt = tab.key === "todas" ? totalCount : (tabCounts[tab.key] ?? 0);
            return (
              <Link
                key={tab.key}
                href={buildUrl({ estado: tab.key, nivel: nivelFilter, q: query })}
                className="flex items-center gap-2 px-4 whitespace-nowrap transition-colors"
                style={{
                  height: 44,
                  borderBottom: isActive ? "2px solid #1A2B4A" : "2px solid transparent",
                  marginBottom: -1,
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#1A2B4A" : "#6B6660",
                  }}
                >
                  {tab.label}
                </span>
                {cnt > 0 && (
                  <span
                    className="flex items-center justify-center px-1.5 rounded-full"
                    style={{
                      minWidth: 20,
                      height: 18,
                      background: isActive ? "#1A2B4A" : "#E8E4DD",
                      fontSize: 11,
                      fontWeight: 700,
                      color: isActive ? "#9e1915" : "#6B6660",
                    }}
                  >
                    {cnt}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <form
        method="get"
        action="/admin/admisiones"
        className="flex items-center gap-3 flex-wrap"
      >
        {estadoFilter !== "todas" && (
          <input type="hidden" name="estado" value={estadoFilter} />
        )}
        <div
          className="flex items-center gap-2 px-3 rounded-md flex-1"
          style={{
            height: 38,
            border: "1px solid #E8E4DD",
            background: "#FFFFFF",
            minWidth: 200,
            maxWidth: 320,
          }}
        >
          <Search size={14} color="#6B6660" strokeWidth={2} />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre o N° ADM…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 13,
              color: "#1A2B4A",
              width: "100%",
            }}
          />
        </div>
        <select
          name="nivel"
          defaultValue={nivelFilter}
          style={{
            height: 38,
            border: "1px solid #E8E4DD",
            borderRadius: 6,
            background: "#FFFFFF",
            fontSize: 13,
            color: "#1A2B4A",
            paddingLeft: 12,
            paddingRight: 28,
            outline: "none",
          }}
        >
          <option value="">Todos los niveles</option>
          {NIVELES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 rounded-md transition-opacity hover:opacity-80"
          style={{
            height: 38,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
        {(query || nivelFilter) && (
          <Link
            href={buildUrl({ estado: estadoFilter })}
            style={{ fontSize: 12, color: "#6B6660", textDecoration: "underline" }}
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div style={cardStyle}>
        {!solicitudes || solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0 }}>
              No hay solicitudes que coincidan con los filtros.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
                  {["N° Solicitud", "Postulante", "Nivel", "Recibida", "Estado", ""].map((h) => (
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
                {solicitudes.map((s, i) => {
                  const info =
                    ESTADO_INFO[s.estado as EstadoAdmision] ?? ESTADO_INFO.interesado;
                  const initials = getInitials(s.est_nombres, s.est_apellidos);
                  return (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom:
                          i === solicitudes.length - 1 ? "none" : "1px solid #E8E4DD",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#1A2B4A",
                            fontFamily: "monospace",
                          }}
                        >
                          {s.numero}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{
                              width: 34,
                              height: 34,
                              background: "#F4F1EB",
                              borderRadius: "50%",
                            }}
                          >
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1A2B4A" }}>
                              {initials}
                            </span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                            {s.est_nombres} {s.est_apellidos}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 12, color: "#6B6660" }}>{s.est_nivel}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 12, color: "#6B6660" }}>
                          {formatDate(s.created_at)}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          className="inline-flex items-center px-2.5 rounded-full"
                          style={{
                            height: 22,
                            background: info.colorBg,
                            fontSize: 11,
                            fontWeight: 600,
                            color: info.colorFg,
                          }}
                        >
                          {info.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <Link
                          href={`/admin/admisiones/${s.id}`}
                          className="transition-opacity hover:opacity-70"
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#1A2B4A",
                            textDecoration: "none",
                            border: "1px solid #E8E4DD",
                            borderRadius: 6,
                            padding: "5px 12px",
                          }}
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
            Mostrando {offset + 1}–{Math.min(offset + PER_PAGE, total)} de {total}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={buildUrl({ estado: estadoFilter, nivel: nivelFilter, q: query, page: page - 1 })}
                className="flex items-center gap-1 px-3 rounded-md transition-opacity hover:opacity-70"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#FFFFFF",
                  fontSize: 13,
                  color: "#1A2B4A",
                  textDecoration: "none",
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
                Anterior
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 px-3 rounded-md"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#F4F1EB",
                  fontSize: 13,
                  color: "#A0AABA",
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
                Anterior
              </span>
            )}
            <span style={{ fontSize: 12, color: "#6B6660" }}>
              Pág. {page} de {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={buildUrl({ estado: estadoFilter, nivel: nivelFilter, q: query, page: page + 1 })}
                className="flex items-center gap-1 px-3 rounded-md transition-opacity hover:opacity-70"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#FFFFFF",
                  fontSize: 13,
                  color: "#1A2B4A",
                  textDecoration: "none",
                }}
              >
                Siguiente
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 px-3 rounded-md"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#F4F1EB",
                  fontSize: 13,
                  color: "#A0AABA",
                }}
              >
                Siguiente
                <ChevronRight size={14} strokeWidth={2.5} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
