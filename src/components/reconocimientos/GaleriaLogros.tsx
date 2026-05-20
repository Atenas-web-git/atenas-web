"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { LightboxFotos } from "./LightboxFotos";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface Props {
  titulo: string;
  subtitulo: string;
  photos: { src: string; alt: string }[];
  /** Si se pasa, muestra el botón "Ver galería completa →" debajo del mosaico. */
  verCompletaHref?: string;
  /** Texto del botón. Default "Ver galería completa". */
  verCompletaLabel?: string;
}

export function GaleriaLogros({
  titulo,
  subtitulo,
  photos,
  verCompletaHref,
  verCompletaLabel = "Ver galería completa",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(contentRef, { once: true, amount: 0.06 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  // Solo mostramos como máximo 5 fotos en el teaser (las primeras del orden)
  const teaserPhotos = photos.slice(0, 5);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: "var(--color-navy)" }}>
      {/* Parallax bg */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY, opacity: 0.15 }}>
        {teaserPhotos[0] && (
          <Image src={teaserPhotos[0].src} alt="" fill className="object-cover" sizes="100vw" />
        )}
      </motion.div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(26,43,74,0.96) 0%, rgba(26,43,74,0.80) 50%, rgba(26,43,74,0.96) 100%)" }}
      />

      <div ref={contentRef} className="relative z-10 px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-8">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex flex-col gap-1">
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 28, fontWeight: 700, color: "#FFFFFF" }}>
              {titulo}
            </span>
          </div>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", maxWidth: 360 }}>
            {subtitulo}
          </span>
        </motion.div>

        <LightboxFotos
          fotos={photos}
          externalIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />

        {/* Mobile: tall left + 2 stacked right */}
        <div className="flex md:hidden gap-3" style={{ height: 260 }}>
          {teaserPhotos[0] && (
            <PhotoTile
              photo={teaserPhotos[0]}
              onClick={() => setLightboxIndex(0)}
              delay={0.1}
              inView={inView}
              style={{ width: 160, flexShrink: 0 }}
              sizes="160px"
            />
          )}
          <div className="flex flex-col gap-3 flex-1">
            {teaserPhotos[2] && (
              <PhotoTile
                photo={teaserPhotos[2]}
                onClick={() => setLightboxIndex(2)}
                delay={0.2}
                inView={inView}
                style={{ flex: 1 }}
                sizes="50vw"
              />
            )}
            {teaserPhotos[3] && (
              <PhotoTile
                photo={teaserPhotos[3]}
                onClick={() => setLightboxIndex(3)}
                delay={0.3}
                inView={inView}
                style={{ flex: 1 }}
                sizes="50vw"
              />
            )}
          </div>
        </div>

        {/* Desktop: 4-column mosaic grid */}
        <div
          className="hidden md:grid gap-3"
          style={{
            gridTemplateColumns: "2fr 1fr 1.5fr 1fr",
            gridTemplateRows: "170px 170px",
          }}
        >
          {teaserPhotos[0] && (
            <PhotoTile
              photo={teaserPhotos[0]}
              onClick={() => setLightboxIndex(0)}
              delay={0.1}
              inView={inView}
              style={{ gridRow: "1 / 3" }}
              sizes="33vw"
            />
          )}
          {teaserPhotos[1] && (
            <PhotoTile
              photo={teaserPhotos[1]}
              onClick={() => setLightboxIndex(1)}
              delay={0.18}
              inView={inView}
              sizes="16vw"
            />
          )}
          {teaserPhotos[2] && (
            <PhotoTile
              photo={teaserPhotos[2]}
              onClick={() => setLightboxIndex(2)}
              delay={0.26}
              inView={inView}
              style={{ gridRow: "1 / 3" }}
              sizes="25vw"
            />
          )}
          {teaserPhotos[3] && (
            <PhotoTile
              photo={teaserPhotos[3]}
              onClick={() => setLightboxIndex(3)}
              delay={0.34}
              inView={inView}
              style={{ gridRow: "1 / 3" }}
              sizes="16vw"
            />
          )}
          {teaserPhotos[4] && (
            <PhotoTile
              photo={teaserPhotos[4]}
              onClick={() => setLightboxIndex(4)}
              delay={0.42}
              inView={inView}
              sizes="16vw"
            />
          )}
        </div>

        {verCompletaHref && photos.length > 0 && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55, ease }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
              <Link
                href={verCompletaHref}
                className="flex items-center gap-3 rounded-[10px] px-7 py-[14px]"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--color-gold)",
                  background: "rgba(201,168,76,0.10)",
                  border: "1.5px solid rgba(201,168,76,0.45)",
                  textDecoration: "none",
                }}
              >
                {verCompletaLabel} ({photos.length}{" "}
                {photos.length === 1 ? "foto" : "fotos"})
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ fontSize: 14, fontWeight: 700 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function PhotoTile({
  photo,
  onClick,
  delay,
  inView,
  style,
  sizes,
}: {
  photo: { src: string; alt: string };
  onClick: () => void;
  delay: number;
  inView: boolean;
  style?: React.CSSProperties;
  sizes: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden rounded-[12px] group"
      style={{ ...style, padding: 0, border: "none", cursor: "pointer" }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.02 }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "linear-gradient(180deg, rgba(13,24,37,0) 0%, rgba(13,24,37,0.50) 100%)" }}
      />
    </motion.button>
  );
}
