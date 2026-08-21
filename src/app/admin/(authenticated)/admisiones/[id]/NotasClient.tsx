"use client";

import { useActionState } from "react";
import { updateNotasAction, type AdmisionActionState } from "../actions";

export function NotasClient({
  solicitudId,
  notasIniciales,
}: {
  solicitudId: string;
  notasIniciales: string | null;
}) {
  const [state, action, isPending] = useActionState<AdmisionActionState, FormData>(
    updateNotasAction,
    { error: null, ok: false }
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="solicitudId" value={solicitudId} />
      <textarea
        name="notas"
        defaultValue={notasIniciales ?? ""}
        rows={5}
        placeholder="Escribe notas internas sobre esta solicitud…"
        style={{
          width: "100%",
          border: "1px solid #E8E4DD",
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 14,
          color: "#1A2B4A",
          background: "#FAFAF8",
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          lineHeight: 1.6,
          boxSizing: "border-box",
        }}
      />
      {state?.error && (
        <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{state.error}</p>
      )}
      {state?.ok && (
        <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>Guardado ✓</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        style={{
          alignSelf: "flex-start",
          height: 34,
          paddingLeft: 16,
          paddingRight: 16,
          background: "#1A2B4A",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? "Guardando…" : "Guardar nota"}
      </button>
    </form>
  );
}
