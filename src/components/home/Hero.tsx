"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const titleLines = ["Formando líderes", "que transforman", "el Ecuador."];

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Foto de fondo */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      >
        <Image
          src="/images/00_politicas-de-seguridad-1536x864.jpg"
          alt="Campus Unidad Educativa Atenas"
          fill
          priority
          className="object-cover object-center"
        />
      </motion.div>

      {/* Overlay cinematográfico */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(13,24,37,0.73) 0%, rgba(13,24,37,0.33) 42%, rgba(13,24,37,0.86) 100%)",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-[5vh] md:pb-[8vh] px-8 md:px-[160px]">
        <div className="max-w-[860px]">
          {titleLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h1
                className="text-white font-bold leading-[1.0] text-[clamp(36px,4.7vw,68px)]"
                initial={{ y: 64, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.75,
                  delay: 0.3 + i * 0.15,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {line}
              </motion.h1>
            </div>
          ))}

          <div className="overflow-hidden mt-5">
            <motion.p
              className="text-white/70 text-[clamp(14px,1.1vw,16px)] leading-[1.6] max-w-[560px]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.65,
                delay: 0.9,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              Una educación de excelencia desde 1976.
            </motion.p>
          </div>
        </div>

        {/* Botón "Reproducir Video" */}
        <motion.button
          className="flex items-center gap-3.5 mt-10 group w-fit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {/* Círculo con ícono play — animación solo en hover */}
          <motion.span
            className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:border-white/80 transition-all duration-300"
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
          </motion.span>
          <span className="text-white/70 group-hover:text-white text-[11px] font-semibold tracking-[2.5px] transition-colors">
            REPRODUCIR VIDEO
          </span>
        </motion.button>
      </div>
    </section>
  );
}
