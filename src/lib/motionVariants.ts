import type { Variants } from "framer-motion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/** Cae desde abajo con fade. Usa `custom={i}` para stagger. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
};

/** Scale + fade para entradas de logo / hero */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease },
  },
};

/** Slide desde la derecha */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
};

/** Línea que se dibuja de izquierda a derecha */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  visible: (delay: number = 0.5) => ({
    scaleX: 1,
    transition: { duration: 0.45, delay, ease },
  }),
};

/** Expand horizontal (para líneas doradas del tagline) */
export const expandWidth: Variants = {
  hidden: { width: 0 },
  visible: (delay: number = 0) => ({
    width: "100%",
    transition: { duration: 0.5, delay, ease },
  }),
};
