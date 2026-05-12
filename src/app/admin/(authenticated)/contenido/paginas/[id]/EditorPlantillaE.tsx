"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaE,
  ShowcaseItemPlantillaE,
  LogroPlantillaE,
  FotoGaleriaPlantillaE,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Hero = ContenidoPlantillaE["hero"];
type Showcase = ContenidoPlantillaE["showcase"];
type Logros = ContenidoPlantillaE["logros"];
type Galeria = ContenidoPlantillaE["galeria"];

export function EditorPlantillaE({
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
  initialContenido: ContenidoPlantillaE;
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
  const [logros, setLogros] = useState<Logros>(initialContenido.logros);
  const [galeria, setGaleria] = useState<Galeria>(initialContenido.galeria);

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({ hero, showcase, logros, galeria });

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
          Esta plantilla cubre las landings de reconocimientos (academicos, deportivos) y los detalles por slug (olimpiadas, basquetbol, etc.). El showcase es solo para las landings — déjalo vacío en los detalles.
        </p>
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <ShowcaseEditor showcase={showcase} setShowcase={setShowcase} prefix={`${safePrefix}/showcase`} />
      <LogrosEditor logros={logros} setLogros={setLogros} prefix={`${safePrefix}/logros`} />
      <GaleriaEditor galeria={galeria} setGaleria={setGaleria} prefix={`${safePrefix}/galeria`} />

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
    <Card title="Bloque 1 — Hero" subtitle="Cabecera de la página con badge, título grande, subtítulo, ghost text decorativo y foto de fondo opcional.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" hint='ej. "RECONOCIMIENTOS"'>
          <input type="text" value={hero.badge ?? ""} onChange={(e) => set({ badge: e.target.value || undefined })} style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint='Texto enorme decorativo (ej. "ACADÉMICO", "DEPORTIVO").'>
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
        label="Foto de fondo del hero (opcional)"
        value={hero.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
      />
    </Card>
  );
}

/* ─── Showcase (solo en landings) ─── */

function ShowcaseEditor({ showcase, setShowcase, prefix }: { showcase: Showcase; setShowcase: (s: Showcase) => void; prefix: string }) {
  const set = (patch: Partial<Showcase>) => setShowcase({ ...showcase, ...patch });

  const updateItem = (i: number, patch: Partial<ShowcaseItemPlantillaE>) =>
    set({ items: showcase.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addItem = () =>
    set({
      items: [
        ...showcase.items,
        { slug: "", icon: "🏆", nombre: "", count: "", countLabel: "", photoSrc: "", basePath: "/reconocimientos/academicos" },
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
      title="Bloque 2 — Showcase de disciplinas (solo landings)"
      subtitle='4 cards con icono+nombre+contador grande+foto de fondo. Aparece SOLO en las landings ("/reconocimientos/academicos" y "/reconocimientos/deportivos"). En los detalles por slug, deja la lista vacía y el bloque no se renderiza.'
    >
      <Field
        label='Href del botón "Ver todos"'
        hint="Generalmente apunta a la misma landing. Si lo dejas vacío, no aparece el botón."
      >
        <input
          type="text"
          value={showcase.verTodosHref}
          onChange={(e) => set({ verTodosHref: e.target.value })}
          placeholder="/reconocimientos/academicos"
          style={inputStyle}
        />
      </Field>

      <span style={fieldLabel}>Disciplinas {showcase.items.length > 0 && `(${showcase.items.length})`}</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        El link de cada card se construye con <code style={{ fontFamily: "ui-monospace, monospace" }}>{"{basePath}/{slug}"}</code>.
      </p>
      <div className="flex flex-col gap-3">
        {showcase.items.map((item, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={showcase.items.length} onMove={(d) => moveItem(i, d)} onRemove={() => removeItem(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-3">
              <Field label="Icono (emoji)">
                <input type="text" value={item.icon} onChange={(e) => updateItem(i, { icon: e.target.value })} placeholder="🥇" style={inputStyle} />
              </Field>
              <Field label="Nombre" required>
                <input type="text" value={item.nombre} onChange={(e) => updateItem(i, { nombre: e.target.value })} required placeholder="ej. Olimpiadas" style={inputStyle} />
              </Field>
              <Field label="Slug" hint="se concatena al basePath">
                <input type="text" value={item.slug} onChange={(e) => updateItem(i, { slug: e.target.value })} placeholder="olimpiadas" style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3">
              <Field label="Contador" hint='ej. 20, "95%", "Top 5"'>
                <input
                  type="text"
                  value={String(item.count)}
                  onChange={(e) => updateItem(i, { count: e.target.value })}
                  style={inputStyle}
                />
              </Field>
              <Field label="Etiqueta del contador" hint='ej. "Medallas obtenidas"'>
                <input type="text" value={item.countLabel} onChange={(e) => updateItem(i, { countLabel: e.target.value })} style={inputStyle} />
              </Field>
            </div>
            <Field label="Base path" hint='Prefijo común (ej. "/reconocimientos/academicos").'>
              <input type="text" value={item.basePath} onChange={(e) => updateItem(i, { basePath: e.target.value })} style={inputStyle} />
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
        Agregar disciplina
      </button>
    </Card>
  );
}

/* ─── Logros destacados ─── */

function LogrosEditor({ logros, setLogros, prefix }: { logros: Logros; setLogros: (l: Logros) => void; prefix: string }) {
  const set = (patch: Partial<Logros>) => setLogros({ ...logros, ...patch });

  const updateLogro = (i: number, patch: Partial<LogroPlantillaE>) =>
    set({ items: logros.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addLogro = () =>
    set({
      items: [
        ...logros.items,
        { icon: "🏆", deporte: "", titulo: "", year: String(new Date().getFullYear()), categoria: "", photos: ["", ""] },
      ],
    });
  const removeLogro = (i: number) => set({ items: logros.items.filter((_, idx) => idx !== i) });
  const moveLogro = (i: number, dir: -1 | 1) => {
    const next = [...logros.items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ items: next });
  };

  const updateFoto = (i: number, j: number, src: string) => {
    const item = logros.items[i];
    const nextPhotos = [...item.photos];
    nextPhotos[j] = src;
    updateLogro(i, { photos: nextPhotos });
  };
  const addFoto = (i: number) => {
    const item = logros.items[i];
    updateLogro(i, { photos: [...item.photos, ""] });
  };
  const removeFoto = (i: number, j: number) => {
    const item = logros.items[i];
    updateLogro(i, { photos: item.photos.filter((_, idx) => idx !== j) });
  };

  return (
    <Card
      title="Bloque 3 — Logros destacados"
      subtitle="Tarjetas grandes con icono + título + año + categoría + 2-4 fotos del momento. El usuario navega entre las fotos tocando los puntos de cada tarjeta. Marca uno como destacado (highlight) para diferenciarlo visualmente."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Heading (h2)" required>
          <input type="text" value={logros.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Subheading">
          <input type="text" value={logros.subheading} onChange={(e) => set({ subheading: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Logros {logros.items.length > 0 && `(${logros.items.length})`}</span>
      <div className="flex flex-col gap-3">
        {logros.items.map((logro, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={logros.items.length} onMove={(d) => moveLogro(i, d)} onRemove={() => removeLogro(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-3">
              <Field label="Icono (emoji)">
                <input type="text" value={logro.icon} onChange={(e) => updateLogro(i, { icon: e.target.value })} placeholder="🥇" style={inputStyle} />
              </Field>
              <Field label="Categoría corta" hint='ej. "Olimpiadas", "Diploma IB"'>
                <input type="text" value={logro.deporte} onChange={(e) => updateLogro(i, { deporte: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Año">
                <input type="text" value={logro.year} onChange={(e) => updateLogro(i, { year: e.target.value })} placeholder="2024" style={inputStyle} />
              </Field>
            </div>
            <Field label="Título del logro" required>
              <input type="text" value={logro.titulo} onChange={(e) => updateLogro(i, { titulo: e.target.value })} required placeholder="ej. Medalla de Oro — Matemáticas" style={inputStyle} />
            </Field>
            <Field label="Subcategoría / competencia" hint='ej. "Olimpiada Nacional Estudiantil"'>
              <input type="text" value={logro.categoria} onChange={(e) => updateLogro(i, { categoria: e.target.value })} style={inputStyle} />
            </Field>
            <label className="flex items-center gap-2" style={{ height: 32 }}>
              <input
                type="checkbox"
                checked={logro.highlight ?? false}
                onChange={(e) => updateLogro(i, { highlight: e.target.checked || undefined })}
                style={{ width: 16, height: 16, accentColor: "#C9A84C" }}
              />
              <span style={{ fontSize: 12, color: "#1A2B4A" }}>
                Logro destacado (borde dorado / acento especial)
              </span>
            </label>

            <span style={panelLabel}>Fotos del logro ({logro.photos.length})</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {logro.photos.map((p, j) => (
                <div key={j} className="flex flex-col gap-2">
                  <ImageUploader
                    label={`Foto ${j + 1}`}
                    value={p}
                    onChange={(v) => updateFoto(i, j, v)}
                    prefix={prefix}
                    previewAspect="4/3"
                  />
                  {logro.photos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFoto(i, j)}
                      style={{ ...addButton, color: "#991B1B", borderColor: "#FECACA" }}
                      className="flex items-center justify-center gap-1.5 self-start px-3"
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                      Eliminar foto {j + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addFoto(i)}
              style={addButton}
              className="flex items-center justify-center gap-1.5 self-start px-4"
            >
              <Plus size={14} strokeWidth={2.5} />
              Agregar foto al logro
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addLogro} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar logro
      </button>
    </Card>
  );
}

/* ─── Galería ─── */

function GaleriaEditor({ galeria, setGaleria, prefix }: { galeria: Galeria; setGaleria: (g: Galeria) => void; prefix: string }) {
  const set = (patch: Partial<Galeria>) => setGaleria({ ...galeria, ...patch });

  const updatePhoto = (i: number, patch: Partial<FotoGaleriaPlantillaE>) =>
    set({ photos: galeria.photos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const addPhoto = () => set({ photos: [...galeria.photos, { src: "", alt: "" }] });
  const removePhoto = (i: number) => set({ photos: galeria.photos.filter((_, idx) => idx !== i) });
  const movePhoto = (i: number, dir: -1 | 1) => {
    const next = [...galeria.photos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ photos: next });
  };

  return (
    <Card
      title="Bloque 4 — Galería"
      subtitle="Conjunto de fotos en collage al pie de la página. Cada foto tiene src + alt text para accesibilidad."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Título" required>
          <input type="text" value={galeria.titulo} onChange={(e) => set({ titulo: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Subtítulo">
          <input type="text" value={galeria.subtitulo} onChange={(e) => set({ subtitulo: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Fotos {galeria.photos.length > 0 && `(${galeria.photos.length})`}</span>
      <div className="flex flex-col gap-3">
        {galeria.photos.map((p, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={galeria.photos.length} onMove={(d) => movePhoto(i, d)} onRemove={() => removePhoto(i)} />
            <ImageUploader
              label="Foto"
              value={p.src}
              onChange={(v) => updatePhoto(i, { src: v })}
              prefix={prefix}
              previewAspect="4/3"
            />
            <Field label="Texto alternativo (alt)" hint="Importante para accesibilidad y SEO.">
              <input type="text" value={p.alt} onChange={(e) => updatePhoto(i, { alt: e.target.value })} placeholder="ej. Ceremonia de premiación" style={inputStyle} />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addPhoto} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar foto
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
