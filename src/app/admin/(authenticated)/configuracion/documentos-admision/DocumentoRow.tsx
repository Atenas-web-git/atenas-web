"use client";

import { useActionState, useState } from "react";
import { Save, Trash2, X, Edit2 } from "lucide-react";
import {
  updateDocumentoAction,
  deleteDocumentoAction,
  type DocActionState,
} from "./actions";

type Documento = {
  id: string;
  nombre: string;
  orden: number;
  activo: boolean;
};

export function DocumentoRow({ doc }: { doc: Documento }) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <EditMode doc={doc} onCancel={() => setEditing(false)} />
  ) : (
    <ViewMode doc={doc} onEdit={() => setEditing(true)} />
  );
}

function ViewMode({
  doc,
  onEdit,
}: {
  doc: Documento;
  onEdit: () => void;
}) {
  const [delState, deleteAction, deleting] = useActionState<DocActionState, FormData>(
    deleteDocumentoAction,
    { error: null, ok: false }
  );
  const [confirming, setConfirming] = useState(false);

  return (
    <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
      <td style={cellStyle}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#A0AABA" }}>
          {doc.orden}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize: 14, color: "#1A2B4A", fontWeight: 500 }}>
          {doc.nombre}
        </span>
      </td>
      <td style={cellStyle}>
        <span
          className="inline-flex items-center px-2.5 rounded-full"
          style={{
            height: 22,
            background: doc.activo ? "#D1FAE5" : "#FEE2E2",
            fontSize: 12,
            fontWeight: 600,
            color: doc.activo ? "#065F46" : "#991B1B",
          }}
        >
          {doc.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td style={{ ...cellStyle, textAlign: "right" }}>
        <div className="flex items-center gap-2 justify-end">
          {confirming ? (
            <form action={deleteAction} className="flex items-center gap-2">
              <input type="hidden" name="id" value={doc.id} />
              <span style={{ fontSize: 12, color: "#991B1B", fontWeight: 600 }}>
                ¿Eliminar?
              </span>
              <button
                type="submit"
                disabled={deleting}
                title="Confirmar eliminación"
                style={{
                  ...iconButton,
                  background: "#991B1B",
                  color: "#FFFFFF",
                }}
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                style={{ ...iconButton, background: "transparent", color: "#6B6660" }}
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </form>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit}
                style={{
                  ...iconButton,
                  background: "transparent",
                  border: "1px solid #E8E4DD",
                  color: "#1A2B4A",
                }}
                aria-label="Editar"
              >
                <Edit2 size={12} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                style={{
                  ...iconButton,
                  background: "transparent",
                  border: "1px solid #E8E4DD",
                  color: "#991B1B",
                }}
                aria-label="Eliminar"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>
        {delState.error && (
          <p style={{ fontSize: 12, color: "#991B1B", margin: "4px 0 0", textAlign: "right" }}>
            {delState.error}
          </p>
        )}
      </td>
    </tr>
  );
}

function EditMode({
  doc,
  onCancel,
}: {
  doc: Documento;
  onCancel: () => void;
}) {
  const [state, action, isPending] = useActionState<DocActionState, FormData>(
    updateDocumentoAction,
    { error: null, ok: false }
  );

  return (
    <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
      <td colSpan={4} style={{ padding: 12 }}>
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={doc.id} />
          <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_120px] gap-2">
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Orden</span>
              <input
                type="number"
                name="orden"
                defaultValue={doc.orden}
                min={0}
                style={editInput}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Nombre</span>
              <input
                type="text"
                name="nombre"
                defaultValue={doc.nombre}
                required
                maxLength={120}
                style={editInput}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Activo</span>
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  height: 32,
                  paddingLeft: 10,
                  paddingRight: 10,
                  border: "1px solid #E8E4DD",
                  borderRadius: 6,
                  background: "#FFFFFF",
                }}
              >
                <input
                  type="checkbox"
                  name="activo"
                  defaultChecked={doc.activo}
                  style={{ accentColor: "#1A2B4A" }}
                />
                <span style={{ fontSize: 13, color: "#1A2B4A" }}>Visible</span>
              </label>
            </div>
          </div>
          {state.error && (
            <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
          )}
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onCancel}
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
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5"
              style={{
                height: 32,
                paddingLeft: 14,
                paddingRight: 14,
                background: "#1A2B4A",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: isPending ? "wait" : "pointer",
                opacity: isPending ? 0.7 : 1,
              }}
            >
              <Save size={12} strokeWidth={2.5} />
              {isPending ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

const cellStyle: React.CSSProperties = {
  padding: "12px 16px",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const editInput: React.CSSProperties = {
  height: 32,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 8,
  paddingRight: 8,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FFFFFF",
  outline: "none",
  fontFamily: "inherit",
};

const iconButton: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
};
