"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type { ContenidoPlantillaB, TarjetaPlantillaB } from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";
import { AnchorIdField } from "./AnchorIdField";

export function EditorPlantillaB({
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
  initialContenido: ContenidoPlantillaB;
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

  // Sección grid
  const [seccionBadge, setSeccionBadge] = useState(initialContenido.seccion?.badge ?? "");
  const [seccionHeading, setSeccionHeading] = useState(initialContenido.seccion?.heading ?? "");
  const [seccionDescription, setSeccionDescription] = useState(
    initialContenido.seccion?.description ?? ""
  );
  const [items, setItems] = useState<TarjetaPlantillaB[]>(
    initialContenido.seccion?.items ?? []
  );
  const [anchorId, setAnchorId] = useState(initialContenido.anchorId ?? "");

  const updateItem = (i: number, patch: Partial<TarjetaPlantillaB>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { icon: "star", title: "Nuevo pilar", description: "Descripción del pilar." },
    ]);
  };

  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const moveItem = (i: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const j = i + direction;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

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
      description: seccionDescription || undefined,
      items: items.filter((it) => it.title.trim() !== ""),
    },
    anchorId: anchorId.trim() || undefined,
  });

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      {/* Header sticky con guardar y toggle publicada */}
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
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
            {publicada ? "Página publicada" : "Página en borrador (no visible al público)"}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {state.error && (
            <span style={{ fontSize: 13, color: "#991B1B" }}>{state.error}</span>
          )}
          {state.ok && (
            <span style={{ fontSize: 13, color: "#065F46" }}>Guardado ✓</span>
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
          <Field label="Badge superior" hint="Texto pequeño rojo sobre el título. Default: 'QUIÉNES SOMOS'.">
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
          hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa la imagen genérica por defecto. Recomendado: 1440×640px o más."
        />
      </Card>

      {/* Sección encabezado */}
      <Card
        title="Sección de tarjetas"
        subtitle="Encabezado del grid + lista editable de tarjetas con icono, título y descripción."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge de la sección" required>
            <input
              type="text"
              value={seccionBadge}
              onChange={(e) => setSeccionBadge(e.target.value)}
              required
              placeholder="VALORES"
              style={inputStyle}
            />
          </Field>
          <Field label="Encabezado (h2)" required>
            <input
              type="text"
              value={seccionHeading}
              onChange={(e) => setSeccionHeading(e.target.value)}
              required
              placeholder="Nuestros Valores Institucionales"
              style={inputStyle}
            />
          </Field>
        </div>
        <Field
          label="Descripción de la sección"
          hint="Párrafo introductorio que aparece debajo del encabezado."
        >
          <textarea
            value={seccionDescription}
            onChange={(e) => setSeccionDescription(e.target.value)}
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

        {/* Lista de tarjetas */}
        <div className="flex flex-col gap-3">
          <span style={fieldLabel}>
            Tarjetas del grid {items.length > 0 && `(${items.length})`}
          </span>

          {items.length === 0 && (
            <p
              className="px-4 py-3 rounded-md"
              style={{
                background: "#FAFAF8",
                border: "1px dashed #C9C4BB",
                fontSize: 13,
                color: "#6B6660",
                margin: 0,
                textAlign: "center",
              }}
            >
              Aún no hay tarjetas. Agrega la primera abajo.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 p-4"
                style={{
                  background: "#FAFAF8",
                  border: "1px solid #E8E4DD",
                  borderRadius: 10,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#A0AABA",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Tarjeta #{i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(i, -1)}
                      disabled={i === 0}
                      aria-label="Subir"
                      style={iconButton(i === 0)}
                    >
                      <ArrowUp size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(i, 1)}
                      disabled={i === items.length - 1}
                      aria-label="Bajar"
                      style={iconButton(i === items.length - 1)}
                    >
                      <ArrowDown size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      aria-label="Eliminar"
                      style={{
                        ...iconButton(false),
                        color: "#991B1B",
                        borderColor: "#FECACA",
                      }}
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                <IconPicker
                  label="Icono"
                  value={item.icon}
                  onChange={(name) => updateItem(i, { icon: name })}
                  hint="Buscador del catálogo completo de Lucide. Click sobre uno para seleccionarlo."
                />

                <Field label="Título de la tarjeta" required>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(i, { title: e.target.value })}
                    required
                    placeholder="ej. Respeto"
                    style={inputStyle}
                  />
                </Field>

                <Field
                  label="Subtítulo"
                  hint="Opcional. Línea pequeña de color (oro/rojo) bajo el título. Útil para landings tipo /servicios o /espacios."
                >
                  <input
                    type="text"
                    value={item.subtitle ?? ""}
                    onChange={(e) =>
                      updateItem(i, { subtitle: e.target.value || undefined })
                    }
                    placeholder="ej. Valores, Actitudes, Servicio…"
                    style={inputStyle}
                  />
                </Field>

                <Field label="Descripción">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(i, { description: e.target.value })}
                    rows={3}
                    placeholder="Descripción del valor o pilar."
                    style={{
                      ...inputStyle,
                      height: "auto",
                      minHeight: 70,
                      paddingTop: 10,
                      paddingBottom: 10,
                      resize: "vertical",
                    }}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field
                    label="Link (opcional)"
                    hint="Si se llena, la tarjeta se vuelve clickeable. Puede ser ruta interna (/servicios/biblioteca) o URL externa."
                  >
                    <input
                      type="text"
                      value={item.href ?? ""}
                      onChange={(e) =>
                        updateItem(i, { href: e.target.value || undefined })
                      }
                      placeholder="/servicios/biblioteca"
                      style={inputStyle}
                    />
                  </Field>
                  <Field
                    label="Texto del CTA"
                    hint='Solo aparece si hay link. Ej: "Ver servicio", "Explorar".'
                  >
                    <input
                      type="text"
                      value={item.ctaText ?? ""}
                      onChange={(e) =>
                        updateItem(i, { ctaText: e.target.value || undefined })
                      }
                      placeholder="Ver más"
                      style={inputStyle}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Color de acento" hint="Default: oro.">
                    <select
                      value={item.color ?? "gold"}
                      onChange={(e) =>
                        updateItem(i, {
                          color:
                            e.target.value === "red"
                              ? "red"
                              : e.target.value === "gold"
                                ? "gold"
                                : undefined,
                        })
                      }
                      style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}
                    >
                      <option value="gold">Oro (default)</option>
                      <option value="red">Rojo (énfasis)</option>
                    </select>
                  </Field>
                  <Field
                    label="Tarjeta destacada"
                    hint="Marca con un fondo navy claro y borde rojo más intenso."
                  >
                    <label className="flex items-center gap-2" style={{ height: 38 }}>
                      <input
                        type="checkbox"
                        checked={item.highlight ?? false}
                        onChange={(e) =>
                          updateItem(i, {
                            highlight: e.target.checked || undefined,
                          })
                        }
                        style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                      />
                      <span style={{ fontSize: 13, color: "#1A2B4A" }}>
                        Destacada
                      </span>
                    </label>
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="flex items-center justify-center gap-1.5 self-start mt-1 px-4 transition-opacity hover:opacity-80"
            style={{
              height: 36,
              background: "transparent",
              color: "#1A2B4A",
              border: "1px dashed #C9C4BB",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Agregar tarjeta
          </button>
        </div>
      </Card>

      {/* Anclaje */}
      <Card
        title="Anclaje de sección"
        subtitle="Permite que botones, items del mega-menú u otros enlaces apunten directamente a esta sección con un anchor en la URL."
      >
        <AnchorIdField value={anchorId} onChange={setAnchorId} slug={slug} />
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
          <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
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
  fontSize: 12,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#A0AABA",
  lineHeight: 1.5,
};

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
};

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
