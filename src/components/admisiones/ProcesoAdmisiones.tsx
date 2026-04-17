"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const pasos = [
  { num:"01", title:"Solicitud en línea",      desc:"Completa el formulario de pre-inscripción con los datos del estudiante y el nivel educativo deseado." },
  { num:"02", title:"Entrevista familiar",     desc:"Coordinamos una reunión con las autoridades del colegio para conocer a la familia y al estudiante." },
  { num:"03", title:"Evaluación diagnóstica",  desc:"El estudiante realiza una evaluación de diagnóstico acorde a su nivel. Es formativa, no eliminatoria." },
  { num:"04", title:"Revisión de documentos",  desc:"Entrega de libreta de calificaciones, copia de cédula y certificado de salud del año anterior." },
  { num:"05", title:"Matriculación",           desc:"Una vez aprobado el proceso, se coordina la firma del contrato y el pago de matrícula." },
];

/* Dirección por índice: 0,1 → izquierda | 2 → abajo | 3,4 → derecha */
function xFor(i: number) {
  if (i < 2)  return -64;
  if (i > 2)  return  64;
  return 0;
}
function yFor(i: number) {
  return i === 2 ? 32 : 0;
}

function StepCard({ num, title, desc, delay, index }: {
  num: string; title: string; desc: string; delay: number; index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className="flex-1 flex flex-col gap-[12px] rounded-[10px] p-[28px_20px] cursor-default"
      style={{ background:"#F8F5F0", border:"1px solid rgba(26,43,74,0.08)" }}
      initial={{ opacity:0, x:xFor(index), y:yFor(index) }}
      animate={inView ? { opacity:1, x:0, y:0 } : {}}
      transition={{ duration:0.6, delay, ease }}
      whileHover={{ y:-8, boxShadow:"0 20px 48px rgba(26,43,74,0.14)", transition:{ duration:0.25 } }}
    >
      <motion.span
        style={{ fontFamily:"Poppins,sans-serif", fontSize:36, fontWeight:700, color:"#C9A84C", lineHeight:1 }}
        whileHover={{ scale:1.06, transition:{ duration:0.2 } }}
      >
        {num}
      </motion.span>
      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:15, fontWeight:700, color:"#1A2B4A", lineHeight:1.3 }}>
        {title}
      </span>
      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:13, color:"rgba(13,24,37,0.65)", lineHeight:1.6 }}>
        {desc}
      </span>
    </motion.div>
  );
}

function MobileStep({ num, title, desc, delay, index }: {
  num: string; title: string; desc: string; delay: number; index: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const x = index % 2 === 0 ? -24 : 24;

  return (
    <motion.div
      ref={ref}
      className="flex gap-[16px] rounded-[10px] p-[16px]"
      style={{ background:"#F8F5F0", border:"1px solid rgba(26,43,74,0.08)" }}
      initial={{ opacity:0, x }}
      animate={inView ? { opacity:1, x:0 } : {}}
      transition={{ duration:0.5, delay, ease }}
    >
      <span style={{ fontFamily:"Poppins,sans-serif", fontSize:24, fontWeight:700, color:"#C9A84C", lineHeight:1, flexShrink:0, width:44, paddingTop:2 }}>
        {num}
      </span>
      <div className="flex flex-col gap-[4px]">
        <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, fontWeight:700, color:"#1A2B4A", lineHeight:1.3 }}>
          {title}
        </span>
        <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, color:"rgba(13,24,37,0.60)", lineHeight:1.55 }}>
          {desc}
        </span>
      </div>
    </motion.div>
  );
}

export function ProcesoAdmisiones() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once:true, amount:0.2 });

  return (
    <section id="proceso" className="relative overflow-hidden bg-white">
      {/* Franja decorativa navy en la parte superior */}
      <div className="absolute top-0 left-0 right-0 h-[6px] bg-[#1A2B4A]" />

      <div className="relative z-10 px-6 pt-[60px] pb-16 md:px-[120px] md:pt-[88px] md:pb-[100px]">

        {/* ─── Header — desktop: 2 columnas ─── */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-start md:gap-[80px]">

          {/* Texto */}
          <div className="flex-1 md:max-w-[520px]">
            <motion.p
              style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.45, ease }}
            >
              Cómo unirse
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
                El camino hacia{" "}
                <span className="relative inline-block">
                  el Atenas.
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
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(14px,1.04vw,15px)", color:"rgba(13,24,37,0.60)", lineHeight:1.65, maxWidth:440 }}
              initial={{ opacity:0, y:14 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.55, delay:0.3, ease }}
            >
              Un proceso claro, humano y transparente para que tu familia
              se incorpore a la comunidad Atenas con total confianza.
            </motion.p>
          </div>

          {/* Composición fotográfica — solo desktop */}
          <div className="hidden md:block relative flex-shrink-0" style={{ width:400, height:340 }}>
            {/* Foto principal */}
            <motion.div
              className="absolute rounded-[14px] overflow-hidden"
              style={{ width:290, height:340, left:60, top:0, rotate:2, boxShadow:"0 20px 56px rgba(0,0,0,0.18)" }}
              initial={{ opacity:0, y:30 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.85, delay:0.35, ease }}
            >
              <Image
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"
                alt="Estudiante Atenas"
                fill className="object-cover" sizes="290px"
              />
            </motion.div>
            {/* Foto superpuesta */}
            <motion.div
              className="absolute rounded-[12px] overflow-hidden z-10"
              style={{ width:190, height:220, left:0, top:60, rotate:-5, boxShadow:"0 14px 40px rgba(0,0,0,0.22)" }}
              initial={{ opacity:0, y:-20 }}
              animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.75, delay:0.55, ease }}
            >
              <Image
                src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600&q=80"
                alt="Aula Atenas"
                fill className="object-cover" sizes="190px"
              />
              <div className="absolute inset-0 border-[3px] border-[#C9A84C]/50 rounded-[12px]" />
            </motion.div>
            {/* Badge flotante */}
            <motion.div
              className="absolute z-20 rounded-[8px] px-3 py-2"
              style={{ background:"#1A2B4A", right:0, bottom:20, boxShadow:"0 8px 24px rgba(0,0,0,0.25)" }}
              initial={{ opacity:0, scale:0.75 }}
              animate={inView ? { opacity:1, scale:1 } : {}}
              transition={{ duration:0.45, delay:0.72, ease }}
            >
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#C9A84C", letterSpacing:1 }}>
                CUPOS LIMITADOS 2026
              </span>
            </motion.div>
          </div>
        </div>

        {/* ─── Cards — desktop ─── */}
        <div className="hidden md:flex gap-[20px] mt-[56px]">
          {pasos.map((p, i) => (
            <StepCard key={p.num} {...p} index={i} delay={0.06 + i * 0.09} />
          ))}
        </div>

        {/* ─── Cards — mobile ─── */}
        <div className="md:hidden flex flex-col gap-[10px] mt-[28px]">
          {pasos.map((p, i) => (
            <MobileStep key={p.num} {...p} index={i} delay={0.04 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
