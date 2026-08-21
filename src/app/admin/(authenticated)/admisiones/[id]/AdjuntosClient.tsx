"use client";

import { useActionState, useRef, useState } from "react";
import { Paperclip, Upload, Trash2, FileText } from "lucide-react";
import {
  uploadAdjuntoAction,
  deleteAdjuntoAction,
  type AdmisionActionState,
} from "../actions";

type Adjunto = {
  id: string;
  filename: string;
  size_bytes: number;
  mime_type: string | null;
  uploaded_at: string;
};

// 4 MB: el mismo número que el servidor y que `bodySizeLimit`. Comprobar
// aquí evita que el archivo viaje para nada.
const MAX_BYTES = 4 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdjuntosClient({
  solicitudId,
  adjuntos,
}: {
  solicitudId: string;
  adjuntos: Adjunto[];
}) {
  const [uploadState, uploadAction, uploading] = useActionState<AdmisionActionState, FormData>(
    uploadAdjuntoAction,
    { error: null, ok: false }
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [pickedName, setPickedName] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPickedName(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setClientError("El archivo supera el límite de 4 MB.");
      e.target.value = "";
      setPickedName(null);
      return;
    }
    setClientError(null);
    setPickedName(file.name);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Lista de adjuntos */}
      {adjuntos.length === 0 ? (
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0, fontStyle: "italic" }}>
          Sin archivos. Los que subas se enviarán adjuntos al postulante en el próximo cambio de estado.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {adjuntos.map((adj) => (
            <AdjuntoRow key={adj.id} adj={adj} solicitudId={solicitudId} />
          ))}
        </ul>
      )}

      {/* Form de subida */}
      <form
        ref={formRef}
        action={(fd) => {
          uploadAction(fd);
          if (formRef.current) formRef.current.reset();
          setPickedName(null);
        }}
        className="flex flex-col gap-2"
      >
        <input type="hidden" name="solicitudId" value={solicitudId} />

        <label
          className="flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer transition-colors"
          style={{
            border: "1.5px dashed #E8E4DD",
            borderRadius: 8,
            background: "#FAFAF8",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Paperclip size={14} color="#6B6660" strokeWidth={2} />
            <span
              className="truncate"
              style={{
                fontSize: 13,
                color: pickedName ? "#1A2B4A" : "#6B6660",
                fontWeight: pickedName ? 500 : 400,
              }}
            >
              {pickedName ?? "Selecciona un archivo (máx. 4 MB)"}
            </span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {(clientError || uploadState.error) && (
          <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>
            {clientError || uploadState.error}
          </p>
        )}

        <button
          type="submit"
          disabled={uploading || !pickedName}
          className="flex items-center justify-center gap-2 transition-opacity"
          style={{
            height: 34,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 500,
            cursor: uploading || !pickedName ? "not-allowed" : "pointer",
            opacity: uploading || !pickedName ? 0.5 : 1,
          }}
        >
          <Upload size={12} strokeWidth={2.5} />
          {uploading ? "Subiendo…" : "Subir adjunto"}
        </button>
      </form>
    </div>
  );
}

function AdjuntoRow({ adj, solicitudId }: { adj: Adjunto; solicitudId: string }) {
  const [delState, deleteAction, deleting] = useActionState<AdmisionActionState, FormData>(
    deleteAdjuntoAction,
    { error: null, ok: false }
  );

  return (
    <li
      className="flex items-center gap-2 px-3 py-2"
      style={{
        background: "#F4F1EB",
        borderRadius: 6,
      }}
    >
      <FileText size={14} color="#6B6660" strokeWidth={2} />
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontSize: 13, fontWeight: 500, color: "#1A2B4A", margin: 0 }}
        >
          {adj.filename}
        </p>
        <p style={{ fontSize: 11, color: "#A0AABA", margin: 0 }}>
          {formatSize(adj.size_bytes)}
        </p>
      </div>
      <form action={deleteAction}>
        <input type="hidden" name="adjuntoId" value={adj.id} />
        <input type="hidden" name="solicitudId" value={solicitudId} />
        <button
          type="submit"
          disabled={deleting}
          aria-label="Eliminar"
          title={delState.error ?? "Eliminar"}
          style={{
            width: 28,
            height: 28,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            color: "#991B1B",
            border: "none",
            borderRadius: 4,
            cursor: deleting ? "wait" : "pointer",
            opacity: deleting ? 0.5 : 1,
          }}
        >
          <Trash2 size={12} strokeWidth={2.5} />
        </button>
      </form>
    </li>
  );
}
