"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const PASOS = [
  { num: "01", title: "Presentación de documentos",
    desc: "Entrega de notas de 8vo a 10mo, cédula de identidad, formulario de postulación y certificado médico." },
  { num: "02", title: "Evaluación DECE",
    desc: "El Departamento de Consejería evalúa el perfil emocional y vocacional del estudiante." },
  { num: "03", title: "Pruebas académicas",
    desc: "Evaluación de razonamiento verbal y matemático para verificar el nivel requerido." },
  { num: "04", title: "Revisión del comité",
    desc: "El equipo de admisiones analiza el expediente completo y toma la decisión." },
  { num: "05", title: "Orientación e inducción",
    desc: "Sesión con el coordinador, familias y futuros estudiantes antes de iniciar el año." },
];

export function PasosAdmision() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const inView     = useInView(headerRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "#0D1825", padding: "80px 0" }}>

      {/* Parallax bg */}
      <motion.div className="absolute inset-0" style={{ y: bgY, willChange: "transform" }}>
        <Image src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1400&q=80"
          alt="" fill className="object-cover object-center" style={{ opacity: 0.10 }} sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 65%)" }} />

      <div className="relative z-10 px-6 md:px-[160px]">

        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <motion.div className="flex items-center gap-[10px] mb-3"
            initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}>
            <motion.span className="block bg-[#C9A84C]" style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
              color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
              Proceso de admisión
            </span>
          </motion.div>
          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px,2.5vw,36px)",
                fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}
              initial={{ y: 50, opacity: 0 }} animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease }}>
              5 pasos para ingresar al colegio
            </motion.h2>
          </div>
        </div>

        {/* Steps — desktop horizontal, mobile vertical */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {PASOS.map((paso, i) => {
            const isLast = i === PASOS.length - 1;
            return (
              <motion.div key={paso.num}
                className="flex flex-col gap-3 rounded-xl p-5 cursor-default"
                style={{
                  background: isLast ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)",
                  border: isLast ? "1.5px solid rgba(201,168,76,0.45)" : "1px solid rgba(201,168,76,0.18)",
                }}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease }}
                whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(201,168,76,0.12)", transition: { duration: 0.2 } }}>

                {/* Número */}
                <motion.div
                  className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 40, height: 40, background: "#C9A84C", fontFamily: "Poppins, sans-serif",
                    fontSize: 13, fontWeight: 700, color: "#0D1825" }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.12 + i * 0.08, type: "spring", stiffness: 280, damping: 16 }}>
                  {paso.num}
                </motion.div>

                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700,
                  color: "#FFFFFF", lineHeight: 1.3 }}>{paso.title}</span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11,
                  color: "rgba(255,255,255,0.50)", lineHeight: 1.6 }}>{paso.desc}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
