"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import {
  guardarHeroDocumentosAction,
  type HeroDocumentosActionState,
} from "./actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

type Props = {
  initial: {
    badge: string;
    title: string;
    subtitle: string;
    ghostText: string;
    footnote: string;
    bgImageSrc: string;
  };
};

export function EditorHero({ initial }: Props) {
  const [state, action, isPending] = useActionState<HeroDocumentosActionState, FormData>(
    guardarHeroDocumentosAction,
    { error: null, ok: false }
  );

  const [badge, setBadge] = useState(initial.badge);
  const [title, setTitle] = useState(initial.title);
  const [subtitle, setSubtitle] = useState(initial.subtitle);
  const [ghostText, setGhostText] = useState(initial.ghostText);
  const [footnote, setFootnote] = useState(initial.footnote);
  const [bgImageSrc, setBgImageSrc] = useState(initial.bgImageSrc);

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Hidden para que el ImageUploader (controlado por estado) viaje al server */}
      <input type="hidden" name="bgImageSrc" value={bgImageSrc} />

      {/* Sticky header con guardar */}
      <div
        className="flex items-center justify-end gap-3 px-5 py-3 sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
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

      <Card title="Cabecera (hero)" subtitle="Primera sección visible al cargar /documentos-institucionales, con título grande sobre fondo navy.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge superior" hint="Texto pequeño rojo sobre el título.">
            <input
              type="text"
              name="badge"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="DOCUMENTOS INSTITUCIONALES"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text" hint="Texto enorme decorativo de fondo (opacidad muy baja).">
            <input
              type="text"
              name="ghostText"
              value={ghostText}
              onChange={(e) => setGhostText(e.target.value)}
              placeholder="DOCUMENTOS"
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Título principal" required>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <Field label="Subtítulo" hint="Línea explicativa debajo del título.">
          <textarea
            name="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            rows={2}
            style={textareaStyle}
          />
        </Field>

        <Field
          label="Pie del hero"
          hint='Texto pequeño al final del hero. Default: "Unidad Educativa Atenas · Izamba, Ambato". Déjalo vacío para usar el default.'
        >
          <input
            type="text"
            name="footnote"
            value={footnote}
            onChange={(e) => setFootnote(e.target.value)}
            placeholder="Unidad Educativa Atenas · Izamba, Ambato"
            style={inputStyle}
          />
        </Field>

        <ImageUploader
          label="Imagen de fondo del hero"
          value={bgImageSrc}
          onChange={setBgImageSrc}
          prefix="paginas/documentos-institucionales/hero"
          previewAspect="16/9"
          hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa la imagen genérica por defecto. Recomendado: 1440×640px o más."
        />
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

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  height: "auto",
  minHeight: 60,
  paddingTop: 10,
  paddingBottom: 10,
  resize: "vertical",
};
