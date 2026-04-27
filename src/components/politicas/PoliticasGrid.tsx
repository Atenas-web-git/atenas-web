"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShieldCheck, Building2 } from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const POLITICAS = [
  {
    href: "/politicas/clientes",
    Icono: ShieldCheck,
    titulo: "Política para Clientes y Familias",
    descripcion:
      "Tratamiento de datos personales de estudiantes y representantes legales en el marco de la prestación de servicios educativos de la Unidad Educativa Atenas.",
    cta: "Ver Política de Privacidad",
    codigo: "REVGER-DOG-007 · Versión 1.0",
  },
  {
    href: "/politicas/proveedores",
    Icono: Building2,
    titulo: "Política para Proveedores",
    descripcion:
      "Tratamiento de datos personales de representantes y contactos de las empresas proveedoras de bienes y servicios de la institución.",
    cta: "Ver Política de Privacidad",
    codigo: "REVGER-DOG-008 · Versión 1.0",
  },
];

export function PoliticasGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section style={{ background: "#F5F1EB", padding: "80px 0 96px" }}>
      <div ref={ref} className="px-6 md:px-[160px]">
        {/* Header */}
        <div className="flex flex-col gap-[14px] mb-[56px]">
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
              Protección de Datos
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
                margin: 0,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              Políticas de Privacidad
            </motion.h2>
          </div>

          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(13,24,37,0.55)",
              lineHeight: 1.7,
              maxWidth: 560,
              margin: 0,
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            Conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP),
            la Fundación Cultural y Educativa Ambato informa el tratamiento de datos según la audiencia.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ maxWidth: 880 }}>
          {POLITICAS.map((p, i) => (
            <motion.div
              key={p.href}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
            >
              <Link
                href={p.href}
                className="flex flex-col gap-5 rounded-2xl p-8 h-full"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(26,43,74,0.08)",
                  boxShadow: "0 2px 16px rgba(13,24,37,0.05)",
                  textDecoration: "none",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-5px)";
                  el.style.boxShadow = "0 16px 40px rgba(13,24,37,0.09)";
                  el.style.borderColor = "rgba(201,168,76,0.45)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "0 2px 16px rgba(13,24,37,0.05)";
                  el.style.borderColor = "rgba(26,43,74,0.08)";
                }}
              >
                {/* Ícono */}
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 52, height: 52, background: "rgba(201,168,76,0.12)" }}
                >
                  <p.Icono size={24} color="#C9A84C" strokeWidth={1.6} />
                </div>

                {/* Contenido */}
                <div className="flex flex-col gap-2 flex-1">
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#1A2B4A",
                      lineHeight: 1.3,
                    }}
                  >
                    {p.titulo}
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(13,24,37,0.35)",
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {p.codigo}
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      color: "rgba(13,24,37,0.55)",
                      lineHeight: 1.7,
                      marginTop: 4,
                    }}
                  >
                    {p.descripcion}
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-[6px] pt-2">
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#C9A84C",
                    }}
                  >
                    {p.cta}
                  </span>
                  <span style={{ color: "#C9A84C", fontSize: 14, fontWeight: 700 }}>→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
