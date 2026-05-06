"use client";

import { useActionState } from "react";
import { updateDocumentosAction, type AdmisionActionState } from "../actions";
import { DOCUMENTOS_LISTA } from "../constants";
import { CheckSquare, Square } from "lucide-react";

export function DocumentosClient({
  solicitudId,
  documentosRecibidos,
}: {
  solicitudId: string;
  documentosRecibidos: string[];
}) {
  const [state, action, isPending] = useActionState<AdmisionActionState, FormData>(
    updateDocumentosAction,
    { error: null, ok: false }
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="solicitudId" value={solicitudId} />
      {DOCUMENTOS_LISTA.map((doc) => {
        const checked = documentosRecibidos.includes(doc);
        return (
          <label
            key={doc}
            className="flex items-center gap-3 cursor-pointer"
            style={{ userSelect: "none" }}
          >
            <input
              type="checkbox"
              name={`doc_${doc}`}
              defaultChecked={checked}
              style={{ display: "none" }}
            />
            <span
              className="flex-shrink-0"
              style={{ color: checked ? "#065F46" : "#A0AABA" }}
            >
              {checked ? (
                <CheckSquare size={18} strokeWidth={2} />
              ) : (
                <Square size={18} strokeWidth={2} />
              )}
            </span>
            <span
              style={{
                fontSize: 13,
                color: checked ? "#1A2B4A" : "#6B6660",
                fontWeight: checked ? 500 : 400,
                textDecoration: checked ? "none" : "none",
              }}
            >
              {doc}
            </span>
          </label>
        );
      })}
      {state?.error && (
        <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
      )}
      {state?.ok && (
        <p style={{ fontSize: 12, color: "#065F46", margin: 0 }}>Guardado ✓</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        style={{
          alignSelf: "flex-start",
          marginTop: 4,
          height: 34,
          paddingLeft: 16,
          paddingRight: 16,
          background: "#1A2B4A",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: isPending ? "wait" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? "Guardando…" : "Guardar documentos"}
      </button>
    </form>
  );
}
