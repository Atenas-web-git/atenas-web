"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SERVICIOS } from "@/data/servicios";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function GridServicios() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  return (
    <section className="bg-[#F5F1EB] relative overflow-hidden" style={{ padding: "80px 0" }}>
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 520,
          height: 520,
          background:
            "radial-gradient(ellipse at top right, rgba(201,168,76,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 pointer-events-none"
        style={{
          width: 360,
          height: 360,
          background:
            "radial-gradient(ellipse at bottom left, rgba(201,168,76,0.04) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="px-6 md:px-[160px]">
        {/* Header */}
        <div className="flex flex-col gap-[14px] mb-[52px]">
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
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Todos los servicios
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(24px, 2.5vw, 36px)",
                fontWeight: 700,
                color: "#1A2B4A",
                lineHeight: 1.2,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              ¿En qué podemos ayudarte?
            </motion.h2>
          </div>

          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(13,24,37,0.55)",
              lineHeight: 1.7,
              maxWidth: 540,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Conoce todos los servicios disponibles para estudiantes, representantes legales y
            docentes de la Unidad Educativa Atenas.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {SERVICIOS.map((s, i) => {
            const isRed = s.color === "red";
            const accent = isRed ? "#9e1915" : "#C9A84C";
            const accentBg = isRed ? "rgba(158,25,21,0.10)" : "rgba(201,168,76,0.12)";
            const borderDefault = isRed
              ? "rgba(158,25,21,0.28)"
              : "rgba(26,43,74,0.08)";
            const borderHover = isRed ? "rgba(158,25,21,0.55)" : "rgba(201,168,76,0.55)";
            const bgDefault = isRed ? "rgba(158,25,21,0.03)" : "#FFFFFF";

            return (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.08 + i * 0.06, ease }}
              >
                <Link
                  href={`/servicios/${s.slug}`}
                  className="flex flex-col gap-[14px] rounded-[14px] p-[22px] h-full group"
                  style={{
                    background: bgDefault,
                    border: `1.5px solid ${borderDefault}`,
                    boxShadow: "0 2px 12px rgba(13,24,37,0.05)",
                    textDecoration: "none",
                    transition:
                      "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                  }}
                  onMouseEnter={(e_) => {
                    const el = e_.currentTarget;
                    el.style.transform = "translateY(-6px)";
                    el.style.boxShadow = "0 16px 40px rgba(13,24,37,0.10)";
                    el.style.borderColor = borderHover;
                  }}
                  onMouseLeave={(e_) => {
                    const el = e_.currentTarget;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 2px 12px rgba(13,24,37,0.05)";
                    el.style.borderColor = borderDefault;
                  }}
                >
                  {/* Ícono */}
                  <div
                    className="flex items-center justify-center rounded-[10px] flex-shrink-0"
                    style={{ width: 44, height: 44, background: accentBg }}
                  >
                    <s.Icono size={20} color={accent} strokeWidth={1.8} />
                  </div>

                  {/* Texto */}
                  <div className="flex flex-col gap-[4px] flex-1">
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#1A2B4A",
                        lineHeight: 1.3,
                      }}
                    >
                      {s.nombre}
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 12,
                        color: "rgba(13,24,37,0.52)",
                        lineHeight: 1.65,
                        marginTop: 4,
                      }}
                    >
                      {s.descripcionCorta}
                    </span>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-[6px] mt-auto pt-[4px]">
                    <span
                      className="group-hover:underline"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: accent,
                        letterSpacing: 0.5,
                      }}
                    >
                      {isRed ? "Enviar comunicación" : "Ver servicio"}
                    </span>
                    <span style={{ color: accent, fontSize: 13, fontWeight: 700 }}>→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
