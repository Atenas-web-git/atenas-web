"use client";

import { useActionState, useState } from "react";
import { Save, ExternalLink, AlertCircle, Check } from "lucide-react";
import {
  crearDocumentoAction,
  actualizarDocumentoAction,
  type DocumentoActionState,
} from "./actions";
import { extractDriveFileId, isDriveUrl } from "@/lib/cms/parseDriveUrl";

type Categoria = { id: number; nombre: string };

type Props = {
  modo: "crear" | "editar";
  categorias: Categoria[];
  initial?: {
    id: number;
    titulo: string;
    descripcion: string;
    categoria_id: number;
    drive_url: string;
    orden: number;
    publicado: boolean;
  };
};

export function DocumentoForm({ modo, categorias, initial }: Props) {
  const [state, action, isPending] = useActionState<DocumentoActionState, FormData>(
    modo === "crear" ? crearDocumentoAction : actualizarDocumentoAction,
    { error: null, ok: false }
  );

  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [categoriaId, setCategoriaId] = useState<number>(
    initial?.categoria_id ?? categorias[0]?.id ?? 0
  );
  const [driveUrl, setDriveUrl] = useState(initial?.drive_url ?? "");
  const [publicado, setPublicado] = useState(initial?.publicado ?? false);

  const driveOk = driveUrl.trim() === "" ? null : isDriveUrl(driveUrl);
  const driveFileId = driveUrl.trim() && driveOk ? extractDriveFileId(driveUrl) : null;

  return (
    <form action={action} className="flex flex-col gap-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      {/* Sticky header */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="publicado"
            checked={publicado}
            onChange={(e) => setPublicado(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
            {publicado ? "Documento publicado" : "Borrador (no visible al público)"}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {state.error && <span style={{ fontSize: 13, color: "#991B1B" }}>{state.error}</span>}
          {state.ok && <span style={{ fontSize: 13, color: "#065F46" }}>Guardado ✓</span>}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 rounded-md transition-opacity"
            style={{
              height: 36,
              background: "#1A2B4A",
              color: "#FFFFFF",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              cursor: isPending ? "wait" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <Save size={14} strokeWidth={2.5} />
            {isPending ? "Guardando…" : modo === "crear" ? "Crear documento" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Datos del documento */}
      <Card title="Información del documento">
        <Field label="Título" required>
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="ej. Código de Convivencia"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción" hint="Opcional. Aparece en pequeño debajo del título en el frontend.">
          <textarea
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Documento oficial vigente para 2026–2027."
            style={textareaStyle}
          />
        </Field>
        <Field label="Categoría" required>
          <select
            name="categoria_id"
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            required
            style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}
          >
            {categorias.length === 0 && (
              <option value="" disabled>
                Sin categorías — créalas primero
              </option>
            )}
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>
        <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
          El orden en que aparece el documento en el sitio público se controla con las
          flechas ↑ ↓ del listado, no aquí.
        </p>
      </Card>

      {/* Link de Google Drive */}
      <Card
        title="Link de descarga"
        subtitle="El archivo vive en Google Drive del colegio. Aquí pegas solo el link."
      >
        <div
          className="px-4 py-3 rounded-md"
          style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
        >
          <p style={{ fontSize: 13, color: "#1E40AF", margin: 0, lineHeight: 1.6 }}>
            <strong>Cómo obtener el link público:</strong>
            <br />
            1. Sube el archivo a Google Drive del colegio.
            <br />
            2. Click derecho → <em>Compartir</em> → cambia a <em>&ldquo;Cualquier persona con el enlace&rdquo;</em>.
            <br />
            3. Click en <em>&ldquo;Copiar enlace&rdquo;</em> y pégalo abajo.
          </p>
        </div>

        <Field label="URL de Google Drive" required>
          <input
            type="url"
            name="drive_url"
            value={driveUrl}
            onChange={(e) => setDriveUrl(e.target.value)}
            required
            placeholder="https://drive.google.com/file/d/…"
            style={inputStyle}
          />
        </Field>

        {/* Feedback en vivo sobre la URL */}
        {driveOk === true && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-md"
            style={{ background: "#DCFCE7", border: "1px solid #BBF7D0" }}
          >
            <Check size={14} strokeWidth={2.5} color="#065F46" style={{ marginTop: 1 }} />
            <div className="flex flex-col gap-0.5">
              <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>
                URL válida de Google Drive
              </span>
              {driveFileId && (
                <span style={{ fontSize: 12, color: "#065F46", fontFamily: "ui-monospace, monospace" }}>
                  ID detectado: {driveFileId}
                </span>
              )}
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 transition-opacity hover:opacity-70"
                style={{ fontSize: 12, color: "#065F46", fontWeight: 600 }}
              >
                <ExternalLink size={11} strokeWidth={2.5} />
                Abrir el enlace en otra pestaña para verificar
              </a>
            </div>
          </div>
        )}
        {driveOk === false && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-md"
            style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
          >
            <AlertCircle size={14} strokeWidth={2.5} color="#92400E" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
              No parece una URL de Google Drive. Aceptamos la URL igual (puede ser otro hosting),
              pero verifica que sea pública para que cualquiera pueda descargar el documento.
            </span>
          </div>
        )}
      </Card>
    </form>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={fieldLabel}>
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}

const fieldLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#A0AABA",
  lineHeight: 1.5,
};

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  minHeight: 60,
  paddingTop: 10,
  paddingBottom: 10,
  resize: "vertical",
};
