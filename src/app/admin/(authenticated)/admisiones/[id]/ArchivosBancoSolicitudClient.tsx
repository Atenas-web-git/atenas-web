"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Plus,
  X,
  FileText,
  FileImage,
  File as FileIcon,
  Paperclip,
} from "lucide-react";
import {
  vincularArchivoBancoASolicitudAction,
  desvincularArchivoBancoDeSolicitudAction,
} from "../actions";

type Archivo = {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo_mime: string | null;
  tamano_bytes: number | null;
  categoria: string | null;
  archivo_url: string;
  activo: boolean;
};

function fileIcon(mime: string | null) {
  if (!mime) return <FileIcon size={14} color="#6B6660" />;
  if (mime.startsWith("image/")) return <FileImage size={14} color="#1E40AF" />;
  if (mime === "application/pdf") return <FileText size={14} color="#9e1915" />;
  return <FileIcon size={14} color="#6B6660" />;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ArchivosBancoSolicitudClient({
  solicitudId,
  archivosBanco,
  vinculadosIds,
}: {
  solicitudId: string;
  archivosBanco: Archivo[];
  vinculadosIds: string[];
}) {
  const [vinculados, setVinculados] = useState<Set<string>>(new Set(vinculadosIds));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const vinculadosList = archivosBanco.filter((a) => vinculados.has(a.id));
  const disponiblesList = archivosBanco.filter((a) => !vinculados.has(a.id));

  const toggle = (archivoId: string, vincular: boolean) => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("solicitudId", solicitudId);
      fd.append("archivo_id", archivoId);
      const res = vincular
        ? await vincularArchivoBancoASolicitudAction({ error: null, ok: false }, fd)
        : await desvincularArchivoBancoDeSolicitudAction({ error: null, ok: false }, fd);
      if (res.error) {
        setError(res.error);
        return;
      }
      setVinculados((prev) => {
        const next = new Set(prev);
        if (vincular) next.add(archivoId);
        else next.delete(archivoId);
        return next;
      });
    });
  };

  if (archivosBanco.length === 0) {
    return (
      <div
        className="px-3 py-3"
        style={{
          background: "#FEF3C7",
          border: "1px solid #FDE68A",
          borderRadius: 6,
        }}
      >
        <p style={{ fontSize: 12, color: "#92400E", margin: 0 }}>
          Aún no hay archivos en el banco. Sube los primeros desde{" "}
          <Link
            href="/admin/admisiones/archivos-banco"
            style={{ color: "#92400E", fontWeight: 600 }}
          >
            el banco de archivos ↗
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
        <Paperclip size={11} strokeWidth={2.5} className="inline-block mr-1 -mt-0.5" />
        Selecciona archivos del banco para anexar al <strong>próximo correo</strong> de
        esta solicitud (además de los archivos automáticos vinculados a la plantilla).
        Útil para documentos personalizados (carta de aceptación, instructivos por nivel,
        etc.).
      </p>

      {error && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Vinculados */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            margin: "4px 0 6px",
          }}
        >
          Vinculados a esta solicitud ({vinculadosList.length})
        </p>
        {vinculadosList.length === 0 ? (
          <p
            className="px-3 py-2 text-center"
            style={{
              fontSize: 11,
              color: "#6B6660",
              background: "#FAFAF8",
              border: "1px dashed #E8E4DD",
              borderRadius: 6,
              margin: 0,
            }}
          >
            Sin archivos del banco para esta solicitud. Solo se adjuntarán los archivos
            automáticos de cada plantilla.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {vinculadosList.map((a) => (
              <FileItem
                key={a.id}
                archivo={a}
                onAction={() => toggle(a.id, false)}
                actionLabel="Quitar"
                actionVariant="danger"
                pending={pending}
                bg="#F0FDF4"
                border="#BBF7D0"
              />
            ))}
          </ul>
        )}
      </div>

      {/* Disponibles */}
      {disponiblesList.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6B6660",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: "4px 0 6px",
            }}
          >
            Disponibles en el banco ({disponiblesList.length})
          </p>
          <ul className="flex flex-col gap-1.5">
            {disponiblesList.map((a) => (
              <FileItem
                key={a.id}
                archivo={a}
                onAction={() => toggle(a.id, true)}
                actionLabel="Vincular"
                actionVariant="primary"
                pending={pending}
                bg="#FAFAF8"
                border="#E8E4DD"
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FileItem({
  archivo,
  onAction,
  actionLabel,
  actionVariant,
  pending,
  bg,
  border,
}: {
  archivo: Archivo;
  onAction: () => void;
  actionLabel: string;
  actionVariant: "primary" | "danger";
  pending: boolean;
  bg: string;
  border: string;
}) {
  return (
    <li
      className="flex items-center gap-2 px-3 py-2"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 6,
      }}
    >
      {fileIcon(archivo.tipo_mime)}
      <div className="flex-1 min-w-0">
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
          {archivo.nombre}
        </div>
        {(archivo.categoria || archivo.tamano_bytes) && (
          <div style={{ fontSize: 10, color: "#6B6660", marginTop: 1 }}>
            {archivo.categoria && <span>{archivo.categoria}</span>}
            {archivo.categoria && archivo.tamano_bytes ? " · " : ""}
            {archivo.tamano_bytes && <span>{formatBytes(archivo.tamano_bytes)}</span>}
          </div>
        )}
      </div>
      <a
        href={archivo.archivo_url}
        target="_blank"
        rel="noopener noreferrer"
        title="Ver archivo"
        className="flex items-center justify-center transition-opacity hover:opacity-70"
        style={{
          width: 24,
          height: 24,
          background: "#FFFFFF",
          border: `1px solid ${border}`,
          borderRadius: 4,
          color: "#1A2B4A",
          textDecoration: "none",
        }}
      >
        <ExternalLink size={11} strokeWidth={2.5} />
      </a>
      <button
        type="button"
        onClick={onAction}
        disabled={pending}
        className="flex items-center gap-1 px-2 transition-opacity hover:opacity-70 disabled:opacity-50"
        style={{
          height: 26,
          background: actionVariant === "primary" ? "#1A2B4A" : "#FFFFFF",
          fontSize: 11,
          color: actionVariant === "primary" ? "#FFFFFF" : "#991B1B",
          fontWeight: 600,
          border: actionVariant === "primary" ? "none" : "1px solid #FCA5A5",
          borderRadius: 4,
          cursor: pending ? "wait" : "pointer",
        }}
      >
        {actionVariant === "primary" ? (
          <Plus size={11} strokeWidth={2.5} />
        ) : (
          <X size={11} strokeWidth={2.5} />
        )}
        {actionLabel}
      </button>
    </li>
  );
}
