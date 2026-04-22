"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface Props {
  badge?: string;
  title: string;
  subtitle?: string;
  ghostText?: string;
}

export function HeroElAtenas({
  badge = "QUIÉNES SOMOS",
  title,
  subtitle,
  ghostText,
}: Props) {
  const ghost = ghostText ?? title.toUpperCase();

  return (
    <section
      className="relative overflow-hidden bg-[#0D1825]"
      style={{ minHeight: 640 }}
    >
      {/* ─── Fondo ─── */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1440&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.18 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,24,37,0.94) 0%, rgba(13,24,37,0.40) 55%, rgba(13,24,37,0.82) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(201,168,76,0.06) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ─── Ghost text desktop ─── */}
      <div
        className="hidden md:block absolute pointer-events-none select-none"
        style={{ top: 100, left: -8 }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontSize: 190,
            fontWeight: 700,
            color: "white",
            opacity: 0.024,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {ghost}
        </span>
      </div>

      {/* ─── Ghost text mobile ─── */}
      <div
        className="md:hidden absolute pointer-events-none select-none overflow-hidden"
        style={{ top: 96, left: 0, width: 390 }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontSize: 70,
            fontWeight: 700,
            color: "white",
            opacity: 0.02,
            lineHeight: 1,
          }}
        >
          {ghost}
        </span>
      </div>

      {/* ─── Decorativos ─── */}
      <div
        className="hidden md:block absolute pointer-events-none"
        style={{
          left: 160,
          top: 0,
          width: 1,
          height: 640,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.40) 35%, rgba(201,168,76,0.40) 65%, transparent 100%)",
        }}
      />
      <div
        className="hidden md:flex absolute gap-[16px] items-center pointer-events-none"
        style={{ left: 148, top: 214 }}
      >
        {[0.8, 0.4, 0.2].map((op, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: `rgba(201,168,76,${op})`,
            }}
          />
        ))}
      </div>
      <div
        className="hidden md:block absolute pointer-events-none rounded-full"
        style={{
          right: -100,
          top: -170,
          width: 320,
          height: 320,
          border: "1px solid rgba(201,168,76,0.20)",
        }}
      />
      <div
        className="hidden md:block absolute pointer-events-none rounded-full"
        style={{
          right: -75,
          top: -195,
          width: 264,
          height: 264,
          border: "1px solid rgba(201,168,76,0.12)",
        }}
      />
      <div
        className="hidden md:block absolute pointer-events-none"
        style={{
          left: 160,
          bottom: 40,
          width: 600,
          height: 1,
          background:
            "linear-gradient(90deg, rgba(201,168,76,0.60) 0%, transparent 100%)",
        }}
      />

      {/* ─── Contenido principal ─── */}
      <div
        className="relative z-10
          px-6 pt-[160px] pb-28
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[192px] md:top-[234px]
          flex flex-col gap-[16px] md:gap-[18px]"
        style={{ maxWidth: 560 }}
      >
        <motion.div
          className="flex items-center gap-[10px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <motion.span
            className="block bg-[#C9A84C] flex-shrink-0"
            style={{ width: 28, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
          />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#C9A84C",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {badge}
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(38px, 4.44vw, 64px)",
              fontWeight: 700,
              lineHeight: 1.05,
              color: "#FFFFFF",
            }}
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, delay: 0.28, ease }}
          >
            {title}
          </motion.h1>
        </div>

        {subtitle && (
          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(14px, 1.18vw, 17px)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.65,
              maxWidth: 480,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48, ease }}
          >
            {subtitle}
          </motion.p>
        )}

        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65, ease }}
        >
          Unidad Educativa Atenas · Izamba, Ambato
        </motion.p>
      </div>
    </section>
  );
}
