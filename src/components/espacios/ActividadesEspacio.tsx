"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface Actividad {
  icon: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

interface Props {
  title: string;
  photoSrc: string;
  photoCaption: string;
  actividades: Actividad[];
}

export function ActividadesEspacio({ title, photoSrc, photoCaption, actividades }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(contentRef, { once: true, amount: 0.08 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "#060E1A" }}>

      {/* Foto de fondo con parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src={photoSrc}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          style={{ opacity: 0.18 }}
        />
      </motion.div>

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(6,14,26,0.94) 0%, rgba(13,24,37,0.70) 45%, rgba(6,14,26,0.96) 100%)" }}
      />

      {/* Barra dorada izquierda */}
      <div className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: "#C9A84C" }} />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col md:flex-row gap-12 md:gap-16 px-6 py-16 md:px-[160px] md:py-[72px] items-start"
      >
        {/* ── Columna izquierda: foto destacada ── */}
        <motion.div
          className="w-full md:w-[440px] flex-shrink-0 flex flex-col gap-4"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease }}
        >
          <motion.div
            className="relative w-full rounded-[16px] overflow-hidden"
            style={{ height: 360 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.35 } }}
          >
            <Image
              src={photoSrc}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 440px"
            />
            <div className="absolute inset-0" style={{ background: "rgba(13,24,37,0.12)" }} />
          </motion.div>

          <div className="flex flex-col gap-1">
            <motion.span
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600, color: "#C9A84C", letterSpacing: 1 }}
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.5, ease }}
            >
              {photoCaption}
            </motion.span>
          </div>
        </motion.div>

        {/* ── Columna derecha: título + tarjetas ── */}
        <div className="flex-1 flex flex-col gap-5">

          {/* Header */}
          <div className="flex flex-col gap-3">
            <motion.div
              className="flex items-center gap-[10px]"
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease }}
            >
              <motion.span
                className="block bg-[#C9A84C] flex-shrink-0"
                style={{ width: 24, height: 2 }}
                initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2, ease }}
              />
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>
                Actividades
              </span>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h2
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px,2.36vw,34px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15 }}
                initial={{ y: 40, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2, ease }}
              >
                {title}
              </motion.h2>
            </div>

            <motion.span
              className="block bg-[#C9A84C]"
              style={{ width: 36, height: 2, borderRadius: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.32, ease }}
            />
          </div>

          {/* Tarjetas de actividad */}
          <div className="flex flex-col gap-3">
            {actividades.map((act, i) => (
              <motion.div
                key={act.title}
                className="flex items-center gap-4 rounded-[12px] px-5 py-[18px]"
                style={{
                  background: act.highlight ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.06)",
                  border: act.highlight ? "1.5px solid rgba(201,168,76,0.40)" : "1px solid rgba(255,255,255,0.10)",
                }}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.22 + i * 0.08, ease }}
                whileHover={{ y: -4, borderColor: act.highlight ? "rgba(201,168,76,0.70)" : "rgba(201,168,76,0.40)", transition: { duration: 0.2 } }}
              >
                <div
                  className="flex items-center justify-center rounded-[10px] flex-shrink-0"
                  style={{ width: 44, height: 44, background: act.highlight ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.15)", fontSize: 20 }}
                >
                  {act.icon}
                </div>
                <div className="flex flex-col gap-[3px] flex-1">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
                    {act.title}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: act.highlight ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
                    {act.desc}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
