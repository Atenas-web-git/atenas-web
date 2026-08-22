"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { guardarPeriodoAction, type CronogramaActionState } from "../actions";

const COLORES = ["gold", "red", "teal", "navy", "purple"] as const;

type Ano = { codigo: string; nombre: string };

export function NuevoPeriodoForm({ anosLectivos }: { anosLectivos: Ano[] }) {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState<CronogramaActionState, FormData>(
    guardarPeriodoAction,
    { error: null, ok: false }
  );

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 self-start px-4 rounded-md transition-opacity hover:opacity-90"
        style={{
          height: 36,
          background: "#1A2B4A",
          fontSize: 14,
          color: "#FFFFFF",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        Nuevo período
      </button>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-col gap-3 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nuevo período
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            background: "transparent",
            color: "#6B6660",
            border: "none",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_120px] gap-3">
        <Field label="Nombre" required>
          <input type="text" name="nombre" required placeholder="ej. Trimestre 1" style={inputStyle} />
        </Field>
        <Field label="Slug" hint="minúsculas-con-guiones" required>
          <input type="text" name="slug" required pattern="[a-z0-9-]+" placeholder="trimestre-1-2027" style={inputStyle} />
        </Field>
        <Field label="Año lectivo">
          <select name="ano_lectivo_codigo" defaultValue="" style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}>
            <option value="">— sin asignar —</option>
            {anosLectivos.map((a) => (
              <option key={a.codigo} value={a.codigo}>{a.nombre}</option>
            ))}
          </select>
        </Field>
        <Field label="Color">
          <select name="color" defaultValue="navy" style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}>
            {COLORES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        El orden se controla con las flechas ↑ ↓ del listado, no aquí. Los nuevos
        períodos se agregan al final automáticamente.
      </p>

      <div className="flex items-center gap-2 mt-1">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 rounded-md transition-opacity"
          style={{
            height: 34,
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
          {isPending ? "Creando…" : "Crear período"}
        </button>
        {state.error && <span style={{ fontSize: 13, color: "#991B1B" }}>{state.error}</span>}
      </div>
    </form>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ fontSize: 12, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.4 }}>{hint}</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 36,
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
