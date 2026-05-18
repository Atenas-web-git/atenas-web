"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type {
  AdmisionesCTA,
  AdmisionesStat,
} from "@/lib/cms/admisionesLanding";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type HeroAdmisionesProps = {
  eyebrow?: string;
  titleLine1?: string;
  titleLine2?: string;
  subtitlePre?: string;
  subtitleHighlight?: string;
  subtitlePost?: string;
  ghostText?: string;
  bgImage?: string;
  badgeValue?: string;
  badgeLabel?: string;
  floatingPhotos?: [string, string, string];
  ctaPrimary?: AdmisionesCTA;
  ctaSecondary?: AdmisionesCTA;
  stats?: AdmisionesStat[];
};

const DEFAULT_STATS: AdmisionesStat[] = [
  { value: "50+", label: "Años de excelencia" },
  { value: "5.000+", label: "Familias que nos eligen" },
  { value: "1°", label: "Programa IB en Ambato" },
];

const DEFAULT_PHOTOS: [string, string, string] = [
  "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
];

// Layout fijo de las 3 fotos (posiciones, rotaciones y delays) — solo el src es editable.
const PHOTO_LAYOUTS = [
  { w: 280, h: 370, style: { left: 60, bottom: 0, rotate: -3 }, initial: { opacity: 0, y: 50 },  delay: 0.55 },
  { w: 220, h: 260, style: { right: 0, top: 0,    rotate:  4 }, initial: { opacity: 0, y: -30 }, delay: 0.78 },
  { w: 160, h: 180, style: { left: 0,  top: 60,   rotate: -5 }, initial: { opacity: 0, x: -20 }, delay: 1.0  },
];

export function HeroAdmisiones({
  eyebrow = "PROCESO DE ADMISIÓN 2026",
  titleLine1 = "Tu futuro",
  titleLine2 = "empieza aquí.",
  subtitlePre = "Únete a la comunidad",
  subtitleHighlight = "Atenas",
  subtitlePost = "y forma parte de cinco décadas de excelencia educativa en Ecuador.",
  ghostText = "ADMISIONES",
  bgImage = "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1440&q=80",
  badgeValue = "2026",
  badgeLabel = "INSCRIPCIONES ABIERTAS",
  floatingPhotos = DEFAULT_PHOTOS,
  ctaPrimary = { label: "Iniciar proceso", href: "/admisiones/formulario" },
  ctaSecondary = { label: "Agendar visita", href: "#visita" },
  stats = DEFAULT_STATS,
}: HeroAdmisionesProps = {}) {
  const floatingImgs = PHOTO_LAYOUTS.map((layout, i) => ({
    ...layout,
    src: floatingPhotos[i] || DEFAULT_PHOTOS[i],
  }));
  return (
    <section className="relative overflow-hidden bg-[#0D1825] min-h-[680px] md:min-h-[900px]">

      {/* ─── Fondo ─── */}
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.22 }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(13,24,37,0.92) 0%, rgba(13,24,37,0.55) 55%, rgba(13,24,37,0.80) 100%)" }}
        />
      </div>

      {/* ─── Ghost ADMISIONES ─── */}
      <div
        className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 100 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:180, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, marginLeft:-10, whiteSpace:"nowrap" }}>
          {ghostText}
        </span>
      </div>
      <div
        className="md:hidden absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 130 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:50, fontWeight:700, color:"white", opacity:0.04, lineHeight:1, letterSpacing:-1, whiteSpace:"nowrap" }}>
          {ghostText}
        </span>
      </div>

      {/* ─── Collage flotante — solo desktop ─── */}
      <div className="hidden md:block absolute pointer-events-none" style={{ right: 80, top: 140, width: 420, height: 500 }}>
        {floatingImgs.map((img, i) => (
          <motion.div
            key={i}
            className="absolute rounded-[14px] overflow-hidden"
            style={{
              width: img.w,
              height: img.h,
              ...img.style,
              boxShadow: "0 20px 60px rgba(0,0,0,0.55)",
            }}
            initial={img.initial as never}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.9, delay: img.delay, ease }}
          >
            <Image src={img.src} alt="" fill className="object-cover" sizes="320px" />
          </motion.div>
        ))}

        {/* Badge dorado flotante */}
        <motion.div
          className="absolute z-20 flex flex-col gap-[2px] rounded-[10px] px-4 py-3"
          style={{ background: "#C9A84C", right: 10, bottom: 30, boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.15, ease }}
        >
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:22, fontWeight:700, color:"#0D1825", lineHeight:1 }}>
            {badgeValue}
          </span>
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"rgba(13,24,37,0.70)", letterSpacing:1 }}>
            {badgeLabel}
          </span>
        </motion.div>

        {/* Línea decorativa dorada */}
        <motion.div
          className="absolute"
          style={{ left: 30, top: -20, width: 2, height: 60, background: "#C9A84C", opacity: 0.5 }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        />
      </div>

      {/* ─── Contenido principal ─── */}
      <div
        className="relative z-10
          px-6 pt-[180px] pb-24
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[160px] md:top-[310px]
          flex flex-col gap-[14px] md:gap-[20px]"
      >
        {/* Badge */}
        <motion.div
          className="flex items-center gap-[8px]"
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
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#C9A84C", letterSpacing:2, textTransform:"uppercase" }}>
            {eyebrow}
          </span>
        </motion.div>

        {/* Título — slide-up línea a línea */}
        <div>
          {([titleLine1, titleLine2] as const).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-bold"
                style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(42px,5.28vw,76px)", fontWeight:700, lineHeight:1.1, color: i === 0 ? "#FFFFFF" : "#C9A84C" }}
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.28 + i * 0.13, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Subtítulo con subrayado animado */}
        <motion.p
          style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(15px,1.25vw,18px)", color:"rgba(255,255,255,0.70)", lineHeight:1.6, maxWidth:500 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.58, ease }}
        >
          {subtitlePre}{" "}
          <span className="relative inline-block">
            {subtitleHighlight}
            <motion.span
              className="absolute left-0 right-0 -bottom-0.5 block bg-[#C9A84C]"
              style={{ height: 3, borderRadius: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.9, ease }}
            />
          </span>
          {" "}{subtitlePost}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col md:flex-row gap-[12px] md:gap-[16px] mt-[4px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease }}
        >
          <Link
            href={ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-[6px] px-[28px] py-[14px] font-bold text-[14px] bg-[#C9A84C] text-[#0D1825] hover:bg-[#dbb95a] transition-colors"
            style={{ fontFamily:"Poppins,sans-serif" }}
          >
            {ctaPrimary.label}
          </Link>
          <Link
            href={ctaSecondary.href}
            className="inline-flex items-center justify-center rounded-[6px] px-[28px] py-[14px] font-bold text-[14px] border border-white/40 text-white hover:bg-white/10 transition-colors"
            style={{ fontFamily:"Poppins,sans-serif" }}
          >
            {ctaSecondary.label}
          </Link>
        </motion.div>
      </div>

      {/* ─── Stats bar — desktop ─── */}
      <motion.div
        className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 items-center gap-[48px] px-[160px] py-[26px]"
        style={{ background:"rgba(13,24,37,0.78)", backdropFilter:"blur(12px)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease }}
      >
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-[32px]">
            <div className="flex flex-col gap-[2px]">
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:28, fontWeight:700, color:"#C9A84C", lineHeight:1 }}>{s.value}</span>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color:"rgba(255,255,255,0.55)" }}>{s.label}</span>
            </div>
            {i < stats.length - 1 && <div style={{ width:1, height:40, background:"rgba(255,255,255,0.18)" }} />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
