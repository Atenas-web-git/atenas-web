"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LightboxFotos } from "./LightboxFotos";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type GaleriaFoto = { src: string; alt: string };

export function GaleriaCompleta({
  titulo,
  subtitulo,
  photos,
}: {
  titulo: string;
  subtitulo: string;
  photos: GaleriaFoto[];
}) {
  return (
    <section className="relative" style={{ background: "#060E1A" }}>
      <div className="px-6 py-14 md:px-[160px] md:py-[80px] flex flex-col gap-10">
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-[10px]">
            <span className="block bg-gold" style={{ width: 24, height: 2 }} />
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
              GALERÍA COMPLETA
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(26px,2.6vw,36px)",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {titulo}
          </h1>
          {subtitulo && (
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.55)",
                maxWidth: 560,
                margin: 0,
              }}
            >
              {subtitulo}
            </p>
          )}
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              color: "rgba(201,168,76,0.80)",
              letterSpacing: 1.5,
              marginTop: 8,
            }}
          >
            {photos.length} {photos.length === 1 ? "FOTO" : "FOTOS"}
          </p>
        </motion.div>

        {photos.length === 0 ? (
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(255,255,255,0.55)",
              textAlign: "center",
            }}
          >
            Aún no hay fotos en esta galería.
          </p>
        ) : (
          <LightboxFotos fotos={photos}>
            {(open) => (
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}
              >
                {photos.map((p, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => open(i)}
                    className="relative overflow-hidden rounded-[12px] group"
                    style={{
                      aspectRatio: i % 5 === 0 || i % 5 === 3 ? "3/4" : "4/3",
                      padding: 0,
                      border: "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer",
                      background: "var(--color-dark)",
                    }}
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.45, delay: (i % 8) * 0.04, ease }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 220px"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(13,24,37,0) 0%, rgba(13,24,37,0.50) 100%)",
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </LightboxFotos>
        )}
      </div>
    </section>
  );
}
