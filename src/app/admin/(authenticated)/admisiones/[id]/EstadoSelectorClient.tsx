"use client";

import { useActionState } from "react";
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
  /*
    El primer elemento se descartaba con una coma: `const [, action, ...]`. Como
    la acción nunca devolvía errores —no validaba nada—, nadie lo notó. Desde
    que valida el salto contra TRANSITIONS sí los devuelve, y sin esto el
    servidor rechazaba el cambio y la pantalla se quedaba igual, sin decir nada:
    secretaría pulsa «Aplicar cambio» y no pasa absolutamente nada.

    Medido el 2026-09-02: el POST respondía
    «No se puede pasar de "Postulante" a "Interesado"…» y ese texto no llegaba
    a ninguna parte de la interfaz.
  */
  const [estadoDeLaAccion, action, isPending] = useActionState<
    AdmisionActionState,
    FormData
  >(updateEstadoAction, { error: null, ok: false });

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
      {/*
        Pipeline visual.

        `overflow-x-auto` y anchos mínimos de verdad, porque antes los rótulos se
        pisaban unos a otros. El bloque de cada paso pedía `minWidth: 60`, pero su
        contenedor llevaba `flex-1 min-w-0`, que le permite encogerse hasta cero:
        medido el 2026-08-21 a 424px de ancho útil, los pasos quedaban a 44px con
        rótulos de 56px, así que «Postulación completa» se montaba sobre «En
        evaluación». Se veía en cualquier ventana por debajo de ~1.100px.

        Ahora el conjunto no baja de su ancho mínimo y, cuando no cabe, se
        desplaza en horizontal. Un pipeline que se arrastra se lee; uno que se
        solapa, no.
      */}
      <div
        className="flex items-center gap-0"
        // En línea y no con la clase de Tailwind: el resto del panel está escrito
        // así, y la clase no llegó a generarse en la primera prueba.
        style={{ overflowX: "auto", paddingBottom: 2 }}
        data-pipeline-admisiones
      >
        {pipelineStates.map((estado, idx) => {
          const isActive = estado === estadoActual;
          const isPast = idx < currentIndex;
          const info = ESTADO_INFO[estado];
          const isLast = idx === pipelineStates.length - 1;

          return (
            // Sin `min-w-0`: es justo lo que dejaba que el paso se encogiera por
            // debajo de su mínimo y desbordara sobre el vecino.
            <div key={estado} className="flex items-center flex-1" style={{ minWidth: 78 }}>
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: 74 }}>
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: isActive
                      ? info.colorFg
                      : isPast
                      ? "#9e1915"
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
                        fontSize: 12,
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
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? info.colorFg : isPast ? "#6B6660" : "#A0AABA",
                    textAlign: "center",
                    marginTop: 4,
                    lineHeight: 1.25,
                    // Al ancho de su columna, ni un píxel más. Antes eran 56px
                    // dentro de un bloque que acababa midiendo 44: el rótulo
                    // sobresalía por los dos lados.
                    maxWidth: "100%",
                    // «Postulación» no cabe entera en 74px. Sin esto, la palabra
                    // se sale de la caja en vez de partirse.
                    overflowWrap: "anywhere",
                  }}
                >
                  {info.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className="flex-1 h-px"
                  style={{
                    background: isPast ? "#9e1915" : "#E8E4DD",
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
            style={{ fontSize: 14, fontWeight: 600, color: infoActual.colorFg }}
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
                fontSize: 14,
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
                fontSize: 14,
                fontWeight: 600,
                cursor: isPending ? "wait" : "pointer",
                opacity: isPending ? 0.7 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {isPending ? "Guardando…" : "Aplicar cambio"}
            </button>
          </div>

          {/*
            Lo que el servidor conteste, se lee. Sin esto, un rechazo dejaba la
            pantalla exactamente igual que antes de pulsar: el peor mensaje
            posible es ninguno, porque el editor repite la acción pensando que
            no llegó a pulsar bien.
          */}
          {estadoDeLaAccion.error && (
            <p
              role="alert"
              style={{
                marginTop: 12,
                marginBottom: 0,
                padding: "10px 14px",
                background: "#FEE2E2",
                border: "1px solid #FCA5A5",
                borderRadius: 8,
                fontSize: 13,
                lineHeight: 1.5,
                color: "#991B1B",
              }}
            >
              {estadoDeLaAccion.error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
