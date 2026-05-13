"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { guardarCategoriaAction, type ReconocimientosActionState } from "./actions";

type CategoriaInicial = {
  id: number | null;
  slug: string;
  nombre: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroGhostText: string;
  heroBgImage: string | null;
  heroFootnote: string | null;
  showcaseHeading: string;
  showcaseCtaText: string;
  logrosHeading: string;
  logrosSubheading: string;
  galeriaTitulo: string;
  galeriaSubtitulo: string;
  metaTitle: string | null;
  metaDescription: string | null;
  orden: number;
  visible: boolean;
};

const DEFAULT_INITIAL: CategoriaInicial = {
  id: null,
  slug: "",
  nombre: "",
  heroBadge: "RECONOCIMIENTOS",
  heroTitle: "",
  heroSubtitle: "",
  heroGhostText: "",
  heroBgImage: null,
  heroFootnote: null,
  showcaseHeading: "Por disciplina",
  showcaseCtaText: "Ver logros",
  logrosHeading: "Logros destacados",
  logrosSubheading: "",
  galeriaTitulo: "Galería",
  galeriaSubtitulo: "",
  metaTitle: null,
  metaDescription: null,
  orden: 0,
  visible: true,
};

const INITIAL_STATE: ReconocimientosActionState = { error: null, ok: false };

export function CategoriaForm({ inicial }: { inicial?: Partial<CategoriaInicial> }) {
  const init: CategoriaInicial = { ...DEFAULT_INITIAL, ...inicial };
  const [state, formAction] = useActionState(guardarCategoriaAction, INITIAL_STATE);
  const [heroBgImage, setHeroBgImage] = useState<string>(init.heroBgImage ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {init.id !== null && <input type="hidden" name="id" value={init.id} />}
      <input type="hidden" name="heroBgImage" value={heroBgImage} />

      <Section title="Identificación">
        <Row>
          <Field label="Slug (URL)" hint="Solo minúsculas, números y guiones. Ej: academicos, profesionales">
            <input
              name="slug"
              defaultValue={init.slug}
              required
              pattern="[a-z0-9-]+"
              placeholder="academicos"
              style={inputStyle}
            />
          </Field>
          <Field label="Nombre" hint="Cómo se muestra en el menú de Reconocimientos">
            <input name="nombre" defaultValue={init.nombre} required style={inputStyle} />
          </Field>
        </Row>
        <Row>
          <Field label="Orden" hint="Menor = primero">
            <input
              name="orden"
              type="number"
              defaultValue={init.orden}
              style={{ ...inputStyle, maxWidth: 100 }}
            />
          </Field>
          <Field label="Visibilidad" hint="Si está oculta, no aparece en el sitio público ni en el menú">
            <label style={checkboxLabel}>
              <input type="checkbox" name="visible" defaultChecked={init.visible} />
              <span>Visible públicamente</span>
            </label>
          </Field>
        </Row>
      </Section>

      <Section title="Hero (cabecera de la landing)">
        <Row>
          <Field label="Eyebrow" hint="Texto pequeño arriba del título">
            <input name="heroBadge" defaultValue={init.heroBadge} style={inputStyle} />
          </Field>
          <Field label="Título" hint="Título grande del hero">
            <input name="heroTitle" defaultValue={init.heroTitle} required style={inputStyle} />
          </Field>
        </Row>
        <Field label="Subtítulo">
          <textarea
            name="heroSubtitle"
            defaultValue={init.heroSubtitle}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
        <Row>
          <Field label="Ghost text" hint="Texto decorativo grande en el fondo (ej: ACADEMIA)">
            <input name="heroGhostText" defaultValue={init.heroGhostText} style={inputStyle} />
          </Field>
          <Field label="Pie de hero (opcional)">
            <input
              name="heroFootnote"
              defaultValue={init.heroFootnote ?? ""}
              style={inputStyle}
            />
          </Field>
        </Row>
        <Field label="Imagen de fondo del hero" hint="Opcional. Si vacía, el hero usa un fondo plano.">
          <ImageUploader
            value={heroBgImage}
            onChange={setHeroBgImage}
            prefix={`reconocimientos/${init.slug || "categoria"}/hero`}
            previewAspect="16/9"
          />
        </Field>
      </Section>

      <Section title="Showcase de subcategorías">
        <Row>
          <Field label="Heading" hint='Ej: "Por área" o "Por disciplina"'>
            <input name="showcaseHeading" defaultValue={init.showcaseHeading} style={inputStyle} />
          </Field>
          <Field label="Texto del CTA en cada card">
            <input name="showcaseCtaText" defaultValue={init.showcaseCtaText} style={inputStyle} />
          </Field>
        </Row>
      </Section>

      <Section title="Sección de Logros destacados">
        <Field label="Heading">
          <input name="logrosHeading" defaultValue={init.logrosHeading} style={inputStyle} />
        </Field>
        <Field label="Subheading">
          <textarea
            name="logrosSubheading"
            defaultValue={init.logrosSubheading}
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
      </Section>

      <Section title="Sección de Galería">
        <Row>
          <Field label="Título">
            <input name="galeriaTitulo" defaultValue={init.galeriaTitulo} style={inputStyle} />
          </Field>
          <Field label="Subtítulo">
            <input
              name="galeriaSubtitulo"
              defaultValue={init.galeriaSubtitulo}
              style={inputStyle}
            />
          </Field>
        </Row>
      </Section>

      <Section title="SEO">
        <Field label="Meta title" hint="Si vacío, se usa el default del sitio">
          <input name="metaTitle" defaultValue={init.metaTitle ?? ""} style={inputStyle} />
        </Field>
        <Field label="Meta description">
          <textarea
            name="metaDescription"
            defaultValue={init.metaDescription ?? ""}
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
      </Section>

      {state.error && <ErrorBanner message={state.error} />}
      {state.ok && init.id !== null && <SuccessBanner message="Cambios guardados" />}

      <div className="flex justify-end gap-3">
        <SubmitButton isEditing={init.id !== null} />
      </div>
    </form>
  );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{
        height: 40,
        background: "#1A2B4A",
        fontSize: 13,
        color: "#FFFFFF",
        fontWeight: 600,
        border: "none",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear categoría"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0, letterSpacing: 0.3 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 11, color: "#6B6660" }}>{hint}</span>}
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-md"
      style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
    >
      <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{message}</p>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-md"
      style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
    >
      <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>{message}</p>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 38,
  padding: "9px 12px",
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  fontSize: 13,
  color: "#1A2B4A",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
  color: "#1A2B4A",
  cursor: "pointer",
};
