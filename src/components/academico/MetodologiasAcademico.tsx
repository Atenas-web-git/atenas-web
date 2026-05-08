"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaH } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { metodologias: ContenidoPlantillaH["metodologias"] };

export function MetodologiasAcademico({ metodologias }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const stripRef  = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once:true, amount:0.2 });
  const stripView = useInView(stripRef,  { once:true, amount:0.15 });

  const hl = metodologias.headingHighlight;
  const headingParts = hl && metodologias.heading.includes(hl) ? metodologias.heading.split(hl) : null;

  return (
    <section className="relative overflow-hidden bg-[#F8F5F0] min-h-[580px] md:min-h-[640px]">
      <div className="relative z-10 px-6 pt-[52px] pb-16 md:px-[120px] md:pt-[80px] md:pb-[100px]">

        <div ref={headerRef} className="mb-[36px] md:mb-[44px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            {metodologias.badge}
          </motion.p>
          <motion.span
            className="block bg-[#C9A84C]"
            style={{ width:40, height:2, marginTop:8, marginBottom:10 }}
            initial={{ scaleX:0, originX:0 }}
            animate={inView ? { scaleX:1 } : {}}
            transition={{ duration:0.4, delay:0.1, ease }}
          />
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(26px,2.78vw,40px)", fontWeight:700, color:"#1A2B4A", lineHeight:1.2 }}
              initial={{ y:50, opacity:0 }}
              animate={inView ? { y:0, opacity:1 } : {}}
              transition={{ duration:0.65, delay:0.15, ease }}
            >
              {headingParts ? (
                <>
                  {headingParts[0]}
                  <span className="relative inline-block">
                    {hl}
                    <motion.span
                      className="absolute left-0 -bottom-1 block bg-[#C9A84C]"
                      style={{ height:4, borderRadius:2 }}
                      initial={{ scaleX:0, originX:0 }}
                      animate={inView ? { scaleX:1 } : {}}
                      transition={{ duration:0.55, delay:0.55, ease }}
                    />
                  </span>
                  {headingParts.slice(1).join(hl)}
                </>
              ) : (
                metodologias.heading
              )}
            </motion.h2>
          </div>
        </div>

        {/* Strip */}
        {metodologias.strip.length > 0 && (
          <div ref={stripRef} className="hidden md:grid grid-cols-3 gap-[12px] mb-[44px]">
            {metodologias.strip.map((img, i) => (
              <motion.div
                key={`${img.caption}-${i}`}
                className="relative rounded-[10px] overflow-hidden"
                style={{ height: 180 }}
                initial={{ opacity:0, y: i%2===0 ? 20 : -20 }}
                animate={stripView ? { opacity:1, y:0 } : {}}
                transition={{ duration:0.6, delay:0.08*i, ease }}
                whileHover={{ scale:1.02, transition:{ duration:0.25 } }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.src} alt={img.caption} className="absolute inset-0 w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background:"linear-gradient(to top, rgba(26,43,74,0.70) 0%, transparent 55%)" }}
                />
                <span
                  className="absolute bottom-[12px] left-[14px]"
                  style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#FFFFFF", letterSpacing:0.4 }}
                >
                  {img.caption}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
          {metodologias.cards.map((m, i) => (
            <motion.div
              key={`${m.title}-${i}`}
              className="flex flex-col rounded-[12px] overflow-hidden cursor-default"
              style={{ background: m.dark ? "#1A2B4A" : "#FFFFFF", border: m.dark ? "none" : "1px solid rgba(26,43,74,0.06)" }}
              initial={{ opacity:0, y: i%2===0 ? -30 : 30 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.15 }}
              transition={{ duration:0.6, delay:0.08*i, ease }}
              whileHover={{ y:-6, boxShadow:"0 14px 40px rgba(0,0,0,0.12)", transition:{ duration:0.22 } }}
            >
              <div className="relative" style={{ height: 130 }}>
                {m.img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.img} alt={m.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                {m.dark && (
                  <div className="absolute inset-0" style={{ background:"rgba(26,43,74,0.35)" }} />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: m.dark
                    ? "linear-gradient(to bottom, transparent 30%, rgba(26,43,74,0.85) 100%)"
                    : "linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.70) 100%)"
                  }}
                />
              </div>

              <div className="flex flex-col gap-[10px] p-[18px]">
                <span style={{ fontSize:24, lineHeight:1 }}>{m.icon}</span>
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color:"rgba(201,168,76,0.85)", letterSpacing:0.5 }}>
                  {m.scope}
                </span>
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color: m.dark ? "#FFFFFF" : "#1A2B4A", lineHeight:1.3 }}>
                  {m.title}
                </span>
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color: m.dark ? "rgba(255,255,255,0.60)" : "rgba(13,24,37,0.60)", lineHeight:1.6 }}>
                  {m.desc}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
