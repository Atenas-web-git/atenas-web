"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type { ContenidoPlantillaA } from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AnchorIdField } from "./AnchorIdField";

export function EditorPlantillaA({
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
  initialContenido: ContenidoPlantillaA;
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
  const [heroGhostText, setHeroGhostText] = useState(initialContenido.hero?.ghostText ?? "");
  const [heroFootnote, setHeroFootnote] = useState(initialContenido.hero?.footnote ?? "");
  const [heroBgImageSrc, setHeroBgImageSrc] = useState(initialContenido.hero?.bgImageSrc ?? "");

  // Sección texto
  const [seccionBadge, setSeccionBadge] = useState(initialContenido.seccion?.badge ?? "");
  const [seccionHeading, setSeccionHeading] = useState(initialContenido.seccion?.heading ?? "");
  const [paragraphs, setParagraphs] = useState<string[]>(
    initialContenido.seccion?.paragraphs ?? [""]
  );
  const [seccionNote, setSeccionNote] = useState(initialContenido.seccion?.note ?? "");
  const [seccionImageSrc, setSeccionImageSrc] = useState(initialContenido.seccion?.imageSrc ?? "");
  const [seccionImageAlt, setSeccionImageAlt] = useState(initialContenido.seccion?.imageAlt ?? "");

  // Bloque opcional "Descargar más información" (Google Drive)
  const [descargasLabel, setDescargasLabel] = useState(
    initialContenido.descargas?.label ?? ""
  );
  const [descargasHref, setDescargasHref] = useState(
    initialContenido.descargas?.href ?? ""
  );
  const [descargasDescripcion, setDescargasDescripcion] = useState(
    initialContenido.descargas?.descripcion ?? ""
  );

  // ID de anclaje (opcional)
  const [anchorId, setAnchorId] = useState(initialContenido.anchorId ?? "");

  const updateParagraph = (i: number, value: string) => {
    setParagraphs((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  };

  const addParagraph = () => {
    setParagraphs((prev) => [...prev, ""]);
  };

  const removeParagraph = (i: number) => {
    setParagraphs((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Construye el JSON serializado para enviar
  const hasDescargas =
    descargasLabel.trim() !== "" && descargasHref.trim() !== "";
  const contenidoJson = JSON.stringify({
    hero: {
      badge: heroBadge || undefined,
      title: heroTitle,
      subtitle: heroSubtitle || undefined,
      ghostText: heroGhostText || undefined,
      footnote: heroFootnote || undefined,
      bgImageSrc: heroBgImageSrc || undefined,
    },
    seccion: {
      badge: seccionBadge,
      heading: seccionHeading,
      paragraphs: paragraphs.filter((p) => p.trim() !== ""),
      note: seccionNote || null,
      imageSrc: seccionImageSrc || null,
      imageAlt: seccionImageAlt || null,
    },
    descargas: hasDescargas
      ? {
          label: descargasLabel.trim(),
          href: descargasHref.trim(),
          descripcion: descargasDescripcion.trim() || undefined,
        }
      : undefined,
    anchorId: anchorId.trim() || undefined,
  });

  // Slug seguro para el prefix del uploader
  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      {/* Header con botón guardar y toggle publicada */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
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
          {state.error && (
            <span style={{ fontSize: 12, color: "#991B1B" }}>{state.error}</span>
          )}
          {state.ok && (
            <span style={{ fontSize: 12, color: "#065F46" }}>Guardado ✓</span>
          )}
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

      {/* Datos básicos */}
      <Card title="Información general">
        <Field label="Título interno" hint="Solo se ve en el backoffice. No afecta la página pública.">
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Slug (URL)" hint="No editable. Para cambiar el slug, crea otra página y pide eliminar esta.">
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      {/* Hero */}
      <Card title="Hero (cabecera)" subtitle="La primera sección visible al cargar la página, con título grande sobre fondo navy.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge superior" hint="Texto pequeño dorado sobre el título. Default: 'QUIÉNES SOMOS'.">
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="QUIÉNES SOMOS"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text" hint="Texto enorme decorativo de fondo (opacidad muy baja).">
            <input
              type="text"
              value={heroGhostText}
              onChange={(e) => setHeroGhostText(e.target.value)}
              placeholder={heroTitle.toUpperCase()}
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Título principal" required>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Subtítulo" hint="Línea explicativa debajo del título.">
          <input
            type="text"
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field
          label="Pie del hero"
          hint='Texto pequeño al final del hero. Default: "Unidad Educativa Atenas · Izamba, Ambato". Déjalo vacío si quieres ocultarlo.'
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
          label="Imagen de fondo del hero"
          value={heroBgImageSrc}
          onChange={setHeroBgImageSrc}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
          hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa la imagen genérica por defecto. Recomendado: 1440×640px o más, formato JPG/WebP."
        />
      </Card>

      {/* Sección de texto */}
      <Card title="Sección de texto" subtitle="Bloque principal de contenido con párrafos formateables y nota opcional.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge de la sección" required>
            <input
              type="text"
              value={seccionBadge}
              onChange={(e) => setSeccionBadge(e.target.value)}
              required
              placeholder="MISIÓN"
              style={inputStyle}
            />
          </Field>
          <Field label="Encabezado (h2)" required>
            <input
              type="text"
              value={seccionHeading}
              onChange={(e) => setSeccionHeading(e.target.value)}
              required
              placeholder="Nuestra Misión"
              style={inputStyle}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <span style={fieldLabel}>Párrafos del cuerpo</span>
          <span style={hintStyle}>
            El primer párrafo se renderiza más grande y oscuro. Los siguientes son texto regular.
          </span>
          <div className="flex flex-col gap-2 mt-1">
            {paragraphs.map((p, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: 28,
                    height: 28,
                    color: "#A0AABA",
                    marginTop: 4,
                  }}
                  title={`Párrafo ${i + 1}`}
                >
                  <GripVertical size={14} />
                </span>
                <textarea
                  value={p}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  rows={i === 0 ? 4 : 3}
                  style={{
                    ...inputStyle,
                    height: "auto",
                    minHeight: 60,
                    paddingTop: 10,
                    paddingBottom: 10,
                    flex: 1,
                    resize: "vertical",
                    fontSize: i === 0 ? 14 : 13,
                    fontWeight: i === 0 ? 500 : 400,
                  }}
                  placeholder={i === 0 ? "Primer párrafo (grande)" : "Párrafo adicional"}
                />
                {paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(i)}
                    aria-label="Eliminar párrafo"
                    style={{
                      width: 28,
                      height: 28,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "transparent",
                      color: "#991B1B",
                      border: "1px solid #FECACA",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginTop: 4,
                    }}
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-1.5 self-start mt-1 px-3 rounded-md transition-opacity hover:opacity-80"
            style={{
              height: 30,
              background: "transparent",
              color: "#1A2B4A",
              border: "1px dashed #C9C4BB",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Plus size={12} strokeWidth={2.5} />
            Agregar párrafo
          </button>
        </div>

        <Field label="Nota al pie (opcional)" hint="Texto pequeño con borde dorado a la izquierda. Útil para aclaraciones.">
          <textarea
            value={seccionNote}
            onChange={(e) => setSeccionNote(e.target.value)}
            rows={2}
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

        <ImageUploader
          label="Imagen lateral (opcional)"
          value={seccionImageSrc}
          onChange={setSeccionImageSrc}
          prefix={`${safePrefix}/seccion`}
          previewAspect="4/3"
          hint="Aparece a la derecha de la sección de texto solo en desktop. Si la dejas vacía no se muestra la imagen lateral."
        />
        <Field label="Texto alternativo de la imagen lateral" hint="Descripción de la imagen para accesibilidad y SEO.">
          <input
            type="text"
            value={seccionImageAlt}
            onChange={(e) => setSeccionImageAlt(e.target.value)}
            placeholder="ej. Estudiantes de la Unidad Educativa Atenas"
            style={inputStyle}
          />
        </Field>
      </Card>

      {/* Anclaje (ID de sección para linkear desde otros lugares) */}
      <Card
        title="Anclaje de sección"
        subtitle="Permite que botones, items del mega-menú u otros enlaces apunten directamente a esta sección con un anchor en la URL."
      >
        <AnchorIdField value={anchorId} onChange={setAnchorId} slug={slug} />
      </Card>

      {/* Descargar más información (CTA opcional a Google Drive) */}
      <Card
        title="Descargar más información (opcional)"
        subtitle='Botón CTA al final de la página que abre un enlace (PDF, Google Drive, etc.). Si dejas "Texto del botón" o "URL" vacíos, la sección NO aparece en el sitio público.'
      >
        <Field
          label="Texto del botón"
          hint='Ej. "Descargar dossier institucional" o "Ver brochure (PDF)"'
        >
          <input
            type="text"
            value={descargasLabel}
            onChange={(e) => setDescargasLabel(e.target.value)}
            placeholder="Descargar más información"
            maxLength={80}
            style={inputStyle}
          />
        </Field>
        <Field
          label="URL del archivo o página"
          hint="Pega aquí el link de Google Drive, PDF u otra fuente. Si empieza con http se abre en nueva pestaña automáticamente."
        >
          <input
            type="text"
            value={descargasHref}
            onChange={(e) => setDescargasHref(e.target.value)}
            placeholder="https://drive.google.com/file/d/..."
            style={inputStyle}
          />
        </Field>
        <Field
          label="Texto descriptivo (opcional)"
          hint="Aparece como párrafo arriba del botón. Útil para dar contexto sobre qué se va a descargar."
        >
          <textarea
            value={descargasDescripcion}
            onChange={(e) => setDescargasDescripcion(e.target.value)}
            rows={2}
            placeholder="ej. Descarga nuestro dossier institucional con la información completa de la unidad educativa."
            style={{ ...inputStyle, resize: "vertical", minHeight: 60 }}
          />
        </Field>
      </Card>

      {/* SEO */}
      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previsualizaciones cuando se comparte el link.">
        <Field label="Meta title" hint="Aparece en la pestaña del navegador y en resultados de Google. Recomendado: 50-60 caracteres.">
          <input
            type="text"
            name="meta_title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Meta description" hint="Resumen de 1-2 líneas que aparece en Google. Recomendado: 140-160 caracteres.">
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
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
      }}
    >
      <div className="flex flex-col gap-1">
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#1A2B4A",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
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
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const hintStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#A0AABA",
  lineHeight: 1.5,
};

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
};
