"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type LightboxFoto = { src: string; alt: string };

type Props = {
  fotos: LightboxFoto[];
  /** Renderiza el grid de thumbnails. Cada foto al hacer clic abre el lightbox. */
  children?: (open: (index: number) => void) => React.ReactNode;
  /** Si se setea, el lightbox se controla externamente. Si null, queda interno. */
  externalIndex?: number | null;
  onClose?: () => void;
};

export function LightboxFotos({ fotos, children, externalIndex = null, onClose }: Props) {
  const [internalIndex, setInternalIndex] = useState<number | null>(null);
  const activeIndex = externalIndex !== null ? externalIndex : internalIndex;
  const isOpen = activeIndex !== null;

  const close = useCallback(() => {
    setInternalIndex(null);
    onClose?.();
  }, [onClose]);

  const goPrev = useCallback(() => {
    if (activeIndex === null) return;
    const next = (activeIndex - 1 + fotos.length) % fotos.length;
    if (externalIndex !== null) onClose?.();
    setInternalIndex(next);
  }, [activeIndex, fotos.length, externalIndex, onClose]);

  const goNext = useCallback(() => {
    if (activeIndex === null) return;
    const next = (activeIndex + 1) % fotos.length;
    if (externalIndex !== null) onClose?.();
    setInternalIndex(next);
  }, [activeIndex, fotos.length, externalIndex, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, goPrev, goNext]);

  const open = useCallback((index: number) => setInternalIndex(index), []);

  return (
    <>
      {children?.(open)}

      <AnimatePresence>
        {isOpen && activeIndex !== null && fotos[activeIndex] && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: "rgba(6, 14, 26, 0.94)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute top-5 right-5 flex items-center justify-center transition-opacity hover:opacity-70"
              style={{
                width: 44,
                height: 44,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.20)",
                borderRadius: "50%",
                color: "#FFFFFF",
                cursor: "pointer",
              }}
              aria-label="Cerrar"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {fotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-5 md:left-10 flex items-center justify-center transition-opacity hover:opacity-70"
                  style={navBtnStyle}
                  aria-label="Anterior"
                >
                  <ChevronLeft size={28} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-5 md:right-10 flex items-center justify-center transition-opacity hover:opacity-70"
                  style={navBtnStyle}
                  aria-label="Siguiente"
                >
                  <ChevronRight size={28} strokeWidth={2} />
                </button>
              </>
            )}

            <motion.div
              key={activeIndex}
              className="relative flex flex-col items-center px-4 md:px-20"
              style={{ maxWidth: "90vw", maxHeight: "90vh" }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fotos[activeIndex].src}
                alt={fotos[activeIndex].alt}
                style={{
                  maxWidth: "100%",
                  maxHeight: "78vh",
                  objectFit: "contain",
                  borderRadius: 10,
                  boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
                }}
              />
              {fotos[activeIndex].alt && (
                <p
                  className="mt-4"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.65)",
                    maxWidth: 600,
                    textAlign: "center",
                  }}
                >
                  {fotos[activeIndex].alt}
                </p>
              )}
              <p
                className="mt-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  color: "rgba(201,168,76,0.80)",
                  letterSpacing: 1.5,
                }}
              >
                {activeIndex + 1} / {fotos.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const navBtnStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.20)",
  borderRadius: "50%",
  color: "#FFFFFF",
  cursor: "pointer",
};
