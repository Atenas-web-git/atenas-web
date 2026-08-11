"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type { ContenidoPlantillaH } from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { HighlightPreview } from "@/components/admin/HighlightPreview";

type Hero = ContenidoPlantillaH["hero"];
type Niveles = ContenidoPlantillaH["niveles"];
type Metodologias = ContenidoPlantillaH["metodologias"];
type CTA = ContenidoPlantillaH["cta"];

export function EditorPlantillaH({
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
  initialContenido: ContenidoPlantillaH;
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
  const [niveles, setNiveles] = useState<Niveles>(initialContenido.niveles);
  const [metodologias, setMetodologias] = useState<Metodologias>(initialContenido.metodologias);
  const [cta, setCta] = useState<CTA>(initialContenido.cta);

  // Bloque «Iniciar admisión» del final. Sus textos tienen valor por defecto
  // en el componente, así que aquí vacío significa «usa el de por defecto»,
  // NO «escóndelo»: para eso está la casilla.
  const [ctaAdmOculto, setCtaAdmOculto] = useState(initialContenido.ctaAdmision?.oculto ?? false);
  const [ctaAdmHeading, setCtaAdmHeading] = useState(initialContenido.ctaAdmision?.heading ?? "");
  const [ctaAdmDescripcion, setCtaAdmDescripcion] = useState(initialContenido.ctaAdmision?.descripcion ?? "");
  const [ctaAdmLabel, setCtaAdmLabel] = useState(initialContenido.ctaAdmision?.ctaLabel ?? "");
  const [ctaAdmHref, setCtaAdmHref] = useState(initialContenido.ctaAdmision?.href ?? "");

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({
    hero, niveles, metodologias, cta,
    ctaAdmision: {
      oculto: ctaAdmOculto || undefined,
      href: ctaAdmHref.trim() || undefined,
      heading: ctaAdmHeading.trim() || undefined,
      descripcion: ctaAdmDescripcion.trim() || undefined,
      ctaLabel: ctaAdmLabel.trim() || undefined,
    },
  });

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <Sticky publicada={publicada} setPublicada={setPublicada} state={state} isPending={isPending} />

      <Card title="Información general">
        <Field label="Título interno" hint="Solo se ve en el backoffice.">
          <input type="text" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="Slug (URL)" hint="No editable.">
          <input type="text" value={`/${slug}`} readOnly disabled style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }} />
        </Field>
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <NivelesEditor niveles={niveles} setNiveles={setNiveles} prefix={`${safePrefix}/niveles`} />
      <MetodologiasEditor met={metodologias} setMet={setMetodologias} prefix={`${safePrefix}/metodologias`} />
      <CTAEditor cta={cta} setCta={setCta} prefix={`${safePrefix}/cta`} />

      <Card
        title="Bloque 5 — Botón «Iniciar admisión»"
        subtitle="El bloque claro del final que lleva a Admisiones. Todos los textos ya vienen escritos: si los dejas vacíos se usan esos. Para quitarlo de la página, marca la casilla."
      >
        <label className="flex items-start gap-3 cursor-pointer" style={{ marginBottom: 18 }}>
          <input
            type="checkbox"
            checked={ctaAdmOculto}
            onChange={(e) => setCtaAdmOculto(e.target.checked)}
            style={{ width: 16, height: 16, marginTop: 2, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, color: "#1A2B4A", lineHeight: 1.5 }}>
            No mostrar este bloque en la página
            <br />
            <span style={{ fontSize: 12, color: "#6B6660" }}>
              Quien llegue al final de esta página se quedará sin un botón para empezar la admisión.
            </span>
          </span>
        </label>
        <Field label="Título" hint='Por defecto: "¿Listo para dar el paso?".'>
          <input
            type="text"
            value={ctaAdmHeading}
            onChange={(e) => setCtaAdmHeading(e.target.value)}
            placeholder="¿Listo para dar el paso?"
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción" hint="Una o dos frases debajo del título.">
          <textarea
            value={ctaAdmDescripcion}
            onChange={(e) => setCtaAdmDescripcion(e.target.value)}
            rows={2}
            placeholder="Cuéntanos de tu hijo o hija y te acompañamos en el proceso, paso a paso. Sin compromiso."
            style={{ ...inputStyle, height: "auto", resize: "vertical", minHeight: 60, paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
        <Field label="Texto del botón" hint='Por defecto: "Iniciar el proceso de admisión".'>
          <input
            type="text"
            value={ctaAdmLabel}
            onChange={(e) => setCtaAdmLabel(e.target.value)}
            placeholder="Iniciar el proceso de admisión"
            maxLength={60}
            style={inputStyle}
          />
        </Field>
        <Field
          label="A dónde lleva el botón"
          hint="Déjalo vacío y apunta a Admisiones. Vaciarlo NO esconde el bloque: para eso está la casilla de arriba."
        >
          <input
            type="text"
            value={ctaAdmHref}
            onChange={(e) => setCtaAdmHref(e.target.value)}
            placeholder="/admisiones"
            style={inputStyle}
          />
        </Field>
      </Card>

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
  const setPhoto = (i: number, src: string) => {
    const next = [...hero.floatingPhotos] as [string, string, string];
    next[i] = src;
    setHero({ ...hero, floatingPhotos: next });
  };

  const updateChip = (i: number, patch: Partial<{ texto: string; highlight?: boolean }>) =>
    set({ chips: hero.chips.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  const addChip = () => set({ chips: [...hero.chips, { texto: "" }] });
  const removeChip = (i: number) => set({ chips: hero.chips.filter((_, idx) => idx !== i) });
  const moveChip = (i: number, dir: -1 | 1) => {
    const next = [...hero.chips];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ chips: next });
  };

  return (
    <Card title="Bloque 1 — Hero" subtitle="Cabecera con collage flotante de 3 fotos, badge dorado con número grande y chips de niveles.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" required>
          <input type="text" value={hero.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint="Texto enorme decorativo de fondo.">
          <input type="text" value={hero.ghostText} onChange={(e) => set({ ghostText: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Título — línea 1 (blanco)" required>
          <input type="text" value={hero.titleLine1} onChange={(e) => set({ titleLine1: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Título — línea 2 (dorado)" required>
          <input type="text" value={hero.titleLine2} onChange={(e) => set({ titleLine2: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Subtítulo">
        <textarea value={hero.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>
      <Field label="Fragmento subrayado en dorado del subtítulo" hint='Escribe una palabra o frase del subtítulo para subrayarla en dorado. No importan mayúsculas ni tildes. Ej.: subtítulo "Bienvenido a Atenas" → escribe "Atenas".'>
        <input type="text" value={hero.subtitleHighlight} onChange={(e) => set({ subtitleHighlight: e.target.value })} style={inputStyle} />
      </Field>
      <HighlightPreview text={hero.subtitle} highlight={hero.subtitleHighlight} />

      <ImageUploader label="Imagen de fondo del hero" value={hero.bgImageSrc ?? ""} onChange={(v) => set({ bgImageSrc: v })} prefix={prefix} previewAspect="16/9" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto collage 1 (grande izq.)" value={hero.floatingPhotos[0]} onChange={(v) => setPhoto(0, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto collage 2 (mediana der.)" value={hero.floatingPhotos[1]} onChange={(v) => setPhoto(1, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto collage 3 (pequeña izq.)" value={hero.floatingPhotos[2]} onChange={(v) => setPhoto(2, v)} prefix={prefix} previewAspect="4/3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge dorado flotante — número/valor" hint="Texto grande del badge (ej. 5).">
          <input type="text" value={hero.floatingBadgeValue} onChange={(e) => set({ floatingBadgeValue: e.target.value })} style={inputStyle} />
        </Field>
        <Field label="Badge dorado flotante — etiqueta" hint="Texto pequeño debajo (ej. NIVELES EDUCATIVOS).">
          <input type="text" value={hero.floatingBadgeLabel} onChange={(e) => set({ floatingBadgeLabel: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Chips de niveles {hero.chips.length > 0 && `(${hero.chips.length})`}</span>
      <div className="flex flex-col gap-2">
        {hero.chips.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={c.texto} onChange={(e) => updateChip(i, { texto: e.target.value })} placeholder="ej. Inicial" style={{ ...inputStyle, flex: 1 }} />
            <label className="flex items-center gap-1 px-3" style={{ ...panelStyle, height: 38 }}>
              <input type="checkbox" checked={c.highlight ?? false} onChange={(e) => updateChip(i, { highlight: e.target.checked || undefined })} style={{ accentColor: "#1A2B4A" }} />
              <span style={{ fontSize: 11, color: "#1A2B4A" }}>Dorado</span>
            </label>
            <button type="button" onClick={() => moveChip(i, -1)} disabled={i === 0} style={iconButton(i === 0)} aria-label="Subir">
              <ArrowUp size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => moveChip(i, 1)} disabled={i === hero.chips.length - 1} style={iconButton(i === hero.chips.length - 1)} aria-label="Bajar">
              <ArrowDown size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => removeChip(i)} style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }} aria-label="Eliminar">
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addChip} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar chip
      </button>
    </Card>
  );
}

/* ─── Niveles ─── */

function NivelesEditor({ niveles, setNiveles, prefix }: { niveles: Niveles; setNiveles: (n: Niveles) => void; prefix: string }) {
  const set = (patch: Partial<Niveles>) => setNiveles({ ...niveles, ...patch });
  const setPhoto = (i: number, src: string) => {
    const next = [...niveles.headerPhotos] as [string, string, string];
    next[i] = src;
    set({ headerPhotos: next });
  };

  const updateItem = (i: number, patch: Partial<Niveles["items"][number]>) =>
    set({ items: niveles.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const addItem = () =>
    set({ items: [...niveles.items, { num: "", title: "", grades: "", age: "", methods: [], desc: "" }] });
  const removeItem = (i: number) => set({ items: niveles.items.filter((_, idx) => idx !== i) });
  const moveItem = (i: number, dir: -1 | 1) => {
    const next = [...niveles.items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ items: next });
  };

  return (
    <Card title="Bloque 2 — Niveles educativos" subtitle="5 cards en fila desktop con número, título, edades, descripción, métodos (chips) y badge opcional.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={niveles.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Parte resaltada del título" hint='Escribe una palabra o frase del encabezado para subrayarla en dorado. No importan mayúsculas ni tildes.'>
          <input type="text" value={niveles.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Encabezado (h2)" required>
        <input type="text" value={niveles.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
      </Field>
      <HighlightPreview text={niveles.heading} highlight={niveles.headingHighlight} />
      <Field label="Descripción">
        <textarea value={niveles.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto header 1 (grande izq.)" value={niveles.headerPhotos[0]} onChange={(v) => setPhoto(0, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto header 2 (der.)" value={niveles.headerPhotos[1]} onChange={(v) => setPhoto(1, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto header 3 (pequeña izq.)" value={niveles.headerPhotos[2]} onChange={(v) => setPhoto(2, v)} prefix={prefix} previewAspect="4/3" />
      </div>

      <Field label="Badge dorado sobre el collage" hint="Aparece flotante sobre el collage de fotos del header (ej. IB ACREDITADO ★).">
        <input type="text" value={niveles.badgeAcreditado} onChange={(e) => set({ badgeAcreditado: e.target.value })} style={inputStyle} />
      </Field>

      <span style={fieldLabel}>Niveles {niveles.items.length > 0 && `(${niveles.items.length})`}</span>
      <div className="flex flex-col gap-3">
        {niveles.items.map((it, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={niveles.items.length} onMove={(d) => moveItem(i, d)} onRemove={() => removeItem(i)} />
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <Field label="Número" hint="ej. 01, IB★">
                <input type="text" value={it.num} onChange={(e) => updateItem(i, { num: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={it.title} onChange={(e) => updateItem(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Grados" hint="ej. 1ro a 7mo EGB">
                <input type="text" value={it.grades} onChange={(e) => updateItem(i, { grades: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Rango de edades" hint="ej. 5-12 años">
                <input type="text" value={it.age} onChange={(e) => updateItem(i, { age: e.target.value })} style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea value={it.desc} onChange={(e) => updateItem(i, { desc: e.target.value })} rows={3} style={textareaStyle} />
            </Field>
            <Field label="Métodos (separados por coma)" hint="ej. Montessori, Reggio Emilia, ABN">
              <input
                type="text"
                value={it.methods.join(", ")}
                onChange={(e) => updateItem(i, { methods: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                style={inputStyle}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nota (opcional)" hint='Aparece con un "⚠" antes del texto.'>
                <input type="text" value={it.note ?? ""} onChange={(e) => updateItem(i, { note: e.target.value || undefined })} style={inputStyle} />
              </Field>
              <Field label="Badge (opcional)" hint='Etiqueta dorada destacada (ej. ÚNICO IB EN AMBATO).'>
                <input type="text" value={it.badge ?? ""} onChange={(e) => updateItem(i, { badge: e.target.value || undefined })} style={inputStyle} />
              </Field>
            </div>
            <Field label="Destacado">
              <label className="flex items-center gap-2" style={{ height: 38 }}>
                <input type="checkbox" checked={it.highlight ?? false} onChange={(e) => updateItem(i, { highlight: e.target.checked || undefined })} style={{ width: 16, height: 16, accentColor: "#1A2B4A" }} />
                <span style={{ fontSize: 12, color: "#1A2B4A" }}>Card con fondo navy + borde dorado</span>
              </label>
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar nivel
      </button>
    </Card>
  );
}

/* ─── Metodologías ─── */

function MetodologiasEditor({ met, setMet, prefix }: { met: Metodologias; setMet: (m: Metodologias) => void; prefix: string }) {
  const set = (patch: Partial<Metodologias>) => setMet({ ...met, ...patch });

  const updateStrip = (i: number, patch: Partial<Metodologias["strip"][number]>) =>
    set({ strip: met.strip.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const addStrip = () => set({ strip: [...met.strip, { src: "", caption: "" }] });
  const removeStrip = (i: number) => set({ strip: met.strip.filter((_, idx) => idx !== i) });

  const updateCard = (i: number, patch: Partial<Metodologias["cards"][number]>) =>
    set({ cards: met.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  const addCard = () =>
    set({ cards: [...met.cards, { icon: "🌿", img: "", scope: "", title: "", desc: "" }] });
  const removeCard = (i: number) => set({ cards: met.cards.filter((_, idx) => idx !== i) });
  const moveCard = (i: number, dir: -1 | 1) => {
    const next = [...met.cards];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ cards: next });
  };

  return (
    <Card title="Bloque 3 — Metodologías" subtitle="Strip horizontal de 3 fotos con caption + grid de 4 cards (icono emoji + foto top + scope + título + descripción).">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={met.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Parte resaltada del título" hint='Escribe una palabra o frase del encabezado para subrayarla en dorado. No importan mayúsculas ni tildes.'>
          <input type="text" value={met.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Encabezado (h2)" required>
        <input type="text" value={met.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
      </Field>
      <HighlightPreview text={met.heading} highlight={met.headingHighlight} />

      <span style={fieldLabel}>Strip de fotos {met.strip.length > 0 && `(${met.strip.length})`}</span>
      <div className="flex flex-col gap-3">
        {met.strip.map((s, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <div className="flex items-center justify-between gap-2">
              <span style={panelLabel}>Foto strip #{i + 1}</span>
              <button type="button" onClick={() => removeStrip(i)} style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }} aria-label="Eliminar">
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
            <ImageUploader label="" value={s.src} onChange={(v) => updateStrip(i, { src: v })} prefix={prefix} previewAspect="4/3" />
            <Field label="Caption (texto blanco abajo izq.)">
              <input type="text" value={s.caption} onChange={(e) => updateStrip(i, { caption: e.target.value })} style={inputStyle} />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addStrip} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar foto al strip
      </button>

      <span style={fieldLabel}>Cards de metodologías {met.cards.length > 0 && `(${met.cards.length})`}</span>
      <div className="flex flex-col gap-3">
        {met.cards.map((c, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={met.cards.length} onMove={(d) => moveCard(i, d)} onRemove={() => removeCard(i)} />
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <Field label="Icono (emoji)">
                <input type="text" value={c.icon} onChange={(e) => updateCard(i, { icon: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={c.title} onChange={(e) => updateCard(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Alcance (scope)" hint="Línea pequeña dorada (ej. Educación Inicial).">
              <input type="text" value={c.scope} onChange={(e) => updateCard(i, { scope: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Descripción">
              <textarea value={c.desc} onChange={(e) => updateCard(i, { desc: e.target.value })} rows={2} style={textareaStyle} />
            </Field>
            <ImageUploader label="Foto top de la card" value={c.img} onChange={(v) => updateCard(i, { img: v })} prefix={prefix} previewAspect="16/9" />
            <Field label="Estilo dark">
              <label className="flex items-center gap-2" style={{ height: 38 }}>
                <input type="checkbox" checked={c.dark ?? false} onChange={(e) => updateCard(i, { dark: e.target.checked || undefined })} style={{ width: 16, height: 16, accentColor: "#1A2B4A" }} />
                <span style={{ fontSize: 12, color: "#1A2B4A" }}>Tarjeta con fondo navy oscuro</span>
              </label>
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addCard} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar card
      </button>
    </Card>
  );
}

/* ─── CTA ─── */

function CTAEditor({ cta, setCta, prefix }: { cta: CTA; setCta: (c: CTA) => void; prefix: string }) {
  const set = (patch: Partial<CTA>) => setCta({ ...cta, ...patch });
  const setStat = (i: number, patch: Partial<{ value: string; label: string; sub: string }>) => {
    const next = [...cta.stats] as CTA["stats"];
    next[i] = { ...next[i], ...patch };
    set({ stats: next });
  };

  const updateChip = (i: number, val: string) =>
    set({ chips: cta.chips.map((c, idx) => (idx === i ? { texto: val } : c)) });
  const addChip = () => set({ chips: [...cta.chips, { texto: "" }] });
  const removeChip = (i: number) => set({ chips: cta.chips.filter((_, idx) => idx !== i) });

  return (
    <Card title="Bloque 4 — CTA con stats card" subtitle="Sección oscura con texto + botón a la izquierda y tarjeta de 3 stats (la del medio destacada en dorado) + foto al final.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={cta.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Ghost text">
          <input type="text" value={cta.ghostText} onChange={(e) => set({ ghostText: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Encabezado (h2)" required>
          <input type="text" value={cta.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Parte resaltada del título" hint='Escribe una palabra o frase del encabezado para subrayarla en dorado. No importan mayúsculas ni tildes.'>
          <input type="text" value={cta.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <HighlightPreview text={cta.heading} highlight={cta.headingHighlight} />
      <Field label="Descripción">
        <textarea value={cta.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={3} style={textareaStyle} />
      </Field>

      <ImageUploader label="Imagen de fondo (parallax)" value={cta.bgImageSrc ?? ""} onChange={(v) => set({ bgImageSrc: v })} prefix={prefix} previewAspect="16/9" />

      <span style={fieldLabel}>Chips dorados {cta.chips.length > 0 && `(${cta.chips.length})`}</span>
      <div className="flex flex-col gap-2">
        {cta.chips.map((c, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input type="text" value={c.texto} onChange={(e) => updateChip(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
            <button type="button" onClick={() => removeChip(i)} style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }} aria-label="Eliminar">
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addChip} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar chip
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Texto del botón">
          <input type="text" value={cta.btnText} onChange={(e) => set({ btnText: e.target.value })} style={inputStyle} />
        </Field>
        <Field label="Link del botón">
          <input type="text" value={cta.btnHref} onChange={(e) => set({ btnHref: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Stats (3 datos en tarjeta lateral)</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cta.stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <span style={panelLabel}>Stat #{i + 1}{i === 1 && " (destacada)"}</span>
            <Field label="Valor (grande, dorado)">
              <input type="text" value={s.value} onChange={(e) => setStat(i, { value: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Etiqueta principal">
              <input type="text" value={s.label} onChange={(e) => setStat(i, { label: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Subtítulo">
              <input type="text" value={s.sub} onChange={(e) => setStat(i, { sub: e.target.value })} style={inputStyle} />
            </Field>
          </div>
        ))}
      </div>

      <ImageUploader label="Foto pequeña al final de la stats card" value={cta.statsCardImg} onChange={(v) => set({ statsCardImg: v })} prefix={prefix} previewAspect="16/9" />
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
        <input type="checkbox" name="publicada" checked={publicada} onChange={(e) => setPublicada(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1A2B4A" }} />
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
          style={{ height: 36, background: "#1A2B4A", color: "#FFFFFF", border: "none", fontSize: 13, fontWeight: 600, cursor: isPending ? "wait" : "pointer", opacity: isPending ? 0.7 : 1 }}
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
  return { width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: disabled ? "#C9C4BB" : "#1A2B4A", border: "1px solid #E8E4DD", borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" };
}
