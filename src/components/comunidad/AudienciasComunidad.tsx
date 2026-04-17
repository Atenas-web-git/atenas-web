"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const audiencias = [
  {
    id: "alumno",
    title: "Soy Alumno",
    description:
      "Accede a tu plataforma virtual, el calendario de actividades, clubes deportivos y mucho más.",
    cta: "Ver recursos →",
    href: "#alumno",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80",
    dark: true,
    items: ["Plataforma virtual", "Calendario de actividades", "Clubes y deportes"],
  },
  {
    id: "padre",
    title: "Soy Padre/Madre",
    description:
      "Portal de comunicados, seguimiento académico y agenda de reuniones con docentes.",
    cta: "Ver comunicaciones →",
    href: "#padre",
    image: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=700&q=80",
    dark: false,
    items: ["Portal de comunicados", "Seguimiento académico", "Agenda reuniones"],
  },
  {
    id: "docente",
    title: "Soy Docente",
    description:
      "Recursos pedagógicos, capacitaciones IB y acceso a la sala de profesores digital.",
    cta: "Ver recursos →",
    href: "#docente",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&q=80",
    dark: false,
    items: ["Recursos pedagógicos", "Capacitaciones IB", "Sala de profesores"],
  },
  {
    id: "alumni",
    title: "Soy Alumni",
    description:
      "Red de egresados, directorio alumni y próximos encuentros de generaciones.",
    cta: "Unirse →",
    href: "#alumni",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80",
    dark: true,
    items: ["Red de egresados", "Directorio alumni", "Próximos encuentros"],
  },
];

function AudienciaCard({
  a,
  index,
  inView,
}: {
  a: (typeof audiencias)[0];
  index: number;
  inView: boolean;
}) {
  const row = Math.floor(index / 2);
  const col = index % 2;
  const xInit = col === 0 ? -40 : 40;

  return (
    <motion.div
      id={a.id}
      className="rounded-[16px] overflow-hidden flex flex-col"
      style={{
        background: a.dark ? "#1A2B4A" : "#FFFFFF",
        boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
      }}
      initial={{ opacity: 0, y: 48, x: xInit }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.75, delay: 0.15 + row * 0.18 + col * 0.1, ease }}
      whileHover={{
        y: -10,
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        transition: { duration: 0.3, ease },
      }}
    >
      {/* Foto */}
      <div className="relative overflow-hidden" style={{ height: 210 }}>
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.07, transition: { duration: 0.55, ease } }}
        >
          <Image
            src={a.image}
            alt={a.title}
            fill
            className="object-cover object-center"
            sizes="(max-width:768px) 100vw, 600px"
          />
        </motion.div>
        {/* Gradient overlay fondo → contenido */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: 100,
            background: a.dark
              ? "linear-gradient(to top, #1A2B4A 0%, transparent 100%)"
              : "linear-gradient(to top, #FFFFFF 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-[10px] px-7 pb-8 pt-1">
        <h3
          style={{
            fontFamily: "Poppins,sans-serif",
            fontSize: "clamp(20px,1.6vw,22px)",
            fontWeight: 700,
            color: a.dark ? "#FFFFFF" : "#1A2B4A",
            lineHeight: 1.2,
          }}
        >
          {a.title}
        </h3>

        <ul className="flex flex-col gap-[7px]">
          {a.items.map((item, i) => (
            <motion.li
              key={item}
              className="flex items-center gap-[9px]"
              style={{
                fontFamily: "Poppins,sans-serif",
                fontSize: 13,
                color: a.dark ? "rgba(255,255,255,0.60)" : "rgba(26,43,74,0.60)",
              }}
              initial={{ opacity: 0, x: -8 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.35 + row * 0.18 + col * 0.1 + i * 0.06, ease }}
            >
              <span
                className="flex-shrink-0 rounded-sm"
                style={{ width: 6, height: 6, background: "#C9A84C" }}
              />
              {item}
            </motion.li>
          ))}
        </ul>

        <Link
          href={a.href}
          className="mt-3 font-bold text-[13px] transition-colors hover:opacity-75"
          style={{ fontFamily: "Poppins,sans-serif", color: "#C9A84C" }}
        >
          {a.cta}
        </Link>
      </div>
    </motion.div>
  );
}

export function AudienciasComunidad() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const gridInView   = useInView(gridRef,   { once: true, amount: 0.08 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const ghostY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#F8F5F0] py-[80px] md:py-[108px] overflow-hidden"
    >
      {/* Navy stripe top */}
      <div className="absolute top-0 left-0 right-0 h-[6px]" style={{ background: "#1A2B4A" }} />

      {/* Ghost "4" con parallax */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{ right: -60, top: -40, y: ghostY }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins,sans-serif",
            fontSize: 500,
            fontWeight: 700,
            color: "#1A2B4A",
            opacity: 0.04,
            lineHeight: 1,
          }}
        >
          4
        </span>
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-0">

        {/* ─── Header ─── */}
        <div ref={headerRef} className="mb-[60px] md:mb-[80px]">
          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:11, fontWeight:700, color:"#C9A84C", letterSpacing:3, textTransform:"uppercase" }}
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            Para cada familia
          </motion.p>

          <motion.span
            className="block bg-[#C9A84C] mt-3"
            style={{ width: 40, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />

          <div className="overflow-hidden mt-3">
            <motion.h2
              style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(28px,2.78vw,44px)", fontWeight:700, color:"#1A2B4A", lineHeight:1.2 }}
              initial={{ y: 50, opacity: 0 }}
              animate={headerInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease }}
            >
              Encuentra tu{" "}
              <span className="relative inline-block">
                espacio.
                <motion.span
                  className="absolute left-0 -bottom-1 block bg-[#C9A84C]"
                  style={{ height: 4, borderRadius: 2 }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={headerInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.55, delay: 0.55, ease }}
                />
              </span>
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily:"Poppins,sans-serif", fontSize:"clamp(14px,1.04vw,15px)", color:"rgba(26,43,74,0.65)", lineHeight:1.65, maxWidth:620, marginTop:14 }}
            initial={{ opacity: 0, y: 14 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease }}
          >
            Desde el aula hasta la vida profesional, en Atenas siempre eres parte de la familia.
            Cada comunidad tiene su espacio propio, sus recursos y su red de apoyo.
          </motion.p>
        </div>

        {/* ─── Grid 2×2 ─── */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-[20px] md:gap-[28px]"
        >
          {audiencias.map((a, i) => (
            <AudienciaCard key={a.id} a={a} index={i} inView={gridInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
