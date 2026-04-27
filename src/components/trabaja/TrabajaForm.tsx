"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { CARGOS, AREAS, FORMACION, DISPONIBILIDAD } from "@/data/trabaja";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface FormData {
  nombres: string;
  correo: string;
  identificacion: string;
  fechaNacimiento: string;
  genero: string;
  discapacidad: string;
  cargo: string;
  formacion: string;
  area: string;
  certificadoB2: string;
  disponibilidad: string;
  expectativaSalarial: string;
  enlaceCV: string;
}

const inputStyle: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif",
  fontSize: 13,
  color: "#1A2B4A",
  background: "#F9F8F6",
  border: "1.5px solid rgba(26,43,74,0.14)",
  borderRadius: 8,
  padding: "12px 16px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.18s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "Poppins, sans-serif",
  fontSize: 10,
  fontWeight: 700,
  color: "rgba(26,43,74,0.55)",
  letterSpacing: 1,
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? "" : opt)}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? "#FFFFFF" : "#1A2B4A",
              background: active ? "#1A2B4A" : "transparent",
              border: `1.5px solid ${active ? "#1A2B4A" : "rgba(26,43,74,0.22)"}`,
              borderRadius: 100,
              padding: "7px 16px",
              cursor: "pointer",
              transition: "all 0.18s ease",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export function TrabajaForm() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [form, setForm] = useState<FormData>({
    nombres: "", correo: "", identificacion: "", fechaNacimiento: "",
    genero: "", discapacidad: "",
    cargo: "", formacion: "", area: "", certificadoB2: "",
    disponibilidad: "", expectativaSalarial: "", enlaceCV: "",
  });

  const set =
    (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setPill = (key: keyof FormData) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: (ref.current?.offsetTop ?? 0) - 80, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/trabaja", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-[#F5F1EB] pt-4 pb-24 px-6 md:px-[160px]">
      <div ref={ref}>
        {/* Header de sección */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
        >
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 1.94vw, 28px)",
              fontWeight: 700,
              color: "#1A2B4A",
              margin: "0 0 8px",
            }}
          >
            Completa tu postulación
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              color: "rgba(13,24,37,0.48)",
              margin: 0,
            }}
          >
            Formulario en 2 pasos · Los datos serán enviados al equipo de RRHH de la Unidad
            Educativa Atenas.
          </p>
        </motion.div>

        {/* Tarjeta del formulario */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid rgba(26,43,74,0.08)",
            boxShadow: "0 8px 40px rgba(13,24,37,0.06)",
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease }}
        >
          <div className="px-6 md:px-12 py-10">
            {/* Stepper */}
            <div className="flex items-center gap-3 mb-10">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 flex-shrink-0"
                style={{
                  background: step === 1 ? "#1A2B4A" : "rgba(26,43,74,0.06)",
                  transition: "background 0.3s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: step === 1 ? "#FFFFFF" : "rgba(26,43,74,0.38)",
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12,
                    fontWeight: step === 1 ? 700 : 500,
                    color: step === 1 ? "#FFFFFF" : "rgba(26,43,74,0.38)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Datos Personales
                </span>
              </div>

              <div
                className="flex-1"
                style={{ height: 1.5, background: "rgba(26,43,74,0.18)" }}
              />

              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 flex-shrink-0"
                style={{
                  background: step === 2 ? "#1A2B4A" : "rgba(26,43,74,0.06)",
                  transition: "background 0.3s ease",
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: step === 2 ? "#FFFFFF" : "rgba(26,43,74,0.38)",
                  }}
                >
                  2
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12,
                    fontWeight: step === 2 ? 700 : 500,
                    color: step === 2 ? "#FFFFFF" : "rgba(26,43,74,0.38)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Perfil Profesional
                </span>
              </div>
            </div>

            {/* Estado de éxito */}
            {status === "ok" ? (
              <motion.div
                className="flex flex-col items-center gap-5 py-16 text-center"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 64, height: 64, background: "rgba(201,168,76,0.12)" }}
                >
                  <span style={{ fontSize: 28 }}>✓</span>
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1A2B4A",
                    margin: 0,
                  }}
                >
                  ¡Postulación enviada!
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 14,
                    color: "rgba(13,24,37,0.55)",
                    maxWidth: 440,
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  Hemos recibido tu información. El equipo de RRHH la revisará y se pondrá en
                  contacto contigo si tu perfil coincide con las necesidades de la institución.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {/* Paso 1 — Datos Personales */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    onSubmit={handleStep1}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Apellidos y Nombres *">
                        <input
                          name="nombres"
                          value={form.nombres}
                          onChange={set("nombres")}
                          required
                          placeholder="Ej. García Pérez, Juan"
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        />
                      </Field>
                      <Field label="Correo Electrónico *">
                        <input
                          name="correo"
                          type="email"
                          value={form.correo}
                          onChange={set("correo")}
                          required
                          placeholder="correo@ejemplo.com"
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Número de Identificación *">
                        <input
                          name="identificacion"
                          value={form.identificacion}
                          onChange={set("identificacion")}
                          required
                          placeholder="Cédula o pasaporte"
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        />
                      </Field>
                      <Field label="Fecha de Nacimiento *">
                        <input
                          name="fechaNacimiento"
                          type="date"
                          value={form.fechaNacimiento}
                          onChange={set("fechaNacimiento")}
                          required
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Género">
                        <PillGroup
                          options={["Masculino", "Femenino", "Prefiero no decir"]}
                          value={form.genero}
                          onChange={setPill("genero")}
                        />
                      </Field>
                      <Field label="Discapacidad">
                        <PillGroup
                          options={["Sí", "No"]}
                          value={form.discapacidad}
                          onChange={setPill("discapacidad")}
                        />
                      </Field>
                    </div>

                    <div className="flex justify-end pt-2">
                      <motion.button
                        type="submit"
                        className="flex items-center gap-2 rounded-lg px-8 py-[13px] font-bold text-[14px]"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          background: "#1A2B4A",
                          color: "#FFFFFF",
                          border: "none",
                          cursor: "pointer",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Siguiente
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          →
                        </motion.span>
                      </motion.button>
                    </div>
                  </motion.form>
                )}

                {/* Paso 2 — Perfil Profesional */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 24 }}
                    transition={{ duration: 0.3, ease }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Cargo de Interés *">
                        <select
                          name="cargo"
                          value={form.cargo}
                          onChange={set("cargo")}
                          required
                          style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        >
                          <option value="">Selecciona un cargo</option>
                          {CARGOS.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Nivel de Formación *">
                        <select
                          name="formacion"
                          value={form.formacion}
                          onChange={set("formacion")}
                          required
                          style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        >
                          <option value="">Selecciona tu nivel</option>
                          {FORMACION.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Área *">
                        <select
                          name="area"
                          value={form.area}
                          onChange={set("area")}
                          required
                          style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        >
                          <option value="">Selecciona un área</option>
                          {AREAS.map((a) => (
                            <option key={a}>{a}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Disponibilidad">
                        <select
                          name="disponibilidad"
                          value={form.disponibilidad}
                          onChange={set("disponibilidad")}
                          style={{ ...inputStyle, cursor: "pointer" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        >
                          <option value="">Selecciona disponibilidad</option>
                          {DISPONIBILIDAD.map((d) => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Field label="Certificado de Inglés B2">
                        <PillGroup
                          options={["Sí", "No"]}
                          value={form.certificadoB2}
                          onChange={setPill("certificadoB2")}
                        />
                      </Field>
                      <Field label="Expectativa Salarial (USD / mes)">
                        <input
                          name="expectativaSalarial"
                          type="number"
                          min="0"
                          value={form.expectativaSalarial}
                          onChange={set("expectativaSalarial")}
                          placeholder="Ej. 800"
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                        />
                      </Field>
                    </div>

                    <Field label="Enlace a CV / Portafolio (opcional)">
                      <input
                        name="enlaceCV"
                        type="url"
                        value={form.enlaceCV}
                        onChange={set("enlaceCV")}
                        placeholder="https://drive.google.com/..."
                        style={inputStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#C9A84C")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")}
                      />
                    </Field>

                    {status === "error" && (
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 12,
                          color: "#9e1915",
                          margin: 0,
                        }}
                      >
                        Ocurrió un error al enviar. Por favor intenta nuevamente.
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <motion.button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-2 rounded-lg px-6 py-[13px] text-[13px] font-semibold"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          background: "transparent",
                          color: "#1A2B4A",
                          border: "1.5px solid rgba(26,43,74,0.20)",
                          cursor: "pointer",
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        ← Anterior
                      </motion.button>

                      <motion.button
                        type="submit"
                        disabled={status === "sending"}
                        className="flex items-center gap-2 rounded-lg px-8 py-[13px] font-bold text-[14px]"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          background: status === "sending" ? "rgba(26,43,74,0.45)" : "#1A2B4A",
                          color: "#FFFFFF",
                          border: "none",
                          cursor: status === "sending" ? "not-allowed" : "pointer",
                          transition: "background 0.18s ease",
                        }}
                        whileHover={status !== "sending" ? { scale: 1.02 } : {}}
                        whileTap={status !== "sending" ? { scale: 0.98 } : {}}
                      >
                        {status === "sending" ? "Enviando…" : "Enviar postulación"}
                        {status !== "sending" && (
                          <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            →
                          </motion.span>
                        )}
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
