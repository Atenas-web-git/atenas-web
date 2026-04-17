"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Articulo } from "./ArticuloCard";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface ArticuloDestacadoProps {
  articulo: Articulo;
}

export function ArticuloDestacado({ articulo }: ArticuloDestacadoProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="bg-[#F8F5F0] py-0">
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: 480 }}>
        {/* Imagen */}
        <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.08 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ duration: 1.2, ease }}
          >
            <Image
              src={articulo.imagen}
              alt={articulo.titulo}
              fill
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(270deg, rgba(248,245,240,0) 0%, rgba(248,245,240,0.25) 60%, rgba(248,245,240,0.7) 100%)" }} />
          </motion.div>
        </div>

        {/* Contenido */}
        <div className="flex flex-col justify-center gap-[18px] px-8 md:px-14 py-12">
          <motion.div className="flex items-center gap-[8px]" initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.1, ease }}>
            <span
              className="px-[14px] py-[5px] rounded-[4px] text-[10px] font-bold tracking-wider uppercase"
              style={{ fontFamily: "Poppins,sans-serif", background: "#1A2B4A", color: "#FFFFFF" }}
            >
              Destacado
            </span>
            <span
              className="px-[14px] py-[5px] rounded-[20px] text-[11px] font-bold"
              style={{ fontFamily: "Poppins,sans-serif", border: "1px solid #C9A84C", color: "#C9A84C" }}
            >
              {articulo.categoria}
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(22px,2.2vw,32px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.25 }}
              initial={{ y: 40, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.65, delay: 0.2, ease }}
            >
              {articulo.titulo}
            </motion.h2>
          </div>

          <motion.p
            style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(14px,1vw,15px)", color: "rgba(26,43,74,0.65)", lineHeight: 1.65 }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35, ease }}
          >
            {articulo.extracto}
          </motion.p>

          <motion.div
            className="flex items-center gap-[14px]"
            style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(26,43,74,0.55)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.5, ease }}
          >
            <span>{articulo.fecha}</span>
            <span className="w-[4px] h-[4px] rounded-full bg-[#C9A84C]" />
            <span>{articulo.minLectura} min lectura</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.6, ease }}
          >
            <Link
              href={`/revista/${articulo.slug}`}
              className="inline-flex items-center gap-[8px] text-[14px] font-bold hover:opacity-70 transition-opacity"
              style={{ fontFamily: "Poppins,sans-serif", color: "#1A2B4A" }}
            >
              Leer artículo completo
              <span style={{ color: "#C9A84C" }}>→</span>
            </Link>
            <div className="mt-2 h-[2px] w-[200px] bg-[#C9A84C]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
