"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima un número de 0 hasta `target` cuando `inView` se vuelve true.
 * @param target  Número final
 * @param duration Duración en segundos
 * @param inView  Trigger: true cuando el elemento entra al viewport
 */
export function useCountUp(
  target: number,
  duration: number,
  inView: boolean
): number {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, inView]);

  return count;
}
