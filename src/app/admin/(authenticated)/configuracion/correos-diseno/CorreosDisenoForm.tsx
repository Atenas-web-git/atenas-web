"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import type { CorreosDiseno } from "@/lib/cms/getConfiguracion";
import {
  guardarCorreosDisenoAction,
  type CorreosDisenoActionState,
} from "./actions";

const VARIANT_OPTIONS: Array<{
  value: CorreosDiseno["logoVariant"];
  title: string;
  description: string;
}> = [
  {
    value: "white_on_navy",
    title: "Logo blanco sobre fondo navy",
    description:
      "Header con fondo navy del colegio. Recomendado: tu marca se siente más sólida e institucional.",
  },
  {
    value: "color_on_white",
    title: "Logo a color sobre fondo blanco",
    description:
      "Header limpio con fondo blanco. Recomendado si tu logo a color tiene contraste fuerte y quieres un look más luminoso.",
  },
];

export function CorreosDisenoForm({ initial }: { initial: CorreosDiseno }) {
  const [state, action, isPending] = useActionState<
    CorreosDisenoActionState,
    FormData
  >(guardarCorreosDisenoAction, { error: null, ok: false });

  const [logoVariant, setLogoVariant] = useState(initial.logoVariant);
  const [textoLegal, setTextoLegal] = useState(initial.textoLegal);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="logoVariant" value={logoVariant} />
      <input type="hidden" name="textoLegal" value={textoLegal} />

      <Sticky state={state} isPending={isPending} />

      <Card
        title="Variante del logo en el header"
        subtitle="El header del correo es lo primero que ve el destinatario. Elige cómo quieres que se vea el logo del colegio."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VARIANT_OPTIONS.map((opt) => {
            const selected = logoVariant === opt.value;
            return (
              <label
                key={opt.value}
                className="flex flex-col gap-2 p-4 transition-all"
                style={{
                  border: selected ? "2px solid #1A2B4A" : "1px solid #E8E4DD",
                  borderRadius: 10,
                  background: selected ? "#F4F1EB" : "#FFFFFF",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="variant_radio"
                  value={opt.value}
                  checked={selected}
                  onChange={() => setLogoVariant(opt.value)}
                  style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
                />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>
                  {opt.title}
                </span>
                <p style={{ fontSize: 11, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
                  {opt.description}
                </p>
                <div
                  className="mt-2 flex items-center justify-between rounded px-4 py-3"
                  style={{
                    background: opt.value === "white_on_navy" ? "#1A2B4A" : "#FFFFFF",
                    border:
                      opt.value === "color_on_white" ? "1px solid #E8E4DD" : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                      fontSize: 18,
                      letterSpacing: 1,
                      color:
                        opt.value === "white_on_navy" ? "#FFFFFF" : "#1A2B4A",
                    }}
                  >
                    ATENAS
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 2,
                      padding: "3px 8px",
                      borderRadius: 999,
                      border: "1px solid #9e1915",
                      color: "#9e1915",
                    }}
                  >
                    50 AÑOS
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </Card>

      <Card
        title="Texto legal del footer"
        subtitle="Aparece al pie de los 10 correos, justo debajo del copyright. Mantenlo corto y claro: explica que el correo es transaccional y qué hacer si llegó por error."
      >
        <textarea
          value={textoLegal}
          onChange={(e) => setTextoLegal(e.target.value)}
          rows={4}
          required
          maxLength={1000}
          style={{
            ...inputStyle,
            height: "auto",
            minHeight: 90,
            paddingTop: 10,
            paddingBottom: 10,
            resize: "vertical",
            lineHeight: 1.55,
          }}
        />
        <span style={{ fontSize: 10, color: "#A0AABA" }}>
          {textoLegal.length} / 1000 caracteres
        </span>
      </Card>
    </form>
  );
}

function Sticky({
  state,
  isPending,
}: {
  state: CorreosDisenoActionState;
  isPending: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 12, color: "#6B6660" }}>
        Aplica a los 10 correos transaccionales al guardar.
      </span>
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
