import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarRange,
  ImageIcon,
  Layers,
  Plus,
  Tag,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CronogramaFilters } from "./CronogramaFilters";

const PALETA_COLOR: Record<string, string> = {
  gold: "#9e1915",
  red: "#9e1915",
  teal: "#0D9488",
  navy: "#1A2B4A",
  purple: "#7C3AED",
};

function formatRange(inicio: string, fin: string | null): string {
  if (!fin) return formatDate(inicio);
  if (fin === inicio) return formatDate(inicio);
  return `${formatDate(inicio)} → ${formatDate(fin)}`;
}

function formatDate(iso: string): string {
  // ISO yyyy-mm-dd → "08 sep 2026"
  const [y, m, d] = iso.split("-");
  const meses = ["", "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[Number(m)]} ${y}`;
}

export default async function CronogramaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; periodo?: string; tipo?: string; ano?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const filtroPeriodo = params.periodo ? Number(params.periodo) : null;
  const filtroTipo = params.tipo ? Number(params.tipo) : null;
  const filtroAno = params.ano ?? "";

  const supabase = createAdminClient();

  const [periodosRes, tiposRes, eventosRes, anosRes] = await Promise.all([
    supabase
      .from("cronograma_periodos")
      .select("id, slug, nombre, color, ano_lectivo_codigo, orden")
      .order("orden", { ascending: true }),
    supabase
      .from("cronograma_tipos")
      .select("id, slug, nombre, orden")
      .order("orden", { ascending: true }),
    supabase
      .from("cronograma_eventos")
      .select("id, titulo, descripcion, periodo_id, tipo_id, fecha_inicio, fecha_fin, publicado")
      .order("fecha_inicio", { ascending: true }),
    supabase
      .from("anos_lectivos")
      .select("codigo, nombre, activo")
      .order("codigo", { ascending: false }),
  ]);

  const periodos = periodosRes.data ?? [];
  const tipos = tiposRes.data ?? [];
  const eventos = eventosRes.data ?? [];
  const anos = anosRes.data ?? [];

  const periodoById = new Map(periodos.map((p) => [p.id, p]));
  const tipoById = new Map(tipos.map((t) => [t.id, t]));

  const eventosFiltrados = eventos.filter((e) => {
    const periodo = periodoById.get(e.periodo_id);
    if (filtroPeriodo && e.periodo_id !== filtroPeriodo) return false;
    if (filtroTipo && e.tipo_id !== filtroTipo) return false;
    if (filtroAno && periodo?.ano_lectivo_codigo !== filtroAno) return false;
    if (query && !e.titulo.toLowerCase().includes(query)) return false;
    return true;
  });

  const totalPublicados = eventos.filter((e) => e.publicado).length;

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

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Cronograma escolar
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
            Eventos del año lectivo agrupados por período. Define tus quimestres, trimestres
            o cualquier otro tipo de período en{" "}
            <Link href="/admin/contenido/cronograma/periodos" style={{ color: "#1A2B4A", fontWeight: 500 }}>
              gestionar períodos
            </Link>
            . Total: <strong style={{ color: "#1A2B4A" }}>{eventos.length}</strong> eventos,{" "}
            <strong style={{ color: "#065F46" }}>{totalPublicados}</strong> publicados.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/contenido/cronograma/hero"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={btnSecondary}
          >
            <ImageIcon size={14} strokeWidth={2.5} />
            Cabecera (hero)
          </Link>
          <Link
            href="/admin/contenido/cronograma/periodos"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={btnSecondary}
          >
            <Layers size={14} strokeWidth={2.5} />
            Períodos
          </Link>
          <Link
            href="/admin/contenido/cronograma/tipos"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={btnSecondary}
          >
            <Tag size={14} strokeWidth={2.5} />
            Tipos
          </Link>
          <Link
            href="/admin/contenido/cronograma/nuevo"
            className="flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90"
            style={btnPrimary}
          >
            <Plus size={14} strokeWidth={2.5} />
            Nuevo evento
          </Link>
        </div>
      </div>

      {/* Aviso si no hay períodos o tipos */}
      {(periodos.length === 0 || tipos.length === 0) && (
        <div
          className="px-5 py-4 rounded-md"
          style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
        >
          <p style={{ fontSize: 13, color: "#92400E", margin: 0 }}>
            {periodos.length === 0 && (
              <>
                Aún no hay períodos. Crea al menos un período (quimestre, trimestre, etc.) en{" "}
                <Link href="/admin/contenido/cronograma/periodos" style={{ color: "#92400E", fontWeight: 600 }}>
                  gestionar períodos
                </Link>{" "}
                antes de crear eventos.{" "}
              </>
            )}
            {tipos.length === 0 && (
              <>
                Aún no hay tipos de evento. Crea al menos uno en{" "}
                <Link href="/admin/contenido/cronograma/tipos" style={{ color: "#92400E", fontWeight: 600 }}>
                  gestionar tipos
                </Link>
                .
              </>
            )}
          </p>
        </div>
      )}

      <CronogramaFilters
        periodos={periodos.map((p) => ({ id: p.id, nombre: p.nombre }))}
        tipos={tipos.map((t) => ({ id: t.id, nombre: t.nombre }))}
        anosLectivos={anos.map((a) => ({ codigo: a.codigo, nombre: a.nombre ?? a.codigo }))}
        currentQ={query}
        currentPeriodo={params.periodo ?? ""}
        currentTipo={params.tipo ?? ""}
        currentAno={filtroAno}
      />

      {eventosFiltrados.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            {eventos.length === 0
              ? "Aún no hay eventos. Crea el primero arriba."
              : "Ningún evento coincide con los filtros."}
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
                {["Fecha", "Evento", "Período", "Tipo", "Estado", ""].map((h) => (
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
              {eventosFiltrados.map((ev) => {
                const periodo = periodoById.get(ev.periodo_id);
                const tipo = tipoById.get(ev.tipo_id);
                const periodoColor = PALETA_COLOR[periodo?.color ?? "navy"];
                return (
                  <tr key={ev.id} style={{ borderBottom: "1px solid #F4F1EB" }}>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 12,
                        color: "#1A2B4A",
                        whiteSpace: "nowrap",
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      <CalendarRange
                        size={11}
                        strokeWidth={2.5}
                        color="#6B6660"
                        style={{ display: "inline-block", marginRight: 6, verticalAlign: -1 }}
                      />
                      {formatRange(ev.fecha_inicio, ev.fecha_fin)}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <Link
                        href={`/admin/contenido/cronograma/${ev.id}`}
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1A2B4A",
                          textDecoration: "none",
                        }}
                      >
                        {ev.titulo}
                      </Link>
                      {ev.descripcion && (
                        <p
                          style={{
                            fontSize: 11,
                            color: "#6B6660",
                            margin: "2px 0 0",
                            maxWidth: 380,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {ev.descripcion}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, whiteSpace: "nowrap" }}>
                      <span
                        className="inline-flex items-center gap-1.5"
                        style={{ color: periodoColor, fontWeight: 600 }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: periodoColor,
                          }}
                        />
                        {periodo?.nombre ?? "—"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#6B6660" }}>
                      {tipo?.nombre ?? "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        className="inline-flex items-center px-2 rounded-full"
                        style={{
                          height: 20,
                          background: ev.publicado ? "#DCFCE7" : "#FEF3C7",
                          fontSize: 10,
                          fontWeight: 700,
                          color: ev.publicado ? "#065F46" : "#92400E",
                          letterSpacing: 0.3,
                        }}
                      >
                        {ev.publicado ? "PUBLICADO" : "BORRADOR"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <Link
                        href={`/admin/contenido/cronograma/${ev.id}`}
                        className="inline-flex items-center px-3 rounded-md transition-opacity hover:opacity-70"
                        style={{
                          height: 28,
                          background: "#F4F1EB",
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#1A2B4A",
                          textDecoration: "none",
                        }}
                      >
                        Editar
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
  );
}

const btnPrimary: React.CSSProperties = {
  height: 36,
  background: "#1A2B4A",
  fontSize: 13,
  color: "#FFFFFF",
  fontWeight: 600,
  textDecoration: "none",
};

const btnSecondary: React.CSSProperties = {
  height: 36,
  background: "#F4F1EB",
  fontSize: 13,
  color: "#1A2B4A",
  fontWeight: 500,
  textDecoration: "none",
};
