"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import { HighlightText } from "@/components/shared/HighlightText";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type ValorItem = {
  /** Nombre del icono Lucide en kebab-case (ej. "shield", "heart"). */
  icon: string;
  name: string;
  desc: string;
  /** Línea pequeña en color de acento bajo el título (ej. código + versión). */
  subtitle?: string;
  /** Si está presente, la tarjeta es un link a esa URL (interna o externa). */
  href?: string;
  /** Variante de color del acento. Default: "gold". */
  color?: "gold" | "red";
  /** Texto del CTA al final de la tarjeta. Solo aparece si hay href. */
  ctaText?: string;
  /** Si true, borde dorado más intenso. */
  highlight?: boolean;
};

const ACCENT = {
  gold: { fg: "var(--color-gold)", bg: "rgba(201,168,76,0.12)", border: "rgba(201,168,76,0.45)" },
  red: { fg: "var(--color-red)", bg: "rgba(158,25,21,0.10)", border: "rgba(158,25,21,0.45)" },
} as const;

function isExternal(href?: string): boolean {
  return !!href && /^https?:\/\//i.test(href);
}

const FALLBACK_ITEMS: ValorItem[] = [
  {
    icon: "shield",
    name: "Respeto",
    desc: "Es un derecho inalienable de todo ser humano. Reconocemos nuestra individualidad y valoramos la de los demás.",
  },
  {
    icon: "eye",
    name: "Verdad",
    desc: "Hablamos y actuamos de manera coherente con nuestra conciencia y convicciones personales, siendo auténticos y valientes.",
  },
  {
    icon: "heart",
    name: "Solidaridad",
    desc: "Extendemos la mano voluntariamente a quien lo necesita, sintiendo como algo propio el sufrimiento de nuestro prójimo.",
  },
  {
    icon: "star",
    name: "Responsabilidad",
    desc: "Hacemos lo que tenemos que hacer en el momento oportuno y asumimos las consecuencias de nuestras decisiones.",
  },
  {
    icon: "scale",
    name: "Justicia",
    desc: "Somos objetivos y neutrales en la toma de decisiones, comprometidos con la verdad, la conciencia social y la mejora del ambiente.",
  },
  {
    icon: "award",
    name: "Integridad",
    desc: "Actuamos de forma honesta y responsable considerando el sentido de la justicia en todas las acciones que desarrollamos.",
  },
  {
    icon: "users",
    name: "Compañerismo",
    desc: "Comprender, apoyar y ayudar a los demás sin buscar algo a cambio, basado en una actitud de colaboración compartida por todos.",
  },
  {
    icon: "target",
    name: "Perseverancia",
    desc: "Nos esforzamos continuamente para alcanzar lo que nos proponemos y buscamos soluciones a las dificultades que puedan surgir.",
  },
  {
    icon: "anchor",
    name: "Lealtad",
    desc: "Mantener una actitud de fidelidad, honestidad y coherencia en las acciones y decisiones, incluso en situaciones difíciles.",
  },
];

type Props = {
  badge?: string;
  heading?: string;
  description?: string;
  items?: ValorItem[];
  anchorId?: string;
};

export function SeccionValores({
  badge = "VALORES",
  heading = "Nuestros Valores Institucionales",
  description = "Nueve pilares que guían la vida de toda la comunidad educativa: estudiantes, docentes y familias.",
  items,
  anchorId,
}: Props = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  const valores = items && items.length > 0 ? items : FALLBACK_ITEMS;

  return (
    <section ref={ref} id={anchorId || undefined} className="bg-cream scroll-mt-24">
      <div className="px-6 py-20 md:px-[160px] md:py-[100px]">

        {/* Encabezado */}
        <motion.div
          className="flex flex-col gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
        >
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
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(26px, 2.5vw, 38px)",
              fontWeight: 700,
              color: "var(--color-navy)",
              lineHeight: 1.15,
            }}
          >
            <HighlightText text={heading ?? ""} />
          </h2>
          <div style={{ width: 60, height: 3, background: "var(--color-gold)" }} />
          {description && (
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                color: "rgba(26,43,74,0.55)",
                lineHeight: 1.65,
                maxWidth: 640,
              }}
            >
              {description}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valores.map((v, i) => {
            const accent = ACCENT[v.color ?? "gold"];
            const external = isExternal(v.href);
            const cardBody = (
              <>
                <div
                  className="rounded-[12px] flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 48,
                    height: 48,
                    background: accent.bg,
                  }}
                >
                  {v.icon ? (
                    <DynamicIcon name={v.icon as never} size={22} color={accent.fg} />
                  ) : null}
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--color-navy)",
                      lineHeight: 1.3,
                      margin: 0,
                    }}
                  >
                    {v.name}
                  </h3>
                  {v.subtitle && (
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: accent.fg,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {v.subtitle}
                    </span>
                  )}
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 14,
                    color: "rgba(26,43,74,0.60)",
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {v.desc}
                </p>
                {v.href && v.ctaText && (
                  <div className="flex items-center gap-[6px] pt-1">
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: accent.fg,
                      }}
                    >
                      {v.ctaText}
                    </span>
                    <span style={{ color: accent.fg, fontSize: 14, fontWeight: 700 }}>
                      {external ? "↗" : "→"}
                    </span>
                  </div>
                )}
              </>
            );

            const cardClassName =
              "bg-white rounded-[16px] p-7 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200 h-full";
            const cardStyle: React.CSSProperties = {
              boxShadow: "0 8px 32px rgba(26,43,74,0.07)",
              border: v.highlight ? `1px solid ${accent.border}` : "1px solid transparent",
              textDecoration: "none",
            };

            return (
              <motion.div
                key={`${v.name}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.07, ease }}
              >
                {v.href ? (
                  external ? (
                    <a
                      href={v.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardClassName}
                      style={cardStyle}
                    >
                      {cardBody}
                    </a>
                  ) : (
                    <Link href={v.href} className={cardClassName} style={cardStyle}>
                      {cardBody}
                    </Link>
                  )
                ) : (
                  <div className={cardClassName} style={cardStyle}>
                    {cardBody}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
