"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FormularioDinamico } from "@/components/formularios/FormularioDinamico";
import type { FormularioPublico } from "@/lib/formularios/getFormulario";
import { useRef, useState } from "react";
import { useCountUp } from "@/lib/useCountUp";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Nivel = "Educación Inicial" | "EGB Elemental y Media" | "EGB Superior" | "Bachillerato IB";

const NIVELES: Nivel[] = [
  "Educación Inicial", "EGB Elemental y Media", "EGB Superior", "Bachillerato IB",
];

// Layout fijo del collage (posiciones, rotaciones, delays). Solo los src son editables.
const COLLAGE_LAYOUT = [
  { w: 200, h: 260, style: { left: 0,   top: 30 }, rotate:  3, delay: 0.35 },
  { w: 162, h: 200, style: { left: 190, top: 0  }, rotate: -4, delay: 0.55 },
  { w: 140, h: 178, style: { left: 325, top: 65 }, rotate:  2, delay: 0.75 },
];

const DEFAULT_PHOTOS: [string, string, string] = [
  "https://images.unsplash.com/photo-1758270705657-f28eec1a5694?w=600&q=80",
  "https://images.unsplash.com/photo-1602436215510-cbe1c087f46e?w=600&q=80",
  "https://images.unsplash.com/photo-1631599575881-556a8c416881?w=600&q=80",
];

const DEFAULT_STATS: FormularioAdmisionStat[] = [
  { value: "50", suffix: "+", label: "años formando\nlíderes" },
  { value: "IB", suffix: "",  label: "único diploma acreditado\nen el centro del país" },
  { value: "24", suffix: "h", label: "tiempo máximo\nde respuesta" },
];

export type FormularioAdmisionStat = {
  /** Si es numérico se anima con count-up. Si no, se muestra estático. */
  value: string;
  suffix: string;
  /** Acepta \n para línea adicional. */
  label: string;
};

export type FormularioAdmisionProps = {
  /** Nivel de interés que se pre-selecciona en el dropdown. */
  nivelDefault: Nivel | string;
  /**
   * Definición del formulario «consulta-admisiones» del motor. De aquí salen
   * los campos, la validación y el envío; de esta página siguen viniendo el
   * collage, las stats y los textos de alrededor.
   */
  formularioMotor: FormularioPublico | null;
  eyebrow?: string;
  heading?: string;
  description?: string;
  stats?: FormularioAdmisionStat[];
  photos?: [string, string, string];
  badgeFloating?: string;
  formCardHeading?: string;
  formCardSubtitle?: string;
  submitLabel?: string;
  sendingLabel?: string;
  successTitle?: string;
  successText?: string;
  errorText?: string;
  privacyTextPre?: string;
  privacyLinkLabel?: string;
  privacyLinkHref?: string;
  privacyTextPost?: string;
};

/* ─── Stat con countup si es numérico, estático si no ─── */
function StatItem({ value, suffix, label, inView, delay }:
  { value: string; suffix: string; label: string; inView: boolean; delay: number }) {
  const num = Number(value);
  const isNumeric = !Number.isNaN(num) && value.trim() !== "";
  const display = isNumeric ? <NumericStat value={num} inView={inView} /> : value;
  return (
    <motion.div className="flex flex-col gap-1"
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px,2.2vw,36px)",
        fontWeight: 800, color: "var(--color-red)", lineHeight: 1 }}>
        {display}{suffix}
      </span>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
        color: "rgba(26,43,74,0.55)", lineHeight: 1.4, whiteSpace: "pre-line" }}>{label}</span>
    </motion.div>
  );
}

function NumericStat({ value, inView }: { value: number; inView: boolean }) {
  const count = useCountUp(value, 1.4, inView);
  return <>{count}</>;
}

/* ─── Input animado ─── */
function AnimField({ label, type = "text", placeholder, value, onChange, delay, inView }:
  { label: string; type?: string; placeholder: string; value: string;
    onChange: (v: string) => void; delay: number; inView: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div className="flex flex-col gap-[6px]"
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}>
      <label style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600,
        color: "var(--color-navy)", letterSpacing: 0.3 }}>{label}</label>
      <motion.div
        animate={{ borderColor: focused ? "rgba(158,25,21,0.70)" : "rgba(26,43,74,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(158,25,21,0.12)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 8, border: "1px solid rgba(26,43,74,0.12)" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[44px] bg-cream rounded-[8px] px-[14px] outline-none text-navy
            placeholder:text-[rgba(13,24,37,0.35)]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 400 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Textarea animado ─── */
function AnimTextarea({ label, placeholder, value, onChange, delay, inView }:
  { label: string; placeholder: string; value: string;
    onChange: (v: string) => void; delay: number; inView: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div className="flex flex-col gap-[6px]"
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}>
      <label style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600,
        color: "var(--color-navy)", letterSpacing: 0.3 }}>{label}</label>
      <motion.div
        animate={{ borderColor: focused ? "rgba(158,25,21,0.70)" : "rgba(26,43,74,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(158,25,21,0.12)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 8, border: "1px solid rgba(26,43,74,0.12)" }}>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className="w-full bg-cream rounded-[8px] px-[14px] py-3 outline-none resize-none
            text-navy placeholder:text-[rgba(13,24,37,0.35)]"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 400 }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ─── Select animado ─── */
function AnimSelect({ label, value, onChange, delay, inView }:
  { label: string; value: string; onChange: (v: string) => void; delay: number; inView: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div className="flex flex-col gap-[6px]"
      initial={{ opacity: 0, y: 18 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease }}>
      <label style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600,
        color: "var(--color-navy)", letterSpacing: 0.3 }}>{label}</label>
      <motion.div
        animate={{ borderColor: focused ? "rgba(158,25,21,0.70)" : "rgba(26,43,74,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(158,25,21,0.12)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 8, border: "1px solid rgba(26,43,74,0.12)" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[44px] bg-cream rounded-[8px] px-[14px] outline-none appearance-none
            text-navy cursor-pointer"
          style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600 }}>
          {NIVELES.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main export ─── */
export function FormularioAdmision({
  nivelDefault,
  formularioMotor,
  eyebrow = "¿Aún tienes dudas?",
  heading = "Resolvemos tus preguntas antes de que des el siguiente paso",
  description = "No tienes que comprometerte con nada todavía. Si tienes preguntas sobre el proceso de admisión, los requisitos, la propuesta académica o simplemente quieres conocer más sobre el Atenas, escríbenos y te respondemos en menos de 24 horas hábiles, sin presiones.",
  stats = DEFAULT_STATS,
  photos = DEFAULT_PHOTOS,
  badgeFloating = "★ ATENAS · 50 AÑOS",
  formCardHeading = "Escríbenos, con gusto te informamos",
  formCardSubtitle = "Sin compromiso. Te respondemos en menos de 24 h hábiles.",
  submitLabel = "Enviar solicitud de información",
  sendingLabel = "Enviando...",
  successTitle = "¡Solicitud enviada!",
  successText = "Nuestro equipo de admisiones se pondrá en contacto contigo dentro de 24 horas hábiles.",
  errorText = "Ocurrió un error. Por favor intenta de nuevo o escríbenos a admisiones@atenas.edu.ec",
  privacyTextPre = "Al enviar este formulario aceptas nuestra",
  privacyLinkLabel = "Política de Privacidad",
  privacyLinkHref = "/privacidad",
  privacyTextPost = ". Tus datos serán usados únicamente para responder tu consulta.",
}: FormularioAdmisionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  return (
    <section className="relative bg-cream overflow-hidden" style={{ padding: "80px 0" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom left, rgba(158,25,21,0.07) 0%, transparent 60%)" }} />

      <div ref={ref} className="relative z-10 flex flex-col md:flex-row gap-16 px-6
        md:px-[160px] items-start">

        {/* ── Columna izquierda: CTA + collage ── */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Badge */}
          <motion.div className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}>
            <motion.span className="block bg-red flex-shrink-0" style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
              color: "var(--color-red)", letterSpacing: 2, textTransform: "uppercase" }}>
              {eyebrow}
            </span>
          </motion.div>

          {/* Heading */}
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(26px,2.6vw,38px)",
                fontWeight: 700, color: "var(--color-navy)", lineHeight: 1.15 }}
              initial={{ y: 56, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease }}>
              {heading}
            </motion.h2>
          </div>

          <motion.span className="block bg-red" style={{ width: 40, height: 3, borderRadius: 2 }}
            initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.28, ease }} />

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 15,
              color: "rgba(26,43,74,0.75)", lineHeight: 1.75, maxWidth: 480 }}
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.35, ease }}>
            {description}
          </motion.p>

          {/* Stats con countup */}
          <div className="flex gap-8 items-start flex-nowrap">
            {stats.slice(0, 3).map((s, i) => (
              <StatItem
                key={i}
                value={s.value}
                suffix={s.suffix}
                label={s.label}
                inView={inView}
                delay={0.42 + i * 0.08}
              />
            ))}
          </div>

          {/* Collage de fotos */}
          <div className="relative hidden md:block" style={{ height: 320, minWidth: 480 }}>
            {COLLAGE_LAYOUT.map((img, i) => {
              const src = photos[i] || DEFAULT_PHOTOS[i];
              return (
                <motion.div key={i}
                  className="absolute rounded-[14px] overflow-hidden"
                  style={{ width: img.w, height: img.h, boxShadow: "0 16px 40px rgba(0,0,0,0.22)", ...img.style }}
                  initial={{ opacity: 0, y: 30, rotate: img.rotate - 5 }}
                  animate={inView ? { opacity: 1, y: 0, rotate: img.rotate } : {}}
                  transition={{ duration: 0.75, delay: img.delay, ease }}
                  whileHover={{ scale: 1.04, zIndex: 10, transition: { duration: 0.25 } }}>
                  <Image src={src} alt="" fill className="object-cover" sizes="240px" />
                  <div className="absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, rgba(13,24,37,0) 50%, rgba(13,24,37,0.30) 100%)" }} />
                </motion.div>
              );
            })}
            <motion.div
              className="absolute z-20 flex items-center gap-[6px] rounded-[8px] px-[14px] py-[9px]"
              style={{ background: "var(--color-red)", left: 255, top: 222, boxShadow: "0 8px 24px rgba(158,25,21,0.40)" }}
              initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.95, ease }}
              whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
                color:"#FFFFFF", letterSpacing: 0.8 }}>{badgeFloating}</span>
            </motion.div>
          </div>
        </div>

        {/* ── Tarjeta formulario ── */}
        <motion.div
          className="w-full md:w-[480px] flex-shrink-0 rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 24px 64px rgba(13,24,37,0.12)", border: "1px solid rgba(26,43,74,0.08)" }}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease }}>

          <div className="bg-white px-8 pt-8 pb-6 flex flex-col gap-2">
            <motion.h3
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 700, color: "var(--color-navy)" }}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.35, ease }}>
              {formCardHeading}
            </motion.h3>
            <motion.p
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 13,
                color: "rgba(13,24,37,0.50)", lineHeight: 1.5 }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.42, ease }}>
              {formCardSubtitle}
            </motion.p>
          </div>

          <motion.div className="bg-cream" style={{ height: 1 }}
            initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease }} />

          {/*
            Los campos, la validación y el envío vienen del motor de
            formularios, así el equipo de admisiones puede cambiar las
            preguntas desde Contenido › Formularios y ninguna consulta se
            pierde si falla el correo. Se conservan el collage de fotos, las
            stats y el aviso de privacidad de esta página.

            El nivel llega ya elegido según la página: quien entra en
            /admisiones/inicial no tiene por qué volver a decir qué nivel le
            interesa.
          */}
          <div className="bg-white px-8 py-6">
            {formularioMotor ? (
              <>
                <FormularioDinamico
                  formulario={formularioMotor}
                  mostrarEncabezado={false}
                  colorBoton="red"
                  anchoBoton="completo"
                  valoresIniciales={{ nivel: nivelDefault }}
                />
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    color: "rgba(13,24,37,0.55)",
                    textAlign: "center",
                    lineHeight: 1.55,
                    marginTop: 16,
                  }}
                >
                  {privacyTextPre}{" "}
                  <a
                    href={privacyLinkHref}
                    style={{ color: "var(--color-red)", textDecoration: "underline" }}
                  >
                    {privacyLinkLabel}
                  </a>
                  {privacyTextPost}
                </p>
              </>
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
