"use client";

import { useActionState, useState } from "react";
import { Save, Info, AlertTriangle, Check } from "lucide-react";
import type { Seo } from "@/lib/cms/getConfiguracion";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { guardarSeoAction, type SeoActionState } from "./actions";

export function SeoForm({ initialSeo }: { initialSeo: Seo }) {
  const [state, action, isPending] = useActionState<SeoActionState, FormData>(
    guardarSeoAction,
    { error: null, ok: false }
  );

  // Estado controlado para vista previa
  const [titleDefault, setTitleDefault] = useState(initialSeo.titleDefault);
  const [titleTemplate, setTitleTemplate] = useState(initialSeo.titleTemplate);
  const [description, setDescription] = useState(initialSeo.description);
  const [ogImage, setOgImage] = useState(initialSeo.ogImage);

  // Vista previa del title template aplicada a una página de ejemplo
  const ejemploTitle = titleTemplate.replace("%s", "Misión");

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Sticky de guardado */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <span style={{ fontSize: 13, color: "#6B6660" }}>
          Solo el superadmin puede modificar el SEO. Los cambios aplican a todo el sitio.
        </span>
        <div className="flex items-center gap-3">
          {state.error && (
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: "#991B1B" }}>
              <AlertTriangle size={12} strokeWidth={2.5} /> {state.error}
            </span>
          )}
          {state.ok && (
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: "#065F46" }}>
              <Check size={12} strokeWidth={2.5} /> Guardado
            </span>
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

      {/* Banner educativo */}
      <div
        className="flex items-start gap-3 p-4"
        style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10 }}
      >
        <Info size={18} strokeWidth={2.5} color="#1E40AF" style={{ flexShrink: 0, marginTop: 2 }} />
        <div className="flex flex-col gap-1">
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1E3A8A", margin: 0 }}>
            Cómo funciona el SEO del sitio
          </p>
          <p style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.6, margin: 0 }}>
            Hay dos niveles: <strong>defaults globales</strong> (este formulario, se aplican a todo el sitio) y <strong>overrides por página</strong> (en cada página del CMS, hay campos meta_title y meta_description que sobrescriben el default solo para esa página). El title template combina ambos: para una página con meta_title "Misión" y template "%s | Atenas", el title final es "Misión | Atenas".
          </p>
        </div>
      </div>

      {/* Bloque 1 — Title */}
      <Card title="Title de las páginas" subtitle="El title aparece en la pestaña del navegador y como encabezado en los resultados de búsqueda. Recomendado: 50-60 caracteres.">
        <Field
          label="Title default"
          required
          hint="Se usa cuando la página no tiene meta_title propio (ej. en el home y páginas hardcoded)."
        >
          <input
            type="text"
            name="title_default"
            value={titleDefault}
            onChange={(e) => setTitleDefault(e.target.value)}
            required
            maxLength={120}
            style={inputStyle}
          />
          <CharCounter value={titleDefault} max={60} />
        </Field>
        <Field
          label="Title template"
          required
          hint='Plantilla para páginas con meta_title propio. Usa "%s" como placeholder. Ej. "%s | Atenas" produce "Misión | Atenas".'
        >
          <input
            type="text"
            name="title_template"
            value={titleTemplate}
            onChange={(e) => setTitleTemplate(e.target.value)}
            required
            maxLength={80}
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>

        {/* Vista previa */}
        <div
          className="flex flex-col gap-2 p-4 rounded-md"
          style={{ background: "#FAFAF8", border: "1px solid #E8E4DD" }}
        >
          <p style={previewLabel}>Vista previa</p>
          <div className="flex flex-col gap-1">
            <p style={{ fontSize: 11, color: "#6B6660", margin: 0 }}>Home (sin meta_title propio):</p>
            <p style={previewTitle}>{titleDefault}</p>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <p style={{ fontSize: 11, color: "#6B6660", margin: 0 }}>Página con meta_title "Misión":</p>
            <p style={previewTitle}>{ejemploTitle}</p>
          </div>
        </div>
      </Card>

      {/* Bloque 2 — Description + Keywords */}
      <Card title="Description y keywords" subtitle="Se aplican como meta tags y como description en los resultados de Google.">
        <Field
          label="Description default"
          required
          hint="Aparece debajo del title en los resultados de Google. Recomendado: 140-160 caracteres."
        >
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            maxLength={320}
            style={textareaStyle}
          />
          <CharCounter value={description} max={160} />
        </Field>
        <Field
          label="Keywords"
          hint="Palabras clave separadas por coma. Hoy Google las ignora pero otros motores y bots las leen. Útil también como aide-mémoire del equipo."
        >
          <textarea
            name="keywords"
            defaultValue={initialSeo.keywords}
            rows={3}
            style={textareaStyle}
          />
        </Field>
      </Card>

      {/* Bloque 3 — Open Graph */}
      <Card title="Open Graph (compartir en redes)" subtitle="Lo que se ve cuando alguien comparte un enlace del sitio en WhatsApp, Facebook, LinkedIn, etc.">
        <Field label="Nombre del sitio" required hint='Aparece como "siteName" en Open Graph.'>
          <input type="text" name="site_name" defaultValue={initialSeo.siteName} required style={inputStyle} />
        </Field>
        <Field label="Locale" hint="Idioma + país del contenido. Para Ecuador: es_EC. Para España: es_ES.">
          <input
            type="text"
            name="og_locale"
            defaultValue={initialSeo.ogLocale}
            placeholder="es_EC"
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <span style={fieldLabel}>OG image (1200×630)</span>
          <p style={hintStyle}>
            Imagen que se muestra al compartir el sitio. Tamaño recomendado 1200×630. Puede ser una ruta interna (ej. <code style={{ fontFamily: monoFont }}>/opengraph-image</code>) o una URL completa.
          </p>
          <ImageUploader
            label=""
            value={ogImage.startsWith("http") || ogImage.startsWith("/") ? ogImage : ""}
            onChange={setOgImage}
            prefix="seo"
            previewAspect="16/9"
          />
          <input
            type="text"
            name="og_image"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="/opengraph-image"
            style={{ ...inputStyle, fontFamily: monoFont, marginTop: 8 }}
          />
          <p style={hintStyle}>
            Si pegas una ruta interna como <code style={{ fontFamily: monoFont }}>/opengraph-image</code>, el sitio genera la imagen automáticamente con el opengraph-image generator. Si subes una imagen aquí, el campo de arriba se actualiza con su URL.
          </p>
        </div>

        <Field label="Twitter card" hint="Cómo se ve el preview en Twitter / X.">
          <select
            name="twitter_card"
            defaultValue={initialSeo.twitterCard}
            style={inputStyle}
          >
            <option value="summary_large_image">summary_large_image (imagen grande — recomendado)</option>
            <option value="summary">summary (imagen pequeña)</option>
          </select>
        </Field>
      </Card>

      {/* Bloque 4 — Robots */}
      <Card title="Indexación (robots)" subtitle="Si los motores de búsqueda deben rastrear y mostrar el sitio en sus resultados.">
        <div className="flex flex-col gap-3">
          <label
            className="flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer"
            style={{ background: "#FAFAF8", border: "1px solid #E8E4DD" }}
          >
            <input
              type="checkbox"
              name="robots_index"
              defaultChecked={initialSeo.robotsIndex}
              style={{ width: 18, height: 18, accentColor: "#1A2B4A" }}
            />
            <div className="flex flex-col gap-0.5">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                Permitir indexación (index)
              </span>
              <span style={{ fontSize: 11, color: "#6B6660" }}>
                Google y otros motores pueden mostrar el sitio en sus resultados. Desactivar solo si el sitio está en desarrollo.
              </span>
            </div>
          </label>
          <label
            className="flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer"
            style={{ background: "#FAFAF8", border: "1px solid #E8E4DD" }}
          >
            <input
              type="checkbox"
              name="robots_follow"
              defaultChecked={initialSeo.robotsFollow}
              style={{ width: 18, height: 18, accentColor: "#1A2B4A" }}
            />
            <div className="flex flex-col gap-0.5">
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                Seguir enlaces (follow)
              </span>
              <span style={{ fontSize: 11, color: "#6B6660" }}>
                Los motores siguen los links del sitio para descubrir páginas relacionadas. Desactivar solo en casos avanzados.
              </span>
            </div>
          </label>
        </div>
      </Card>
    </form>
  );
}

/* ─── Helpers ─── */

function CharCounter({ value, max }: { value: string; max: number }) {
  const length = value.length;
  const color = length > max ? "#991B1B" : length > max * 0.9 ? "#92400E" : "#A0AABA";
  return (
    <span style={{ fontSize: 10, color, alignSelf: "flex-end" }}>
      {length} / {max} caracteres
    </span>
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

const monoFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const hintStyle: React.CSSProperties = { fontSize: 10, color: "#A0AABA", lineHeight: 1.5 };
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
const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  minHeight: 70,
  paddingTop: 10,
  paddingBottom: 10,
  resize: "vertical",
};
const previewLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  margin: 0,
};
const previewTitle: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  fontSize: 16,
  fontWeight: 400,
  color: "#1A0DAB",
  margin: 0,
  textDecoration: "underline",
};
