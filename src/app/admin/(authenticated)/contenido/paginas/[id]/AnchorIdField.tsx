"use client";

import { useState } from "react";
import { Anchor, Copy, Check } from "lucide-react";

type Props = {
  /** Valor actual del anchorId (sin el `#`). */
  value: string;
  onChange: (v: string) => void;
  /** Slug de la página (para mostrar el preview de la URL completa). */
  slug: string;
};

/**
 * Campo reutilizable para definir el ID de anclaje de una sección.
 * Permite enlazar con `/slug#anchorId` desde botones, mega-menú, etc.
 *
 * - Sanitiza el valor (solo letras minúsculas, números, guiones)
 * - Muestra el preview de la URL completa con copy-to-clipboard
 * - Si el campo está vacío, no se aplica id al `<section>`
 */
export function AnchorIdField({ value, onChange, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const sanitize = (v: string) =>
    v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

  const handleChange = (v: string) => {
    // Permitimos escritura libre, pero limitamos caracteres válidos al instante.
    onChange(sanitize(v));
  };

  const previewUrl = value ? `/${slug}#${value}` : "";

  const handleCopy = async () => {
    if (!previewUrl) return;
    try {
      await navigator.clipboard.writeText(previewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // navegadores antiguos / iframes pueden no permitir clipboard
    }
  };

  return (
    <div
      className="flex flex-col gap-1.5 p-4 rounded-md"
      style={{
        background: "#FAFAF8",
        border: "1px dashed #C9C0B0",
      }}
    >
      <div className="flex items-center gap-1.5">
        <Anchor size={13} strokeWidth={2.5} color="#1A2B4A" />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
          ID de anclaje (opcional)
        </span>
      </div>
      <p style={{ fontSize: 11, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
        Si lo defines, esta sección se puede enlazar con un anchor en el menú o
        en botones (ej. botón del Hero, sub-item del mega-menú). El sistema
        sanitiza automáticamente — solo minúsculas, números y guiones.
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder='ej. "visita", "valores", "horarios"'
        maxLength={50}
        style={{
          width: "100%",
          minHeight: 36,
          padding: "8px 12px",
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 6,
          fontSize: 13,
          color: "#1A2B4A",
          outline: "none",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      />
      {previewUrl && (
        <div className="flex items-center gap-2 mt-1">
          <code
            style={{
              flex: 1,
              padding: "6px 10px",
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 4,
              fontSize: 11,
              color: "#1A2B4A",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {previewUrl}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 transition-opacity hover:opacity-70"
            style={{
              height: 28,
              background: copied ? "#DCFCE7" : "#F4F1EB",
              fontSize: 11,
              color: copied ? "#065F46" : "#1A2B4A",
              fontWeight: 600,
              border: "1px solid " + (copied ? "#86EFAC" : "#E8E4DD"),
              borderRadius: 4,
              cursor: "pointer",
            }}
            title="Copiar URL al portapapeles"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copiado" : "Copiar URL"}
          </button>
        </div>
      )}
    </div>
  );
}
