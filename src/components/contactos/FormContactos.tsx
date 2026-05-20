"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Send } from "lucide-react";
import { CONTACTOS_PAGINA_DEFAULT, type ContactosPaginaConfig } from "@/lib/cms/contactosPagina";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type FormContactosProps = {
  formulario?: ContactosPaginaConfig["formulario"];
  mapa?: ContactosPaginaConfig["mapa"];
};

export function FormContactos({
  formulario = CONTACTOS_PAGINA_DEFAULT.formulario,
  mapa = CONTACTOS_PAGINA_DEFAULT.mapa,
}: FormContactosProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      nombre: String(formData.get("nombre") ?? "").trim(),
      correo: String(formData.get("correo") ?? "").trim(),
      asunto: String(formData.get("asunto") ?? "").trim(),
      mensaje: String(formData.get("mensaje") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contactos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "No pudimos enviar tu mensaje.");
      }
      setSent(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white flex flex-col md:flex-row"
      style={{ minHeight: 720 }}
    >
      {/* ─── Columna mapa — desktop ─── */}
      <div
        className="relative hidden md:block flex-shrink-0 overflow-hidden"
        style={{ width: "48.6%", minHeight: 720 }}
      >
        {/* Badge ubicación — a la derecha para no chocar con la card nativa de Google Maps */}
        <div
          className="absolute right-8 top-8 z-10 flex items-center gap-2 rounded-[8px] px-[14px] py-[8px]"
          style={{
            background: "rgba(13,24,37,0.80)",
            backdropFilter: "blur(8px)",
          }}
        >
          <MapPin size={14} color="var(--color-gold)" />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            {mapa.badgeText}
          </span>
        </div>

        {/* Google Maps iframe */}
        <iframe
          src={mapa.embedUrl}
          title="Ubicación Unidad Educativa Atenas"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* ─── Columna formulario ─── */}
      <motion.div
        className="flex-1 flex flex-col justify-center gap-8 px-6 py-12 md:px-16 md:py-16"
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.2, ease }}
      >
        {/* Encabezado */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-[10px]">
            <span
              className="block bg-gold"
              style={{ width: 28, height: 2 }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--color-gold)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {formulario.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 1.94vw, 28px)",
              fontWeight: 700,
              color: "var(--color-navy)",
            }}
          >
            {formulario.heading}
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(26,43,74,0.55)",
              lineHeight: 1.6,
            }}
          >
            {formulario.subtitle}
          </p>
        </div>

        {sent ? (
          <motion.div
            className="flex flex-col items-center gap-4 py-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 56, height: 56, background: "var(--color-gold)" }}
            >
              <Send size={22} color="var(--color-dark)" />
            </div>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "var(--color-navy)",
              }}
            >
              {formulario.successTitle}
            </h3>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                color: "rgba(26,43,74,0.55)",
                maxWidth: 360,
              }}
            >
              {formulario.successText}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <div className="flex flex-col md:flex-row gap-[18px]">
              <Field
                label="Nombre"
                id="nombre"
                placeholder="Tu nombre completo"
                type="text"
                required
              />
              <Field
                label="Correo electrónico"
                id="correo"
                placeholder="correo@ejemplo.com"
                type="email"
                required
              />
            </div>

            <Field
              label="Asunto"
              id="asunto"
              placeholder="¿En qué podemos ayudarte?"
              type="text"
              required
            />

            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="mensaje"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--color-navy)",
                }}
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe tu mensaje aquí..."
                required
                rows={4}
                className="w-full rounded-[8px] px-[14px] py-[10px] text-[13px] resize-none outline-none border focus:border-gold transition-colors"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "var(--color-navy)",
                  borderColor: "#E8E4DD",
                }}
              />
            </div>

            {errorMsg && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "#B23A48",
                }}
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-[10px] self-start rounded-[8px] px-[28px] py-[14px] font-bold text-[14px] bg-navy text-white hover:bg-[#243d6a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {submitting ? "Enviando…" : formulario.submitLabel}
              <Send size={16} />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

function Field({
  label,
  id,
  placeholder,
  type,
  required,
}: {
  label: string;
  id: string;
  placeholder: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px] flex-1">
      <label
        htmlFor={id}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "var(--color-navy)",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[8px] px-[14px] text-[13px] outline-none border focus:border-gold transition-colors"
        style={{
          fontFamily: "Poppins, sans-serif",
          color: "var(--color-navy)",
          borderColor: "#E8E4DD",
          height: 44,
        }}
      />
    </div>
  );
}
