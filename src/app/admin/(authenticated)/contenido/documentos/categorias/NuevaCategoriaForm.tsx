"use client";

import { useActionState, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { guardarCategoriaAction, type DocumentoActionState } from "../actions";

const COLORES = ["gold", "red", "teal", "navy", "purple"] as const;

export function NuevaCategoriaForm() {
  const [open, setOpen] = useState(false);
  const [state, action, isPending] = useActionState<DocumentoActionState, FormData>(
    guardarCategoriaAction,
    { error: null, ok: false }
  );

  // Cerrar el form automáticamente cuando se guarda con éxito
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
          fontSize: 13,
          color: "#FFFFFF",
          fontWeight: 600,
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <Plus size={14} strokeWidth={2.5} />
        Nueva categoría
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
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nueva categoría
        </h3>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            background: "transparent",
            color: "#6B6660",
            border: "none",
            fontSize: 12,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_180px_120px_100px] gap-3">
        <Field label="Nombre" required>
          <input type="text" name="nombre" required placeholder="ej. Reglamentos" style={inputStyle} />
        </Field>
        <Field label="Slug" hint="minúsculas-con-guiones" required>
          <input type="text" name="slug" required pattern="[a-z0-9-]+" placeholder="reglamentos" style={inputStyle} />
        </Field>
        <Field label="Icono Lucide" hint='ej. shield, file-text, scroll-text'>
          <input type="text" name="icono" placeholder="shield" style={inputStyle} />
        </Field>
        <Field label="Color">
          <select name="color" defaultValue="gold" style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}>
            {COLORES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Orden">
          <input type="number" name="orden" defaultValue={100} style={inputStyle} />
        </Field>
      </div>

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
            fontSize: 12,
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          {isPending ? "Creando…" : "Crear categoría"}
        </button>
        {state.error && <span style={{ fontSize: 12, color: "#991B1B" }}>{state.error}</span>}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.4 }}>{hint}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 36,
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
