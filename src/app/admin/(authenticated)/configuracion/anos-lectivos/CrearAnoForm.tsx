"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createAnoLectivoAction, type AnoLectivoActionState } from "./actions";

export function CrearAnoForm() {
  const [state, action, isPending] = useActionState<AnoLectivoActionState, FormData>(
    createAnoLectivoAction,
    { error: null, ok: false }
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-4 p-6"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
      }}
    >
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#1A2B4A",
          margin: 0,
        }}
      >
        Crear nuevo año lectivo
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Field label="Código" hint="Formato: YYYY-YYYY">
          <input
            type="text"
            name="codigo"
            placeholder="2028-2029"
            pattern="\d{4}-\d{4}"
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Nombre">
          <input
            type="text"
            name="nombre"
            placeholder="Año Lectivo 2028-2029"
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Fecha de inicio (opcional)">
          <input type="date" name="fecha_inicio" style={inputStyle} />
        </Field>
        <Field label="Fecha de fin (opcional)">
          <input type="date" name="fecha_fin" style={inputStyle} />
        </Field>
      </div>

      {state.error && (
        <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{state.error}</p>
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
          fontSize: 14,
          fontWeight: 600,
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        {isPending ? "Creando…" : "Crear año lectivo"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6660" }}>{label}</span>
      {children}
      {hint && (
        <span style={{ fontSize: 11, color: "#A0AABA" }}>{hint}</span>
      )}
    </label>
  );
}
