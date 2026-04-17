"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const niveles = [
  {
    num: "01",
    title: "Educación Inicial",
    grades: "Pre-Kinder y Kinder",
    age: "3-5 años",
    color: "#C9A84C",
    highlight: false,
    methods: ["Montessori", "Reggio Emilia", "ABN"],
    desc: "Metodología basada en Montessori, Reggio Emilia y ABN que desarrolla autonomía, concentración y respeto desde los primeros años. Inglés lúdico con inmersión natural: una hora diaria integrada al entorno.",
  },
  {
    num: "02",
    title: "Básica Elemental y Media",
    grades: "1ro a 7mo EGB",
    age: "5-12 años",
    color: "#1A2B4A",
    highlight: false,
    methods: ["CLIL", "PBL", "Mangahigh", "ALEKS"],
    desc: "Inglés integrado con metodología CLIL desde 1ro EGB. Aprendizaje basado en proyectos (PBL) y plataformas líderes: Mangahigh (2do–5to) y ALEKS (6to–7mo) para matemáticas adaptativas. ABN hasta 4to EGB.",
  },
  {
    num: "03",
    title: "Básica Superior",
    grades: "8vo a 10mo EGB",
    age: "12-14 años",
    color: "#C9A84C",
    highlight: false,
    methods: ["Orientación vocacional", "Inglés avanzado"],
    desc: "Etapa de consolidación y transición hacia el bachillerato. Fortalecimiento en todas las áreas, orientación vocacional y preparación para la siguiente etapa educativa.",
    note: "Contenido pedagógico completo próximamente — en coordinación con el equipo Atenas.",
  },
  {
    num: "04",
    title: "Bachillerato General",
    grades: "1ro a 3ro BGU",
    age: "15-17 años",
    color: "#1A2B4A",
    highlight: false,
    methods: ["Tronco Común", "MINEDUC"],
    desc: "Programa del Ministerio de Educación orientado a la formación integral. Asignaturas del Tronco Común que preparan a los estudiantes para la educación superior, el emprendimiento o la inserción laboral.",
  },
  {
    num: "IB★",
    title: "Bachillerato Internacional",
    grades: "Diploma IB (PD)",
    age: "1ro a 3ro · 16-18 años",
    color: "#C9A84C",
    highlight: true,
    methods: ["CAS", "Monografía", "TdC"],
    desc: "El Programa del Diploma IB desarrolla habilidades de pensamiento crítico, investigación y comunicación para universidades del mundo. Componentes del núcleo: CAS (Creatividad, Actividad y Servicio), Monografía de 4.000 palabras, y Teoría del Conocimiento.",
    badge: "ÚNICO IB EN AMBATO",
  },
];

const headerPhotos = [
  {
    src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    w: 240, h: 300, style: { left: 30, bottom: 0, rotate: -3 },
    initial: { opacity: 0, y: 40 }, delay: 0.3,
  },
  {
    src: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&q=80",
    w: 190, h: 220, style: { right: 0, top: 0, rotate: 4 },
    initial: { opacity: 0, x: 30 }, delay: 0.5,
  },
  {
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80",
    w: 145, h: 165, style: { left: 0, top: 40, rotate: -5 },
    initial: { opacity: 0, x: -20 }, delay: 0.7,
  },
];

function xFor(i: number) {
  if (i < 2) return -60;
  if (i > 2) return 60;
  return 0;
}

function NivelCard({ num, title, grades, age, highlight, methods, desc, badge, note, delay, index }: {
  num: string; title: string; grades: string; age: string; highlight: boolean;
  methods: string[]; desc: string; badge?: string; note?: string; delay: number; index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, amount:0.12 });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="flex-1 flex flex-col gap-[12px] rounded-[12px] p-[28px_20px] min-w-0 cursor-default"
      style={{
        background: highlight
          ? (hov ? "rgba(26,43,74,0.96)" : "#1A2B4A")
          : (hov ? "#F0EDE6" : "#F8F5F0"),
        border: highlight ? "1.5px solid rgba(201,168,76,0.50)" : "1px solid rgba(26,43,74,0.06)",
        boxShadow: hov ? "0 16px 48px rgba(0,0,0,0.14)" : "none",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
      }}
      initial={{ opacity:0, x:xFor(index), y: index===2 ? 28 : 0 }}
      animate={inView ? { opacity:1, x:0, y:0 } : {}}
      transition={{ duration:0.65, delay, ease }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={()   => setHov(false)}
      whileHover={{ y:-8, transition:{ duration:0.25 } }}
    >
      <motion.span
        style={{ fontFamily:"Poppins,sans-serif", fontSize:highlight ? 26 : 30, fontWeight:700, color:"#C9A84C", lineHeight:1 }}
        animate={{ scale: hov ? 1.05 : 1 }}
        transition={{ duration:0.2 }}
      >
        {num}
      </motion.span>

      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color: highlight ? "#FFFFFF" : "#1A2B4A", lineHeight:1.3 }}>
        {title}
      </span>

      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color: highlight ? "rgba(255,255,255,0.50)" : "rgba(13,24,37,0.50)", lineHeight:1.45 }}>
        {grades}<br />{age}
      </span>

      <motion.span
        className="block bg-[#C9A84C]"
        style={{ width:32, height:2, borderRadius:1 }}
        initial={{ scaleX:0, originX:0 }}
        animate={inView ? { scaleX:1 } : {}}
        transition={{ duration:0.4, delay: delay+0.25, ease }}
      />

      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color: highlight ? "rgba(255,255,255,0.65)" : "rgba(13,24,37,0.62)", lineHeight:1.6 }}>
        {desc}
      </span>

      {note && (
        <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, color: "rgba(201,168,76,0.70)", lineHeight:1.5, fontStyle:"italic" }}>
          ⚠ {note}
        </span>
      )}

      <div className="flex flex-wrap gap-[6px] mt-[4px]">
        {methods.map((m) => (
          <span
            key={m}
            className="rounded-full px-[10px] py-[4px] text-[9px] font-bold"
            style={{
              background: highlight ? "rgba(201,168,76,0.18)" : "rgba(26,43,74,0.08)",
              color:      highlight ? "#C9A84C" : "#1A2B4A",
              letterSpacing: 0.5,
              fontFamily:"Poppins,sans-serif",
            }}
          >
            {m}
          </span>
        ))}
      </div>

      {badge && (
        <span
          className="inline-block rounded-[5px] px-[10px] py-[5px] text-[9px] font-bold mt-[4px] self-start"
          style={{ background:"#C9A84C", color:"#0D1825", letterSpacing:1.2, fontFamily:"Poppins,sans-serif" }}
        >
          {badge}
        </span>
      )}
    </motion.div>
  );
}

export function NivelesDetalle() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once:true, amount:0.2 });

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#1A2B4A]" />

      <div className="relative z-10 px-6 pt-[60px] pb-16 md:px-[120px] md:pt-[80px] md:pb-[100px]">

        {/* Header — 2 columnas desktop */}
        <div className="grid md:grid-cols-[1fr_360px] gap-[48px] items-start mb-[48px] md:mb-[56px]">

          {/* Texto */}
          <div ref={headerRef}>
            <motion.p
              style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.45, ease }}
            >
              Formación por nivel
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
                style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(28px,3.06vw,44px)", fontWeight:700, color:"#1A2B4A", lineHeight:1.15 }}
                initial={{ y:50, opacity:0 }}
                animate={inView ? { y:0, opacity:1 } : {}}
                transition={{ duration:0.65, delay:0.15, ease }}
              >
                Cinco niveles,{" "}
                <span className="relative inline-block">
                  un mismo compromiso.
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
            <motion.p
              style={{ fontFamily:"Poppins,sans-serif", fontSize:14, color:"rgba(13,24,37,0.60)", lineHeight:1.7, maxWidth:480, marginTop:14 }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.55, delay:0.35, ease }}
            >
              Cada etapa educativa está diseñada con metodologías de clase mundial,
              acompañamiento docente personalizado y herramientas digitales de vanguardia.
            </motion.p>
          </div>

          {/* Collage fotográfico — solo desktop */}
          <div className="hidden md:block relative" style={{ height: 320 }}>
            {headerPhotos.map((img, i) => (
              <motion.div
                key={i}
                className="absolute rounded-[12px] overflow-hidden"
                style={{
                  width: img.w,
                  height: img.h,
                  ...img.style,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.20)",
                }}
                initial={img.initial as never}
                animate={inView ? { opacity:1, x:0, y:0 } : {}}
                transition={{ duration:0.75, delay:img.delay, ease }}
              >
                <Image src={img.src} alt="" fill className="object-cover" sizes="280px" />
              </motion.div>
            ))}

            {/* Badge nivel IB */}
            <motion.div
              className="absolute z-20 flex items-center gap-[6px] rounded-[8px] px-[12px] py-[8px]"
              style={{ background:"#C9A84C", right:10, bottom:10, boxShadow:"0 6px 20px rgba(0,0,0,0.25)" }}
              initial={{ opacity:0, scale:0.7 }}
              animate={inView ? { opacity:1, scale:1 } : {}}
              transition={{ duration:0.4, delay:0.9, ease }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#0D1825", letterSpacing:0.8 }}>
                IB ACREDITADO ★
              </span>
            </motion.div>
          </div>
        </div>

        {/* Desktop: 5 cards en fila */}
        <div className="hidden md:flex gap-[16px]">
          {niveles.map((n, i) => (
            <NivelCard key={n.num} {...n} index={i} delay={0.06 + i*0.09} />
          ))}
        </div>

        {/* Mobile: cards apiladas */}
        <div className="md:hidden flex flex-col gap-[12px]">
          {niveles.map((n, i) => (
            <motion.div
              key={n.num}
              className="flex flex-col gap-[10px] rounded-[12px] p-[20px]"
              style={{
                background: n.highlight ? "#1A2B4A" : "#F8F5F0",
                border: n.highlight ? "1.5px solid rgba(201,168,76,0.50)" : "1px solid rgba(26,43,74,0.06)",
              }}
              initial={{ opacity:0, x: i%2===0 ? -24 : 24 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, amount:0.15 }}
              transition={{ duration:0.5, delay:0.05*i, ease }}
            >
              <div className="flex items-start gap-[16px]">
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:24, fontWeight:700, color:"#C9A84C", lineHeight:1, flexShrink:0, width:52 }}>
                  {n.num}
                </span>
                <div className="flex flex-col gap-[3px]">
                  <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color: n.highlight ? "#FFFFFF" : "#1A2B4A", lineHeight:1.3 }}>
                    {n.title}
                  </span>
                  <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color: n.highlight ? "rgba(255,255,255,0.50)" : "rgba(13,24,37,0.50)" }}>
                    {n.grades} · {n.age}
                  </span>
                </div>
              </div>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color: n.highlight ? "rgba(255,255,255,0.65)" : "rgba(13,24,37,0.62)", lineHeight:1.6 }}>
                {n.desc}
              </span>
              <div className="flex flex-wrap gap-[6px]">
                {n.methods.map((m) => (
                  <span
                    key={m}
                    className="rounded-full px-[8px] py-[3px] text-[9px] font-bold"
                    style={{ fontFamily:"Poppins,sans-serif", background: n.highlight ? "rgba(201,168,76,0.18)" : "rgba(26,43,74,0.08)", color: n.highlight ? "#C9A84C" : "#1A2B4A" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
              {n.badge && (
                <span className="self-start rounded-[5px] px-[10px] py-[5px] text-[9px] font-bold" style={{ background:"#C9A84C", color:"#0D1825", letterSpacing:1.2, fontFamily:"Poppins,sans-serif" }}>
                  {n.badge}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
