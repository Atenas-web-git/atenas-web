"use client";

import { useActionState, useState } from "react";
import { Pencil, Save, X } from "lucide-react";
import { updateDatosSolicitudAction } from "../actions";
import type { AdmisionActionState } from "../actions";

type DatosSolicitud = {
  est_nombres: string;
  est_apellidos: string;
  est_fecha_nac: string | null;
  est_nivel: string;
  est_institucion_origen: string | null;
  anio_ingreso: string | null;
  rep_nombres: string;
  rep_apellidos: string;
  rep_relacion: string | null;
  rep_correo: string;
  rep_telefono: string;
  como_enterado: string | null;
  comentarios: string | null;
};

type Opciones = {
  niveles: string[];
  relaciones: string[];
  comoEnterado: string[];
  aniosLectivos: string[];
};

/**
 * Bloque editable con los datos del estudiante + representante de una
 * solicitud. Por defecto se muestra como ficha de solo-lectura; al
 * presionar "Editar" se convierte en un formulario con todos los campos
 * habilitados. Solo lo usan superadmin y editor_admisiones (la página
 * padre ya guarda eso).
 *
 * Las listas (niveles, relaciones, etc.) vienen de la misma config que
 * usa el formulario público — para no duplicar la verdad.
 */
export function DatosEditableClient({
  solicitudId,
  initial,
  opciones,
}: {
  solicitudId: string;
  initial: DatosSolicitud;
  opciones: Opciones;
}) {
  const [editing, setEditing] = useState(false);
  const [state, action, isPending] = useActionState<AdmisionActionState, FormData>(
    async (prev, formData) => {
      const result = await updateDatosSolicitudAction(prev, formData);
      if (result.ok) setEditing(false);
      return result;
    },
    { error: null, ok: false }
  );

  if (!editing) {
    return (
      <>
        <div className="flex items-center justify-end gap-2 mb-2">
          {state.ok && (
            <span style={{ fontSize: 11, color: "#065F46", fontWeight: 600 }}>
              Guardado ✓
            </span>
          )}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-80"
            style={{
              height: 30,
              background: "#F4F1EB",
              border: "1px solid #E8E4DD",
              fontSize: 11,
              fontWeight: 600,
              color: "#1A2B4A",
              cursor: "pointer",
            }}
          >
            <Pencil size={11} strokeWidth={2.5} />
            Editar datos
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SectionTitle>Datos del estudiante</SectionTitle>
            <div className="flex flex-col">
              <DataRow label="Nombres" value={initial.est_nombres} />
              <DataRow label="Apellidos" value={initial.est_apellidos} />
              <DataRow label="Fecha de nacimiento" value={initial.est_fecha_nac} />
              <DataRow label="Nivel solicitado" value={initial.est_nivel} />
              <DataRow label="Institución de origen" value={initial.est_institucion_origen} />
              <DataRow label="Año de ingreso" value={initial.anio_ingreso} />
            </div>
          </div>
          <div>
            <SectionTitle>Datos del representante</SectionTitle>
            <div className="flex flex-col">
              <DataRow label="Nombres" value={initial.rep_nombres} />
              <DataRow label="Apellidos" value={initial.rep_apellidos} />
              <DataRow label="Relación" value={initial.rep_relacion} />
              <DataRow label="Correo electrónico" value={initial.rep_correo} />
              <DataRow label="Teléfono / WhatsApp" value={initial.rep_telefono} />
              <DataRow label="¿Cómo se enteró del colegio?" value={initial.como_enterado} />
              <DataRow label="Comentarios" value={initial.comentarios} />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="solicitudId" value={solicitudId} />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
          Editando datos. Los campos con * son obligatorios.
        </p>
        <div className="flex items-center gap-2">
          {state.error && (
            <span style={{ fontSize: 11, color: "#991B1B", fontWeight: 600 }}>
              {state.error}
            </span>
          )}
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-80"
            style={{
              height: 32,
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              fontSize: 12,
              fontWeight: 600,
              color: "#6B6660",
              cursor: "pointer",
            }}
          >
            <X size={12} strokeWidth={2.5} />
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity"
            style={{
              height: 32,
              background: "#1A2B4A",
              border: "none",
              fontSize: 12,
              fontWeight: 600,
              color: "#FFFFFF",
              cursor: isPending ? "wait" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <Save size={12} strokeWidth={2.5} />
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SectionTitle>Datos del estudiante</SectionTitle>
          <div className="flex flex-col gap-3">
            <FieldInput
              label="Nombres *" name="est_nombres" defaultValue={initial.est_nombres}
            />
            <FieldInput
              label="Apellidos *" name="est_apellidos" defaultValue={initial.est_apellidos}
            />
            <FieldInput
              label="Fecha de nacimiento" name="est_fecha_nac" type="date"
              defaultValue={initial.est_fecha_nac ?? ""}
            />
            <FieldSelect
              label="Nivel solicitado *" name="est_nivel"
              options={opciones.niveles} defaultValue={initial.est_nivel}
            />
            <FieldInput
              label="Institución de origen" name="est_institucion_origen"
              defaultValue={initial.est_institucion_origen ?? ""}
            />
            <FieldSelect
              label="Año de ingreso" name="anio_ingreso"
              options={opciones.aniosLectivos} defaultValue={initial.anio_ingreso ?? ""}
              allowEmpty
            />
          </div>
        </div>
        <div>
          <SectionTitle>Datos del representante</SectionTitle>
          <div className="flex flex-col gap-3">
            <FieldInput
              label="Nombres *" name="rep_nombres" defaultValue={initial.rep_nombres}
            />
            <FieldInput
              label="Apellidos *" name="rep_apellidos" defaultValue={initial.rep_apellidos}
            />
            <FieldSelect
              label="Relación" name="rep_relacion"
              options={opciones.relaciones} defaultValue={initial.rep_relacion ?? ""}
              allowEmpty
            />
            <FieldInput
              label="Correo electrónico *" name="rep_correo" type="email"
              defaultValue={initial.rep_correo}
            />
            <FieldInput
              label="Teléfono / WhatsApp *" name="rep_telefono" type="tel"
              defaultValue={initial.rep_telefono}
            />
            <FieldSelect
              label="¿Cómo se enteró del colegio?" name="como_enterado"
              options={opciones.comoEnterado} defaultValue={initial.como_enterado ?? ""}
              allowEmpty
            />
            <FieldTextarea
              label="Comentarios" name="comentarios"
              defaultValue={initial.comentarios ?? ""}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#6B6660",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        margin: "0 0 12px",
      }}
    >
      {children}
    </h3>
  );
}

function DataRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div
      className="flex flex-col gap-0.5 py-2"
      style={{ borderBottom: "1px solid #F4F1EB" }}
    >
      <span style={{ fontSize: 11, color: "#6B6660", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 500 }}>
        {value || "—"}
      </span>
    </div>
  );
}

function FieldInput({
  label, name, defaultValue, type = "text",
}: {
  label: string; name: string; defaultValue: string; type?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span style={fieldLabelStyle}>{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        style={inputStyle}
      />
    </label>
  );
}

function FieldSelect({
  label, name, options, defaultValue, allowEmpty = false,
}: {
  label: string; name: string; options: string[]; defaultValue: string; allowEmpty?: boolean;
}) {
  // Si el valor actual no está en las opciones, lo añadimos al inicio
  // para no perderlo silenciosamente (p.ej. nivel antiguo).
  const opts = defaultValue && !options.includes(defaultValue)
    ? [defaultValue, ...options]
    : options;
  return (
    <label className="flex flex-col gap-1">
      <span style={fieldLabelStyle}>{label}</span>
      <select name={name} defaultValue={defaultValue} style={inputStyle}>
        {allowEmpty && <option value="">—</option>}
        {opts.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function FieldTextarea({
  label, name, defaultValue,
}: {
  label: string; name: string; defaultValue: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span style={fieldLabelStyle}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        style={{ ...inputStyle, height: "auto", paddingTop: 8, paddingBottom: 8, resize: "vertical" }}
      />
    </label>
  );
}

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: "#6B6660",
};

const inputStyle: React.CSSProperties = {
  height: 36,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 10,
  paddingRight: 10,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
