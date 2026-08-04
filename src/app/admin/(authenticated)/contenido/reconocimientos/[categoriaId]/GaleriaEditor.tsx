"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { CatalogoPicker } from "@/components/admin/CatalogoPicker";
import { actualizarGaleriaAction, type ReconocimientosActionState } from "../actions";

type Foto = { src: string; alt: string };

type Props = {
  scope: "categoria" | "subcategoria";
  scopeId: number;
  categoriaId: number;
  fotosIniciales: Foto[];
  prefix: string;
};

const INITIAL_STATE: ReconocimientosActionState = { error: null, ok: false };
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export function GaleriaEditor({ scope, scopeId, categoriaId, fotosIniciales, prefix }: Props) {
  const [fotos, setFotos] = useState<Foto[]>(fotosIniciales);
  const [state, formAction] = useActionState(actualizarGaleriaAction, INITIAL_STATE);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateAlt = (i: number, alt: string) =>
    setFotos((prev) => prev.map((f, idx) => (idx === i ? { ...f, alt } : f)));
  const remove = (i: number) => {
    setFotos((prev) => prev.filter((_, idx) => idx !== i));
    if (editingIndex === i) setEditingIndex(null);
  };
  const move = (i: number, dir: -1 | 1) => {
    setFotos((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploadError(null);
    setUploading(true);
    setUploadProgress({ current: 0, total: list.length });

    const subidas: Foto[] = [];
    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setUploadProgress({ current: i + 1, total: list.length });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("prefix", prefix);
      try {
        const res = await fetch("/api/admin/upload-imagen", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setUploadError(data.error || "Error al subir una imagen");
          break;
        }
        subidas.push({ src: data.url, alt: data.alt_text || "" });
      } catch {
        setUploadError("Error de red al subir la imagen");
        break;
      }
    }

    if (subidas.length > 0) {
      setFotos((prev) => [...prev, ...subidas]);
    }
    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
    }
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="scope" value={scope} />
      <input type="hidden" name="scopeId" value={scopeId} />
      <input type="hidden" name="categoriaId" value={categoriaId} />
      {fotos.map((f, i) => (
        <div key={i}>
          <input type="hidden" name={`foto_${i}`} value={f.src} />
          <input type="hidden" name={`foto_alt_${i}`} value={f.alt} />
        </div>
      ))}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={onFileInputChange}
        style={{ display: "none" }}
      />

      {/* Toolbar */}
      <div
        className="flex items-center justify-between gap-3 flex-wrap px-4 py-3"
        style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              color: "#1A2B4A",
            }}
          >
            {fotos.length}
          </span>
          <span style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 600 }}>
            {fotos.length === 1 ? "foto" : "fotos"} en esta galería
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              height: 34,
              background: "#1A2B4A",
              fontSize: 12,
              color: "#FFFFFF",
              fontWeight: 600,
              border: "none",
              cursor: uploading ? "wait" : "pointer",
            }}
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} strokeWidth={2.5} />}
            {uploading && uploadProgress
              ? `Subiendo ${uploadProgress.current} de ${uploadProgress.total}…`
              : "Subir fotos"}
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              height: 34,
              background: "#F4F1EB",
              fontSize: 12,
              color: "#1A2B4A",
              fontWeight: 600,
              border: "1px solid #E8E4DD",
              cursor: uploading ? "wait" : "pointer",
            }}
          >
            <FolderOpen size={13} strokeWidth={2.5} />
            Catálogo
          </button>
        </div>
      </div>

      {uploadError && (
        <div
          className="px-4 py-3 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{uploadError}</p>
        </div>
      )}

      {/* Grid de thumbnails */}
      {fotos.length === 0 ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 py-12 px-6 transition-all hover:opacity-80"
          style={{
            background: "#FAFAF8",
            border: "2px dashed #C9C0B0",
            borderRadius: 10,
            cursor: "pointer",
          }}
        >
          <Upload size={22} strokeWidth={2} color="#6B6660" />
          <p style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 600, margin: 0 }}>
            Aún no hay fotos en esta galería
          </p>
          <p style={{ fontSize: 11, color: "#6B6660", margin: 0 }}>
            Toca aquí para subir varias fotos a la vez · JPG, PNG, WebP · Máx 10 MB c/u
          </p>
        </button>
      ) : (
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))" }}
        >
          {fotos.map((f, i) => (
            <FotoTile
              key={i}
              foto={f}
              index={i}
              isFirst={i === 0}
              isLast={i === fotos.length - 1}
              isEditing={editingIndex === i}
              onMove={(dir) => move(i, dir)}
              onRemove={() => remove(i)}
              onEditAlt={() => setEditingIndex(editingIndex === i ? null : i)}
              onAltChange={(v) => updateAlt(i, v)}
              onCloseEdit={() => setEditingIndex(null)}
            />
          ))}
          {/* Slot vacío "añadir" */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1 transition-all hover:opacity-80"
            style={{
              aspectRatio: "1/1",
              background: "#FAFAF8",
              border: "2px dashed #C9C0B0",
              borderRadius: 10,
              cursor: "pointer",
              color: "#6B6660",
            }}
            aria-label="Añadir más fotos"
          >
            <Plus size={22} strokeWidth={2} />
            <span style={{ fontSize: 11, fontWeight: 600 }}>Añadir más</span>
          </button>
        </div>
      )}

      <CatalogoPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        uploadPrefix={prefix}
        onSelect={(url, alt) => {
          setFotos((prev) => [...prev, { src: url, alt: alt ?? "" }]);
          setPickerOpen(false);
        }}
      />

      {state.error && (
        <div
          className="px-4 py-3 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{state.error}</p>
        </div>
      )}
      {state.ok && (
        <div
          className="px-4 py-3 rounded-md"
          style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
        >
          <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>Galería guardada</p>
        </div>
      )}

      <div
        className="flex items-center justify-between gap-3 pt-2 flex-wrap"
        style={{ borderTop: "1px dashed #E8E4DD" }}
      >
        <p style={{ fontSize: 11, color: "#6B6660", margin: 0, maxWidth: 460 }}>
          El orden de las fotos define cómo aparecen en el mosaico de la landing (5 primeras)
          y en la galería completa pública. Recuerda <strong>guardar la galería</strong> al final.
        </p>
        <SaveBtn disabled={uploading} />
      </div>
    </form>
  );
}

function FotoTile({
  foto,
  index,
  isFirst,
  isLast,
  isEditing,
  onMove,
  onRemove,
  onEditAlt,
  onAltChange,
  onCloseEdit,
}: {
  foto: Foto;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onEditAlt: () => void;
  onAltChange: (v: string) => void;
  onCloseEdit: () => void;
}) {
  return (
    <div
      className="relative overflow-hidden group"
      style={{
        aspectRatio: "1/1",
        background: "#0D1825",
        borderRadius: 10,
        border: "1px solid #E8E4DD",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={foto.src}
        alt={foto.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Número de orden */}
      <div
        className="absolute top-1.5 left-1.5"
        style={{
          minWidth: 22,
          height: 22,
          padding: "0 7px",
          background: "rgba(13,24,37,0.85)",
          borderRadius: 11,
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {index + 1}
      </div>

      {/* Indicador de alt vacío */}
      {!foto.alt.trim() && (
        <div
          className="absolute top-1.5 right-1.5"
          style={{
            background: "rgba(254,243,199,0.95)",
            color: "#92400E",
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
          title="Esta foto no tiene texto alt (descripción accesible)"
        >
          SIN ALT
        </div>
      )}

      {/* Overlay con acciones — visible siempre en mobile, hover en desktop */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-2 gap-1.5 transition-opacity opacity-0 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,24,37,0) 0%, rgba(13,24,37,0.20) 50%, rgba(13,24,37,0.85) 100%)",
        }}
      >
        {/* Alt preview */}
        {foto.alt.trim() && !isEditing && (
          <p
            className="line-clamp-2"
            style={{
              fontSize: 11,
              color: "#FFFFFF",
              margin: 0,
              opacity: 0.9,
              lineHeight: 1.3,
            }}
          >
            {foto.alt}
          </p>
        )}
        {/* Botones de acción */}
        <div className="flex items-center gap-1 mt-auto">
          <ActionBtn
            onClick={() => onMove(-1)}
            disabled={isFirst}
            label="Mover izquierda"
            icon={<ArrowLeft size={12} strokeWidth={2.5} />}
          />
          <ActionBtn
            onClick={() => onMove(1)}
            disabled={isLast}
            label="Mover derecha"
            icon={<ArrowRight size={12} strokeWidth={2.5} />}
          />
          <ActionBtn
            onClick={onEditAlt}
            label="Editar descripción (alt)"
            icon={<Pencil size={12} strokeWidth={2.5} />}
            active={isEditing}
          />
          <ActionBtn
            onClick={onRemove}
            label="Eliminar"
            icon={<Trash2 size={12} strokeWidth={2.5} />}
            danger
          />
        </div>
      </div>

      {/* Editor inline de alt */}
      {isEditing && (
        <div
          className="absolute left-0 right-0 bottom-0 flex flex-col gap-1 p-2"
          style={{
            background: "rgba(13,24,37,0.95)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <label
            className="flex items-center justify-between gap-1"
            style={{ fontSize: 10, color: "rgba(255,255,255,0.70)", fontWeight: 600 }}
          >
            <span>Descripción accesible (alt)</span>
            <button
              type="button"
              onClick={onCloseEdit}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.70)",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Cerrar"
            >
              <X size={11} />
            </button>
          </label>
          <input
            type="text"
            value={foto.alt}
            onChange={(e) => onAltChange(e.target.value)}
            placeholder="Ej. Equipo recibiendo trofeo"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onCloseEdit();
              }
            }}
            style={{
              width: "100%",
              height: 28,
              padding: "0 8px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 4,
              fontSize: 11,
              color: "#FFFFFF",
              outline: "none",
            }}
          />
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  onClick,
  disabled,
  label,
  icon,
  active,
  danger,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex items-center justify-center transition-opacity disabled:opacity-30 hover:opacity-100"
      style={{
        width: 26,
        height: 26,
        background: danger
          ? "rgba(220,38,38,0.85)"
          : active
            ? "rgba(158,25,21,0.85)"
            : "rgba(255,255,255,0.20)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 5,
        color: "#FFFFFF",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: 0.85,
      }}
    >
      {icon}
    </button>
  );
}

function SaveBtn({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="px-5 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{
        height: 38,
        background: "#1A2B4A",
        fontSize: 13,
        color: "#FFFFFF",
        fontWeight: 600,
        border: "none",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Guardando…" : "Guardar galería"}
    </button>
  );
}
