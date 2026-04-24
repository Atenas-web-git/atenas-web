"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const SECCIONES = [
  {
    slug: "atributos",
    icon: "★",
    title: "Atributos del Perfil IB",
    desc: "Los 10 rasgos que definen a cada estudiante del Diploma: indagadores, íntegros, equilibrados y más.",
  },
  {
    slug: "infraestructura",
    icon: "🏛",
    title: "Infraestructura IB",
    desc: "Laboratorios, aulas de debate, biblioteca digital y espacios CAS diseñados para el nivel del Diploma.",
  },
  {
    slug: "documentos",
    icon: "📄",
    title: "Documentos IB",
    desc: "Guías oficiales del IBO, reglamentos, política de honestidad académica y recursos del programa.",
  },
  {
    slug: "escuela-padres",
    icon: "👨‍👩‍👧",
    title: "Escuela de Padres",
    desc: "Talleres, sesiones informativas y canal directo con la coordinación para acompañar el proceso IB.",
  },
  {
    slug: "visitas",
    icon: "🗺",
    title: "Visitas al Programa",
    desc: "Conoce las instalaciones IB en persona: visita guiada, día de observación o charla con estudiantes.",
  },
  {
    slug: "politicas",
    icon: "📋",
    title: "Políticas del Programa",
    desc: "Marco institucional: evaluación, inclusión, honestidad académica, bienestar y uso de tecnología.",
  },
  {
    slug: "capacitacion",
    icon: "🎓",
    title: "Capacitación Docente",
    desc: "Equipo certificado por el IBO con formación continua en metodología internacional y evaluación.",
  },
];

export function ExplorarIB() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="bg-[#F8F5F0] relative overflow-hidden" style={{ padding: "80px 0" }}>
      {/* Detalle decorativo */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{ width: 480, height: 480, background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.07) 0%, transparent 65%)" }}
      />

      <div ref={ref} className="px-6 md:px-[160px]">

        {/* Header */}
        <div className="flex flex-col gap-[14px] mb-[48px]">
          <motion.div
            className="flex items-center gap-[10px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block bg-[#C9A84C] flex-shrink-0"
              style={{ width: 28, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.1, ease }}
            />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
              Explora el Programa
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.2 }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              Todo lo que necesitas saber sobre el IB
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.55)", lineHeight: 1.7, maxWidth: 520 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Desde los atributos del perfil hasta la capacitación de los docentes: cada sección responde una pregunta clave sobre el Programa del Diploma en Atenas.
          </motion.p>
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px]">
          {SECCIONES.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.07, ease }}
            >
              <Link
                href={`/academico/ib/${s.slug}`}
                className="flex flex-col gap-[14px] rounded-[14px] p-[24px] h-full group"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(26,43,74,0.08)",
                  boxShadow: "0 2px 12px rgba(13,24,37,0.05)",
                  textDecoration: "none",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 16px 40px rgba(13,24,37,0.10)";
                  el.style.borderColor = "rgba(201,168,76,0.45)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 12px rgba(13,24,37,0.05)";
                  el.style.borderColor = "rgba(26,43,74,0.08)";
                }}
              >
                {/* Ícono */}
                <div
                  className="flex items-center justify-center rounded-[10px] flex-shrink-0"
                  style={{ width: 44, height: 44, background: "rgba(201,168,76,0.12)", fontSize: 20 }}
                >
                  {s.icon}
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-[6px] flex-1">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#1A2B4A", lineHeight: 1.3 }}>
                    {s.title}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.52)", lineHeight: 1.65 }}>
                    {s.desc}
                  </span>
                </div>

                {/* Link label */}
                <div className="flex items-center gap-[6px] mt-auto pt-[4px]">
                  <span
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: 0.5 }}
                    className="group-hover:underline"
                  >
                    Ver más
                  </span>
                  <span style={{ color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
