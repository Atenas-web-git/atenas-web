import Link from "next/link";
import {
  UserPlus,
  Clock,
  CheckCircle2,
  Users as UsersIcon,
  ArrowUpRight,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";

const ESTADO_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  revisando: "En revisión",
  entrevista_agendada: "Entrevista",
  lista_espera: "Lista de espera",
  aceptado: "Aceptada",
  matriculado: "Matriculada",
  rechazado: "Rechazada",
};

const ESTADO_COLORS: Record<string, { bg: string; fg: string }> = {
  pendiente: { bg: "#FEF3C7", fg: "#92400E" },
  revisando: { bg: "#DBEAFE", fg: "#1E40AF" },
  entrevista_agendada: { bg: "#DBEAFE", fg: "#1E40AF" },
  lista_espera: { bg: "#FED7AA", fg: "#9A3412" },
  aceptado: { bg: "#D1FAE5", fg: "#065F46" },
  matriculado: { bg: "#1A2B4A", fg: "#D4AF37" },
  rechazado: { bg: "#FEE2E2", fg: "#991B1B" },
};

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8E4DD",
  borderRadius: 12,
};

async function loadStats() {
  const supabase = createAdminClient();

  const [
    { count: pendientes },
    { count: revisando },
    { count: listaEspera },
    { count: matriculados },
    { count: usuarios },
  ] = await Promise.all([
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "revisando"),
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "lista_espera"),
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "matriculado"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    pendientes: pendientes ?? 0,
    revisando: revisando ?? 0,
    listaEspera: listaEspera ?? 0,
    matriculados: matriculados ?? 0,
    usuarios: usuarios ?? 0,
  };
}

async function loadSolicitudesRecientes() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("solicitudes_admision")
    .select("id, numero, est_nombres, est_apellidos, est_nivel, estado, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return data ?? [];
}

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Recién ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `Hace ${diffHour} h`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `Hace ${diffDay} día${diffDay === 1 ? "" : "s"}`;
  return date.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
}

function getInitialsFromNames(nombres: string, apellidos: string): string {
  const n = (nombres ?? "").trim().split(/\s+/)[0]?.[0] ?? "";
  const a = (apellidos ?? "").trim().split(/\s+/)[0]?.[0] ?? "";
  return (n + a).toUpperCase() || "·";
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const canSeeAdmisiones = hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES]);
  const isSuper = hasRole(user, ROLES.SUPERADMIN);

  const [stats, recientes] = await Promise.all([
    loadStats(),
    canSeeAdmisiones ? loadSolicitudesRecientes() : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Clock}
          label="Pendientes"
          value={stats.pendientes}
          accent="#92400E"
          accentBg="#FEF3C7"
          enabled={canSeeAdmisiones}
        />
        <MetricCard
          icon={UserPlus}
          label="En revisión"
          value={stats.revisando}
          accent="#1E40AF"
          accentBg="#DBEAFE"
          enabled={canSeeAdmisiones}
        />
        <MetricCard
          icon={Clock}
          label="Lista de espera"
          value={stats.listaEspera}
          accent="#9A3412"
          accentBg="#FED7AA"
          enabled={canSeeAdmisiones}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Matriculados"
          value={stats.matriculados}
          accent="#065F46"
          accentBg="#D1FAE5"
          enabled={canSeeAdmisiones}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Solicitudes recientes */}
        {canSeeAdmisiones && (
          <div className="lg:col-span-2 flex flex-col" style={cardStyle}>
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid #E8E4DD" }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                Solicitudes recientes
              </h2>
              <Link
                href="/admin/admisiones"
                className="flex items-center gap-1 transition-opacity hover:opacity-70"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#1A2B4A",
                  textDecoration: "none",
                }}
              >
                Ver todas
                <ArrowUpRight size={12} strokeWidth={2.5} />
              </Link>
            </div>

            {recientes.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
                  Aún no hay solicitudes registradas.
                </p>
              </div>
            ) : (
              <ul className="flex flex-col">
                {recientes.map((s, i) => {
                  const colors = ESTADO_COLORS[s.estado] ?? ESTADO_COLORS.pendiente;
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-4 px-6 py-4"
                      style={{
                        borderBottom: i === recientes.length - 1 ? "none" : "1px solid #E8E4DD",
                      }}
                    >
                      <div
                        className="flex items-center justify-center flex-shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          background: "#F4F1EB",
                          borderRadius: "50%",
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#1A2B4A" }}>
                          {getInitialsFromNames(s.est_nombres, s.est_apellidos)}
                        </span>
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                        <span
                          className="truncate"
                          style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}
                        >
                          {s.est_nombres} {s.est_apellidos}
                        </span>
                        <span
                          style={{ fontSize: 11, fontWeight: 400, color: "#6B6660" }}
                        >
                          {s.est_nivel} · {formatRelativeDate(s.created_at)}
                        </span>
                      </div>
                      <span
                        className="flex items-center px-2.5 rounded-full flex-shrink-0"
                        style={{
                          height: 22,
                          background: colors.bg,
                          fontSize: 11,
                          fontWeight: 600,
                          color: colors.fg,
                        }}
                      >
                        {ESTADO_LABELS[s.estado] ?? s.estado}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Accesos rápidos */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 p-6" style={cardStyle}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              Accesos rápidos
            </h2>
            {canSeeAdmisiones && (
              <QuickLink
                href="/admin/admisiones"
                icon={UserPlus}
                label="Ver solicitudes"
              />
            )}
            {canSeeAdmisiones && (
              <QuickLink
                href="/admin/admisiones/cupos"
                icon={Clock}
                label="Configurar cupos"
              />
            )}
            {isSuper && (
              <QuickLink
                href="/admin/usuarios/nuevo"
                icon={UsersIcon}
                label="Crear usuario"
              />
            )}
          </div>

          {isSuper && (
            <div className="flex flex-col gap-3 p-6" style={cardStyle}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                Equipo
              </h2>
              <div className="flex items-baseline gap-2">
                <span style={{ fontSize: 28, fontWeight: 700, color: "#1A2B4A" }}>
                  {stats.usuarios}
                </span>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#6B6660" }}>
                  usuario{stats.usuarios === 1 ? "" : "s"} activo{stats.usuarios === 1 ? "" : "s"}
                </span>
              </div>
              <Link
                href="/admin/usuarios"
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#1A2B4A",
                  textDecoration: "underline",
                }}
              >
                Gestionar equipo →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  accent,
  accentBg,
  enabled,
}: {
  icon: typeof UserPlus;
  label: string;
  value: number;
  accent: string;
  accentBg: string;
  enabled: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-5"
      style={{
        ...cardStyle,
        opacity: enabled ? 1 : 0.5,
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 11, fontWeight: 500, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {label}
        </span>
        <div
          className="flex items-center justify-center"
          style={{ width: 28, height: 28, background: accentBg, borderRadius: 8 }}
        >
          <Icon size={14} color={accent} strokeWidth={2} />
        </div>
      </div>
      <span style={{ fontSize: 28, fontWeight: 700, color: "#1A2B4A", lineHeight: 1 }}>
        {value}
      </span>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof UserPlus;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 rounded-md transition-colors"
      style={{
        height: 38,
        background: "#F4F1EB",
        textDecoration: "none",
      }}
    >
      <Icon size={14} color="#1A2B4A" strokeWidth={2} />
      <span style={{ fontSize: 12, fontWeight: 500, color: "#1A2B4A" }}>{label}</span>
    </Link>
  );
}
