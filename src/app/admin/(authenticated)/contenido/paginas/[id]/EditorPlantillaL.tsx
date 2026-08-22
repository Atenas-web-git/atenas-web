"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaL,
  FichaItemPlantillaL,
  ActividadPlantillaL,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Hero = ContenidoPlantillaL["hero"];
type Detalle = ContenidoPlantillaL["detalle"];
type Actividades = ContenidoPlantillaL["actividades"];

export function EditorPlantillaL({
  paginaId,
  slug,
  initialTitulo,
  initialContenido,
  initialMetaTitle,
  initialMetaDescription,
  initialPublicada,
}: {
  paginaId: string;
  slug: string;
  initialTitulo: string;
  initialContenido: ContenidoPlantillaL;
  initialMetaTitle: string;
  initialMetaDescription: string;
  initialPublicada: boolean;
}) {
  const [state, action, isPending] = useActionState<PaginaActionState, FormData>(
    guardarPaginaAction,
    { error: null, ok: false }
  );

  const [titulo, setTitulo] = useState(initialTitulo);
  const [publicada, setPublicada] = useState(initialPublicada);
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription);

  const [hero, setHero] = useState<Hero>(initialContenido.hero);
  const [detalle, setDetalle] = useState<Detalle>(initialContenido.detalle);
  const [actividades, setActividades] = useState<Actividades>(initialContenido.actividades);

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({ hero, detalle, actividades });

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <Sticky publicada={publicada} setPublicada={setPublicada} state={state} isPending={isPending} />

      <Card title="Información general">
        <Field label="Título interno" hint="Solo se ve en el backoffice. No afecta la página pública.">
          <input type="text" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="Slug (URL)" hint="No editable.">
          <input type="text" value={`/${slug}`} readOnly disabled style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }} />
        </Field>
        <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
          La nav lateral entre espacios hermanos (CAS, Cultura, Idioma, etc.) es fija en código.
        </p>
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <DetalleEditor detalle={detalle} setDetalle={setDetalle} prefix={`${safePrefix}/detalle`} />
      <ActividadesEditor actividades={actividades} setActividades={setActividades} prefix={`${safePrefix}/actividades`} />

      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previsualizaciones.">
        <Field label="Meta title" hint="Recomendado: 50-60 caracteres.">
          <input type="text" name="meta_title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={120} style={inputStyle} />
        </Field>
        <Field label="Meta description" hint="Recomendado: 140-160 caracteres.">
          <textarea name="meta_description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} maxLength={300} style={textareaStyle} />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Hero ─── */

function HeroEditor({ hero, setHero, prefix }: { hero: Hero; setHero: (h: Hero) => void; prefix: string }) {
  const set = (patch: Partial<Hero>) => setHero({ ...hero, ...patch });

  return (
    <Card title="Bloque 1 — Hero" subtitle="Cabecera de la ficha del espacio.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" hint="ej. ESPACIOS DE DESARROLLO">
          <input type="text" value={hero.badge ?? ""} onChange={(e) => set({ badge: e.target.value || undefined })} style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint="Texto enorme decorativo de fondo (ej. CAS, GLOBAL).">
          <input type="text" value={hero.ghostText ?? ""} onChange={(e) => set({ ghostText: e.target.value || undefined })} placeholder={hero.title.toUpperCase()} style={inputStyle} />
        </Field>
      </div>
      <Field label="Título principal" required>
        <input type="text" value={hero.title} onChange={(e) => set({ title: e.target.value })} required style={inputStyle} />
      </Field>
      <Field label="Subtítulo">
        <textarea value={hero.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value || undefined })} rows={2} style={textareaStyle} />
      </Field>
      <ImageUploader
        label="Imagen de fondo del hero (opcional)"
        value={hero.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa el fondo genérico."
      />
    </Card>
  );
}

/* ─── Detalle (párrafos + tags + ficha + nota + foto) ─── */

function DetalleEditor({ detalle, setDetalle, prefix }: { detalle: Detalle; setDetalle: (d: Detalle) => void; prefix: string }) {
  const set = (patch: Partial<Detalle>) => setDetalle({ ...detalle, ...patch });

  /* párrafos */
  const updateP = (i: number, value: string) =>
    set({ paragraphs: detalle.paragraphs.map((p, idx) => (idx === i ? value : p)) });
  const addP = () => set({ paragraphs: [...detalle.paragraphs, ""] });
  const removeP = (i: number) =>
    set({ paragraphs: detalle.paragraphs.filter((_, idx) => idx !== i) });
  const moveP = (i: number, dir: -1 | 1) => {
    const next = [...detalle.paragraphs];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ paragraphs: next });
  };

  /* tags */
  const updateTag = (i: number, value: string) =>
    set({ tags: detalle.tags.map((t, idx) => (idx === i ? value : t)) });
  const addTag = () => set({ tags: [...detalle.tags, ""] });
  const removeTag = (i: number) => set({ tags: detalle.tags.filter((_, idx) => idx !== i) });

  /* ficha */
  const updateFicha = (i: number, patch: Partial<FichaItemPlantillaL>) =>
    set({ ficha: detalle.ficha.map((f, idx) => (idx === i ? { ...f, ...patch } : f)) });
  const addFicha = () =>
    set({ ficha: [...detalle.ficha, { label: "", value: "" }] });
  const removeFicha = (i: number) =>
    set({ ficha: detalle.ficha.filter((_, idx) => idx !== i) });
  const moveFicha = (i: number, dir: -1 | 1) => {
    const next = [...detalle.ficha];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ ficha: next });
  };

  return (
    <Card
      title="Bloque 2 — Detalle del espacio"
      subtitle="Sección con badge, título, párrafos, tags, ficha técnica de 4 filas, nota destacada y foto lateral."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" required hint='ej. "VASE — Valores, Actitudes…"'>
          <input type="text" value={detalle.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Encabezado (h2)" required>
          <input type="text" value={detalle.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
      </div>

      {/* párrafos */}
      <span style={fieldLabel}>Párrafos {detalle.paragraphs.length > 0 && `(${detalle.paragraphs.length})`}</span>
      <div className="flex flex-col gap-3">
        {detalle.paragraphs.map((p, i) => (
          <div key={i} className="flex flex-col gap-2 p-4" style={panelStyle}>
            <RowHeader index={i} total={detalle.paragraphs.length} onMove={(d) => moveP(i, d)} onRemove={() => removeP(i)} />
            <textarea value={p} onChange={(e) => updateP(i, e.target.value)} rows={3} style={textareaStyle} />
          </div>
        ))}
      </div>
      <button type="button" onClick={addP} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar párrafo
      </button>

      {/* tags */}
      <span style={fieldLabel}>Tags / chips {detalle.tags.length > 0 && `(${detalle.tags.length})`}</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Chips de palabras clave debajo de los párrafos (ej. "IB", "Servicio").
      </p>
      <div className="flex flex-wrap gap-2">
        {detalle.tags.map((t, i) => (
          <div key={i} className="flex items-center gap-1.5 px-2" style={{ ...panelStyle, height: 36 }}>
            <input
              type="text"
              value={t}
              onChange={(e) => updateTag(i, e.target.value)}
              placeholder="ej. IB"
              style={{ ...inputStyle, height: 28, background: "transparent", border: "none", paddingLeft: 4, paddingRight: 4, fontSize: 13 }}
            />
            <button type="button" onClick={() => removeTag(i)} style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA", width: 22, height: 22 }} aria-label="Eliminar tag">
              <Trash2 size={11} strokeWidth={2.5} />
            </button>
          </div>
        ))}
        <button type="button" onClick={addTag} style={{ ...addButton, height: 36, paddingLeft: 12, paddingRight: 12 }} className="flex items-center justify-center gap-1.5">
          <Plus size={12} strokeWidth={2.5} />
          Agregar tag
        </button>
      </div>

      {/* ficha técnica */}
      <span style={fieldLabel}>Ficha técnica {detalle.ficha.length > 0 && `(${detalle.ficha.length})`}</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Recomendado 4 filas. Marca una como destacada (se pinta rojo y bold).
      </p>
      <div className="flex flex-col gap-3">
        {detalle.ficha.map((f, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={detalle.ficha.length} onMove={(d) => moveFicha(i, d)} onRemove={() => removeFicha(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_180px] gap-3">
              <Field label="Etiqueta" required hint='ej. "Niveles"'>
                <input type="text" value={f.label} onChange={(e) => updateFicha(i, { label: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Valor" required hint='ej. "Todos los niveles"'>
                <input type="text" value={f.value} onChange={(e) => updateFicha(i, { value: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Destacar">
                <label className="flex items-center gap-2" style={{ height: 38 }}>
                  <input
                    type="checkbox"
                    checked={f.highlight ?? false}
                    onChange={(e) => updateFicha(i, { highlight: e.target.checked || undefined })}
                    style={{ width: 16, height: 16, accentColor: "#9e1915" }}
                  />
                  <span style={{ fontSize: 13, color: "#1A2B4A" }}>Pintar rojo</span>
                </label>
              </Field>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addFicha} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar fila
      </button>

      {/* nota destacada */}
      <Field label="Nota destacada" hint="Bloque amarillo al pie del detalle.">
        <textarea value={detalle.nota} onChange={(e) => set({ nota: e.target.value })} rows={3} style={textareaStyle} />
      </Field>

      {/* foto lateral */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3">
        <ImageUploader
          label="Foto lateral del detalle"
          value={detalle.photoSrc}
          onChange={(v) => set({ photoSrc: v })}
          prefix={prefix}
          previewAspect="4/3"
        />
        <Field label="Texto alternativo de la foto" hint="Para accesibilidad y SEO.">
          <input type="text" value={detalle.photoAlt} onChange={(e) => set({ photoAlt: e.target.value })} style={inputStyle} />
        </Field>
      </div>
    </Card>
  );
}

/* ─── Actividades ─── */

function ActividadesEditor({
  actividades,
  setActividades,
  prefix,
}: {
  actividades: Actividades;
  setActividades: (a: Actividades) => void;
  prefix: string;
}) {
  const set = (patch: Partial<Actividades>) => setActividades({ ...actividades, ...patch });

  const updateItem = (i: number, patch: Partial<ActividadPlantillaL>) =>
    set({ items: actividades.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addItem = () =>
    set({ items: [...actividades.items, { icon: "✨", title: "", desc: "" }] });
  const removeItem = (i: number) =>
    set({ items: actividades.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...actividades.items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ items: next });
  };

  return (
    <Card
      title="Bloque 3 — Actividades"
      subtitle="Sección oscura con foto de fondo en parallax + título + lista de actividades con emoji."
    >
      <Field label="Título de la sección" required hint='ej. "Lo que hacemos en CAS"'>
        <input type="text" value={actividades.title} onChange={(e) => set({ title: e.target.value })} required style={inputStyle} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-3">
        <ImageUploader
          label="Foto de fondo (con parallax)"
          value={actividades.photoSrc}
          onChange={(v) => set({ photoSrc: v })}
          prefix={prefix}
          previewAspect="16/9"
        />
        <Field label="Caption de la foto" hint='Aparece como pie de foto (ej. "Festival cultural — Atenas").'>
          <input type="text" value={actividades.photoCaption} onChange={(e) => set({ photoCaption: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Actividades {actividades.items.length > 0 && `(${actividades.items.length})`}</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Recomendado 4-6 actividades. Marca una como destacada (se pinta rojo).
      </p>
      <div className="flex flex-col gap-3">
        {actividades.items.map((it, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={actividades.items.length} onMove={(d) => moveItem(i, d)} onRemove={() => removeItem(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_140px] gap-3">
              <Field label="Emoji">
                <input type="text" value={it.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="🎵" style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={it.title} onChange={(e) => updateItem(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Destacar">
                <label className="flex items-center gap-2" style={{ height: 38 }}>
                  <input
                    type="checkbox"
                    checked={it.highlight ?? false}
                    onChange={(e) => updateItem(i, { highlight: e.target.checked || undefined })}
                    style={{ width: 16, height: 16, accentColor: "#9e1915" }}
                  />
                  <span style={{ fontSize: 13, color: "#1A2B4A" }}>Rojo</span>
                </label>
              </Field>
            </div>
            <Field label="Descripción" required>
              <textarea value={it.desc} onChange={(e) => updateItem(i, { desc: e.target.value })} required rows={2} style={textareaStyle} />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar actividad
      </button>
    </Card>
  );
}

/* ─── Helpers ─── */

function RowHeader({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span style={panelLabel}>#{index + 1}</span>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Subir" style={iconButton(index === 0)}>
          <ArrowUp size={12} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Bajar" style={iconButton(index === total - 1)}>
          <ArrowDown size={12} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={onRemove} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
          <Trash2 size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function Sticky({ publicada, setPublicada, state, isPending }: { publicada: boolean; setPublicada: (b: boolean) => void; state: PaginaActionState; isPending: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="publicada"
          checked={publicada}
          onChange={(e) => setPublicada(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
          {publicada ? "Página publicada" : "Página en borrador (no visible al público)"}
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
          {isPending ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}>
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
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

const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 };
const hintStyle: React.CSSProperties = { fontSize: 11, color: "#A0AABA", lineHeight: 1.5 };
const inputStyle: React.CSSProperties = { height: 38, border: "1px solid #E8E4DD", borderRadius: 6, paddingLeft: 12, paddingRight: 12, fontSize: 14, color: "#1A2B4A", background: "#FAFAF8", outline: "none", fontFamily: "inherit" };
const textareaStyle: React.CSSProperties = { ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" };
const panelStyle: React.CSSProperties = { background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 };
const panelLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#A0AABA", textTransform: "uppercase", letterSpacing: 0.5 };
const addButton: React.CSSProperties = { height: 36, background: "transparent", color: "#1A2B4A", border: "1px dashed #C9C4BB", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" };

function iconButton(disabled: boolean): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : "#1A2B4A",
    border: "1px solid #E8E4DD",
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}
