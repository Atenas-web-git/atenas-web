"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface Props {
  icon: string;
  nombre: string;
  grados: string;
  items: string[];
  nota?: string;
}

export function ListaDetalle({ icon, nombre, grados, items, nota }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  const mitad = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mitad);
  const col2 = items.slice(mitad);

  return (
    <section className="relative overflow-hidden" style={{ background: "#060E1A" }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: "#C9A84C" }} />

      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-8">

        {/* Header */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 32 }}>{icon}</span>
            <div>
              <div className="flex items-center gap-[10px]">
                <span className="block bg-[#C9A84C]" style={{ width: 20, height: 2 }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>
                  Lista de Útiles · {grados}
                </span>
              </div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px,2vw,30px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
                {nombre}
              </h2>
            </div>
          </div>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
            Lista de materiales requeridos para el año lectivo 2026–2027. Consulta con tu tutor si tienes dudas.
          </p>
        </motion.div>

        {/* Items: 2 columnas desktop, 1 columna mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
          {[col1, col2].map((col, ci) => (
            <div key={ci} className="flex flex-col">
              {col.map((item, i) => {
                const globalIndex = ci === 0 ? i : mitad + i;
                return (
                  <motion.div
                    key={item}
                    className="flex items-center gap-4 py-[14px]"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.05 + globalIndex * 0.04, ease }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#C9A84C",
                        minWidth: 28,
                        flexShrink: 0,
                      }}
                    >
                      {String(globalIndex + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.80)", lineHeight: 1.4 }}>
                      {item}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Nota opcional */}
        {nota && (
          <motion.div
            className="flex items-start gap-3 rounded-[10px] px-5 py-4"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.6, ease }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>📌</span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
              {nota}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
