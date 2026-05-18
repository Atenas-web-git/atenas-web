"use client";

import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaH } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { cta: ContenidoPlantillaH["cta"] };

export function CTAAcademico({ cta }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(contentRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const hl = cta.headingHighlight;
  const headingParts = hl && cta.heading.includes(hl) ? cta.heading.split(hl) : null;

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0D1825]" style={{ minHeight: 520 }}>

      {cta.bgImageSrc && (
        <motion.div className="absolute inset-0" style={{ y: bgY, willChange: "transform" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cta.bgImageSrc} alt="" className="w-full h-full object-cover object-center" style={{ opacity: 0.28 }} />
        </motion.div>
      )}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(13,24,37,0.95) 0%, rgba(13,24,37,0.60) 55%, rgba(13,24,37,0.90) 100%)" }}
      />

      <div className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden" style={{ top: 20 }}>
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:220, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, marginLeft:-10, whiteSpace:"nowrap" }}>
          {cta.ghostText}
        </span>
      </div>

      <div
        ref={contentRef}
        className="relative z-10 px-6 py-[64px] md:px-[120px] md:py-[100px] flex flex-col md:flex-row items-start gap-[48px]"
      >
        <div className="flex-1 flex flex-col gap-[20px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            {cta.badge}
          </motion.p>

          <motion.span
            className="block bg-[#C9A84C]"
            style={{ width:40, height:2 }}
            initial={{ scaleX:0, originX:0 }}
            animate={inView ? { scaleX:1 } : {}}
            transition={{ duration:0.4, delay:0.1, ease }}
          />

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(28px,3.06vw,44px)", fontWeight:700, color:"#FFFFFF", lineHeight:1.15 }}
              initial={{ y:50, opacity:0 }}
              animate={inView ? { y:0, opacity:1 } : {}}
              transition={{ duration:0.65, delay:0.15, ease }}
            >
              {headingParts ? (
                <>
                  {headingParts[0]}
                  <span className="relative inline-block" style={{ color:"#C9A84C" }}>
                    {hl}
                    <motion.span
                      className="absolute left-0 right-0 -bottom-1 block bg-[#C9A84C]"
                      style={{ height:3, borderRadius:2 }}
                      initial={{ scaleX:0, originX:0 }}
                      animate={inView ? { scaleX:1 } : {}}
                      transition={{ duration:0.55, delay:0.55, ease }}
                    />
                  </span>
                  {headingParts.slice(1).join(hl)}
                </>
              ) : (
                cta.heading
              )}
            </motion.h2>
          </div>

          {cta.descripcion && (
            <motion.p
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(14px,1.15vw,16px)", color:"rgba(255,255,255,0.62)", lineHeight:1.7, maxWidth:520 }}
              initial={{ opacity:0, y:16 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.6, delay:0.3, ease }}
            >
              {cta.descripcion}
            </motion.p>
          )}

          {cta.chips.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-[10px]"
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.5, delay:0.42, ease }}
            >
              {cta.chips.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-full px-[12px] py-[5px] text-[10px] font-bold"
                  style={{ fontFamily:"Poppins,sans-serif", background:"rgba(201,168,76,0.14)", color:"#C9A84C", letterSpacing:0.4 }}
                >
                  {tag.texto}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.5, delay:0.55, ease }}
          >
            <Link
              href={cta.btnHref}
              className="inline-flex items-center gap-[10px] rounded-[6px] px-[28px] py-[14px] font-bold text-[14px] bg-[#C9A84C] text-[#0D1825] hover:bg-[#dbb95a] transition-colors"
              style={{ fontFamily:"Poppins,sans-serif" }}
            >
              {cta.btnText}
              <span style={{ fontSize:16 }}>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Tarjeta estadísticas derecha */}
        <motion.div
          className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-[1px] rounded-[14px] overflow-hidden"
          style={{ border:"1.5px solid rgba(201,168,76,0.30)" }}
          initial={{ opacity:0, x:50 }}
          animate={inView ? { opacity:1, x:0 } : {}}
          transition={{ duration:0.7, delay:0.2, ease }}
        >
          {cta.stats.map((stat, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-[4px] px-[24px] py-[20px]"
              style={{ background: i === 1 ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.04)" }}
              initial={{ opacity:0, x:30 }}
              animate={inView ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.5, delay:0.3 + i*0.1, ease }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:22, fontWeight:700, color:"#C9A84C", lineHeight:1 }}>{stat.value}</span>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, fontWeight:700, color:"#FFFFFF", lineHeight:1.3 }}>{stat.label}</span>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, color:"rgba(255,255,255,0.45)" }}>{stat.sub}</span>
            </motion.div>
          ))}

          {cta.statsCardImg && (
            <div className="relative" style={{ height: 120 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cta.statsCardImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div
                className="absolute inset-0"
                style={{ background:"linear-gradient(to bottom, rgba(13,24,37,0.50) 0%, transparent 60%)" }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
