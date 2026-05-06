"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { deleteSolicitudAction, type AdmisionActionState } from "../actions";

export function EliminarSolicitudClient({
  solicitudId,
  numero,
}: {
  solicitudId: string;
  numero: string;
}) {
  const router = useRouter();
  const [state, action, deleting] = useActionState<AdmisionActionState, FormData>(
    async (prev, fd) => {
      const result = await deleteSolicitudAction(prev, fd);
      if (result.ok) {
        router.push("/admin/admisiones");
      }
      return result;
    },
    { error: null, ok: false }
  );
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 px-3 transition-colors hover:opacity-80"
        style={{
          height: 38,
          background: "transparent",
          color: "#991B1B",
          border: "1px solid #FECACA",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <Trash2 size={14} strokeWidth={2} />
        Eliminar solicitud
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="solicitudId" value={solicitudId} />
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-lg"
        style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
      >
        <AlertTriangle size={18} color="#991B1B" strokeWidth={2} />
        <div className="flex flex-col gap-2 flex-1">
          <p style={{ fontSize: 13, fontWeight: 600, color: "#991B1B", margin: 0 }}>
            Esta acción es irreversible
          </p>
          <p style={{ fontSize: 12, color: "#7F1D1D", margin: 0, lineHeight: 1.5 }}>
            Se eliminarán: la solicitud, su historial de cambios y todos los archivos adjuntos. Para confirmar, escribe el número{" "}
            <strong style={{ fontFamily: "monospace" }}>{numero}</strong> abajo.
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={numero}
            style={{
              height: 36,
              border: "1px solid #FECACA",
              borderRadius: 6,
              paddingLeft: 12,
              paddingRight: 12,
              fontSize: 12,
              fontFamily: "monospace",
              color: "#1A2B4A",
              background: "#FFFFFF",
              outline: "none",
            }}
          />
          {state.error && (
            <p style={{ fontSize: 11, color: "#991B1B", margin: 0 }}>{state.error}</p>
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
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={deleting || confirmText !== numero}
              style={{
                height: 32,
                paddingLeft: 14,
                paddingRight: 14,
                background: "#991B1B",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor:
                  deleting || confirmText !== numero ? "not-allowed" : "pointer",
                opacity: deleting || confirmText !== numero ? 0.5 : 1,
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
