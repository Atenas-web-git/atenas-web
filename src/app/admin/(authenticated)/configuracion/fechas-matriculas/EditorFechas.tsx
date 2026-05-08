"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import {
  guardarFechasMatriculasAction,
  type FechasActionState,
} from "./actions";

type Etapa = { etapa: string; rango: string };

export function EditorFechas({
  initialAnoLectivo,
  initialEtapas,
  initialCtaTexto,
  initialCtaUrl,
}: {
  initialAnoLectivo: string;
  initialEtapas: Etapa[];
  initialCtaTexto: string;
  initialCtaUrl: string;
}) {
  const [state, action, isPending] = useActionState<FechasActionState, FormData>(
    guardarFechasMatriculasAction,
    { error: null, ok: false }
  );

  const [anoLectivo, setAnoLectivo] = useState(initialAnoLectivo);
  const [etapas, setEtapas] = useState<Etapa[]>(initialEtapas);
  const [ctaTexto, setCtaTexto] = useState(initialCtaTexto);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);

  const updateEtapa = (i: number, patch: Partial<Etapa>) =>
    setEtapas((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addEtapa = () =>
    setEtapas((prev) => [...prev, { etapa: "Nueva etapa", rango: "" }]);
  const removeEtapa = (i: number) =>
    setEtapas((prev) => prev.filter((_, idx) => idx !== i));
  const moveEtapa = (i: number, dir: -1 | 1) => {
    setEtapas((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const etapasJson = JSON.stringify(etapas);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="etapas" value={etapasJson} />

      {/* Header sticky */}
      <div
        className="flex items-center justify-end gap-3 px-5 py-3 sticky top-0 z-10"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
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

      {/* Año lectivo */}
      <Card title="Año lectivo" subtitle="Aparece grande en blanco dentro del banner.">
        <Field label="Texto del año lectivo" required>
          <input
            type="text"
            name="ano_lectivo"
            value={anoLectivo}
            onChange={(e) => setAnoLectivo(e.target.value)}
            required
            placeholder="Año lectivo 2026–2027"
            style={inputStyle}
          />
        </Field>
      </Card>

      {/* Etapas */}
      <Card
        title="Etapas del proceso"
        subtitle="Cada etapa aparece como una línea con punto rojo + etiqueta + rango. Puedes agregar tantas como quieras y reordenarlas con las flechas."
      >
        <div className="flex flex-col gap-3">
          {etapas.length === 0 && (
            <p
              className="px-4 py-3 rounded-md"
              style={{
                background: "#FAFAF8",
                border: "1px dashed #C9C4BB",
                fontSize: 12,
                color: "#6B6660",
                margin: 0,
                textAlign: "center",
              }}
            >
              No hay etapas definidas. Agrega la primera abajo.
            </p>
          )}

          {etapas.map((e, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-4"
              style={{
                background: "#FAFAF8",
                border: "1px solid #E8E4DD",
                borderRadius: 8,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span style={smallLabel}>Etapa #{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveEtapa(i, -1)}
                    disabled={i === 0}
                    aria-label="Subir"
                    style={iconButton(i === 0)}
                  >
                    <ArrowUp size={12} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEtapa(i, 1)}
                    disabled={i === etapas.length - 1}
                    aria-label="Bajar"
                    style={iconButton(i === etapas.length - 1)}
                  >
                    <ArrowDown size={12} strokeWidth={2.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeEtapa(i)}
                    aria-label="Eliminar"
                    style={iconButton(false, "#991B1B", "#FECACA")}
                  >
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Field label="Etiqueta" hint="ej. Inscripciones, Matrículas nuevas, Reingreso.">
                  <input
                    type="text"
                    value={e.etapa}
                    onChange={(ev) => updateEtapa(i, { etapa: ev.target.value })}
                    placeholder="Inscripciones"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Rango de fechas" hint='ej. "3 – 28 feb 2026" o "del 3 al 28 de febrero".'>
                  <input
                    type="text"
                    value={e.rango}
                    onChange={(ev) => updateEtapa(i, { rango: ev.target.value })}
                    placeholder="3 – 28 feb 2026"
                    style={inputStyle}
                  />
                </Field>
              </div>
            </div>
          ))}

          <button type="button" onClick={addEtapa} style={dashedAddBtn}>
            <Plus size={12} strokeWidth={2.5} />
            Agregar etapa
          </button>
        </div>
      </Card>

      {/* CTA */}
      <Card
        title="Botón de llamada a la acción (opcional)"
        subtitle="Aparece a la derecha del banner como botón rojo. Si lo dejas vacío, no se muestra."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Texto del botón">
            <input
              type="text"
              name="cta_texto"
              value={ctaTexto}
              onChange={(e) => setCtaTexto(e.target.value)}
              placeholder="Iniciar proceso"
              style={inputStyle}
            />
          </Field>
          <Field label="URL del botón">
            <input
              type="text"
              name="cta_url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="/matriculas/proceso"
              style={inputStyle}
            />
          </Field>
        </div>
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
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
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
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>
          {hint}
        </span>
      )}
    </div>
  );
}

const smallLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#A0AABA",
  textTransform: "uppercase",
  letterSpacing: 0.5,
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

function iconButton(
  disabled: boolean,
  color: string = "#1A2B4A",
  border: string = "#E8E4DD"
): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : color,
    border: `1px solid ${border}`,
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}

const dashedAddBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  alignSelf: "flex-start",
  height: 36,
  paddingLeft: 14,
  paddingRight: 14,
  background: "transparent",
  color: "#1A2B4A",
  border: "1px dashed #C9C4BB",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
