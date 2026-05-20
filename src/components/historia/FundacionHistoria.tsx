"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaI } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { fundacion: ContenidoPlantillaI["fundacion"] };

export function FundacionHistoria({ fundacion }: Props) {
  // Un solo ref en el <section> (siempre visible). Antes había dos
  // <div ref={ref}> —mobile y desktop— compartiendo el mismo ref; en
  // mobile el ref terminaba apuntando al div desktop (display:none) y
  // useInView nunca disparaba → el texto quedaba con opacity:0 invisible.
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="relative bg-white overflow-hidden">

      {/* ─── Mobile ─── */}
      <div className="md:hidden">
        {/* Dos imágenes lado a lado (usamos secundaria1 y secundaria2 para mantener simetría) */}
        <div className="flex">
          <div className="relative flex-1" style={{ height: 240 }}>
            {fundacion.fotoSecundaria1 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fundacion.fotoSecundaria1}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
          <div className="relative flex-1" style={{ height: 240 }}>
            {fundacion.fotoSecundaria2 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fundacion.fotoSecundaria2}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Texto */}
        <div className="px-6 pt-8 pb-14">
          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "var(--color-gold)",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            {fundacion.badge}
          </motion.p>

          <motion.span
            className="block bg-gold mt-[5px] mb-[15px]"
            style={{ width: 32, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />

          <motion.h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "var(--color-navy)",
              lineHeight: 1.15,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15, ease }}
          >
            {fundacion.heading}
          </motion.h2>

          {fundacion.paragraph1 && (
            <motion.p
              className="mt-8"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                color: "rgba(26,43,74,0.60)",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease }}
            >
              {fundacion.paragraph1}
            </motion.p>
          )}

          {fundacion.paragraph2 && (
            <>
              <motion.span
                className="block bg-gold"
                style={{ width: 40, height: 3, marginTop: 32, marginBottom: 14 }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4, ease }}
              />
              <motion.p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-navy)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5, ease }}
              >
                {fundacion.paragraph2}
              </motion.p>
            </>
          )}
        </div>
      </div>

      {/* ─── Desktop ─── */}
      <div
        className="hidden md:block relative"
        style={{ height: 760, maxWidth: 1440, marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Columna de texto */}
        <div className="absolute" style={{ left: 160, top: 0, width: 460, paddingTop: 120 }}>
          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-gold)",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            {fundacion.badge}
          </motion.p>

          <motion.span
            className="block bg-gold"
            style={{ width: 40, height: 2, marginTop: 8, marginBottom: 8 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />

          <motion.h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              color: "var(--color-navy)",
              lineHeight: 1.1,
              marginTop: 11,
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            {fundacion.heading}
          </motion.h2>

          {fundacion.paragraph1 && (
            <motion.p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                color: "rgba(26,43,74,0.60)",
                lineHeight: 1.7,
                marginTop: 52,
                whiteSpace: "pre-line",
              }}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.3, ease }}
            >
              {fundacion.paragraph1}
            </motion.p>
          )}

          {fundacion.paragraph2 && (
            <>
              <motion.span
                className="block bg-gold"
                style={{ width: 48, height: 3, marginTop: 86, marginBottom: 16 }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.45, ease }}
              />
              <motion.p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-navy)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55, ease }}
              >
                {fundacion.paragraph2}
              </motion.p>
            </>
          )}
        </div>

        {/* Imagen principal — 320×580 */}
        {fundacion.fotoPrincipal && (
          <motion.div
            className="absolute rounded-[8px] overflow-hidden"
            style={{ left: 796, top: 80, width: 320, height: 580 }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fundacion.fotoPrincipal} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Imagen secundaria 1 */}
        {fundacion.fotoSecundaria1 && (
          <motion.div
            className="absolute rounded-[8px] overflow-hidden"
            style={{ left: 1132, top: 80, width: 188, height: 282 }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fundacion.fotoSecundaria1} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Imagen secundaria 2 */}
        {fundacion.fotoSecundaria2 && (
          <motion.div
            className="absolute rounded-[8px] overflow-hidden"
            style={{ left: 1132, top: 378, width: 188, height: 282 }}
            initial={{ opacity: 0, y: 36 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5, ease }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={fundacion.fotoSecundaria2} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
