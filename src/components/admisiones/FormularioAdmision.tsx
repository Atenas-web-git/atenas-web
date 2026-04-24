"use client";

import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { useCountUp } from "@/lib/useCountUp";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Nivel = "Educación Inicial" | "EGB Elemental y Media" | "EGB Superior" | "Bachillerato IB";

const NIVELES: Nivel[] = [
  "Educación Inicial", "EGB Elemental y Media", "EGB Superior", "Bachillerato IB",
];

const collageLayout = [
  { w: 220, h: 280, style: { left: 0, bottom: 0, rotate: 3 }, delay: 0.35 },
  { w: 170, h: 210, style: { right: 0, top: 0, rotate: -4 }, delay: 0.55 },
  { w: 148, h: 170, style: { left: 30, top: 10, rotate: 2 }, delay: 0.75 },
];

const photos = [
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80",
  "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600&q=80",
  "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=600&q=80",
];

/* ─── Counter animado ─── */
function StatCounter({ value, suffix, label, inView, delay }:
  { value: number; suffix: string; label: string; inView: boolean; delay: number }) {
  const count = useCountUp(value, 1.4, inView);
  return (
    <motion.div className="flex flex-col gap-1"
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease }}>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px,2.2vw,36px)",
        fontWeight: 800, color: "#C9A84C", lineHeight: 1 }}>
        {count}{suffix}
      </span>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
        color: "rgba(26,43,74,0.55)", lineHeight: 1.4 }}>{label}</span>
    </motion.div>
  );
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
        color: "#1A2B4A", letterSpacing: 0.3 }}>{label}</label>
      <motion.div
        animate={{ borderColor: focused ? "rgba(201,168,76,0.70)" : "rgba(26,43,74,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.12)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 8, border: "1px solid rgba(26,43,74,0.12)" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[44px] bg-[#F8F5F0] rounded-[8px] px-[14px] outline-none text-[#1A2B4A]
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
        color: "#1A2B4A", letterSpacing: 0.3 }}>{label}</label>
      <motion.div
        animate={{ borderColor: focused ? "rgba(201,168,76,0.70)" : "rgba(26,43,74,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.12)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 8, border: "1px solid rgba(26,43,74,0.12)" }}>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className="w-full bg-[#F8F5F0] rounded-[8px] px-[14px] py-3 outline-none resize-none
            text-[#1A2B4A] placeholder:text-[rgba(13,24,37,0.35)]"
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
        color: "#1A2B4A", letterSpacing: 0.3 }}>{label}</label>
      <motion.div
        animate={{ borderColor: focused ? "rgba(201,168,76,0.70)" : "rgba(26,43,74,0.12)",
          boxShadow: focused ? "0 0 0 3px rgba(201,168,76,0.12)" : "0 0 0 0px transparent" }}
        transition={{ duration: 0.2 }}
        style={{ borderRadius: 8, border: "1px solid rgba(26,43,74,0.12)" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-[44px] bg-[#F8F5F0] rounded-[8px] px-[14px] outline-none appearance-none
            text-[#1A2B4A] cursor-pointer"
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
export function FormularioAdmision({ nivelDefault }: { nivelDefault: Nivel }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  const [form, setForm] = useState({
    representante: "", estudiante: "", correo: "", telefono: "",
    nivel: nivelDefault, mensaje: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/admisiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative bg-[#F8F5F0] overflow-hidden" style={{ padding: "80px 0" }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at bottom left, rgba(201,168,76,0.07) 0%, transparent 60%)" }} />

      <div ref={ref} className="relative z-10 flex flex-col md:flex-row gap-16 px-6
        md:px-[160px] items-start">

        {/* ── Columna izquierda: CTA + collage ── */}
        <div className="flex-1 flex flex-col gap-8">

          {/* Badge */}
          <motion.div className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}>
            <motion.span className="block bg-[#C9A84C] flex-shrink-0" style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
              color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
              Solicita información
            </span>
          </motion.div>

          {/* Heading */}
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(26px,2.6vw,38px)",
                fontWeight: 700, color: "#1A2B4A", lineHeight: 1.15 }}
              initial={{ y: 56, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease }}>
              Da el primer paso hacia el futuro de tu hijo
            </motion.h2>
          </div>

          <motion.span className="block bg-[#C9A84C]" style={{ width: 40, height: 3, borderRadius: 2 }}
            initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.28, ease }} />

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 15,
              color: "rgba(26,43,74,0.75)", lineHeight: 1.75, maxWidth: 480 }}
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.35, ease }}>
            Nuestro equipo de admisiones se pondrá en contacto contigo dentro de 24 horas hábiles
            para explicarte el proceso, resolver tus dudas y coordinar una visita al colegio.
          </motion.p>

          {/* Stats con countup */}
          <div className="flex gap-10 flex-wrap">
            <StatCounter value={50} suffix="+" label={"años formando\nlíderes"} inView={inView} delay={0.42} />
            <div className="flex flex-col gap-1">
              <motion.span
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(28px,2.2vw,36px)",
                  fontWeight: 800, color: "#C9A84C", lineHeight: 1 }}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.50, ease }}>
                IB
              </motion.span>
              <motion.span
                style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
                  color: "rgba(26,43,74,0.55)", lineHeight: 1.4 }}
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.55, ease }}>
                único diploma acreditado{"\n"}en el centro del país
              </motion.span>
            </div>
            <StatCounter value={24} suffix="h" label={"tiempo máximo\nde respuesta"} inView={inView} delay={0.58} />
          </div>

          {/* Collage de fotos */}
          <div className="relative hidden md:block" style={{ height: 320 }}>
            {collageLayout.map((img, i) => (
              <motion.div key={i}
                className="absolute rounded-[14px] overflow-hidden"
                style={{ width: img.w, height: img.h, boxShadow: "0 20px 56px rgba(0,0,0,0.20)", ...img.style }}
                initial={{ opacity: 0, y: 30, rotate: (img.style.rotate as number) - 5 }}
                animate={inView ? { opacity: 1, y: 0, rotate: img.style.rotate as number } : {}}
                transition={{ duration: 0.75, delay: img.delay, ease }}
                whileHover={{ scale: 1.04, zIndex: 10, transition: { duration: 0.25 } }}>
                <Image src={photos[i]} alt="" fill className="object-cover" sizes="240px" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(13,24,37,0) 50%, rgba(13,24,37,0.30) 100%)" }} />
              </motion.div>
            ))}
            <motion.div
              className="absolute z-20 flex items-center gap-[6px] rounded-[8px] px-[14px] py-[9px]"
              style={{ background: "#C9A84C", right: 16, bottom: 16, boxShadow: "0 8px 24px rgba(201,168,76,0.40)" }}
              initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.95, ease }}
              whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
                color: "#0D1825", letterSpacing: 0.8 }}>ATENAS · 50 AÑOS ★</span>
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
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 20, fontWeight: 700, color: "#1A2B4A" }}
              initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.35, ease }}>
              Solicitar información
            </motion.h3>
            <motion.p
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 13,
                color: "rgba(13,24,37,0.50)", lineHeight: 1.5 }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.42, ease }}>
              Completa el formulario y te contactamos en menos de 24 horas.
            </motion.p>
          </div>

          <motion.div className="bg-[#F8F5F0]" style={{ height: 1 }}
            initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease }} />

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div key="success"
                className="bg-white px-8 py-12 flex flex-col items-center gap-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 250, damping: 20 }}>
                <motion.div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 64, height: 64, background: "rgba(201,168,76,0.15)" }}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}>
                  <span style={{ fontSize: 28 }}>✓</span>
                </motion.div>
                <h4 style={{ fontFamily: "Poppins, sans-serif", fontSize: 18, fontWeight: 700, color: "#1A2B4A" }}>
                  ¡Solicitud enviada!
                </h4>
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14,
                  color: "rgba(13,24,37,0.55)", lineHeight: 1.65, maxWidth: 320 }}>
                  Nuestro equipo de admisiones se pondrá en contacto contigo dentro de 24 horas hábiles.
                </p>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} className="bg-white px-8 py-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimField label="Nombre del representante" placeholder="Tu nombre completo"
                    value={form.representante} onChange={set("representante")} delay={0.5} inView={inView} />
                  <AnimField label="Nombre del estudiante" placeholder="Nombre del hijo/a"
                    value={form.estudiante} onChange={set("estudiante")} delay={0.56} inView={inView} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimField label="Correo electrónico" type="email" placeholder="correo@ejemplo.com"
                    value={form.correo} onChange={set("correo")} delay={0.62} inView={inView} />
                  <AnimField label="WhatsApp / Teléfono" type="tel" placeholder="+593 99 000 0000"
                    value={form.telefono} onChange={set("telefono")} delay={0.68} inView={inView} />
                </div>
                <AnimSelect label="Nivel de interés"
                  value={form.nivel} onChange={set("nivel")} delay={0.74} inView={inView} />
                <AnimTextarea label="Mensaje (opcional)"
                  placeholder="¿Tienes alguna duda o comentario para nuestro equipo?"
                  value={form.mensaje} onChange={set("mensaje")} delay={0.80} inView={inView} />

                {status === "error" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: 12,
                      color: "#e53e3e", textAlign: "center" }}>
                    Ocurrió un error. Por favor intenta de nuevo o escríbenos a admisiones@atenas.edu.ec
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center justify-center gap-2 w-full h-[52px] rounded-[10px] font-bold
                    disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, background: "#1A2B4A", color: "#FFFFFF" }}
                  initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.88, ease }}
                  whileHover={{ scale: 1.02, background: "#22375e", boxShadow: "0 8px 24px rgba(26,43,74,0.25)",
                    transition: { duration: 0.15 } }}
                  whileTap={{ scale: 0.98 }}>
                  {status === "sending" ? (
                    <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                      Enviando...
                    </motion.span>
                  ) : (
                    <>
                      Enviar solicitud de información
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                        style={{ color: "#C9A84C" }}>
                        →
                      </motion.span>
                    </>
                  )}
                </motion.button>

                <motion.p
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: 11,
                    color: "rgba(13,24,37,0.38)", textAlign: "center", lineHeight: 1.55 }}
                  initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.92, ease }}>
                  Al enviar este formulario aceptas nuestra{" "}
                  <a href="/privacidad" style={{ color: "#C9A84C", textDecoration: "underline" }}>
                    Política de Privacidad
                  </a>
                  . Tus datos serán usados únicamente para responder tu consulta.
                </motion.p>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
