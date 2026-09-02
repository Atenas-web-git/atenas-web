"use client";

import { Fragment, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ADMISIONES_TEXTOS_DEFAULT,
  type AdmisionesTextosConfig,
} from "@/lib/cms/admisionesTextos";
import {
  GRADOS_POR_NIVEL,
  esNivel,
  esTramitePresencial,
} from "@/lib/admisiones/grados";

// ── Tipos ──────────────────────────────────────────────────────────────────
type FormularioTextos = AdmisionesTextosConfig["formulario"];

type FormData = {
  est_nombres: string;
  est_apellidos: string;
  est_fecha_nac: string;
  est_nivel: string;
  est_grado: string;
  est_institucion_origen: string;
  rep_nombres: string;
  rep_apellidos: string;
  rep_relacion: string;
  rep_correo: string;
  rep_telefono: string;
  como_enterado: string;
  anio_ingreso: string;
  comentarios: string;
};

function makeInitial(nivelInicial: string): FormData {
  return {
    est_nombres: "", est_apellidos: "", est_fecha_nac: "", est_nivel: nivelInicial,
    est_grado: "",
    est_institucion_origen: "",
    rep_nombres: "", rep_apellidos: "", rep_relacion: "", rep_correo: "", rep_telefono: "",
    como_enterado: "", anio_ingreso: "", comentarios: "",
  };
}

const ANIOS_FALLBACK = ["2026-2027", "2027-2028"];

// Etiquetas cortas del chip indicador de pasos. No editables (las largas
// viven en `pasoTitulos`). Mantener cortas para no romper el layout.
const STEP_INDICATOR_LABELS = ["Estudiante", "Representante", "Adicional", "Confirmar"];

// ── Validación ─────────────────────────────────────────────────────────────
// Mensajes técnicos — no se exponen al editor.
function validateStep(step: number, data: FormData): string | null {
  if (step === 1) {
    if (!data.est_nombres.trim()) return "Ingresa los nombres del estudiante.";
    if (!data.est_apellidos.trim()) return "Ingresa los apellidos del estudiante.";
    if (!data.est_nivel) return "Selecciona el nivel al que aplica.";
    // Solo se exige si de verdad hay años que elegir. Las etiquetas de nivel
    // son editables desde Configuración › Admisiones, y si el colegio escribe
    // una que no está en el catálogo, el selector no aparece — exigirlo
    // entonces dejaba el formulario sin salida, pidiendo rellenar algo que no
    // se ve.
    if (esNivel(data.est_nivel) && !data.est_grado)
      return "Selecciona el año al que ingresa.";
  }
  if (step === 2) {
    if (!data.rep_nombres.trim()) return "Ingresa los nombres del representante.";
    if (!data.rep_apellidos.trim()) return "Ingresa los apellidos del representante.";
    if (!data.rep_relacion) return "Indica la relación con el estudiante.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.rep_correo))
      return "Ingresa un correo electrónico válido.";
    if (!data.rep_telefono.trim()) return "Ingresa el teléfono de contacto.";
  }
  return null;
}

// ── Input field ────────────────────────────────────────────────────────────
function Field({
  label, type = "text", placeholder, value, onChange, required, inputMode,
}: {
  label: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; required?: boolean;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[13px] font-medium text-[#1A1A1A]" style={{ fontFamily: "Poppins, sans-serif" }}>
        {label}{required && <span className="text-red ml-[2px]">*</span>}
      </label>
      <div
        className="rounded-[4px] border bg-white transition-[border-color,box-shadow] duration-150"
        style={{
          borderColor: focused ? "var(--color-navy)" : "#C8C4BD",
          boxShadow: focused ? "0 0 0 3px rgba(26,43,74,0.09)" : "none",
        }}
      >
        <input
          type={type}
          inputMode={inputMode}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[44px] bg-transparent rounded-[4px] px-[14px] outline-none
            text-[#1A1A1A] placeholder:text-[#9CA3AF] text-[14px]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        />
      </div>
    </div>
  );
}

// ── Select field ───────────────────────────────────────────────────────────
function SelectField({
  label, options, value, onChange, placeholder, required,
}: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; placeholder?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[13px] font-medium text-[#1A1A1A]" style={{ fontFamily: "Poppins, sans-serif" }}>
        {label}{required && <span className="text-red ml-[2px]">*</span>}
      </label>
      <div
        className="rounded-[4px] border bg-white transition-[border-color,box-shadow] duration-150 relative"
        style={{
          borderColor: focused ? "var(--color-navy)" : "#C8C4BD",
          boxShadow: focused ? "0 0 0 3px rgba(26,43,74,0.09)" : "none",
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[44px] bg-transparent rounded-[4px] px-[14px] pr-[40px] outline-none
            appearance-none text-[14px] cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif", color: value ? "#1A1A1A" : "#9CA3AF" }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <svg
          className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="#9CA3AF" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

// ── Textarea field ─────────────────────────────────────────────────────────
function TextareaField({
  label, placeholder, value, onChange,
}: {
  label: string; placeholder: string; value: string; onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[13px] font-medium text-[#1A1A1A]" style={{ fontFamily: "Poppins, sans-serif" }}>
        {label}
      </label>
      <div
        className="rounded-[4px] border bg-white transition-[border-color,box-shadow] duration-150"
        style={{
          borderColor: focused ? "var(--color-navy)" : "#C8C4BD",
          boxShadow: focused ? "0 0 0 3px rgba(26,43,74,0.09)" : "none",
        }}
      >
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={4}
          className="w-full bg-transparent rounded-[4px] px-[14px] py-[11px] outline-none resize-none
            text-[#1A1A1A] placeholder:text-[#9CA3AF] text-[14px]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        />
      </div>
    </div>
  );
}

// ── Step indicator ─────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start w-full">
      {STEP_INDICATOR_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <Fragment key={n}>
            {i > 0 && (
              <div
                className="flex-1 h-[2px] mt-[19px]"
                style={{ background: n <= current ? "var(--color-red)" : "#E5E7EB" }}
              />
            )}
            <div className="flex flex-col items-center gap-[8px]">
              <div
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center
                  text-[14px] font-bold flex-shrink-0 transition-all duration-200"
                style={{
                  background: done ? "var(--color-red)" : active ? "var(--color-navy)" : "#FFFFFF",
                  border: done || active ? "none" : "1.5px solid #C8C4BD",
                  color: done || active ? "#FFFFFF" : "#9CA3AF",
                  boxShadow: active ? "0 0 0 4px rgba(26,43,74,0.10)" : "none",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span
                className="text-[11px] font-semibold text-center hidden sm:block whitespace-nowrap"
                style={{ fontFamily: "Poppins, sans-serif", color: done ? "var(--color-red)" : active ? "var(--color-navy)" : "#9CA3AF" }}
              >
                {label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ── Step field sections ────────────────────────────────────────────────────
function Step1Fields({
  form, set, textos, contactoAviso,
}: {
  form: FormData;
  set: (k: keyof FormData) => (v: string) => void;
  textos: FormularioTextos;
  contactoAviso?: ContactoAviso;
}) {
  const e = textos.camposEstudiante;

  const gradosDisponibles = esNivel(form.est_nivel)
    ? GRADOS_POR_NIVEL[form.est_nivel]
    : [];

  // Cambiar de nivel invalida el año elegido: «3ro EGB» no existe en
  // Bachillerato. Si no se limpiara, la solicitud llegaría con una pareja
  // imposible y nadie se enteraría hasta leerla.
  const cambiarNivel = (valor: string) => {
    set("est_nivel")(valor);
    set("est_grado")("");
  };

  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label={e.nombresLabel} placeholder={e.nombresPlaceholder}
          value={form.est_nombres} onChange={set("est_nombres")} required />
        <Field label={e.apellidosLabel} placeholder={e.apellidosPlaceholder}
          value={form.est_apellidos} onChange={set("est_apellidos")} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label={e.fechaNacLabel} type="date" placeholder=""
          value={form.est_fecha_nac} onChange={set("est_fecha_nac")} />
        <SelectField label={e.nivelLabel} options={textos.opciones.niveles}
          value={form.est_nivel} onChange={cambiarNivel}
          placeholder={e.nivelPlaceholder} required />
      </div>
      {gradosDisponibles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
          <SelectField
            label="Año al que ingresa"
            options={gradosDisponibles}
            value={form.est_grado}
            onChange={set("est_grado")}
            placeholder="Selecciona el año..."
            required
          />
        </div>
      )}
      <AvisoTramitePresencial
        grado={form.est_grado}
        textos={textos.tramitePresencial}
        contacto={contactoAviso}
      />
      <Field
        label={e.institucionLabel}
        placeholder={e.institucionPlaceholder}
        value={form.est_institucion_origen}
        onChange={set("est_institucion_origen")}
      />
    </div>
  );
}

/**
 * Aviso para 2do y 3ro de bachillerato.
 *
 * El colegio se reserva el derecho de admisión en esos dos años y el trámite
 * se hace en persona. **No se bloquea el envío**: se avisa. Bloquear evitaría
 * falsas expectativas, pero un contacto perdido no se recupera y el colegio
 * conserva su derecho de admisión igual.
 *
 * Aparece en el PASO 1, en cuanto se elige el año, y no al final: quien tiene
 * que ir presencialmente merece saberlo antes de escribir cuatro pantallas de
 * datos.
 */
/** Los datos de contacto del aviso, ya resueltos por la página. */
export type ContactoAviso = {
  direccion: string;
  correo: string;
  /** Horario general del colegio. Lo pisa el del propio aviso si lo hay. */
  horario: string;
  /** Todos los teléfonos configurados; el aviso elige uno por su etiqueta. */
  telefonos: { label: string; numero: string; extension: string }[];
};

function AvisoTramitePresencial({
  grado,
  textos,
  contacto,
}: {
  grado: string;
  textos: FormularioTextos["tramitePresencial"];
  contacto?: ContactoAviso;
}) {
  if (!esTramitePresencial(grado)) return null;

  // `{{grado}}` deja que el colegio escriba un solo texto que nombra el año
  // elegido, en vez de una versión para 2do y otra para 3ro.
  const conGrado = (t: string) => t.replaceAll("{{grado}}", grado);

  // El horario propio del aviso gana al general del colegio: admisiones puede
  // atender en otra franja. Si ninguno de los dos existe, no se inventa nada.
  const horario = textos.horario.trim() || contacto?.horario?.trim() || "";

  /*
    Qué teléfono se enseña. Lo elige el colegio desde el panel guardando la
    ETIQUETA del teléfono, no el número: así, si cambian el número en
    Configuración › Datos de contacto, el aviso lo sigue solo.

    Si la etiqueta guardada ya no existe —la renombraron— se cae al de
    Admisiones, y de ahí al primero. Enseñar un teléfono del colegio siempre es
    mejor que no enseñar ninguno.
  */
  const lista = contacto?.telefonos ?? [];
  const elegido =
    lista.find((t) => t.label === textos.telefonoLabel.trim()) ??
    lista.find((t) => /admisi/i.test(t.label)) ??
    lista[0];

  // La extensión del aviso pisa a la del contacto: la de admisiones no tiene
  // por qué ser la de la centralita general, y en la práctica no coincidían.
  const extension = textos.extension.trim() || elegido?.extension?.trim() || "";

  return (
    <div
      role="status"
      className="flex flex-col gap-2 px-5 py-4"
      style={{
        background: "rgba(158,25,21,0.06)",
        border: "1px solid rgba(158,25,21,0.22)",
        borderRadius: 12,
      }}
    >
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "var(--color-red, #9e1915)",
          margin: 0,
        }}
      >
        {conGrado(textos.titulo)}
      </p>
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 13.5,
          color: "#2C2C2C",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {conGrado(textos.cuerpo)}
      </p>
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 13,
          color: "#6B6660",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {/*
          Dirección, teléfono y correo salen de Configuración —Marca y Datos de
          contacto—, no de aquí. Estaban escritos a mano en este componente, así
          que cambiar el teléfono del colegio obligaba a desplegar, y quedaban
          dos sitios diciendo cosas distintas.

          Cada trozo se pinta solo si existe: un colegio sin extensión no debe
          ver un «ext.» suelto.
        */}
        {contacto?.direccion && <>{contacto.direccion}</>}
        {elegido?.numero && (
          <>
            {contacto?.direccion ? " · " : ""}
            <a
              href={`tel:${elegido.numero.replace(/[^+\d]/g, "")}`}
              style={{ color: "var(--color-navy, #1A2B4A)", fontWeight: 600 }}
            >
              {elegido.numero}
            </a>
            {extension && ` ext. ${extension}`}
          </>
        )}
        {contacto?.correo && (
          <>
            {" · "}
            <a
              href={`mailto:${contacto.correo}`}
              style={{ color: "var(--color-navy, #1A2B4A)", fontWeight: 600 }}
            >
              {contacto.correo}
            </a>
          </>
        )}
        {horario && (
          <>
            <br />
            {horario}
          </>
        )}
      </p>
    </div>
  );
}

function Step2Fields({
  form, set, textos,
}: {
  form: FormData; set: (k: keyof FormData) => (v: string) => void; textos: FormularioTextos;
}) {
  const r = textos.camposRepresentante;
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label={r.nombresLabel} placeholder={r.nombresPlaceholder}
          value={form.rep_nombres} onChange={set("rep_nombres")} required />
        <Field label={r.apellidosLabel} placeholder={r.apellidosPlaceholder}
          value={form.rep_apellidos} onChange={set("rep_apellidos")} required />
      </div>
      <SelectField label={r.relacionLabel} options={textos.opciones.relaciones}
        value={form.rep_relacion} onChange={set("rep_relacion")}
        placeholder={r.relacionPlaceholder} required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label={r.correoLabel} type="email" placeholder={r.correoPlaceholder}
          value={form.rep_correo} onChange={set("rep_correo")} required inputMode="email" />
        <Field label={r.telefonoLabel} type="tel" placeholder={r.telefonoPlaceholder}
          value={form.rep_telefono} onChange={set("rep_telefono")} required inputMode="tel" />
      </div>
    </div>
  );
}

function Step3Fields({
  form, set, anios, textos,
}: {
  form: FormData; set: (k: keyof FormData) => (v: string) => void; anios: string[]; textos: FormularioTextos;
}) {
  const a = textos.camposAdicional;
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <SelectField label={a.comoEnteradoLabel} options={textos.opciones.comoEnterado}
          value={form.como_enterado} onChange={set("como_enterado")}
          placeholder={a.comoEnteradoPlaceholder} />
        <SelectField label={a.anioIngresoLabel} options={anios}
          value={form.anio_ingreso} onChange={set("anio_ingreso")}
          placeholder={a.anioIngresoPlaceholder} />
      </div>
      <TextareaField
        label={a.comentariosLabel}
        placeholder={a.comentariosPlaceholder}
        value={form.comentarios} onChange={set("comentarios")}
      />
    </div>
  );
}

// ── Confirmation summary ───────────────────────────────────────────────────
function SummaryBlock({
  title, rows, onEdit, editLabel,
}: {
  title: string; rows: [string, string][]; onEdit: () => void; editLabel: string;
}) {
  return (
    <div className="relative rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-[20px] flex flex-col gap-[10px]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold tracking-[0.5px] uppercase text-navy"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          {title}
        </p>
        <button
          onClick={onEdit}
          className="text-[12px] text-red hover:underline font-medium"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {editLabel}
        </button>
      </div>
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-[8px] text-[13px]" style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="text-[#9CA3AF] flex-shrink-0 w-[160px] hidden sm:block">{label}</span>
          <span className="text-[#374151] font-medium">{value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

function Step4Review({
  form, onEdit, textos,
}: {
  form: FormData; onEdit: (step: number) => void; textos: FormularioTextos;
}) {
  const e = textos.camposEstudiante;
  const r = textos.camposRepresentante;
  const ad = textos.camposAdicional;
  const c = textos.confirmacion;
  return (
    <div className="flex flex-col gap-[12px]">
      <SummaryBlock
        title={c.seccionEstudiante}
        onEdit={() => onEdit(1)}
        editLabel={c.botonEditar}
        rows={[
          [e.nombresLabel, form.est_nombres],
          [e.apellidosLabel, form.est_apellidos],
          [e.fechaNacLabel, form.est_fecha_nac],
          [e.nivelLabel, form.est_nivel],
          ["Año al que ingresa", form.est_grado],
          [e.institucionLabel, form.est_institucion_origen],
        ]}
      />
      <SummaryBlock
        title={c.seccionRepresentante}
        onEdit={() => onEdit(2)}
        editLabel={c.botonEditar}
        rows={[
          [`${r.nombresLabel} y ${r.apellidosLabel.toLowerCase()}`, `${form.rep_nombres} ${form.rep_apellidos}`.trim()],
          [r.relacionLabel, form.rep_relacion],
          [r.correoLabel, form.rep_correo],
          [r.telefonoLabel, form.rep_telefono],
        ]}
      />
      {(form.como_enterado || form.anio_ingreso || form.comentarios) && (
        <SummaryBlock
          title={c.seccionAdicional}
          onEdit={() => onEdit(3)}
          editLabel={c.botonEditar}
          rows={([
            [ad.comoEnteradoLabel, form.como_enterado],
            [ad.anioIngresoLabel, form.anio_ingreso],
            [ad.comentariosLabel, form.comentarios],
          ] as [string, string][]).filter(([, v]) => !!v)}
        />
      )}
      <p className="text-[12px] text-[#6B7280] leading-relaxed text-center mt-2"
        style={{ fontFamily: "Poppins, sans-serif" }}>
        {c.mensajeFinal}
      </p>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen({ numero, textos }: { numero: string; textos: FormularioTextos }) {
  const ex = textos.exito;
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#EEF2F7] py-10 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white rounded-[12px] max-w-[640px] w-full px-[56px] py-[56px]
          flex flex-col items-center gap-[24px] text-center max-sm:px-[24px]"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 18 }}
          className="w-[72px] h-[72px] rounded-full bg-[#16A34A] flex items-center justify-center"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <div className="flex flex-col gap-[10px]">
          <h2 className="text-[26px] font-bold text-navy"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {ex.titulo}
          </h2>
          <p className="text-[14px] text-[#6B7280] leading-relaxed"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {ex.descripcion}
          </p>
        </div>

        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] px-[24px] py-[16px]
          flex flex-col items-center gap-[4px]">
          <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#6B7280]"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {ex.etiquetaSeguimiento}
          </span>
          <span className="text-[22px] font-bold text-navy"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {numero}
          </span>
        </div>

        <div className="h-[1px] bg-[#E5E7EB] w-full" />

        <div className="flex flex-col gap-[10px] text-left w-full">
          <p className="text-[14px] font-semibold text-navy"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {ex.queSigueTitulo}
          </p>
          {ex.queSigueBullets.map((s) => (
            <div key={s} className="flex gap-[10px] items-start">
              <span className="text-[#16A34A] font-bold mt-[1px] flex-shrink-0">✓</span>
              <span className="text-[13px] text-[#374151]"
                style={{ fontFamily: "Poppins, sans-serif" }}>{s}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/admisiones"
            className="h-[44px] px-[24px] rounded-[4px] border border-navy text-navy
              text-[14px] font-semibold hover:bg-navy hover:text-white transition-colors
              duration-150 flex items-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {ex.botonVolver}
          </Link>
          <Link
            href="/"
            className="h-[44px] px-[24px] rounded-[4px] bg-navy text-white text-[14px]
              font-semibold hover:bg-[#22375e] transition-colors duration-150 flex items-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {ex.botonInicio}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Texto de privacidad con link inline ────────────────────────────────────
function PrivacyText({ texto, politicaLabel }: { texto: string; politicaLabel: string }) {
  // Divide el texto por el marcador {{politica}}; si no existe, lo concatena al final.
  const partes = texto.includes("{{politica}}") ? texto.split("{{politica}}") : [texto, ""];
  return (
    <p className="text-center text-[11px] text-[#9CA3AF] mt-6"
      style={{ fontFamily: "Poppins, sans-serif" }}>
      {partes[0]}
      <Link href="/politicas" className="text-navy underline hover:no-underline">
        {politicaLabel}
      </Link>
      {partes.slice(1).join("{{politica}}")}
    </p>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function FormularioMultiStep({
  nivelInicial = "",
  aniosLectivos,
  textos: textosProp,
  contactoAviso,
}: {
  nivelInicial?: string;
  aniosLectivos?: string[];
  textos?: FormularioTextos;
  /**
   * Dirección, teléfono, correo y horario del aviso de trámite presencial.
   * Los compone la página desde Configuración › Marca y › Datos de contacto;
   * si no llegan, el aviso sale sin el bloque de contacto en vez de con datos
   * inventados.
   */
  contactoAviso?: ContactoAviso;
}) {
  // Fallback al default si la página no inyecta textos (p.ej. tests).
  const textos = textosProp ?? ADMISIONES_TEXTOS_DEFAULT.formulario;

  const ANIOS = useMemo(
    () => (aniosLectivos && aniosLectivos.length > 0 ? aniosLectivos : ANIOS_FALLBACK),
    [aniosLectivos]
  );
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(() => makeInitial(nivelInicial));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [numero, setNumero] = useState<string | null>(null);

  const set = (k: keyof FormData) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError(null);
  };

  const next = () => {
    const err = validateStep(step, form);
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => {
    setError(null);
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admisiones/solicitud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error interno");
      setNumero(data.numero);
      setStep(5);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ocurrió un error. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 5 && numero) return <SuccessScreen numero={numero} textos={textos} />;

  const titulos = [
    textos.pasoTitulos.paso1,
    textos.pasoTitulos.paso2,
    textos.pasoTitulos.paso3,
    textos.pasoTitulos.paso4,
  ];
  const subtitulos = [
    textos.pasoSubtitulos.paso1,
    textos.pasoSubtitulos.paso2,
    textos.pasoSubtitulos.paso3,
    textos.pasoSubtitulos.paso4,
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#EEF2F7] py-10 px-4">
      <div className="max-w-[800px] mx-auto">

        {/* Card */}
        <div
          className="bg-white rounded-[12px] overflow-hidden"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
        >
          <div className="px-[56px] py-[48px] max-sm:px-[24px] max-sm:py-[28px] flex flex-col gap-[24px]">

            {/* Step indicator */}
            <StepIndicator current={step} />

            {/* Divider */}
            <div className="h-[1px] bg-[#E5E7EB] -mx-[56px] max-sm:-mx-[24px]" />

            {/* Step content with slide animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-[20px]"
              >
                {/* Step header */}
                <div className="flex flex-col gap-[6px]">
                  <h2 className="text-[22px] font-bold text-navy max-sm:text-[18px]"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    {titulos[step - 1]}
                  </h2>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    {subtitulos[step - 1]}
                  </p>
                </div>

                {/* Fields */}
                {step === 1 && (
                  <Step1Fields
                    form={form}
                    set={set}
                    textos={textos}
                    contactoAviso={contactoAviso}
                  />
                )}
                {step === 2 && <Step2Fields form={form} set={set} textos={textos} />}
                {step === 3 && <Step3Fields form={form} set={set} anios={ANIOS} textos={textos} />}
                {step === 4 && (
                  <Step4Review
                    form={form}
                    onEdit={(s) => { setError(null); setStep(s); }}
                    textos={textos}
                  />
                )}

                {/* Error */}
                {error && (
                  <p
                    className="text-[13px] text-red bg-[#FEF2F2] border border-[#FECACA]
                      rounded-[4px] px-[14px] py-[10px]"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {error}
                  </p>
                )}

                {/* Navigation */}
                <div className={`flex gap-3 pt-2 ${step > 1 ? "justify-between" : "justify-end"}`}>
                  {step > 1 && (
                    <button
                      onClick={back}
                      className="h-[44px] px-[24px] rounded-[4px] border border-navy text-navy
                        text-[14px] font-semibold hover:bg-navy hover:text-white
                        transition-colors duration-150"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {textos.navegacion.anterior}
                    </button>
                  )}
                  {step < 4 && (
                    <button
                      onClick={next}
                      className="h-[44px] px-[28px] rounded-[4px] bg-navy text-white text-[14px]
                        font-semibold hover:bg-[#22375e] transition-colors duration-150"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {textos.navegacion.siguiente}
                    </button>
                  )}
                  {step === 4 && (
                    <button
                      onClick={submit}
                      disabled={submitting}
                      className="h-[44px] px-[28px] rounded-[4px] bg-red text-white text-[14px]
                        font-semibold hover:bg-[#8a1512] transition-colors duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {submitting ? textos.navegacion.enviando : textos.navegacion.enviar}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Privacy note */}
        <PrivacyText
          texto={textos.privacidad.texto}
          politicaLabel={textos.privacidad.politicaLabel}
        />
      </div>
    </div>
  );
}
