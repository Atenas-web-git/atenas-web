"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import type {
  FooterConfig,
  FooterAliado,
  FooterLink,
} from "@/lib/cms/footer";
import { guardarFooterAction, type FooterActionState } from "./actions";

export function FooterForm({ initialFooter }: { initialFooter: FooterConfig }) {
  const [state, action, isPending] = useActionState<FooterActionState, FormData>(
    guardarFooterAction,
    { error: null, ok: false }
  );

  const [aliados, setAliados] = useState<FooterAliado[]>(initialFooter.aliados);
  const [links, setLinks] = useState<FooterLink[]>(initialFooter.links);

  const updateAliado = (i: number, patch: Partial<FooterAliado>) =>
    setAliados((arr) => arr.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  const addAliado = () => setAliados((arr) => [...arr, { label: "", abbr: "" }]);
  const removeAliado = (i: number) => setAliados((arr) => arr.filter((_, idx) => idx !== i));

  const updateLink = (i: number, patch: Partial<FooterLink>) =>
    setLinks((arr) => arr.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const addLink = () => setLinks((arr) => [...arr, { label: "", href: "" }]);
  const removeLink = (i: number) => setLinks((arr) => arr.filter((_, idx) => idx !== i));

  return (
    <form action={action} className="flex flex-col gap-5">
      <Sticky state={state} isPending={isPending} />

      <input type="hidden" name="aliados" value={JSON.stringify(aliados)} />
      <input type="hidden" name="links" value={JSON.stringify(links)} />

      <Card
        title="Identidad y mensaje principal"
        subtitle="Foto de fondo con parallax + headline grande + subtítulo descriptivo. Los datos de contacto (teléfono, correo) y redes se leen de la sección Contacto."
      >
        <div className="flex flex-col gap-3">
          <Field
            label="URL de la imagen de fondo"
            hint="Imagen con efecto parallax. Pega una URL HTTPS (Unsplash, Storage o CDN externo)."
          >
            <input
              type="url"
              name="bgImage"
              defaultValue={initialFooter.bgImage}
              placeholder="https://…"
              style={inputStyle}
            />
          </Field>
          <Field label="Titular (headline)">
            <input
              type="text"
              name="headline"
              defaultValue={initialFooter.headline}
              placeholder="Sé parte del Atenas."
              required
              style={inputStyle}
            />
          </Field>
          <Field label="Subtítulo">
            <textarea
              name="subtitle"
              defaultValue={initialFooter.subtitle}
              placeholder="Conoce nuestra propuesta educativa…"
              rows={2}
              style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Botones (CTAs)"
        subtitle="Dos botones bajo el subtítulo. El primario es rojo, el secundario es outline blanco."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="CTA primario — texto" hint="Botón rojo principal.">
            <input
              type="text"
              name="ctaPrimary_label"
              defaultValue={initialFooter.ctaPrimary.label}
              placeholder="Agenda una visita"
              style={inputStyle}
            />
          </Field>
          <Field label="CTA primario — URL">
            <input
              type="text"
              name="ctaPrimary_href"
              defaultValue={initialFooter.ctaPrimary.href}
              placeholder="/admisiones#visita"
              style={inputStyle}
            />
          </Field>
          <Field label="CTA secundario — texto" hint="Botón outline blanco.">
            <input
              type="text"
              name="ctaSecondary_label"
              defaultValue={initialFooter.ctaSecondary.label}
              placeholder="Proceso de admisión"
              style={inputStyle}
            />
          </Field>
          <Field label="CTA secundario — URL">
            <input
              type="text"
              name="ctaSecondary_href"
              defaultValue={initialFooter.ctaSecondary.href}
              placeholder="/admisiones"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Aliados estratégicos"
        subtitle="Chips bajo las redes sociales. Cada chip muestra la abreviatura visible y el nombre completo al hacer hover (tooltip)."
      >
        <Field label="Etiqueta superior" hint='Ej. "Aliados Estratégicos".'>
          <input
            type="text"
            name="aliadosLabel"
            defaultValue={initialFooter.aliadosLabel}
            placeholder="Aliados Estratégicos"
            style={inputStyle}
          />
        </Field>
        <div className="flex flex-col gap-3 mt-3">
          {aliados.map((a, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end p-3"
              style={panelStyle}
            >
              <Field label="Nombre completo">
                <input
                  type="text"
                  value={a.label}
                  onChange={(e) => updateAliado(i, { label: e.target.value })}
                  placeholder="Bachillerato Internacional (IB)"
                  style={inputStyle}
                />
              </Field>
              <Field label="Abreviatura (chip)">
                <input
                  type="text"
                  value={a.abbr}
                  onChange={(e) => updateAliado(i, { abbr: e.target.value })}
                  placeholder="IB World School"
                  style={inputStyle}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeAliado(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addAliado}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} />
          Agregar aliado
        </button>
      </Card>

      <Card
        title="Enlaces del pie"
        subtitle="Lista de links secundarios (Trabaja con nosotros, Política, etc.). Aparecen en una fila con separadores."
      >
        <div className="flex flex-col gap-3">
          {links.map((l, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 items-end p-3"
              style={panelStyle}
            >
              <Field label="Texto del enlace">
                <input
                  type="text"
                  value={l.label}
                  onChange={(e) => updateLink(i, { label: e.target.value })}
                  placeholder="Trabaja con nosotros"
                  style={inputStyle}
                />
              </Field>
              <Field label="URL">
                <input
                  type="text"
                  value={l.href}
                  onChange={(e) => updateLink(i, { href: e.target.value })}
                  placeholder="/trabaja-con-nosotros"
                  style={inputStyle}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeLink(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addLink}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} />
          Agregar enlace
        </button>
      </Card>

      <Card title="Copyright" subtitle="Última línea al pie del footer.">
        <Field label="Texto del copyright">
          <input
            type="text"
            name="copyright"
            defaultValue={initialFooter.copyright}
            placeholder="© 2026 Unidad Educativa Atenas · Ambato, Ecuador"
            style={inputStyle}
          />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Helpers UI ─── */

function Sticky({ state, isPending }: { state: FooterActionState; isPending: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 14, color: "#6B6660" }}>
        Los cambios aplican al footer de TODAS las páginas al guardar.
      </span>
      <div className="flex items-center gap-3">
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
  children,
}: {
  label: string;
  hint?: string;
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
        {label}
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
const panelStyle: React.CSSProperties = {
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 10,
};
const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "#1A2B4A",
  border: "1px solid #E8E4DD",
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
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
