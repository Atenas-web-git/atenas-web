"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Compass, Save } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type { ContenidoPlantillaU } from "../../plantillas";

/**
 * Editor de la cabecera del paseo virtual.
 *
 * **Tiene tres campos porque la página pinta tres textos.** Es a propósito: el
 * recorrido —los 63 espacios, sus fotos y sus accesos— se administra en
 * Contenido › Paseo virtual, y esta pantalla solo existe para el titular y el
 * SEO. Añadir aquí campos que la página no usa sería exactamente el fallo que
 * este proyecto lleva meses persiguiendo: un control que se guarda y no hace
 * nada.
 */
export function EditorPlantillaU({
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
  initialContenido: ContenidoPlantillaU;
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
  const [badge, setBadge] = useState(initialContenido.hero?.badge ?? "");
  const [title, setTitle] = useState(initialContenido.hero?.title ?? "");
  const [intro, setIntro] = useState(initialContenido.hero?.intro ?? "");

  const contenidoJson = JSON.stringify({ hero: { badge, title, intro } });

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

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

      <Card
        title="El recorrido se administra en otra pantalla"
        subtitle="Aquí solo se cambian el titular de la página y lo que ve Google."
      >
        <Link
          href="/admin/contenido/paseo"
          className="inline-flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
          style={{
            height: 36,
            background: "#F4F1EB",
            fontSize: 14,
            color: "#1A2B4A",
            fontWeight: 600,
            textDecoration: "none",
            alignSelf: "flex-start",
          }}
        >
          <Compass size={14} strokeWidth={2.5} />
          Ir a Paseo virtual
        </Link>
      </Card>

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
        <Field label="Slug (URL)" hint="No editable.">
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      <Card title="Cabecera" subtitle="La franja navy que se ve encima del recorrido.">
        <Field label="Línea superior" hint="Texto pequeño sobre el título.">
          <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Título" required>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Cómo se usa" hint="Una o dos frases que explican que se arrastra y se tocan los puntos.">
          <textarea
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={2}
            maxLength={240}
            style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>
      </Card>

      <Card title="SEO" subtitle="Lo que se lee en Google y al compartir el enlace.">
        <Field label="Meta title" hint="Recomendado: 50-60 caracteres.">
          <input
            type="text"
            name="meta_title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Meta description" hint="Recomendado: 140-160 caracteres.">
          <textarea
            name="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            maxLength={300}
            style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
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

const hintStyle: React.CSSProperties = { fontSize: 11, color: "#A0AABA", lineHeight: 1.5 };

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
