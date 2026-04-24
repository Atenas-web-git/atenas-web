"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface Props {
  titulo: string;
  subtitulo: string;
  photos: { src: string; alt: string }[];
}

export function GaleriaLogros({ titulo, subtitulo, photos }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(contentRef, { once: true, amount: 0.06 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "#1A2B4A" }}>
      {/* Parallax bg */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY, opacity: 0.15 }}>
        {photos[0] && (
          <Image src={photos[0].src} alt="" fill className="object-cover" sizes="100vw" />
        )}
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(26,43,74,0.96) 0%, rgba(26,43,74,0.80) 50%, rgba(26,43,74,0.96) 100%)" }}
      />

      <div ref={contentRef} className="relative z-10 px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-8">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex flex-col gap-1">
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 700, color: "#FFFFFF" }}>
              {titulo}
            </span>
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", maxWidth: 360 }}>
            {subtitulo}
          </span>
        </motion.div>

        {/* Mobile: tall left + 2 stacked right */}
        <div className="flex md:hidden gap-3" style={{ height: 260 }}>
          <motion.div
            className="relative overflow-hidden rounded-[12px] flex-shrink-0"
            style={{ width: 160 }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {photos[0] && <Image src={photos[0].src} alt={photos[0].alt} fill className="object-cover" sizes="160px" />}
          </motion.div>
          <div className="flex flex-col gap-3 flex-1">
            <motion.div
              className="relative overflow-hidden rounded-[12px] flex-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              {photos[2] && <Image src={photos[2].src} alt={photos[2].alt} fill className="object-cover" sizes="50vw" />}
            </motion.div>
            <motion.div
              className="relative overflow-hidden rounded-[12px] flex-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              {photos[3] && <Image src={photos[3].src} alt={photos[3].alt} fill className="object-cover" sizes="50vw" />}
            </motion.div>
          </div>
        </div>

        {/* Desktop: 4-column mosaic grid */}
        <div
          className="hidden md:grid gap-3"
          style={{
            gridTemplateColumns: "2fr 1fr 1.5fr 1fr",
            gridTemplateRows: "170px 170px",
          }}
        >
          {/* Photo 1 — tall left */}
          <motion.div
            className="relative overflow-hidden rounded-[12px]"
            style={{ gridRow: "1 / 3" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {photos[0] && <Image src={photos[0].src} alt={photos[0].alt} fill className="object-cover" sizes="33vw" />}
          </motion.div>

          {/* Photo 2 — top middle-left */}
          <motion.div
            className="relative overflow-hidden rounded-[12px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
          >
            {photos[1] && <Image src={photos[1].src} alt={photos[1].alt} fill className="object-cover" sizes="16vw" />}
          </motion.div>

          {/* Photo 3 — tall middle-right */}
          <motion.div
            className="relative overflow-hidden rounded-[12px]"
            style={{ gridRow: "1 / 3" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.26, ease }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {photos[2] && <Image src={photos[2].src} alt={photos[2].alt} fill className="object-cover" sizes="25vw" />}
          </motion.div>

          {/* Photo 4 — right tall */}
          <motion.div
            className="relative overflow-hidden rounded-[12px]"
            style={{ gridRow: "1 / 3" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.34, ease }}
            whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
          >
            {photos[3] && <Image src={photos[3].src} alt={photos[3].alt} fill className="object-cover" sizes="16vw" />}
          </motion.div>

          {/* Photo 5 — bottom middle-left */}
          <motion.div
            className="relative overflow-hidden rounded-[12px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.42, ease }}
            whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
          >
            {photos[4] && <Image src={photos[4].src} alt={photos[4].alt} fill className="object-cover" sizes="16vw" />}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
