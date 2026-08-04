"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HighlightText } from "@/components/shared/HighlightText";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type FilaTarjetaC = {
  label: string;
  value: string;
  destacado?: boolean;
};

export type TarjetaC = {
  color?: string;
  titulo: string;
  filas: FilaTarjetaC[];
};

export type PasoC = {
  texto: string;
  destacado?: boolean;
};

export type GaleriaC = {
  src1: string;
  alt1?: string;
  src2: string;
  alt2?: string;
  src3?: string;
  alt3?: string;
};

type Props = {
  intro?: {
    badge?: string;
    heading?: string;
    descripcion?: string;
  };
  galeria?: GaleriaC;
  tarjetas?: {
    titulo?: string;
    items: TarjetaC[];
  };
  pasos?: {
    badge?: string;
    titulo?: string;
    items: PasoC[];
  };
  nota?: {
    icono?: string;
    texto: string;
  };
  anchorId?: string;
};

/**
 * Sección reutilizable para Plantilla C — "Hero + tarjetas + pasos + nota".
 *
 * Diseño dark con línea dorada izquierda. Pensada para procesos
 * (autorizaciones bancarias, proceso de matrícula, admisión por nivel).
 *
 * Todas las sub-secciones son opcionales.
 */
export function SeccionPasos({ intro, galeria, tarjetas, pasos, nota, anchorId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  const tieneIntro =
    intro && (intro.heading || intro.descripcion);
  const tieneGaleria = galeria && galeria.src1 && galeria.src2;
  const tieneTarjetas = tarjetas && tarjetas.items.length > 0;
  const tienePasos = pasos && pasos.items.length > 0;
  const tieneNota = nota && nota.texto;

  if (!tieneIntro && !tieneGaleria && !tieneTarjetas && !tienePasos && !tieneNota) {
    return null;
  }

  return (
    <section
      id={anchorId || undefined}
      className="relative overflow-hidden scroll-mt-24"
      style={{ background: "#060E1A" }}
    >
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{ width: 4, background: "var(--color-red)" }}
      />

      <div
        ref={ref}
        className="px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-10"
      >
        {/* Intro */}
        {tieneIntro && (
          <motion.div
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            {intro?.badge && (
              <div className="flex items-center gap-[10px]">
                <span className="block bg-red" style={{ width: 24, height: 2 }} />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 10,
                    fontWeight: 700,
                    color:"#FFFFFF",
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
            {intro?.descripcion && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.7,
                  maxWidth: 720,
                  margin: 0,
                }}
              >
                {intro.descripcion}
              </p>
            )}
          </motion.div>
        )}

        {/* Galería en collage (2 fotos mobile, 3 desktop) */}
        {tieneGaleria && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15, ease }}
          >
            {/* Mobile: 2 fotos en row */}
            <div className="flex md:hidden gap-3" style={{ height: 180 }}>
              {[
                { src: galeria!.src1, alt: galeria!.alt1 ?? "" },
                { src: galeria!.src2, alt: galeria!.alt2 ?? "" },
              ].map((p, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  src={p.src}
                  alt={p.alt}
                  className="rounded-[12px] flex-1"
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    // minWidth:0 evita el min-width:auto de los flex items:
                    // sin esto, cada <img> no baja de su ancho intrínseco y
                    // la 2ª foto se desbordaba fuera de pantalla en mobile.
                    minWidth: 0,
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ))}
            </div>

            {/* Desktop: collage de 3 fotos */}
            <div
              className="hidden md:grid gap-3"
              style={{
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "230px 190px",
                maxWidth: 720,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galeria!.src1}
                alt={galeria!.alt1 ?? ""}
                className="rounded-[14px]"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                  gridRow: "1 / 3",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={galeria!.src2}
                alt={galeria!.alt2 ?? ""}
                className="rounded-[14px]"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {galeria!.src3 && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={galeria!.src3}
                  alt={galeria!.alt3 ?? ""}
                  className="rounded-[14px]"
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Tarjetas */}
        {tieneTarjetas && (
          <div className="flex flex-col gap-4">
            {tarjetas!.titulo && (
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                {tarjetas!.titulo}
              </span>
            )}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))`,
              }}
            >
              {tarjetas!.items.map((t, i) => (
                <motion.div
                  key={`${t.titulo}-${i}`}
                  className="flex flex-col gap-4 rounded-[14px] p-6"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
                >
                  <div className="flex items-center gap-3">
                    {t.color && (
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: t.color,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#FFFFFF",
                      }}
                    >
                      {t.titulo}
                    </span>
                  </div>
                  {t.filas.length > 0 && (
                    <div
                      className="flex flex-col gap-[6px]"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        paddingTop: 14,
                      }}
                    >
                      {t.filas.map((f, j) => (
                        <div key={j} className="flex justify-between items-center">
                          <span
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.40)",
                            }}
                          >
                            {f.label}
                          </span>
                          <span
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontSize: 12,
                              fontWeight: f.destacado ? 700 : 500,
                              color: f.destacado ? "var(--color-red)" : "rgba(255,255,255,0.75)",
                            }}
                          >
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pasos */}
        {tienePasos && (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25, ease }}
          >
            {(pasos!.badge || pasos!.titulo) && (
              <div className="flex flex-col gap-1">
                {pasos!.badge && (
                  <div className="flex items-center gap-[10px]">
                    <span className="block bg-red" style={{ width: 24, height: 2 }} />
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 10,
                        fontWeight: 700,
                        color:"#FFFFFF",
                        letterSpacing: 2.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {pasos!.badge}
                    </span>
                  </div>
                )}
                {pasos!.titulo && (
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#FFFFFF",
                    }}
                  >
                    {pasos!.titulo}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-[8px]">
              {pasos!.items.map((p, i) => {
                const numColor = p.destacado ? "rgba(255,255,255,0.5)" : "var(--color-red)";
                const bg = p.destacado ? "#9B1B1B" : "rgba(255,255,255,0.03)";
                return (
                  <motion.div
                    key={i}
                    className="flex items-start gap-4 rounded-[10px] px-4 py-3"
                    style={{ background: bg }}
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: 0.3 + i * 0.06,
                      ease,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: numColor,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: 13,
                        color: p.destacado ? "#FFFFFF" : "rgba(255,255,255,0.65)",
                        fontWeight: p.destacado ? 600 : 400,
                        lineHeight: 1.6,
                      }}
                    >
                      {p.texto}
                    </span>
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
              background: "rgba(158,25,21,0.08)",
              border: "1px solid rgba(158,25,21,0.25)",
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.5, ease }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>{nota?.icono ?? "💬"}</span>
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
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
