"use client";

import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface LogroDestacado {
  icon: string;
  deporte: string;
  titulo: string;
  year: string;
  categoria: string;
  photos: string[];
  highlight?: boolean;
}

interface Props {
  heading: string;
  subheading: string;
  logros: LogroDestacado[];
  onVerGaleria?: () => void;
}

function LogroCard({ logro, index, inView }: { logro: LogroDestacado; index: number; inView: boolean }) {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <motion.div
      className="relative overflow-hidden w-full md:flex-1"
      style={{
        borderRadius: 14,
        height: 320,
        minWidth: 0,
        border: logro.highlight ? "1.5px solid rgba(201,168,76,0.55)" : "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease }}
    >
      {/* Photos with crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhoto}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={logro.photos[activePhoto]}
            alt={logro.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(6,14,26,0.08) 0%, rgba(6,14,26,0.92) 65%, rgba(6,14,26,0.98) 100%)" }}
      />

      {/* Sport badge */}
      <div
        className="absolute flex items-center gap-[6px] rounded-full px-3 py-[5px]"
        style={{ top: 16, left: 16, background: "rgba(201,168,76,0.92)" }}
      >
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#0D1825" }}>
          {logro.icon} {logro.deporte}
        </span>
      </div>

      {/* Year tag */}
      <div
        className="absolute rounded-full px-2 py-[4px]"
        style={{ top: 16, right: 16, background: "rgba(13,24,37,0.75)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.80)" }}>
          {logro.year}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex flex-col gap-[6px]">
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>
          {logro.titulo}
        </span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(201,168,76,0.90)" }}>
          {logro.categoria}
        </span>

        {/* Slider dots */}
        {logro.photos.length > 1 && (
          <div className="flex items-center gap-[6px] mt-1">
            {logro.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === activePhoto ? 18 : 6,
                  height: 6,
                  background: i === activePhoto ? "#C9A84C" : "rgba(255,255,255,0.35)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function LogrosDestacados({ heading, subheading, logros, onVerGaleria }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060E1A" }}>
      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <motion.div
            className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block bg-[#C9A84C] flex-shrink-0"
              style={{ width: 24, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
            />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>
              Logros Destacados
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px,2.36vw,34px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15 }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              {heading}
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.50)", lineHeight: 1.65, maxWidth: 560 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            {subheading}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5">
          {logros.map((logro, i) => (
            <LogroCard key={logro.titulo} logro={logro} index={i} inView={inView} />
          ))}
        </div>

        {/* Ver galería completa */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55, ease }}
        >
          <motion.button
            onClick={onVerGaleria}
            className="flex items-center gap-3 rounded-[10px] px-7 py-[14px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#C9A84C",
              background: "rgba(201,168,76,0.10)",
              border: "1.5px solid rgba(201,168,76,0.45)",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.03, borderColor: "rgba(201,168,76,0.80)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Ver galería completa
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
