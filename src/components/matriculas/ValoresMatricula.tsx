"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const NIVELES = [
  { nivel: "Inicial", grados: "1ro y 2do Inicial", matricula: "$750", pension: "$420" },
  { nivel: "EGB Elemental", grados: "1ro – 4to EGB", matricula: "$800", pension: "$450" },
  { nivel: "EGB Media", grados: "5to – 7mo EGB", matricula: "$850", pension: "$480" },
  { nivel: "EGB Superior", grados: "8vo – 10mo EGB", matricula: "$900", pension: "$510" },
  { nivel: "BGU", grados: "1ro – 3ro BGU", matricula: "$950", pension: "$545" },
  { nivel: "IB Diploma", grados: "1ro – 2do IB", matricula: "$1.200", pension: "$680" },
];

export function ValoresMatricula() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060E1A" }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: "#9B1B1B" }} />

      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-8">

        {/* Header */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-[10px]">
            <span className="block bg-[#9B1B1B]" style={{ width: 24, height: 2 }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#9B1B1B", letterSpacing: 2.5, textTransform: "uppercase" }}>
              Valores 2026–2027
            </span>
          </div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px,2vw,30px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
            Estructura de costos por nivel
          </h2>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 520 }}>
            Valores referenciales para el año lectivo 2026–2027. Para confirmación oficial, contáctate con secretaría.
          </p>
        </motion.div>

        {/* Tabla */}
        <div className="flex flex-col gap-0 overflow-hidden rounded-[14px]" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

          {/* Header row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              background: "rgba(255,255,255,0.05)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 20px",
            }}
          >
            {["Nivel", "Grados", "Matrícula", "Pensión mensual"].map((h) => (
              <span key={h} style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: 1.5, textTransform: "uppercase" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Data rows */}
          {NIVELES.map((row, i) => (
            <motion.div
              key={row.nivel}
              className="grid"
              style={{
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                padding: "16px 20px",
                borderBottom: i < NIVELES.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
              }}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease }}
            >
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
                {row.nivel}
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                {row.grados}
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600, color: "#C9A84C" }}>
                {row.matricula}
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 600, color: "#C9A84C" }}>
                {row.pension}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Nota */}
        <motion.div
          className="flex items-start gap-3 rounded-[10px] px-5 py-4"
          style={{ background: "rgba(155,27,27,0.10)", border: "1px solid rgba(155,27,27,0.30)" }}
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.6, ease }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: 1.65 }}>
            Los valores indicados son referenciales. La institución puede ajustarlos para el período 2026–2027. Comunícate con secretaría al{" "}
            <span style={{ color: "#C9A84C", fontWeight: 600 }}>032 456 789</span> o visítanos en Izamba, Ambato.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
