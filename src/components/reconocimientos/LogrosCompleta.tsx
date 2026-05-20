"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { LightboxFotos } from "./LightboxFotos";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type LogroItem = {
  id: number;
  icon: string;
  titulo: string;
  year: string;
  descripcion: string;
  highlight: boolean;
  fotos: string[];
};

export type SubcategoriaGroup = {
  id: number;
  slug: string;
  nombre: string;
  icon: string;
  logros: LogroItem[];
};

type Props = {
  /** Logros marcados como destacados (highlight=true), de cualquier subcategoría. */
  destacados: LogroItem[];
  /** Logros agrupados por subcategoría. Si está vacío, los logros sueltos se muestran como grid plano. */
  grupos: SubcategoriaGroup[];
  /** Logros sin subcategoría (cuando la categoría no usa subcategorías). */
  logrosSueltos: LogroItem[];
};

export function LogrosCompleta({ destacados, grupos, logrosSueltos }: Props) {
  const [lightboxFotos, setLightboxFotos] = useState<{ src: string; alt: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (logro: LogroItem, startAt = 0) => {
    if (logro.fotos.length === 0) return;
    setLightboxFotos(logro.fotos.map((src) => ({ src, alt: logro.titulo })));
    setLightboxIndex(startAt);
  };

  const isEmpty =
    destacados.length === 0 && grupos.length === 0 && logrosSueltos.length === 0;

  return (
    <section className="relative" style={{ background: "#060E1A" }}>
      <div className="px-6 py-14 md:px-[160px] md:py-[80px] flex flex-col gap-14">

        <LightboxFotos
          fotos={lightboxFotos}
          externalIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />

        {isEmpty && (
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 15,
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
            }}
          >
            Aún no hay logros registrados en esta categoría.
          </p>
        )}

        {destacados.length > 0 && (
          <Bloque
            eyebrow="DESTACADOS"
            heading="Logros que enorgullecen a Atenas"
            subheading="Los reconocimientos más relevantes de esta categoría."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {destacados.map((l, i) => (
                <LogroCard
                  key={l.id}
                  logro={l}
                  index={i}
                  destacado
                  onPhotoClick={(idx) => openLightbox(l, idx)}
                />
              ))}
            </div>
          </Bloque>
        )}

        {grupos.length > 0 &&
          grupos.map((g, gi) => (
            <Bloque
              key={g.id}
              eyebrow={`${g.icon} ${g.nombre.toUpperCase()}`}
              heading={`Logros en ${g.nombre}`}
              subheading={`${g.logros.length} ${g.logros.length === 1 ? "reconocimiento registrado" : "reconocimientos registrados"}.`}
              delay={gi * 0.05}
            >
              {g.logros.length === 0 ? (
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Sin logros registrados.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {g.logros.map((l, i) => (
                    <LogroCard
                      key={l.id}
                      logro={l}
                      index={i}
                      onPhotoClick={(idx) => openLightbox(l, idx)}
                    />
                  ))}
                </div>
              )}
            </Bloque>
          ))}

        {grupos.length === 0 && logrosSueltos.length > 0 && (
          <Bloque eyebrow="TODOS LOS LOGROS" heading="Reconocimientos">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {logrosSueltos.map((l, i) => (
                <LogroCard
                  key={l.id}
                  logro={l}
                  index={i}
                  onPhotoClick={(idx) => openLightbox(l, idx)}
                />
              ))}
            </div>
          </Bloque>
        )}
      </div>
    </section>
  );
}

function Bloque({
  eyebrow,
  heading,
  subheading,
  children,
  delay = 0,
}: {
  eyebrow: string;
  heading: string;
  subheading?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <motion.div
        className="flex items-center gap-[10px]"
        initial={{ opacity: 0, y: 14 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, delay, ease }}
      >
        <motion.span
          className="block bg-gold flex-shrink-0"
          style={{ width: 24, height: 2 }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1 + delay, ease }}
        />
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            color: "var(--color-gold)",
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </span>
      </motion.div>
      <motion.h2
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "clamp(24px,2.36vw,32px)",
          fontWeight: 700,
          color: "#FFFFFF",
          lineHeight: 1.15,
          margin: 0,
        }}
        initial={{ y: 24, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.55, delay: 0.15 + delay, ease }}
      >
        {heading}
      </motion.h2>
      {subheading && (
        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.50)",
            margin: "-12px 0 0",
            maxWidth: 600,
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 + delay, ease }}
        >
          {subheading}
        </motion.p>
      )}
      {children}
    </div>
  );
}

function LogroCard({
  logro,
  index,
  destacado = false,
  onPhotoClick,
}: {
  logro: LogroItem;
  index: number;
  destacado?: boolean;
  onPhotoClick: (index: number) => void;
}) {
  const [activePhoto, setActivePhoto] = useState(0);
  const hasFotos = logro.fotos.length > 0;

  return (
    <motion.div
      className="relative overflow-hidden flex flex-col"
      style={{
        borderRadius: 14,
        background: "var(--color-dark)",
        border: destacado
          ? "1.5px solid rgba(201,168,76,0.55)"
          : "1px solid rgba(255,255,255,0.08)",
      }}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, delay: 0.05 * index, ease }}
    >
      <div
        className="relative cursor-pointer"
        style={{ height: 220 }}
        onClick={() => hasFotos && onPhotoClick(activePhoto)}
        role={hasFotos ? "button" : undefined}
        tabIndex={hasFotos ? 0 : -1}
      >
        {hasFotos ? (
          <Image
            src={logro.fotos[activePhoto]}
            alt={logro.titulo}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <span style={{ fontSize: 60 }}>{logro.icon}</span>
          </div>
        )}

        {hasFotos && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,14,26,0.08) 0%, rgba(6,14,26,0.85) 75%, rgba(6,14,26,0.95) 100%)",
            }}
          />
        )}

        {destacado && (
          <div
            className="absolute flex items-center gap-1 rounded-full px-2 py-1"
            style={{ top: 14, left: 14, background: "rgba(201,168,76,0.92)" }}
          >
            <Star size={10} fill="var(--color-dark)" color="var(--color-dark)" />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 9, fontWeight: 700, color: "var(--color-dark)", letterSpacing: 0.5 }}>
              DESTACADO
            </span>
          </div>
        )}

        {logro.year && (
          <div
            className="absolute rounded-full px-2 py-[4px]"
            style={{ top: 14, right: 14, background: "rgba(13,24,37,0.85)", border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.80)" }}>
              {logro.year}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start gap-2">
          <span style={{ fontSize: 18, lineHeight: 1 }}>{logro.icon}</span>
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.3,
              flex: 1,
            }}
          >
            {logro.titulo}
          </span>
        </div>
        {logro.descripcion && (
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              color: "rgba(201,168,76,0.90)",
            }}
          >
            {logro.descripcion}
          </span>
        )}

        {logro.fotos.length > 1 && (
          <div className="flex items-center gap-[6px] mt-1">
            {logro.fotos.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhoto(i);
                }}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === activePhoto ? 18 : 6,
                  height: 6,
                  background: i === activePhoto ? "var(--color-gold)" : "rgba(255,255,255,0.35)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
