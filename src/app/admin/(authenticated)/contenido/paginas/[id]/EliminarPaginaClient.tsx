"use client";

import { useActionState, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { eliminarPaginaAction, type PaginaActionState } from "../actions";

export function EliminarPaginaClient({
  paginaId,
  titulo,
}: {
  paginaId: string;
  titulo: string;
}) {
  const [state, action, deleting] = useActionState<PaginaActionState, FormData>(
    eliminarPaginaAction,
    { error: null, ok: false }
  );
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 self-start px-3 transition-colors hover:opacity-80"
        style={{
          height: 36,
          background: "transparent",
          color: "#991B1B",
          border: "1px solid #FECACA",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <Trash2 size={14} strokeWidth={2} />
        Eliminar página
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={paginaId} />
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-lg"
        style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
      >
        <AlertTriangle size={18} color="#991B1B" strokeWidth={2} />
        <div className="flex flex-col gap-2 flex-1">
          <p style={{ fontSize: 14, fontWeight: 600, color: "#991B1B", margin: 0 }}>
            Esta acción es irreversible
          </p>
          <p style={{ fontSize: 13, color: "#7F1D1D", margin: 0, lineHeight: 1.5 }}>
            La ruta pública dejará de funcionar. Para confirmar, escribe el título{" "}
            <strong>{titulo}</strong> abajo.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={titulo}
            style={{
              height: 36,
              border: "1px solid #FECACA",
              borderRadius: 6,
              paddingLeft: 12,
              paddingRight: 12,
              fontSize: 13,
              color: "#1A2B4A",
              background: "#FFFFFF",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          {state.error && (
            <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setConfirmText("");
              }}
              style={{
                height: 32,
                paddingLeft: 14,
                paddingRight: 14,
                background: "transparent",
                color: "#6B6660",
                border: "1px solid #E8E4DD",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={deleting || confirmText !== titulo}
              style={{
                height: 32,
                paddingLeft: 14,
                paddingRight: 14,
                background: "#991B1B",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: deleting || confirmText !== titulo ? "not-allowed" : "pointer",
                opacity: deleting || confirmText !== titulo ? 0.5 : 1,
                fontFamily: "inherit",
              }}
            >
              {deleting ? "Eliminando…" : "Sí, eliminar definitivamente"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
