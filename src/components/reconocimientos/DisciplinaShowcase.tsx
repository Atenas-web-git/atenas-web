"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface Disciplina {
  slug: string;
  icon: string;
  nombre: string;
  count: number | string;
  countLabel: string;
  photoSrc: string;
  basePath: string;
}

interface Props {
  disciplinas: Disciplina[];
  verTodosHref?: string;
  heading?: string;
  ctaText?: string;
}

export function DisciplinaShowcase({ disciplinas, verTodosHref, heading, ctaText }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060E1A" }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: "#C9A84C" }} />

      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[52px] flex flex-col gap-6">

        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>
            {heading ?? "Por disciplina"}
          </span>
          {verTodosHref && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
              <Link
                href={verTodosHref}
                className="flex items-center gap-2 rounded-[8px] px-4 py-[10px]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#C9A84C",
                  background: "rgba(201,168,76,0.12)",
                  border: "1px solid rgba(201,168,76,0.40)",
                  textDecoration: "none",
                }}
              >
                Ver todos los logros
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
                  →
                </motion.span>
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {disciplinas.map((d, i) => (
            <motion.div
              key={d.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.1 + i * 0.09, ease }}
            >
              <Link
                href={`${d.basePath}/${d.slug}`}
                className="relative block overflow-hidden group"
                style={{ borderRadius: 14, height: 290, textDecoration: "none" }}
              >
                {/* Photo */}
                <Image
                  src={d.photoSrc}
                  alt={d.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(6,14,26,0.12) 0%, rgba(6,14,26,0.95) 68%, rgba(6,14,26,0.98) 100%)" }}
                />

                {/* Sport badge */}
                <div
                  className="absolute flex items-center gap-[6px] rounded-full px-3 py-[5px]"
                  style={{ top: 18, left: 18, background: "rgba(201,168,76,0.92)" }}
                >
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#0D1825" }}>
                    {d.icon} {d.nombre}
                  </span>
                </div>

                {/* Big number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingBottom: 60 }}>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 72, fontWeight: 900, color: "#C9A84C", letterSpacing: -3, lineHeight: 1 }}>
                    {d.count}
                  </span>
                  <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 6 }}>
                    {d.countLabel}
                  </span>
                </div>

                {/* CTA */}
                <div
                  className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-[18px] py-[18px]"
                >
                  <motion.span
                    style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: 600, color: "#C9A84C" }}
                    className="group-hover:underline"
                  >
                    {ctaText ?? "Ver logros"}
                  </motion.span>
                  <motion.span
                    style={{ color: "#C9A84C", fontSize: 13, fontWeight: 700 }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 * i }}
                  >
                    →
                  </motion.span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
