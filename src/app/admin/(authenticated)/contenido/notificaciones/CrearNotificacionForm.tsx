"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { crearNotificacionAction, type NotifActionState } from "./actions";
import { TIPO_INFO, type TipoNotificacion } from "./constants";

const TIPOS: TipoNotificacion[] = ["popup", "dropdown", "banner_top"];

export function CrearNotificacionForm() {
  const [state, action, isPending] = useActionState<NotifActionState, FormData>(
    crearNotificacionAction,
    { error: null, ok: false }
  );
  const [tipo, setTipo] = useState<TipoNotificacion>("dropdown");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
      }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
        Crear notificación nueva
      </h2>
      <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
        Define un título y el tipo. Después podrás editar todo el contenido, programar fechas y agregar imagen / CTA.
      </p>

      <div className="flex flex-col gap-2">
        <label htmlFor="titulo-input" style={fieldLabel}>
          Título
        </label>
        <input
          id="titulo-input"
          type="text"
          name="titulo"
          required
          placeholder="ej. Inicio del proceso de matrículas 2026-2027"
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span style={fieldLabel}>Tipo de notificación</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TIPOS.map((t) => {
            const info = TIPO_INFO[t];
            const selected = tipo === t;
            return (
              <label
                key={t}
                className="flex flex-col gap-1.5 p-3 transition-all cursor-pointer"
                style={{
                  border: selected ? "2px solid #1A2B4A" : "1px solid #E8E4DD",
                  borderRadius: 8,
                  background: selected ? info.bg : "#FAFAF8",
                }}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={t}
                  checked={selected}
                  onChange={() => setTipo(t)}
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 1,
                    height: 1,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: selected ? info.color : "#1A2B4A",
                  }}
                >
                  {info.label}
                </span>
                <span style={{ fontSize: 10, color: "#6B6660", lineHeight: 1.4 }}>
                  {info.descripcion}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {state.error && (
        <p
          className="px-3 py-2 rounded-md"
          style={{
            background: "#FEE2E2",
            border: "1px solid #FECACA",
            fontSize: 12,
            color: "#991B1B",
            margin: 0,
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 self-start px-4 rounded-md transition-opacity"
        style={{
          height: 38,
          background: "#1A2B4A",
          color: "#FFFFFF",
          border: "none",
          fontSize: 13,
          fontWeight: 600,
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.7 : 1,
          fontFamily: "inherit",
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        {isPending ? "Creando…" : "Crear notificación"}
      </button>
    </form>
  );
}

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
};
