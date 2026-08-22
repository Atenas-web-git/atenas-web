"use client";

import { useState, useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  Upload,
  Trash2,
  Edit2,
  Save,
  X,
  FileText,
  FileImage,
  File as FileIcon,
  Eye,
  EyeOff,
  ExternalLink,
} from "lucide-react";
import {
  subirArchivoBancoAction,
  actualizarArchivoBancoAction,
  eliminarArchivoBancoAction,
} from "./actions";
import type { ArchivoBancoRow } from "./page";
import { DialogoConfirmacion } from "@/components/admin/DialogoConfirmacion";

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mime: string | null) {
  if (!mime) return <FileIcon size={18} color="#6B6660" />;
  if (mime.startsWith("image/")) return <FileImage size={18} color="#1E40AF" />;
  if (mime === "application/pdf") return <FileText size={18} color="#9e1915" />;
  return <FileIcon size={18} color="#6B6660" />;
}

export function ArchivosBancoClient({ archivos }: { archivos: ArchivoBancoRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <UploadCard />

      {archivos.length === 0 ? (
        <div
          className="px-6 py-12 text-center"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <FileIcon size={28} strokeWidth={2} color="#A0AABA" style={{ display: "inline-block" }} />
          <p style={{ fontSize: 14, color: "#6B6660", margin: "10px 0 0" }}>
            Aún no hay archivos en el banco. Sube el primero arriba.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
                {["Archivo", "Categoría", "Tamaño", "Estado", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6B6660",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {archivos.map((a) => (
                <ArchivoRow
                  key={a.id}
                  archivo={a}
                  editing={editingId === a.id}
                  onStartEdit={() => setEditingId(a.id)}
                  onCancelEdit={() => setEditingId(null)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UploadCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileName(f ? f.name : null);
    setError(null);
    setOk(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await subirArchivoBancoAction({ error: null, ok: false }, fd);
      if (res.error) setError(res.error);
      else {
        setOk(true);
        setFileName(null);
        if (formRef.current) formRef.current.reset();
        setTimeout(() => setOk(false), 2500);
      }
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Subir archivo nuevo
        </h2>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "2px 0 0" }}>
          Acepta PDF, imágenes, Word, Excel. Máx 4 MB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            Nombre (opcional)
          </span>
          <input
            type="text"
            name="nombre"
            placeholder="Si vacío, usa el nombre del archivo"
            style={inputStyle}
            maxLength={120}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            Categoría (opcional)
          </span>
          <input
            type="text"
            name="categoria"
            placeholder='ej. "general", "egb-superior", "ib"'
            style={inputStyle}
            maxLength={60}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
          Descripción (opcional)
        </span>
        <textarea
          name="descripcion"
          rows={2}
          placeholder="Para qué sirve este archivo. Aparece en la lista del banco."
          style={{ ...inputStyle, minHeight: 60, paddingTop: 8, paddingBottom: 8, resize: "vertical" }}
          maxLength={300}
        />
      </label>

      <div className="flex items-center gap-3 flex-wrap">
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          required
          onChange={onFileChange}
          accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png,.webp"
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-70"
          style={{
            height: 36,
            background: "#F4F1EB",
            fontSize: 14,
            color: "#1A2B4A",
            fontWeight: 600,
            border: "1px solid #E8E4DD",
            cursor: "pointer",
          }}
        >
          <Upload size={13} strokeWidth={2.5} />
          {fileName ?? "Seleccionar archivo"}
        </button>
        <button
          type="submit"
          disabled={pending || !fileName}
          className="flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{
            height: 36,
            background: "#1A2B4A",
            fontSize: 14,
            color: "#FFFFFF",
            fontWeight: 600,
            border: "none",
            cursor: pending || !fileName ? "not-allowed" : "pointer",
          }}
        >
          {pending ? "Subiendo…" : "Subir al banco"}
        </button>
      </div>

      {error && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{error}</p>
        </div>
      )}
      {ok && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
        >
          <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>Archivo subido al banco ✓</p>
        </div>
      )}
    </form>
  );
}

function ArchivoRow({
  archivo,
  editing,
  onStartEdit,
  onCancelEdit,
}: {
  archivo: ArchivoBancoRow;
  editing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}) {
  if (editing) {
    return <EditingRow archivo={archivo} onCancel={onCancelEdit} />;
  }
  return (
    <tr style={{ borderBottom: "1px solid #F4F1EB" }}>
      <td style={{ padding: "12px 16px" }}>
        <div className="flex items-center gap-3 min-w-0">
          {fileIcon(archivo.tipo_mime)}
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
              {archivo.nombre}
            </div>
            {archivo.descripcion && (
              <p
                style={{
                  fontSize: 12,
                  color: "#6B6660",
                  margin: "2px 0 0",
                  maxWidth: 380,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {archivo.descripcion}
              </p>
            )}
          </div>
        </div>
      </td>
      <td style={{ padding: "12px 16px" }}>
        {archivo.categoria ? (
          <span
            className="inline-flex items-center px-2 rounded-full"
            style={{
              height: 20,
              background: "#EFF6FF",
              fontSize: 11,
              fontWeight: 700,
              color: "#1E40AF",
              letterSpacing: 0.3,
            }}
          >
            {archivo.categoria}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "#A0AABA" }}>—</span>
        )}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B6660", whiteSpace: "nowrap" }}>
        {formatBytes(archivo.tamano_bytes)}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span
          className="inline-flex items-center gap-1 px-2 rounded-full"
          style={{
            height: 20,
            background: archivo.activo ? "#DCFCE7" : "#FEF3C7",
            fontSize: 11,
            fontWeight: 700,
            color: archivo.activo ? "#065F46" : "#92400E",
          }}
        >
          {archivo.activo ? <Eye size={10} /> : <EyeOff size={10} />}
          {archivo.activo ? "ACTIVO" : "OCULTO"}
        </span>
      </td>
      <td style={{ padding: "12px 16px", textAlign: "right" }}>
        <div className="flex items-center justify-end gap-1.5">
          <a
            href={archivo.archivo_url}
            target="_blank"
            rel="noopener noreferrer"
            title="Ver / descargar archivo"
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              width: 28,
              height: 28,
              background: "#F4F1EB",
              border: "1px solid #E8E4DD",
              borderRadius: 6,
              color: "#1A2B4A",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={12} strokeWidth={2.5} />
          </a>
          <button
            type="button"
            onClick={onStartEdit}
            title="Editar metadatos"
            className="flex items-center justify-center transition-opacity hover:opacity-70"
            style={{
              width: 28,
              height: 28,
              background: "#F4F1EB",
              border: "1px solid #E8E4DD",
              borderRadius: 6,
              color: "#1A2B4A",
              cursor: "pointer",
            }}
          >
            <Edit2 size={12} strokeWidth={2.5} />
          </button>
          <DeleteBtn id={archivo.id} nombre={archivo.nombre} />
        </div>
      </td>
    </tr>
  );
}

function EditingRow({
  archivo,
  onCancel,
}: {
  archivo: ArchivoBancoRow;
  onCancel: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await actualizarArchivoBancoAction({ error: null, ok: false }, fd);
      if (res.error) setError(res.error);
      else onCancel();
    });
  };

  return (
    <tr style={{ borderBottom: "1px solid #F4F1EB", background: "#FAFAF8" }}>
      <td colSpan={5} style={{ padding: "12px 16px" }}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="hidden" name="id" value={archivo.id} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>Nombre</span>
              <input
                type="text"
                name="nombre"
                defaultValue={archivo.nombre}
                required
                style={inputStyle}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>Categoría</span>
              <input
                type="text"
                name="categoria"
                defaultValue={archivo.categoria ?? ""}
                style={inputStyle}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>Descripción</span>
            <textarea
              name="descripcion"
              defaultValue={archivo.descripcion ?? ""}
              rows={2}
              style={{ ...inputStyle, minHeight: 50, paddingTop: 8, paddingBottom: 8, resize: "vertical" }}
            />
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="activo"
              defaultChecked={archivo.activo}
              style={{ width: 14, height: 14, accentColor: "#1A2B4A" }}
            />
            <span style={{ fontSize: 13, color: "#1A2B4A" }}>
              Activo (visible para asociar a plantillas y solicitudes)
            </span>
          </label>
          {error && (
            <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{error}</p>
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1 px-3 rounded-md"
              style={{
                height: 30,
                background: "#FFFFFF",
                fontSize: 13,
                color: "#1A2B4A",
                fontWeight: 600,
                border: "1px solid #E8E4DD",
                cursor: "pointer",
              }}
            >
              <X size={12} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="flex items-center gap-1 px-3 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                height: 30,
                background: "#1A2B4A",
                fontSize: 13,
                color: "#FFFFFF",
                fontWeight: 600,
                border: "none",
                cursor: pending ? "wait" : "pointer",
              }}
            >
              <Save size={12} />
              {pending ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </td>
    </tr>
  );
}

function DeleteBtn({ id, nombre }: { id: string; nombre: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={eliminarArchivoBancoAction}>
      <input type="hidden" name="id" value={id} />
      {/* `type="button"`: abre el diálogo. El envío real lo dispara
          `requestSubmit()` al confirmar. */}
      <SubmitDelete onPulsar={() => setConfirmando(true)} />

      <DialogoConfirmacion
        abierto={confirmando}
        titulo={`¿Eliminar «${nombre}» del banco?`}
        descripcion={
          <>
            Se desvincula de todas las plantillas y solicitudes que lo usaban.{" "}
            <strong style={{ color: "#1A2B4A" }}>No se puede deshacer.</strong>
          </>
        }
        textoConfirmar="Eliminar archivo"
        onConfirmar={() => {
          setConfirmando(false);
          formRef.current?.requestSubmit();
        }}
        onCancelar={() => setConfirmando(false)}
      />
    </form>
  );
}

function SubmitDelete({ onPulsar }: { onPulsar: () => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="button"
      onClick={onPulsar}
      disabled={pending}
      title="Eliminar"
      className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-40"
      style={{
        width: 28,
        height: 28,
        background: "#FEE2E2",
        border: "1px solid #FCA5A5",
        borderRadius: 6,
        color: "#991B1B",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      <Trash2 size={12} strokeWidth={2.5} />
    </button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 34,
  padding: "6px 10px",
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  fontSize: 13,
  color: "#1A2B4A",
  outline: "none",
  fontFamily: "inherit",
};
