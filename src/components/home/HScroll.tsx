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

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type StackedImg = {
  url: string;
  left: string;
  top: string;
  width: string;
  height: string;
  radius: number;
};

type Badge = {
  sup: string;
  supSize: number;
  main: string;
  mainSize: number;
  mainWeight: number;
  dotColor: string;
  size: number;
};

type Slide = {
  id: number;
  counter: string;
  headingLight: string;
  headingBold: string;
  underlineW: number;
  body: string;
  mobileBody: string;
  metrics: { value: string; label: string }[];
  badge: Badge;
  badgeLeft: string;
  badgeTop: string;
  leftBg: string;
  fullBleedImg: string | null;
  stackedImgs: StackedImg[];
  goldAccent: { left: string; top: string } | null;
  rightPL: number;
};

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const TABS = ["ACADÉMICO", "BACHILLERATO IB", "DEPORTE", "COMUNIDAD"];

const slides: Slide[] = [
  {
    id: 0,
    counter: "01 / 04",
    headingLight: "Docentes de",
    headingBold: "Excepción.",
    underlineW: 180,
    body: "Docentes con maestrías y certificaciones internacionales. La primera institución del centro del Ecuador en alcanzar la certificación ISO 9001 — un estándar global de calidad educativa.",
    mobileBody:
      "Docentes con maestrías y certificaciones internacionales. Primera institución del centro del Ecuador con certificación ISO 9001.",
    metrics: [
      { value: "ISO 9001",    label: "Certificación Internacional" },
      { value: "IB Diploma",  label: "Único en el centro del Ecuador" },
      { value: "1,200+",      label: "Estudiantes formados" },
    ],
    badge: {
      sup: "ACADÉMICO", supSize: 11,
      main: "Potencial", mainSize: 22, mainWeight: 300,
      dotColor: "#9e1915", size: 160,
    },
    badgeLeft: "40.28%",
    badgeTop:  "38.89%",
    leftBg: "transparent",
    fullBleedImg: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1080&q=80",
    stackedImgs: [],
    goldAccent: null,
    rightPL: 131,
  },
  {
    id: 1,
    counter: "02 / 04",
    headingLight: "Bachillerato",
    headingBold: "Internacional.",
    underlineW: 228,
    body: "El único programa de Bachillerato Internacional del centro del Ecuador. Desde 2013 el Atenas forma a sus estudiantes para ingresar a las mejores universidades del mundo, en alianza con IBO, USFQ y EF Education.",
    mobileBody:
      "El único programa IB del centro del Ecuador. Desde 2013 formamos estudiantes para ingresar a las mejores universidades del mundo.",
    metrics: [
      { value: "2013",       label: "Autorización IB" },
      { value: "6 áreas",    label: "Del Diploma IB" },
      { value: "USFQ · IBO", label: "Alianzas internacionales" },
    ],
    badge: {
      sup: "BACHILLERATO", supSize: 9,
      main: "IB", mainSize: 32, mainWeight: 700,
      dotColor: "#9e1915", size: 148,
    },
    badgeLeft: "1.94%",
    badgeTop:  "54.17%",
    leftBg: "#EEE9E2",
    fullBleedImg: null,
    stackedImgs: [
      {
        url: "/images/IMG_1932-vis-1-1536x1197.jpg",
        left: "4.55%", top: "6.94%", width: "66.67%", height: "51.39%", radius: 6,
      },
      {
        url: "/images/IMG_1911-2-1536x1024.jpg",
        left: "28.79%", top: "50%", width: "63.64%", height: "40.28%", radius: 6,
      },
    ],
    goldAccent: null,
    rightPL: 72,
  },
  {
    id: 2,
    counter: "03 / 04",
    headingLight: "Deporte de",
    headingBold: "Campeones.",
    underlineW: 192,
    body: "Más de 50 medallas nacionales en 9 disciplinas deportivas. Campeones latinoamericanos de BMX y múltiples títulos intercolegiales que posicionan al Atenas como referente deportivo del centro del Ecuador.",
    mobileBody:
      "Más de 50 medallas nacionales en 9 disciplinas. Campeones latinoamericanos de BMX y múltiples títulos intercolegiales.",
    metrics: [
      { value: "50+",          label: "Medallas nacionales" },
      { value: "9 disciplinas", label: "Deporte escolar" },
      { value: "Latam BMX",    label: "Campeones 2017" },
    ],
    badge: {
      sup: "DEPORTE", supSize: 10,
      main: "Campeones", mainSize: 18, mainWeight: 300,
      dotColor: "#9e1915", size: 148,
    },
    badgeLeft: "2.08%",
    badgeTop:  "69.44%",
    leftBg: "#1A2B4A",
    fullBleedImg: null,
    stackedImgs: [
      {
        url: "/images/00_politicas-de-seguridad-1536x864.jpg",
        left: "0%", top: "0%", width: "57.58%", height: "69.44%", radius: 0,
      },
      {
        url: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80",
        left: "40.91%", top: "44.44%", width: "57.58%", height: "40.97%", radius: 6,
      },
    ],
    goldAccent: null,
    rightPL: 72,
  },
  {
    id: 3,
    counter: "04 / 04",
    headingLight: "50 años de",
    headingBold: "Comunidad.",
    underlineW: 170,
    body: "Una comunidad de miles de graduados que llevan los valores del Atenas al mundo. El proyecto VASE forma personas comprometidas con el respeto, la solidaridad y la verdad desde 1976.",
    mobileBody:
      "Una comunidad de miles de graduados que llevan los valores del Atenas al mundo. El proyecto VASE desde 1976.",
    metrics: [
      { value: "1976",    label: "Año de fundación" },
      { value: "50 años", label: "De historia institucional" },
      { value: "VASE",    label: "Valores, Acción y Servicio" },
    ],
    badge: {
      sup: "COMUNIDAD", supSize: 9,
      main: "Valores", mainSize: 24, mainWeight: 300,
      dotColor: "#C9A84C",
      size: 148,
    },
    badgeLeft: "31.25%",
    badgeTop:  "9.72%",
    leftBg: "#EEE9E2",
    fullBleedImg: null,
    stackedImgs: [
      {
        url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1080&q=80",
        left: "3.03%", top: "8.33%", width: "63.64%", height: "58.33%", radius: 6,
      },
      {
        url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80",
        left: "33.33%", top: "52.78%", width: "63.64%", height: "40.28%", radius: 6,
      },
    ],
    goldAccent: { left: "3.03%", top: "5.56%" },
    rightPL: 72,
  },
];

/* imagen representativa de cada slide para mobile */
const mobileImgs = [
  slides[0].fullBleedImg!,
  slides[1].stackedImgs[0].url,
  "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800&q=80",
  slides[3].stackedImgs[0].url,
];

// ─────────────────────────────────────────────────────────────
// Mobile carousel (mb_scroll — Pencil 390×500)
// ─────────────────────────────────────────────────────────────

function MobileScrollSection() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50 && active < 3) setActive((p) => p + 1);
    if (dx > 50  && active > 0) setActive((p) => p - 1);
    touchStartX.current = null;
  };

  const slide = slides[active];

  return (
    <section
      className="bg-white"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* "VIVE EL ATENAS" label */}
      <p
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#9e1915",
          padding: "24px 24px 0",
        }}
      >
        VIVE EL ATENAS
      </p>

      {/* Foto — 390×230, gradient L→R, badge */}
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
            <Image
              src={mobileImgs[active]}
              alt={slide.headingBold}
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient L→R (transparente → oscuro) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(13,24,37,0) 30%, rgba(13,24,37,0.80) 100%)",
          }}
        />

        {/* Badge "01 / 04" */}
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
              color: "#9e1915",
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
            / 04
          </span>
        </div>
      </div>

      {/* Contenido */}
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
              color: "#9e1915",
              marginBottom: 8,
            }}
          >
            {slide.badge.sup}
          </p>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#1A2B4A",
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

      {/* Dots */}
      <div className="flex items-center gap-2 px-6 pt-5 pb-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ir a slide ${i + 1}`}
            style={{
              width:  i === active ? 8 : 6,
              height: i === active ? 8 : 6,
              borderRadius: "50%",
              background: "#1A2B4A",
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

function DesktopScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-300vw"]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const next = Math.min(3, Math.floor(latest * 4));
    if (next !== activeSlide) setActiveSlide(next);
  });

  return (
    <div ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Strip 400vw */}
        <motion.div
          className="absolute top-0 left-0 h-full flex"
          style={{ width: "400vw", x }}
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
                  className="font-bold text-[#1A2B4A] whitespace-nowrap"
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: "9vw" }}
                >
                  VIVE EL ATENAS
                </span>
              </div>

              {/* LEFT PANEL */}
              <div
                className="absolute top-0 left-0 h-full"
                style={{ width: "45.83%", background: slide.leftBg }}
              >
                {slide.fullBleedImg && (
                  <Image
                    src={slide.fullBleedImg}
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
                      background: "#C9A84C",
                    }}
                  />
                )}

                {slide.stackedImgs.map((img, j) => (
                  <div
                    key={j}
                    className="absolute overflow-hidden"
                    style={{
                      left: img.left, top: img.top,
                      width: img.width, height: img.height,
                      borderRadius: img.radius,
                    }}
                  >
                    <Image
                      src={img.url}
                      alt={slide.headingBold}
                      fill
                      className="object-cover object-center"
                      sizes="30vw"
                    />
                  </div>
                ))}
              </div>

              {/* BADGE */}
              <motion.div
                className="absolute z-20 rounded-full bg-[#0D1825] flex flex-col items-center justify-center gap-1 shadow-lg"
                style={{
                  left: slide.badgeLeft, top: slide.badgeTop,
                  width: slide.badge.size, height: slide.badge.size,
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
                  {slide.badge.sup}
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
                  {slide.badge.main}
                </span>
              </motion.div>

              {/* RIGHT PANEL */}
              <div
                className="absolute top-0 right-0 h-full bg-[#F8F5F0] flex flex-col justify-center"
                style={{
                  width: "54.17%",
                  paddingTop: 80, paddingRight: 72,
                  paddingBottom: 64, paddingLeft: slide.rightPL,
                }}
              >
                {/* Tabs */}
                <div className="flex gap-8 mb-12">
                  {TABS.map((tab, ti) => {
                    const isActive = ti === slide.id;
                    return (
                      <div key={ti} className="flex flex-col gap-1.5">
                        <span
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: 11, fontWeight: isActive ? 700 : 400,
                            letterSpacing: "2px", color: "#1A2B4A",
                            opacity: isActive ? 1 : 0.4,
                            textTransform: "uppercase", whiteSpace: "nowrap",
                          }}
                        >
                          {tab}
                        </span>
                        <div
                          style={{
                            height: 2,
                            width: isActive ? 60 : 46,
                            background: isActive ? "#9e1915" : "#1A2B4A",
                            opacity: isActive ? 1 : 0.15,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Counter */}
                <span
                  className="mb-5"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11, fontWeight: 700,
                    letterSpacing: "3px", color: "#9e1915",
                  }}
                >
                  {slide.counter}
                </span>

                {/* Heading */}
                <div className="mb-6">
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "clamp(28px, 3.06vw, 44px)",
                      lineHeight: 1.1, fontWeight: 300, color: "#1A2B4A", margin: 0,
                    }}
                  >
                    {slide.headingLight}
                  </h2>
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "clamp(28px, 3.06vw, 44px)",
                      lineHeight: 1.1, fontWeight: 700, color: "#9e1915", margin: 0,
                    }}
                  >
                    {slide.headingBold}
                  </h2>
                  <div
                    className="mt-1 rounded-sm"
                    style={{ width: slide.underlineW, height: 3, background: "#9e1915" }}
                  />
                </div>

                {/* Body */}
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 15, fontWeight: 400,
                    lineHeight: 1.75, color: "#1A2B4A", opacity: 0.7,
                    maxWidth: 540, margin: "0 0 40px 0",
                  }}
                >
                  {slide.body}
                </p>

                {/* Metrics */}
                <div className="flex gap-10">
                  {slide.metrics.map((m, mi) => (
                    <div key={mi} className="flex flex-col gap-1">
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 18, fontWeight: 700, color: "#1A2B4A",
                        }}
                      >
                        {m.value}
                      </span>
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: 11, fontWeight: 400,
                          color: "#1A2B4A", opacity: 0.5,
                          maxWidth: 130, lineHeight: 1.4,
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

        {/* "VIVE EL ATENAS" label */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none">
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: "3px", color: "rgba(255,255,255,0.6)",
              textTransform: "uppercase",
            }}
          >
            Vive el Atenas
          </span>
        </div>

        {/* Bottom tab indicator */}
        <div className="absolute bottom-10 left-8 z-30 flex gap-7">
          {TABS.map((tab, i) => (
            <span
              key={i}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10, fontWeight: 700,
                letterSpacing: "2.5px", textTransform: "uppercase",
                color: i === activeSlide
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
          <motion.div className="h-full bg-[#C9A84C]" style={{ width: progressWidth }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export function HScroll() {
  return (
    <>
      {/* Desktop: panoramic sticky scroll (400vh) */}
      <div className="hidden md:block">
        <DesktopScrollSection />
      </div>

      {/* Mobile: swipeable card carousel */}
      <div className="block md:hidden">
        <MobileScrollSection />
      </div>
    </>
  );
}
