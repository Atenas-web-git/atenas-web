"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HighlightText } from "@/components/shared/HighlightText";
import type { TaglinePlantillaM } from "@/app/admin/(authenticated)/contenido/plantillas";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = { tagline: TaglinePlantillaM };

export function Tagline({ tagline }: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-cream flex flex-col items-center justify-center py-[80px] px-8"
    >
      {/* Líneas doradas + eyebrow */}
      <div className="flex items-center gap-5 mb-8">
        <motion.span
          className="block h-[1.5px] bg-gold w-[80px]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, ease }}
          style={{ originX: 1 }}
        />
        <motion.span
          className="text-red text-[11px] font-semibold tracking-[3px] uppercase whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.2, ease }}
        >
          {tagline.eyebrow}
        </motion.span>
        <motion.span
          className="block h-[1.5px] bg-gold w-[80px]"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.55, ease }}
          style={{ originX: 0 }}
        />
      </div>

      {/* Título */}
      <div className="text-center">
        <motion.h2
          className="text-navy font-bold leading-[1.15] text-[clamp(26px,3vw,48px)]"
          initial={{ y: 28, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25, ease }}
        >
          <HighlightText text={tagline.line1} />
        </motion.h2>

        {tagline.line2 && (
          <motion.h2
            className="text-navy font-bold leading-[1.15] text-[clamp(26px,3vw,48px)]"
            initial={{ y: 28, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.38, ease }}
          >
            {tagline.line2}
          </motion.h2>
        )}
      </div>

      {/* Separador dorado */}
      <motion.span
        className="block mt-9 h-[3px] bg-gold w-[64px]"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.45, delay: 0.65, ease }}
        style={{ originX: 0.5 }}
      />
    </section>
  );
}
