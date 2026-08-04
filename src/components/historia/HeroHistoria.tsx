"use client";

import { motion } from "framer-motion";
import type { ContenidoPlantillaI } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { hero: ContenidoPlantillaI["hero"] };

export function HeroHistoria({ hero }: Props) {
  return (
    <section className="relative overflow-hidden bg-dark min-h-[480px] md:min-h-[900px]">
      {/* Foto de fondo */}
      <div className="absolute inset-0">
        {hero.bgImageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.bgImageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ opacity: 0.25 }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,24,37,0.80) 0%, rgba(13,24,37,0.27) 50%, rgba(13,24,37,0.93) 100%)",
          }}
        />
      </div>

      {/* Ghost text */}
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
          {hero.ghostText}
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
          {hero.ghostText}
        </span>
      </div>

      {/* Contenido */}
      <div
        className="relative z-10
          px-6 pt-[196px] pb-16
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[160px] md:top-[360px]
          flex flex-col gap-[16px] md:gap-[22px]"
      >
        <motion.div
          className="flex items-center gap-[8px] md:gap-[10px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <span className="block bg-red flex-shrink-0" style={{ width: 28, height: 2 }} />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color:"#FFFFFF",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {hero.badge}
          </span>
        </motion.div>

        <div>
          {[hero.titleLine1, hero.titleLine2].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-bold"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(44px, 5.28vw, 76px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: i === 0 ? "#FFFFFF" : "var(--color-red)",
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
          {hero.subtitle}
        </motion.p>

        {hero.caption && (
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
            {hero.caption}
          </motion.p>
        )}
      </div>
    </section>
  );
}
