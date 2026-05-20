"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import type {
  PorQueAtenasPlantillaM,
  CardPorQuePlantillaM,
} from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { porQueAtenas: PorQueAtenasPlantillaM };

// ─────────────────────────────────────────────────────────────
// Desktop card (imagen arriba + texto abajo)
// ─────────────────────────────────────────────────────────────

function DesktopCard({
  card,
  index,
  inView,
}: {
  card: CardPorQuePlantillaM;
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
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-red z-10 origin-top"
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease }}
      />

      {/* Foto */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        {card.img && (
          <Image
            src={card.img}
            alt={card.label}
            fill
            className="object-cover transition-transform duration-700"
            style={{ transform: hovered ? "scale(1.05)" : "scale(1)" }}
            sizes="23vw"
          />
        )}
      </div>

      {/* Texto */}
      <div className="flex flex-col flex-1 p-6 bg-white">
        <span className="text-red text-[10px] font-semibold tracking-[2px] uppercase mb-2">
          {card.label}
        </span>
        <h3 className="text-navy font-bold text-[17px] leading-[1.3] mb-3">
          {card.title}
        </h3>
        <p className="text-[#666666] text-[13px] leading-[1.65] flex-1">{card.desc}</p>
        {card.href ? (
          <motion.span
            className="mt-4 inline-flex items-center gap-2 w-fit"
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={card.href}
              className="text-navy text-[11px] font-semibold tracking-[2px] uppercase flex items-center gap-2"
              style={{ textDecoration: "none" }}
            >
              Conoce más <span className="text-red">→</span>
            </Link>
          </motion.span>
        ) : null}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile card
// ─────────────────────────────────────────────────────────────

function MobileCard({
  card,
  index,
  inView,
}: {
  card: CardPorQuePlantillaM;
  index: number;
  inView: boolean;
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
      style={{
        borderRadius: 8,
        height: 160,
        border: "1px solid #e0e0e0",
        cursor: card.href ? "pointer" : "default",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.08 * index, ease }}
    >
      <Wrapper>
      {card.img && (
        <Image
          src={card.img}
          alt={mobileLabel}
          fill
          className="object-cover"
          sizes="92vw"
        />
      )}

      <div
        className="absolute left-0 top-0 bottom-0 z-10"
        style={{ width: 3, background: "var(--color-red)" }}
      />

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
            color: "var(--color-red)",
          }}
        >
          {mobileLabel}
        </span>
        <h3
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--color-ink)",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {mobileTitle}
        </h3>
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            color: "var(--color-navy)",
          }}
        >
          CONOCE MÁS →
        </span>
      </div>
      </Wrapper>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Sección principal
// ─────────────────────────────────────────────────────────────

export function PorQueAtenas({ porQueAtenas }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const mobileGridRef = useRef<HTMLDivElement>(null);

  const inView = useInView(headingRef, { once: true, amount: 0.3 });
  const desktopCardsView = useInView(desktopGridRef, { once: true, amount: 0.08 });
  const mobileCardsView = useInView(mobileGridRef, { once: true, amount: 0.08 });

  return (
    <section
      ref={sectionRef}
      className="bg-white py-[80px] md:py-[130px] px-6 md:px-[80px] overflow-hidden relative"
    >
      {/* Ghost text */}
      {porQueAtenas.ghostText && (
        <motion.span
          className="absolute top-[20px] left-0 font-bold text-navy select-none pointer-events-none w-full text-center"
          style={{ fontSize: "clamp(80px, 13vw, 180px)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.04 } : {}}
          transition={{ duration: 1.2, ease }}
        >
          {porQueAtenas.ghostText}
        </motion.span>
      )}

      {/* Header */}
      <div
        ref={headingRef}
        className="relative z-10 mb-10 md:mb-16 md:text-center md:max-w-[640px] md:mx-auto"
      >
        <motion.p
          className="text-red text-[10px] md:text-[11px] font-semibold tracking-[3px] uppercase mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          {porQueAtenas.eyebrow}
        </motion.p>

        <div className="overflow-hidden">
          <motion.h2
            className="text-navy font-light leading-[1.05]"
            style={{ fontSize: "clamp(34px, 4.5vw, 64px)" }}
            initial={{ y: 50, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease }}
          >
            {porQueAtenas.titleLight}
          </motion.h2>
        </div>

        <div className="overflow-hidden">
          <div className="relative inline-block">
            <motion.h2
              className="text-red font-bold leading-[1.05]"
              style={{ fontSize: "clamp(34px, 4.5vw, 64px)" }}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.3, ease }}
            >
              {porQueAtenas.titleBold}
            </motion.h2>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[3px] bg-red"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.55, ease }}
              style={{ originX: 0 }}
            />
          </div>
        </div>

        {porQueAtenas.subtitle && (
          <motion.p
            className="hidden md:block text-[#666666] text-[14px] leading-[1.7] mt-5"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.45, ease }}
          >
            {porQueAtenas.subtitle}
          </motion.p>
        )}
      </div>

      {/* Desktop grid */}
      <div
        ref={desktopGridRef}
        className="relative z-10 hidden md:grid grid-cols-4 gap-5 max-w-[1280px] mx-auto"
      >
        {porQueAtenas.cards.map((card, i) => (
          <DesktopCard key={i} card={card} index={i} inView={desktopCardsView} />
        ))}
      </div>

      {/* Mobile stack */}
      <div
        ref={mobileGridRef}
        className="relative z-10 flex md:hidden flex-col gap-4 max-w-[342px] mx-auto"
      >
        {porQueAtenas.cards.map((card, i) => (
          <MobileCard key={i} card={card} index={i} inView={mobileCardsView} />
        ))}
      </div>
    </section>
  );
}
