"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/lib/useCountUp";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

function StatCard({
  value,
  suffix = "",
  label,
  dark = false,
  inView,
  static: isStatic = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  dark?: boolean;
  inView: boolean;
  static?: boolean;
}) {
  const count = useCountUp(value, 1.8, inView && !isStatic);
  const formatted = value >= 1000
    ? count.toLocaleString("es-EC")
    : isStatic ? value : count;

  return (
    <div
      className="flex flex-col items-center gap-[6px] rounded-[8px] p-[32px_16px] flex-1"
      style={{ background: dark ? "#1A2B4A" : "#FFFFFF" }}
    >
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "clamp(36px, 3.89vw, 56px)",
          fontWeight: 700,
          color: "#C9A84C",
          lineHeight: 1,
        }}
      >
        {isStatic ? `${value} IB` : `${formatted}${suffix}`}
      </span>
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: dark ? "#FFFFFF" : "#1A2B4A",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function MobileStatCard({
  value,
  suffix = "",
  label,
  dark = false,
  inView,
  static: isStatic = false,
}: {
  value: number;
  suffix?: string;
  label: string;
  dark?: boolean;
  inView: boolean;
  static?: boolean;
}) {
  const count = useCountUp(value, 1.8, inView && !isStatic);
  const formatted = value >= 1000
    ? count.toLocaleString("es-EC")
    : isStatic ? value : count;

  return (
    <div
      className="flex flex-col items-center gap-[4px] rounded-[8px] p-[20px_12px] flex-1"
      style={{ background: dark ? "#1A2B4A" : "#FFFFFF" }}
    >
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 32,
          fontWeight: 700,
          color: "#C9A84C",
          lineHeight: 1,
        }}
      >
        {isStatic ? `${value} IB` : `${formatted}${suffix}`}
      </span>
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: dark ? "#FFFFFF" : "#1A2B4A",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function CifrasHistoria() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="relative overflow-hidden bg-[#F8F5F0] min-h-[420px] md:min-h-[500px]">
      {/* Fondo sutil */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1440&q=80"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.12 }}
        />
      </div>

      <div ref={ref} className="relative z-10 px-6 pt-10 pb-16 md:pt-[76px] md:pb-[120px]">
        {/* Label — solo desktop */}
        <motion.p
          className="hidden md:block text-center"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#C9A84C",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          Nuestros Números
        </motion.p>

        {/* Título */}
        <motion.h2
          className="text-center mt-0 md:mt-[6px]"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(24px, 3.06vw, 44px)",
            fontWeight: 700,
            color: "#1A2B4A",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          Medio siglo en números
        </motion.h2>

        {/* ─── Desktop: fila de 4 ─── */}
        <motion.div
          className="hidden md:flex gap-[24px] mt-[46px] max-w-[1200px] mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <StatCard value={50}   suffix=""  label="Años de historia"   dark={false} inView={inView} />
          <StatCard value={5000} suffix="+" label="Egresados"           dark={true}  inView={inView} />
          <StatCard value={200}  suffix="+" label="Docentes"            dark={false} inView={inView} />
          <StatCard value={1}    suffix=""  label="Colegio IB en Ambato" dark={false} inView={inView} static />
        </motion.div>

        {/* ─── Mobile: 2×2 ─── */}
        <motion.div
          className="md:hidden flex flex-col gap-[16px] mt-[20px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <div className="flex gap-[16px]">
            <MobileStatCard value={50}   suffix=""  label="Años de historia" dark={false} inView={inView} />
            <MobileStatCard value={5000} suffix="+" label="Egresados"        dark={true}  inView={inView} />
          </div>
          <div className="flex gap-[16px]">
            <MobileStatCard value={200}  suffix="+" label="Docentes"             dark={false} inView={inView} />
            <MobileStatCard value={1}    suffix=""  label="Colegio IB en Ambato" dark={false} inView={inView} static />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
