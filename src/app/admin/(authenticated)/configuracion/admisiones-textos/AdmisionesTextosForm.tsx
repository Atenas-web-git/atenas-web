"use client";

import { useActionState, useState } from "react";
import { Save, ChevronDown, ChevronRight } from "lucide-react";
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

  const c = initialConfig;
  const f = c.formulario;

  return (
    <form action={action} className="flex flex-col gap-5">
      <Sticky state={state} isPending={isPending} />

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <Section
        title="Header del wizard"
        subtitle="Barra superior fija de /admisiones/formulario."
        defaultOpen
      >
        <Field label="Título centrado">
          <input
            type="text" name="f_headerTitle"
            defaultValue={f.headerTitle} style={inputStyle}
          />
        </Field>
        <Field label="Link de volver">
          <input
            type="text" name="f_backLabel"
            defaultValue={f.backLabel} style={inputStyle}
          />
        </Field>
      </Section>

      {/* ── PASOS DEL WIZARD ─────────────────────────────────────────── */}
      <Section
        title="Títulos y subtítulos de los 4 pasos"
        subtitle="Encabezado y descripción que se muestran arriba de los campos en cada paso."
      >
        {[1, 2, 3, 4].map((n) => {
          const k = `paso${n}` as keyof typeof f.pasoTitulos;
          return (
            <div
              key={n}
              className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-3 items-start py-2"
              style={{ borderBottom: n < 4 ? "1px solid #F4F1EB" : "none" }}
            >
              <span style={tagStyle}>Paso {n}</span>
              <div className="flex flex-col gap-2">
                <input
                  type="text" name={`f_pasoTitulo_${n}`}
                  defaultValue={f.pasoTitulos[k]} style={inputStyle}
                  placeholder="Título del paso"
                />
                <textarea
                  name={`f_pasoSubtitulo_${n}`}
                  defaultValue={f.pasoSubtitulos[k]} rows={2}
                  style={textareaStyle} placeholder="Descripción / subtítulo"
                />
              </div>
            </div>
          );
        })}
      </Section>

      {/* ── PASO 1 — CAMPOS DEL ESTUDIANTE ───────────────────────────── */}
      <Section title="Paso 1 · Campos del estudiante">
        <CampoConPlaceholder
          tag="Nombres" labelName="f_est_nombresLabel"
          phName="f_est_nombresPlaceholder"
          labelDefault={f.camposEstudiante.nombresLabel}
          phDefault={f.camposEstudiante.nombresPlaceholder}
        />
        <CampoConPlaceholder
          tag="Apellidos" labelName="f_est_apellidosLabel"
          phName="f_est_apellidosPlaceholder"
          labelDefault={f.camposEstudiante.apellidosLabel}
          phDefault={f.camposEstudiante.apellidosPlaceholder}
        />
        <Field label="Fecha de nacimiento — etiqueta">
          <input
            type="text" name="f_est_fechaNacLabel"
            defaultValue={f.camposEstudiante.fechaNacLabel} style={inputStyle}
          />
        </Field>
        <CampoConPlaceholder
          tag="Nivel" labelName="f_est_nivelLabel"
          phName="f_est_nivelPlaceholder"
          labelDefault={f.camposEstudiante.nivelLabel}
          phDefault={f.camposEstudiante.nivelPlaceholder}
          phHint='Texto del placeholder del select (p.ej. "Selecciona el nivel...").'
        />
        <CampoConPlaceholder
          tag="Institución" labelName="f_est_institucionLabel"
          phName="f_est_institucionPlaceholder"
          labelDefault={f.camposEstudiante.institucionLabel}
          phDefault={f.camposEstudiante.institucionPlaceholder}
        />
      </Section>

      {/* ── PASO 2 — CAMPOS DEL REPRESENTANTE ────────────────────────── */}
      <Section title="Paso 2 · Campos del representante">
        <CampoConPlaceholder
          tag="Nombres" labelName="f_rep_nombresLabel"
          phName="f_rep_nombresPlaceholder"
          labelDefault={f.camposRepresentante.nombresLabel}
          phDefault={f.camposRepresentante.nombresPlaceholder}
        />
        <CampoConPlaceholder
          tag="Apellidos" labelName="f_rep_apellidosLabel"
          phName="f_rep_apellidosPlaceholder"
          labelDefault={f.camposRepresentante.apellidosLabel}
          phDefault={f.camposRepresentante.apellidosPlaceholder}
        />
        <CampoConPlaceholder
          tag="Relación" labelName="f_rep_relacionLabel"
          phName="f_rep_relacionPlaceholder"
          labelDefault={f.camposRepresentante.relacionLabel}
          phDefault={f.camposRepresentante.relacionPlaceholder}
        />
        <CampoConPlaceholder
          tag="Correo" labelName="f_rep_correoLabel"
          phName="f_rep_correoPlaceholder"
          labelDefault={f.camposRepresentante.correoLabel}
          phDefault={f.camposRepresentante.correoPlaceholder}
        />
        <CampoConPlaceholder
          tag="Teléfono" labelName="f_rep_telefonoLabel"
          phName="f_rep_telefonoPlaceholder"
          labelDefault={f.camposRepresentante.telefonoLabel}
          phDefault={f.camposRepresentante.telefonoPlaceholder}
        />
      </Section>

      {/* ── PASO 3 — CAMPOS ADICIONALES ──────────────────────────────── */}
      <Section title="Paso 3 · Información adicional">
        <CampoConPlaceholder
          tag="¿Cómo se enteró?" labelName="f_ad_comoEnteradoLabel"
          phName="f_ad_comoEnteradoPlaceholder"
          labelDefault={f.camposAdicional.comoEnteradoLabel}
          phDefault={f.camposAdicional.comoEnteradoPlaceholder}
        />
        <CampoConPlaceholder
          tag="Año de ingreso" labelName="f_ad_anioIngresoLabel"
          phName="f_ad_anioIngresoPlaceholder"
          labelDefault={f.camposAdicional.anioIngresoLabel}
          phDefault={f.camposAdicional.anioIngresoPlaceholder}
        />
        <CampoConPlaceholder
          tag="Comentarios" labelName="f_ad_comentariosLabel"
          phName="f_ad_comentariosPlaceholder"
          labelDefault={f.camposAdicional.comentariosLabel}
          phDefault={f.camposAdicional.comentariosPlaceholder}
        />
      </Section>

      {/* ── OPCIONES DE SELECTS ──────────────────────────────────────── */}
      <Section
        title="Opciones de los menús desplegables"
        subtitle="Una opción por línea. Si se deja vacío se usan las opciones por defecto."
      >
        <Field
          label="Niveles educativos"
          hint='Niveles disponibles en el select "Nivel al que aplica". Deben coincidir con los configurados en /admin/admisiones/cupos.'
        >
          <textarea
            name="f_op_niveles"
            defaultValue={f.opciones.niveles.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
        <Field
          label="Relaciones del representante"
          hint='Opciones del select "Relación con el estudiante".'
        >
          <textarea
            name="f_op_relaciones"
            defaultValue={f.opciones.relaciones.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
        <Field
          label="¿Cómo se enteró del colegio?"
          hint='Opciones del select correspondiente del paso 3.'
        >
          <textarea
            name="f_op_comoEnterado"
            defaultValue={f.opciones.comoEnterado.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
      </Section>

      {/* ── PASO 4 — CONFIRMACIÓN ────────────────────────────────────── */}
      <Section
        title="Paso 4 · Resumen de confirmación"
        subtitle="Títulos de cada bloque del resumen y mensaje final."
      >
        <Field label="Sección Datos del Estudiante">
          <input
            type="text" name="f_conf_seccionEstudiante"
            defaultValue={f.confirmacion.seccionEstudiante} style={inputStyle}
          />
        </Field>
        <Field label="Sección Datos del Representante">
          <input
            type="text" name="f_conf_seccionRepresentante"
            defaultValue={f.confirmacion.seccionRepresentante} style={inputStyle}
          />
        </Field>
        <Field label="Sección Información Adicional">
          <input
            type="text" name="f_conf_seccionAdicional"
            defaultValue={f.confirmacion.seccionAdicional} style={inputStyle}
          />
        </Field>
        <Field label='Etiqueta del botón "Editar"'>
          <input
            type="text" name="f_conf_botonEditar"
            defaultValue={f.confirmacion.botonEditar} style={inputStyle}
          />
        </Field>
        <Field
          label="Mensaje final"
          hint="Aparece al pie del paso de confirmación, antes del botón Enviar."
        >
          <textarea
            name="f_conf_mensajeFinal"
            defaultValue={f.confirmacion.mensajeFinal} rows={2}
            style={textareaStyle}
          />
        </Field>
      </Section>

      {/* ── NAVEGACIÓN ───────────────────────────────────────────────── */}
      <Section title="Botones de navegación">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Anterior">
            <input
              type="text" name="f_nav_anterior"
              defaultValue={f.navegacion.anterior} style={inputStyle}
            />
          </Field>
          <Field label="Siguiente">
            <input
              type="text" name="f_nav_siguiente"
              defaultValue={f.navegacion.siguiente} style={inputStyle}
            />
          </Field>
          <Field label="Enviar (botón final)">
            <input
              type="text" name="f_nav_enviar"
              defaultValue={f.navegacion.enviar} style={inputStyle}
            />
          </Field>
          <Field label="Enviando (en progreso)">
            <input
              type="text" name="f_nav_enviando"
              defaultValue={f.navegacion.enviando} style={inputStyle}
            />
          </Field>
        </div>
      </Section>

      {/* ── PANTALLA DE ÉXITO ────────────────────────────────────────── */}
      <Section
        title="Pantalla de éxito"
        subtitle="Lo que ve el postulante después de enviar la solicitud."
      >
        <Field label="Título">
          <input
            type="text" name="f_ex_titulo"
            defaultValue={f.exito.titulo} style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            name="f_ex_descripcion"
            defaultValue={f.exito.descripcion} rows={3} style={textareaStyle}
          />
        </Field>
        <Field label='Etiqueta arriba del N° (ej. "N° de seguimiento")'>
          <input
            type="text" name="f_ex_etiquetaSeguimiento"
            defaultValue={f.exito.etiquetaSeguimiento} style={inputStyle}
          />
        </Field>
        <Field label='Título del bloque "¿Qué sigue?"'>
          <input
            type="text" name="f_ex_queSigueTitulo"
            defaultValue={f.exito.queSigueTitulo} style={inputStyle}
          />
        </Field>
        <Field
          label="Pasos siguientes (una línea por bullet)"
          hint="Cada línea es un bullet con check verde."
        >
          <textarea
            name="f_ex_queSigueBullets"
            defaultValue={f.exito.queSigueBullets.join("\n")}
            rows={5} style={textareaStyle}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Botón secundario (volver)">
            <input
              type="text" name="f_ex_botonVolver"
              defaultValue={f.exito.botonVolver} style={inputStyle}
            />
          </Field>
          <Field label="Botón primario (inicio)">
            <input
              type="text" name="f_ex_botonInicio"
              defaultValue={f.exito.botonInicio} style={inputStyle}
            />
          </Field>
        </div>
      </Section>

      {/* ── PRIVACIDAD ───────────────────────────────────────────────── */}
      <Section
        title="Aviso de privacidad"
        subtitle='Texto al pie del wizard. Usa el marcador {{politica}} donde quieras que aparezca el link a la política.'
      >
        <Field
          label="Texto del aviso"
          hint='Ejemplo: "Al enviar aceptas nuestra {{politica}}. Tus datos…"'
        >
          <textarea
            name="f_priv_texto"
            defaultValue={f.privacidad.texto} rows={3} style={textareaStyle}
          />
        </Field>
        <Field label='Texto del link (apunta a /politicas)'>
          <input
            type="text" name="f_priv_politicaLabel"
            defaultValue={f.privacidad.politicaLabel} style={inputStyle}
          />
        </Field>
      </Section>

      {/* ── SEGUIMIENTO ──────────────────────────────────────────────── */}
      <Section
        title="/admisiones/seguimiento"
        subtitle="Header + intro de la página donde el representante consulta el estado de su solicitud."
      >
        <Field label="Título del header">
          <input
            type="text" name="s_headerTitle"
            defaultValue={c.seguimiento.headerTitle} style={inputStyle}
          />
        </Field>
        <Field label="Link de volver">
          <input
            type="text" name="s_backLabel"
            defaultValue={c.seguimiento.backLabel} style={inputStyle}
          />
        </Field>
        <Field label="Título de la intro">
          <input
            type="text" name="s_introTitle"
            defaultValue={c.seguimiento.introTitle} style={inputStyle}
          />
        </Field>
        <Field label="Descripción de la intro">
          <textarea
            name="s_introDescription"
            defaultValue={c.seguimiento.introDescription}
            rows={3} style={textareaStyle}
          />
        </Field>
      </Section>
    </form>
  );
}

// ── Componentes de UI ──────────────────────────────────────────────────────

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
        Los cambios aplican al guardar. Campos vacíos vuelven al valor por defecto.
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

function Section({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="flex flex-col"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full text-left p-5"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        {open ? (
          <ChevronDown size={16} color="#6B6660" strokeWidth={2.5} />
        ) : (
          <ChevronRight size={16} color="#6B6660" strokeWidth={2.5} />
        )}
        <div className="flex flex-col gap-0.5 flex-1">
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
          {subtitle && (
            <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      </button>
      {open && (
        <div
          className="flex flex-col gap-4 p-5 pt-0"
          style={{ borderTop: "1px solid #F4F1EB" }}
        >
          <div style={{ marginTop: 16 }} />
          {children}
        </div>
      )}
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

function CampoConPlaceholder({
  tag,
  labelName,
  phName,
  labelDefault,
  phDefault,
  phHint,
}: {
  tag: string;
  labelName: string;
  phName: string;
  labelDefault: string;
  phDefault: string;
  phHint?: string;
}) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[120px_1fr_1fr] gap-3 items-start py-2"
      style={{ borderBottom: "1px solid #F4F1EB" }}
    >
      <span style={tagStyle}>{tag}</span>
      <div className="flex flex-col gap-1">
        <span style={subLabelStyle}>Etiqueta</span>
        <input
          type="text" name={labelName} defaultValue={labelDefault} style={inputStyle}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span style={subLabelStyle}>Placeholder</span>
        <input
          type="text" name={phName} defaultValue={phDefault} style={inputStyle}
        />
        {phHint && (
          <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.4 }}>{phHint}</span>
        )}
      </div>
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

const textareaStyle: React.CSSProperties = {
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  padding: "10px 12px",
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
  resize: "vertical",
};

const tagStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  alignSelf: "flex-start",
  paddingLeft: 10,
  paddingRight: 10,
  height: 22,
  background: "#F4F1EB",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 700,
  color: "#1A2B4A",
  letterSpacing: 0.3,
};

const subLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#A0AABA",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
