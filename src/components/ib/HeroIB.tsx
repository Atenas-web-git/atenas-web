"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ContenidoPlantillaG } from "@/app/admin/(authenticated)/contenido/plantillas";
import { splitHighlight } from "@/lib/cms/highlight";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const collageLayout = [
  { w: 300, h: 370, style: { left: 40, bottom: 0, rotate: -3 }, initial: { opacity: 0, y: 50 }, delay: 0.55 },
  { w: 220, h: 260, style: { right: 0, top: 10, rotate: 4 }, initial: { opacity: 0, y: -30 }, delay: 0.78 },
  { w: 160, h: 185, style: { left: 0, top: 60, rotate: -5 }, initial: { opacity: 0, x: -20 }, delay: 1.0 },
];

type Props = { hero: ContenidoPlantillaG["hero"] };

export function HeroIB({ hero }: Props) {
  return (
    <section className="relative overflow-hidden bg-dark min-h-[620px] md:min-h-[900px]">

      {/* Fondo con overlay */}
      <div className="absolute inset-0">
        {hero.bgImageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={hero.bgImageSrc}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ opacity: 0.15 }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(120deg, rgba(13,24,37,0.97) 0%, rgba(13,24,37,0.58) 55%, rgba(13,24,37,0.90) 100%)" }}
        />
      </div>

      {/* Ghost text */}
      <div className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden" style={{ top: 80 }}>
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:260, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, marginLeft:-10, whiteSpace:"nowrap" }}>
          {hero.ghostText}
        </span>
      </div>
      <div className="md:hidden absolute inset-x-0 pointer-events-none select-none overflow-hidden" style={{ top: 110 }}>
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:60, fontWeight:700, color:"white", opacity:0.04, lineHeight:1, letterSpacing:-2, whiteSpace:"nowrap" }}>
          {hero.ghostText}
        </span>
      </div>

      {/* Collage flotante — desktop */}
      <div className="hidden md:block absolute pointer-events-none" style={{ right: 80, top: 130, width: 440, height: 520 }}>
        {collageLayout.map((img, i) => {
          const src = hero.floatingPhotos[i];
          if (!src) return null;
          return (
            <motion.div
              key={i}
              className="absolute rounded-[14px] overflow-hidden"
              style={{ width: img.w, height: img.h, ...img.style, boxShadow: "0 20px 60px rgba(0,0,0,0.60)" }}
              initial={img.initial as never}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.9, delay: img.delay, ease }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </motion.div>
          );
        })}

        {/* Badge flotante */}
        <motion.div
          className="absolute z-20 flex flex-col gap-[3px] rounded-[10px] px-4 py-3"
          style={{ background: "var(--color-gold)", right: 10, bottom: 40, boxShadow: "0 8px 28px rgba(0,0,0,0.45)" }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.2, ease }}
        >
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"var(--color-dark)", lineHeight:1, letterSpacing:0.5 }}>
            {hero.floatingBadgeLine1}
          </span>
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:9, fontWeight:700, color:"rgba(13,24,37,0.65)", letterSpacing:1 }}>
            {hero.floatingBadgeLine2}
          </span>
        </motion.div>

        <motion.div
          className="absolute"
          style={{ left: 30, top: -20, width: 2, height: 60, background: "var(--color-gold)", opacity: 0.5 }}
          initial={{ scaleY: 0, originY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
        />
      </div>

      {/* Contenido principal */}
      <div
        className="relative z-10
          px-6 pt-[180px] pb-28
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[160px] md:top-[280px]
          flex flex-col gap-[14px] md:gap-[20px]"
      >
        <motion.div
          className="flex items-center gap-[8px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <motion.span
            className="block bg-gold flex-shrink-0"
            style={{ width: 28, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
          />
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"var(--color-gold)", letterSpacing:2, textTransform:"uppercase" }}>
            {hero.badge}
          </span>
        </motion.div>

        {/* Título */}
        <div>
          {[hero.titleLine1, hero.titleLine2].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-bold"
                style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(44px,5.28vw,76px)", fontWeight:700, lineHeight:1.1, color: i === 0 ? "#FFFFFF" : "var(--color-gold)" }}
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.28 + i * 0.13, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Subtítulo */}
        <Subtitle text={hero.subtitle} highlight={hero.subtitleHighlight} />

        {/* CTAs */}
        <motion.div
          className="flex flex-col md:flex-row gap-[12px] md:gap-[16px] mt-[4px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.75, ease }}
        >
          <Link
            href={hero.ctaPrimary.href}
            className="inline-flex items-center justify-center rounded-[6px] px-[28px] py-[14px] font-bold text-[14px] bg-gold text-dark hover:bg-[#dbb95a] transition-colors"
            style={{ fontFamily:"Poppins,sans-serif" }}
          >
            {hero.ctaPrimary.text}
          </Link>
          <Link
            href={hero.ctaSecondary.href}
            className="inline-flex items-center justify-center rounded-[6px] px-[28px] py-[14px] font-bold text-[14px] border border-white/35 text-white hover:bg-white/10 transition-colors"
            style={{ fontFamily:"Poppins,sans-serif" }}
          >
            {hero.ctaSecondary.text}
          </Link>
        </motion.div>

        {/* Chips */}
        {hero.chips.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-[8px] mt-[4px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.88, ease }}
          >
            {hero.chips.map((tag, i) => (
              <span
                key={i}
                className="rounded-full px-[14px] py-[6px] text-[10px] font-bold"
                style={{ fontFamily:"Poppins,sans-serif", background:"rgba(201,168,76,0.14)", color:"var(--color-gold)", letterSpacing:0.5 }}
              >
                {tag.texto}
              </span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Stats bar — desktop */}
      <motion.div
        className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 items-center gap-[48px] px-[160px] py-[24px]"
        style={{ background:"rgba(13,24,37,0.82)", backdropFilter:"blur(12px)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease }}
      >
        {hero.stats.map((s, i) => (
          <div key={i} className="flex items-center gap-[36px]">
            <div className="flex flex-col gap-[2px]">
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:26, fontWeight:700, color:"var(--color-gold)", lineHeight:1 }}>{s.value}</span>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)" }}>{s.label}</span>
            </div>
            {i < hero.stats.length - 1 && <div style={{ width:1, height:36, background:"rgba(255,255,255,0.16)" }} />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

function Subtitle({ text, highlight }: { text: string; highlight: string }) {
  const parts = splitHighlight(text, highlight);
  if (!parts) {
    return (
      <motion.p
        style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(15px,1.2vw,17px)", color:"rgba(255,255,255,0.65)", lineHeight:1.65, maxWidth:540 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.58, ease }}
      >
        {text}
      </motion.p>
    );
  }
  return (
    <motion.p
      style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(15px,1.2vw,17px)", color:"rgba(255,255,255,0.65)", lineHeight:1.65, maxWidth:540 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.58, ease }}
    >
      {parts.before}
      <span className="relative inline-block">
        {parts.match}
        <motion.span
          className="absolute left-0 right-0 -bottom-0.5 block bg-gold"
          style={{ height: 2, borderRadius: 2 }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.9, ease }}
        />
      </span>
      {parts.after}
    </motion.p>
  );
}
