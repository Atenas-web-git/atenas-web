import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus, Bell, ChevronRight, Calendar, Clock } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { TIPO_INFO } from "./constants";
import { CrearNotificacionForm } from "./CrearNotificacionForm";

type Filtro = "todas" | "vigentes" | "programadas" | "vencidas" | "inactivas";

function classifyEstado(
  activa: boolean,
  fechaInicio: string,
  fechaFin: string | null
): Exclude<Filtro, "todas"> {
  if (!activa) return "inactivas";
  const now = Date.now();
  const inicio = new Date(fechaInicio).getTime();
  const fin = fechaFin ? new Date(fechaFin).getTime() : null;
  if (now < inicio) return "programadas";
  if (fin !== null && now > fin) return "vencidas";
  return "vigentes";
}

function formatDate(iso: string | null): string {
  if (!iso) return "Sin fecha";
  return new Date(iso).toLocaleString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ESTADO_LABELS: Record<Exclude<Filtro, "todas">, { label: string; color: string; bg: string }> = {
  vigentes: { label: "Vigente", color: "#065F46", bg: "#D1FAE5" },
  programadas: { label: "Programada", color: "#1E40AF", bg: "#DBEAFE" },
  vencidas: { label: "Vencida", color: "#9A3412", bg: "#FED7AA" },
  inactivas: { label: "Inactiva", color: "#6B6660", bg: "#F4F1EB" },
};

export default async function NotificacionesListPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: Filtro }>;
}) {
  const sp = await searchParams;
  const filtro: Filtro = sp.estado ?? "todas";

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) redirect("/admin");

  const supabase = createAdminClient();
  const { data: notifs } = await supabase
    .from("notificaciones")
    .select("id, titulo, tipo, fecha_inicio, fecha_fin, prioridad, activa, updated_at")
    .order("prioridad", { ascending: false })
    .order("updated_at", { ascending: false });

  const todas = notifs ?? [];

  // Conteo por categoría
  const counts = todas.reduce<Record<Exclude<Filtro, "todas">, number>>(
    (acc, n) => {
      const k = classifyEstado(n.activa, n.fecha_inicio, n.fecha_fin);
      acc[k]++;
      return acc;
    },
    { vigentes: 0, programadas: 0, vencidas: 0, inactivas: 0 }
  );

  // Filtrado según tab
  const filas =
    filtro === "todas"
      ? todas
      : todas.filter(
          (n) => classifyEstado(n.activa, n.fecha_inicio, n.fecha_fin) === filtro
        );

  const tabs: { key: Filtro; label: string; count: number }[] = [
    { key: "todas", label: "Todas", count: todas.length },
    { key: "vigentes", label: "Vigentes", count: counts.vigentes },
    { key: "programadas", label: "Programadas", count: counts.programadas },
    { key: "vencidas", label: "Vencidas", count: counts.vencidas },
    { key: "inactivas", label: "Inactivas", count: counts.inactivas },
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
            Notificaciones
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            Avisos, popups y banners para visitantes del sitio. Programables con fechas de inicio y fin.
          </p>
        </div>
      </div>

      <CrearNotificacionForm />

      {/* Tabs */}
      <div
        className="flex items-center gap-1 self-start flex-wrap"
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
              href={
                t.key === "todas"
                  ? "/admin/contenido/notificaciones"
                  : `/admin/contenido/notificaciones?estado=${t.key}`
              }
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
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-3">
            <Bell size={32} color="#A0AABA" strokeWidth={1.5} />
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              {filtro === "todas"
                ? "Aún no hay notificaciones. Crea la primera arriba."
                : `No hay notificaciones con estado "${filtro}".`}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col">
            {filas.map((n, i) => {
              const tipoInfo = TIPO_INFO[n.tipo as keyof typeof TIPO_INFO];
              const estado = classifyEstado(n.activa, n.fecha_inicio, n.fecha_fin);
              const estadoInfo = ESTADO_LABELS[estado];
              return (
                <li
                  key={n.id}
                  style={{
                    borderBottom: i === filas.length - 1 ? "none" : "1px solid #E8E4DD",
                  }}
                >
                  <Link
                    href={`/admin/contenido/notificaciones/${n.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-opacity hover:opacity-80"
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 40,
                        height: 40,
                        background: tipoInfo?.bg ?? "#F4F1EB",
                        borderRadius: 8,
                      }}
                    >
                      <Bell
                        size={18}
                        color={tipoInfo?.color ?? "#1A2B4A"}
                        strokeWidth={2}
                      />
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
                          {n.titulo}
                        </span>
                        <span
                          className="inline-flex items-center px-2 rounded-full"
                          style={{
                            height: 20,
                            background: estadoInfo.bg,
                            fontSize: 10,
                            fontWeight: 700,
                            color: estadoInfo.color,
                            letterSpacing: 0.3,
                          }}
                        >
                          {estadoInfo.label}
                        </span>
                        {n.prioridad > 0 && (
                          <span
                            className="inline-flex items-center px-2 rounded-full"
                            style={{
                              height: 20,
                              background: "#FEF3C7",
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#92400E",
                              letterSpacing: 0.3,
                            }}
                          >
                            ⚡ Alta
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="inline-flex items-center px-2 rounded-full"
                          style={{
                            height: 20,
                            background: "#F4F1EB",
                            fontSize: 10,
                            fontWeight: 600,
                            color: "#6B6660",
                          }}
                        >
                          {tipoInfo?.label ?? n.tipo}
                        </span>
                        <span
                          className="flex items-center gap-1"
                          style={{ fontSize: 11, color: "#A0AABA" }}
                        >
                          <Calendar size={11} strokeWidth={2} />
                          {formatDate(n.fecha_inicio)}
                        </span>
                        {n.fecha_fin && (
                          <span
                            className="flex items-center gap-1"
                            style={{ fontSize: 11, color: "#A0AABA" }}
                          >
                            <Clock size={11} strokeWidth={2} />
                            hasta {formatDate(n.fecha_fin)}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} color="#A0AABA" strokeWidth={2} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
