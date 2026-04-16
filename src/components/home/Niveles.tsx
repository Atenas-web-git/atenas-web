"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const springEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─────────────────────────────────────────────────────────────
// Data — desktop (490px cards, hover state)
// ─────────────────────────────────────────────────────────────

const desktopCards = [
  {
    id: 0,
    label: "INICIAL",
    title: "Educación\nInicial",
    desc: "Educación inicial con amor, juego y desarrollo sensorial para los más pequeños.",
    img: "/images/IMG_1889-2-2-1536x1226.jpg",
  },
  {
    id: 1,
    label: "BÁSICA",
    title: "Educación\nBásica",
    desc: "Formación integral con excelencia académica desde los primeros años escolares.",
    img: "/images/IMG_1911-2-1536x1024.jpg",
  },
  {
    id: 2,
    label: "BGU",
    title: "Bachillerato\nGeneral",
    desc: "Bachillerato General Unificado con énfasis en ciencias, matemáticas y humanidades.",
    img: "/images/IMG_1932-vis-1-1536x1197.jpg",
  },
  {
    id: 3,
    label: "IB",
    title: "Bachillerato\nInternacional",
    desc: "El único programa IB en el centro del Ecuador. Apertura a las mejores universidades del mundo.",
    img: "/images/00_politicas-de-seguridad-1536x864.jpg",
  },
];

// ─────────────────────────────────────────────────────────────
// Data — mobile (180px cards, Pencil nc1–nc4)
// ─────────────────────────────────────────────────────────────

const mobileCards = [
  {
    id: 0,
    label: "INICIAL",
    title: "Maternal y Kínder",
    img: "/images/IMG_1889-2-2-1536x1226.jpg",
  },
  {
    id: 1,
    label: "BÁSICA",
    title: "Educación General Básica",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=640&q=80",
  },
  {
    id: 2,
    label: "BGU",
    title: "Bachillerato General Unificado",
    img: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=640&q=80",
  },
  {
    id: 3,
    label: "BACHILLERATO IB",
    title: "Diploma IB — Reconocido mundial",
    img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&q=80",
  },
];

// ─────────────────────────────────────────────────────────────
// Desktop card (490px, hover overlay)
// ─────────────────────────────────────────────────────────────

function DesktopCard({
  card,
  index,
  isHovered,
  onHover,
  cardsInView,
}: {
  card: (typeof desktopCards)[0];
  index: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  cardsInView: boolean;
}) {
  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      style={{ borderRadius: 12, height: 490 }}
      initial={{ opacity: 0, y: 60 }}
      animate={cardsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.08 * index, ease }}
      onMouseEnter={() => onHover(card.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src={card.img}
          alt={card.label}
          fill
          className="object-cover"
          style={{
            transform: isHovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 700ms cubic-bezier(0.25,0.1,0.25,1)",
          }}
          sizes="23vw"
        />
      </div>

      {/* Estado normal: gradiente + label + título */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: 300,
          background:
            "linear-gradient(to bottom, rgba(13,24,37,0) 0%, rgba(13,24,37,0.96) 100%)",
          opacity: isHovered ? 0 : 1,
          transition: "opacity 240ms ease",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          padding: "0 24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          opacity: isHovered ? 0 : 1,
          transition: "opacity 200ms ease",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: "#C9A84C",
          }}
        >
          {card.label}
        </span>
        <h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#FFFFFF",
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {card.title}
        </h3>
      </div>

      {/* Estado hover: overlay oscuro + contenido completo */}
      <motion.div
        className="absolute inset-0 flex flex-col justify-end p-6 z-10"
        style={{
          background: "rgba(13,24,37,0.88)",
          pointerEvents: isHovered ? "auto" : "none",
        }}
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.22 }}
      >
        <motion.span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 10, fontWeight: 700,
            letterSpacing: 3, textTransform: "uppercase" as const,
            color: "#C9A84C", display: "block", marginBottom: 8,
          }}
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.04 : 0, ease }}
        >
          {card.label}
        </motion.span>
        <motion.h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 22, fontWeight: 700,
            lineHeight: 1.15, color: "#FFFFFF",
            margin: "0 0 12px", whiteSpace: "pre-line",
          }}
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.08 : 0, ease }}
        >
          {card.title}
        </motion.h3>
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13, lineHeight: 1.6,
            color: "rgba(255,255,255,0.70)", margin: 0,
          }}
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.12 : 0, ease }}
        >
          {card.desc}
        </motion.p>
        <motion.span
          style={{
            fontFamily: "Poppins, sans-serif",
            marginTop: 16, fontSize: 11, fontWeight: 600,
            letterSpacing: 2, textTransform: "uppercase" as const,
            color: "#FFFFFF", display: "flex", alignItems: "center", gap: 8,
          }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.16 : 0, ease }}
        >
          Conoce más <span style={{ color: "#9e1915" }}>→</span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile card (180px, Pencil nc1–nc4)
// ─────────────────────────────────────────────────────────────

function MobileCard({
  card,
  index,
  cardsInView,
}: {
  card: (typeof mobileCards)[0];
  index: number;
  cardsInView: boolean;
}) {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{ borderRadius: 10, height: 180 }}
      initial={{ opacity: 0, y: 40 }}
      animate={cardsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 * index, ease }}
    >
      {/* Imagen */}
      <Image
        src={card.img}
        alt={card.label}
        fill
        className="object-cover"
        sizes="(max-width: 767px) 92vw, 23vw"
      />

      {/* Gradiente horizontal (L→R: transparente → casi negro) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(13,24,37,0) 30%, rgba(13,24,37,0.94) 100%)",
        }}
      />

      {/* Label + título */}
      <div
        className="absolute"
        style={{ left: 16, bottom: 16, display: "flex", flexDirection: "column", gap: 4 }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: "#C9A84C",
          }}
        >
          {card.label}
        </span>
        <h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {card.title}
        </h3>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sección principal
// ─────────────────────────────────────────────────────────────

const titleLines = [
  { text: "AQUÍ",        weight: 700, size: "clamp(36px,5.28vw,76px)", lh: 1.0,  tracking: -1, opacity: 1   },
  { text: "EXPLORARÁS,", weight: 700, size: "clamp(36px,5.28vw,76px)", lh: 1.0,  tracking: -1, opacity: 1   },
  { text: "CRECERÁS",    weight: 700, size: "clamp(36px,5.28vw,76px)", lh: 1.0,  tracking: -1, opacity: 1   },
  { text: "Y",           weight: 300, size: "clamp(22px,2.78vw,40px)", lh: 1.2,  tracking:  0, opacity: 0.6 },
  { text: "BRILLARÁS.",  weight: 700, size: "clamp(36px,5.28vw,76px)", lh: 1.0,  tracking: -1, opacity: 1   },
];

export function Niveles() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const headingRef       = useRef<HTMLDivElement>(null);
  const desktopCardsRef  = useRef<HTMLDivElement>(null);
  const mobileCardsRef   = useRef<HTMLDivElement>(null);

  const inView             = useInView(headingRef,      { once: true, amount: 0.3  });
  const desktopCardsInView = useInView(desktopCardsRef, { once: true, amount: 0.08 });
  const mobileCardsInView  = useInView(mobileCardsRef,  { once: true, amount: 0.08 });

  return (
    <section className="bg-white py-[80px] md:py-[120px] px-6 md:px-[80px] overflow-hidden">

      {/* ── Titular — desktop: 5 líneas / mobile: 3 líneas ── */}
      <div ref={headingRef} className="text-center mb-12 md:mb-16">

        {/* Label */}
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 11, fontWeight: 700,
            letterSpacing: 3, textTransform: "uppercase",
            color: "#9e1915", marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          Niveles Educativos
        </motion.p>

        {/* Mobile title: 3 líneas compactas */}
        <div className="block md:hidden">
          {["Aquí explorarás,", "crecerás", "y brillarás."].map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 38, fontWeight: 700,
                  lineHeight: 1.15, color: "#1A2B4A", margin: 0,
                  textAlign: "left",
                }}
                initial={{ y: 56, opacity: 0, filter: "blur(8px)" }}
                animate={inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.11, ease: springEase }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
        </div>

        {/* Desktop title: 5 líneas con blur */}
        <div className="hidden md:block">
          {titleLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: line.size, fontWeight: line.weight,
                  lineHeight: line.lh, color: "#1A2B4A", margin: 0,
                  letterSpacing: line.tracking ? `${line.tracking}px` : undefined,
                }}
                initial={{ y: 72, opacity: 0, filter: "blur(10px)" }}
                animate={inView ? { y: 0, opacity: line.opacity, filter: "blur(0px)" } : {}}
                transition={{ duration: 0.75, delay: 0.12 + i * 0.11, ease: springEase }}
              >
                {line.text}
              </motion.h2>
            </div>
          ))}
        </div>
      </div>

      {/* ── Grid desktop ── */}
      <div
        ref={desktopCardsRef}
        className="hidden md:grid grid-cols-4 gap-5 max-w-[1280px] mx-auto"
      >
        {desktopCards.map((card, i) => (
          <DesktopCard
            key={card.id}
            card={card}
            index={i}
            isHovered={hoveredCard === card.id}
            onHover={setHoveredCard}
            cardsInView={desktopCardsInView}
          />
        ))}
      </div>

      {/* ── Stack mobile ── */}
      <div
        ref={mobileCardsRef}
        className="flex md:hidden flex-col gap-4 max-w-[342px] mx-auto"
      >
        {mobileCards.map((card, i) => (
          <MobileCard
            key={card.id}
            card={card}
            index={i}
            cardsInView={mobileCardsInView}
          />
        ))}
      </div>

    </section>
  );
}
