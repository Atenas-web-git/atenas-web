"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { AdmisionesCTA } from "@/lib/cms/admisionesLanding";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const DEFAULT_PHOTOS: [string, string, string] = [
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&q=80",
  "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
];

// Layout fijo del collage de 3 fotos (posiciones, rotaciones, delays) — solo el src es editable.
const COLLAGE_LAYOUTS: Array<{
  pos: React.CSSProperties;
  rotate: number;
  initial: { opacity: number; x?: number; y?: number };
  delay: number;
  shadow: string;
  border?: boolean;
}> = [
  { pos: { width: 320, height: 400, left: 60, bottom: 0 }, rotate: -2, initial: { opacity: 0, y: 40 },  delay: 0.3,  shadow: "0 24px 64px rgba(0,0,0,0.22)" },
  { pos: { width: 220, height: 260, left: 0,  top: 0 },    rotate: -5, initial: { opacity: 0, x: -24 }, delay: 0.5,  shadow: "0 16px 48px rgba(0,0,0,0.20)", border: true },
  { pos: { width: 200, height: 230, right: 0, top: 80 },   rotate:  4, initial: { opacity: 0, y: -24 }, delay: 0.68, shadow: "0 14px 40px rgba(0,0,0,0.22)" },
];

export type VisitaAdmisionesProps = {
  eyebrow?: string;
  headingPre?: string;
  headingHighlight?: string;
  description?: string;
  ubicacion?: string;
  horarioCorto?: string;
  ctaPrimary?: AdmisionesCTA;
  ctaSecondary?: AdmisionesCTA;
  contactoLine?: string;
  fotos?: [string, string, string];
  badgeFloating?: { linea1: string; linea2: string };
};

export function VisitaAdmisiones({
  eyebrow = "Visita el Campus",
  headingPre = "Ven a conocer",
  headingHighlight = "el Atenas.",
  description = "Agenda una visita guiada y descubre nuestras instalaciones, metodología y el ambiente que hace especial a Atenas. Sin compromiso.",
  ubicacion = "Ambato, Ecuador",
  horarioCorto = "Lun – Vie · 08:00–16:00",
  ctaPrimary = { label: "Agendar visita", href: "mailto:admisiones@atenas.edu.ec" },
  ctaSecondary = { label: "Ver proceso", href: "#proceso" },
  contactoLine = "(03) 282-1234 · admisiones@atenas.edu.ec",
  fotos = DEFAULT_PHOTOS,
  badgeFloating = { linea1: "Lun a Vie", linea2: "08:00 – 16:00" },
}: VisitaAdmisionesProps = {}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(contentRef, { once:true, amount:0.2 });
  const collage = COLLAGE_LAYOUTS.map((layout, i) => ({
    ...layout,
    src: fotos[i] || DEFAULT_PHOTOS[i],
  }));

  return (
    <section
      id="visita"
      className="relative overflow-hidden bg-cream min-h-[560px] md:min-h-[640px]"
    >
      {/* ─── Collage fotográfico — desktop izquierda ─── */}
      <div
        className="hidden md:block absolute pointer-events-none"
        style={{ left:80, top:"50%", transform:"translateY(-50%)", width:440, height:500 }}
      >
        {collage.map((img, i) => (
          <motion.div
            key={i}
            className="absolute rounded-[16px] overflow-hidden"
            style={{ ...img.pos, rotate: img.rotate, boxShadow: img.shadow }}
            initial={img.initial as never}
            whileInView={{ opacity:1, x:0, y:0 }}
            viewport={{ once:true, amount:0.2 }}
            transition={{ duration:0.85, delay:img.delay, ease }}
          >
            <Image src={img.src} alt="" fill className="object-cover" sizes="320px" />
            {img.border && (
              <div className="absolute inset-0 border-[3px] border-red/50 rounded-[16px]" />
            )}
          </motion.div>
        ))}

        {/* Badge flotante sobre el collage */}
        <motion.div
          className="absolute z-20 rounded-[10px] px-4 py-3 flex flex-col gap-[2px]"
          style={{ background:"var(--color-red)", right:0, bottom:40, boxShadow:"0 10px 30px rgba(0,0,0,0.22)" }}
          initial={{ opacity:0, scale:0.75 }}
          whileInView={{ opacity:1, scale:1 }}
          viewport={{ once:true, amount:0.2 }}
          transition={{ duration:0.5, delay:0.85, ease }}
        >
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:20, fontWeight:700, color:"#FFFFFF", lineHeight:1 }}>
            {badgeFloating.linea1}
          </span>
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.75)", letterSpacing:1 }}>
            {badgeFloating.linea2}
          </span>
        </motion.div>
      </div>

      {/* ─── Foto única — mobile ─── */}
      <div className="md:hidden relative w-full overflow-hidden" style={{ height:220 }}>
        <Image
          src={fotos[0] || DEFAULT_PHOTOS[0]}
          alt="Campus Atenas" fill className="object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, transparent 55%, var(--color-cream) 100%)" }} />
      </div>

      {/* ─── Contenido ─── */}
      <div
        ref={contentRef}
        className="relative z-10
          px-6 pt-8 pb-16
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:right-[120px] md:top-1/2 md:-translate-y-1/2
          md:w-[42%]
          flex flex-col gap-[14px] md:gap-[18px]"
      >
        <motion.p
          style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#FFFFFF", letterSpacing:3, textTransform:"uppercase" }}
          initial={{ opacity:0, y:14 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.45, ease }}
        >
          {eyebrow}
        </motion.p>

        <motion.span
          className="block bg-red"
          style={{ width:40, height:2 }}
          initial={{ scaleX:0, originX:0 }}
          animate={inView ? { scaleX:1 } : {}}
          transition={{ duration:0.4, delay:0.1, ease }}
        />

        <div className="overflow-hidden">
          <motion.h2
            style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(26px,2.78vw,40px)", fontWeight:700, color:"var(--color-dark)", lineHeight:1.2 }}
            initial={{ y:50, opacity:0 }}
            animate={inView ? { y:0, opacity:1 } : {}}
            transition={{ duration:0.65, delay:0.15, ease }}
          >
            {headingPre}{" "}
            <span className="relative inline-block">
              {headingHighlight}
              <motion.span
                className="absolute left-0 right-0 -bottom-1 block bg-red"
                style={{ height:4, borderRadius:2 }}
                initial={{ scaleX:0, originX:0 }}
                animate={inView ? { scaleX:1 } : {}}
                transition={{ duration:0.55, delay:0.55, ease }}
              />
            </span>
          </motion.h2>
        </div>

        <motion.p
          style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(14px,1.04vw,15px)", color:"rgba(13,24,37,0.65)", lineHeight:1.65, maxWidth:420 }}
          initial={{ opacity:0, y:14 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.55, delay:0.3, ease }}
        >
          {description}
        </motion.p>

        {/* Info rápida */}
        <motion.div
          className="flex gap-[20px] flex-wrap"
          initial={{ opacity:0, y:10 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.45, delay:0.42, ease }}
        >
          {[["📍", ubicacion], ["🕐", horarioCorto]].map(([icon, text]) => (
            <span key={text} style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color:"rgba(13,24,37,0.55)" }}>
              {icon} {text}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col md:flex-row gap-[12px] mt-[4px]"
          initial={{ opacity:0, y:16 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.5, delay:0.52, ease }}
        >
          <Link
            href={ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-[6px] px-[24px] py-[13px] font-bold text-[14px] bg-navy text-white hover:bg-[#243d6a] transition-colors"
            style={{ fontFamily:"Poppins,sans-serif" }}
          >
            {ctaPrimary.label}
          </Link>
          <Link
            href={ctaSecondary.href}
            className="inline-flex items-center justify-center rounded-[6px] px-[24px] py-[13px] font-bold text-[14px] border border-navy/40 text-navy hover:bg-navy/10 transition-colors"
            style={{ fontFamily:"Poppins,sans-serif" }}
          >
            {ctaSecondary.label}
          </Link>
        </motion.div>

        {/* Contacto */}
        <motion.p
          style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color:"rgba(13,24,37,0.45)", marginTop:2 }}
          initial={{ opacity:0 }}
          animate={inView ? { opacity:1 } : {}}
          transition={{ duration:0.5, delay:0.65, ease }}
        >
          {contactoLine}
        </motion.p>
      </div>
    </section>
  );
}
