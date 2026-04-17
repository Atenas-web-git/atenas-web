"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const pills = [
  { label: "Alumno",      href: "#alumno",  active: true  },
  { label: "Padre/Madre", href: "#padre",   active: false },
  { label: "Docente",     href: "#docente", active: false },
  { label: "Alumni",      href: "#alumni",  active: false },
];

const stats = [
  { value: "4",      label: "Comunidades" },
  { value: "5.000+", label: "Familias activas" },
  { value: "50+",    label: "Años juntos" },
  { value: "200+",   label: "Docentes" },
];

export function HeroComunidad() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "22%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0D1825] min-h-[640px] md:min-h-[860px]"
    >
      {/* ─── Fondo con parallax ─── */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY }}>
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1440&q=80"
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.2 }}
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(120deg, rgba(13,24,37,0.96) 0%, rgba(13,24,37,0.52) 55%, rgba(13,24,37,0.90) 100%)" }}
      />

      {/* ─── Ghost COMUNIDAD ─── */}
      <div
        className="hidden md:block absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 90 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:210, fontWeight:700, color:"white", opacity:0.03, lineHeight:1, marginLeft:-12, whiteSpace:"nowrap" }}>
          COMUNIDAD
        </span>
      </div>
      <div
        className="md:hidden absolute inset-x-0 pointer-events-none select-none overflow-hidden"
        style={{ top: 120 }}
      >
        <span style={{ display:"block", fontFamily:"Poppins,sans-serif", fontSize:54, fontWeight:700, color:"white", opacity:0.04, lineHeight:1, letterSpacing:-1, whiteSpace:"nowrap" }}>
          COMUNIDAD
        </span>
      </div>

      {/* ─── Contenido principal ─── */}
      <div
        className="relative z-10
          px-6 pt-[180px] pb-28
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[160px] md:top-[260px]
          flex flex-col gap-[14px] md:gap-[20px]"
      >
        {/* Badge */}
        <motion.div
          className="flex items-center gap-[8px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <motion.span
            className="block bg-[#C9A84C] flex-shrink-0"
            style={{ width: 28, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
          />
          <span style={{ fontFamily:"Poppins,sans-serif", fontSize:10, fontWeight:700, color:"#C9A84C", letterSpacing:2, textTransform:"uppercase" }}>
            NUESTRA COMUNIDAD
          </span>
        </motion.div>

        {/* Título — slide-up línea a línea */}
        <div>
          {(["Somos", "Atenas."] as const).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block font-bold"
                style={{
                  fontFamily: "Poppins,sans-serif",
                  fontSize: "clamp(44px,5.28vw,76px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: i === 0 ? "#FFFFFF" : "#C9A84C",
                }}
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.28 + i * 0.13, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        {/* Subtítulo con underline animado */}
        <motion.p
          style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(15px,1.18vw,17px)", color:"rgba(255,255,255,0.65)", lineHeight:1.65, maxWidth:540 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.58, ease }}
        >
          Un espacio para cada integrante de la{" "}
          <span className="relative inline-block">
            familia Atenas
            <motion.span
              className="absolute left-0 -bottom-0.5 block bg-[#C9A84C]"
              style={{ height: 2, borderRadius: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.95, ease }}
            />
          </span>
          {" "}— estudiantes, padres, docentes y alumni, todos en casa.
        </motion.p>

        {/* Pills de audiencia — stagger */}
        <div className="flex flex-wrap gap-[10px] mt-[4px]">
          {pills.map((p, i) => (
            <motion.a
              key={p.label}
              href={p.href}
              className="inline-flex items-center px-[22px] py-[11px] rounded-[6px] font-bold text-[13px]"
              style={{
                fontFamily: "Poppins,sans-serif",
                background: p.active ? "#C9A84C" : "rgba(255,255,255,0.08)",
                color: p.active ? "#0D1825" : "#FFFFFF",
              }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.78 + i * 0.08, ease }}
              whileHover={{
                scale: 1.04,
                backgroundColor: p.active ? "#dbb95a" : "rgba(255,255,255,0.16)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              {p.label}
            </motion.a>
          ))}
        </div>
      </div>

      {/* ─── Stats bar — desktop ─── */}
      <motion.div
        className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 items-center gap-[48px] px-[160px] py-[24px]"
        style={{ background:"rgba(13,24,37,0.82)", backdropFilter:"blur(12px)" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.05, ease }}
      >
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-[36px]">
            <div className="flex flex-col gap-[2px]">
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:26, fontWeight:700, color:"#C9A84C", lineHeight:1 }}>{s.value}</span>
              <span style={{ fontFamily:"Poppins,sans-serif", fontSize:11, color:"rgba(255,255,255,0.55)" }}>{s.label}</span>
            </div>
            {i < stats.length - 1 && <div style={{ width:1, height:36, background:"rgba(255,255,255,0.16)" }} />}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
