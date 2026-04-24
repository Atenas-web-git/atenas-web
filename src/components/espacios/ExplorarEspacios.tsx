"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ESPACIOS = [
  {
    slug: "vase",
    icon: "🕊",
    title: "VASE",
    subtitle: "Valores, Actitudes, Servicio y Espiritualidad",
    desc: "Formación del carácter a través del servicio comunitario, la reflexión personal y el liderazgo ético.",
    highlight: false,
  },
  {
    slug: "cas",
    icon: "⭐",
    title: "CAS",
    subtitle: "Creativity, Activity, Service",
    desc: "Componente central del IB donde cada estudiante diseña su portafolio de proyectos creativos y de servicio.",
    highlight: true,
  },
  {
    slug: "idioma",
    icon: "🌐",
    title: "Idioma",
    subtitle: "Programa de inglés Cambridge",
    desc: "Entorno bilingüe con certificaciones Cambridge desde Inicial hasta el graduado de Bachillerato.",
    highlight: false,
  },
  {
    slug: "cultura",
    icon: "🎭",
    title: "Cultura",
    subtitle: "Arte, Música, Teatro y Danza",
    desc: "Expresión creativa como pilar de la formación integral, con festival anual y agrupaciones institucionales.",
    highlight: false,
  },
  {
    slug: "educacion-fisica",
    icon: "🏆",
    title: "Ed. Física",
    subtitle: "Deporte y Bienestar",
    desc: "Equipos de competencia provincial y programas de bienestar que forman hábitos saludables de por vida.",
    highlight: false,
  },
  {
    slug: "intercambio",
    icon: "✈️",
    title: "Intercambio",
    subtitle: "Programa Internacional",
    desc: "Experiencias educativas en el exterior que forman ciudadanos globales con perspectiva multicultural.",
    highlight: false,
  },
];

export function ExplorarEspacios() {
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
              Todos los espacios
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.2 }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              Explora cada espacio de desarrollo
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "rgba(13,24,37,0.55)", lineHeight: 1.7, maxWidth: 520 }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Cada espacio tiene su propio enfoque, actividades y coordinación. Selecciona el que te interesa para conocer los detalles completos.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {ESPACIOS.map((e, i) => (
            <motion.div
              key={e.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.08, ease }}
            >
              <Link
                href={`/espacios/${e.slug}`}
                className="flex flex-col gap-[14px] rounded-[14px] p-[24px] h-full group"
                style={{
                  background: e.highlight ? "rgba(26,43,74,0.04)" : "#FFFFFF",
                  border: e.highlight ? "1.5px solid rgba(201,168,76,0.45)" : "1px solid rgba(26,43,74,0.08)",
                  boxShadow: "0 2px 12px rgba(13,24,37,0.05)",
                  textDecoration: "none",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                }}
                onMouseEnter={(e_) => {
                  const el = e_.currentTarget;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 16px 40px rgba(13,24,37,0.10)";
                  el.style.borderColor = e.highlight ? "rgba(201,168,76,0.80)" : "rgba(201,168,76,0.45)";
                }}
                onMouseLeave={(e_) => {
                  const el = e_.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 12px rgba(13,24,37,0.05)";
                  el.style.borderColor = e.highlight ? "rgba(201,168,76,0.45)" : "rgba(26,43,74,0.08)";
                }}
              >
                {/* Ícono */}
                <div
                  className="flex items-center justify-center rounded-[10px] flex-shrink-0"
                  style={{ width: 44, height: 44, background: e.highlight ? "rgba(201,168,76,0.18)" : "rgba(201,168,76,0.12)", fontSize: 20 }}
                >
                  {e.icon}
                </div>

                {/* Texto */}
                <div className="flex flex-col gap-[4px] flex-1">
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#1A2B4A", lineHeight: 1.3 }}>
                    {e.title}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600, color: "#C9A84C" }}>
                    {e.subtitle}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(13,24,37,0.52)", lineHeight: 1.65, marginTop: 4 }}>
                    {e.desc}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-[6px] mt-auto pt-[4px]">
                  <span
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: 0.5 }}
                    className="group-hover:underline"
                  >
                    Explorar espacio
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
