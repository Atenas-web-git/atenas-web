"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface FichaItem { label: string; value: string; highlight?: boolean }

interface Props {
  badge: string;
  heading: string;
  paragraphs: string[];
  tags: string[];
  nota: string;
  ficha: FichaItem[];
  photoSrc: string;
  photoAlt: string;
}

export function SeccionEspacioDetalle({
  badge, heading, paragraphs, tags, nota, ficha, photoSrc, photoAlt,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="relative bg-[#F8F5F0] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.06) 0%, transparent 60%)" }}
      />

      <div
        ref={ref}
        className="relative z-10 flex flex-col md:flex-row gap-16 px-6 py-16 md:px-[160px] md:py-[100px] items-start"
      >
        {/* ── Columna izquierda ── */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Badge */}
          <motion.div
            className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block bg-[#C9A84C] flex-shrink-0"
              style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
            />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
              {badge}
            </span>
          </motion.div>

          {/* Heading clip-reveal */}
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(26px,2.78vw,40px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.15 }}
              initial={{ y: 56, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              {heading}
            </motion.h2>
          </div>

          {/* Divisor dorado */}
          <motion.span
            className="block bg-[#C9A84C]"
            style={{ width: 40, height: 3, borderRadius: 2 }}
            initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.28, ease }}
          />

          {/* Párrafos */}
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              style={{ fontFamily: "Poppins, sans-serif", fontSize: i === 0 ? 15 : 14, color: i === 0 ? "rgba(26,43,74,0.80)" : "rgba(13,24,37,0.55)", lineHeight: 1.75, maxWidth: 580 }}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.32 + i * 0.09, ease }}
            >
              {p}
            </motion.p>
          ))}

          {/* Tags */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.44, ease }}
          >
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                className="rounded-full px-3 py-[5px] text-[11px] font-semibold cursor-default"
                style={{ fontFamily: "Poppins, sans-serif", background: "rgba(26,43,74,0.08)", color: "#1A2B4A" }}
                initial={{ opacity: 0, scale: 0.7 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.48 + i * 0.05, type: "spring", stiffness: 300, damping: 18 }}
                whileHover={{ scale: 1.06, background: "rgba(201,168,76,0.15)", transition: { duration: 0.15 } }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          {/* Nota */}
          <motion.div
            style={{ borderLeft: "2px solid #C9A84C", paddingLeft: 16, paddingTop: 12, paddingBottom: 12 }}
            initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.62, ease }}
          >
            <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.55)", lineHeight: 1.65, maxWidth: 520 }}>
              {nota}
            </p>
          </motion.div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="w-full md:w-[340px] flex flex-col gap-5">

          {/* Ficha */}
          <motion.div
            className="rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 12px 40px rgba(13,24,37,0.10)" }}
            initial={{ opacity: 0, x: 40, y: 20 }} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease }}
          >
            <div className="flex flex-col gap-[6px] px-6 py-5" style={{ background: "#1A2B4A" }}>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                Ficha del Espacio
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>
                {badge}
              </span>
            </div>
            <div className="bg-white flex flex-col">
              {ficha.map((row, i) => (
                <motion.div
                  key={row.label}
                  className="flex items-center justify-between px-6 py-[14px]"
                  style={{ borderBottom: i < ficha.length - 1 ? "1px solid rgba(26,43,74,0.06)" : "none" }}
                  initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07, ease }}
                >
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 500, color: "rgba(13,24,37,0.50)" }}>
                    {row.label}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 700, color: row.highlight ? "#C9A84C" : "#1A2B4A" }}>
                    {row.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Foto */}
          <motion.div
            className="relative w-full rounded-[14px] overflow-hidden"
            style={{ height: 180 }}
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.55, ease }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            <Image src={photoSrc} alt={photoAlt} fill className="object-cover" sizes="340px" />
          </motion.div>

          {/* CTA */}
          <motion.div
            className="flex flex-col gap-4 rounded-2xl p-6"
            style={{ background: "rgba(201,168,76,0.10)", border: "1.5px solid rgba(201,168,76,0.35)" }}
            initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.7, ease }}
          >
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#1A2B4A" }}>
              ¿Quieres conocerlo de cerca?
            </span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.55)", lineHeight: 1.6 }}>
              Agenda una visita guiada y descubre cómo vivimos estos espacios en la Unidad Educativa Atenas.
            </span>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
              <Link
                href="/contactos"
                className="flex items-center justify-center gap-2 rounded-[8px] px-5 py-3 font-bold text-[13px] w-full"
                style={{ fontFamily: "Poppins, sans-serif", background: "#C9A84C", color: "#0D1825", textDecoration: "none" }}
              >
                Agendar visita al colegio
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
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
