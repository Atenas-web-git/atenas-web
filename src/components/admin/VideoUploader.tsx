"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Loader2, Film } from "lucide-react";

const MAX_BYTES = 15 * 1024 * 1024; // 15 MB

type Props = {
  value: string;
  onChange: (url: string) => void;
  prefix?: string;
  label?: string;
  hint?: string;
};

/**
 * Uploader de video liviano para fondos en loop. Sube a Supabase Storage
 * vía /api/admin/upload-video. Muestra preview con <video> mute + loop.
 *
 * Pensado para videos de fondo: cortos, sin audio, comprimidos, max 15 MB.
 */
export function VideoUploader({
  value,
  onChange,
  prefix = "videos",
  label,
  hint,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setError(
        "El video supera el límite de 15 MB. Usa un video más corto, sin audio y comprimido."
      );
      e.target.value = "";
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("prefix", prefix);

      const res = await fetch("/api/admin/upload-video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error al subir el video.");
        return;
      }

      onChange(data.url);
    } catch {
      setError("Error de red al subir el video.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeVideo = () => {
    onChange("");
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span
          style={{
            fontSize: 12,
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
              background: "#0D1825",
              maxWidth: 360,
              aspectRatio: "16 / 9",
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video
              src={value}
              muted
              loop
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                fontSize: 13,
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
              onClick={removeVideo}
              className="flex items-center gap-1.5 px-3 transition-opacity hover:opacity-80"
              style={{
                height: 30,
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
              Quitar
            </button>
            <span
              className="truncate flex-1 min-w-0"
              style={{
                fontSize: 12,
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
            fontSize: 14,
            fontWeight: 500,
            cursor: uploading ? "wait" : "pointer",
            fontFamily: "inherit",
            maxWidth: 360,
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
              Subiendo…
            </>
          ) : (
            <>
              <Film size={16} strokeWidth={2} />
              Subir video
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {error && <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{error}</p>}

      {hint && !error && (
        <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}
