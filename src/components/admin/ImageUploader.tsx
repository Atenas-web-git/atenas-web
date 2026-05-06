"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Link as LinkIcon, Loader2 } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;

type Props = {
  value: string;
  onChange: (url: string) => void;
  prefix?: string;
  label?: string;
  hint?: string;
  /** Aspect ratio sugerido para el preview (default: "auto"). */
  previewAspect?: "16/9" | "4/3" | "1/1" | "auto";
};

export function ImageUploader({
  value,
  onChange,
  prefix = "general",
  label,
  hint,
  previewAspect = "auto",
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

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
      formData.append("prefix", prefix);

      const res = await fetch("/api/admin/upload-imagen", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al subir la imagen.");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Error de red al subir la imagen.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const applyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!/^https?:\/\//.test(trimmed)) {
      setError("La URL debe empezar con http:// o https://");
      return;
    }
    setError(null);
    onChange(trimmed);
    setShowUrlInput(false);
    setUrlInput("");
  };

  const removeImage = () => {
    onChange("");
    setError(null);
  };

  const aspectStyle: React.CSSProperties =
    previewAspect === "16/9"
      ? { aspectRatio: "16 / 9" }
      : previewAspect === "4/3"
      ? { aspectRatio: "4 / 3" }
      : previewAspect === "1/1"
      ? { aspectRatio: "1 / 1" }
      : { minHeight: 160 };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
      )}

      {value ? (
        <div className="flex flex-col gap-2">
          <div
            className="relative rounded-md overflow-hidden"
            style={{
              border: "1px solid #E8E4DD",
              background: "#F4F1EB",
              ...aspectStyle,
            }}
          >
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              sizes="600px"
              unoptimized={!value.startsWith("/")}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 transition-opacity hover:opacity-80"
              style={{
                height: 30,
                background: "transparent",
                color: "#1A2B4A",
                border: "1px solid #E8E4DD",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                cursor: uploading ? "wait" : "pointer",
                opacity: uploading ? 0.5 : 1,
                fontFamily: "inherit",
              }}
            >
              {uploading ? (
                <Loader2 size={12} strokeWidth={2.5} className="animate-spin" />
              ) : (
                <Upload size={12} strokeWidth={2.5} />
              )}
              Cambiar
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="flex items-center gap-1.5 px-3 transition-opacity hover:opacity-80"
              style={{
                height: 30,
                background: "transparent",
                color: "#991B1B",
                border: "1px solid #FECACA",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Trash2 size={12} strokeWidth={2.5} />
              Quitar
            </button>
            <span
              className="truncate flex-1 min-w-0"
              style={{
                fontSize: 11,
                color: "#A0AABA",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
              title={value}
            >
              {value}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {!showUrlInput ? (
            <>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center justify-center gap-2 transition-colors"
                style={{
                  minHeight: 100,
                  background: "#FAFAF8",
                  color: "#6B6660",
                  border: "1.5px dashed #C9C4BB",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: uploading ? "wait" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                    Subiendo…
                  </>
                ) : (
                  <>
                    <Upload size={16} strokeWidth={2} />
                    Subir imagen
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="flex items-center gap-1.5 self-start transition-opacity hover:opacity-70"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6B6660",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                <LinkIcon size={11} strokeWidth={2} />
                O pegar URL externa
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://..."
                style={{
                  flex: 1,
                  minWidth: 200,
                  height: 36,
                  border: "1px solid #E8E4DD",
                  borderRadius: 6,
                  paddingLeft: 12,
                  paddingRight: 12,
                  fontSize: 12,
                  color: "#1A2B4A",
                  background: "#FFFFFF",
                  outline: "none",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={applyUrl}
                style={{
                  height: 36,
                  paddingLeft: 14,
                  paddingRight: 14,
                  background: "#1A2B4A",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Aplicar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput("");
                  setError(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#6B6660",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {error && (
        <p style={{ fontSize: 11, color: "#991B1B", margin: 0 }}>{error}</p>
      )}

      {hint && !error && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>
          {hint}
        </span>
      )}
    </div>
  );
}
