"use client";

import { Fragment, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────
type FormData = {
  est_nombres: string;
  est_apellidos: string;
  est_fecha_nac: string;
  est_nivel: string;
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
    rep_nombres: "", rep_apellidos: "", rep_relacion: "", rep_correo: "", rep_telefono: "",
    como_enterado: "", anio_ingreso: "", comentarios: "",
  };
}

// ── Constants ──────────────────────────────────────────────────────────────
const NIVELES = [
  "Educación Inicial",
  "EGB Elemental y Media",
  "EGB Superior",
  "Bachillerato IB",
];
const RELACIONES = ["Padre", "Madre", "Tutor legal", "Abuelo/a", "Otro"];
const COMO_ENTERADO = [
  "Redes sociales",
  "Recomendación de amigo o familiar",
  "Página web del colegio",
  "Evento o feria educativa",
  "Otro",
];
const ANIOS = ["2025–2026", "2026–2027"];

const STEPS = [
  { label: "Estudiante" },
  { label: "Representante" },
  { label: "Adicional" },
  { label: "Confirmar" },
];

// ── Validation ─────────────────────────────────────────────────────────────
function validateStep(step: number, data: FormData): string | null {
  if (step === 1) {
    if (!data.est_nombres.trim()) return "Ingresa los nombres del estudiante.";
    if (!data.est_apellidos.trim()) return "Ingresa los apellidos del estudiante.";
    if (!data.est_nivel) return "Selecciona el nivel al que aplica.";
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
        {label}{required && <span className="text-[#9e1915] ml-[2px]">*</span>}
      </label>
      <div
        className="rounded-[4px] border bg-white transition-[border-color,box-shadow] duration-150"
        style={{
          borderColor: focused ? "#1A2B4A" : "#C8C4BD",
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
        {label}{required && <span className="text-[#9e1915] ml-[2px]">*</span>}
      </label>
      <div
        className="rounded-[4px] border bg-white transition-[border-color,box-shadow] duration-150 relative"
        style={{
          borderColor: focused ? "#1A2B4A" : "#C8C4BD",
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
          borderColor: focused ? "#1A2B4A" : "#C8C4BD",
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
      {STEPS.map((step, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <Fragment key={n}>
            {i > 0 && (
              <div
                className="flex-1 h-[2px] mt-[19px]"
                style={{ background: n <= current ? "#9e1915" : "#E5E7EB" }}
              />
            )}
            <div className="flex flex-col items-center gap-[8px]">
              <div
                className="w-[40px] h-[40px] rounded-full flex items-center justify-center
                  text-[14px] font-bold flex-shrink-0 transition-all duration-200"
                style={{
                  background: done ? "#9e1915" : active ? "#1A2B4A" : "#FFFFFF",
                  border: done || active ? "none" : "1.5px solid #C8C4BD",
                  color: done || active ? "#FFFFFF" : "#9CA3AF",
                  boxShadow: active ? "0 0 0 4px rgba(26,43,74,0.10)" : "none",
                }}
              >
                {done ? "✓" : n}
              </div>
              <span
                className="text-[11px] font-semibold text-center hidden sm:block whitespace-nowrap"
                style={{ fontFamily: "Poppins, sans-serif", color: done ? "#9e1915" : active ? "#1A2B4A" : "#9CA3AF" }}
              >
                {step.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

// ── Step titles & subtitles ────────────────────────────────────────────────
const STEP_TITLES = [
  "Datos del Estudiante",
  "Datos del Representante",
  "Información Adicional",
  "Confirma tu solicitud",
];
const STEP_SUBTITLES = [
  "Información del estudiante que desea ingresar a la institución.",
  "Información de la persona responsable del estudiante.",
  "Cuéntanos un poco más para personalizar el proceso de admisión.",
  "Revisa los datos antes de enviar. Puedes editarlos si es necesario.",
];

// ── Step field sections ────────────────────────────────────────────────────
function Step1Fields({ form, set }: {
  form: FormData; set: (k: keyof FormData) => (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label="Nombres" placeholder="Ej. María José"
          value={form.est_nombres} onChange={set("est_nombres")} required />
        <Field label="Apellidos" placeholder="Ej. Pérez Romero"
          value={form.est_apellidos} onChange={set("est_apellidos")} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label="Fecha de nacimiento" type="date" placeholder=""
          value={form.est_fecha_nac} onChange={set("est_fecha_nac")} />
        <SelectField label="Nivel al que aplica" options={NIVELES}
          value={form.est_nivel} onChange={set("est_nivel")}
          placeholder="Selecciona el nivel..." required />
      </div>
    </div>
  );
}

function Step2Fields({ form, set }: {
  form: FormData; set: (k: keyof FormData) => (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label="Nombres" placeholder="Ej. Carlos Andrés"
          value={form.rep_nombres} onChange={set("rep_nombres")} required />
        <Field label="Apellidos" placeholder="Ej. Espinoza Torres"
          value={form.rep_apellidos} onChange={set("rep_apellidos")} required />
      </div>
      <SelectField label="Relación con el estudiante" options={RELACIONES}
        value={form.rep_relacion} onChange={set("rep_relacion")}
        placeholder="Padre / Madre / Tutor legal..." required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <Field label="Correo electrónico" type="email" placeholder="correo@ejemplo.com"
          value={form.rep_correo} onChange={set("rep_correo")} required inputMode="email" />
        <Field label="Teléfono / Celular" type="tel" placeholder="+593 9__ ___ ____"
          value={form.rep_telefono} onChange={set("rep_telefono")} required inputMode="tel" />
      </div>
    </div>
  );
}

function Step3Fields({ form, set }: {
  form: FormData; set: (k: keyof FormData) => (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[16px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        <SelectField label="¿Cómo se enteró del colegio?" options={COMO_ENTERADO}
          value={form.como_enterado} onChange={set("como_enterado")}
          placeholder="Selecciona una opción..." />
        <SelectField label="Año lectivo de ingreso" options={ANIOS}
          value={form.anio_ingreso} onChange={set("anio_ingreso")}
          placeholder="Selecciona el año..." />
      </div>
      <TextareaField
        label="Comentarios adicionales (opcional)"
        placeholder="Escribe aquí cualquier información adicional que desees compartir con el equipo de admisiones..."
        value={form.comentarios} onChange={set("comentarios")}
      />
    </div>
  );
}

// ── Confirmation summary ───────────────────────────────────────────────────
function SummaryBlock({ title, rows, onEdit }: {
  title: string; rows: [string, string][]; onEdit: () => void;
}) {
  return (
    <div className="relative rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-[20px] flex flex-col gap-[10px]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold tracking-[0.5px] uppercase text-[#1A2B4A]"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          {title}
        </p>
        <button
          onClick={onEdit}
          className="text-[12px] text-[#9e1915] hover:underline font-medium"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Editar
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

function Step4Review({ form, onEdit }: {
  form: FormData; onEdit: (step: number) => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      <SummaryBlock
        title="Datos del Estudiante"
        onEdit={() => onEdit(1)}
        rows={[
          ["Nombres", form.est_nombres],
          ["Apellidos", form.est_apellidos],
          ["Fecha de nacimiento", form.est_fecha_nac],
          ["Nivel al que aplica", form.est_nivel],
        ]}
      />
      <SummaryBlock
        title="Datos del Representante"
        onEdit={() => onEdit(2)}
        rows={[
          ["Nombres y apellidos", `${form.rep_nombres} ${form.rep_apellidos}`.trim()],
          ["Relación", form.rep_relacion],
          ["Correo", form.rep_correo],
          ["Teléfono", form.rep_telefono],
        ]}
      />
      {(form.como_enterado || form.anio_ingreso || form.comentarios) && (
        <SummaryBlock
          title="Información Adicional"
          onEdit={() => onEdit(3)}
          rows={([
            ["¿Cómo se enteró?", form.como_enterado],
            ["Año de ingreso", form.anio_ingreso],
            ["Comentarios", form.comentarios],
          ] as [string, string][]).filter(([, v]) => !!v)}
        />
      )}
      <p className="text-[12px] text-[#6B7280] leading-relaxed text-center mt-2"
        style={{ fontFamily: "Poppins, sans-serif" }}>
        Al enviar esta solicitud, nuestro equipo de admisiones se pondrá en contacto
        contigo en un plazo de 48 horas hábiles.
      </p>
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────
function SuccessScreen({ numero }: { numero: string }) {
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
          <h2 className="text-[26px] font-bold text-[#1A2B4A]"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            ¡Solicitud enviada exitosamente!
          </h2>
          <p className="text-[14px] text-[#6B7280] leading-relaxed"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            Hemos recibido tu solicitud. Nuestro equipo la revisará y se pondrá
            en contacto contigo muy pronto.
          </p>
        </div>

        <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[8px] px-[24px] py-[16px]
          flex flex-col items-center gap-[4px]">
          <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[#6B7280]"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            N° de seguimiento
          </span>
          <span className="text-[22px] font-bold text-[#1A2B4A]"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            {numero}
          </span>
        </div>

        <div className="h-[1px] bg-[#E5E7EB] w-full" />

        <div className="flex flex-col gap-[10px] text-left w-full">
          <p className="text-[14px] font-semibold text-[#1A2B4A]"
            style={{ fontFamily: "Poppins, sans-serif" }}>
            ¿Qué sigue?
          </p>
          {[
            "Recibirás un correo de confirmación en los próximos minutos.",
            "Revisaremos tu solicitud en 1–2 días hábiles.",
            "Te contactaremos para coordinar una visita o entrevista.",
          ].map((s) => (
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
            className="h-[44px] px-[24px] rounded-[4px] border border-[#1A2B4A] text-[#1A2B4A]
              text-[14px] font-semibold hover:bg-[#1A2B4A] hover:text-white transition-colors
              duration-150 flex items-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            ← Volver a admisiones
          </Link>
          <Link
            href="/"
            className="h-[44px] px-[24px] rounded-[4px] bg-[#1A2B4A] text-white text-[14px]
              font-semibold hover:bg-[#22375e] transition-colors duration-150 flex items-center"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Ir al inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export function FormularioMultiStep({ nivelInicial = "" }: { nivelInicial?: string }) {
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

  if (step === 5 && numero) return <SuccessScreen numero={numero} />;

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
                  <h2 className="text-[22px] font-bold text-[#1A2B4A] max-sm:text-[18px]"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    {STEP_TITLES[step - 1]}
                  </h2>
                  <p className="text-[14px] text-[#6B7280] leading-relaxed"
                    style={{ fontFamily: "Poppins, sans-serif" }}>
                    {STEP_SUBTITLES[step - 1]}
                  </p>
                </div>

                {/* Fields */}
                {step === 1 && <Step1Fields form={form} set={set} />}
                {step === 2 && <Step2Fields form={form} set={set} />}
                {step === 3 && <Step3Fields form={form} set={set} />}
                {step === 4 && <Step4Review form={form} onEdit={(s) => { setError(null); setStep(s); }} />}

                {/* Error */}
                {error && (
                  <p
                    className="text-[13px] text-[#9e1915] bg-[#FEF2F2] border border-[#FECACA]
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
                      className="h-[44px] px-[24px] rounded-[4px] border border-[#1A2B4A] text-[#1A2B4A]
                        text-[14px] font-semibold hover:bg-[#1A2B4A] hover:text-white
                        transition-colors duration-150"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      ← Anterior
                    </button>
                  )}
                  {step < 4 && (
                    <button
                      onClick={next}
                      className="h-[44px] px-[28px] rounded-[4px] bg-[#1A2B4A] text-white text-[14px]
                        font-semibold hover:bg-[#22375e] transition-colors duration-150"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Siguiente →
                    </button>
                  )}
                  {step === 4 && (
                    <button
                      onClick={submit}
                      disabled={submitting}
                      className="h-[44px] px-[28px] rounded-[4px] bg-[#9e1915] text-white text-[14px]
                        font-semibold hover:bg-[#8a1512] transition-colors duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {submitting ? "Enviando..." : "Enviar solicitud"}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Privacy note */}
        <p className="text-center text-[11px] text-[#9CA3AF] mt-6"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          Al enviar aceptas nuestra{" "}
          <Link href="/politicas" className="text-[#1A2B4A] underline hover:no-underline">
            Política de Privacidad
          </Link>
          . Tus datos son usados únicamente para el proceso de admisión.
        </p>
      </div>
    </div>
  );
}
