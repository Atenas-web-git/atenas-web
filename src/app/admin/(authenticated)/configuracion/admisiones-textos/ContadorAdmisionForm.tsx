"use client";

import { useActionState } from "react";
import { Save, Hash } from "lucide-react";
import { guardarContadorAction, type ContadorActionState } from "./actions";

export function ContadorAdmisionForm({
  ano,
  siguiente,
}: {
  ano: string;
  siguiente: number;
}) {
  const [state, action, isPending] = useActionState<
    ContadorActionState,
    FormData
  >(guardarContadorAction, { error: null, ok: false });

  const ejemplo = `ADM${ano}-${String(siguiente).padStart(3, "0")}`;

  return (
    <form
      action={action}
      className="flex flex-col gap-4 p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Numeración de solicitudes
        </h2>
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
          Cada solicitud recibe un código secuencial con formato{" "}
          <code style={codeStyle}>ADM&lt;año&gt;-&lt;n&gt;</code> (p.ej.{" "}
          <code style={codeStyle}>ADM026-278</code>). Si el colegio ya entregó
          números fuera del sistema, ajusta acá el próximo número a usar.
        </p>
      </div>

      <input type="hidden" name="ano" value={ano} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <Field label="Año (3 dígitos)">
          <input
            type="text"
            value={ano}
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#6B6660" }}
          />
        </Field>

        <Field
          label="Próximo número a entregar"
          hint="La siguiente postulación que se registre usará este número."
        >
          <input
            type="number"
            name="siguiente"
            defaultValue={siguiente}
            min={1}
            max={999}
            style={inputStyle}
          />
        </Field>

        <Field label="Vista previa">
          <div
            className="flex items-center gap-2 px-3"
            style={{
              ...inputStyle,
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              color: "#1E40AF",
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            <Hash size={14} strokeWidth={2.5} />
            {ejemplo}
          </div>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3 flex-wrap">
        {state.error && <span style={{ fontSize: 13, color: "#991B1B" }}>{state.error}</span>}
        {state.ok && <span style={{ fontSize: 13, color: "#065F46" }}>Guardado ✓</span>}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity"
          style={{
            height: 36,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <Save size={14} strokeWidth={2.5} />
          {isPending ? "Guardando…" : "Actualizar contador"}
        </button>
      </div>
    </form>
  );
}

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
    <div className="flex flex-col gap-1.5">
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
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
  width: "100%",
  display: "flex",
  alignItems: "center",
};

const codeStyle: React.CSSProperties = {
  background: "#F4F1EB",
  borderRadius: 4,
  padding: "1px 6px",
  fontSize: 12,
  fontFamily: "monospace",
  color: "#1A2B4A",
};
