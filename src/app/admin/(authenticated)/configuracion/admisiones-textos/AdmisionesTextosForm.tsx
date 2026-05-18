"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { AdmisionesTextosConfig } from "@/lib/cms/admisionesTextos";
import {
  guardarAdmisionesTextosAction,
  type AdmisionesTextosActionState,
} from "./actions";

export function AdmisionesTextosForm({
  initialConfig,
}: {
  initialConfig: AdmisionesTextosConfig;
}) {
  const [state, action, isPending] = useActionState<
    AdmisionesTextosActionState,
    FormData
  >(guardarAdmisionesTextosAction, { error: null, ok: false });

  return (
    <form action={action} className="flex flex-col gap-5">
      <Sticky state={state} isPending={isPending} />

      <Card
        title="/admisiones/formulario"
        subtitle="Header del wizard de postulación. La lógica de los 4 pasos del formulario y los campos permanecen en código."
      >
        <Field label="Título del header" hint='Aparece centrado en el header navy (desktop). Ej. "Proceso de Admisión".'>
          <input
            type="text"
            name="formulario_headerTitle"
            defaultValue={initialConfig.formulario.headerTitle}
            placeholder="Proceso de Admisión"
            style={inputStyle}
          />
        </Field>
        <Field label="Texto del link de volver" hint="Link a la derecha del header.">
          <input
            type="text"
            name="formulario_backLabel"
            defaultValue={initialConfig.formulario.backLabel}
            placeholder="← Volver al sitio"
            style={inputStyle}
          />
        </Field>
      </Card>

      <Card
        title="/admisiones/seguimiento"
        subtitle="Header + intro de la página donde el representante consulta el estado de su solicitud con el N° de seguimiento."
      >
        <Field label="Título del header">
          <input
            type="text"
            name="seguimiento_headerTitle"
            defaultValue={initialConfig.seguimiento.headerTitle}
            placeholder="Seguimiento de Solicitud"
            style={inputStyle}
          />
        </Field>
        <Field label="Texto del link de volver">
          <input
            type="text"
            name="seguimiento_backLabel"
            defaultValue={initialConfig.seguimiento.backLabel}
            placeholder="← Volver al sitio"
            style={inputStyle}
          />
        </Field>
        <Field label="Título de la intro" hint="Se muestra arriba del campo de búsqueda.">
          <input
            type="text"
            name="seguimiento_introTitle"
            defaultValue={initialConfig.seguimiento.introTitle}
            placeholder="Consulta el estado de tu solicitud"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción de la intro">
          <textarea
            name="seguimiento_introDescription"
            defaultValue={initialConfig.seguimiento.introDescription}
            rows={3}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
      </Card>
    </form>
  );
}

function Sticky({
  state,
  isPending,
}: {
  state: AdmisionesTextosActionState;
  isPending: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 13, color: "#6B6660" }}>
        Los cambios aplican a /admisiones/formulario y /admisiones/seguimiento al guardar.
      </span>
      <div className="flex items-center gap-3">
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
          fontSize: 11,
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
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
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
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
