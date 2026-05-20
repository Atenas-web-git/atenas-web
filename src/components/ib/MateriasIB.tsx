"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaG } from "@/app/admin/(authenticated)/contenido/plantillas";
import { splitHighlight } from "@/lib/cms/highlight";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { materias: ContenidoPlantillaG["materias"] };

export function MateriasIB({ materias }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once:true, amount:0.2 });

  const headingParts = splitHighlight(materias.heading, materias.headingHighlight);

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="relative z-10 px-6 py-[64px] md:px-[120px] md:py-[100px]">

        <div ref={headerRef} className="mb-[48px] md:mb-[56px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"var(--color-gold)", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            {materias.badge}
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
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(26px,2.78vw,40px)", fontWeight:700, color:"var(--color-navy)", lineHeight:1.2 }}
              initial={{ y:50, opacity:0 }}
              animate={inView ? { y:0, opacity:1 } : {}}
              transition={{ duration:0.65, delay:0.15, ease }}
            >
              {headingParts ? (
                <>
                  {headingParts.before}
                  <span className="relative inline-block">
                    {headingParts.match}
                    <motion.span
                      className="absolute left-0 right-0 -bottom-1 block bg-gold"
                      style={{ height:4, borderRadius:2 }}
                      initial={{ scaleX:0, originX:0 }}
                      animate={inView ? { scaleX:1 } : {}}
                      transition={{ duration:0.55, delay:0.55, ease }}
                    />
                  </span>
                  {headingParts.after}
                </>
              ) : (
                materias.heading
              )}
            </motion.h2>
          </div>
          {materias.descripcion && (
            <motion.p
              style={{ fontFamily:"Poppins,sans-serif", fontSize:14, color:"rgba(13,24,37,0.58)", lineHeight:1.7, maxWidth:600, marginTop:14 }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.55, delay:0.35, ease }}
            >
              {materias.descripcion}
            </motion.p>
          )}
        </div>

        {/* Grid de grupos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {materias.grupos.map((g, i) => {
            const isGold = g.color === "gold";
            const isNavy = g.color === "navy";
            return (
              <motion.div
                key={`${g.num}-${i}`}
                className="flex flex-col gap-[10px] rounded-[12px] p-[24px_20px] cursor-default"
                style={{
                  background: isGold ? "var(--color-gold)" : isNavy ? "var(--color-navy)" : "#FFFFFF",
                  border: isGold || isNavy ? "none" : "1px solid rgba(26,43,74,0.07)",
                }}
                initial={{ opacity:0, y: i < 3 ? -24 : 24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, amount:0.15 }}
                transition={{ duration:0.55, delay:0.07*i, ease }}
                whileHover={{ y:-5, boxShadow:"0 12px 36px rgba(0,0,0,0.12)", transition:{ duration:0.22 } }}
              >
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:26, fontWeight:700, lineHeight:1, color: isGold ? "var(--color-dark)" : "var(--color-gold)" }}>
                  {g.num}
                </span>
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:15, fontWeight:700, lineHeight:1.3, color: isGold ? "var(--color-dark)" : isNavy ? "#FFFFFF" : "var(--color-navy)" }}>
                  {g.title}
                </span>
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, lineHeight:1.55, color: isGold ? "rgba(13,24,37,0.65)" : isNavy ? "rgba(255,255,255,0.55)" : "rgba(13,24,37,0.55)" }}>
                  {g.detail}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Nota HL/SL */}
        {materias.nota && (
          <motion.div
            className="mt-[28px] rounded-[10px] px-[20px] py-[14px] flex items-start gap-[12px]"
            style={{ background:"rgba(201,168,76,0.10)", border:"1px solid rgba(201,168,76,0.28)" }}
            initial={{ opacity:0, y:14 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:0.5 }}
            transition={{ duration:0.5, ease }}
          >
            <span style={{ fontSize:16, flexShrink:0, marginTop:2 }}>ℹ️</span>
            <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(13,24,37,0.70)", lineHeight:1.6 }}>
              {materias.nota}
            </span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
