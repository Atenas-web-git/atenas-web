"use client";

import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaG } from "@/app/admin/(authenticated)/contenido/plantillas";
import { splitHighlight } from "@/lib/cms/highlight";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { proceso: ContenidoPlantillaG["proceso"] };

export function ProcesoIB({ proceso }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once:true, amount:0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const headingParts = splitHighlight(proceso.heading, proceso.headingHighlight);

  return (
    <section ref={sectionRef} id="proceso" className="relative overflow-hidden bg-dark" style={{ minHeight:600 }}>

      {/* Parallax bg */}
      {proceso.bgImageSrc && (
        <motion.div className="absolute inset-0" style={{ y: bgY, willChange:"transform" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={proceso.bgImageSrc} alt="" className="w-full h-full object-cover object-top" style={{ opacity:0.18 }} />
        </motion.div>
      )}
      <div
        className="absolute inset-0"
        style={{ background:"linear-gradient(135deg, rgba(13,24,37,0.97) 0%, rgba(13,24,37,0.65) 60%, rgba(13,24,37,0.95) 100%)" }}
      />

      <div className="relative z-10 px-6 py-[64px] md:px-[120px] md:py-[100px]">

        <div ref={headerRef} className="mb-[52px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"var(--color-gold)", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            {proceso.badge}
          </motion.p>
          <motion.span
            className="block bg-gold"
            style={{ width:40, height:2, marginTop:8, marginBottom:10 }}
            initial={{ scaleX:0, originX:0 }}
            animate={inView ? { scaleX:1 } : {}}
            transition={{ duration:0.4, delay:0.1, ease }}
          />
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(26px,2.78vw,40px)", fontWeight:700, color:"#FFFFFF", lineHeight:1.2 }}
              initial={{ y:50, opacity:0 }}
              animate={inView ? { y:0, opacity:1 } : {}}
              transition={{ duration:0.65, delay:0.15, ease }}
            >
              {headingParts ? (
                <>
                  {headingParts.before}
                  <span className="relative inline-block" style={{ color:"var(--color-gold)" }}>
                    {headingParts.match}
                    <motion.span
                      className="absolute left-0 right-0 -bottom-1 block bg-gold"
                      style={{ height:3, borderRadius:2 }}
                      initial={{ scaleX:0, originX:0 }}
                      animate={inView ? { scaleX:1 } : {}}
                      transition={{ duration:0.55, delay:0.55, ease }}
                    />
                  </span>
                  {headingParts.after}
                </>
              ) : (
                proceso.heading
              )}
            </motion.h2>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_320px] gap-[48px] items-start">

          {/* Pasos */}
          <div className="flex flex-col gap-[0px]">
            {proceso.pasos.map((p, i) => (
              <motion.div
                key={`${p.num}-${i}`}
                className="flex gap-[20px] pb-[28px]"
                style={{ borderLeft: i < proceso.pasos.length - 1 ? "2px solid rgba(201,168,76,0.20)" : "2px solid transparent", marginLeft:20 }}
                initial={{ opacity:0, x:-24 }}
                whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true, amount:0.3 }}
                transition={{ duration:0.5, delay:0.07*i, ease }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width:40, height:40, background:"var(--color-gold)", marginLeft:-21, marginTop:2, fontFamily:"Poppins,sans-serif", fontSize:12, fontWeight:700, color:"var(--color-dark)" }}
                >
                  {p.num}
                </div>
                <div className="flex flex-col gap-[4px] pt-[8px]">
                  <span style={{ fontFamily:"Poppins,sans-serif", fontSize:15, fontWeight:700, color:"#FFFFFF", lineHeight:1.3 }}>{p.title}</span>
                  <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>{p.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Aliados + CTA */}
          <motion.div
            className="flex flex-col gap-[24px]"
            initial={{ opacity:0, x:32 }}
            animate={inView ? { opacity:1, x:0 } : {}}
            transition={{ duration:0.6, delay:0.3, ease }}
          >
            {proceso.aliados.items.length > 0 && (
              <div
                className="flex flex-col gap-[12px] rounded-[14px] p-[24px]"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
              >
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"var(--color-gold)", letterSpacing:2, textTransform:"uppercase" }}>
                  {proceso.aliados.titulo}
                </span>
                <div className="flex flex-col gap-[8px]">
                  {proceso.aliados.items.map((a, i) => (
                    <div key={i} className="flex items-center gap-[12px]">
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-[6px]"
                        style={{ width:36, height:36, background:"rgba(201,168,76,0.12)", fontFamily:"Poppins,sans-serif", fontSize:9, fontWeight:700, color:"var(--color-gold)", textAlign:"center", letterSpacing:0.3 }}
                      >
                        {a.short}
                      </div>
                      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(255,255,255,0.65)" }}>{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div
              className="flex flex-col gap-[14px] rounded-[14px] p-[24px]"
              style={{ background:"rgba(201,168,76,0.10)", border:"1.5px solid rgba(201,168,76,0.35)" }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color:"#FFFFFF", lineHeight:1.4 }}>
                {proceso.cta.titulo}
              </span>
              {proceso.cta.descripcion && (
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>
                  {proceso.cta.descripcion}
                </span>
              )}
              <Link
                href={proceso.cta.btnHref}
                className="inline-flex items-center justify-center rounded-[6px] px-[20px] py-[12px] font-bold text-[13px] bg-gold text-dark hover:bg-[#dbb95a] transition-colors"
                style={{ fontFamily:"Poppins,sans-serif" }}
              >
                {proceso.cta.btnText}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
