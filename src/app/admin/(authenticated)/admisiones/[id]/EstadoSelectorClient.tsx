"use client";

import { useActionState, useTransition } from "react";
import { updateEstadoAction, type AdmisionActionState } from "../actions";
import {
  ESTADO_INFO,
  PIPELINE_HAPPY_PATH,
  TRANSITIONS,
  type EstadoAdmision,
} from "../constants";

export function EstadoSelectorClient({
  solicitudId,
  estadoActual,
}: {
  solicitudId: string;
  estadoActual: EstadoAdmision;
}) {
  const [, action, isPending] = useActionState<AdmisionActionState, FormData>(
    updateEstadoAction,
    { error: null, ok: false }
  );
  const [state, setState] = useTransition();
  void state;

  const siguientes = TRANSITIONS[estadoActual] ?? [];
  const esTerminal = siguientes.length === 0;
  const infoActual = ESTADO_INFO[estadoActual];

  // Si el postulante quedó "no_admitido", lo mostramos como paso extra al
  // final del pipeline para no romper el stepper visual.
  const pipelineStates: EstadoAdmision[] = estadoActual === "no_admitido"
    ? [...PIPELINE_HAPPY_PATH, "no_admitido"]
    : PIPELINE_HAPPY_PATH;

  const currentIndex = pipelineStates.indexOf(estadoActual);

  return (
    <div className="flex flex-col gap-5">
      {/* Pipeline visual */}
      <div className="flex items-center gap-0">
        {pipelineStates.map((estado, idx) => {
          const isActive = estado === estadoActual;
          const isPast = idx < currentIndex;
          const info = ESTADO_INFO[estado];
          const isLast = idx === pipelineStates.length - 1;

          return (
            <div key={estado} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 60 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isActive
                      ? info.colorFg
                      : isPast
                      ? "#D4AF37"
                      : "#E8E4DD",
                    border: isActive ? `2px solid ${info.colorFg}` : "none",
                  }}
                >
                  {isPast ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#1A2B4A" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: isActive ? "#FFFFFF" : "#A0AABA",
                      }}
                    >
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? info.colorFg : isPast ? "#6B6660" : "#A0AABA",
                    textAlign: "center",
                    marginTop: 4,
                    lineHeight: 1.2,
                    maxWidth: 56,
                  }}
                >
                  {info.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className="flex-1 h-px"
                  style={{
                    background: isPast ? "#D4AF37" : "#E8E4DD",
                    marginBottom: 20,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Selector de siguiente estado */}
      {esTerminal ? (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg"
          style={{ background: infoActual.colorBg }}
        >
          <span
            style={{ fontSize: 13, fontWeight: 600, color: infoActual.colorFg }}
          >
            Estado final — {infoActual.label}
          </span>
        </div>
      ) : (
        <form action={action}>
          <input type="hidden" name="solicitudId" value={solicitudId} />
          <div className="flex items-center gap-3">
            <select
              name="nuevoEstado"
              defaultValue=""
              style={{
                flex: 1,
                height: 40,
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                background: "#FFFFFF",
                fontSize: 13,
                color: "#1A2B4A",
                paddingLeft: 12,
                paddingRight: 32,
                outline: "none",
              }}
            >
              <option value="" disabled>
                Mover a…
              </option>
              {siguientes.map((s) => (
                <option key={s} value={s}>
                  {ESTADO_INFO[s].label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isPending}
              style={{
                height: 40,
                paddingLeft: 20,
                paddingRight: 20,
                background: "#1A2B4A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: isPending ? "wait" : "pointer",
                opacity: isPending ? 0.7 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {isPending ? "Guardando…" : "Aplicar cambio"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
