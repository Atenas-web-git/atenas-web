"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const cards = [
  {
    id: 0,
    label: "Académico",
    mobileLabel: "ACADÉMICO",
    title: "Excelencia que abre puertas",
    mobileTitle: "Educación de alto nivel",
    desc: "Programas con certificación ISO 9001 y el único Bachillerato IB en el centro del Ecuador.",
    img: "/images/IMG_1889-2-2-1536x1226.jpg",
  },
  {
    id: 1,
    label: "Identidad",
    mobileLabel: "IDENTIDAD",
    title: "Valores para toda la vida",
    mobileTitle: "Formados con propósito",
    desc: "Nuestro modelo VASE forma personas íntegras con Valores, Autonomía, Solidaridad y Excelencia.",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80",
  },
  {
    id: 2,
    label: "Bachillerato IB",
    mobileLabel: "BACHILLERATO IB",
    title: "Visión global",
    mobileTitle: "Reconocido mundialmente",
    desc: "Reconocido por más de 5,000 universidades en el mundo. Aprendizaje en inglés con método CLIL.",
    img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=640&q=80",
  },
  {
    id: 3,
    label: "Comunidad",
    mobileLabel: "COMUNIDAD",
    title: "Una familia que crece",
    mobileTitle: "Más que un colegio",
    desc: "50 años construyendo comunidad. Familias, docentes y graduados que llevan el Atenas para toda la vida.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=640&q=80",
  },
];

// ─────────────────────────────────────────────────────────────
// Desktop card (imagen arriba + texto abajo)
// ─────────────────────────────────────────────────────────────

function DesktopCard({
  card,
  index,
  inView,
}: {
  card: (typeof cards)[0];
  index: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden flex flex-col"
      style={{
        borderRadius: 8,
        boxShadow: hovered
          ? "0 8px 32px rgba(13,24,37,0.16)"
          : "0 2px 8px rgba(13,24,37,0.06)",
        transition: "box-shadow 0.3s ease",
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.1 * index, ease }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Borde rojo izquierda animado */}
      <motion.span
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#9e1915] z-10 origin-top"
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
      />

      {/* Foto */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        <Image
          src={card.img}
          alt={card.label}
          fill
          className="object-cover transition-transform duration-700"
          style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
          sizes="23vw"
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col flex-1 p-6 bg-white">
        <span className="text-[#9e1915] text-[10px] font-semibold tracking-[2px] uppercase mb-2">
          {card.label}
        </span>
        <h3 className="text-[#1A2B4A] font-bold text-[17px] leading-[1.3] mb-3">
          {card.title}
        </h3>
        <p className="text-[#666666] text-[13px] leading-[1.65] flex-1">{card.desc}</p>
        <motion.a
          href="#"
          className="mt-4 text-[#1A2B4A] text-[11px] font-semibold tracking-[2px] uppercase flex items-center gap-2 w-fit"
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          Conoce más <span className="text-[#9e1915]">→</span>
        </motion.a>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile card (imagen izquierda + panel texto derecha, 160px)
// Pencil: imagen full 342×160, borde rojo 3px izquierda,
//         panel blanco 202px derecha (x=140)
// ─────────────────────────────────────────────────────────────

function MobileCard({
  card,
  index,
  inView,
}: {
  card: (typeof cards)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        borderRadius: 8,
        height: 160,
        border: "1px solid #e0e0e0",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 * index, ease }}
    >
      {/* Imagen de fondo (cubre los 342px completos) */}
      <Image
        src={card.img}
        alt={card.label}
        fill
        className="object-cover"
        sizes="92vw"
      />

      {/* Borde rojo izquierda */}
      <div
        className="absolute left-0 top-0 bottom-0 z-10"
        style={{ width: 3, background: "#9e1915" }}
      />

      {/* Panel blanco — ocupa los 202px derechos (x=140) */}
      <div
        className="absolute top-0 right-0 bottom-0 bg-white flex flex-col justify-center"
        style={{ width: 202, padding: 16, gap: 6 }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: "#9e1915",
          }}
        >
          {card.mobileLabel}
        </span>
        <h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#2C2C2C",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {card.mobileTitle}
        </h3>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#1A2B4A",
          }}
        >
          CONOCE MÁS →
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sección principal
// ─────────────────────────────────────────────────────────────

export function PorQueAtenas() {
  const sectionRef      = useRef<HTMLElement>(null);
  const headingRef      = useRef<HTMLDivElement>(null);
  const desktopGridRef  = useRef<HTMLDivElement>(null);
  const mobileGridRef   = useRef<HTMLDivElement>(null);

  const inView           = useInView(headingRef,     { once: true, amount: 0.3  });
  const desktopCardsView = useInView(desktopGridRef, { once: true, amount: 0.08 });
  const mobileCardsView  = useInView(mobileGridRef,  { once: true, amount: 0.08 });

  return (
    <section
      ref={sectionRef}
      className="bg-white py-[80px] md:py-[130px] px-6 md:px-[80px] overflow-hidden relative"
    >
      {/* Ghost text "SÉ MÁS" */}
      <motion.span
        className="absolute top-[20px] left-0 font-bold text-[#1A2B4A] select-none pointer-events-none w-full text-center"
        style={{ fontSize: "clamp(80px, 13vw, 180px)" }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 0.04 } : {}}
        transition={{ duration: 1.2, ease }}
      >
        SÉ MÁS
      </motion.span>

      {/* ── Header ── */}
      <div ref={headingRef} className="relative z-10 mb-10 md:mb-16 md:text-center md:max-w-[640px] md:mx-auto">

        {/* Label */}
        <motion.p
          className="text-[#9e1915] text-[10px] md:text-[11px] font-semibold tracking-[3px] uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          Por qué Atenas
        </motion.p>

        {/* Título — mobile: izquierda, 34px; desktop: centrado, 64px */}
        <div className="overflow-hidden">
          <motion.h2
            className="text-[#1A2B4A] font-light leading-[1.05]"
            style={{ fontSize: "clamp(34px, 4.5vw, 64px)" }}
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease }}
          >
            Descubre incluso
          </motion.h2>
        </div>

        <div className="overflow-hidden">
          <div className="relative inline-block">
            <motion.h2
              className="text-[#9e1915] font-bold leading-[1.05]"
              style={{ fontSize: "clamp(34px, 4.5vw, 64px)" }}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.3, ease }}
            >
              más.
            </motion.h2>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#9e1915]"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.55, ease }}
              style={{ originX: 0 }}
            />
          </div>
        </div>

        {/* Subtítulo — solo desktop */}
        <motion.p
          className="hidden md:block text-[#666666] text-[14px] leading-[1.7] mt-5"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease }}
        >
          Cuatro razones por las que familias de Ambato eligen el Atenas,
          año tras año.
        </motion.p>
      </div>

      {/* ── Desktop grid 4 columnas ── */}
      <div
        ref={desktopGridRef}
        className="relative z-10 hidden md:grid grid-cols-4 gap-5 max-w-[1280px] mx-auto"
      >
        {cards.map((card, i) => (
          <DesktopCard key={card.id} card={card} index={i} inView={desktopCardsView} />
        ))}
      </div>

      {/* ── Mobile stack vertical ── */}
      <div
        ref={mobileGridRef}
        className="relative z-10 flex md:hidden flex-col gap-4 max-w-[342px] mx-auto"
      >
        {cards.map((card, i) => (
          <MobileCard key={card.id} card={card} index={i} inView={mobileCardsView} />
        ))}
      </div>
    </section>
  );
}
