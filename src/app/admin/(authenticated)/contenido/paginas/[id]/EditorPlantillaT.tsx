"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaT,
  PortalCardItem,
} from "../../plantillas";

const ACCENT_OPTIONS: { value: PortalCardItem["accentColor"]; label: string }[] = [
  { value: "gold", label: "Rojo institucional" },
  { value: "navy", label: "Navy" },
  { value: "red", label: "Rojo" },
];

export function EditorPlantillaT({
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
  initialContenido: ContenidoPlantillaT;
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
  const [heroEyebrow, setHeroEyebrow] = useState(initialContenido.hero?.eyebrow ?? "");
  const [heroTitle, setHeroTitle] = useState(initialContenido.hero?.title ?? "");
  const [heroDescription, setHeroDescription] = useState(initialContenido.hero?.description ?? "");

  // Intro
  const [introTitulo, setIntroTitulo] = useState(initialContenido.intro?.titulo ?? "");
  const [introDescripcion, setIntroDescripcion] = useState(initialContenido.intro?.descripcion ?? "");

  // Cards
  const [cards, setCards] = useState<PortalCardItem[]>(initialContenido.cards ?? []);

  // Nota pie
  const [notaTitulo, setNotaTitulo] = useState(initialContenido.notaPie?.tituloNegrita ?? "");
  const [notaTexto, setNotaTexto] = useState(initialContenido.notaPie?.texto ?? "");
  const [notaLinkLabel, setNotaLinkLabel] = useState(initialContenido.notaPie?.linkLabel ?? "");
  const [notaLinkHref, setNotaLinkHref] = useState(initialContenido.notaPie?.linkHref ?? "");

  const updateCard = (i: number, patch: Partial<PortalCardItem>) =>
    setCards((arr) => arr.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const addCard = () =>
    setCards((arr) => [
      ...arr,
      {
        badge: "Acceso",
        title: "Nuevo acceso",
        description: "Descripción del acceso.",
        bullets: [],
        ctaLabel: "Acceder",
        ctaHref: "",
        accentColor: "gold",
      },
    ]);
  const removeCard = (i: number) =>
    setCards((arr) => arr.filter((_, idx) => idx !== i));
  const moveCard = (i: number, delta: number) => {
    setCards((arr) => {
      const next = [...arr];
      const j = i + delta;
      if (j < 0 || j >= next.length) return next;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const updateBullet = (cardIdx: number, bulletIdx: number, value: string) =>
    setCards((arr) =>
      arr.map((c, idx) =>
        idx === cardIdx
          ? { ...c, bullets: c.bullets.map((b, bi) => (bi === bulletIdx ? value : b)) }
          : c
      )
    );
  const addBullet = (cardIdx: number) =>
    setCards((arr) =>
      arr.map((c, idx) =>
        idx === cardIdx ? { ...c, bullets: [...c.bullets, ""] } : c
      )
    );
  const removeBullet = (cardIdx: number, bulletIdx: number) =>
    setCards((arr) =>
      arr.map((c, idx) =>
        idx === cardIdx
          ? { ...c, bullets: c.bullets.filter((_, bi) => bi !== bulletIdx) }
          : c
      )
    );

  const contenidoJson = JSON.stringify({
    hero: {
      eyebrow: heroEyebrow,
      title: heroTitle,
      description: heroDescription,
    },
    intro: {
      titulo: introTitulo,
      descripcion: introDescripcion,
    },
    cards: cards
      .map((c) => ({
        badge: c.badge.trim(),
        title: c.title.trim(),
        description: c.description.trim(),
        bullets: c.bullets.map((b) => b.trim()).filter(Boolean),
        ctaLabel: c.ctaLabel.trim(),
        ctaHref: c.ctaHref.trim(),
        accentColor: c.accentColor,
      }))
      .filter((c) => c.title && c.ctaHref),
    notaPie: {
      tituloNegrita: notaTitulo,
      texto: notaTexto,
      linkLabel: notaLinkLabel,
      linkHref: notaLinkHref,
    },
  });

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

      <Card title="Hero (cabecera navy)" subtitle="Eyebrow + título + descripción sobre fondo gradient navy.">
        <Field label="Eyebrow">
          <input
            type="text"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="Portal Familiar"
            style={inputStyle}
          />
        </Field>
        <Field label="Título" required>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            required
            placeholder="Tu acceso directo a Atenas"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            rows={2}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
      </Card>

      <Card title="Introducción (opcional)" subtitle="Texto opcional entre el hero y las cards. Si los dos campos están vacíos, no se renderiza.">
        <Field label="Título introductorio">
          <input
            type="text"
            value={introTitulo}
            onChange={(e) => setIntroTitulo(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción introductoria">
          <textarea
            value={introDescripcion}
            onChange={(e) => setIntroDescripcion(e.target.value)}
            rows={3}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
      </Card>

      <Card
        title="Cards de acceso"
        subtitle="Cada card tiene badge + título + descripción + lista de beneficios + CTA. Si la URL empieza con http, se abre en nueva pestaña."
      >
        <div className="flex flex-col gap-4">
          {cards.map((c, i) => (
            <CardEditor
              key={i}
              index={i}
              total={cards.length}
              card={c}
              update={(patch) => updateCard(i, patch)}
              remove={() => removeCard(i)}
              moveUp={() => moveCard(i, -1)}
              moveDown={() => moveCard(i, 1)}
              updateBullet={(bi, v) => updateBullet(i, bi, v)}
              addBullet={() => addBullet(i)}
              removeBullet={(bi) => removeBullet(i, bi)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addCard}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar card
        </button>
      </Card>

      <Card
        title="Nota al pie (opcional)"
        subtitle="Tarjeta amarilla al final con un texto adicional + link. Si los campos están vacíos, no se renderiza."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título en negrita" hint='Ej. "¿Aún no postulas?"'>
            <input
              type="text"
              value={notaTitulo}
              onChange={(e) => setNotaTitulo(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Texto del cuerpo">
            <input
              type="text"
              value={notaTexto}
              onChange={(e) => setNotaTexto(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Texto del link">
            <input
              type="text"
              value={notaLinkLabel}
              onChange={(e) => setNotaLinkLabel(e.target.value)}
              placeholder="Inicia tu proceso de admisión →"
              style={inputStyle}
            />
          </Field>
          <Field label="URL del link">
            <input
              type="text"
              value={notaLinkHref}
              onChange={(e) => setNotaLinkHref(e.target.value)}
              placeholder="/admisiones"
              style={inputStyle}
            />
          </Field>
        </div>
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

function CardEditor({
  index,
  total,
  card,
  update,
  remove,
  moveUp,
  moveDown,
  updateBullet,
  addBullet,
  removeBullet,
}: {
  index: number;
  total: number;
  card: PortalCardItem;
  update: (patch: Partial<PortalCardItem>) => void;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
  updateBullet: (bi: number, value: string) => void;
  addBullet: () => void;
  removeBullet: (bi: number) => void;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Card {index + 1}
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
            aria-label="Eliminar card"
            style={iconButton}
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_120px] gap-2">
        <Field label="Badge">
          <input
            type="text"
            value={card.badge}
            onChange={(e) => update({ badge: e.target.value })}
            style={inputStyle}
          />
        </Field>
        <Field label="Título" required>
          <input
            type="text"
            value={card.title}
            onChange={(e) => update({ title: e.target.value })}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Color">
          <select
            value={card.accentColor}
            onChange={(e) =>
              update({ accentColor: e.target.value as PortalCardItem["accentColor"] })
            }
            style={inputStyle}
          >
            {ACCENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Descripción">
        <textarea
          value={card.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={2}
          style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          Bullets (beneficios)
        </span>
        {card.bullets.map((b, bi) => (
          <div key={bi} className="flex items-center gap-2">
            <input
              type="text"
              value={b}
              onChange={(e) => updateBullet(bi, e.target.value)}
              placeholder="Beneficio…"
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => removeBullet(bi)}
              aria-label="Eliminar bullet"
              style={iconButton}
            >
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addBullet}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-3"
        >
          <Plus size={12} strokeWidth={2.5} /> Agregar bullet
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Field label="Texto del CTA">
          <input
            type="text"
            value={card.ctaLabel}
            onChange={(e) => update({ ctaLabel: e.target.value })}
            placeholder="Acceder"
            style={inputStyle}
          />
        </Field>
        <Field
          label="URL del CTA"
          hint="Si empieza con http(s), se abre en nueva pestaña."
        >
          <input
            type="text"
            value={card.ctaHref}
            onChange={(e) => update({ ctaHref: e.target.value })}
            placeholder="/admisiones/seguimiento"
            style={inputStyle}
          />
        </Field>
      </div>
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
      <span
        style={{
          fontSize: 12,
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
        <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
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
  fontSize: 14,
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
  fontSize: 13,
};
const addButton: React.CSSProperties = {
  height: 36,
  background: "transparent",
  color: "#1A2B4A",
  border: "1px dashed #C9C4BB",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
