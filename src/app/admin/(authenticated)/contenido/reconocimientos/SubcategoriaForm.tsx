"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { guardarSubcategoriaAction, type ReconocimientosActionState } from "./actions";

type SubcategoriaInicial = {
  id: number | null;
  categoriaId: number;
  slug: string;
  nombre: string;
  icon: string;
  countValue: string;
  countLabel: string;
  photoSrc: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroGhostText: string;
  heroBgImage: string | null;
  heroFootnote: string | null;
  logrosHeading: string;
  logrosSubheading: string;
  galeriaTitulo: string;
  galeriaSubtitulo: string;
  metaTitle: string | null;
  metaDescription: string | null;
  orden: number;
  visible: boolean;
  categoriaSlug: string;
};

const DEFAULT: Omit<SubcategoriaInicial, "categoriaId" | "categoriaSlug"> = {
  id: null,
  slug: "",
  nombre: "",
  icon: "🏆",
  countValue: "0",
  countLabel: "Logros",
  photoSrc: "",
  heroBadge: "",
  heroTitle: "",
  heroSubtitle: "",
  heroGhostText: "",
  heroBgImage: null,
  heroFootnote: null,
  logrosHeading: "",
  logrosSubheading: "",
  galeriaTitulo: "",
  galeriaSubtitulo: "",
  metaTitle: null,
  metaDescription: null,
  orden: 0,
  visible: true,
};

const INITIAL_STATE: ReconocimientosActionState = { error: null, ok: false };

export function SubcategoriaForm({
  inicial,
}: {
  inicial: { categoriaId: number; categoriaSlug: string } & Partial<SubcategoriaInicial>;
}) {
  const init: SubcategoriaInicial = {
    ...DEFAULT,
    ...inicial,
    categoriaId: inicial.categoriaId,
    categoriaSlug: inicial.categoriaSlug,
  };
  const [state, formAction] = useActionState(guardarSubcategoriaAction, INITIAL_STATE);
  const [photoSrc, setPhotoSrc] = useState(init.photoSrc);
  const [heroBgImage, setHeroBgImage] = useState<string>(init.heroBgImage ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {init.id !== null && <input type="hidden" name="id" value={init.id} />}
      <input type="hidden" name="categoriaId" value={init.categoriaId} />
      <input type="hidden" name="photoSrc" value={photoSrc} />
      <input type="hidden" name="heroBgImage" value={heroBgImage} />

      <Section title="Identificación">
        <Row>
          <Field
            label="Slug (URL)"
            hint={`Aparece como /reconocimientos/${init.categoriaSlug}/[slug]`}
          >
            <input
              name="slug"
              defaultValue={init.slug}
              required
              pattern="[a-z0-9-]+"
              placeholder="cambridge"
              style={inputStyle}
            />
          </Field>
          <Field label="Nombre" hint="Cómo se muestra en la tarjeta del showcase">
            <input name="nombre" defaultValue={init.nombre} required style={inputStyle} />
          </Field>
        </Row>
        <Row>
          <Field label="Icono (emoji)" hint="Aparece junto al nombre en la card y el detalle">
            <input
              name="icon"
              defaultValue={init.icon}
              maxLength={4}
              style={{ ...inputStyle, maxWidth: 80, textAlign: "center", fontSize: 20 }}
            />
          </Field>
          <Field label="Orden" hint="Menor = primero">
            <input
              name="orden"
              type="number"
              defaultValue={init.orden}
              style={{ ...inputStyle, maxWidth: 100 }}
            />
          </Field>
          <Field label="Visibilidad" hint="Si está oculta, no aparece en el showcase">
            <label style={checkboxLabel}>
              <input type="checkbox" name="visible" defaultChecked={init.visible} />
              <span>Visible públicamente</span>
            </label>
          </Field>
        </Row>
      </Section>

      <Section title="Tarjeta del Showcase (en la landing de la categoría)">
        <Row>
          <Field label="Valor grande" hint="Ej. 15, 92%, 'Oro'">
            <input
              name="countValue"
              defaultValue={init.countValue}
              required
              style={inputStyle}
            />
          </Field>
          <Field label="Etiqueta debajo del valor" hint='Ej. "Medallas obtenidas"'>
            <input name="countLabel" defaultValue={init.countLabel} required style={inputStyle} />
          </Field>
        </Row>
        <Field label="Foto de la tarjeta">
          <ImageUploader
            value={photoSrc}
            onChange={setPhotoSrc}
            prefix={`reconocimientos/${init.categoriaSlug}/${init.slug || "subcategoria"}/showcase`}
            previewAspect="4/3"
          />
        </Field>
      </Section>

      <Section title="Hero del detalle (página de la subcategoría)">
        <Row>
          <Field label="Eyebrow" hint='Texto pequeño arriba del título. Si vacío: "{Categoría} — {Nombre}"'>
            <input name="heroBadge" defaultValue={init.heroBadge} style={inputStyle} />
          </Field>
          <Field label="Ghost text" hint="Texto decorativo grande del fondo. Si vacío usa el nombre en mayúsculas">
            <input name="heroGhostText" defaultValue={init.heroGhostText} style={inputStyle} />
          </Field>
        </Row>
        <Field
          label="Título del hero"
          hint='Lo grande arriba. Si vacío usa el "Nombre" de arriba. Ej. nombre="Olimpiadas", título="Olimpiadas Matemáticas Nacionales".'
        >
          <input name="heroTitle" defaultValue={init.heroTitle} style={inputStyle} />
        </Field>
        <Field label="Subtítulo" hint="Texto descriptivo bajo el título. Si vacío hereda el subtítulo de la categoría.">
          <textarea
            name="heroSubtitle"
            defaultValue={init.heroSubtitle}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </Field>
        <Field
          label="Pie del hero (footnote)"
          hint="Texto pequeño abajo del hero (ej. ubicación o crédito). Si vacío hereda el de la categoría."
        >
          <input
            name="heroFootnote"
            defaultValue={init.heroFootnote ?? ""}
            style={inputStyle}
          />
        </Field>
        <Field label="Imagen de fondo del hero" hint="Si vacío, hereda la imagen de la categoría.">
          <ImageUploader
            value={heroBgImage}
            onChange={setHeroBgImage}
            prefix={`reconocimientos/${init.categoriaSlug}/${init.slug || "subcategoria"}/hero`}
            previewAspect="16/9"
          />
        </Field>
      </Section>

      <Section title="Logros destacados">
        <Field label="Heading">
          <input
            name="logrosHeading"
            defaultValue={init.logrosHeading}
            placeholder="Ej. Nuestros logros en Cambridge"
            style={inputStyle}
          />
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

      <Section title="Galería">
        <Row>
          <Field label="Título" hint='Ej. "Galería — Cambridge"'>
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
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
          Las fotos de la galería de esta subcategoría se gestionan en el detalle después de
          guardar (al final de la página).
        </p>
      </Section>

      <Section title="SEO">
        <Field label="Meta title">
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
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: 600,
        border: "none",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Guardando…" : isEditing ? "Guardar cambios" : "Crear subcategoría"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
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
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 12, color: "#6B6660" }}>{hint}</span>}
    </label>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-md"
      style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
    >
      <p style={{ fontSize: 14, color: "#991B1B", margin: 0 }}>{message}</p>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      className="px-4 py-3 rounded-md"
      style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
    >
      <p style={{ fontSize: 14, color: "#065F46", margin: 0 }}>{message}</p>
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
  fontSize: 14,
  color: "#1A2B4A",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.4,
};

const checkboxLabel: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 14,
  color: "#1A2B4A",
  cursor: "pointer",
};
