"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function HeroHistoria() {
  return (
    <section className="relative overflow-hidden bg-[#0D1825] min-h-[660px] md:min-h-[900px]">
      {/* Foto de fondo */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80"
          alt="Campus Atenas — graduación"
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.25 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,24,37,0.80) 0%, rgba(13,24,37,0.27) 50%, rgba(13,24,37,0.93) 100%)",
          }}
        />
      </div>

      {/* Ghost text HISTORIA — desktop: top 40px con fade; mobile: top 160px (Pencil) */}
      <div
        className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 100 }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontSize: 240,
            fontWeight: 700,
            color: "white",
            opacity: 0.03,
            lineHeight: 1,
            marginLeft: -10,
            whiteSpace: "nowrap",
          }}
        >
          HISTORIA
        </span>
      </div>
      <div
        className="md:hidden absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 160 }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontSize: 100,
            fontWeight: 700,
            color: "white",
            opacity: 0.03,
            lineHeight: 1,
            marginLeft: -4,
            whiteSpace: "nowrap",
          }}
        >
          HISTORIA
        </span>
      </div>

      {/* Contenido — mobile: padding-top; desktop: absolute */}
      <div
        className="relative z-10
          px-6 pt-[196px] pb-16
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[160px] md:top-[360px]
          flex flex-col gap-[16px] md:gap-[22px]"
      >
        {/* Badge */}
        <motion.div
          className="flex items-center gap-[8px] md:gap-[10px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <span
            className="block bg-[#C9A84C] flex-shrink-0"
            style={{ width: 28, height: 2 }}
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
            50 AÑOS DE HISTORIA
          </span>
        </motion.div>

        {/* Título dos líneas */}
        <div>
          {(["Historia &", "Cincuenta Años"] as const).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-bold"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(44px, 5.28vw, 76px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: i === 0 ? "#FFFFFF" : "#C9A84C",
                }}
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.12, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Subtítulo */}
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(15px, 1.25vw, 18px)",
            color: "rgba(255,255,255,0.70)",
            lineHeight: 1.6,
            maxWidth: 560,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease }}
        >
          Cinco décadas formando líderes con propósito
          <br className="hidden md:block" />
          {" "}en el corazón de Ambato.
        </motion.p>

        {/* Caption */}
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(12px, 0.9vw, 13px)",
            color: "rgba(255,255,255,0.33)",
            letterSpacing: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75, ease }}
        >
          Fundada en 1976 · Ambato, Ecuador
        </motion.p>
      </div>
    </section>
  );
}
