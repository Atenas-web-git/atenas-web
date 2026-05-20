"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaN,
  ValorPlantillaN,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";

export function EditorPlantillaN({
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
  initialContenido: ContenidoPlantillaN;
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
  const [heroTitleLine1, setHeroTitleLine1] = useState(initialContenido.hero?.titleLine1 ?? "");
  const [heroTitleLine2, setHeroTitleLine2] = useState(initialContenido.hero?.titleLine2 ?? "");
  const [heroDescription, setHeroDescription] = useState(initialContenido.hero?.description ?? "");
  const [heroCaption, setHeroCaption] = useState(initialContenido.hero?.caption ?? "");
  const [heroGhostText, setHeroGhostText] = useState(initialContenido.hero?.ghostText ?? "");
  const [heroBgImage, setHeroBgImage] = useState(initialContenido.hero?.bgImage ?? "");

  // Valores
  const [valoresEyebrow, setValoresEyebrow] = useState(initialContenido.valores?.eyebrow ?? "");
  const [valoresHeading, setValoresHeading] = useState(initialContenido.valores?.heading ?? "");
  const [valoresDescription, setValoresDescription] = useState(
    initialContenido.valores?.description ?? ""
  );
  const [valores, setValores] = useState<ValorPlantillaN[]>(
    initialContenido.valores?.items ?? []
  );

  // Formulario
  const [formHeading, setFormHeading] = useState(initialContenido.formulario?.heading ?? "");
  const [formSubtitle, setFormSubtitle] = useState(initialContenido.formulario?.subtitle ?? "");
  const [formStep1Label, setFormStep1Label] = useState(
    initialContenido.formulario?.step1Label ?? ""
  );
  const [formStep2Label, setFormStep2Label] = useState(
    initialContenido.formulario?.step2Label ?? ""
  );
  const [formSuccessTitle, setFormSuccessTitle] = useState(
    initialContenido.formulario?.successTitle ?? ""
  );
  const [formSuccessText, setFormSuccessText] = useState(
    initialContenido.formulario?.successText ?? ""
  );

  const updateValor = (i: number, patch: Partial<ValorPlantillaN>) =>
    setValores((arr) => arr.map((v, idx) => (idx === i ? { ...v, ...patch } : v)));
  const addValor = () =>
    setValores((arr) => [
      ...arr,
      { imagen: "", iconName: "star", color: "gold", titulo: "", descripcion: "" },
    ]);
  const removeValor = (i: number) =>
    setValores((arr) => arr.filter((_, idx) => idx !== i));

  const contenidoJson = JSON.stringify({
    hero: {
      eyebrow: heroEyebrow,
      titleLine1: heroTitleLine1,
      titleLine2: heroTitleLine2,
      description: heroDescription,
      caption: heroCaption,
      ghostText: heroGhostText,
      bgImage: heroBgImage,
    },
    valores: {
      eyebrow: valoresEyebrow,
      heading: valoresHeading,
      description: valoresDescription,
      items: valores
        .map((v) => ({
          imagen: v.imagen.trim(),
          iconName: v.iconName.trim() || "star",
          color: v.color,
          titulo: v.titulo.trim(),
          descripcion: v.descripcion.trim(),
        }))
        .filter((v) => v.titulo && v.descripcion),
    },
    formulario: {
      heading: formHeading,
      subtitle: formSubtitle,
      step1Label: formStep1Label,
      step2Label: formStep2Label,
      successTitle: formSuccessTitle,
      successText: formSuccessText,
    },
  });

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      {/* Sticky header */}
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

      {/* Información general */}
      <Card title="Información general">
        <Field
          label="Título interno"
          hint="Solo se ve en el backoffice. No afecta la página pública."
        >
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field
          label="Slug (URL)"
          hint="Esta plantilla solo se usa para /trabaja-con-nosotros. No editable."
        >
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
      <Card
        title="Hero (cabecera)"
        subtitle="Primera sección con foto de fondo + título a 2 líneas (segunda línea en blanco)."
      >
        <Field label="Eyebrow" hint='Texto pequeño dorado sobre el título.'>
          <input
            type="text"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="UNIDAD EDUCATIVA ATENAS"
            style={inputStyle}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título — línea 1" required>
            <input
              type="text"
              value={heroTitleLine1}
              onChange={(e) => setHeroTitleLine1(e.target.value)}
              placeholder="Trabaja con"
              required
              style={inputStyle}
            />
          </Field>
          <Field label="Título — línea 2" required>
            <input
              type="text"
              value={heroTitleLine2}
              onChange={(e) => setHeroTitleLine2(e.target.value)}
              placeholder="Nosotros"
              required
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Descripción">
          <textarea
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            rows={3}
            style={{
              ...inputStyle,
              height: "auto",
              paddingTop: 10,
              paddingBottom: 10,
              resize: "vertical",
            }}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Caption (línea pequeña inferior)">
            <input
              type="text"
              value={heroCaption}
              onChange={(e) => setHeroCaption(e.target.value)}
              placeholder="Unidad Educativa Atenas · Izamba, Ambato"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text decorativo">
            <input
              type="text"
              value={heroGhostText}
              onChange={(e) => setHeroGhostText(e.target.value)}
              placeholder="TRABAJA"
              style={inputStyle}
            />
          </Field>
        </div>
        <ImageUploader
          label="Imagen de fondo del hero"
          value={heroBgImage}
          onChange={setHeroBgImage}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
          hint="Aparece de fondo con overlay navy y parallax. Recomendado: 1440×640px o más."
        />
      </Card>

      {/* Valores */}
      <Card
        title="Sección de valores"
        subtitle="Encabezado + grid de tarjetas (foto + icono Lucide + título + descripción)."
      >
        <Field label="Eyebrow">
          <input
            type="text"
            value={valoresEyebrow}
            onChange={(e) => setValoresEyebrow(e.target.value)}
            placeholder="Recursos Humanos"
            style={inputStyle}
          />
        </Field>
        <Field label="Heading">
          <input
            type="text"
            value={valoresHeading}
            onChange={(e) => setValoresHeading(e.target.value)}
            placeholder="Únete a nuestro equipo"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            value={valoresDescription}
            onChange={(e) => setValoresDescription(e.target.value)}
            rows={2}
            style={{
              ...inputStyle,
              height: "auto",
              paddingTop: 10,
              paddingBottom: 10,
              resize: "vertical",
            }}
          />
        </Field>

        <div className="flex flex-col gap-4 mt-2">
          {valores.map((v, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-4"
              style={{
                background: "#FAFAF8",
                border: "1px solid #E8E4DD",
                borderRadius: 10,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6B6660",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Tarjeta {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeValor(i)}
                  aria-label="Eliminar tarjeta"
                  style={iconButton}
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Título">
                  <input
                    type="text"
                    value={v.titulo}
                    onChange={(e) => updateValor(i, { titulo: e.target.value })}
                    placeholder="Estabilidad Laboral"
                    style={inputStyle}
                  />
                </Field>
                <IconPicker
                  label="Icono"
                  value={v.iconName}
                  onChange={(name) => updateValor(i, { iconName: name })}
                  hint="Buscador del catálogo completo de Lucide. Click sobre uno para seleccionarlo."
                />
              </div>
              <Field label="Descripción">
                <textarea
                  value={v.descripcion}
                  onChange={(e) => updateValor(i, { descripcion: e.target.value })}
                  rows={2}
                  style={{
                    ...inputStyle,
                    height: "auto",
                    paddingTop: 10,
                    paddingBottom: 10,
                    resize: "vertical",
                  }}
                />
              </Field>
              <Field
                label="Color de acento"
                hint="Gold (dorado), Navy (azul oscuro) o Red (rojo)."
              >
                <select
                  value={v.color}
                  onChange={(e) =>
                    updateValor(i, { color: e.target.value as ValorPlantillaN["color"] })
                  }
                  style={inputStyle}
                >
                  <option value="gold">Gold (dorado)</option>
                  <option value="navy">Navy (azul oscuro)</option>
                  <option value="red">Red (rojo)</option>
                </select>
              </Field>
              <ImageUploader
                label="Foto de la tarjeta"
                value={v.imagen}
                onChange={(url) => updateValor(i, { imagen: url })}
                prefix={`${safePrefix}/valores/${i}`}
                previewAspect="4/3"
                hint="Foto superior de la tarjeta. Recomendado: 800×600px."
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addValor}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} />
          Agregar tarjeta
        </button>
      </Card>

      {/* Formulario */}
      <Card
        title="Formulario de postulación"
        subtitle="Encabezado + labels del wizard de 2 pasos + estado de éxito. La lógica del formulario (campos, opciones de cargo/área/formación) se mantiene en código."
      >
        <Field label="Heading">
          <input
            type="text"
            value={formHeading}
            onChange={(e) => setFormHeading(e.target.value)}
            placeholder="Completa tu postulación"
            style={inputStyle}
          />
        </Field>
        <Field label="Subtítulo">
          <textarea
            value={formSubtitle}
            onChange={(e) => setFormSubtitle(e.target.value)}
            rows={2}
            style={{
              ...inputStyle,
              height: "auto",
              paddingTop: 10,
              paddingBottom: 10,
              resize: "vertical",
            }}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Label del paso 1">
            <input
              type="text"
              value={formStep1Label}
              onChange={(e) => setFormStep1Label(e.target.value)}
              placeholder="Datos Personales"
              style={inputStyle}
            />
          </Field>
          <Field label="Label del paso 2">
            <input
              type="text"
              value={formStep2Label}
              onChange={(e) => setFormStep2Label(e.target.value)}
              placeholder="Perfil Profesional"
              style={inputStyle}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título del estado de éxito">
            <input
              type="text"
              value={formSuccessTitle}
              onChange={(e) => setFormSuccessTitle(e.target.value)}
              placeholder="¡Postulación enviada!"
              style={inputStyle}
            />
          </Field>
          <Field label="Texto del estado de éxito">
            <input
              type="text"
              value={formSuccessText}
              onChange={(e) => setFormSuccessText(e.target.value)}
              placeholder="Hemos recibido tu información…"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      {/* SEO */}
      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previsualizaciones.">
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

/* ─── helpers UI ─── */

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
