"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type { ContenidoPlantillaR, PersonaItem } from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AnchorIdField } from "./AnchorIdField";

export function EditorPlantillaR({
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
  initialContenido: ContenidoPlantillaR;
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

  // Hero
  const [heroBadge, setHeroBadge] = useState(initialContenido.hero?.badge ?? "");
  const [heroTitle, setHeroTitle] = useState(initialContenido.hero?.title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialContenido.hero?.subtitle ?? "");
  const [heroGhost, setHeroGhost] = useState(initialContenido.hero?.ghostText ?? "");
  const [heroFootnote, setHeroFootnote] = useState(initialContenido.hero?.footnote ?? "");
  const [heroBg, setHeroBg] = useState(initialContenido.hero?.bgImageSrc ?? "");

  // Sección
  const [seccionBadge, setSeccionBadge] = useState(initialContenido.seccion?.badge ?? "");
  const [seccionHeading, setSeccionHeading] = useState(initialContenido.seccion?.heading ?? "");
  const [seccionPeriod, setSeccionPeriod] = useState(initialContenido.seccion?.period ?? "");
  const [seccionNote, setSeccionNote] = useState(initialContenido.seccion?.note ?? "");
  const [items, setItems] = useState<PersonaItem[]>(initialContenido.seccion?.items ?? []);

  const [anchorId, setAnchorId] = useState(initialContenido.anchorId ?? "");

  const updatePersona = (i: number, patch: Partial<PersonaItem>) =>
    setItems((arr) => arr.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPersona = () =>
    setItems((arr) => [
      ...arr,
      { cargo: "Cargo", nombre: "Nombre", email: "", photoSrc: "" },
    ]);
  const removePersona = (i: number) =>
    setItems((arr) => arr.filter((_, idx) => idx !== i));
  const movePersona = (i: number, delta: number) => {
    setItems((arr) => {
      const next = [...arr];
      const j = i + delta;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const contenidoJson = JSON.stringify({
    hero: {
      badge: heroBadge,
      title: heroTitle,
      subtitle: heroSubtitle,
      ghostText: heroGhost,
      footnote: heroFootnote,
      bgImageSrc: heroBg,
    },
    seccion: {
      badge: seccionBadge,
      heading: seccionHeading,
      period: seccionPeriod,
      items: items
        .map((p) => ({
          cargo: p.cargo.trim(),
          nombre: p.nombre.trim(),
          email: p.email?.trim() || undefined,
          photoSrc: p.photoSrc?.trim() || undefined,
        }))
        .filter((p) => p.cargo && p.nombre),
      note: seccionNote,
    },
    anchorId,
  });

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <Sticky
        state={state}
        isPending={isPending}
        publicada={publicada}
        setPublicada={setPublicada}
      />

      <Card title="Información general">
        <Field label="Título interno">
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Slug (URL)" hint="No editable desde aquí.">
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      <Card title="Hero (cabecera)" subtitle="Badge + título + subtítulo + ghost text + imagen de fondo opcional.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge (eyebrow)">
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="DIRECTORIO"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text">
            <input
              type="text"
              value={heroGhost}
              onChange={(e) => setHeroGhost(e.target.value)}
              placeholder="DIRECTORIO"
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Título" required>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Subtítulo">
          <input
            type="text"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field
          label="Pie del hero (opcional)"
          hint='Texto pequeño al pie del hero. Si lo dejas vacío, se muestra "Unidad Educativa Atenas · Izamba, Ambato".'
        >
          <input
            type="text"
            value={heroFootnote}
            onChange={(e) => setHeroFootnote(e.target.value)}
            placeholder="Unidad Educativa Atenas · Izamba, Ambato"
            style={inputStyle}
          />
        </Field>
        <ImageUploader
          label="Imagen de fondo del hero (opcional)"
          value={heroBg}
          onChange={setHeroBg}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
        />
      </Card>

      <Card
        title="Sección — Grid de personas"
        subtitle="Encabezado + período opcional + grid de tarjetas (cargo + nombre + foto opcional + email opcional) + nota al pie."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge de sección">
            <input
              type="text"
              value={seccionBadge}
              onChange={(e) => setSeccionBadge(e.target.value)}
              placeholder="DIRECTORIO FCEA"
              style={inputStyle}
            />
          </Field>
          <Field label="Período (opcional)" hint='Ej. "2021–2026". Aparece como pill dorado al lado del heading.'>
            <input
              type="text"
              value={seccionPeriod}
              onChange={(e) => setSeccionPeriod(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Heading" required>
          <input
            type="text"
            value={seccionHeading}
            onChange={(e) => setSeccionHeading(e.target.value)}
            required
            placeholder="Directorio de la Fundación"
            style={inputStyle}
          />
        </Field>

        <div className="flex flex-col gap-4">
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9e1915",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginTop: 4,
            }}
          >
            Personas
          </span>
          {items.map((p, i) => (
            <PersonaEditor
              key={i}
              index={i}
              total={items.length}
              persona={p}
              update={(patch) => updatePersona(i, patch)}
              remove={() => removePersona(i)}
              moveUp={() => movePersona(i, -1)}
              moveDown={() => movePersona(i, 1)}
              prefix={`${safePrefix}/personas/${i}`}
            />
          ))}
          <button
            type="button"
            onClick={addPersona}
            style={addButton}
            className="flex items-center justify-center gap-1.5 self-start px-4"
          >
            <Plus size={14} strokeWidth={2.5} /> Agregar persona
          </button>
        </div>

        <Field label="Nota al pie (opcional)">
          <textarea
            value={seccionNote}
            onChange={(e) => setSeccionNote(e.target.value)}
            rows={2}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>

        <AnchorIdField value={anchorId} onChange={setAnchorId} slug={slug} />
      </Card>

      <Card title="SEO">
        <Field label="Meta title">
          <input
            type="text"
            name="meta_title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Meta description">
          <textarea
            name="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            maxLength={300}
            style={{
              ...inputStyle,
              height: "auto",
              minHeight: 50,
              paddingTop: 10,
              paddingBottom: 10,
              resize: "vertical",
            }}
          />
        </Field>
      </Card>
    </form>
  );
}

function PersonaEditor({
  index,
  total,
  persona,
  update,
  remove,
  moveUp,
  moveDown,
  prefix,
}: {
  index: number;
  total: number;
  persona: PersonaItem;
  update: (patch: Partial<PersonaItem>) => void;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  prefix: string;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Persona {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={moveUp}
            disabled={index === 0}
            aria-label="Mover arriba"
            style={{
              ...iconButtonNeutral,
              opacity: index === 0 ? 0.35 : 1,
              cursor: index === 0 ? "not-allowed" : "pointer",
            }}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={moveDown}
            disabled={index === total - 1}
            aria-label="Mover abajo"
            style={{
              ...iconButtonNeutral,
              opacity: index === total - 1 ? 0.35 : 1,
              cursor: index === total - 1 ? "not-allowed" : "pointer",
            }}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={remove}
            aria-label="Eliminar persona"
            style={iconButton}
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Field label="Cargo" required>
          <input
            type="text"
            value={persona.cargo}
            onChange={(e) => update({ cargo: e.target.value })}
            placeholder="Presidente/a"
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Nombre" required>
          <input
            type="text"
            value={persona.nombre}
            onChange={(e) => update({ nombre: e.target.value })}
            placeholder="Nombre Apellido"
            required
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="Email (opcional)" hint="Si lo defines, aparece como link mailto bajo el cargo.">
        <input
          type="email"
          value={persona.email ?? ""}
          onChange={(e) => update({ email: e.target.value })}
          placeholder="persona@atenas.edu.ec"
          style={inputStyle}
        />
      </Field>

      <ImageUploader
        label="Foto (opcional)"
        value={persona.photoSrc ?? ""}
        onChange={(v) => update({ photoSrc: v })}
        prefix={prefix}
        previewAspect="1/1"
      />
    </div>
  );
}

function Sticky({
  state,
  isPending,
  publicada,
  setPublicada,
}: {
  state: PaginaActionState;
  isPending: boolean;
  publicada: boolean;
  setPublicada: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
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
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
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
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
const iconButton: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "#991B1B",
  border: "1px solid #FECACA",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
};
const iconButtonNeutral: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "#1A2B4A",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 12,
};
const addButton: React.CSSProperties = {
  height: 36,
  background: "transparent",
  color: "#1A2B4A",
  border: "1px dashed #C9C4BB",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
