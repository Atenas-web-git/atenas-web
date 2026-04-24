"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface IBCard {
  title: string;
  description: string;
}

interface Props {
  badge: string;
  heading: string;
  headingHighlight?: string;
  paragraphs: string[];
  methods: string[];
  note?: string;
  photos: [string, string, string];
  cardsSectionBadge?: string;
  cardsSectionTitle?: string;
  cardsBgPhoto?: string;
  cards?: IBCard[];
  cardsColumns?: 3 | 4 | 5;
}

/* ─── Stats strip ─── */
function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const stats = [
    { label: "Programa",     value: "Diploma del IB" },
    { label: "Nivel",        value: "1ro y 2do Bachillerato" },
    { label: "Acreditación", value: "IBO — International Baccalaureate" },
  ];
  return (
    <div ref={ref} className="bg-white border-b border-[rgba(26,43,74,0.07)]">
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[rgba(26,43,74,0.07)]">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="flex-1 flex flex-col gap-[4px] px-6 py-5 md:px-[56px] md:py-[28px]"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
          >
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
              {s.label}
            </span>
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, fontWeight: 700, color: "#1A2B4A", lineHeight: 1.3 }}>
              {s.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Photo collage (desktop) ─── */
const collageLayout = [
  { w: 240, h: 295, style: { left: 30,  bottom: 0, rotate: -3 }, delay: 0.3 },
  { w: 175, h: 200, style: { right: 0,  top: 0,    rotate:  4 }, delay: 0.5 },
  { w: 148, h: 165, style: { left: 0,   top: 20,   rotate: -5 }, delay: 0.7 },
];

function PhotoCollage({ photos, inView }: { photos: [string, string, string]; inView: boolean }) {
  return (
    <div className="relative hidden md:block flex-shrink-0" style={{ width: 440, height: 360 }}>
      {collageLayout.map((img, i) => (
        <motion.div
          key={i}
          className="absolute rounded-[14px] overflow-hidden"
          style={{
            width: img.w,
            height: img.h,
            boxShadow: "0 20px 56px rgba(0,0,0,0.22)",
            ...img.style,
          }}
          initial={{ opacity: 0, y: 30, rotate: (img.style.rotate as number) - 4 }}
          animate={inView ? { opacity: 1, y: 0, rotate: img.style.rotate as number } : {}}
          transition={{ duration: 0.75, delay: img.delay, ease }}
          whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
        >
          <Image src={photos[i]} alt="" fill className="object-cover" sizes="280px" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(13,24,37,0) 50%, rgba(13,24,37,0.35) 100%)" }} />
        </motion.div>
      ))}
      <motion.div
        className="absolute z-20 flex items-center gap-[6px] rounded-[8px] px-[14px] py-[9px]"
        style={{ background: "#C9A84C", right: 20, bottom: 20, boxShadow: "0 8px 24px rgba(201,168,76,0.40)" }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.95, ease }}
        whileHover={{ scale: 1.06, transition: { duration: 0.15 } }}
      >
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#0D1825", letterSpacing: 0.8 }}>
          ATENAS IB ★
        </span>
      </motion.div>
    </div>
  );
}

/* ─── Brush stroke SVG underline ─── */
function BrushUnderline({ inView }: { inView: boolean }) {
  return (
    <svg
      className="absolute left-0 w-full pointer-events-none"
      style={{ bottom: -5, height: 14 }}
      viewBox="0 0 320 14"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M 2 10 C 35 4, 85 13, 138 8 C 182 4, 228 12, 272 8 C 296 6, 310 10, 320 7"
        stroke="#C9A84C"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 0.9 } : {}}
        transition={{ duration: 1.0, delay: 0.55, ease: "easeOut" }}
      />
    </svg>
  );
}

/* ─── Cards section (dark, parallax bg) ─── */
function CardsSection({
  badge, title, bgPhoto, cards, cardsColumns = 5,
}: {
  badge?: string;
  title?: string;
  bgPhoto?: string;
  cards: IBCard[];
  cardsColumns?: 3 | 4 | 5;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  const gridClass =
    cardsColumns === 3 ? "grid-cols-1 md:grid-cols-3"
    : cardsColumns === 4 ? "grid-cols-2 md:grid-cols-4"
    : "grid-cols-2 md:grid-cols-5";

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "#0D1825", padding: "80px 0" }}>
      {bgPhoto && (
        <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
          <Image src={bgPhoto} alt="" fill className="object-cover object-center" style={{ opacity: 0.12 }} sizes="100vw" />
        </motion.div>
      )}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 65%)" }} />

      <div ref={ref} className="relative z-10 px-6 md:px-[160px]">
        {(badge || title) && (
          <motion.div
            className="flex flex-col gap-[12px] mb-[48px]"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            {badge && (
              <div className="flex items-center gap-[10px]">
                <motion.span
                  className="block bg-[#C9A84C]"
                  style={{ width: 28, height: 2 }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.1, ease }}
                />
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
                  {badge}
                </span>
              </div>
            )}
            {title && (
              <div className="overflow-hidden">
                <motion.h3
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px, 2.22vw, 32px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}
                  initial={{ y: 40, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.15, ease }}
                >
                  {title}
                </motion.h3>
              </div>
            )}
          </motion.div>
        )}

        <div className={`grid ${gridClass} gap-[12px]`}>
          {cards.map((card, i) => (
            <motion.div
              key={i}
              className="flex flex-col gap-[8px] rounded-[12px] p-[20px] cursor-default"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.20)" }}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.055, ease }}
              whileHover={{
                y: -6,
                boxShadow: "0 16px 48px rgba(201,168,76,0.15)",
                borderColor: "rgba(201,168,76,0.5)",
                transition: { duration: 0.2 },
              }}
            >
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700, color: "#C9A84C" }}>
                {card.title}
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
                {card.description}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main export ─── */
export function SeccionIBDetalle({
  badge, heading, headingHighlight, paragraphs, methods, note, photos,
  cardsSectionBadge, cardsSectionTitle, cardsBgPhoto, cards, cardsColumns = 5,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const headingParts = headingHighlight ? heading.split(headingHighlight) : null;

  return (
    <>
      <StatsStrip />

      <section className="relative bg-[#F8F5F0]">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at top right, rgba(201,168,76,0.05) 0%, transparent 60%)" }} />

        <div
          ref={ref}
          className="relative z-10 flex flex-col md:flex-row gap-[64px] items-start
            px-6 py-[60px] md:px-[160px] md:py-[100px]"
        >
          {/* ─── Columna texto ─── */}
          <div className="flex-1 flex flex-col gap-[24px]">

            {/* Badge */}
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
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
                {badge}
              </span>
            </motion.div>

            {/* Heading con brush underline opcional */}
            <div className="overflow-hidden">
              <motion.h2
                style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(26px, 2.78vw, 40px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.15 }}
                initial={{ y: 50, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.65, delay: 0.15, ease }}
              >
                {headingParts ? (
                  <>
                    {headingParts[0]}
                    <span className="relative inline-block whitespace-nowrap">
                      {headingHighlight}
                      <BrushUnderline inView={inView} />
                    </span>
                    {headingParts[1]}
                  </>
                ) : (
                  heading
                )}
              </motion.h2>
            </div>

            {/* Línea dorada */}
            <motion.span
              className="block bg-[#C9A84C]"
              style={{ width: 40, height: 3, borderRadius: 2 }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.25, ease }}
            />

            {/* Párrafos */}
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: i === 0 ? 15 : 14,
                  color: i === 0 ? "rgba(26,43,74,0.80)" : "rgba(13,24,37,0.58)",
                  lineHeight: 1.75,
                  maxWidth: 580,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.08, ease }}
              >
                {p}
              </motion.p>
            ))}

            {/* Componentes / métodos */}
            <motion.div
              className="flex flex-col gap-[10px]"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45, ease }}
            >
              <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>
                Componentes
              </span>
              <div className="flex flex-wrap gap-[8px]">
                {methods.map((m, i) => (
                  <motion.span
                    key={m}
                    className="rounded-full px-[12px] py-[5px] text-[11px] font-bold cursor-default"
                    style={{ fontFamily: "Poppins, sans-serif", background: "rgba(26,43,74,0.08)", color: "#1A2B4A", letterSpacing: 0.3 }}
                    initial={{ opacity: 0, scale: 0.75 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.06, ease }}
                    whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
                  >
                    {m}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Nota con borde dorado */}
            {note && (
              <motion.div
                style={{ borderLeft: "2px solid #C9A84C", paddingLeft: 16, paddingTop: 12, paddingBottom: 12 }}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55, ease }}
              >
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.55)", lineHeight: 1.65, maxWidth: 520 }}>
                  {note}
                </p>
              </motion.div>
            )}

            {/* Foto única mobile */}
            <motion.div
              className="md:hidden relative overflow-hidden rounded-[14px] mt-4"
              style={{ height: 220 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease }}
            >
              <Image src={photos[0]} alt="" fill className="object-cover" sizes="100vw" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,43,74,0) 50%, rgba(26,43,74,0.45) 100%)" }} />
            </motion.div>
          </div>

          {/* ─── Collage desktop ─── */}
          <PhotoCollage photos={photos} inView={inView} />
        </div>
      </section>

      {/* ─── Tarjetas (opcional) ─── */}
      {cards && cards.length > 0 && (
        <CardsSection
          badge={cardsSectionBadge}
          title={cardsSectionTitle}
          bgPhoto={cardsBgPhoto}
          cards={cards}
          cardsColumns={cardsColumns}
        />
      )}
    </>
  );
}
