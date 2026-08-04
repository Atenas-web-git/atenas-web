"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/lib/useCountUp";
import type {
  ContenidoPlantillaI,
  StatCifrasPlantillaI,
} from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { cifras: ContenidoPlantillaI["cifras"] };

function formatStat(stat: StatCifrasPlantillaI, count: number): string {
  if (stat.isStatic) {
    if (stat.staticText && stat.staticText.trim()) return stat.staticText;
    return `${stat.value}${stat.suffix ?? ""}`;
  }
  const num = stat.value >= 1000 ? count.toLocaleString("es-EC") : count;
  return `${num}${stat.suffix ?? ""}`;
}

function StatCard({
  stat,
  inView,
  size,
}: {
  stat: StatCifrasPlantillaI;
  inView: boolean;
  size: "desktop" | "mobile";
}) {
  const count = useCountUp(stat.value, 1.8, inView && !stat.isStatic);
  const display = formatStat(stat, count);
  const isMobile = size === "mobile";
  const dark = !!stat.dark;

  return (
    <div
      className="flex flex-col items-center flex-1"
      style={{
        gap: isMobile ? 4 : 6,
        padding: isMobile ? "20px 12px" : "32px 16px",
        borderRadius: 8,
        background: dark ? "var(--color-navy)" : "#FFFFFF",
      }}
    >
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: isMobile ? 32 : "clamp(36px, 3.89vw, 56px)",
          fontWeight: 700,
          color: "var(--color-red)",
          lineHeight: 1,
        }}
      >
        {display}
      </span>
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: isMobile ? 12 : 13,
          fontWeight: 600,
          color: dark ? "#FFFFFF" : "var(--color-navy)",
          textAlign: "center",
        }}
      >
        {stat.label}
      </span>
    </div>
  );
}

export function CifrasHistoria({ cifras }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-cream min-h-[420px] md:min-h-[500px]">
      {/* Fondo sutil */}
      {cifras.bgImageSrc && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cifras.bgImageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ opacity: 0.12 }}
          />
        </div>
      )}

      <div ref={ref} className="relative z-10 px-6 pt-10 pb-16 md:pt-[76px] md:pb-[120px]">
        {/* Label */}
        <motion.p
          className="hidden md:block text-center"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--color-red)",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          {cifras.badge}
        </motion.p>

        {/* Título */}
        <motion.h2
          className="text-center mt-0 md:mt-[6px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(24px, 3.06vw, 44px)",
            fontWeight: 700,
            color: "var(--color-navy)",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          {cifras.heading}
        </motion.h2>

        {/* Desktop: fila */}
        <motion.div
          className="hidden md:flex gap-[24px] mt-[46px] max-w-[1200px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {cifras.stats.map((stat, i) => (
            <StatCard key={i} stat={stat} inView={inView} size="desktop" />
          ))}
        </motion.div>

        {/* Mobile: 2 columnas */}
        <motion.div
          className="md:hidden grid grid-cols-2 gap-[16px] mt-[20px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {cifras.stats.map((stat, i) => (
            <StatCard key={i} stat={stat} inView={inView} size="mobile" />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
