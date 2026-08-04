"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface FichaItem { label: string; value: string; highlight?: boolean }

interface Props {
  badge: string;
  heading: string;
  paragraphs: string[];
  documents: string[];
  note: string;
  ficha: FichaItem[];
  /** Textos editables de la tarjeta dorada al pie de la sección. */
  ctaTitulo?: string;
  ctaDescripcion?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function SeccionAdmisionDetalle({
  badge,
  heading,
  paragraphs,
  documents,
  note,
  ficha,
  ctaTitulo = "¿Quieres conocer el colegio?",
  ctaDescripcion = "Agenda una visita guiada y conoce nuestras instalaciones de primera mano.",
  ctaLabel = "Agendar visita al colegio",
  ctaHref = "/contactos",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, rgba(158,25,21,0.06) 0%, transparent 60%)" }} />

      <div ref={ref} className="relative z-10 flex flex-col md:flex-row gap-16 px-6 py-16
        md:px-[160px] md:py-[100px] items-start">

        {/* ── Columna texto ── */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Badge */}
          <motion.div className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}>
            <motion.span className="block bg-red flex-shrink-0" style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
              color: "var(--color-red)", letterSpacing: 2, textTransform: "uppercase" }}>{badge}</span>
          </motion.div>

          {/* Heading — clip reveal */}
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(26px,2.78vw,40px)",
                fontWeight: 700, color: "var(--color-navy)", lineHeight: 1.15 }}
              initial={{ y: 56, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease }}>
              {heading}
            </motion.h2>
          </div>

          {/* Divisor dorado */}
          <motion.span className="block bg-red" style={{ width: 40, height: 3, borderRadius: 2 }}
            initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.28, ease }} />

          {/* Párrafos */}
          {paragraphs.map((p, i) => (
            <motion.p key={i}
              style={{ fontFamily: "Poppins, sans-serif", fontSize: i === 0 ? 15 : 14,
                color: i === 0 ? "rgba(26,43,74,0.80)" : "rgba(13,24,37,0.55)",
                lineHeight: 1.75, maxWidth: 580 }}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.32 + i * 0.09, ease }}>{p}</motion.p>
          ))}

          {/* Documentos requeridos */}
          <motion.div className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.48, ease }}>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
              color: "var(--color-red)", letterSpacing: 2, textTransform: "uppercase" }}>
              Documentos requeridos
            </span>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc, i) => (
                <motion.span key={doc}
                  className="rounded-full px-3 py-[5px] text-[11px] font-semibold cursor-default"
                  style={{ fontFamily: "Poppins, sans-serif", background: "rgba(26,43,74,0.08)", color: "var(--color-navy)" }}
                  initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.52 + i * 0.055, type: "spring", stiffness: 300, damping: 18 }}
                  whileHover={{ scale: 1.06, background: "rgba(158,25,21,0.15)", transition: { duration: 0.15 } }}>
                  {doc}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Nota */}
          <motion.div style={{ borderLeft: "2px solid var(--color-red)", paddingLeft: 16, paddingTop: 12, paddingBottom: 12 }}
            initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.65, ease }}>
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13,
              color: "rgba(13,24,37,0.55)", lineHeight: 1.65, maxWidth: 520 }}>{note}</p>
          </motion.div>
        </div>

        {/* ── Columna derecha: ficha + CTA ── */}
        <div className="w-full md:w-[340px] flex flex-col gap-5">

          {/* Ficha del nivel */}
          <motion.div className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 12px 40px rgba(13,24,37,0.10)" }}
            initial={{ opacity: 0, x: 40, y: 20 }} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease }}>

            <div className="flex flex-col gap-[6px] px-6 py-5"
              style={{ background: "var(--color-navy)" }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                Ficha del Programa
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                {badge}
              </span>
            </div>

            <div className="bg-white flex flex-col">
              {ficha.map((row, i) => (
                <motion.div key={row.label}
                  className="flex items-center justify-between px-6 py-[14px]"
                  style={{ borderBottom: i < ficha.length - 1 ? "1px solid rgba(26,43,74,0.06)" : "none" }}
                  initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07, ease }}>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500,
                    color: "rgba(13,24,37,0.50)" }}>{row.label}</span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 700,
                    color: row.highlight ? "var(--color-red)" : "var(--color-navy)" }}>{row.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA agendar */}
          <motion.div className="flex flex-col gap-4 rounded-2xl p-6"
            style={{ background: "rgba(158,25,21,0.10)", border: "1.5px solid rgba(158,25,21,0.35)" }}
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.7, ease }}>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "var(--color-navy)" }}>
              {ctaTitulo}
            </span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13,
              color: "rgba(13,24,37,0.55)", lineHeight: 1.6 }}>
              {ctaDescripcion}
            </span>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}>
              <Link href={ctaHref}
                className="flex items-center justify-center gap-2 rounded-[8px] px-5 py-3 font-bold text-[13px] w-full"
                style={{ fontFamily: "Poppins, sans-serif", background: "var(--color-red)", color: "#FFFFFF", textDecoration: "none" }}>
                {ctaLabel}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
