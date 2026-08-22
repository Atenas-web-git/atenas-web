"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { guardarLogroAction, type ReconocimientosActionState } from "./actions";

type SubOpt = { id: number; nombre: string };
type Foto = { src: string; alt: string };

type LogroInicial = {
  id: number | null;
  categoriaId: number;
  categoriaSlug: string;
  subcategoriaId: number | null;
  icon: string;
  titulo: string;
  year: string;
  descripcion: string;
  highlight: boolean;
  visible: boolean;
  orden: number;
  fotos: Foto[];
};

const DEFAULT: Omit<LogroInicial, "categoriaId" | "categoriaSlug"> = {
  id: null,
  subcategoriaId: null,
  icon: "🏆",
  titulo: "",
  year: "",
  descripcion: "",
  highlight: false,
  visible: true,
  orden: 0,
  fotos: [],
};

const INITIAL_STATE: ReconocimientosActionState = { error: null, ok: false };

export function LogroForm({
  inicial,
  subcategorias,
}: {
  inicial: { categoriaId: number; categoriaSlug: string } & Partial<LogroInicial>;
  subcategorias: SubOpt[];
}) {
  const init: LogroInicial = { ...DEFAULT, ...inicial };
  const [state, formAction] = useActionState(guardarLogroAction, INITIAL_STATE);
  const [fotos, setFotos] = useState<Foto[]>(init.fotos);

  const update = (i: number, field: keyof Foto, value: string) =>
    setFotos((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  const add = () => setFotos((prev) => [...prev, { src: "", alt: "" }]);
  const remove = (i: number) => setFotos((prev) => prev.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    setFotos((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {init.id !== null && <input type="hidden" name="id" value={init.id} />}
      <input type="hidden" name="categoriaId" value={init.categoriaId} />

      <Section title="Logro">
        <Row>
          <Field label="Icono (emoji)" hint="Aparece en la tarjeta del logro">
            <input
              name="icon"
              defaultValue={init.icon}
              maxLength={4}
              style={{ ...inputStyle, maxWidth: 80, textAlign: "center", fontSize: 20 }}
            />
          </Field>
          <Field label="Subcategoría" hint="Opcional. Si vacío, el logro queda directo en la categoría.">
            <select name="subcategoriaId" defaultValue={init.subcategoriaId ?? ""} style={inputStyle}>
              <option value="">— Sin subcategoría —</option>
              {subcategorias.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </Field>
        </Row>
        <Field label="Título del logro" hint='Ej. "Campeones Provinciales", "Medalla de Oro Nacional"'>
          <input name="titulo" defaultValue={init.titulo} required style={inputStyle} />
        </Field>
        <Row>
          <Field label="Año" hint='Ej. "2023" o "2022-2023"'>
            <input name="year" defaultValue={init.year} style={{ ...inputStyle, maxWidth: 160 }} />
          </Field>
          <Field label="Orden" hint="Menor = primero">
            <input
              name="orden"
              type="number"
              defaultValue={init.orden}
              style={{ ...inputStyle, maxWidth: 100 }}
            />
          </Field>
        </Row>
        <Field label="Descripción / categoría" hint='Texto secundario debajo del título. Ej. "Categoría masculina sub-18"'>
          <input name="descripcion" defaultValue={init.descripcion} style={inputStyle} />
        </Field>
        <Row>
          <Field label="Destacado" hint="Aparece en la sección 'Logros destacados' (landing + página /logros)">
            <label style={checkboxLabel}>
              <input type="checkbox" name="highlight" defaultChecked={init.highlight} />
              <span>Marcar como destacado</span>
            </label>
          </Field>
          <Field label="Visibilidad">
            <label style={checkboxLabel}>
              <input type="checkbox" name="visible" defaultChecked={init.visible} />
              <span>Visible públicamente</span>
            </label>
          </Field>
        </Row>
      </Section>

      <Section title="Fotos del logro (mini-galería rotativa)">
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
          Cada logro tiene su propio carrusel de fotos. Si añades varias, en el frontend
          aparecen como puntos navegables debajo de la tarjeta. Recomendado: 1 a 5 fotos.
        </p>
        {fotos.map((f, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-3 p-3"
            style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 8 }}
          >
            <div style={{ width: 140, flexShrink: 0 }}>
              <ImageUploader
                value={f.src}
                onChange={(url) => update(i, "src", url)}
                prefix={`reconocimientos/${init.categoriaSlug}/logros`}
                previewAspect="1/1"
              />
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label className="flex flex-col gap-1">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
                  Alt (descripción accesible)
                </span>
                <input
                  value={f.alt}
                  onChange={(e) => update(i, "alt", e.target.value)}
                  placeholder="Ej. Equipo recibiendo trofeo"
                  style={smallInputStyle}
                />
              </label>
              <input type="hidden" name={`foto_${i}`} value={f.src} />
              <input type="hidden" name={`foto_alt_${i}`} value={f.alt} />
              <div className="flex gap-2 mt-auto">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
                  style={iconBtn}
                  aria-label="Mover arriba"
                >
                  <ArrowUp size={13} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === fotos.length - 1}
                  className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
                  style={iconBtn}
                  aria-label="Mover abajo"
                >
                  <ArrowDown size={13} strokeWidth={2.5} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="flex items-center gap-1 px-2 transition-opacity hover:opacity-70"
                  style={{
                    height: 28,
                    background: "#FEE2E2",
                    fontSize: 12,
                    color: "#991B1B",
                    fontWeight: 600,
                    border: "1px solid #FCA5A5",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={11} strokeWidth={2.5} />
                  Quitar
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1.5 px-3 self-start transition-opacity hover:opacity-70"
          style={{
            height: 34,
            background: "#F4F1EB",
            fontSize: 13,
            color: "#1A2B4A",
            fontWeight: 600,
            border: "1px dashed #C9C0B0",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          <Plus size={12} strokeWidth={2.5} />
          Añadir foto
        </button>
      </Section>

      {state.error && <ErrorBanner message={state.error} />}
      {state.ok && init.id !== null && <SuccessBanner message="Cambios guardados" />}

      <div className="flex justify-end gap-3">
        <SubmitButton isEditing={init.id !== null} />
      </div>
    </form>
  );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{
        height: 40,
        background: "#1A2B4A",
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: 600,
        border: "none",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear logro"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 12, color: "#6B6660" }}>{hint}</span>}
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-md"
      style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
    >
      <p style={{ fontSize: 14, color: "#991B1B", margin: 0 }}>{message}</p>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-md"
      style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
    >
      <p style={{ fontSize: 14, color: "#065F46", margin: 0 }}>{message}</p>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 38,
  padding: "9px 12px",
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  fontSize: 14,
  color: "#1A2B4A",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const smallInputStyle: React.CSSProperties = {
  width: "100%",
  height: 32,
  padding: "0 10px",
  background: "#FFFFFF",
  border: "1px solid #E8E4DD",
  borderRadius: 4,
  fontSize: 13,
  color: "#1A2B4A",
  outline: "none",
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  color: "#1A2B4A",
  cursor: "pointer",
};

const iconBtn: React.CSSProperties = {
  width: 28,
  height: 28,
  background: "#FFFFFF",
  color: "#1A2B4A",
  border: "1px solid #E8E4DD",
  borderRadius: 4,
  cursor: "pointer",
};
