"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { createDocumentoAction, type DocActionState } from "./actions";

export function CrearDocumentoForm() {
  const [state, action, isPending] = useActionState<DocActionState, FormData>(
    createDocumentoAction,
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
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
        Agregar nuevo documento
      </h2>

      <div className="flex items-end gap-3 flex-wrap">
        <label className="flex flex-col gap-1.5 flex-1" style={{ minWidth: 280 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#6B6660" }}>
            Nombre del documento
          </span>
          <input
            type="text"
            name="nombre"
            placeholder="ej. Certificado médico"
            required
            maxLength={120}
            style={{
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
            }}
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity"
          style={{
            height: 38,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          {isPending ? "Agregando…" : "Agregar"}
        </button>
      </div>

      {state.error && (
        <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
      )}
    </form>
  );
}
