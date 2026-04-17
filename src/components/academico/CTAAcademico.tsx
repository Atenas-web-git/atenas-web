"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function CTAAcademico() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(contentRef, { once: true, amount: 0.2 });

  /* Parallax: la imagen se desplaza -15% → +15% mientras la sección cruza el viewport */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0D1825]" style={{ minHeight: 520 }}>

      {/* Fondo parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: bgY, willChange: "transform" }}
      >
        <Image
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1440&q=80"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.28 }}
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay gradiente */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(13,24,37,0.95) 0%, rgba(13,24,37,0.60) 55%, rgba(13,24,37,0.90) 100%)" }}
      />

      {/* Ghost IB */}
      <div className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden" style={{ top: 20 }}>
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:220, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, marginLeft:-10, whiteSpace:"nowrap" }}>
          IB DIPLOMA
        </span>
      </div>

      {/* Contenido */}
      <div
        ref={contentRef}
        className="relative z-10 px-6 py-[64px] md:px-[120px] md:py-[100px] flex flex-col md:flex-row items-start gap-[48px]"
      >
        {/* Texto izquierdo */}
        <div className="flex-1 flex flex-col gap-[20px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            El diferenciador Atenas
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
              Bachillerato{" "}
              <span className="relative inline-block" style={{ color:"#C9A84C" }}>
                Internacional IB.
                <motion.span
                  className="absolute left-0 -bottom-1 block bg-[#C9A84C]"
                  style={{ height:3, borderRadius:2 }}
                  initial={{ scaleX:0, originX:0 }}
                  animate={inView ? { scaleX:1 } : {}}
                  transition={{ duration:0.55, delay:0.55, ease }}
                />
              </span>
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(14px,1.15vw,16px)", color:"rgba(255,255,255,0.62)", lineHeight:1.7, maxWidth:520 }}
            initial={{ opacity:0, y:16 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.6, delay:0.3, ease }}
          >
            El único colegio en Ambato con el Programa del Diploma IB acreditado.
            Desarrolla pensamiento crítico, investigación independiente y ciudadanía global
            para acceder a universidades de todo el mundo.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-[10px]"
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.5, delay:0.42, ease }}
          >
            {["CAS", "Monografía", "Teoría del Conocimiento", "Reconocido mundialmente"].map((tag) => (
              <span
                key={tag}
                className="rounded-full px-[12px] py-[5px] text-[10px] font-bold"
                style={{ fontFamily:"Poppins,sans-serif", background:"rgba(201,168,76,0.14)", color:"#C9A84C", letterSpacing:0.4 }}
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.5, delay:0.55, ease }}
          >
            <Link
              href="/academico/ib"
              className="inline-flex items-center gap-[10px] rounded-[6px] px-[28px] py-[14px] font-bold text-[14px] bg-[#C9A84C] text-[#0D1825] hover:bg-[#dbb95a] transition-colors"
              style={{ fontFamily:"Poppins,sans-serif" }}
            >
              Conocer el Programa IB
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
          {[
            { value:"ÚNICO",  label:"Programa IB en Ambato",            sub:"Desde 2018 acreditado por IBO" },
            { value:"4.000",  label:"Palabras — Extended Essay",         sub:"Investigación independiente" },
            { value:"150+",   label:"Universidades que reconocen el IB", sub:"Acceso global garantizado" },
          ].map((stat, i) => (
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

          {/* Mini foto en el card */}
          <div className="relative" style={{ height: 120 }}>
            <Image
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80"
              alt="Universidad IB"
              fill
              className="object-cover"
              sizes="320px"
            />
            <div
              className="absolute inset-0"
              style={{ background:"linear-gradient(to bottom, rgba(13,24,37,0.50) 0%, transparent 60%)" }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
