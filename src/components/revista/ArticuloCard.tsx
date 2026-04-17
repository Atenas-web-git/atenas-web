"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  categoria: string;
  fecha: string;
  minLectura: number;
  imagen: string;
  destacado?: boolean;
}

interface ArticuloCardProps {
  articulo: Articulo;
  index?: number;
  inView?: boolean;
}

export function ArticuloCard({ articulo, index = 0, inView = true }: ArticuloCardProps) {
  return (
    <motion.article
      className="rounded-[12px] overflow-hidden flex flex-col bg-white"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #E8E4DD" }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.08, ease }}
      whileHover={{ y: -8, boxShadow: "0 20px 48px rgba(0,0,0,0.13)", transition: { duration: 0.3, ease } }}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.06, transition: { duration: 0.5, ease } }}
        >
          <Image
            src={articulo.imagen}
            alt={articulo.titulo}
            fill
            className="object-cover object-center"
            sizes="(max-width:768px) 100vw, 400px"
          />
        </motion.div>
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col gap-[10px] p-5 flex-1">
        <span
          className="self-start px-[12px] py-[5px] rounded-[20px] text-[11px] font-bold"
          style={{ fontFamily: "Poppins,sans-serif", background: "rgba(26,43,74,0.07)", color: "#1A2B4A" }}
        >
          {articulo.categoria}
        </span>

        <h3
          className="font-bold leading-[1.3]"
          style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(15px,1.2vw,17px)", color: "#1A2B4A" }}
        >
          {articulo.titulo}
        </h3>

        <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(26,43,74,0.6)", lineHeight: 1.6 }}>
          {articulo.extracto}
        </p>

        <div className="flex items-center gap-[10px] mt-auto pt-2">
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "rgba(26,43,74,0.55)" }}>{articulo.fecha}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#C9A84C]" />
          <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "rgba(26,43,74,0.55)" }}>{articulo.minLectura} min lectura</span>
        </div>

        <Link
          href={`/revista/${articulo.slug}`}
          className="text-[13px] font-bold transition-opacity hover:opacity-70"
          style={{ fontFamily: "Poppins,sans-serif", color: "#C9A84C" }}
        >
          Leer más →
        </Link>
      </div>
    </motion.article>
  );
}
