/**
 * Helper para renderizar texto con palabras destacadas con un subrayado
 * dorado animado, usando la sintaxis `{palabra}` en el texto plano.
 *
 * Uso:
 *   <HighlightText text="Educamos para {transformar} el mundo" />
 *
 * Renderiza: "Educamos para [transformar con underline dorado] el mundo".
 *
 * Si el texto no contiene llaves, se renderiza igual sin highlight.
 *
 * Convención: solo se procesa el primer match `{...}` por simplicidad y
 * consistencia visual (múltiples highlights distraen). Para varios highlights
 * en un mismo texto, considerar partir la frase en líneas.
 */

import React from "react";

type Props = {
  text: string;
  /** Si true (default), el underline se anima al aparecer en viewport. */
  animated?: boolean;
  /** Color del underline. Default: var(--color-gold). */
  color?: string;
};

export function HighlightText({ text, animated = true, color }: Props) {
  const match = text?.match(/^(.*?)\{(.+?)\}(.*)$/);
  if (!match) {
    return <>{text}</>;
  }
  const [, before, keyword, after] = match;
  const c = color ?? "var(--color-gold, var(--color-gold))";

  return (
    <>
      {before}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          whiteSpace: "nowrap",
        }}
      >
        {keyword}
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "-0.05em",
            height: "0.18em",
            background: c,
            borderRadius: 999,
            opacity: 0.85,
            transformOrigin: "left center",
            transform: animated ? "scaleX(0)" : "scaleX(1)",
            animation: animated ? "highlightUnderline 0.7s 0.2s ease-out forwards" : undefined,
          }}
        />
      </span>
      {after}
      <style>{`
        @keyframes highlightUnderline {
          to { transform: scaleX(1); }
        }
      `}</style>
    </>
  );
}
