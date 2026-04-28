"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const BENEFICIOS = [
  "4 pasos simples",
  "Sin costo ni compromiso",
  "Respuesta en 48 h hábiles",
];

export function CTAIniciarSolicitud({ nivel }: { nivel: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const href = `/admisiones/formulario?nivel=${encodeURIComponent(nivel)}`;

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D1825 0%, #1A2B4A 55%, #0F1E30 100%)" }}
    >
      {/* Círculos decorativos */}
      <div
        className="absolute -right-[120px] -top-[120px] rounded-full pointer-events-none"
        style={{ width: 400, height: 400, background: "rgba(201,168,76,0.06)" }}
      />
      <div
        className="absolute -left-[80px] -bottom-[80px] rounded-full pointer-events-none"
        style={{ width: 280, height: 280, background: "rgba(255,255,255,0.03)" }}
      />

      <div className="relative z-10 max-w-[780px] mx-auto px-6 py-[72px] flex flex-col items-center text-center gap-[32px]">

        {/* Badge */}
        <motion.div
          className="flex items-center gap-[10px]"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          <span className="block bg-[#C9A84C]" style={{ width: 24, height: 2 }} />
          <span
            className="text-[#C9A84C] text-[11px] font-bold tracking-[2.5px] uppercase"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Solicitud de Admisión
          </span>
          <span className="block bg-[#C9A84C]" style={{ width: 24, height: 2 }} />
        </motion.div>

        {/* Heading */}
        <motion.div
          className="flex flex-col gap-[16px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1, ease }}
        >
          <h2
            className="text-white font-bold leading-[1.1]"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(26px, 3.2vw, 44px)" }}
          >
            Da el primer paso hacia el futuro de tu hijo
          </h2>
          <p
            className="text-white/65 leading-relaxed mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, maxWidth: 560 }}
          >
            Completa la solicitud formal de admisión para{" "}
            <span className="text-[#C9A84C] font-semibold">{nivel}</span>.
            {" "}Son solo 4 pasos y nuestro equipo te contactará en menos de 48 horas hábiles.
          </p>
        </motion.div>

        {/* Beneficios */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.22, ease }}
        >
          {BENEFICIOS.map((b) => (
            <span
              key={b}
              className="flex items-center gap-[8px] text-white/70"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 13 }}
            >
              <span className="text-[#C9A84C] font-bold">✓</span>
              {b}
            </span>
          ))}
        </motion.div>

        {/* Botones */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.32, ease }}
        >
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-[6px] px-[32px] py-[15px]
              font-bold text-[15px] bg-[#C9A84C] text-[#0D1825] hover:bg-[#dbb95a]
              transition-colors w-full sm:w-auto"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Iniciar solicitud de admisión →
          </Link>
          <Link
            href="/contactos"
            className="inline-flex items-center justify-center rounded-[6px] px-[32px] py-[15px]
              font-semibold text-[15px] border border-white/30 text-white hover:bg-white/10
              transition-colors w-full sm:w-auto"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Agendar una visita
          </Link>
        </motion.div>

        {/* Nota */}
        <motion.p
          className="text-white/35 text-[12px]"
          style={{ fontFamily: "Poppins, sans-serif" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.44, ease }}
        >
          El formulario no genera compromiso. Tu información es confidencial.
        </motion.p>
      </div>
    </section>
  );
}
