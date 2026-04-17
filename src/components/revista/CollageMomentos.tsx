"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const imagenes = [
  { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80", alt: "Estudiantes en clase", large: true  },
  { src: "https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=400&q=80",  alt: "Actividad grupal",   large: false },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80", alt: "Clases IB",       large: false },
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80", alt: "Patio colegio",   large: false },
  { src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&q=80", alt: "Laboratorio",     large: false },
];

export function CollageMomentos() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="bg-[#F8F5F0] py-[72px] md:py-[96px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-0">
        {/* Header */}
        <div className="mb-[48px]">
          <motion.p style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }} initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, ease }}>
            Galería
          </motion.p>
          <motion.span className="block bg-[#C9A84C] mt-2" style={{ width: 36, height: 2 }} initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.35, delay: 0.08, ease }} />
          <div className="overflow-hidden mt-2">
            <motion.h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(24px,2.5vw,36px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.2 }} initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.12, ease }}>
              Momentos Atenas
            </motion.h2>
          </div>
        </div>

        {/* Collage asimétrico */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-[14px]" style={{ height: "clamp(320px,28vw,420px)" }}>
          {/* Imagen grande izquierda — 2 filas */}
          <motion.div
            className="relative rounded-[12px] overflow-hidden row-span-2"
            initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1, ease }}
            whileHover={{ scale: 1.02, transition: { duration: 0.4, ease } }}
          >
            <Image src={imagenes[0].src} alt={imagenes[0].alt} fill className="object-cover object-center" sizes="40vw" />
          </motion.div>

          {/* Col 2 */}
          {[1, 2].map((idx, j) => (
            <motion.div key={idx} className="relative rounded-[12px] overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 + j * 0.1, ease }} whileHover={{ scale: 1.03, transition: { duration: 0.4, ease } }}>
              <Image src={imagenes[idx].src} alt={imagenes[idx].alt} fill className="object-cover object-center" sizes="25vw" />
            </motion.div>
          ))}

          {/* Col 3 */}
          {[3, 4].map((idx, j) => (
            <motion.div key={idx} className="relative rounded-[12px] overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 + j * 0.1, ease }} whileHover={{ scale: 1.03, transition: { duration: 0.4, ease } }}>
              <Image src={imagenes[idx].src} alt={imagenes[idx].alt} fill className="object-cover object-center" sizes="25vw" />
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-[28px]" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.55, ease }}>
          <button className="flex items-center gap-[6px] text-[13px] font-bold hover:opacity-70 transition-opacity" style={{ fontFamily: "Poppins,sans-serif", color: "#1A2B4A" }}>
            Ver galería completa <span style={{ color: "#C9A84C" }}>→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
