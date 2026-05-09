"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaJ,
  ShowcaseItemPlantillaJ,
  PasoMatriculaPlantillaJ,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Hero = ContenidoPlantillaJ["hero"];
type Showcase = ContenidoPlantillaJ["showcase"];
type Proceso = ContenidoPlantillaJ["proceso"];

export function EditorPlantillaJ({
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
  initialContenido: ContenidoPlantillaJ;
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
  const [showcase, setShowcase] = useState<Showcase>(initialContenido.showcase);
  const [proceso, setProceso] = useState<Proceso>(initialContenido.proceso);

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({ hero, showcase, proceso });

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
        <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
          El banner de fechas (FechasBanner) se edita aparte en{" "}
          <a href="/admin/configuracion/fechas-matriculas" style={{ color: "#1A2B4A", fontWeight: 500 }}>
            configuración → fechas de matrículas
          </a>
          . La nav lateral entre Proceso/Valores/Autorizaciones es fija.
        </p>
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <ShowcaseEditor showcase={showcase} setShowcase={setShowcase} prefix={`${safePrefix}/showcase`} />
      <ProcesoEditor proceso={proceso} setProceso={setProceso} prefix={`${safePrefix}/proceso`} />

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
    <Card title="Bloque 1 — Hero" subtitle="Cabecera de la página de matrículas.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" hint="ej. MATRÍCULAS 2026–2027">
          <input type="text" value={hero.badge ?? ""} onChange={(e) => set({ badge: e.target.value || undefined })} style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint="Texto enorme decorativo de fondo.">
          <input type="text" value={hero.ghostText ?? ""} onChange={(e) => set({ ghostText: e.target.value || undefined })} placeholder={hero.title.toUpperCase()} style={inputStyle} />
        </Field>
      </div>
      <Field label="Título principal" required>
        <input type="text" value={hero.title} onChange={(e) => set({ title: e.target.value })} required style={inputStyle} />
      </Field>
      <Field label="Subtítulo">
        <textarea value={hero.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value || undefined })} rows={2} style={textareaStyle} />
      </Field>
      <Field label="Pie del hero" hint="Texto pequeño al final del hero. Déjalo vacío para usar el default.">
        <input type="text" value={hero.footnote ?? ""} onChange={(e) => set({ footnote: e.target.value || undefined })} placeholder="Unidad Educativa Atenas · Izamba, Ambato" style={inputStyle} />
      </Field>
      <ImageUploader
        label="Imagen de fondo del hero"
        value={hero.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa la imagen genérica por defecto."
      />
    </Card>
  );
}

/* ─── Showcase ─── */

function ShowcaseEditor({ showcase, setShowcase, prefix }: { showcase: Showcase; setShowcase: (s: Showcase) => void; prefix: string }) {
  const set = (patch: Partial<Showcase>) => setShowcase({ ...showcase, ...patch });

  const updateItem = (i: number, patch: Partial<ShowcaseItemPlantillaJ>) =>
    set({ items: showcase.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addItem = () =>
    set({
      items: [
        ...showcase.items,
        { slug: "", icon: "📋", nombre: "", count: "", countLabel: "", photoSrc: "", basePath: "/matriculas" },
      ],
    });
  const removeItem = (i: number) => set({ items: showcase.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...showcase.items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ items: next });
  };

  return (
    <Card
      title="Bloque 2 — Showcase de categorías"
      subtitle="Sección oscura con tarjetas que linkean a las subpáginas (Proceso/Valores/Autorizaciones)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Encabezado (h2)" required>
          <input type="text" value={showcase.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Texto del CTA" hint="Aparece como botón en cada card (ej. 'Ver detalle').">
          <input type="text" value={showcase.ctaText} onChange={(e) => set({ ctaText: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Cards {showcase.items.length > 0 && `(${showcase.items.length})`}</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        El link de cada card se construye con <code style={{ fontFamily: "ui-monospace, monospace" }}>{"{base}/{slug}"}</code>.
      </p>
      <div className="flex flex-col gap-3">
        {showcase.items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={showcase.items.length} onMove={(d) => moveItem(i, d)} onRemove={() => removeItem(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-3">
              <Field label="Icono (emoji)">
                <input type="text" value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="📋" style={inputStyle} />
              </Field>
              <Field label="Nombre" required>
                <input type="text" value={item.nombre} onChange={(e) => updateItem(i, { nombre: e.target.value })} required placeholder="ej. Proceso" style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_180px] gap-3">
              <Field label="Contador" hint='ej. "5"'>
                <input type="text" value={item.count} onChange={(e) => updateItem(i, { count: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Etiqueta del contador" hint='ej. "pasos simples"'>
                <input type="text" value={item.countLabel} onChange={(e) => updateItem(i, { countLabel: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Slug" hint="se concatena al base">
                <input type="text" value={item.slug} onChange={(e) => updateItem(i, { slug: e.target.value })} placeholder="proceso" style={inputStyle} />
              </Field>
            </div>
            <Field label="Ruta base" hint="Default: /matriculas. Generalmente no cambia.">
              <input type="text" value={item.basePath} onChange={(e) => updateItem(i, { basePath: e.target.value })} placeholder="/matriculas" style={inputStyle} />
            </Field>
            <ImageUploader
              label="Foto de la card"
              value={item.photoSrc}
              onChange={(v) => updateItem(i, { photoSrc: v })}
              prefix={prefix}
              previewAspect="4/3"
            />
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar card
      </button>
    </Card>
  );
}

/* ─── Proceso ─── */

function ProcesoEditor({ proceso, setProceso, prefix }: { proceso: Proceso; setProceso: (p: Proceso) => void; prefix: string }) {
  const set = (patch: Partial<Proceso>) => setProceso({ ...proceso, ...patch });

  const updatePaso = (i: number, patch: Partial<PasoMatriculaPlantillaJ>) =>
    set({ pasos: proceso.pasos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const addPaso = () => set({ pasos: [...proceso.pasos, { num: "", titulo: "", desc: "" }] });
  const removePaso = (i: number) => set({ pasos: proceso.pasos.filter((_, idx) => idx !== i) });
  const movePaso = (i: number, dir: -1 | 1) => {
    const next = [...proceso.pasos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ pasos: next });
  };

  const setFoto = (i: number, src: string) => {
    const next = [...proceso.fotos] as [string, string, string];
    next[i] = src;
    set({ fotos: next });
  };

  return (
    <Card
      title="Bloque 3 — Proceso de matrícula"
      subtitle="Collage de 3 fotos a la izquierda + intro + pasos numerados a la derecha. Marca un paso como rojo (típico para el último de pago)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={proceso.badge} onChange={(e) => set({ badge: e.target.value })} required placeholder="Proceso de Matrícula · 2026–2027" style={inputStyle} />
        </Field>
        <Field label="Encabezado (h2)" required>
          <input type="text" value={proceso.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Subtítulo">
        <textarea value={proceso.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <span style={fieldLabel}>Fotos del collage (3)</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto principal (grande)" value={proceso.fotos[0]} onChange={(v) => setFoto(0, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria 1" value={proceso.fotos[1]} onChange={(v) => setFoto(1, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria 2" value={proceso.fotos[2]} onChange={(v) => setFoto(2, v)} prefix={prefix} previewAspect="4/3" />
      </div>

      <span style={fieldLabel}>Pasos {proceso.pasos.length > 0 && `(${proceso.pasos.length})`}</span>
      <div className="flex flex-col gap-3">
        {proceso.pasos.map((p, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={proceso.pasos.length} onMove={(d) => movePaso(i, d)} onRemove={() => removePaso(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-3">
              <Field label="Número" hint='ej. "01"'>
                <input type="text" value={p.num} onChange={(e) => updatePaso(i, { num: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={p.titulo} onChange={(e) => updatePaso(i, { titulo: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea value={p.desc} onChange={(e) => updatePaso(i, { desc: e.target.value })} rows={2} style={textareaStyle} />
            </Field>
            <Field label="Color rojo (destacado)">
              <label className="flex items-center gap-2" style={{ height: 38 }}>
                <input
                  type="checkbox"
                  checked={p.isRed ?? false}
                  onChange={(e) => updatePaso(i, { isRed: e.target.checked || undefined })}
                  style={{ width: 16, height: 16, accentColor: "#9B1B1B" }}
                />
                <span style={{ fontSize: 12, color: "#1A2B4A" }}>
                  Tarjeta con fondo rojo (típico para el último paso de pago)
                </span>
              </label>
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addPaso} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar paso
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
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
          {publicada ? "Página publicada" : "Página en borrador (no visible al público)"}
        </span>
      </label>
      <div className="flex items-center gap-2">
        {state.error && <span style={{ fontSize: 12, color: "#991B1B" }}>{state.error}</span>}
        {state.ok && <span style={{ fontSize: 12, color: "#065F46" }}>Guardado ✓</span>}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity"
          style={{
            height: 36,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 13,
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
        {subtitle && <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>}
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

const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 };
const hintStyle: React.CSSProperties = { fontSize: 10, color: "#A0AABA", lineHeight: 1.5 };
const inputStyle: React.CSSProperties = { height: 38, border: "1px solid #E8E4DD", borderRadius: 6, paddingLeft: 12, paddingRight: 12, fontSize: 13, color: "#1A2B4A", background: "#FAFAF8", outline: "none", fontFamily: "inherit" };
const textareaStyle: React.CSSProperties = { ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" };
const panelStyle: React.CSSProperties = { background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 };
const panelLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#A0AABA", textTransform: "uppercase", letterSpacing: 0.5 };
const addButton: React.CSSProperties = { height: 36, background: "transparent", color: "#1A2B4A", border: "1px dashed #C9C4BB", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" };

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
