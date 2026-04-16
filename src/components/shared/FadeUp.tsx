"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motionVariants";

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/**
 * Wrapper reutilizable: cada hijo cae desde abajo + fade al entrar al viewport.
 * Usa `delay` para stagger manual, o pasa `custom={i}` si wrappeas con `variants`.
 */
export function FadeUp({ children, delay = 0, className = "" }: FadeUpProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      custom={delay / 0.12}
    >
      {children}
    </motion.div>
  );
}
