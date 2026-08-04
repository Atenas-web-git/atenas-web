"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo,
} from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaS,
  SeccionPoliticaItem,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function EditorPlantillaS({
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
  initialContenido: ContenidoPlantillaS;
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

  // Meta
  const [versionLabel, setVersionLabel] = useState(initialContenido.meta?.versionLabel ?? "");
  const [audiencia, setAudiencia] = useState(initialContenido.meta?.audiencia ?? "");
  const [fechaVigencia, setFechaVigencia] = useState(initialContenido.meta?.fechaVigencia ?? "");

  // Documento
  const [tituloDocumento, setTituloDocumento] = useState(initialContenido.tituloDocumento ?? "");

  // Secciones
  const [secciones, setSecciones] = useState<SeccionPoliticaItem[]>(
    initialContenido.secciones ?? []
  );

  // CTA pie
  const [ctaTitulo, setCtaTitulo] = useState(initialContenido.ctaPie?.titulo ?? "");
  const [ctaDesc, setCtaDesc] = useState(initialContenido.ctaPie?.descripcion ?? "");
  const [ctaLabel, setCtaLabel] = useState(initialContenido.ctaPie?.ctaLabel ?? "");
  const [ctaHref, setCtaHref] = useState(initialContenido.ctaPie?.ctaHref ?? "");

  const updateSeccion = (i: number, patch: Partial<SeccionPoliticaItem>) =>
    setSecciones((arr) =>
      arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  const addSeccion = () =>
    setSecciones((arr) => [
      ...arr,
      {
        numero: String(arr.length + 1),
        titulo: "Nuevo apartado",
        cuerpoHtml: "<p></p>",
      },
    ]);
  const removeSeccion = (i: number) =>
    setSecciones((arr) => arr.filter((_, idx) => idx !== i));
  const moveSeccion = (i: number, delta: number) => {
    setSecciones((arr) => {
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
    meta: {
      versionLabel,
      audiencia,
      fechaVigencia,
    },
    tituloDocumento,
    secciones: secciones
      .map((s, i) => ({
        numero: s.numero.trim() || String(i + 1),
        titulo: s.titulo.trim(),
        cuerpoHtml: s.cuerpoHtml,
      }))
      .filter((s) => s.titulo),
    ctaPie: {
      titulo: ctaTitulo,
      descripcion: ctaDesc,
      ctaLabel,
      ctaHref,
    },
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
              placeholder="POLÍTICA INSTITUCIONAL"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text (texto fantasma)">
            <input
              type="text"
              value={heroGhost}
              onChange={(e) => setHeroGhost(e.target.value)}
              placeholder="POLÍTICA"
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
        title="Metadatos del documento"
        subtitle="Pills informativos que aparecen al inicio del documento (versión, audiencia, vigencia)."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field label="Versión">
            <input
              type="text"
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              placeholder="Versión 1.0"
              style={inputStyle}
            />
          </Field>
          <Field label="Audiencia">
            <input
              type="text"
              value={audiencia}
              onChange={(e) => setAudiencia(e.target.value)}
              placeholder="Familias y postulantes"
              style={inputStyle}
            />
          </Field>
          <Field label="Vigencia / referencia normativa">
            <input
              type="text"
              value={fechaVigencia}
              onChange={(e) => setFechaVigencia(e.target.value)}
              placeholder="Vigente desde 30 de septiembre de 2024"
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Título grande del documento" required>
          <input
            type="text"
            value={tituloDocumento}
            onChange={(e) => setTituloDocumento(e.target.value)}
            required
            placeholder="Política de tratamiento de datos personales"
            style={inputStyle}
          />
        </Field>
      </Card>

      <Card
        title="Secciones del documento"
        subtitle="Cada sección se renderiza numerada. El cuerpo soporta formato rico (negrita, listas, links) con el editor visual."
      >
        <div className="flex flex-col gap-4">
          {secciones.map((s, i) => (
            <SeccionEditor
              key={i}
              index={i}
              total={secciones.length}
              seccion={s}
              update={(patch) => updateSeccion(i, patch)}
              remove={() => removeSeccion(i)}
              moveUp={() => moveSeccion(i, -1)}
              moveDown={() => moveSeccion(i, 1)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addSeccion}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar sección
        </button>
      </Card>

      <Card title="Tarjeta CTA al pie" subtitle="Tarjeta dorada al final del documento que invita a contactar.">
        <Field label="Título de la tarjeta">
          <input
            type="text"
            value={ctaTitulo}
            onChange={(e) => setCtaTitulo(e.target.value)}
            placeholder="¿Tienes dudas sobre este documento?"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            value={ctaDesc}
            onChange={(e) => setCtaDesc(e.target.value)}
            rows={2}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Texto del CTA">
            <input
              type="text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Ir a Contactos →"
              style={inputStyle}
            />
          </Field>
          <Field label="URL del CTA">
            <input
              type="text"
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/contactos"
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

function SeccionEditor({
  index,
  total,
  seccion,
  update,
  remove,
  moveUp,
  moveDown,
}: {
  index: number;
  total: number;
  seccion: SeccionPoliticaItem;
  update: (patch: Partial<SeccionPoliticaItem>) => void;
  remove: () => void;
  moveUp: () => void;
  moveDown: () => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: seccion.cuerpoHtml || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      update({ cuerpoHtml: editor.getHTML() });
    },
    editorProps: { attributes: { class: "tiptap-editor-s" } },
  });

  if (!editor) return null;

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
          Sección {index + 1}
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
            aria-label="Eliminar sección"
            style={iconButton}
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2">
        <Field label="Número">
          <input
            type="text"
            value={seccion.numero}
            onChange={(e) => update({ numero: e.target.value })}
            placeholder={String(index + 1)}
            style={inputStyle}
          />
        </Field>
        <Field label="Título de la sección">
          <input
            type="text"
            value={seccion.titulo}
            onChange={(e) => update({ titulo: e.target.value })}
            style={inputStyle}
          />
        </Field>
      </div>

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
          Cuerpo
        </span>
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          <SeccionToolbar editor={editor} />
          <div style={{ minHeight: 140, padding: 12 }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      <style>{`
        .tiptap-editor-s:focus { outline: none; }
        .tiptap-editor-s p { margin: 6px 0; line-height: 1.6; font-size: 14px; color: #1A2B4A; }
        .tiptap-editor-s ul, .tiptap-editor-s ol { margin: 8px 0; padding-left: 22px; }
        .tiptap-editor-s li { margin: 2px 0; font-size: 14px; color: #1A2B4A; }
        .tiptap-editor-s strong { font-weight: 700; color: #1A2B4A; }
        .tiptap-editor-s a { color: #9e1915; text-decoration: underline; }
      `}</style>
    </div>
  );
}

function SeccionToolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL del enlace:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div
      className="flex items-center gap-0.5 px-2 py-1 flex-wrap"
      style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}
    >
      <ToolbarBtn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrita"
      >
        <Bold size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Cursiva"
      >
        <Italic size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista con viñetas"
      >
        <List size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      >
        <ListOrdered size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn active={editor.isActive("link")} onClick={setLink} title="Insertar enlace">
        <LinkIcon size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        title="Deshacer"
      >
        <Undo size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        title="Rehacer"
      >
        <Redo size={14} strokeWidth={2.5} />
      </ToolbarBtn>
    </div>
  );
}

function ToolbarBtn({
  active,
  disabled,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 28,
        height: 26,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#1A2B4A" : "transparent",
        color: active ? "#FFFFFF" : "#1A2B4A",
        border: "none",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Sep() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 1,
        height: 16,
        background: "#E8E4DD",
        margin: "0 4px",
      }}
    />
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
