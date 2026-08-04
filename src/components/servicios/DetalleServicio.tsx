"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import type { IconName } from "lucide-react/dynamic";
import type { ServicioItem } from "@/data/servicios";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type FormQuejasConfig = {
  headerTitle: string;
  headerSubtitle: string;
  tipos: string[];
  submitText: string;
  successTitle: string;
  successText: string;
};

const FORM_QUEJAS_DEFAULT: FormQuejasConfig = {
  headerTitle: "Envía tu comunicación",
  headerSubtitle: "Responderemos en un máximo de 5 días hábiles.",
  tipos: ["Queja", "Sugerencia", "Reconocimiento", "Consulta"],
  submitText: "Enviar comunicación",
  successTitle: "¡Mensaje recibido!",
  successText:
    "Hemos recibido tu comunicación. Te responderemos al correo indicado en un plazo máximo de 5 días hábiles.",
};

/** Config opcional de la card "Revista Atenas" (solo aplica a /servicios/biblioteca). */
export type RevistaConfig = {
  enabled: boolean;
  eyebrow?: string;
  titulo?: string;
  descripcion?: string;
  ctaText?: string;
  ctaUrl?: string;
  coverImage?: string;
  coverAlt?: string;
};

interface Props {
  servicio: ServicioItem;
  /** Solo se usa cuando `servicio.color === "red"`. Si es undefined, defaults. */
  formConfig?: FormQuejasConfig;
  /** Solo se usa cuando slug === "biblioteca". Si es undefined, defaults hardcoded. */
  revistaConfig?: RevistaConfig;
}

function FormQuejas({
  accent,
  config,
  servicioSlug,
}: {
  accent: string;
  config: FormQuejasConfig;
  servicioSlug: string;
}) {
  const tipoInicial = config.tipos[0] ?? "Queja";
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    tipo: tipoInicial,
    descripcion: "",
  });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      // Mandamos el slug al endpoint para que él lea el destinatario y el
      // asunto desde la BD (no del cliente, por seguridad).
      const res = await fetch("/api/quejas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, servicioSlug }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontSize: 13,
    color: "var(--color-navy)",
    background: "#FFFFFF",
    border: "1.5px solid rgba(26,43,74,0.14)",
    borderRadius: 8,
    padding: "11px 14px",
    outline: "none",
    width: "100%",
    transition: "border-color 0.18s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(26,43,74,0.55)",
    letterSpacing: 1,
    textTransform: "uppercase",
    display: "block",
    marginBottom: 6,
  };

  return (
    <section style={{ padding: "0 0 80px" }}>
      <div ref={ref} className="px-6 md:px-[160px]">
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid rgba(158,25,21,0.15)",
            boxShadow: "0 8px 40px rgba(13,24,37,0.07)",
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
        >
          {/* Header */}
          <div className="px-8 py-6" style={{ background: "var(--color-red)" }}>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              {config.headerTitle}
            </h3>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.70)",
                margin: "6px 0 0",
              }}
            >
              {config.headerSubtitle}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            {status === "ok" ? (
              <motion.div
                className="flex flex-col items-center gap-4 py-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 56, height: 56, background: "rgba(158,25,21,0.10)" }}
                >
                  <span style={{ fontSize: 24 }}>✓</span>
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "var(--color-navy)",
                  }}
                >
                  {config.successTitle}
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: "rgba(13,24,37,0.55)",
                    maxWidth: 400,
                    lineHeight: 1.65,
                  }}
                >
                  {config.successText}
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Nombre completo *</label>
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")
                      }
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Correo electrónico *</label>
                    <input
                      name="correo"
                      type="email"
                      value={form.correo}
                      onChange={handleChange}
                      required
                      placeholder="correo@ejemplo.com"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")
                      }
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Tipo de comunicación *</label>
                  <select
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")
                    }
                  >
                    {config.tipos.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Descripción *</label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Describe con detalle tu comunicación…"
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "rgba(26,43,74,0.14)")
                    }
                  />
                </div>

                {status === "error" && (
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 12,
                      color: "var(--color-red)",
                      margin: 0,
                    }}
                  >
                    Ocurrió un error al enviar. Por favor intenta nuevamente.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  className="flex items-center justify-center gap-2 rounded-[8px] px-6 py-[13px] font-bold text-[13px] self-start"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    background: status === "sending" ? "rgba(158,25,21,0.55)" : "var(--color-red)",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    transition: "background 0.18s ease",
                  }}
                  whileHover={status !== "sending" ? { scale: 1.02 } : {}}
                  whileTap={status !== "sending" ? { scale: 0.98 } : {}}
                >
                  {status === "sending" ? "Enviando…" : config.submitText}
                  {status !== "sending" && (
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function DetalleServicio({ servicio, formConfig, revistaConfig }: Props) {
  const { slug, nombre, descripcion, stats, pasos, fotos, color } = servicio;
  const isRed = color === "red";
  const formCfg: FormQuejasConfig = formConfig ?? FORM_QUEJAS_DEFAULT;
  const revistaCfg = revistaConfig;
  const accent = isRed ? "var(--color-red)" : "var(--color-red)";
  const accentBg = isRed ? "rgba(158,25,21,0.10)" : "rgba(158,25,21,0.12)";

  const refStats = useRef<HTMLDivElement>(null);
  const refCollage = useRef<HTMLDivElement>(null);
  const refDesc = useRef<HTMLDivElement>(null);
  const refSteps = useRef<HTMLDivElement>(null);

  const inStats = useInView(refStats, { once: true, amount: 0.2 });
  const inCollage = useInView(refCollage, { once: true, amount: 0.08 });
  const inDesc = useInView(refDesc, { once: true, amount: 0.1 });
  const inSteps = useInView(refSteps, { once: true, amount: 0.1 });

  return (
    <div className="bg-[#F5F1EB]">
      {/* ── Breadcrumb ── */}
      <nav className="px-6 md:px-[160px] py-4 border-b border-[rgba(26,43,74,0.07)]">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              color: "rgba(13,24,37,0.42)",
              textDecoration: "none",
            }}
          >
            Inicio
          </Link>
          <span style={{ color: "rgba(13,24,37,0.28)", fontSize: 11 }}>/</span>
          <Link
            href="/servicios"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              color: "rgba(13,24,37,0.42)",
              textDecoration: "none",
            }}
          >
            Servicios
          </Link>
          <span style={{ color: "rgba(13,24,37,0.28)", fontSize: 11 }}>/</span>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: accent,
            }}
          >
            {nombre}
          </span>
        </div>
      </nav>

      {/* ── Stats ── */}
      <section style={{ padding: "64px 0 56px" }}>
        <div ref={refStats} className="px-6 md:px-[160px]">
          <motion.div
            className="flex items-center gap-[10px] mb-[32px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inStats ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block flex-shrink-0"
              style={{ width: 28, height: 2, background: accent }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inStats ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: accent,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Información del servicio
            </span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex items-center gap-4 rounded-[14px] p-5"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(26,43,74,0.07)",
                  boxShadow: "0 2px 12px rgba(13,24,37,0.04)",
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={inStats ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
              >
                <div
                  className="flex items-center justify-center rounded-[10px] flex-shrink-0"
                  style={{ width: 44, height: 44, background: accentBg }}
                >
                  <DynamicIcon name={stat.iconName as IconName} size={20} color={accent} strokeWidth={1.8} />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "rgba(13,24,37,0.40)",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {stat.label}
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-navy)",
                      lineHeight: 1.3,
                    }}
                  >
                    {stat.valor}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collage de imágenes ── */}
      <section style={{ paddingBottom: 64 }}>
        <div ref={refCollage} className="px-6 md:px-[160px]">
          {/* Desktop: 1 grande izq + 2 apiladas der */}
          <div className="hidden md:flex gap-3" style={{ height: 400 }}>
            <motion.div
              className="relative rounded-[16px] overflow-hidden flex-shrink-0"
              style={{ width: "58%", height: "100%" }}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inCollage ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              <Image
                src={fotos[0]}
                alt={nombre}
                fill
                className="object-cover"
                sizes="(max-width: 1440px) 58vw, 780px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 50%, rgba(13,24,37,0.35) 100%)",
                }}
              />
            </motion.div>
            <div className="flex flex-col gap-3 flex-1">
              {[fotos[1], fotos[2]].map((src, j) => (
                <motion.div
                  key={j}
                  className="relative rounded-[16px] overflow-hidden flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inCollage ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + j * 0.12, ease }}
                >
                  <Image
                    src={src}
                    alt={nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1440px) 21vw, 290px"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: 1 principal + 2 en grid */}
          <div className="md:hidden flex flex-col gap-3">
            <motion.div
              className="relative rounded-[14px] overflow-hidden w-full"
              style={{ height: 220 }}
              initial={{ opacity: 0, y: 16 }}
              animate={inCollage ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              <Image src={fotos[0]} alt={nombre} fill className="object-cover" sizes="100vw" />
            </motion.div>
            <div className="grid grid-cols-2 gap-3">
              {[fotos[1], fotos[2]].map((src, j) => (
                <motion.div
                  key={j}
                  className="relative rounded-[14px] overflow-hidden"
                  style={{ height: 130 }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={inCollage ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.12 + j * 0.08, ease }}
                >
                  <Image
                    src={src}
                    alt={nombre}
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Descripción ── */}
      <section style={{ paddingBottom: 64 }}>
        <div ref={refDesc} className="px-6 md:px-[160px]">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="flex-1">
              <div className="overflow-hidden mb-5">
                <motion.h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "clamp(22px, 2.22vw, 32px)",
                    fontWeight: 700,
                    color: "var(--color-navy)",
                    lineHeight: 1.2,
                  }}
                  initial={{ y: 48, opacity: 0 }}
                  animate={inDesc ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.65, delay: 0.05, ease }}
                >
                  Sobre el servicio
                </motion.h2>
              </div>
              <motion.span
                className="block"
                style={{ width: 40, height: 3, borderRadius: 2, background: accent, marginBottom: 24 }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={inDesc ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2, ease }}
              />
              {descripcion.map((p, i) => (
                <motion.p
                  key={i}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: i === 0 ? 15 : 14,
                    color: i === 0 ? "rgba(26,43,74,0.80)" : "rgba(13,24,37,0.55)",
                    lineHeight: 1.75,
                    marginBottom: i < descripcion.length - 1 ? 16 : 0,
                    maxWidth: 680,
                  }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inDesc ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.1, ease }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            {/* CTA lateral */}
            <motion.div
              className="w-full md:w-[300px] rounded-2xl p-6 flex flex-col gap-4 flex-shrink-0"
              style={{
                background: isRed ? "rgba(158,25,21,0.06)" : "rgba(158,25,21,0.10)",
                border: `1.5px solid ${isRed ? "rgba(158,25,21,0.25)" : "rgba(158,25,21,0.35)"}`,
              }}
              initial={{ opacity: 0, x: 30 }}
              animate={inDesc ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.3, ease }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                }}
              >
                ¿Tienes alguna consulta?
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "rgba(13,24,37,0.55)",
                  lineHeight: 1.6,
                }}
              >
                Nuestro equipo puede orientarte sobre este y todos los servicios disponibles.
              </span>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/contactos"
                  className="flex items-center justify-center gap-2 rounded-[8px] px-5 py-3 font-bold text-[13px] w-full"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    background: accent,
                    // El acento SIEMPRE es rojo desde que se retiró el dorado (2026-08-04), y el
                    // rojo es oscuro: el texto encima va en blanco siempre.
                    color: "#FFFFFF",
                    textDecoration: "none",
                  }}
                >
                  Contactar al colegio
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pasos ── */}
      {!isRed && (
        <section style={{ paddingBottom: 80 }}>
          <div ref={refSteps} className="px-6 md:px-[160px]">
            <motion.div
              className="flex items-center gap-[10px] mb-[32px]"
              initial={{ opacity: 0, y: 14 }}
              animate={inSteps ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, ease }}
            >
              <motion.span
                className="block flex-shrink-0"
                style={{ width: 28, height: 2, background: accent }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={inSteps ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.1, ease }}
              />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: accent,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                ¿Cómo acceder?
              </span>
            </motion.div>

            <div className="flex flex-col gap-4">
              {pasos.map((paso, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-5"
                  initial={{ opacity: 0, x: -16 }}
                  animate={inSteps ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.12 + i * 0.1, ease }}
                >
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 40,
                      height: 40,
                      background: accent,
                      // El acento SIEMPRE es rojo desde que se retiró el dorado (2026-08-04), y el
                    // rojo es oscuro: el texto encima va en blanco siempre.
                    color: "#FFFFFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="flex-1 rounded-[12px] px-5 py-4"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(26,43,74,0.07)",
                      boxShadow: "0 2px 8px rgba(13,24,37,0.04)",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 14,
                        color: "rgba(26,43,74,0.80)",
                        lineHeight: 1.65,
                        margin: 0,
                      }}
                    >
                      {paso}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Revista Atenas (solo biblioteca, configurable) ── */}
      {slug === "biblioteca" && revistaCfg?.enabled !== false && (
        <RevistaAtenasCard cfg={revistaCfg} />
      )}

      {/* ── Formulario (solo quejas-sugerencias) ── */}
      {isRed && <FormQuejas accent={accent} config={formCfg} servicioSlug={slug} />}
    </div>
  );
}

// Defaults usados si el editor no provee config (o no editó esta card).
const REVISTA_DEFAULTS = {
  eyebrow: "RECURSO DESTACADO",
  titulo: "Revista Atenas",
  descripcion:
    "Lee la edición digital de nuestra revista institucional. Crónicas, logros y vida estudiantil contados desde la voz de la comunidad atenista.",
  ctaText: "Leer la revista",
  ctaUrl: "https://atenas.edu.ec",
};

function RevistaAtenasCard({ cfg }: { cfg?: RevistaConfig }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const eyebrow = (cfg?.eyebrow?.trim() || REVISTA_DEFAULTS.eyebrow).toUpperCase();
  const titulo = cfg?.titulo?.trim() || REVISTA_DEFAULTS.titulo;
  const descripcion = cfg?.descripcion?.trim() || REVISTA_DEFAULTS.descripcion;
  const ctaText = cfg?.ctaText?.trim() || REVISTA_DEFAULTS.ctaText;
  const ctaUrl = cfg?.ctaUrl?.trim() || REVISTA_DEFAULTS.ctaUrl;
  const coverImage = cfg?.coverImage?.trim() || "";
  const coverAlt = cfg?.coverAlt?.trim() || titulo;
  const isExternal = ctaUrl.startsWith("http");

  return (
    <section style={{ padding: "0 0 80px" }}>
      <div ref={ref} className="px-6 md:px-[160px]">
        <motion.a
          href={ctaUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="group relative flex flex-col md:flex-row items-stretch overflow-hidden rounded-2xl"
          style={{
            background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-dark) 100%)",
            textDecoration: "none",
            boxShadow: "0 16px 48px rgba(13,24,37,0.18)",
          }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          whileHover={{ y: -4, boxShadow: "0 22px 56px rgba(13,24,37,0.26)" }}
        >
          <div
            aria-hidden
            className="hidden md:block absolute"
            style={{
              top: -120,
              right: -80,
              width: 380,
              height: 380,
              background: "radial-gradient(circle, rgba(158,25,21,0.30) 0%, rgba(158,25,21,0) 65%)",
              pointerEvents: "none",
            }}
          />

          <div className="flex-1 p-8 md:p-12 flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-2">
              <span
                className="block"
                style={{ width: 28, height: 2, background: "var(--color-red)" }}
              />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--color-red)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {eyebrow}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(28px, 3.2vw, 44px)",
                fontWeight: 800,
                color: "#FFFFFF",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              {titulo}
            </h2>

            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 15,
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.7,
                margin: 0,
                maxWidth: 520,
              }}
            >
              {descripcion}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <span
                className="flex items-center justify-center gap-2 rounded-[10px] px-6 py-[14px] font-bold text-[14px]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  background: "var(--color-red)",
                  color:"#FFFFFF",
                  transition: "transform 0.18s ease",
                }}
              >
                {ctaText}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                Se abre en una nueva pestaña ↗
              </span>
            </div>
          </div>

          <div
            className="hidden md:flex items-center justify-center px-12 relative z-10"
            style={{ minWidth: 280 }}
            aria-hidden={coverImage ? undefined : true}
          >
            {coverImage ? (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  width: 200,
                  height: 260,
                  transform: "rotate(-4deg)",
                  boxShadow: "0 18px 44px rgba(0,0,0,0.45)",
                  border: "1.5px solid rgba(158,25,21,0.45)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={coverAlt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{
                  width: 180,
                  height: 220,
                  background: "rgba(255,255,255,0.04)",
                  border: "1.5px solid rgba(158,25,21,0.35)",
                  transform: "rotate(-4deg)",
                }}
              >
                <div className="flex flex-col items-center gap-3">
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 9,
                      fontWeight: 700,
                      color: "var(--color-red)",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    Edición vigente
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 32,
                      fontWeight: 800,
                      color: "#FFFFFF",
                      lineHeight: 1,
                    }}
                  >
                    Atenas
                  </span>
                  <span
                    className="block"
                    style={{ width: 32, height: 2, background: "var(--color-red)" }}
                  />
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 10,
                      color: "rgba(255,255,255,0.55)",
                      letterSpacing: 1,
                    }}
                  >
                    REVISTA INSTITUCIONAL
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.a>
      </div>
    </section>
  );
}
