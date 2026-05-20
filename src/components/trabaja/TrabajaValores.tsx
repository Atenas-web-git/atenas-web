"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type TrabajaValorItem = {
  imagen: string;
  iconName: string;
  color: "gold" | "navy" | "red";
  titulo: string;
  descripcion: string;
};

export type TrabajaValoresProps = {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items?: TrabajaValorItem[];
};

const DEFAULT_ITEMS: TrabajaValorItem[] = [
  {
    imagen: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    iconName: "briefcase",
    color: "gold",
    titulo: "Estabilidad Laboral",
    descripcion:
      "Institución con más de 50 años de trayectoria, reconocida a nivel nacional como colegio IB.",
  },
  {
    imagen: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    iconName: "award",
    color: "navy",
    titulo: "Desarrollo Profesional",
    descripcion:
      "Capacitaciones continuas, programa IB reconocido internacionalmente y red de colaboración docente.",
  },
  {
    imagen: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&q=80",
    iconName: "heart",
    color: "red",
    titulo: "Impacto Real",
    descripcion:
      "Formamos líderes desde Educación Inicial hasta Bachillerato IB, marcando una diferencia en la comunidad.",
  },
];

const COLOR_BG: Record<TrabajaValorItem["color"], string> = {
  gold: "rgba(201,168,76,0.12)",
  navy: "rgba(26,43,74,0.08)",
  red: "rgba(158,25,21,0.08)",
};

const COLOR_FG: Record<TrabajaValorItem["color"], string> = {
  gold: "var(--color-gold)",
  navy: "var(--color-navy)",
  red: "var(--color-red)",
};

export function TrabajaValores({
  eyebrow = "Recursos Humanos",
  heading = "Únete a nuestro equipo",
  description = "Buscamos profesionales apasionados por la educación. Completa el formulario y forma parte de nuestra base de datos de candidatos para futuras convocatorias.",
  items = DEFAULT_ITEMS,
}: TrabajaValoresProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="bg-[#F5F1EB] pt-20 pb-14 px-6 md:px-[160px]">
      <div ref={ref}>
        {/* Header */}
        <div className="mb-12">
          <motion.div
            className="flex items-center gap-[10px] mb-5"
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            <motion.span
              className="block flex-shrink-0 bg-gold"
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
                color: "var(--color-gold)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(28px, 2.92vw, 42px)",
                fontWeight: 700,
                color: "var(--color-navy)",
                lineHeight: 1.15,
                margin: 0,
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.18, ease }}
            >
              {heading}
            </motion.h2>
          </div>

          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(13px, 1.04vw, 15px)",
              color: "rgba(13,24,37,0.55)",
              lineHeight: 1.7,
              maxWidth: 680,
              marginTop: 16,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease }}
          >
            {description}
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((v, i) => (
            <motion.div
              key={`${v.titulo}-${i}`}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#FFFFFF",
                border: "1.5px solid rgba(26,43,74,0.08)",
                boxShadow: "0 4px 24px rgba(13,24,37,0.06)",
              }}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.12, ease }}
              whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(13,24,37,0.10)" }}
            >
              {/* Imagen */}
              {v.imagen && (
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <Image
                    src={v.imagen}
                    alt={v.titulo}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 40%, rgba(13,24,37,0.40) 100%)",
                    }}
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="flex flex-col gap-3 p-6">
                <div
                  className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 44, height: 44, background: COLOR_BG[v.color] }}
                >
                  <DynamicIcon
                    name={v.iconName as IconName}
                    size={20}
                    color={COLOR_FG[v.color]}
                    strokeWidth={1.8}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-navy)",
                    margin: 0,
                  }}
                >
                  {v.titulo}
                </h3>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: "rgba(13,24,37,0.55)",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {v.descripcion}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
