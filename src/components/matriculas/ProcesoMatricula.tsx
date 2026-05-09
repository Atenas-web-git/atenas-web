"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaJ, PasoMatriculaPlantillaJ } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { proceso: ContenidoPlantillaJ["proceso"] };

export function ProcesoMatricula({ proceso }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  const fotos = proceso.fotos;
  const pasos = proceso.pasos;

  return (
    <section style={{ background: "#F5F1EB" }}>
      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[60px]">

        {/* Mobile: 2-photo row + heading + steps */}
        <div className="flex md:hidden flex-col gap-6">
          {(fotos[0] || fotos[1]) && (
            <motion.div
              className="flex gap-3"
              style={{ height: 160 }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease }}
            >
              <div className="relative overflow-hidden rounded-[12px] flex-1">
                {fotos[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fotos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
              <div className="relative overflow-hidden rounded-[12px] flex-1">
                {fotos[1] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={fotos[1]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1, ease }}
          >
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#9B1B1B", letterSpacing: 2.5, textTransform: "uppercase" }}>
              {proceso.badge}
            </span>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px,5vw,30px)", fontWeight: 700, color: "#0D1825", lineHeight: 1.15 }}>
              {proceso.heading}
            </h2>
          </motion.div>

          <div className="flex flex-col gap-[10px]">
            {pasos.map((paso, i) => (
              <PasoCard key={`${paso.num}-${i}`} paso={paso} index={i} inView={inView} />
            ))}
          </div>
        </div>

        {/* Desktop: collage izquierda + content derecha */}
        <div className="hidden md:flex gap-10 items-start">

          {/* Collage */}
          {(fotos[0] || fotos[1] || fotos[2]) && (
            <motion.div
              className="flex-shrink-0"
              style={{ width: 460 }}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "1fr 1fr",
                  gridTemplateRows: "230px 190px",
                }}
              >
                <div className="relative overflow-hidden rounded-[14px]" style={{ gridRow: "1 / 3" }}>
                  {fotos[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotos[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div className="relative overflow-hidden rounded-[14px]">
                  {fotos[1] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotos[1]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
                <div className="relative overflow-hidden rounded-[14px]">
                  {fotos[2] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotos[2]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Content */}
          <div className="flex flex-col gap-6 flex-1 min-w-0">
            <motion.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15, ease }}
            >
              <div className="flex items-center gap-[10px]">
                <span className="block bg-[#9B1B1B]" style={{ width: 24, height: 2 }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#9B1B1B", letterSpacing: 2.5, textTransform: "uppercase" }}>
                  {proceso.badge}
                </span>
              </div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px,2vw,32px)", fontWeight: 700, color: "#0D1825", lineHeight: 1.15 }}>
                {proceso.heading}
              </h2>
              {proceso.subtitle && (
                <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.55)", lineHeight: 1.65, maxWidth: 420 }}>
                  {proceso.subtitle}
                </p>
              )}
            </motion.div>

            <div className="flex flex-col gap-[10px]">
              {pasos.map((paso, i) => (
                <PasoCard key={`${paso.num}-${i}`} paso={paso} index={i} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PasoCard({ paso, index, inView }: { paso: PasoMatriculaPlantillaJ; index: number; inView: boolean }) {
  const bg = paso.isRed ? "#9B1B1B" : "#0D1825";
  const numColor = paso.isRed ? "rgba(255,255,255,0.45)" : "#C9A84C";

  return (
    <motion.div
      className="flex items-start gap-4 rounded-[12px] px-5 py-4"
      style={{ background: bg }}
      initial={{ opacity: 0, x: 16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: 0.2 + index * 0.08, ease }}
    >
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: numColor, letterSpacing: 1, flexShrink: 0, marginTop: 2 }}>
        {paso.num}
      </span>
      <div className="flex flex-col gap-[3px]">
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>
          {paso.titulo}
        </span>
        <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.55 }}>
          {paso.desc}
        </span>
      </div>
    </motion.div>
  );
}
