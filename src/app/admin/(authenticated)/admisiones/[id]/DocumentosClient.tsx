"use client";

import { useActionState, useState } from "react";
import { CheckSquare, Square } from "lucide-react";
import { updateDocumentosAction, type AdmisionActionState } from "../actions";

export function DocumentosClient({
  solicitudId,
  documentosRecibidos,
  catalogo,
}: {
  solicitudId: string;
  documentosRecibidos: string[];
  catalogo: string[];
}) {
  const [state, action, isPending] = useActionState<AdmisionActionState, FormData>(
    updateDocumentosAction,
    { error: null, ok: false }
  );

  const [seleccionados, setSeleccionados] = useState<Set<string>>(
    () => new Set(documentosRecibidos)
  );

  const toggle = (doc: string) => {
    setSeleccionados((prev) => {
      const next = new Set(prev);
      if (next.has(doc)) next.delete(doc);
      else next.add(doc);
      return next;
    });
  };

  if (catalogo.length === 0) {
    return (
      <div
        className="flex flex-col gap-2 px-4 py-3 rounded-md"
        style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
      >
        <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.5 }}>
          Aún no hay documentos configurados en el catálogo. Configúralos en{" "}
          <a
            href="/admin/configuracion/documentos-admision"
            style={{ color: "#92400E", fontWeight: 600, textDecoration: "underline" }}
          >
            Configuración → Documentos de admisión
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="solicitudId" value={solicitudId} />
      {catalogo.map((doc) => {
        const checked = seleccionados.has(doc);
        return (
          <label
            key={doc}
            className="flex items-center gap-3"
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            <input
              type="checkbox"
              name={`doc_${doc}`}
              checked={checked}
              onChange={() => toggle(doc)}
              style={{
                position: "absolute",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              }}
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
