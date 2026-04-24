"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const NIVELES = [
  {
    slug: "inicial",
    icon: "🌱",
    title: "Educación Inicial",
    grades: "Pre-Kinder y Kinder",
    age: "3 – 5 años",
    desc: "Los primeros pasos: metodologías Montessori, Reggio Emilia y ABN en un entorno bilingüe y estimulante.",
    highlight: false,
  },
  {
    slug: "egb-elemental-media",
    icon: "📚",
    title: "EGB Elemental y Media",
    grades: "1ro a 7mo grado",
    age: "6 – 12 años",
    desc: "Formación bilingüe con pensamiento lógico-matemático, valores y bases académicas sólidas.",
    highlight: false,
  },
  {
    slug: "egb-superior",
    icon: "🔬",
    title: "EGB Superior",
    grades: "8vo a 10mo grado",
    age: "12 – 15 años",
    desc: "Etapa de preparación para el Bachillerato IB: inglés avanzado, ciencias y liderazgo.",
    highlight: false,
  },
  {
    slug: "ib",
    icon: "★",
    title: "Bachillerato IB",
    grades: "1ro y 2do Bachillerato",
    age: "14 – 17 años",
    desc: "Programa del Diploma Internacional. Cupos limitados, selección por mérito académico.",
    highlight: true,
  },
];

export function ExplorarAdmisiones() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="bg-[#F8F5F0] relative overflow-hidden" style={{ padding: "80px 0" }}>
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
              Proceso por nivel
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.2 }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              Conoce los requisitos de tu nivel
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.55)", lineHeight: 1.7, maxWidth: 520 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Cada nivel tiene su propio proceso, documentos y requisitos. Selecciona el que corresponde al estudiante para ver la información completa.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {NIVELES.map((n, i) => (
            <motion.div
              key={n.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease }}
            >
              <Link
                href={`/admisiones/${n.slug}`}
                className="flex flex-col gap-[14px] rounded-[14px] p-[24px] h-full group"
                style={{
                  background: n.highlight ? "rgba(26,43,74,0.04)" : "#FFFFFF",
                  border: n.highlight ? "1.5px solid rgba(201,168,76,0.45)" : "1px solid rgba(26,43,74,0.08)",
                  boxShadow: "0 2px 12px rgba(13,24,37,0.05)",
                  textDecoration: "none",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 16px 40px rgba(13,24,37,0.10)";
                  el.style.borderColor = n.highlight ? "rgba(201,168,76,0.80)" : "rgba(201,168,76,0.45)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 12px rgba(13,24,37,0.05)";
                  el.style.borderColor = n.highlight ? "rgba(201,168,76,0.45)" : "rgba(26,43,74,0.08)";
                }}
              >
                {/* Ícono */}
                <div
                  className="flex items-center justify-center rounded-[10px] flex-shrink-0"
                  style={{ width: 44, height: 44, background: n.highlight ? "rgba(201,168,76,0.18)" : "rgba(201,168,76,0.12)", fontSize: 20 }}
                >
                  {n.icon}
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-[4px] flex-1">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#1A2B4A", lineHeight: 1.3 }}>
                    {n.title}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600, color: "#C9A84C" }}>
                    {n.grades} · {n.age}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.52)", lineHeight: 1.65, marginTop: 4 }}>
                    {n.desc}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-[6px] mt-auto pt-[4px]">
                  <span
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: 0.5 }}
                    className="group-hover:underline"
                  >
                    Ver requisitos
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
