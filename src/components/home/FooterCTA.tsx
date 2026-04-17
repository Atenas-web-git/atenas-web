"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { LogoSVG } from "@/components/shared/LogoSVG";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
      </svg>
    ),
  },
];

const footerLinks = [
  { label: "Contactos",               href: "#" },
  { label: "Política de privacidad",  href: "#" },
  { label: "Trabaja con nosotros",    href: "#" },
];

export function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F1D33] min-h-[640px] md:min-h-[660px] flex flex-col items-center justify-center
                 py-12 md:py-20 px-6 md:px-8"
    >
      {/* Foto de fondo con parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"
          alt="Campus Atenas"
          fill
          className="object-cover object-center"
          sizes="100vw"
          style={{ opacity: 0.18 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,29,51,0.82) 0%, rgba(15,29,51,0.70) 50%, rgba(15,29,51,0.92) 100%)",
          }}
        />
      </motion.div>

      {/* ── Contenido — w-full garantiza que no desborde ── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[342px] md:max-w-[600px]">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <LogoSVG variant="white" className="w-[161px] md:w-[200px]" />
        </motion.div>

        {/* Headline — 30px mobile / clamp desktop */}
        <motion.h2
          className="mt-6 md:mt-8 text-white font-bold leading-[1.1]"
          style={{ fontSize: "clamp(30px, 3.6vw, 52px)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          Sé parte del Atenas.
        </motion.h2>

        {/* Subtítulo — texto del Pencil mobile */}
        <motion.p
          className="mt-4 text-white/65 text-[13px] leading-[1.7]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
        >
          Conoce nuestra propuesta educativa y da
          el primer paso hacia una formación de excelencia.
        </motion.p>

        {/* CTAs — full-width en mobile, fila en desktop */}
        <motion.div
          className="mt-6 md:mt-8 flex flex-col gap-3 w-full sm:flex-row sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
        >
          <motion.a
            href="/admisiones#visita"
            className="bg-[#9e1915] text-white text-[14px] font-bold tracking-[0.5px] px-8 py-3 text-center rounded-[6px] w-full sm:w-auto"
            whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
            transition={{ duration: 0.18 }}
          >
            Agenda una visita
          </motion.a>
          <motion.a
            href="/admisiones"
            className="border border-white/40 text-white text-[14px] font-semibold tracking-[0.5px] px-8 py-3 text-center rounded-[6px] w-full sm:w-auto"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            transition={{ duration: 0.18 }}
          >
            Proceso de admisión
          </motion.a>
        </motion.div>

        {/* Redes sociales */}
        <motion.div
          className="mt-8 flex gap-3.5"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.65, ease }}
        >
          {socialLinks.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.12)" }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.08, ease }}
            >
              {s.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* ── Sección inferior: divisor + links + contacto + copyright ── */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.75, ease }}
        >
          {/* Divisor */}
          <div className="h-px bg-white/15 w-full max-w-[300px] mb-1" />

          {/* Links — mobile: una sola línea centrada; desktop: fila flex */}
          <p className="text-white/50 text-[11px] text-center leading-relaxed md:hidden">
            Contactos · Política de privacidad · Trabaja con nosotros
          </p>
          <div className="hidden md:flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-white/50 text-[12px] tracking-[0.5px] hover:text-white/80 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Teléfono y correo — Pencil: opacity 0.55 */}
          <p className="text-white/55 text-[11px] text-center">
            +593 99 762 2994 · admisiones@atenas.edu.ec
          </p>

          {/* Copyright */}
          <p className="text-white/30 text-[10px] text-center">
            © 2026 Unidad Educativa Atenas · Ambato, Ecuador
          </p>
        </motion.div>

      </div>
    </footer>
  );
}
