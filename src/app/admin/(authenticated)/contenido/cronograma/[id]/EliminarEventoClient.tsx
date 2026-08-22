"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { eliminarEventoAction } from "../actions";

export function EliminarEventoClient({ id, titulo }: { id: number; titulo: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pending, setPending] = useState(false);

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="flex items-center gap-2 self-start px-4 rounded-md transition-opacity hover:opacity-80"
        style={{
          height: 36,
          background: "#FFFFFF",
          color: "#991B1B",
          border: "1px solid #FECACA",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <Trash2 size={14} strokeWidth={2.5} />
        Eliminar evento
      </button>
    );
  }

  return (
    <form
      action={async (fd) => {
        setPending(true);
        await eliminarEventoAction(fd);
      }}
      className="flex flex-col gap-3 p-4"
      style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}
    >
      <input type="hidden" name="id" value={id} />
      <p style={{ fontSize: 14, color: "#991B1B", margin: 0, lineHeight: 1.5 }}>
        ¿Eliminar <strong>{titulo}</strong>? Esta acción no se puede deshacer.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity"
          style={{
            height: 34,
            background: "#991B1B",
            color: "#FFFFFF",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: pending ? "wait" : "pointer",
            opacity: pending ? 0.7 : 1,
            fontFamily: "inherit",
          }}
        >
          {pending ? "Eliminando…" : "Sí, eliminar"}
        </button>
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          disabled={pending}
          className="px-4 rounded-md transition-opacity hover:opacity-70"
          style={{
            height: 34,
            background: "transparent",
            color: "#6B6660",
            border: "1px solid #E8E4DD",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
