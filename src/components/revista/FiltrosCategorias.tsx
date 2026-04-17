"use client";

import { motion } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export const CATEGORIAS = [
  "Todos",
  "Educación Inicial",
  "Primaria",
  "Secundaria",
  "Bachillerato IB",
  "Deportes",
  "Cultura",
  "Egresados",
] as const;

export type Categoria = (typeof CATEGORIAS)[number];

interface FiltrosCategoriasProps {
  activa: Categoria;
  onChange: (c: Categoria) => void;
}

export function FiltrosCategorias({ activa, onChange }: FiltrosCategoriasProps) {
  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#E8E4DD]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-[8px] py-[14px] w-max md:w-auto">
          {CATEGORIAS.map((cat, i) => {
            const isActive = cat === activa;
            return (
              <motion.button
                key={cat}
                onClick={() => onChange(cat)}
                className="flex-shrink-0 px-[18px] py-[8px] rounded-[20px] text-[13px] font-bold transition-colors"
                style={{
                  fontFamily: "Poppins,sans-serif",
                  background: isActive ? "#1A2B4A" : "#F4F2EF",
                  color: isActive ? "#FFFFFF" : "rgba(26,43,74,0.55)",
                  border: isActive ? "none" : "1px solid #E0DBD3",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04, ease }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
