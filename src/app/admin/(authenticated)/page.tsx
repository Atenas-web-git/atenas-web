import Link from "next/link";
import {
  UserPlus,
  Clock,
  CheckCircle2,
  Users as UsersIcon,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import { ESTADO_INFO, type EstadoAdmision } from "./admisiones/constants";

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8E4DD",
  borderRadius: 12,
};

async function loadStats() {
  const supabase = createAdminClient();

  // Métricas del funnel: entrada → intermedio → admitido → matriculado.
  const [
    { count: interesados },
    { count: enEvaluacion },
    { count: admitidos },
    { count: matriculados },
    { count: usuarios },
  ] = await Promise.all([
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "interesado"),
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "en_evaluacion"),
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "admitido"),
    supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", "matriculado"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return {
    interesados: interesados ?? 0,
    enEvaluacion: enEvaluacion ?? 0,
    admitidos: admitidos ?? 0,
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

  // Ni siquiera se leen si no se van a mostrar: así el dato de admisiones no
  // llega al servidor que renderiza para alguien que no debe verlo.
  const [stats, recientes] = await Promise.all([
    canSeeAdmisiones
      ? loadStats()
      : Promise.resolve({
          interesados: 0,
          enEvaluacion: 0,
          admitidos: 0,
          matriculados: 0,
          // Solo lo pinta el bloque «Equipo», que es de superadmin — y todo
          // superadmin ve admisiones, así que aquí nunca se usa.
          usuarios: 0,
        }),
    canSeeAdmisiones ? loadSolicitudesRecientes() : Promise.resolve([]),
  ]);

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Métricas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={UserPlus}
          label="Interesados"
          value={stats.interesados}
          accent="#92400E"
          accentBg="#FEF3C7"
          enabled={canSeeAdmisiones}
        />
        <MetricCard
          icon={Clock}
          label="En evaluación"
          value={stats.enEvaluacion}
          accent="#9D174D"
          accentBg="#FCE7F3"
          enabled={canSeeAdmisiones}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Admitidos"
          value={stats.admitidos}
          accent="#065F46"
          accentBg="#D1FAE5"
          enabled={canSeeAdmisiones}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Matriculados"
          value={stats.matriculados}
          accent="#9e1915"
          accentBg="#1A2B4A"
          enabled={canSeeAdmisiones}
        />
        {/*
          Estas cuatro cifras suman TODOS los años lectivos, y Admisiones ›
          Métricas cuenta uno solo. Sin decirlo, las dos pantallas dan números
          distintos en el mismo panel y quien mire deja de fiarse de las dos.
        */}
        {canSeeAdmisiones && (
          <p
            className="sm:col-span-2 lg:col-span-4"
            style={{ fontSize: 12, color: "#6B6660", margin: 0 }}
          >
            Estas cifras suman todos los años lectivos. Para verlas año por año, entra en{" "}
            <Link href="/admin/admisiones/metricas" style={{ color: "#1A2B4A", fontWeight: 500 }}>
              Admisiones › Métricas
            </Link>
            .
          </p>
        )}
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
                  const info =
                    ESTADO_INFO[s.estado as EstadoAdmision] ?? ESTADO_INFO.interesado;
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
                          background: info.colorBg,
                          fontSize: 11,
                          fontWeight: 600,
                          color: info.colorFg,
                        }}
                      >
                        {info.label}
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
                href="/admin/admisiones/metricas"
                icon={BarChart3}
                label="Ver métricas"
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
      {/*
        Atenuar la tarjeta no ocultaba el número: quien no administra
        admisiones veía igualmente cuántos aspirantes hay. Es un dato del
        colegio y no le corresponde a Comunicaciones, a Académico ni a Talento
        Humano. Sin permiso se muestra una raya, no un cero: un cero es un
        dato, y además falso.
      */}
      <span style={{ fontSize: 28, fontWeight: 700, color: enabled ? "#1A2B4A" : "#C4BFB7", lineHeight: 1 }}>
        {enabled ? value : "—"}
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
