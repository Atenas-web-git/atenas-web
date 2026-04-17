"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const componentes = [
  {
    icon: "🎨",
    title: "CAS",
    sub: "Creatividad, Actividad y Servicio",
    desc: "Desarrolla creatividad, actividad física y compromiso con el servicio comunitario. 150 horas de experiencias fuera del aula que forman el carácter, el liderazgo y la responsabilidad social.",
    highlight: false,
  },
  {
    icon: "📝",
    title: "Monografía",
    sub: "Extended Essay — 4.000 palabras",
    desc: "Trabajo de investigación independiente de 4.000 palabras sobre un tema de elección del estudiante. Desarrolla pensamiento crítico, análisis profundo y escritura académica de nivel universitario.",
    highlight: false,
  },
  {
    icon: "🌍",
    title: "Teoría del Conocimiento",
    sub: "Theory of Knowledge (TdC)",
    desc: "Asignatura que cuestiona cómo sabemos lo que sabemos. Debate filosófico, ensayo argumentativo y análisis de las formas de conocimiento que desarrollan el pensamiento reflexivo.",
    highlight: true,
  },
];

export function NucleoIB() {
  const headerRef = useRef<HTMLDivElement>(null);
  const imgRef    = useRef<HTMLDivElement>(null);
  const inView    = useInView(headerRef, { once: true, amount: 0.2 });
  const imgView   = useInView(imgRef,    { once: true, amount: 0.2 });

  return (
    <section className="relative overflow-hidden bg-[#1A2B4A]">
      <div className="relative z-10 px-6 py-[64px] md:px-[120px] md:py-[100px]">

        {/* Header */}
        <div ref={headerRef} className="mb-[52px] md:mb-[64px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.45, ease }}
          >
            El núcleo del Diploma
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
              Tres componentes que{" "}
              <span className="relative inline-block" style={{ color:"#C9A84C" }}>
                definen a un graduado IB.
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
            style={{ fontFamily:"Poppins,sans-serif", fontSize:15, color:"rgba(255,255,255,0.55)", lineHeight:1.7, maxWidth:620, marginTop:14 }}
            initial={{ opacity:0, y:14 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.55, delay:0.35, ease }}
          >
            Más allá de las asignaturas, el Diploma IB exige un compromiso real con el mundo a través de tres pilares fundamentales.
          </motion.p>
        </div>

        {/* Tarjetas + foto real del colegio */}
        <div className="grid md:grid-cols-[1fr_340px] gap-[40px] items-start">

          {/* Cards */}
          <div className="flex flex-col gap-[16px]">
            {componentes.map((c, i) => (
              <motion.div
                key={c.title}
                className="flex flex-col gap-[12px] rounded-[12px] p-[28px_24px]"
                style={{
                  background: c.highlight ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.05)",
                  border: c.highlight ? "1.5px solid rgba(201,168,76,0.45)" : "1px solid rgba(255,255,255,0.08)",
                }}
                initial={{ opacity:0, x:-40 }}
                whileInView={{ opacity:1, x:0 }}
                viewport={{ once:true, amount:0.2 }}
                transition={{ duration:0.6, delay:0.08*i, ease }}
                whileHover={{ x:6, transition:{ duration:0.22 } }}
              >
                <div className="flex items-center gap-[14px]">
                  <span style={{ fontSize:28, lineHeight:1 }}>{c.icon}</span>
                  <div className="flex flex-col gap-[2px]">
                    <span style={{ fontFamily:"Poppins,sans-serif", fontSize:18, fontWeight:700, color:"#C9A84C", lineHeight:1 }}>{c.title}</span>
                    <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color:"rgba(255,255,255,0.45)", letterSpacing:0.4 }}>{c.sub}</span>
                  </div>
                </div>
                <motion.span
                  className="block bg-[#C9A84C]"
                  style={{ width:32, height:1.5, borderRadius:1 }}
                  initial={{ scaleX:0, originX:0 }}
                  whileInView={{ scaleX:1 }}
                  viewport={{ once:true }}
                  transition={{ duration:0.4, delay:0.1 + 0.08*i, ease }}
                />
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:14, color:"rgba(255,255,255,0.65)", lineHeight:1.7 }}>
                  {c.desc}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Foto real del colegio */}
          <div ref={imgRef} className="hidden md:flex flex-col gap-[16px]">
            <motion.div
              className="relative rounded-[14px] overflow-hidden"
              style={{ height: 340 }}
              initial={{ opacity:0, x:40 }}
              animate={imgView ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.7, delay:0.2, ease }}
            >
              <Image
                src="https://atenas.edu.ec/wp-content/uploads/2023/03/FOTOGRAFIA-IB-1024x798.jpg"
                alt="Estudiantes IB en Atenas"
                fill
                className="object-cover"
                sizes="340px"
              />
              <div
                className="absolute inset-0"
                style={{ background:"linear-gradient(to top, rgba(26,43,74,0.75) 0%, transparent 50%)" }}
              />
              <div className="absolute bottom-[16px] left-[18px] right-[18px]">
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:12, fontWeight:700, color:"#FFFFFF", lineHeight:1.4 }}>
                  Estudiantes del Programa IB en Atenas
                </span>
              </div>
            </motion.div>

            <motion.div
              className="relative rounded-[14px] overflow-hidden"
              style={{ height: 210 }}
              initial={{ opacity:0, x:40 }}
              animate={imgView ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.7, delay:0.38, ease }}
            >
              <Image
                src="https://atenas.edu.ec/wp-content/uploads/2023/03/Nucleo-1.jpg"
                alt="Núcleo del Programa IB"
                fill
                className="object-cover object-center"
                sizes="340px"
              />
              <div
                className="absolute inset-0"
                style={{ background:"rgba(26,43,74,0.35)" }}
              />
              <div className="absolute bottom-[16px] left-[18px]">
                <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.80)" }}>
                  El núcleo del Diploma IB
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
