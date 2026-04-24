"use client";

import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface Platform { name: string; detail: string }

interface Props {
  badge: string;
  heading: string;
  grades: string;
  ages: string;
  paragraphs: string[];
  methods: string[];
  note?: string;
  platforms?: Platform[];
  photos: [string, string, string];
}

/* ─── Stats strip ─── */
function StatsStrip({ grades, ages }: { grades: string; ages: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const stats = [
    { label: "Grados", value: grades },
    { label: "Rango de edades", value: ages },
    { label: "Institución", value: "Unidad Educativa Atenas" },
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
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </span>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#1A2B4A",
                lineHeight: 1.3,
              }}
            >
              {s.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Photo collage ─── */
const collageLayout = [
  { w: 240, h: 300, style: { left: 30,  bottom: 0, rotate: -3 }, delay: 0.3 },
  { w: 190, h: 220, style: { right: 0,  top: 0,    rotate:  4 }, delay: 0.5 },
  { w: 150, h: 170, style: { left: 0,   top: 40,   rotate: -5 }, delay: 0.7 },
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
        >
          <Image
            src={photos[i]}
            alt=""
            fill
            className="object-cover"
            sizes="280px"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(13,24,37,0) 50%, rgba(13,24,37,0.35) 100%)",
            }}
          />
        </motion.div>
      ))}

      {/* Badge flotante */}
      <motion.div
        className="absolute z-20 flex items-center gap-[6px] rounded-[8px] px-[14px] py-[9px]"
        style={{
          background: "#C9A84C",
          right: 20,
          bottom: 20,
          boxShadow: "0 8px 24px rgba(201,168,76,0.40)",
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.95, ease }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "#0D1825",
            letterSpacing: 0.8,
          }}
        >
          ATENAS ★
        </span>
      </motion.div>
    </div>
  );
}

/* ─── Platform cards ─── */
function PlatformsSection({ platforms }: { platforms: Platform[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "#0D1825", padding: "80px 0" }}>
      {/* Parallax background */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <Image
          src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1440&q=80"
          alt=""
          fill
          className="object-cover object-center"
          style={{ opacity: 0.10 }}
          sizes="100vw"
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at bottom right, rgba(201,168,76,0.07) 0%, transparent 60%)" }}
      />

      <div ref={ref} className="relative z-10 px-6 md:px-[160px]">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-[12px] mb-[48px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-[10px]">
            <span className="block bg-[#C9A84C]" style={{ width: 28, height: 2 }} />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Plataformas digitales
            </span>
          </div>
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 2.22vw, 32px)",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.2,
            }}
          >
            Herramientas de clase mundial
          </h3>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              className="flex flex-col gap-[12px] rounded-[14px] p-[28px]"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,168,76,0.20)",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <div
                className="flex items-center justify-center rounded-[10px]"
                style={{ width: 44, height: 44, background: "rgba(201,168,76,0.14)" }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#C9A84C",
                  }}
                >
                  {p.name.charAt(0)}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  lineHeight: 1.3,
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.65,
                }}
              >
                {p.detail}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Main export ─── */
export function SeccionNivelDetalle({
  badge,
  heading,
  grades,
  ages,
  paragraphs,
  methods,
  note,
  platforms,
  photos,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <>
      <StatsStrip grades={grades} ages={ages} />

      {/* ─── Main content ─── */}
      <section className="relative bg-[#F8F5F0]">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(201,168,76,0.05) 0%, transparent 60%)",
          }}
        />

        <div
          ref={ref}
          className="relative z-10 flex flex-col md:flex-row gap-[64px] items-start
            px-6 py-[60px] md:px-[160px] md:py-[100px]"
        >
          {/* Columna texto */}
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
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#C9A84C",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </span>
            </motion.div>

            {/* Heading */}
            <div className="overflow-hidden">
              <motion.h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(26px, 2.78vw, 40px)",
                  fontWeight: 700,
                  color: "#1A2B4A",
                  lineHeight: 1.15,
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.65, delay: 0.15, ease }}
              >
                {heading}
              </motion.h2>
            </div>

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
                  color:
                    i === 0
                      ? "rgba(26,43,74,0.80)"
                      : "rgba(13,24,37,0.58)",
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

            {/* Metodologías */}
            <motion.div
              className="flex flex-col gap-[10px]"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45, ease }}
            >
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#C9A84C",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Metodologías
              </span>
              <div className="flex flex-wrap gap-[8px]">
                {methods.map((m) => (
                  <span
                    key={m}
                    className="rounded-full px-[12px] py-[5px] text-[11px] font-bold"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      background: "rgba(26,43,74,0.08)",
                      color: "#1A2B4A",
                      letterSpacing: 0.3,
                    }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Nota gold */}
            {note && (
              <motion.div
                style={{
                  borderLeft: "2px solid #C9A84C",
                  paddingLeft: 16,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55, ease }}
              >
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: "rgba(13,24,37,0.55)",
                    lineHeight: 1.65,
                    maxWidth: 520,
                  }}
                >
                  {note}
                </p>
              </motion.div>
            )}

            {/* Mobile: foto única */}
            <motion.div
              className="md:hidden relative overflow-hidden rounded-[14px] mt-4"
              style={{ height: 220 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease }}
            >
              <Image
                src={photos[0]}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(26,43,74,0) 50%, rgba(26,43,74,0.45) 100%)",
                }}
              />
            </motion.div>
          </div>

          {/* Collage desktop */}
          <PhotoCollage photos={photos} inView={inView} />
        </div>
      </section>

      {/* Plataformas (sólo si hay) */}
      {platforms && platforms.length > 0 && (
        <PlatformsSection platforms={platforms} />
      )}
    </>
  );
}
