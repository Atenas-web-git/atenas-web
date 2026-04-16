"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useCountUp } from "@/lib/useCountUp";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/* ── Stat con count-up ──────────────────────────────────────── */
function StatCounter({
  value,
  suffix = "",
  label,
  inView,
  color = "#9e1915",
  fontSize = "clamp(32px, 3.33vw, 48px)",
}: {
  value: number;
  suffix?: string;
  label: string;
  inView: boolean;
  color?: string;
  fontSize?: string;
}) {
  const count = useCountUp(value, 1.8, inView);
  const formatted = value >= 1000 ? count.toLocaleString("es-EC") : count;
  return (
    <div className="flex flex-col gap-2">
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize,
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {formatted}
        {suffix}
      </span>
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 11,
          color: "rgba(255,255,255,0.65)",
          textTransform: "uppercase" as const,
          lineHeight: 1.3,
          maxWidth: 140,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function Trayectoria() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);

  const inView      = useInView(contentRef, { once: true, amount: 0.15 });
  const statsInView = useInView(statsRef,   { once: true, amount: 0.3  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1A2B4A] min-h-[540px] md:min-h-[820px]"
    >
      {/* ── Foto de fondo con parallax ── */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0" style={{ opacity: 0.35 }}>
          <Image
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80"
            alt="Campus Atenas"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,43,74,0.88) 0%, rgba(13,24,37,0.94) 100%)",
          }}
        />
      </motion.div>

      {/* ── Ghost text "50 AÑOS" — clamp: 85px mobile → 220px desktop ── */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ top: 20, left: -20, right: 0, overflow: "hidden" }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(85px, 15.28vw, 220px)",
            color: "white",
            opacity: 0.03,
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          50 AÑOS
        </span>
      </div>

      {/* ── Escudo — solo desktop ── */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{ left: -30, top: 150, width: 440, height: 500 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={inView ? { opacity: 0.75, scale: 1 } : {}}
        transition={{ duration: 1.2, ease }}
      >
        <Image
          src="/images/v5Aw6.png"
          alt="Escudo Atenas"
          width={440}
          height={500}
          className="w-full h-full object-contain"
          priority
        />
      </motion.div>

      {/* ════════════════════════════════════════════════════════
          Contenido — mobile: px-6 pt-[134px]
                      desktop: pl-[48.61%] pr-[72px] pt-[190px]
          ════════════════════════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="relative z-10
          px-6 pt-[134px] pb-16
          md:px-0 md:pl-[48.61%] md:pr-[72px] md:pt-[190px] md:pb-[100px]"
      >
        {/* Label "NUESTRA TRAYECTORIA" */}
        <motion.p
          style={{
            fontFamily:    "Poppins, sans-serif",
            fontSize:       11,
            fontWeight:     700,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color:          "white",
            marginBottom:   30,
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          Nuestra Trayectoria
        </motion.p>

        {/* Título */}
        {["Cinco décadas formando", "líderes con propósito."].map((line, i) => (
          <div key={i} className="overflow-hidden">
            <motion.h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize:   "clamp(30px, 3.61vw, 52px)",
                fontWeight:  700,
                lineHeight:  1.15,
                color:       "white",
                margin:      0,
              }}
              initial={{ y: 56, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.15, ease }}
            >
              {line}
            </motion.h2>
          </div>
        ))}

        {/* Línea dorada */}
        <motion.span
          className="block h-[3px] bg-[#C9A84C] w-[48px]"
          style={{ marginTop: 24, marginBottom: 24, originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.45, delay: 0.5, ease }}
        />

        {/* Subtítulo */}
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize:   "clamp(13px, 1.11vw, 16px)",
            fontWeight:  400,
            lineHeight:  1.7,
            color:       "rgba(255,255,255,0.7)",
            maxWidth:    520,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.6, ease }}
        >
          Desde 1976, el Atenas ha sido el espacio donde generaciones de
          ambateños encontraron su camino hacia la excelencia.
        </motion.p>

        {/* ── Stats ── */}
        <div ref={statsRef}>

          {/* ── Mobile: fila horizontal, colores Pencil ── */}
          <motion.div
            className="flex justify-between mt-10 md:hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.75, ease }}
          >
            {/* 50+ */}
            <StatCounter
              value={50}
              suffix="+"
              label="Años de excelencia"
              inView={statsInView}
              color="#C9A84C"
              fontSize="24px"
            />
            {/* 1,200+ */}
            <StatCounter
              value={1200}
              suffix="+"
              label="Estudiantes activos"
              inView={statsInView}
              color="#FFFFFF"
              fontSize="24px"
            />
            {/* IB */}
            <div className="flex flex-col gap-2">
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#C9A84C",
                  lineHeight: 1,
                }}
              >
                IB
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  textTransform: "uppercase" as const,
                  lineHeight: 1.3,
                  maxWidth: 100,
                }}
              >
                Bachillerato Internacional
              </span>
            </div>
          </motion.div>

          {/* ── Desktop: tamaño grande, rojo ── */}
          <motion.div
            className="hidden md:flex flex-wrap gap-10 md:gap-16"
            style={{ marginTop: 56 }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.75, ease }}
          >
            <StatCounter
              value={50}
              suffix="+"
              label="Años de excelencia"
              inView={statsInView}
            />
            <StatCounter
              value={1200}
              suffix="+"
              label="Estudiantes activos"
              inView={statsInView}
            />
            <div className="flex flex-col gap-2">
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(32px, 3.33vw, 48px)",
                  fontWeight: 700,
                  color: "#9e1915",
                  lineHeight: 1,
                }}
              >
                IB
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.65)",
                  textTransform: "uppercase" as const,
                  lineHeight: 1.4,
                  maxWidth: 150,
                }}
              >
                Bachillerato Internacional
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
