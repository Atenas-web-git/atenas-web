"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function Tagline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-[#F8F5F0] flex flex-col items-center justify-center py-[80px] px-8"
    >
      {/* Líneas doradas + label "NUESTRA RAZÓN DE SER" */}
      <div className="flex items-center gap-5 mb-8">
        <motion.span
          className="block h-[1.5px] bg-[#C9A84C] w-[80px]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, ease }}
          style={{ originX: 1 }}
        />
        <motion.span
          className="text-[#9e1915] text-[11px] font-semibold tracking-[3px] uppercase whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.2, ease }}
        >
          Nuestra razón de ser
        </motion.span>
        <motion.span
          className="block h-[1.5px] bg-[#C9A84C] w-[80px]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, ease }}
          style={{ originX: 0 }}
        />
      </div>

      {/* Título */}
      <div className="text-center">
        <motion.h2
          className="text-[#1A2B4A] font-bold leading-[1.15] text-[clamp(26px,3vw,48px)]"
          initial={{ y: 28, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          La{" "}
          <span className="relative inline-block">
            institución referente
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[5px] bg-[#C9A84C] rounded-sm"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.75, ease }}
              style={{ originX: 0 }}
            />
          </span>{" "}
          de Ambato,
        </motion.h2>

        <motion.h2
          className="text-[#1A2B4A] font-bold leading-[1.15] text-[clamp(26px,3vw,48px)]"
          initial={{ y: 28, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.38, ease }}
        >
          para toda la vida.
        </motion.h2>
      </div>

      {/* Separador dorado */}
      <motion.span
        className="block mt-9 h-[3px] bg-[#C9A84C] w-[64px]"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.65, ease }}
        style={{ originX: 0.5 }}
      />
    </section>
  );
}
