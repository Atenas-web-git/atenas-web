"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const NIVELES = [
  {
    slug: "inicial",
    icon: "🌱",
    nombre: "Inicial",
    grados: "1ro y 2do Inicial",
    items: 12,
    desc: "Lista básica para los primeros años de escolaridad.",
  },
  {
    slug: "elemental",
    icon: "📚",
    nombre: "EGB Elemental",
    grados: "1ro – 4to EGB",
    items: 18,
    desc: "Útiles escolares y materiales de trabajo para la etapa elemental.",
  },
  {
    slug: "media",
    icon: "✏️",
    nombre: "EGB Media",
    grados: "5to – 7mo EGB",
    items: 20,
    desc: "Lista completa de materiales para la etapa media.",
  },
  {
    slug: "superior",
    icon: "🔬",
    nombre: "EGB Superior",
    grados: "8vo – 10mo EGB",
    items: 22,
    desc: "Materiales específicos para ciencias, matemáticas y humanidades.",
  },
  {
    slug: "bgu",
    icon: "🎓",
    nombre: "BGU",
    grados: "1ro – 3ro BGU",
    items: 20,
    desc: "Lista para el Bachillerato General Unificado.",
  },
  {
    slug: "ib",
    icon: "★",
    nombre: "IB Diploma",
    grados: "1ro – 2do IB",
    items: 18,
    desc: "Materiales para el programa de Diploma del Bachillerato Internacional.",
  },
];

export function ListasGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

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
          <div className="flex items-center gap-[10px]">
            <span className="block bg-[#C9A84C]" style={{ width: 24, height: 2 }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>
              Listas de Útiles 2026–2027
            </span>
          </div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px,2vw,30px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
            Selecciona el nivel educativo
          </h2>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 480 }}>
            Descarga o consulta la lista de útiles correspondiente al nivel de tu hijo para el año lectivo 2026–2027.
          </p>
        </motion.div>

        {/* Grid 6 cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {NIVELES.map((nivel, i) => (
            <motion.div
              key={nivel.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
            >
              <Link
                href={`/matriculas/listas/${nivel.slug}`}
                className="flex flex-col gap-3 rounded-[14px] p-5 group"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  textDecoration: "none",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 28 }}>{nivel.icon}</span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", background: "rgba(255,255,255,0.07)", borderRadius: 20, padding: "3px 10px" }}>
                    {nivel.items} ítems
                  </span>
                </div>
                <div className="flex flex-col gap-[3px]">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
                    {nivel.nombre}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "#C9A84C" }}>
                    {nivel.grados}
                  </span>
                </div>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.40)", lineHeight: 1.55 }}>
                  {nivel.desc}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600, color: "#C9A84C" }}>
                    Ver lista
                  </span>
                  <span style={{ color: "#C9A84C", fontSize: 12, fontWeight: 700 }}>→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
