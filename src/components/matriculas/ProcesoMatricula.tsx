"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const PASOS = [
  {
    num: "01",
    titulo: "Completa el formulario en línea",
    desc: "Accede al portal y llena los datos del estudiante y la familia.",
  },
  {
    num: "02",
    titulo: "Entrega la documentación",
    desc: "Cédula o pasaporte, fotos tamaño carné, certificados médicos y académicos.",
  },
  {
    num: "03",
    titulo: "Entrevista familiar",
    desc: "Reunión breve con el equipo académico para conocerse y resolver dudas.",
  },
  {
    num: "04",
    titulo: "Revisión y aprobación",
    desc: "El comité evalúa la solicitud en un plazo de 5 días hábiles.",
  },
  {
    num: "05",
    titulo: "Firma de contrato y pago",
    desc: "Formaliza la matrícula en secretaría y completa el proceso de pago.",
    isRed: true,
  },
];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80", alt: "Aulas Atenas" },
  { src: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80", alt: "Campus Atenas" },
  { src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80", alt: "Estudiantes Atenas" },
];

export function ProcesoMatricula() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.06 });

  return (
    <section style={{ background: "#F5F1EB" }}>
      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[60px]">

        {/* Mobile: 2-photo row + heading + steps */}
        <div className="flex md:hidden flex-col gap-6">
          <motion.div
            className="flex gap-3"
            style={{ height: 160 }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
          >
            <div className="relative overflow-hidden rounded-[12px] flex-1">
              <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="relative overflow-hidden rounded-[12px] flex-1">
              <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill className="object-cover" sizes="50vw" />
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-1"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: 0.1, ease }}
          >
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#9B1B1B", letterSpacing: 2.5, textTransform: "uppercase" }}>
              Proceso de Matrícula · 2026–2027
            </span>
            <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px,5vw,30px)", fontWeight: 700, color: "#0D1825", lineHeight: 1.15 }}>
              Cómo matricularte en Atenas
            </h2>
          </motion.div>

          <div className="flex flex-col gap-[10px]">
            {PASOS.map((paso, i) => (
              <PasoCard key={paso.num} paso={paso} index={i} inView={inView} />
            ))}
          </div>
        </div>

        {/* Desktop: collage izquierda + content derecha */}
        <div className="hidden md:flex gap-10 items-start">

          {/* Collage */}
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
                <Image src={PHOTOS[0].src} alt={PHOTOS[0].alt} fill className="object-cover" sizes="240px" />
              </div>
              <div className="relative overflow-hidden rounded-[14px]">
                <Image src={PHOTOS[1].src} alt={PHOTOS[1].alt} fill className="object-cover" sizes="220px" />
              </div>
              <div className="relative overflow-hidden rounded-[14px]">
                <Image src={PHOTOS[2].src} alt={PHOTOS[2].alt} fill className="object-cover" sizes="220px" />
              </div>
            </div>
          </motion.div>

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
                  Proceso de Matrícula · 2026–2027
                </span>
              </div>
              <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(24px,2vw,32px)", fontWeight: 700, color: "#0D1825", lineHeight: 1.15 }}>
                Cómo matricularte en Atenas
              </h2>
              <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(13,24,37,0.55)", lineHeight: 1.65, maxWidth: 420 }}>
                Sigue estos cinco pasos y asegura el cupo de tu hijo para el año lectivo 2026–2027.
              </p>
            </motion.div>

            <div className="flex flex-col gap-[10px]">
              {PASOS.map((paso, i) => (
                <PasoCard key={paso.num} paso={paso} index={i} inView={inView} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PasoCard({ paso, index, inView }: { paso: typeof PASOS[number]; index: number; inView: boolean }) {
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
