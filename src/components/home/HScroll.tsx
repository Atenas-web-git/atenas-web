"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import type {
  HScrollPlantillaM,
  SlideHScrollPlantillaM,
} from "@/app/admin/(authenticated)/contenido/plantillas";

// ─────────────────────────────────────────────────────────────
// Layout fijo por índice de slide (estructural, no editable desde CMS)
// ─────────────────────────────────────────────────────────────

type StackedImgLayout = {
  left: string;
  top: string;
  width: string;
  height: string;
  radius: number;
};

type Badge = {
  supSize: number;
  mainSize: number;
  mainWeight: 300 | 400 | 700;
  dotColor: string;
  size: number;
};

type SlideLayout = {
  underlineW: number;
  badge: Badge;
  badgeLeft: string;
  badgeTop: string;
  leftBg: string;
  /** Si true, la imagen principal del CMS ocupa el panel izquierdo full-bleed. */
  imagePrincipalFullBleed: boolean;
  /** Layout (posición/tamaño) de la imagen secundaria del collage. Si null no hay segunda imagen. */
  stackedSecondaryLayout: StackedImgLayout | null;
  goldAccent: { left: string; top: string } | null;
  rightPL: number;
};

// Configs fijas del diseño Pencil para cada uno de los 4 slides.
const LAYOUTS: SlideLayout[] = [
  // Slide 0 — Académico (full-bleed, sin segunda imagen)
  {
    underlineW: 180,
    badge: { supSize: 11, mainSize: 22, mainWeight: 300, dotColor: "var(--color-red)", size: 160 },
    badgeLeft: "40.28%",
    badgeTop: "38.89%",
    leftBg: "transparent",
    imagePrincipalFullBleed: true,
    stackedSecondaryLayout: null,
    goldAccent: null,
    rightPL: 131,
  },
  // Slide 1 — Bachillerato IB
  {
    underlineW: 228,
    badge: { supSize: 9, mainSize: 32, mainWeight: 700, dotColor: "var(--color-red)", size: 148 },
    badgeLeft: "1.94%",
    badgeTop: "54.17%",
    leftBg: "#EEE9E2",
    imagePrincipalFullBleed: false,
    stackedSecondaryLayout: {
      left: "28.79%",
      top: "50%",
      width: "63.64%",
      height: "40.28%",
      radius: 6,
    },
    goldAccent: null,
    rightPL: 72,
  },
  // Slide 2 — Deporte
  {
    underlineW: 192,
    badge: { supSize: 10, mainSize: 18, mainWeight: 300, dotColor: "var(--color-red)", size: 148 },
    badgeLeft: "2.08%",
    badgeTop: "69.44%",
    leftBg: "var(--color-navy)",
    imagePrincipalFullBleed: false,
    stackedSecondaryLayout: {
      left: "40.91%",
      top: "44.44%",
      width: "57.58%",
      height: "40.97%",
      radius: 6,
    },
    goldAccent: null,
    rightPL: 72,
  },
  // Slide 3 — Comunidad
  {
    underlineW: 170,
    badge: { supSize: 9, mainSize: 24, mainWeight: 300, dotColor: "var(--color-red)", size: 148 },
    badgeLeft: "31.25%",
    badgeTop: "9.72%",
    leftBg: "#EEE9E2",
    imagePrincipalFullBleed: false,
    stackedSecondaryLayout: {
      left: "33.33%",
      top: "52.78%",
      width: "63.64%",
      height: "40.28%",
      radius: 6,
    },
    goldAccent: { left: "3.03%", top: "5.56%" },
    rightPL: 72,
  },
];

// ─────────────────────────────────────────────────────────────
// Tipos derivados
// ─────────────────────────────────────────────────────────────

type SlideMerged = SlideHScrollPlantillaM &
  SlideLayout & { id: number; counter: string };

function mergeSlides(
  slides: readonly SlideHScrollPlantillaM[]
): SlideMerged[] {
  const total = slides.length;
  return slides.map((s, i) => ({
    ...LAYOUTS[i],
    ...s,
    id: i,
    counter: `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`,
  }));
}

// ─────────────────────────────────────────────────────────────
// Mobile carousel
// ─────────────────────────────────────────────────────────────

function MobileScrollSection({
  slides,
  ghostLabel,
}: {
  slides: SlideMerged[];
  ghostLabel: string;
}) {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50 && active < slides.length - 1) setActive((p) => p + 1);
    if (dx > 50 && active > 0) setActive((p) => p - 1);
    touchStartX.current = null;
  };

  const slide = slides[active];

  return (
    <section
      className="bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "var(--color-red)",
          padding: "24px 24px 0",
        }}
      >
        {ghostLabel}
      </p>

      <div className="relative w-full overflow-hidden" style={{ height: 230, marginTop: 8 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {slide.imagenPrincipal && (
              <Image
                src={slide.imagenPrincipal}
                alt={slide.headingBold}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(13,24,37,0) 30%, rgba(13,24,37,0.80) 100%)",
          }}
        />

        <div
          className="absolute flex items-center gap-1 rounded-full"
          style={{
            left: 16,
            bottom: 16,
            background: "rgba(13,24,37,0.90)",
            padding: "6px 14px",
          }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-red)",
            }}
          >
            {String(active + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
            }}
          >
            / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="px-6 pt-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--color-red)",
              marginBottom: 8,
            }}
          >
            {slide.tab}
          </p>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "var(--color-navy)",
              margin: "0 0 12px",
              whiteSpace: "pre-line",
            }}
          >
            {slide.headingLight + "\n" + slide.headingBold}
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              lineHeight: 1.65,
              color: "#666666",
            }}
          >
            {slide.mobileBody}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2 px-6 pt-5 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ir a slide ${i + 1}`}
            style={{
              width: i === active ? 8 : 6,
              height: i === active ? 8 : 6,
              borderRadius: "50%",
              background: "var(--color-navy)",
              opacity: i === active ? 1 : 0.25,
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Desktop panoramic sticky scroll
// ─────────────────────────────────────────────────────────────

function DesktopScrollSection({
  slides,
  ghostLabel,
}: {
  slides: SlideMerged[];
  ghostLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const total = slides.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${(total - 1) * 100}vw`]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(total - 1, Math.floor(latest * total));
    if (next !== activeSlide) setActiveSlide(next);
  });

  const tabs = slides.map((s) => s.tab);

  return (
    <div ref={containerRef} style={{ height: `${total * 100}vh`, position: "relative" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full flex"
          style={{ width: `${total * 100}vw`, x }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative flex-shrink-0 h-full overflow-hidden"
              style={{ width: "100vw" }}
            >
              {/* Ghost watermark */}
              <div
                className="absolute z-0 pointer-events-none select-none"
                style={{ left: "4.17%", top: "1.39%", opacity: 0.04 }}
              >
                <span
                  className="font-bold text-navy whitespace-nowrap"
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: "9vw" }}
                >
                  {ghostLabel.toUpperCase()}
                </span>
              </div>

              {/* LEFT PANEL */}
              <div
                className="absolute top-0 left-0 h-full"
                style={{ width: "45.83%", background: slide.leftBg }}
              >
                {slide.imagePrincipalFullBleed && slide.imagenPrincipal && (
                  <Image
                    src={slide.imagenPrincipal}
                    alt={slide.headingBold}
                    fill
                    className="object-cover object-center"
                    sizes="46vw"
                    priority
                  />
                )}

                {slide.goldAccent && (
                  <div
                    className="absolute rounded-sm"
                    style={{
                      left: slide.goldAccent.left,
                      top: slide.goldAccent.top,
                      width: "7.27%",
                      height: 3,
                      background: "var(--color-red)",
                    }}
                  />
                )}

                {!slide.imagePrincipalFullBleed && slide.imagenPrincipal && (
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      left: "4.55%",
                      top: "6.94%",
                      width: "66.67%",
                      height: "51.39%",
                      borderRadius: 6,
                    }}
                  >
                    <Image
                      src={slide.imagenPrincipal}
                      alt={slide.headingBold}
                      fill
                      className="object-cover object-center"
                      sizes="30vw"
                    />
                  </div>
                )}

                {slide.stackedSecondaryLayout && slide.imagenSecundaria && (
                  <div
                    className="absolute overflow-hidden"
                    style={{
                      left: slide.stackedSecondaryLayout.left,
                      top: slide.stackedSecondaryLayout.top,
                      width: slide.stackedSecondaryLayout.width,
                      height: slide.stackedSecondaryLayout.height,
                      borderRadius: slide.stackedSecondaryLayout.radius,
                    }}
                  >
                    <Image
                      src={slide.imagenSecundaria}
                      alt={slide.headingBold}
                      fill
                      className="object-cover object-center"
                      sizes="30vw"
                    />
                  </div>
                )}
              </div>

              {/* BADGE */}
              <motion.div
                className="absolute z-20 rounded-full bg-dark flex flex-col items-center justify-center gap-1 shadow-lg"
                style={{
                  left: slide.badgeLeft,
                  top: slide.badgeTop,
                  width: slide.badge.size,
                  height: slide.badge.size,
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="tracking-[2px] uppercase text-white/60"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: slide.badge.supSize,
                    fontWeight: 700,
                  }}
                >
                  {slide.tab}
                </span>
                <div
                  className="rounded-sm"
                  style={{ width: 24, height: 2, background: slide.badge.dotColor }}
                />
                <span
                  className="text-white/95"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: slide.badge.mainSize,
                    fontWeight: slide.badge.mainWeight,
                  }}
                >
                  {slide.badgeText}
                </span>
              </motion.div>

              {/* RIGHT PANEL */}
              <div
                className="absolute top-0 right-0 h-full bg-cream flex flex-col justify-center"
                style={{
                  width: "54.17%",
                  paddingTop: 80,
                  paddingRight: 72,
                  paddingBottom: 64,
                  paddingLeft: slide.rightPL,
                }}
              >
                <div className="flex gap-8 mb-12">
                  {tabs.map((tab, ti) => {
                    const isActive = ti === slide.id;
                    return (
                      <div key={ti} className="flex flex-col gap-1.5">
                        <span
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: 11,
                            fontWeight: isActive ? 700 : 400,
                            letterSpacing: "2px",
                            color: "var(--color-navy)",
                            opacity: isActive ? 1 : 0.4,
                            textTransform: "uppercase",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {tab}
                        </span>
                        <div
                          style={{
                            height: 2,
                            width: isActive ? 60 : 46,
                            background: isActive ? "var(--color-red)" : "var(--color-navy)",
                            opacity: isActive ? 1 : 0.15,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <span
                  className="mb-5"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "3px",
                    color: "var(--color-red)",
                  }}
                >
                  {slide.counter}
                </span>

                <div className="mb-6">
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "clamp(28px, 3.06vw, 44px)",
                      lineHeight: 1.1,
                      fontWeight: 300,
                      color: "var(--color-navy)",
                      margin: 0,
                    }}
                  >
                    {slide.headingLight}
                  </h2>
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "clamp(28px, 3.06vw, 44px)",
                      lineHeight: 1.1,
                      fontWeight: 700,
                      color: "var(--color-red)",
                      margin: 0,
                    }}
                  >
                    {slide.headingBold}
                  </h2>
                  <div
                    className="mt-1 rounded-sm"
                    style={{ width: slide.underlineW, height: 3, background: "var(--color-red)" }}
                  />
                </div>

                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 15,
                    fontWeight: 400,
                    lineHeight: 1.75,
                    color: "var(--color-navy)",
                    opacity: 0.7,
                    maxWidth: 540,
                    margin: "0 0 40px 0",
                  }}
                >
                  {slide.body}
                </p>

                <div className="flex gap-10">
                  {slide.metrics.map((m, mi) => (
                    <div key={mi} className="flex flex-col gap-1">
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: "var(--color-navy)",
                        }}
                      >
                        {m.value}
                      </span>
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 11,
                          fontWeight: 400,
                          color: "var(--color-navy)",
                          opacity: 0.5,
                          maxWidth: 130,
                          lineHeight: 1.4,
                        }}
                      >
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Ghost label */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none">
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "3px",
              color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
            }}
          >
            {ghostLabel}
          </span>
        </div>

        {/* Bottom tab indicator */}
        <div className="absolute bottom-10 left-8 z-30 flex gap-7">
          {tabs.map((tab, i) => (
            <span
              key={i}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color:
                  i === activeSlide
                    ? "rgba(255,255,255,0.9)"
                    : "rgba(255,255,255,0.3)",
                transition: "color 0.3s ease",
              }}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Gold progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-30">
          <motion.div className="h-full bg-red" style={{ width: progressWidth }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export function HScroll({ hscroll }: { hscroll: HScrollPlantillaM }) {
  const slides = mergeSlides(hscroll.slides);
  const ghostLabel = hscroll.ghostLabel?.trim() || "Vive el Atenas";

  return (
    <>
      <div className="hidden md:block">
        <DesktopScrollSection slides={slides} ghostLabel={ghostLabel} />
      </div>
      <div className="block md:hidden">
        <MobileScrollSection slides={slides} ghostLabel={ghostLabel} />
      </div>
    </>
  );
}
