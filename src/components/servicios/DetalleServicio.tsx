"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { getServicio } from "@/data/servicios";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface Props {
  slug: string;
}

function FormQuejas({ accent }: { accent: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [form, setForm] = useState({ nombre: "", correo: "", tipo: "Queja", descripcion: "" });
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quejas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "Poppins, sans-serif",
    fontSize: 13,
    color: "#1A2B4A",
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
          <div className="px-8 py-6" style={{ background: "#9e1915" }}>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Envía tu comunicación
            </h3>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.70)",
                margin: "6px 0 0",
              }}
            >
              Responderemos en un máximo de 5 días hábiles.
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
                    color: "#1A2B4A",
                  }}
                >
                  ¡Mensaje recibido!
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
                  Hemos recibido tu comunicación. Te responderemos al correo indicado en un plazo
                  máximo de 5 días hábiles.
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
                    <option>Queja</option>
                    <option>Sugerencia</option>
                    <option>Reconocimiento</option>
                    <option>Consulta</option>
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
                      color: "#9e1915",
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
                    background: status === "sending" ? "rgba(158,25,21,0.55)" : "#9e1915",
                    color: "#FFFFFF",
                    border: "none",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    transition: "background 0.18s ease",
                  }}
                  whileHover={status !== "sending" ? { scale: 1.02 } : {}}
                  whileTap={status !== "sending" ? { scale: 0.98 } : {}}
                >
                  {status === "sending" ? "Enviando…" : "Enviar comunicación"}
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

export function DetalleServicio({ slug }: Props) {
  const servicio = getServicio(slug);
  if (!servicio) return null;
  const { nombre, descripcion, stats, pasos, fotos, color } = servicio;
  const isRed = color === "red";
  const accent = isRed ? "#9e1915" : "#C9A84C";
  const accentBg = isRed ? "rgba(158,25,21,0.10)" : "rgba(201,168,76,0.12)";

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
                  <stat.Icono size={20} color={accent} strokeWidth={1.8} />
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
                      color: "#1A2B4A",
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
                    color: "#1A2B4A",
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
                background: isRed ? "rgba(158,25,21,0.06)" : "rgba(201,168,76,0.10)",
                border: `1.5px solid ${isRed ? "rgba(158,25,21,0.25)" : "rgba(201,168,76,0.35)"}`,
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
                  color: "#1A2B4A",
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
                    color: isRed ? "#FFFFFF" : "#0D1825",
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
                      color: isRed ? "#FFFFFF" : "#0D1825",
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

      {/* ── Formulario (solo quejas-sugerencias) ── */}
      {isRed && <FormQuejas accent={accent} />}
    </div>
  );
}
