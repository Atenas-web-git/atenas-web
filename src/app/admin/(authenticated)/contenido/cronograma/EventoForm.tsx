"use client";

import { useActionState, useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import {
  crearEventoAction,
  actualizarEventoAction,
  type CronogramaActionState,
} from "./actions";

type Opt = { id: number; nombre: string };

type Props = {
  modo: "crear" | "editar";
  periodos: Opt[];
  tipos: Opt[];
  initial?: {
    id: number;
    titulo: string;
    descripcion: string;
    periodo_id: number;
    tipo_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    publicado: boolean;
  };
};

export function EventoForm({ modo, periodos, tipos, initial }: Props) {
  const [state, action, isPending] = useActionState<CronogramaActionState, FormData>(
    modo === "crear" ? crearEventoAction : actualizarEventoAction,
    { error: null, ok: false }
  );

  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [periodoId, setPeriodoId] = useState<number>(initial?.periodo_id ?? periodos[0]?.id ?? 0);
  const [tipoId, setTipoId] = useState<number>(initial?.tipo_id ?? tipos[0]?.id ?? 0);
  const [fechaInicio, setFechaInicio] = useState(initial?.fecha_inicio ?? "");
  const [fechaFin, setFechaFin] = useState(initial?.fecha_fin ?? "");
  const [esRango, setEsRango] = useState<boolean>(!!(initial?.fecha_fin && initial.fecha_fin !== initial.fecha_inicio));
  const [publicado, setPublicado] = useState(initial?.publicado ?? true);

  const finValue = esRango ? fechaFin : "";
  const finDespuesDeInicio =
    !esRango || !fechaFin || !fechaInicio || fechaFin >= fechaInicio;

  return (
    <form action={action} className="flex flex-col gap-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="fecha_fin" value={finValue} />

      {/* Sticky header */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="publicado"
            checked={publicado}
            onChange={(e) => setPublicado(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            {publicado ? "Evento publicado" : "Borrador (no visible al público)"}
          </span>
        </label>
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
            {isPending ? "Guardando…" : modo === "crear" ? "Crear evento" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Datos del evento */}
      <Card title="Información del evento">
        <Field label="Título" required>
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            placeholder="ej. Evaluaciones Finales Quimestre 1"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción" hint="Opcional. Para detalles adicionales del evento.">
          <textarea
            name="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={2}
            placeholder="Detalles, indicaciones o notas para la comunidad."
            style={textareaStyle}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Período" required>
            <select
              name="periodo_id"
              value={periodoId}
              onChange={(e) => setPeriodoId(Number(e.target.value))}
              required
              style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}
            >
              {periodos.length === 0 && (
                <option value="" disabled>Sin períodos — créalos primero</option>
              )}
              {periodos.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de evento" required>
            <select
              name="tipo_id"
              value={tipoId}
              onChange={(e) => setTipoId(Number(e.target.value))}
              required
              style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}
            >
              {tipos.length === 0 && (
                <option value="" disabled>Sin tipos — créalos primero</option>
              )}
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      {/* Fechas */}
      <Card title="Fechas" subtitle="Marca el toggle si el evento dura más de un día.">
        <Field label="Fecha de inicio" required>
          <input
            type="date"
            name="fecha_inicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={esRango}
            onChange={(e) => setEsRango(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, color: "#1A2B4A" }}>
            Es un evento de varios días (definir fecha de fin)
          </span>
        </label>

        {esRango && (
          <Field label="Fecha de fin">
            <input
              type="date"
              value={fechaFin}
              min={fechaInicio || undefined}
              onChange={(e) => setFechaFin(e.target.value)}
              style={inputStyle}
            />
          </Field>
        )}

        {esRango && fechaFin && !finDespuesDeInicio && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-md"
            style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
          >
            <AlertCircle size={14} strokeWidth={2.5} color="#92400E" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              La fecha de fin debe ser igual o posterior a la fecha de inicio.
            </span>
          </div>
        )}
      </Card>
    </form>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
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

const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 };
const hintStyle: React.CSSProperties = { fontSize: 10, color: "#A0AABA", lineHeight: 1.5 };
const inputStyle: React.CSSProperties = { height: 38, border: "1px solid #E8E4DD", borderRadius: 6, paddingLeft: 12, paddingRight: 12, fontSize: 13, color: "#1A2B4A", background: "#FAFAF8", outline: "none", fontFamily: "inherit" };
const textareaStyle: React.CSSProperties = { ...inputStyle, height: "auto", minHeight: 60, paddingTop: 10, paddingBottom: 10, resize: "vertical" };
