"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageOff } from "lucide-react";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  actualizarConfigGlobalMegaMenuAction,
  type MegaMenuActionState,
} from "./actions";

type Props = {
  initialBgImage: string;
  initialTagline: string;
};

const INITIAL_STATE: MegaMenuActionState = { error: null, ok: false };

export function MegaMenuGlobalConfigForm({
  initialBgImage,
  initialTagline,
}: Props) {
  const [state, formAction] = useActionState(
    actualizarConfigGlobalMegaMenuAction,
    INITIAL_STATE
  );
  const [bgImage, setBgImage] = useState(initialBgImage);
  const [tagline, setTagline] = useState(initialTagline);

  return (
    <form action={formAction} className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Apariencia del mega-menú
        </h2>
        <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0", maxWidth: 660 }}>
          Configuración global que aplica al panel izquierdo del mega-menú cuando
          se despliega en pantallas grandes. La foto se ve detrás del logo con
          una opacidad del 35%; el tagline aparece debajo del logo.
        </p>
      </div>

      <input type="hidden" name="bgImage" value={bgImage} />

      <label className="flex flex-col gap-1.5">
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
          Foto de fondo del panel izquierdo
        </span>
        <ImageUploader
          value={bgImage}
          onChange={setBgImage}
          prefix="mega-menu"
          previewAspect="16/9"
        />
        <span style={{ fontSize: 11, color: "#6B6660" }}>
          Se muestra detrás del logo con opacidad reducida + degradado oscuro
          en la parte inferior. Recomendado: foto del campus, panorámica.
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
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
        <span style={{ fontSize: 11, color: "#6B6660" }}>
          Cada línea separada con Enter aparece como una línea independiente
          en el panel.
        </span>
      </label>

      {state.error && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{state.error}</p>
        </div>
      )}
      {state.ok && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#DCFCE7", border: "1px solid #86EFAC" }}
        >
          <p style={{ fontSize: 12, color: "#065F46", margin: 0 }}>
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
            style={{ fontSize: 11, color: "#92400E" }}
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
        fontSize: 13,
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
  fontSize: 13,
  color: "#1A2B4A",
  outline: "none",
  fontFamily: "inherit",
  lineHeight: 1.4,
  resize: "vertical" as const,
};
