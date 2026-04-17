"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const stats = [
  { value: "48",      label: "Artículos publicados" },
  { value: "7",       label: "Categorías"           },
  { value: "Mensual", label: "Frecuencia"           },
  { value: "5.000+",  label: "Lectores activos"     },
];

interface HeroRevistaProps {
  searchValue?: string;
  onSearchChange?: (v: string) => void;
}

export function HeroRevista({ searchValue = "", onSearchChange }: HeroRevistaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "22%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0D1825] min-h-[580px]"
    >
      {/* Fondo parallax */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY }}>
        <Image
          src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1440&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.25 }}
        />
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(13,24,37,0.95) 0%, rgba(13,24,37,0.55) 55%, rgba(13,24,37,0.93) 100%)" }}
      />

      {/* Ghost REVISTA */}
      <div className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden" style={{ top: 80 }}>
        <span style={{ display: "block", fontFamily: "Poppins,sans-serif", fontSize: 210, fontWeight: 700, color: "white", opacity: 0.03, lineHeight: 1, marginLeft: -10, whiteSpace: "nowrap" }}>
          REVISTA
        </span>
      </div>

      {/* Contenido */}
      <div className="relative z-10 px-6 pt-[180px] pb-20 md:px-0 md:pt-0 md:pb-0 md:absolute md:left-[160px] md:top-[190px] flex flex-col gap-[14px] md:gap-[18px]">

        {/* Badge */}
        <motion.div className="flex items-center gap-[10px]" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
          <motion.span className="block bg-[#C9A84C] flex-shrink-0" style={{ width: 28, height: 2 }} initial={{ scaleX: 0, originX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4, delay: 0.1, ease }} />
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>
            Revista Digital
          </span>
        </motion.div>

        {/* Título */}
        {(["Revista", "Atenas."] as const).map((line, i) => (
          <div key={i} className="overflow-hidden">
            <motion.span
              className="block font-bold"
              style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(44px,5.28vw,76px)", fontWeight: 700, lineHeight: 1.1, color: i === 0 ? "#FFFFFF" : "#C9A84C" }}
              initial={{ y: 70, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, delay: 0.24 + i * 0.13, ease }}
            >
              {line}
            </motion.span>
          </div>
        ))}

        {/* Subtítulo */}
        <motion.p
          style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(15px,1.18vw,17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: 560 }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55, ease }}
        >
          Noticias, logros y vida de nuestra comunidad educativa desde 1976.
        </motion.p>

        {/* Buscador */}
        <motion.div
          className="relative"
          style={{ width: "min(440px, 100%)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.72, ease }}
        >
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearchChange?.(e.target.value)}
            placeholder="Buscar artículos, eventos, logros…"
            className="w-full h-[48px] pl-[18px] pr-[60px] rounded-[8px] text-[14px] text-white placeholder-white/40 outline-none"
            style={{ fontFamily: "Poppins,sans-serif", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}
          />
          <button
            className="absolute right-[8px] top-[8px] w-[32px] h-[32px] rounded-[6px] flex items-center justify-center"
            style={{ background: "#C9A84C" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D1825" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Stats bar desktop */}
      <motion.div
        className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 items-center px-[160px] py-[18px]"
        style={{ background: "rgba(13,24,37,0.82)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease }}
      >
        {stats.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col gap-[2px] pr-[48px]">
              <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 24, fontWeight: 700, color: "#C9A84C", lineHeight: 1 }}>{s.value}</span>
              <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{s.label}</span>
            </div>
            {i < stats.length - 1 && <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.16)", marginRight: 48 }} />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
