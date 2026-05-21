"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type {
  NivelesPlantillaM,
  CardNivelPlantillaM,
} from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const springEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Props = { niveles: NivelesPlantillaM };

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
  card: CardNivelPlantillaM;
  index: number;
  isHovered: boolean;
  onHover: (id: number | null) => void;
  cardsInView: boolean;
}) {
  const Wrapper = card.href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={card.href} className="block h-full w-full" style={{ textDecoration: "none" }}>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{ borderRadius: 12, height: 490, cursor: card.href ? "pointer" : "default" }}
      initial={{ opacity: 0, y: 60 }}
      animate={cardsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay: 0.08 * index, ease }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
    >
      <Wrapper>
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        {card.img && (
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
        )}
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
            color: "var(--color-gold)",
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
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase" as const,
            color: "var(--color-gold)",
            display: "block",
            marginBottom: 8,
          }}
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.04 : 0, ease }}
        >
          {card.label}
        </motion.span>
        <motion.h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.15,
            color: "#FFFFFF",
            margin: "0 0 12px",
            whiteSpace: "pre-line",
          }}
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.08 : 0, ease }}
        >
          {card.title}
        </motion.h3>
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.70)",
            margin: 0,
          }}
          animate={{ y: isHovered ? 0 : 14, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.12 : 0, ease }}
        >
          {card.desc}
        </motion.p>
        <motion.span
          style={{
            fontFamily: "Poppins, sans-serif",
            marginTop: 16,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.28, delay: isHovered ? 0.16 : 0, ease }}
        >
          Conoce más <span style={{ color: "var(--color-red)" }}>→</span>
        </motion.span>
      </motion.div>
      </Wrapper>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile card (180px, sin descripción)
// ─────────────────────────────────────────────────────────────

function MobileCard({
  card,
  index,
  cardsInView,
}: {
  card: CardNivelPlantillaM;
  index: number;
  cardsInView: boolean;
}) {
  const mobileTitle = card.mobileTitle?.trim() || card.title;
  const mobileLabel = card.mobileLabel?.trim() || card.label;
  const Wrapper = card.href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={card.href} className="block h-full w-full" style={{ textDecoration: "none" }}>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{ borderRadius: 10, height: 180, cursor: card.href ? "pointer" : "default" }}
      initial={{ opacity: 0, y: 40 }}
      animate={cardsInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 * index, ease }}
    >
      <Wrapper>
      {card.img && (
        <Image
          src={card.img}
          alt={mobileLabel}
          fill
          className="object-cover"
          sizes="(max-width: 767px) 92vw, 23vw"
        />
      )}

      {/* Degradado de abajo hacia arriba: oscurece la base donde va el
          texto para que no se confunda con la foto. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(13,24,37,0.95) 0%, rgba(13,24,37,0.55) 38%, rgba(13,24,37,0) 78%)",
        }}
      />

      <div
        className="absolute inset-x-0"
        style={{
          bottom: 18,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase" as const,
            color: "var(--color-gold)",
          }}
        >
          {mobileLabel}
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
          {mobileTitle}
        </h3>
      </div>
      </Wrapper>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sección principal
// ─────────────────────────────────────────────────────────────

function sizeFor(weight: number, isLight: boolean): string {
  return isLight ? "clamp(22px,2.78vw,40px)" : "clamp(36px,5.28vw,76px)";
}

export function Niveles({ niveles }: Props) {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const headingRef = useRef<HTMLDivElement>(null);
  const desktopCardsRef = useRef<HTMLDivElement>(null);
  const mobileCardsRef = useRef<HTMLDivElement>(null);

  const inView = useInView(headingRef, { once: true, amount: 0.3 });
  const desktopCardsInView = useInView(desktopCardsRef, { once: true, amount: 0.08 });
  const mobileCardsInView = useInView(mobileCardsRef, { once: true, amount: 0.08 });

  return (
    <section className="bg-white py-[80px] md:py-[120px] px-6 md:px-[80px] overflow-hidden">
      {/* Header */}
      <div ref={headingRef} className="text-center mb-12 md:mb-16">
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--color-red)",
            marginBottom: 24,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          {niveles.eyebrow}
        </motion.p>

        {/* Mobile title */}
        <div className="block md:hidden">
          {niveles.mobileTitleLines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 38,
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: "var(--color-navy)",
                  margin: 0,
                  textAlign: "center",
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

        {/* Desktop title */}
        <div className="hidden md:block">
          {niveles.titleLines.map((line, i) => {
            const isLight = line.weight === 300;
            return (
              <div key={i} className="overflow-hidden">
                <motion.h2
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: sizeFor(line.weight, isLight),
                    fontWeight: line.weight,
                    lineHeight: isLight ? 1.2 : 1.0,
                    color: "var(--color-navy)",
                    margin: 0,
                    letterSpacing: isLight ? undefined : "-1px",
                  }}
                  initial={{ y: 72, opacity: 0, filter: "blur(10px)" }}
                  animate={inView ? { y: 0, opacity: line.opacity, filter: "blur(0px)" } : {}}
                  transition={{ duration: 0.75, delay: 0.12 + i * 0.11, ease: springEase }}
                >
                  {line.text}
                </motion.h2>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid desktop */}
      <div
        ref={desktopCardsRef}
        className="hidden md:grid grid-cols-4 gap-5 max-w-[1280px] mx-auto"
      >
        {niveles.cards.map((card, i) => (
          <DesktopCard
            key={i}
            card={card}
            index={i}
            isHovered={hoveredCard === i}
            onHover={setHoveredCard}
            cardsInView={desktopCardsInView}
          />
        ))}
      </div>

      {/* Stack mobile */}
      <div
        ref={mobileCardsRef}
        className="flex md:hidden flex-col gap-4 max-w-[342px] mx-auto"
      >
        {niveles.cards.map((card, i) => (
          <MobileCard key={i} card={card} index={i} cardsInView={mobileCardsInView} />
        ))}
      </div>
    </section>
  );
}
