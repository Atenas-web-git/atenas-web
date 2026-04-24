"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const FECHAS = [
  { etapa: "Inscripciones", rango: "3 – 28 feb 2026" },
  { etapa: "Matrículas nuevas", rango: "3 – 14 mar 2026" },
  { etapa: "Reingreso", rango: "17 – 21 mar 2026" },
];

export function FechasBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section style={{ background: "#0D1825", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div
        ref={ref}
        className="relative px-6 py-10 md:px-[160px] md:py-[44px] flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        {/* Acento rojo izquierdo */}
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0"
          style={{ width: 3, background: "#9B1B1B" }}
        />

        {/* Izquierda: título + fechas */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <div className="flex items-center gap-3 mb-1">
              <span
                className="block md:hidden"
                style={{ width: 3, height: 22, background: "#9B1B1B", borderRadius: 2, flexShrink: 0 }}
              />
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#9B1B1B", letterSpacing: 2.5, textTransform: "uppercase" }}>
                Período de Matrículas
              </span>
            </div>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>
              Año lectivo 2026–2027
            </span>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-x-6 gap-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.12, ease }}
          >
            {FECHAS.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9B1B1B", flexShrink: 0 }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                  {f.etapa}:
                </span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                  {f.rango}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Derecha: CTA */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.22, ease }}
        >
          <Link
            href="/matriculas/proceso"
            style={{ textDecoration: "none" }}
          >
            <motion.div
              className="flex items-center gap-3 rounded-[10px] px-6 py-[14px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#FFFFFF",
                background: "#9B1B1B",
                display: "inline-flex",
                whiteSpace: "nowrap",
              }}
              whileHover={{ scale: 1.03, background: "#b32020" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Iniciar proceso
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                →
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
