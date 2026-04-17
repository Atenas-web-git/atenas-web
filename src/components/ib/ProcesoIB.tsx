"use client";

import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const pasos = [
  { num:"01", title:"Presentación de documentación",  desc:"Entrega de notas, certificados y formulario de postulación al Programa IB." },
  { num:"02", title:"Evaluación DECE",                 desc:"El Departamento de Consejería Estudiantil evalúa el perfil emocional y vocacional del estudiante." },
  { num:"03", title:"Evaluaciones académicas",         desc:"Prueba de razonamiento verbal y matemático para verificar el nivel requerido por el programa." },
  { num:"04", title:"Revisión del comité de admisión", desc:"El equipo IB del Atenas analiza el expediente completo y toma la decisión de admisión." },
  { num:"05", title:"Orientación al programa",         desc:"Sesión de inducción con el coordinador IB, familias y futuros estudiantes antes de iniciar." },
];

const aliados = [
  { name:"International Baccalaureate Organization", short:"IBO" },
  { name:"Pearson",                                   short:"Pearson" },
  { name:"Universidad San Francisco de Quito",        short:"USFQ" },
  { name:"EF Education",                              short:"EF" },
  { name:"SGS",                                       short:"SGS" },
];

export function ProcesoIB() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once:true, amount:0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0D1825]" style={{ minHeight:600 }}>

      {/* Parallax bg */}
      <motion.div className="absolute inset-0" style={{ y: bgY, willChange:"transform" }}>
        <Image
          src="https://atenas.edu.ec/wp-content/uploads/2023/03/FOTOGRAFIA-IB-1024x798.jpg"
          alt=""
          fill
          className="object-cover object-top"
          style={{ opacity:0.18 }}
          sizes="100vw"
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ background:"linear-gradient(135deg, rgba(13,24,37,0.97) 0%, rgba(13,24,37,0.65) 60%, rgba(13,24,37,0.95) 100%)" }}
      />

      <div className="relative z-10 px-6 py-[64px] md:px-[120px] md:py-[100px]">

        {/* Header */}
        <div ref={headerRef} className="mb-[52px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            Admisión al programa
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
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(26px,2.78vw,40px)", fontWeight:700, color:"#FFFFFF", lineHeight:1.2 }}
              initial={{ y:50, opacity:0 }}
              animate={inView ? { y:0, opacity:1 } : {}}
              transition={{ duration:0.65, delay:0.15, ease }}
            >
              Proceso de ingreso{" "}
              <span className="relative inline-block" style={{ color:"#C9A84C" }}>
                a 1ro IB.
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
        </div>

        {/* Pasos + aliados */}
        <div className="grid md:grid-cols-[1fr_320px] gap-[48px] items-start">

          {/* Pasos */}
          <div className="flex flex-col gap-[0px]">
            {pasos.map((p, i) => (
              <motion.div
                key={p.num}
                className="flex gap-[20px] pb-[28px]"
                style={{ borderLeft: i < pasos.length - 1 ? "2px solid rgba(201,168,76,0.20)" : "2px solid transparent", marginLeft:20 }}
                initial={{ opacity:0, x:-24 }}
                whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true, amount:0.3 }}
                transition={{ duration:0.5, delay:0.07*i, ease }}
              >
                {/* Dot */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-full"
                  style={{ width:40, height:40, background:"#C9A84C", marginLeft:-21, marginTop:2, fontFamily:"Poppins,sans-serif", fontSize:12, fontWeight:700, color:"#0D1825" }}
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
            {/* Aliados */}
            <div
              className="flex flex-col gap-[12px] rounded-[14px] p-[24px]"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#C9A84C", letterSpacing:2, textTransform:"uppercase" }}>
                Aliados del programa
              </span>
              <div className="flex flex-col gap-[8px]">
                {aliados.map((a) => (
                  <div key={a.short} className="flex items-center gap-[12px]">
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-[6px]"
                      style={{ width:36, height:36, background:"rgba(201,168,76,0.12)", fontFamily:"Poppins,sans-serif", fontSize:9, fontWeight:700, color:"#C9A84C", textAlign:"center", letterSpacing:0.3 }}
                    >
                      {a.short}
                    </div>
                    <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(255,255,255,0.65)" }}>{a.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="flex flex-col gap-[14px] rounded-[14px] p-[24px]"
              style={{ background:"rgba(201,168,76,0.10)", border:"1.5px solid rgba(201,168,76,0.35)" }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color:"#FFFFFF", lineHeight:1.4 }}>
                ¿Listo para dar el paso?
              </span>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(255,255,255,0.55)", lineHeight:1.6 }}>
                El proceso de admisión IB abre cada año. Agenda una visita para conocer el programa de cerca.
              </span>
              <Link
                href="/admisiones#visita"
                className="inline-flex items-center justify-center rounded-[6px] px-[20px] py-[12px] font-bold text-[13px] bg-[#C9A84C] text-[#0D1825] hover:bg-[#dbb95a] transition-colors"
                style={{ fontFamily:"Poppins,sans-serif" }}
              >
                Agendar visita al colegio
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
