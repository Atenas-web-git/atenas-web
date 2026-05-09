"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
  Check,
  AlertTriangle,
} from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/avif";

type ImagenRow = {
  id: string;
  url: string;
  storage_path: string;
  alt_text: string | null;
  tamano_bytes: number | null;
  mime_type: string | null;
  uploaded_at: string | null;
};

function fileNameFromPath(path: string): string {
  const segments = path.split("/");
  const last = segments[segments.length - 1] ?? path;
  return last.replace(/^\d+_/, "");
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CatalogoPicker({
  open,
  onClose,
  onSelect,
  uploadPrefix = "general",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string, alt: string | null) => void;
  uploadPrefix?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<ImagenRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Cargar el catálogo cuando se abre el modal
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/admin/catalogo-imagenes")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
        } else {
          setItems(data.items ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el catálogo.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setQuery("");
      setError(null);
      setHighlightedId(null);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((img) => {
      const alt = (img.alt_text ?? "").toLowerCase();
      const path = img.storage_path.toLowerCase();
      const mime = (img.mime_type ?? "").toLowerCase();
      return alt.includes(q) || path.includes(q) || mime.includes(q);
    });
  }, [items, query]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setError("El archivo supera el límite de 10 MB.");
      e.target.value = "";
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", uploadPrefix);
      const res = await fetch("/api/admin/upload-imagen", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al subir la imagen.");
        return;
      }
      // Aplicar inmediatamente la imagen recién subida
      onSelect(data.url as string, (data.alt_text as string | null) ?? null);
      onClose();
    } catch {
      setError("Error de red al subir la imagen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

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
        zIndex: 110,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          maxWidth: 1000,
          width: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-5 py-3 flex-wrap"
          style={{ borderBottom: "1px solid #E8E4DD" }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1A2B4A",
              margin: 0,
              flexShrink: 0,
            }}
          >
            Elegir del catálogo
          </h3>
          <div
            className="flex items-center gap-2 px-3 rounded-md"
            style={{
              height: 34,
              background: "#FAFAF8",
              border: "1px solid #E8E4DD",
              flex: "1 1 240px",
              minWidth: 200,
            }}
          >
            <Search size={13} strokeWidth={2.5} color="#6B6660" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, alt o tipo…"
              className="bg-transparent outline-none w-full"
              style={{ fontSize: 12, color: "#1A2B4A" }}
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6B6660",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Limpiar
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 transition-opacity hover:opacity-80"
            style={{
              height: 34,
              background: "#1A2B4A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: uploading ? "wait" : "pointer",
              opacity: uploading ? 0.6 : 1,
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            {uploading ? (
              <Loader2 size={12} strokeWidth={2.5} className="animate-spin" />
            ) : (
              <Upload size={12} strokeWidth={2.5} />
            )}
            {uploading ? "Subiendo…" : "Subir nueva"}
          </button>
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
              flexShrink: 0,
            }}
            aria-label="Cerrar"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {error && (
          <div
            className="flex items-start gap-2 mx-5 mt-3 px-3 py-2 rounded-md"
            style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
          >
            <AlertTriangle size={13} color="#991B1B" strokeWidth={2.5} />
            <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Body */}
        <div
          className="flex-1 overflow-auto p-5"
          style={{ minHeight: 240 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2">
              <Loader2 size={16} strokeWidth={2.5} className="animate-spin" color="#6B6660" />
              <span style={{ fontSize: 13, color: "#6B6660" }}>Cargando catálogo…</span>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div
                className="flex items-center justify-center"
                style={{ width: 48, height: 48, background: "#F4F1EB", borderRadius: 12 }}
              >
                <ImageIcon size={20} color="#6B6660" strokeWidth={2} />
              </div>
              <p style={{ fontSize: 13, color: "#6B6660", margin: 0, textAlign: "center" }}>
                El catálogo está vacío. Sube la primera imagen con el botón de arriba.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p style={{ fontSize: 13, color: "#6B6660", margin: 0, textAlign: "center" }}>
                {`Ninguna imagen coincide con "${query}".`}
              </p>
            </div>
          ) : (
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              }}
            >
              {filtered.map((img) => {
                const fileName = fileNameFromPath(img.storage_path);
                const isHighlighted = highlightedId === img.id;
                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => {
                      setHighlightedId(img.id);
                      onSelect(img.url, img.alt_text);
                      onClose();
                    }}
                    onMouseEnter={() => setHighlightedId(img.id)}
                    onMouseLeave={() =>
                      setHighlightedId((curr) => (curr === img.id ? null : curr))
                    }
                    className="flex flex-col text-left transition-all"
                    style={{
                      background: "#FFFFFF",
                      border: isHighlighted
                        ? "2px solid #1A2B4A"
                        : "1px solid #E8E4DD",
                      borderRadius: 10,
                      overflow: "hidden",
                      cursor: "pointer",
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                    title={`Seleccionar ${fileName}`}
                  >
                    <div
                      className="relative"
                      style={{
                        aspectRatio: "1 / 1",
                        background: "#F4F1EB",
                      }}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt_text ?? fileName}
                        fill
                        className="object-cover"
                        sizes="180px"
                        unoptimized={!img.url.startsWith("/")}
                      />
                      {isHighlighted && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "rgba(26, 43, 74, 0.35)" }}
                        >
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 36,
                              height: 36,
                              background: "#1A2B4A",
                              borderRadius: 18,
                              color: "#FFFFFF",
                            }}
                          >
                            <Check size={18} strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 px-2 py-2">
                      <span
                        className="truncate"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#1A2B4A",
                          fontFamily:
                            "ui-monospace, SFMono-Regular, Menlo, monospace",
                        }}
                        title={fileName}
                      >
                        {fileName}
                      </span>
                      <span style={{ fontSize: 10, color: "#A0AABA" }}>
                        {formatBytes(img.tamano_bytes)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap"
          style={{ borderTop: "1px solid #E8E4DD" }}
        >
          <span style={{ fontSize: 11, color: "#6B6660" }}>
            {loading
              ? "—"
              : `${filtered.length} ${
                  filtered.length === 1 ? "imagen" : "imágenes"
                }${query ? ` (de ${items.length})` : ""}`}
          </span>
          <button
            type="button"
            onClick={onClose}
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
              fontFamily: "inherit",
            }}
          >
            Cancelar
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
}
