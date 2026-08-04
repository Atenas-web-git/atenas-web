"use client";

/**
 * Resaltado tipo "marcador" para palabras clave dentro de un texto,
 * usando la sintaxis `{palabra}` en el texto plano.
 *
 *   <HighlightText text="Educamos para {transformar} el mundo" />
 *
 * La palabra entre llaves recibe una franja de color (estilo resaltador /
 * highlighter) detrás de la mitad inferior del texto. La franja se "pinta"
 * de izquierda a derecha cuando la palabra entra en pantalla.
 *
 * Detalles de diseño:
 *  - Color dorado semi-transparente: se ve bien tanto sobre fondos claros
 *    (queda un dorado suave) como oscuros (queda una franja cálida tenue),
 *    y el texto encima sigue siendo legible en ambos casos.
 *  - `box-decoration-break: clone` → la franja sigue el texto si la palabra
 *    se parte en varias líneas (importante en mobile).
 *  - Se anima con una transición CSS de `background-size`, disparada al
 *    entrar en viewport con `useInView`.
 *
 * Si el texto no contiene llaves, se renderiza igual sin resaltado.
 */

import { useRef } from "react";
import { useInView } from "framer-motion";

type Props = {
  text: string;
  /** Si false, el resaltado aparece estático (sin animación de entrada). */
  animated?: boolean;
  /** Color del resaltador. Default: dorado semi-transparente. */
  color?: string;
};

export function HighlightText({
  text,
  animated = true,
  color = "rgba(158,25,21,0.5)",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // amount alto: la animación dispara cuando la palabra está bien visible.
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const match = text?.match(/^(.*?)\{(.+?)\}(.*)$/);
  if (!match) {
    return <>{text}</>;
  }
  const [, before, keyword, after] = match;

  const painted = animated ? inView : true;

  return (
    <>
      {before}
      <span
        ref={ref}
        style={{
          // Franja de color en la mitad inferior del texto (52% → 90%):
          // termina por encima del borde para no rozar la línea siguiente
          // y dejar asomar los rasgos descendentes (g, y, p).
          backgroundImage: `linear-gradient(transparent 52%, ${color} 52%, ${color} 90%, transparent 90%)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          // Se anima el ancho: 0% → 100% pinta de izquierda a derecha.
          backgroundSize: painted ? "100% 100%" : "0% 100%",
          transition: animated
            ? "background-size 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.15s"
            : undefined,
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        }}
      >
        {keyword}
      </span>
      {after}
    </>
  );
}
