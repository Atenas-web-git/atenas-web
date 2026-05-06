import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, ChevronRight, Check, X } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { AdmisionesSubNav } from "../SubNav";

const ESTADOS = [
  { key: "revisando", label: "En revisión", description: "Cuando empiezas a revisar la solicitud", color: "#1E40AF" },
  { key: "entrevista_agendada", label: "Entrevista agendada", description: "Cuando agendas la entrevista personal", color: "#4C1D95" },
  { key: "lista_espera", label: "Lista de espera", description: "Cuando los cupos están llenos", color: "#9A3412" },
  { key: "aceptado", label: "Aceptada", description: "Cuando aceptas al postulante", color: "#065F46" },
  { key: "matriculado", label: "Matriculada", description: "Cuando se completa la matrícula", color: "#1A2B4A" },
  { key: "rechazado", label: "Rechazada", description: "Cuando rechazas la solicitud", color: "#991B1B" },
];

function formatDate(iso: string | null): string {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CorreosListPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  const { data: plantillas } = await supabase
    .from("plantillas_correo_admision")
    .select("estado, asunto, activo, updated_at");

  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #E8E4DD",
    borderRadius: 12,
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Plantillas de correo
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Configura el correo automático que se envía al postulante en cada etapa del pipeline.
        </p>
      </div>

      <div
        className="flex items-start gap-3 px-5 py-4 rounded-lg"
        style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
      >
        <Mail size={18} color="#1E40AF" strokeWidth={2} />
        <div>
          <p style={{ fontSize: 13, color: "#1E40AF", margin: 0, lineHeight: 1.6 }}>
            <strong>Variables disponibles en cada plantilla:</strong>{" "}
            <code style={codeStyle}>{"{{numero}}"}</code>{" · "}
            <code style={codeStyle}>{"{{est_nombres}}"}</code>{" · "}
            <code style={codeStyle}>{"{{est_apellidos}}"}</code>{" · "}
            <code style={codeStyle}>{"{{est_nivel}}"}</code>{" · "}
            <code style={codeStyle}>{"{{rep_nombres}}"}</code>{" · "}
            <code style={codeStyle}>{"{{url_seguimiento}}"}</code>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ESTADOS.map((s) => {
          const plantilla = (plantillas ?? []).find((p) => p.estado === s.key);
          const existe = !!plantilla;
          const activo = plantilla?.activo ?? false;

          return (
            <Link
              key={s.key}
              href={`/admin/admisiones/correos/${s.key}`}
              className="flex items-center gap-4 p-5 transition-all hover:shadow-sm"
              style={{ ...cardStyle, textDecoration: "none" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 44,
                  height: 44,
                  background: `${s.color}15`,
                  borderRadius: 10,
                }}
              >
                <Mail size={18} color={s.color} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                    {s.label}
                  </h3>
                  {existe && (
                    <span
                      className="inline-flex items-center gap-1 px-2 rounded-full"
                      style={{
                        height: 20,
                        background: activo ? "#D1FAE5" : "#FEE2E2",
                        fontSize: 10,
                        fontWeight: 700,
                        color: activo ? "#065F46" : "#991B1B",
                      }}
                    >
                      {activo ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
                      {activo ? "Activa" : "Pausada"}
                    </span>
                  )}
                  {!existe && (
                    <span
                      className="inline-flex items-center px-2 rounded-full"
                      style={{
                        height: 20,
                        background: "#F4F1EB",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#6B6660",
                      }}
                    >
                      Sin configurar
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "#6B6660",
                    margin: "4px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {s.description}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "#A0AABA",
                    margin: "6px 0 0",
                  }}
                >
                  Última edición: {formatDate(plantilla?.updated_at ?? null)}
                </p>
              </div>
              <ChevronRight size={16} color="#A0AABA" strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const codeStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #BFDBFE",
  borderRadius: 4,
  padding: "1px 6px",
  fontSize: 11,
  fontFamily: "monospace",
  color: "#1E40AF",
};
