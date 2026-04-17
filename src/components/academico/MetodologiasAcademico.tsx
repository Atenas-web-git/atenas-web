"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const mets = [
  {
    icon: "🌿",
    img: "https://images.unsplash.com/photo-1587691592099-24045742c181?w=500&q=80",
    title: "Montessori & Reggio",
    scope: "Educación Inicial",
    desc: "Autonomía, concentración y respeto por los demás. Ambientes preparados para el aprendizaje activo desde los 3 años.",
    dark: false,
  },
  {
    icon: "🌐",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80",
    title: "CLIL & PBL",
    scope: "Básica Elemental y Media",
    desc: "Inglés integrado al currículo con inmersión lingüística. Proyectos reales que dan contexto y propósito al aprendizaje.",
    dark: false,
  },
  {
    icon: "📐",
    img: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&q=80",
    title: "ABN · Mangahigh · ALEKS",
    scope: "Básica — Plataformas digitales",
    desc: "Matemáticas con plataformas líderes mundiales. Del razonamiento numérico al dominio adaptativo en todos los niveles.",
    dark: false,
  },
  {
    icon: "🎓",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&q=80",
    title: "IB Diploma Program",
    scope: "Bachillerato Internacional",
    desc: "CAS, Monografía y Teoría del Conocimiento. El programa más exigente y reconocido en universidades del mundo.",
    dark: true,
  },
];

const strip = [
  { src: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=700&q=80", cap: "Aprendizaje colaborativo" },
  { src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=700&q=80", cap: "Ciencia y tecnología" },
  { src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80", cap: "Investigación IB" },
];

export function MetodologiasAcademico() {
  const headerRef = useRef<HTMLDivElement>(null);
  const stripRef  = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once:true, amount:0.2 });
  const stripView = useInView(stripRef,  { once:true, amount:0.15 });

  return (
    <section className="relative overflow-hidden bg-[#F8F5F0] min-h-[580px] md:min-h-[640px]">
      <div className="relative z-10 px-6 pt-[52px] pb-16 md:px-[120px] md:pt-[80px] md:pb-[100px]">

        {/* Header */}
        <div ref={headerRef} className="mb-[36px] md:mb-[44px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            Diferenciadores pedagógicos
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
              Metodologías que{" "}
              <span className="relative inline-block">
                marcan la diferencia.
                <motion.span
                  className="absolute left-0 -bottom-1 block bg-[#C9A84C]"
                  style={{ height:4, borderRadius:2 }}
                  initial={{ scaleX:0, originX:0 }}
                  animate={inView ? { scaleX:1 } : {}}
                  transition={{ duration:0.55, delay:0.55, ease }}
                />
              </span>
            </motion.h2>
          </div>
        </div>

        {/* Strip de imágenes — desktop */}
        <div ref={stripRef} className="hidden md:grid grid-cols-3 gap-[12px] mb-[44px]">
          {strip.map((img, i) => (
            <motion.div
              key={img.cap}
              className="relative rounded-[10px] overflow-hidden"
              style={{ height: 180 }}
              initial={{ opacity:0, y: i%2===0 ? 20 : -20 }}
              animate={stripView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.6, delay:0.08*i, ease }}
              whileHover={{ scale:1.02, transition:{ duration:0.25 } }}
            >
              <Image src={img.src} alt={img.cap} fill className="object-cover" sizes="420px" />
              <div
                className="absolute inset-0"
                style={{ background:"linear-gradient(to top, rgba(26,43,74,0.70) 0%, transparent 55%)" }}
              />
              <span
                className="absolute bottom-[12px] left-[14px]"
                style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#FFFFFF", letterSpacing:0.4 }}
              >
                {img.cap}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Cards — desktop 4 en fila, mobile 2 columnas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
          {mets.map((m, i) => (
            <motion.div
              key={m.title}
              className="flex flex-col rounded-[12px] overflow-hidden cursor-default"
              style={{ background: m.dark ? "#1A2B4A" : "#FFFFFF", border: m.dark ? "none" : "1px solid rgba(26,43,74,0.06)" }}
              initial={{ opacity:0, y: i%2===0 ? -30 : 30 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.15 }}
              transition={{ duration:0.6, delay:0.08*i, ease }}
              whileHover={{ y:-6, boxShadow:"0 14px 40px rgba(0,0,0,0.12)", transition:{ duration:0.22 } }}
            >
              {/* Foto top */}
              <div className="relative" style={{ height: 130 }}>
                <Image src={m.img} alt={m.title} fill className="object-cover" sizes="380px" />
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

              {/* Contenido */}
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
