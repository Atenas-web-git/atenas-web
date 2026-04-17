"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const categorias = [
  { nombre: "Educación Inicial", count: 12, href: "/revista/categoria/educacion-inicial", imagen: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=400&q=80" },
  { nombre: "Deportes",          count: 9,  href: "/revista/categoria/deportes",          imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80" },
  { nombre: "Cultura",           count: 8,  href: "/revista/categoria/cultura",           imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { nombre: "Bachillerato IB",   count: 15, href: "/revista/categoria/bachillerato-ib",   imagen: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80" },
];

export function PorCategoria() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const gridInView   = useInView(gridRef,   { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={sectionRef} className="relative bg-[#1A2B4A] py-[72px] md:py-[96px] overflow-hidden">
      {/* Ghost 7 */}
      <motion.div className="absolute pointer-events-none select-none" style={{ right: -60, top: -60, y: ghostY }}>
        <span style={{ display: "block", fontFamily: "Poppins,sans-serif", fontSize: 480, fontWeight: 700, color: "#FFFFFF", opacity: 0.03, lineHeight: 1 }}>7</span>
      </motion.div>

      <div className="max-w-[1200px] mx-auto px-6 md:px-0">
        {/* Header */}
        <div ref={headerRef} className="mb-[52px]">
          <motion.p style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }} initial={{ opacity: 0, y: 12 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, ease }}>
            Explorar
          </motion.p>
          <motion.span className="block bg-[#C9A84C] mt-2" style={{ width: 36, height: 2 }} initial={{ scaleX: 0, originX: 0 }} animate={headerInView ? { scaleX: 1 } : {}} transition={{ duration: 0.35, delay: 0.08, ease }} />
          <div className="overflow-hidden mt-2">
            <motion.h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(24px,2.5vw,36px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }} initial={{ y: 40, opacity: 0 }} animate={headerInView ? { y: 0, opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.12, ease }}>
              Por categoría
            </motion.h2>
          </div>
        </div>

        {/* Grid de categorías */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-[16px] md:gap-[20px]">
          {categorias.map((cat, i) => (
            <motion.div
              key={cat.nombre}
              initial={{ opacity: 0, y: 32 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease } }}
            >
              <Link href={cat.href} className="block relative rounded-[12px] overflow-hidden" style={{ height: 200 }}>
                <Image src={cat.imagen} alt={cat.nombre} fill className="object-cover object-center" sizes="300px" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(26,43,74,0.92) 0%, rgba(26,43,74,0.50) 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-[18px]">
                  <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 15, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.3 }}>{cat.nombre}</p>
                  <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{cat.count} artículos</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
