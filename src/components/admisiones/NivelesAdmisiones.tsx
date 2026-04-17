"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const niveles = [
  { num:"01", title:"Inicial",                    grades:"Pre-Kinder y Kinder", age:"3-5 años",   highlight:false },
  { num:"02", title:"Básica Elemental",            grades:"1ro a 4to EGB",       age:"5-9 años",   highlight:false },
  { num:"03", title:"Básica Media-Superior",       grades:"5to a 10mo EGB",      age:"10-14 años", highlight:false },
  { num:"04", title:"Bachillerato General",        grades:"1ro a 3ro BGU",       age:"15-17 años", highlight:false },
  { num:"IB★", title:"Bachillerato Internacional", grades:"Diploma IB",          age:"1ro a 3ro",  highlight:true  },
];

function xForD(i: number) {
  if (i < 2)  return -56;
  if (i > 2)  return  56;
  return 0;
}

function LevelCard({ num, title, grades, age, highlight, delay, index }: {
  num:string; title:string; grades:string; age:string; highlight:boolean; delay:number; index:number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, amount:0.15 });
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      ref={ref}
      className="flex-1 flex flex-col gap-[10px] rounded-[10px] p-[24px_20px] cursor-default min-w-0"
      style={{
        background: hov
          ? (highlight ? "rgba(201,168,76,0.22)" : "rgba(255,255,255,0.10)")
          : (highlight ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)"),
        border: highlight ? "1px solid rgba(201,168,76,0.35)" : "1px solid transparent",
        boxShadow: hov ? "0 12px 40px rgba(0,0,0,0.35)" : "none",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
      }}
      initial={{ opacity:0, x:xForD(index), y: index===2 ? 32 : 0 }}
      animate={inView ? { opacity:1, x:0, y:0 } : {}}
      transition={{ duration:0.62, delay, ease }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={()   => setHov(false)}
      whileHover={{ y:-8, transition:{ duration:0.25 } }}
    >
      <motion.span
        style={{ fontFamily:"Poppins,sans-serif", fontSize:highlight ? 24 : 30, fontWeight:700, color:"#C9A84C", lineHeight:1 }}
        animate={{ scale: hov ? 1.06 : 1 }}
        transition={{ duration:0.2 }}
      >
        {num}
      </motion.span>
      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight: highlight ? 700 : 600, color:"#FFFFFF", lineHeight:1.3 }}>
        {title}
      </span>
      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)", lineHeight:1.55 }}>
        {grades}<br />{age}
      </span>
    </motion.div>
  );
}

export function NivelesAdmisiones() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once:true, amount:0.2 });

  const { scrollYProgress } = useScroll({ target:sectionRef, offset:["start end","end start"] });
  const bgY = useTransform(scrollYProgress, [0,1], ["-8%","8%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1A2B4A] min-h-[700px] md:min-h-[760px]"
    >
      {/* Parallax overlay */}
      <motion.div className="absolute inset-0" style={{ y: bgY,
        background:"linear-gradient(135deg, rgba(26,43,74,0.96) 0%, rgba(10,20,40,0.92) 100%)" }}
      />

      {/* Ghost IB — desktop */}
      <div
        className="absolute pointer-events-none select-none hidden md:block overflow-hidden"
        style={{ right:0, top:60 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:480, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, whiteSpace:"nowrap" }}>
          IB
        </span>
      </div>

      {/* ─── Contenido ─── */}
      <div className="relative z-10 px-6 pt-[52px] pb-16 md:px-[120px] md:pt-[80px] md:pb-[100px]">

        {/* Header: 2 columnas en desktop */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-start md:gap-[60px]">

          {/* Texto — izquierda */}
          <div className="flex-1 md:max-w-[560px]">
            <motion.p
              style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.45, ease }}
            >
              Niveles Educativos
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
                style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(28px,3.06vw,44px)", fontWeight:700, color:"#FFFFFF", lineHeight:1.15 }}
                initial={{ y:50, opacity:0 }}
                animate={inView ? { y:0, opacity:1 } : {}}
                transition={{ duration:0.65, delay:0.15, ease }}
              >
                Elige el nivel{" "}
                <span className="relative inline-block">
                  correcto.
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
              className="mt-[14px]"
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(14px,1.04vw,15px)", color:"rgba(255,255,255,0.55)", lineHeight:1.65, maxWidth:460 }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.55, delay:0.3, ease }}
            >
              Desde los primeros pasos en Inicial hasta el Diploma Internacional IB,
              acompañamos a cada estudiante en cada etapa de su formación.
            </motion.p>
          </div>

          {/* Composición de imágenes — derecha (solo desktop) */}
          <div className="hidden md:block relative flex-shrink-0" style={{ width:380, height:280 }}>
            <motion.div
              className="absolute rounded-[14px] overflow-hidden"
              style={{ width:260, height:280, left:60, top:0, rotate:3, boxShadow:"0 20px 56px rgba(0,0,0,0.45)" }}
              initial={{ opacity:0, y:24 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.85, delay:0.35, ease }}
            >
              <Image
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80"
                alt="Graduación Atenas" fill className="object-cover" sizes="260px"
              />
              <div className="absolute inset-0" style={{ background:"rgba(26,43,74,0.20)" }} />
            </motion.div>
            <motion.div
              className="absolute rounded-[12px] overflow-hidden z-10"
              style={{ width:190, height:210, left:0, top:40, rotate:-5, boxShadow:"0 14px 40px rgba(0,0,0,0.45)" }}
              initial={{ opacity:0, x:-20 }}
              animate={inView ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.75, delay:0.55, ease }}
            >
              <Image
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80"
                alt="Aula Atenas" fill className="object-cover" sizes="190px"
              />
              <div className="absolute inset-0 border-[3px] border-[#C9A84C]/45 rounded-[12px]" />
            </motion.div>
            <motion.div
              className="absolute z-20 rounded-[8px] px-3 py-2"
              style={{ background:"#C9A84C", right:0, bottom:10, boxShadow:"0 8px 24px rgba(0,0,0,0.30)" }}
              initial={{ opacity:0, scale:0.75 }}
              animate={inView ? { opacity:1, scale:1 } : {}}
              transition={{ duration:0.45, delay:0.72, ease }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#0D1825", letterSpacing:1 }}>
                BACHILLERATO IB · AMBATO
              </span>
            </motion.div>
          </div>
        </div>

        {/* ─── Cards desktop — ancho completo ─── */}
        <div className="hidden md:flex gap-[16px] mt-[52px]">
          {niveles.map((n, i) => (
            <LevelCard key={n.num} {...n} index={i} delay={0.06 + i * 0.09} />
          ))}
        </div>

        {/* ─── Cards mobile ─── */}
        <div className="md:hidden flex flex-col gap-[10px] mt-[28px]">
          {niveles.map((n, i) => (
            <motion.div
              key={n.num}
              className="flex gap-[16px] rounded-[10px] p-[16px]"
              style={{
                background: n.highlight ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)",
                border:     n.highlight ? "1px solid rgba(201,168,76,0.35)" : "none",
              }}
              initial={{ opacity:0, x: i%2===0 ? -24 : 24 }}
              whileInView={{ opacity:1, x:0 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ duration:0.5, delay:0.05*i, ease }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:n.highlight ? 18 : 22, fontWeight:700, color:"#C9A84C", lineHeight:1, flexShrink:0, width:52, paddingTop:2 }}>
                {n.num}
              </span>
              <div className="flex flex-col gap-[3px]">
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight: n.highlight ? 700 : 600, color:"#FFFFFF", lineHeight:1.3 }}>
                  {n.title}
                </span>
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color:"rgba(255,255,255,0.55)", lineHeight:1.5 }}>
                  {n.grades} · {n.age}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
