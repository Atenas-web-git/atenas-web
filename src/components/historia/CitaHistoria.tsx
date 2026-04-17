"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function CitaHistoria() {
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
      className="relative overflow-hidden bg-[#0D1825] min-h-[320px] md:min-h-[480px]"
    >
      {/* Fondo con parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1440&q=80"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.12 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(13,24,37,0.70)" }}
        />
      </motion.div>

      {/* Glifo " — desktop */}
      <div
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ left: 80, top: 10 }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 240,
            fontWeight: 700,
            color: "#C9A84C",
            opacity: 0.12,
            lineHeight: 1,
          }}
        >
          &ldquo;
        </span>
      </div>

      {/* Glifo " — mobile */}
      <div
        className="absolute pointer-events-none select-none md:hidden"
        style={{ left: 8, top: -36 }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 140,
            fontWeight: 700,
            color: "#C9A84C",
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
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease }}
        >
          El Atenas no es solo un colegio —<br className="hidden md:block" />
          es una promesa que se renueva<br className="hidden md:block" />
          generación tras generación.
        </motion.p>

        <motion.span
          className="block bg-[#C9A84C]"
          style={{ width: 48, height: 3, marginTop: 28, marginBottom: 14 }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.4, ease }}
        />

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
          Unidad Educativa Atenas · Desde 1976
        </motion.p>
      </div>
    </section>
  );
}
