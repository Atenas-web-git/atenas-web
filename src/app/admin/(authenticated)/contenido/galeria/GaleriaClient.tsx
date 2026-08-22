"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  X,
  AlertTriangle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import {
  actualizarAltAction,
  eliminarImagenAction,
  type GaleriaActionState,
} from "./actions";

export type ImagenRow = {
  id: string;
  url: string;
  storage_path: string;
  alt_text: string | null;
  tamano_bytes: number | null;
  mime_type: string | null;
  uploaded_at: string | null;
};

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fileNameFromPath(path: string): string {
  const segments = path.split("/");
  const last = segments[segments.length - 1] ?? path;
  return last.replace(/^\d+_/, "");
}

export function GaleriaClient({ imagenes }: { imagenes: ImagenRow[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return imagenes;
    return imagenes.filter((img) => {
      const alt = (img.alt_text ?? "").toLowerCase();
      const path = img.storage_path.toLowerCase();
      const mime = (img.mime_type ?? "").toLowerCase();
      return alt.includes(q) || path.includes(q) || mime.includes(q);
    });
  }, [imagenes, query]);

  const selected = useMemo(
    () => imagenes.find((i) => i.id === selectedId) ?? null,
    [imagenes, selectedId]
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadError(null);
    setUploadSuccess(null);
    setUploading(true);

    let okCount = 0;
    const errors: string[] = [];

    for (const file of files) {
      if (file.size > MAX_BYTES) {
        errors.push(`${file.name}: supera 10 MB`);
        continue;
      }
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("prefix", "galeria");
        const res = await fetch("/api/admin/upload-imagen", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          errors.push(`${file.name}: ${data.error ?? "error"}`);
        } else {
          okCount += 1;
        }
      } catch {
        errors.push(`${file.name}: error de red`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (okCount > 0) {
      setUploadSuccess(
        `${okCount} imagen${okCount === 1 ? "" : "es"} subida${
          okCount === 1 ? "" : "s"
        } correctamente.`
      );
      router.refresh();
    }
    if (errors.length > 0) {
      setUploadError(errors.join(" · "));
    }
  };

  const copyUrl = async (img: ImagenRow) => {
    try {
      await navigator.clipboard.writeText(img.url);
      setCopiedId(img.id);
      setTimeout(() => setCopiedId((curr) => (curr === img.id ? null : curr)), 1500);
    } catch {
      // fallback si clipboard falla — seleccionamos texto en un prompt
      window.prompt("Copia la URL manualmente:", img.url);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: subir + buscador */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity hover:opacity-80"
          style={{
            height: 38,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 14,
            fontWeight: 500,
            cursor: uploading ? "wait" : "pointer",
            fontFamily: "inherit",
            opacity: uploading ? 0.6 : 1,
          }}
        >
          {uploading ? (
            <Loader2 size={14} strokeWidth={2.5} className="animate-spin" />
          ) : (
            <Upload size={14} strokeWidth={2.5} />
          )}
          {uploading ? "Subiendo…" : "Subir imágenes"}
        </button>

        <div
          className="flex items-center gap-2 px-3 rounded-md"
          style={{
            height: 38,
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            minWidth: 280,
            maxWidth: 360,
            flex: "1 1 280px",
          }}
        >
          <Search size={14} strokeWidth={2.5} color="#6B6660" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, alt o tipo…"
            className="bg-transparent outline-none w-full"
            style={{ fontSize: 14, color: "#1A2B4A" }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                background: "transparent",
                border: "none",
                color: "#6B6660",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {uploadError && (
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
        >
          <AlertTriangle size={14} color="#991B1B" strokeWidth={2.5} />
          <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{uploadError}</p>
        </div>
      )}
      {uploadSuccess && !uploadError && (
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-md"
          style={{ background: "#D1FAE5", border: "1px solid #A7F3D0" }}
        >
          <Check size={14} color="#065F46" strokeWidth={2.5} />
          <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>{uploadSuccess}</p>
        </div>
      )}

      {query && (
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"} de{" "}
          {imagenes.length}
        </p>
      )}

      {/* Grid de imágenes */}
      {imagenes.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6 gap-3"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <div
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, background: "#F4F1EB", borderRadius: 12 }}
          >
            <ImageIcon size={20} color="#6B6660" strokeWidth={2} />
          </div>
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            Aún no hay imágenes en el catálogo. Sube la primera para empezar.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-12 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            {`Ninguna imagen coincide con "${query}".`}
          </p>
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          }}
        >
          {filtered.map((img) => (
            <ImagenCard
              key={img.id}
              img={img}
              copied={copiedId === img.id}
              onCopy={() => copyUrl(img)}
              onOpen={() => setSelectedId(img.id)}
            />
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selected && (
        <ImagenDetalleModal
          img={selected}
          onClose={() => setSelectedId(null)}
          onCopy={() => copyUrl(selected)}
          copied={copiedId === selected.id}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Card individual del grid
// ───────────────────────────────────────────────────────────

function ImagenCard({
  img,
  copied,
  onCopy,
  onOpen,
}: {
  img: ImagenRow;
  copied: boolean;
  onCopy: () => void;
  onOpen: () => void;
}) {
  const fileName = fileNameFromPath(img.storage_path);
  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="relative transition-opacity hover:opacity-90"
        style={{
          aspectRatio: "1 / 1",
          background: "#F4F1EB",
          border: "none",
          padding: 0,
          cursor: "pointer",
          width: "100%",
        }}
        title="Ver detalle"
      >
        <Image
          src={img.url}
          alt={img.alt_text ?? fileName}
          fill
          className="object-cover"
          sizes="240px"
          unoptimized={!img.url.startsWith("/")}
        />
      </button>
      <div className="flex flex-col gap-2 p-3">
        <span
          className="truncate"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#1A2B4A",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
          title={fileName}
        >
          {fileName}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: 11, color: "#A0AABA" }}>
            {formatDate(img.uploaded_at)}
          </span>
          <span style={{ fontSize: 11, color: "#A0AABA" }}>·</span>
          <span style={{ fontSize: 11, color: "#A0AABA" }}>
            {formatBytes(img.tamano_bytes)}
          </span>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80"
          style={{
            height: 30,
            background: copied ? "#D1FAE5" : "#FAFAF8",
            color: copied ? "#065F46" : "#1A2B4A",
            border: copied ? "1px solid #A7F3D0" : "1px solid #E8E4DD",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {copied ? (
            <>
              <Check size={11} strokeWidth={2.5} />
              URL copiada
            </>
          ) : (
            <>
              <Copy size={11} strokeWidth={2.5} />
              Copiar URL
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Modal de detalle (preview grande + alt editable + eliminar)
// ───────────────────────────────────────────────────────────

function ImagenDetalleModal({
  img,
  onClose,
  onCopy,
  copied,
}: {
  img: ImagenRow;
  onClose: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26, 43, 74, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          maxWidth: 900,
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid #E8E4DD" }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Detalle de imagen
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              color: "#6B6660",
            }}
            aria-label="Cerrar"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div
          className="grid gap-5 p-5"
          style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)" }}
        >
          <div
            className="relative rounded-lg overflow-hidden"
            style={{
              background: "#F4F1EB",
              border: "1px solid #E8E4DD",
              minHeight: 320,
              aspectRatio: "4 / 3",
            }}
          >
            <Image
              src={img.url}
              alt={img.alt_text ?? fileNameFromPath(img.storage_path)}
              fill
              className="object-contain"
              sizes="(max-width: 900px) 50vw, 450px"
              unoptimized={!img.url.startsWith("/")}
            />
          </div>

          <div className="flex flex-col gap-4">
            <FieldRow label="Archivo" value={fileNameFromPath(img.storage_path)} mono />
            <FieldRow label="Ruta" value={img.storage_path} mono />
            <div className="flex items-center gap-4">
              <FieldRow label="Subida" value={formatDate(img.uploaded_at)} />
              <FieldRow label="Tamaño" value={formatBytes(img.tamano_bytes)} />
              <FieldRow label="Formato" value={img.mime_type ?? "—"} mono />
            </div>

            <div className="flex flex-col gap-2">
              <span style={labelStyle}>URL pública</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={img.url}
                  readOnly
                  onFocus={(e) => e.currentTarget.select()}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    height: 34,
                    border: "1px solid #E8E4DD",
                    borderRadius: 6,
                    paddingLeft: 10,
                    paddingRight: 10,
                    fontSize: 12,
                    color: "#1A2B4A",
                    background: "#FAFAF8",
                    outline: "none",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                />
                <button
                  type="button"
                  onClick={onCopy}
                  className="flex items-center gap-1.5 px-3 transition-opacity hover:opacity-80"
                  style={{
                    height: 34,
                    background: copied ? "#D1FAE5" : "#1A2B4A",
                    color: copied ? "#065F46" : "#FFFFFF",
                    border: copied ? "1px solid #A7F3D0" : "none",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    flexShrink: 0,
                  }}
                >
                  {copied ? (
                    <>
                      <Check size={12} strokeWidth={2.5} />
                      Copiada
                    </>
                  ) : (
                    <>
                      <Copy size={12} strokeWidth={2.5} />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>

            <EditarAltForm img={img} />

            <EliminarImagenForm img={img} onDeleted={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Sub-formularios del modal
// ───────────────────────────────────────────────────────────

function EditarAltForm({ img }: { img: ImagenRow }) {
  const [alt, setAlt] = useState(img.alt_text ?? "");
  const [state, action, pending] = useActionState<GaleriaActionState, FormData>(
    actualizarAltAction,
    { error: null, ok: false }
  );

  useEffect(() => {
    setAlt(img.alt_text ?? "");
  }, [img.id, img.alt_text]);

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={img.id} />
      <label style={labelStyle} htmlFor={`alt-${img.id}`}>
        Texto alternativo (alt)
      </label>
      <textarea
        id={`alt-${img.id}`}
        name="alt"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        rows={2}
        placeholder="Describe la imagen para accesibilidad y SEO…"
        style={{
          width: "100%",
          border: "1px solid #E8E4DD",
          borderRadius: 6,
          padding: 10,
          fontSize: 13,
          color: "#1A2B4A",
          background: "#FFFFFF",
          outline: "none",
          fontFamily: "inherit",
          resize: "vertical",
        }}
      />
      {state.error && (
        <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
      )}
      {state.ok && !state.error && (
        <p style={{ fontSize: 12, color: "#065F46", margin: 0 }}>Guardado.</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="self-start transition-opacity hover:opacity-80"
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
          cursor: pending ? "wait" : "pointer",
          opacity: pending ? 0.6 : 1,
          fontFamily: "inherit",
        }}
      >
        {pending ? "Guardando…" : "Guardar alt"}
      </button>
    </form>
  );
}

function EliminarImagenForm({
  img,
  onDeleted,
}: {
  img: ImagenRow;
  onDeleted: () => void;
}) {
  const [state, action, pending] = useActionState<GaleriaActionState, FormData>(
    eliminarImagenAction,
    { error: null, ok: false }
  );
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (state.ok && !state.error) {
      onDeleted();
    }
  }, [state, onDeleted]);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 self-start px-3 transition-opacity hover:opacity-80"
        style={{
          height: 32,
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
        <Trash2 size={12} strokeWidth={2.5} />
        Eliminar imagen
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={img.id} />
      <div
        className="flex items-start gap-2 px-3 py-3 rounded-md"
        style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
      >
        <AlertTriangle size={14} color="#991B1B" strokeWidth={2.5} />
        <div className="flex flex-col gap-1 flex-1">
          <p style={{ fontSize: 13, fontWeight: 600, color: "#991B1B", margin: 0 }}>
            ¿Eliminar esta imagen del catálogo?
          </p>
          <p style={{ fontSize: 12, color: "#7F1D1D", margin: 0, lineHeight: 1.5 }}>
            La imagen se borra del bucket{" "}
            <code style={{ fontFamily: "ui-monospace, monospace" }}>contenido</code>. Las
            páginas que la usan dejarán de mostrarla.
          </p>
        </div>
      </div>
      {state.error && (
        <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setConfirming(false)}
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
          disabled={pending}
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
            cursor: pending ? "wait" : "pointer",
            opacity: pending ? 0.6 : 1,
            fontFamily: "inherit",
          }}
        >
          {pending ? "Eliminando…" : "Sí, eliminar"}
        </button>
      </div>
    </form>
  );
}

// ───────────────────────────────────────────────────────────
// Helpers de estilo
// ───────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

function FieldRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
      <span style={labelStyle}>{label}</span>
      <span
        className="truncate"
        style={{
          fontSize: 13,
          color: "#1A2B4A",
          fontFamily: mono
            ? "ui-monospace, SFMono-Regular, Menlo, monospace"
            : "inherit",
        }}
        title={value}
      >
        {value}
      </span>
    </div>
  );
}
