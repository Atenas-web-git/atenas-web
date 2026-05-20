"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import type { ContenidoPlantillaI } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { cita: ContenidoPlantillaI["cita"] };

export function CitaHistoria({ cita }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(contentRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-dark min-h-[320px] md:min-h-[480px]"
    >
      {/* Fondo con parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        {cita.bgImageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cita.bgImageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ opacity: 0.12 }}
          />
        )}
        <div className="absolute inset-0" style={{ background: "rgba(13,24,37,0.70)" }} />
      </motion.div>

      {/* Glifo " — desktop */}
      <div className="absolute pointer-events-none select-none hidden md:block" style={{ left: 80, top: 10 }}>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 240,
            fontWeight: 700,
            color: "var(--color-gold)",
            opacity: 0.12,
            lineHeight: 1,
          }}
        >
          &ldquo;
        </span>
      </div>

      {/* Glifo " — mobile */}
      <div className="absolute pointer-events-none select-none md:hidden" style={{ left: 8, top: -36 }}>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 140,
            fontWeight: 700,
            color: "var(--color-gold)",
            opacity: 0.12,
            lineHeight: 1,
          }}
        >
          &ldquo;
        </span>
      </div>

      {/* Contenido */}
      <div
        ref={contentRef}
        className="relative z-10
          px-6 pt-[64px] pb-16
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[220px] md:top-[100px]"
      >
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(20px, 2.5vw, 36px)",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.3,
            maxWidth: 760,
            whiteSpace: "pre-line",
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          {cita.quote}
        </motion.p>

        <motion.span
          className="block bg-gold"
          style={{ width: 48, height: 3, marginTop: 28, marginBottom: 14 }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4, ease }}
        />

        {cita.attribution && (
          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(11px, 0.9vw, 13px)",
              color: "rgba(255,255,255,0.33)",
              letterSpacing: 1,
            }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.55, ease }}
          >
            {cita.attribution}
          </motion.p>
        )}
      </div>
    </section>
  );
}
