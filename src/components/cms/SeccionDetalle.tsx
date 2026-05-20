"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HighlightText } from "@/components/shared/HighlightText";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type StatPlantillaD = {
  valor: string;
  label: string;
};

export type FilaPlantillaD = {
  celdas: string[];
  destacada?: boolean;
};

type Props = {
  intro?: {
    badge?: string;
    heading?: string;
    paragraphs?: string[];
  };
  stats?: StatPlantillaD[];
  tabla?: {
    badge?: string;
    heading?: string;
    descripcion?: string;
    columnas: string[];
    filas: FilaPlantillaD[];
    acentoPrimeraColumna?: boolean;
    destacarUltimaColumna?: boolean;
  };
  nota?: {
    icono?: string;
    texto: string;
  };
  anchorId?: string;
};

/**
 * Sección reutilizable para Plantilla D — "Hero + stats + tabla + nota".
 *
 * Pensada para fichas técnicas: valores de matrícula, autorizaciones
 * bancarias, listas de documentos, etc. El diseño replica el estilo dark
 * de la sección de Valores actual (fondo navy oscuro, acentos rojo y
 * dorado).
 *
 * Todas las secciones (intro, stats, tabla, nota) son opcionales.
 */
export function SeccionDetalle({ intro, stats, tabla, nota, anchorId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  const tieneIntro = intro && (intro.heading || (intro.paragraphs && intro.paragraphs.length > 0));
  const tieneStats = stats && stats.length > 0;
  const tieneTabla = tabla && tabla.columnas.length > 0 && tabla.filas.length > 0;
  const tieneNota = nota && nota.texto;

  if (!tieneIntro && !tieneStats && !tieneTabla && !tieneNota) {
    return null;
  }

  return (
    <section
      id={anchorId || undefined}
      className="relative overflow-hidden scroll-mt-24"
      style={{ background: "#060E1A" }}
    >
      {/* Línea roja vertical decorativa a la izquierda */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 4, background: "#9B1B1B" }}
      />

      <div
        ref={ref}
        className="px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-10"
      >
        {/* Intro */}
        {tieneIntro && (
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            {intro?.badge && (
              <div className="flex items-center gap-[10px]">
                <span
                  className="block bg-[#9B1B1B]"
                  style={{ width: 24, height: 2 }}
                />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#9B1B1B",
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                  }}
                >
                  {intro.badge}
                </span>
              </div>
            )}
            {intro?.heading && (
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(22px, 2vw, 30px)",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                <HighlightText text={intro.heading} />
              </h2>
            )}
            {intro?.paragraphs?.map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  maxWidth: 720,
                  margin: 0,
                }}
              >
                {p}
              </p>
            ))}
          </motion.div>
        )}

        {/* Stats */}
        {tieneStats && (
          <motion.div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15, ease }}
          >
            {stats!.map((s, i) => (
              <div
                key={`${s.label}-${i}`}
                className="flex flex-col gap-2 p-5 rounded-[12px]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "var(--color-gold)",
                    lineHeight: 1.05,
                  }}
                >
                  {s.valor}
                </span>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.65)",
                    letterSpacing: 0.5,
                    lineHeight: 1.4,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tabla */}
        {tieneTabla && (
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            {(tabla!.badge || tabla!.heading || tabla!.descripcion) && (
              <div className="flex flex-col gap-2 mb-1">
                {tabla!.badge && (
                  <div className="flex items-center gap-[10px]">
                    <span
                      className="block bg-[#9B1B1B]"
                      style={{ width: 24, height: 2 }}
                    />
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#9B1B1B",
                        letterSpacing: 2.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {tabla!.badge}
                    </span>
                  </div>
                )}
                {tabla!.heading && (
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#FFFFFF",
                      lineHeight: 1.2,
                      margin: 0,
                    }}
                  >
                    {tabla!.heading}
                  </h3>
                )}
                {tabla!.descripcion && (
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 13,
                      color: "rgba(255,255,255,0.50)",
                      lineHeight: 1.65,
                      margin: 0,
                      maxWidth: 640,
                    }}
                  >
                    {tabla!.descripcion}
                  </p>
                )}
              </div>
            )}

            <div
              className="flex flex-col overflow-hidden rounded-[14px]"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${tabla!.columnas.length}, minmax(0, 1fr))`,
                  background: "rgba(255,255,255,0.05)",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  padding: "12px 20px",
                }}
              >
                {tabla!.columnas.map((c, i) => (
                  <span
                    key={`${c}-${i}`}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Filas */}
              {tabla!.filas.map((row, i) => {
                const ultimaCol = tabla!.columnas.length - 1;
                return (
                  <motion.div
                    key={i}
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${tabla!.columnas.length}, minmax(0, 1fr))`,
                      padding: "16px 20px",
                      borderBottom:
                        i < tabla!.filas.length - 1
                          ? "1px solid rgba(255,255,255,0.05)"
                          : "none",
                      background: row.destacada
                        ? "rgba(155,27,27,0.10)"
                        : i % 2 === 0
                        ? "transparent"
                        : "rgba(255,255,255,0.02)",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + i * 0.06,
                      ease,
                    }}
                  >
                    {row.celdas.map((c, j) => {
                      const esPrimera = j === 0;
                      const esUltima = j === ultimaCol;
                      let color = "rgba(255,255,255,0.55)";
                      let weight: 600 | 700 = 600;
                      if (esPrimera && tabla!.acentoPrimeraColumna) {
                        color = "#FFFFFF";
                        weight = 700;
                      }
                      if (esUltima && tabla!.destacarUltimaColumna) {
                        color = "var(--color-gold)";
                        weight = 600;
                      }
                      return (
                        <span
                          key={j}
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: 13,
                            fontWeight: weight,
                            color,
                            lineHeight: 1.4,
                          }}
                        >
                          {c}
                        </span>
                      );
                    })}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Nota */}
        {tieneNota && (
          <motion.div
            className="flex items-start gap-3 rounded-[10px] px-5 py-4"
            style={{
              background: "rgba(155,27,27,0.10)",
              border: "1px solid rgba(155,27,27,0.30)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.45, ease }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>
              {nota?.icono ?? "ℹ️"}
            </span>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.7,
              }}
              dangerouslySetInnerHTML={{ __html: nota!.texto }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
