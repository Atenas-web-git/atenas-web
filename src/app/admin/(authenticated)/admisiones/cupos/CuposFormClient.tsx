"use client";

import { useActionState } from "react";
import { saveCuposAction, type AdmisionActionState } from "../actions";
import { NIVELES } from "../constants";

type CupoRow = {
  nivel: string;
  cupos_total: number;
  ocupados: number;
  esperando: number;
};

function getFieldKey(nivel: string): string {
  return `cupos_${nivel.replace(/[^a-zA-Z0-9]/g, "_")}`;
}

function OcupacionBar({ ocupados, total }: { ocupados: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((ocupados / total) * 100)) : 0;
  const color = pct >= 90 ? "#991B1B" : pct >= 70 ? "#9A3412" : "#065F46";

  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          flex: 1,
          height: 6,
          background: "#E8E4DD",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 11, color: "#6B6660", whiteSpace: "nowrap" }}>
        {pct}%
      </span>
    </div>
  );
}

function EstadoCupo({ ocupados, total }: { ocupados: number; total: number }) {
  const pct = total > 0 ? (ocupados / total) * 100 : 0;
  if (total === 0) return <span style={{ fontSize: 11, color: "#A0AABA" }}>Sin configurar</span>;
  if (pct >= 100) return <span style={{ fontSize: 11, fontWeight: 700, color: "#991B1B" }}>Lleno</span>;
  if (pct >= 80) return <span style={{ fontSize: 11, fontWeight: 700, color: "#9A3412" }}>Casi lleno</span>;
  return <span style={{ fontSize: 11, fontWeight: 700, color: "#065F46" }}>Disponible</span>;
}

export function CuposFormClient({
  anoLectivo,
  cupos,
}: {
  anoLectivo: string;
  cupos: CupoRow[];
}) {
  const [state, action, isPending] = useActionState<AdmisionActionState, FormData>(
    saveCuposAction,
    { error: null, ok: false }
  );

  const totalCupos = cupos.reduce((a, c) => a + c.cupos_total, 0);
  const totalOcupados = cupos.reduce((a, c) => a + c.ocupados, 0);
  const totalEsperando = cupos.reduce((a, c) => a + c.esperando, 0);
  const totalDisponibles = Math.max(0, totalCupos - totalOcupados);

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="ano_lectivo" value={anoLectivo} />

      {/* Cards de resumen */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total cupos", value: totalCupos, color: "#1A2B4A" },
          { label: "Ocupados", value: totalOcupados, color: "#1E40AF" },
          { label: "Disponibles", value: totalDisponibles, color: "#065F46" },
          { label: "En espera", value: totalEsperando, color: "#9A3412" },
        ].map((card) => (
          <div
            key={card.label}
            className="flex flex-col gap-2 p-5"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#6B6660",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {card.label}
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: card.color,
                lineHeight: 1,
              }}
            >
              {card.value}
            </span>
          </div>
        ))}
      </div>

      {/* Tabla por nivel */}
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
            <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
              {["Nivel", "Cupos totales", "Ocupados", "Disponibles", "En espera", "Ocupación", "Estado"].map((h) => (
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
            {NIVELES.map((nivel, i) => {
              const row = cupos.find((c) => c.nivel === nivel) ?? {
                nivel,
                cupos_total: 0,
                ocupados: 0,
                esperando: 0,
              };
              const disponibles = Math.max(0, row.cupos_total - row.ocupados);
              const key = getFieldKey(nivel);
              const isLast = i === NIVELES.length - 1;

              return (
                <tr
                  key={nivel}
                  style={{ borderBottom: isLast ? "none" : "1px solid #E8E4DD" }}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                      {nivel}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <input
                      type="number"
                      name={key}
                      defaultValue={row.cupos_total}
                      min={0}
                      max={999}
                      style={{
                        width: 80,
                        height: 34,
                        border: "1px solid #E8E4DD",
                        borderRadius: 6,
                        paddingLeft: 10,
                        paddingRight: 10,
                        fontSize: 13,
                        color: "#1A2B4A",
                        fontWeight: 600,
                        textAlign: "center",
                        outline: "none",
                        background: "#FAFAF8",
                      }}
                    />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, color: "#1A2B4A" }}>{row.ocupados}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, color: "#1A2B4A" }}>{disponibles}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, color: "#9A3412" }}>{row.esperando}</span>
                  </td>
                  <td style={{ padding: "14px 16px", minWidth: 120 }}>
                    <OcupacionBar ocupados={row.ocupados} total={row.cupos_total} />
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <EstadoCupo ocupados={row.ocupados} total={row.cupos_total} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Banner informativo */}
      <div
        className="flex items-start gap-3 px-5 py-4 rounded-lg"
        style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
      >
        <span style={{ fontSize: 18 }}>ℹ️</span>
        <div>
          <p style={{ fontSize: 13, color: "#92400E", margin: 0, lineHeight: 1.6 }}>
            <strong>Cupos y postulantes en espera:</strong> &ldquo;Ocupados&rdquo; cuenta las solicitudes ya matriculadas. &ldquo;En espera&rdquo; cuenta los postulantes activos en cualquier estado del pipeline (Interesado, Postulante, En evaluación, En revisión por Comité, Admitido). Cuando un nivel se llene, el equipo decide manualmente qué postulantes avanzan.
          </p>
        </div>
      </div>

      {/* Acciones */}
      {state?.error && (
        <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{state.error}</p>
      )}
      {state?.ok && (
        <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>
          Cupos guardados correctamente ✓
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          style={{
            height: 40,
            paddingLeft: 24,
            paddingRight: 24,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {isPending ? "Guardando…" : "Guardar cambios"}
        </button>
        <span style={{ fontSize: 12, color: "#6B6660" }}>
          Año lectivo {anoLectivo}
        </span>
      </div>
    </form>
  );
}
