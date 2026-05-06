"use client";

import { useActionState, useState } from "react";
import { Save, Trash2, X, Edit2 } from "lucide-react";
import {
  updateAnoLectivoAction,
  deleteAnoLectivoAction,
  type AnoLectivoActionState,
} from "./actions";

type AnoLectivo = {
  codigo: string;
  nombre: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activo: boolean;
  cupos_count?: number;
  solic_count?: number;
};

export function AnoLectivoRow({ ano }: { ano: AnoLectivo }) {
  const [editing, setEditing] = useState(false);

  return editing ? (
    <EditMode ano={ano} onCancel={() => setEditing(false)} />
  ) : (
    <ViewMode ano={ano} onEdit={() => setEditing(true)} />
  );
}

function ViewMode({
  ano,
  onEdit,
}: {
  ano: AnoLectivo;
  onEdit: () => void;
}) {
  const [delState, deleteAction, deleting] = useActionState<AnoLectivoActionState, FormData>(
    deleteAnoLectivoAction,
    { error: null, ok: false }
  );
  const [confirming, setConfirming] = useState(false);
  const tieneVinculos = (ano.cupos_count ?? 0) > 0 || (ano.solic_count ?? 0) > 0;

  return (
    <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
      <td style={cellStyle}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", fontFamily: "monospace" }}>
          {ano.codigo}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize: 13, color: "#1A2B4A" }}>{ano.nombre}</span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize: 12, color: "#6B6660" }}>
          {ano.fecha_inicio ?? "—"}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize: 12, color: "#6B6660" }}>
          {ano.fecha_fin ?? "—"}
        </span>
      </td>
      <td style={cellStyle}>
        <span
          className="inline-flex items-center px-2.5 rounded-full"
          style={{
            height: 22,
            background: ano.activo ? "#D1FAE5" : "#FEE2E2",
            fontSize: 11,
            fontWeight: 600,
            color: ano.activo ? "#065F46" : "#991B1B",
          }}
        >
          {ano.activo ? "Activo" : "Inactivo"}
        </span>
      </td>
      <td style={cellStyle}>
        <span style={{ fontSize: 11, color: "#6B6660" }}>
          {ano.cupos_count ?? 0} cupos · {ano.solic_count ?? 0} solicitudes
        </span>
      </td>
      <td style={{ ...cellStyle, textAlign: "right" }}>
        <div className="flex items-center gap-2 justify-end">
          {confirming ? (
            <form action={deleteAction} className="flex items-center gap-2">
              <input type="hidden" name="codigo" value={ano.codigo} />
              <span style={{ fontSize: 11, color: "#991B1B", fontWeight: 600 }}>
                ¿Eliminar?
              </span>
              <button
                type="submit"
                disabled={deleting || tieneVinculos}
                title={tieneVinculos ? "Tiene cupos o solicitudes vinculadas" : "Confirmar"}
                style={{
                  ...iconButton,
                  background: tieneVinculos ? "#F4F1EB" : "#991B1B",
                  color: "#FFFFFF",
                  cursor: tieneVinculos ? "not-allowed" : "pointer",
                  opacity: tieneVinculos ? 0.5 : 1,
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
          <p style={{ fontSize: 11, color: "#991B1B", margin: "4px 0 0", textAlign: "right" }}>
            {delState.error}
          </p>
        )}
      </td>
    </tr>
  );
}

function EditMode({
  ano,
  onCancel,
}: {
  ano: AnoLectivo;
  onCancel: () => void;
}) {
  const [state, action, isPending] = useActionState<AnoLectivoActionState, FormData>(
    updateAnoLectivoAction,
    { error: null, ok: false }
  );

  return (
    <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
      <td colSpan={7} style={{ padding: 12 }}>
        <form action={action} className="flex flex-col gap-3">
          <input type="hidden" name="codigo" value={ano.codigo} />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Código</span>
              <input
                type="text"
                value={ano.codigo}
                disabled
                style={{ ...editInput, background: "#F4F1EB", color: "#A0AABA" }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Nombre</span>
              <input
                type="text"
                name="nombre"
                defaultValue={ano.nombre}
                required
                style={editInput}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Fecha inicio</span>
              <input
                type="date"
                name="fecha_inicio"
                defaultValue={ano.fecha_inicio ?? ""}
                style={editInput}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span style={labelStyle}>Fecha fin</span>
              <input
                type="date"
                name="fecha_fin"
                defaultValue={ano.fecha_fin ?? ""}
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
                  defaultChecked={ano.activo}
                  style={{ accentColor: "#1A2B4A" }}
                />
                <span style={{ fontSize: 12, color: "#1A2B4A" }}>Activo</span>
              </label>
            </div>
          </div>
          {state.error && (
            <p style={{ fontSize: 11, color: "#991B1B", margin: 0 }}>{state.error}</p>
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
                fontSize: 12,
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
                fontSize: 12,
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
  fontSize: 13,
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
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
  fontSize: 12,
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
