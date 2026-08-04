"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import type { AdmisionesFAQItem } from "@/lib/cms/admisionesLanding";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const DEFAULT_FAQ: AdmisionesFAQItem[] = [
  {
    pregunta: "¿Cómo es el proceso de admisión?",
    respuesta:
      "El proceso consta de 4 pasos: solicitud en línea, entrevista familiar, evaluación diagnóstica y confirmación de matrícula.",
  },
];

export type FAQAdmisionesProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items?: AdmisionesFAQItem[];
};

export function FAQAdmisiones({
  eyebrow = "Preguntas frecuentes",
  heading = "Lo que las familias preguntan más",
  description = "",
  items = DEFAULT_FAQ,
}: FAQAdmisionesProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-white" style={{ padding: "80px 0" }}>
      <div ref={ref} className="px-6 md:px-[160px] max-w-[920px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-10 md:mb-12">
          <motion.div
            className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block bg-red flex-shrink-0"
              style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
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
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(24px,2.5vw,36px)",
                fontWeight: 700,
                color: "var(--color-navy)",
                lineHeight: 1.2,
                margin: 0,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              {heading}
            </motion.h2>
          </div>

          {description && (
            <motion.p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                color: "rgba(13,24,37,0.55)",
                lineHeight: 1.7,
                maxWidth: 620,
                margin: 0,
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25, ease }}
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Acordeón */}
        <div className="flex flex-col gap-3">
          {items.map((q, i) => {
            const open = openIdx === i;
            return (
              <motion.div
                key={`${q.pregunta}-${i}`}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.05 * i, ease }}
                className="rounded-[12px] overflow-hidden"
                style={{
                  background: "var(--color-cream)",
                  border: open
                    ? "1.5px solid rgba(158,25,21,0.45)"
                    : "1px solid rgba(26,43,74,0.08)",
                  transition: "border-color 0.2s ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 md:py-5 text-left"
                  style={{
                    background: "transparent",
                    cursor: "pointer",
                    border: "none",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  aria-expanded={open}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 15,
                      fontWeight: open ? 700 : 600,
                      color: open ? "var(--color-navy)" : "var(--color-navy)",
                      lineHeight: 1.4,
                      flex: 1,
                    }}
                  >
                    {q.pregunta}
                  </span>
                  <span
                    aria-hidden
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 32,
                      height: 32,
                      background: open ? "var(--color-red)" : "rgba(158,25,21,0.15)",
                      color: open ? "var(--color-dark)" : "var(--color-red)",
                      transition: "background 0.2s ease, color 0.2s ease, transform 0.25s ease",
                      transform: open ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        className="px-5 md:px-6 pb-5 md:pb-6"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 14,
                          color: "rgba(13,24,37,0.65)",
                          lineHeight: 1.75,
                          paddingTop: 2,
                        }}
                      >
                        {q.respuesta}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
