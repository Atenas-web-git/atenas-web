"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageOff, Plus, Trash2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { MegaMenuCtaButton } from "@/lib/cms/getConfiguracion";
import {
  actualizarConfigGlobalMegaMenuAction,
  type MegaMenuActionState,
} from "./actions";

type Props = {
  initialBgImage: string;
  initialTagline: string;
  initialCtaPretitle: string;
  initialCtaButtons: MegaMenuCtaButton[];
};

const INITIAL_STATE: MegaMenuActionState = { error: null, ok: false };

export function MegaMenuGlobalConfigForm({
  initialBgImage,
  initialTagline,
  initialCtaPretitle,
  initialCtaButtons,
}: Props) {
  const [state, formAction] = useActionState(
    actualizarConfigGlobalMegaMenuAction,
    INITIAL_STATE
  );
  const [bgImage, setBgImage] = useState(initialBgImage);
  const [tagline, setTagline] = useState(initialTagline);
  const [ctaPretitle, setCtaPretitle] = useState(initialCtaPretitle);
  const [ctaButtons, setCtaButtons] = useState<MegaMenuCtaButton[]>(initialCtaButtons);

  const updateBtn = (i: number, patch: Partial<MegaMenuCtaButton>) =>
    setCtaButtons((arr) => arr.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const addBtn = () => setCtaButtons((arr) => [...arr, { label: "", href: "" }]);
  const removeBtn = (i: number) => setCtaButtons((arr) => arr.filter((_, idx) => idx !== i));

  const btnStyleHints = ["Rojo (primario)", "Rojo outline", "Blanco outline", "Blanco outline"];

  return (
    <form action={formAction} className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Apariencia del mega-menú
        </h2>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 660 }}>
          Configuración global que aplica al panel izquierdo del mega-menú cuando
          se despliega en pantallas grandes. La foto se ve detrás del logo con
          una opacidad del 35%; el tagline aparece debajo del logo.
        </p>
      </div>

      <input type="hidden" name="bgImage" value={bgImage} />

      <label className="flex flex-col gap-1.5">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
          Foto de fondo del panel izquierdo
        </span>
        <ImageUploader
          value={bgImage}
          onChange={setBgImage}
          prefix="mega-menu"
          previewAspect="16/9"
        />
        <span style={{ fontSize: 12, color: "#6B6660" }}>
          Se muestra detrás del logo con opacidad reducida + degradado oscuro
          en la parte inferior. Recomendado: foto del campus, panorámica.
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
          Tagline bajo el logo
        </span>
        <textarea
          name="tagline"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          rows={2}
          placeholder="50 años formando líderes&#10;con valores y excelencia."
          style={inputStyle}
        />
        <span style={{ fontSize: 12, color: "#6B6660" }}>
          Cada línea separada con Enter aparece como una línea independiente
          en el panel.
        </span>
      </label>

      <input type="hidden" name="cta_buttons" value={JSON.stringify(ctaButtons)} />

      <div
        className="flex flex-col gap-3 pt-3"
        style={{ borderTop: "1px dashed #E8E4DD" }}
      >
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Franja inferior — CTA + botones + teléfono
          </h3>
          <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0", lineHeight: 1.5 }}>
            Aparece debajo del divisor horizontal al pie del mega-menú. El teléfono
            a la derecha se deriva automáticamente del primer teléfono de la
            sección <strong>Contacto</strong>; aquí solo editas el texto introductorio
            y los 4 botones.
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            Texto introductorio
          </span>
          <input
            type="text"
            name="cta_pretitle"
            value={ctaPretitle}
            onChange={(e) => setCtaPretitle(e.target.value)}
            placeholder="¿Listo para ser parte del Atenas?"
            style={inputStyle}
          />
          <span style={{ fontSize: 12, color: "#6B6660" }}>
            Aparece encima de los botones (solo desktop).
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            Botones (orden fijo de estilo: rojo, rojo outline, blanco outline ×2)
          </span>
          {ctaButtons.map((b, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr_auto] gap-2 items-end p-3"
              style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9e1915",
                  letterSpacing: 0.5,
                  textTransform: "uppercase",
                  paddingBottom: 10,
                }}
              >
                Botón {i + 1}
                <br />
                <span style={{ color: "#A0AABA", fontWeight: 500, textTransform: "none" }}>
                  {btnStyleHints[i] ?? "Blanco outline"}
                </span>
              </span>
              <label className="flex flex-col gap-1">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6660" }}>Texto</span>
                <input
                  type="text"
                  value={b.label}
                  onChange={(e) => updateBtn(i, { label: e.target.value })}
                  placeholder="Solicitar Admisión"
                  style={inputStyle}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B6660" }}>URL</span>
                <input
                  type="text"
                  value={b.href}
                  onChange={(e) => updateBtn(i, { href: e.target.value })}
                  placeholder="/admisiones"
                  style={inputStyle}
                />
              </label>
              <button
                type="button"
                onClick={() => removeBtn(i)}
                aria-label="Eliminar"
                style={{
                  width: 32,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  color: "#991B1B",
                  border: "1px solid #FECACA",
                  borderRadius: 6,
                  cursor: "pointer",
                  marginBottom: 4,
                }}
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addBtn}
            className="flex items-center justify-center gap-1.5 px-4 self-start"
            style={{
              height: 34,
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
            Agregar botón
          </button>
        </div>
      </div>

      {state.error && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 13, color: "#991B1B", margin: 0 }}>{state.error}</p>
        </div>
      )}
      {state.ok && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
        >
          <p style={{ fontSize: 13, color: "#065F46", margin: 0 }}>
            Apariencia del mega-menú guardada ✓
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap pt-2"
        style={{ borderTop: "1px dashed #E8E4DD" }}
      >
        {!bgImage && (
          <span
            className="flex items-center gap-1.5"
            style={{ fontSize: 12, color: "#92400E" }}
          >
            <ImageOff size={12} />
            Sin foto configurada — se usará una de las imágenes por defecto del sitio.
          </span>
        )}
        <div className="ml-auto">
          <SaveBtn />
        </div>
      </div>
    </form>
  );
}

function SaveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 rounded-md transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{
        height: 36,
        background: "#1A2B4A",
        fontSize: 14,
        color: "#FFFFFF",
        fontWeight: 600,
        border: "none",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      {pending ? "Guardando…" : "Guardar apariencia"}
    </button>
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
  resize: "vertical" as const,
};
