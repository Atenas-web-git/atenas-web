"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HighlightText } from "@/components/shared/HighlightText";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface Props {
  badge: string;
  heading: string;
  paragraphs: string[];
  note?: string;
  imageSrc?: string;
  imageAlt?: string;
  anchorId?: string;
}

export function SeccionTexto({
  badge,
  heading,
  paragraphs,
  note,
  imageSrc,
  imageAlt = "Unidad Educativa Atenas",
  anchorId,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} id={anchorId || undefined} className="bg-cream scroll-mt-24">
      <div className="px-6 py-20 md:px-[160px] md:py-[100px]">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

          {/* ─── Columna texto ─── */}
          <motion.div
            className="flex-1 flex flex-col gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease }}
          >
            {/* Badge */}
            <div className="flex items-center gap-[10px]">
              <span
                className="block bg-gold"
                style={{ width: 28, height: 2 }}
              />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--color-gold)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {badge}
              </span>
            </div>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(26px, 2.5vw, 38px)",
                fontWeight: 700,
                color: "var(--color-navy)",
                lineHeight: 1.15,
              }}
            >
              <HighlightText text={heading} />
            </h2>

            {/* Gold divider */}
            <div style={{ width: 60, height: 3, background: "var(--color-gold)" }} />

            {/* Párrafos */}
            <div className="flex flex-col gap-5">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: i === 0 ? 20 : 15,
                    color:
                      i === 0
                        ? "var(--color-navy)"
                        : "rgba(26,43,74,0.58)",
                    lineHeight: 1.75,
                  }}
                >
                  {p}
                </p>
              ))}
            </div>

            {note && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "rgba(26,43,74,0.45)",
                  lineHeight: 1.65,
                  borderLeft: "2px solid var(--color-gold)",
                  paddingLeft: 14,
                }}
              >
                {note}
              </p>
            )}
          </motion.div>

          {/* ─── Columna imagen — solo desktop, solo si hay URL ─── */}
          {imageSrc && (
            <motion.div
              className="hidden md:block flex-shrink-0"
              style={{ width: 300 }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.18, ease }}
            >
              <div
                className="relative rounded-[16px] overflow-hidden"
                style={{ height: 340 }}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="300px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(26,43,74,0.22) 100%)",
                  }}
                />
              </div>
              {/* Línea dorada decorativa bajo la imagen */}
              <div
                style={{
                  marginTop: 16,
                  height: 2,
                  background:
                    "linear-gradient(90deg, var(--color-gold) 0%, transparent 100%)",
                }}
              />
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
