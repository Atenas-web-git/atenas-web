"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChatWindow } from "./ChatWindow";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = {
  welcomeMessage: string;
  fallbackMessage: string;
  fallbackCtaLabel: string;
  fallbackCtaUrl: string;
};

/**
 * Botón flotante de la mascota Ateneo en la esquina inferior derecha.
 *
 * Click → abre la ventana del chat. Se oculta automáticamente cuando el
 * mega-menú está abierto (event "atenas:megamenu") para no chocar
 * visualmente.
 */
export function FloatingChatbotClient({
  welcomeMessage,
  fallbackMessage,
  fallbackCtaLabel,
  fallbackCtaUrl,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  // El chatbot solo aparece en páginas públicas — nunca en el backoffice
  // (/admin/*) ni en formularios de admisiones donde puede distraer.
  const isHidden =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/admisiones/formulario") ||
    pathname?.startsWith("/admisiones/seguimiento");

  // Se oculta cuando el mega-menú está abierto (mismo evento que usa FloatingBoot)
  useEffect(() => {
    const onMega = (e: Event) => {
      const detail = (e as CustomEvent<{ open: boolean }>).detail;
      setMenuOpen(Boolean(detail?.open));
    };
    window.addEventListener("atenas:megamenu", onMega as EventListener);
    return () => window.removeEventListener("atenas:megamenu", onMega as EventListener);
  }, []);

  // Burbuja "¿Tienes preguntas?" aparece 3s después de cargar, una sola vez
  useEffect(() => {
    if (open) return;
    const dismissed =
      typeof window !== "undefined" && sessionStorage.getItem("atenas:chat:bubble-dismissed");
    if (dismissed) return;
    const t = setTimeout(() => setBubbleVisible(true), 3000);
    return () => clearTimeout(t);
  }, [open]);

  const dismissBubble = () => {
    setBubbleVisible(false);
    sessionStorage.setItem("atenas:chat:bubble-dismissed", "1");
  };

  const openChat = () => {
    dismissBubble();
    setOpen(true);
  };

  const hidden = menuOpen || open;

  if (isHidden) return null;

  return (
    <>
      {/* Botón flotante con la mascota Comunicador */}
      <AnimatePresence>
        {!hidden && (
          <motion.div
            key="ateneo-floating"
            className="fixed z-40 flex flex-col items-end gap-2"
            style={{ right: 24, bottom: 24 }}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease }}
          >
            {/* Burbuja sugerencia */}
            <AnimatePresence>
              {bubbleVisible && (
                <motion.button
                  key="bubble"
                  type="button"
                  onClick={openChat}
                  className="relative px-4 py-2.5 rounded-2xl cursor-pointer"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E8E4DD",
                    boxShadow: "0 8px 24px rgba(13,24,37,0.15)",
                    fontFamily: "Poppins, sans-serif",
                    maxWidth: 240,
                  }}
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.9 }}
                  transition={{ duration: 0.28, ease }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "#1A2B4A",
                      fontWeight: 500,
                      lineHeight: 1.4,
                      display: "block",
                    }}
                  >
                    ¿Tienes alguna pregunta sobre Atenas?
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissBubble();
                    }}
                    aria-label="Cerrar sugerencia"
                    className="absolute"
                    style={{
                      top: -6,
                      right: -6,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "#1A2B4A",
                      color: "#FFFFFF",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </span>
                  {/* Pico de la burbuja */}
                  <span
                    style={{
                      position: "absolute",
                      right: 24,
                      bottom: -6,
                      width: 12,
                      height: 12,
                      background: "#FFFFFF",
                      borderRight: "1px solid #E8E4DD",
                      borderBottom: "1px solid #E8E4DD",
                      transform: "rotate(45deg)",
                    }}
                  />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Botón principal — mascota flotando libre, sin círculo encerrado */}
            <motion.button
              type="button"
              onClick={openChat}
              aria-label="Abrir asistente Ateneo"
              className="relative"
              style={{
                width: 96,
                height: 110,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              animate={{ y: [0, -6, 0] }}
              transition={{ y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" } }}
            >
              {/* Halo dorado tenue de fondo */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "auto 0 8px 0",
                  margin: "0 auto",
                  width: 70,
                  height: 14,
                  borderRadius: "50%",
                  background: "radial-gradient(ellipse at center, rgba(201,168,76,0.32) 0%, transparent 70%)",
                  filter: "blur(2px)",
                }}
              />
              <Image
                src="/images/ateneo-comunicador.png"
                alt="Ateneo"
                width={200}
                height={220}
                priority
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 12px 18px rgba(13,24,37,0.30))",
                  pointerEvents: "none",
                }}
              />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ventana del chat */}
      <ChatWindow
        open={open}
        onClose={() => setOpen(false)}
        welcomeMessage={welcomeMessage}
        fallbackMessage={fallbackMessage}
        fallbackCtaLabel={fallbackCtaLabel}
        fallbackCtaUrl={fallbackCtaUrl}
      />
    </>
  );
}
