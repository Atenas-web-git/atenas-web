"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface HeroCategoriaProps {
  nombre: string;
  imagen: string;
  descripcion: string;
  count: number;
  slug: string;
}

export function HeroCategoria({ nombre, imagen, descripcion, count, slug }: HeroCategoriaProps) {
  return (
    <section className="relative overflow-hidden bg-[#0D1825]" style={{ minHeight: 380 }}>
      <Image src={imagen} alt={nombre} fill className="object-cover object-center" style={{ opacity: 0.3 }} priority />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(13,24,37,0.96) 0%, rgba(13,24,37,0.65) 55%, rgba(13,24,37,0.95) 100%)" }} />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-0 pt-[130px] pb-[56px]">
        {/* Breadcrumb */}
        <motion.div className="flex items-center gap-[8px] mb-[20px]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}>
          <Link href="/revista" style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)" }} className="hover:opacity-80 transition-opacity">Revista</Link>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>/</span>
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "#C9A84C", fontWeight: 700 }}>{nombre}</span>
        </motion.div>

        {/* Pill */}
        <motion.span
          className="inline-block px-[16px] py-[6px] rounded-[20px] text-[11px] font-bold mb-[16px]"
          style={{ fontFamily: "Poppins,sans-serif", background: "#C9A84C", color: "#0D1825" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08, ease }}
        >
          {nombre}
        </motion.span>

        {/* Título */}
        <div className="overflow-hidden mb-[12px]">
          <motion.h1
            style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(30px,3.5vw,52px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.15 }}
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.15, ease }}
          >
            Todo sobre<br />{nombre}
          </motion.h1>
        </div>

        <motion.p
          style={{ fontFamily: "Poppins,sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35, ease }}
        >
          {count} {count === 1 ? "artículo publicado" : "artículos publicados"} {descripcion ? `— ${descripcion}` : ""}
        </motion.p>
      </div>
    </section>
  );
}
