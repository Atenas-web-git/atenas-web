"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArticuloCard, type Articulo } from "./ArticuloCard";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface GridNoticiasProps {
  articulos: Articulo[];
  titulo?: string;
  verTodosHref?: string;
}

export function GridNoticias({ articulos, titulo = "Lo más reciente", verTodosHref = "/revista" }: GridNoticiasProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef   = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const gridInView   = useInView(gridRef,   { once: true, amount: 0.08 });

  return (
    <section className="bg-white py-[72px] md:py-[96px]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-0">

        {/* Header */}
        <div ref={headerRef} className="flex items-end justify-between mb-[48px]">
          <div className="flex flex-col gap-[8px]">
            <motion.p
              style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}
              initial={{ opacity: 0, y: 12 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, ease }}
            >
              Últimas Noticias
            </motion.p>
            <motion.span
              className="block bg-[#C9A84C]"
              style={{ width: 36, height: 2 }}
              initial={{ scaleX: 0, originX: 0 }} animate={headerInView ? { scaleX: 1 } : {}} transition={{ duration: 0.35, delay: 0.08, ease }}
            />
            <div className="overflow-hidden">
              <motion.h2
                style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(24px,2.5vw,36px)", fontWeight: 700, color: "#1A2B4A", lineHeight: 1.2 }}
                initial={{ y: 40, opacity: 0 }} animate={headerInView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.12, ease }}
              >
                {titulo}
              </motion.h2>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={headerInView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.3, ease }}>
            <Link
              href={verTodosHref}
              className="flex items-center gap-[6px] text-[13px] font-bold hover:opacity-70 transition-opacity"
              style={{ fontFamily: "Poppins,sans-serif", color: "#1A2B4A" }}
            >
              Ver todos los artículos
              <span style={{ color: "#C9A84C" }}>→</span>
            </Link>
          </motion.div>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-[24px] md:gap-[28px]"
        >
          {articulos.map((art, i) => (
            <ArticuloCard key={art.id} articulo={art} index={i} inView={gridInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
