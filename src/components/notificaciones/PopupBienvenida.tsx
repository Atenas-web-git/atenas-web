"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";
import { PopupImagenLibre } from "./PopupImagenLibre";
import { PopupTemplateImagenTexto } from "./PopupTemplateImagenTexto";
import { PopupTemplateDiagonal } from "./PopupTemplateDiagonal";

const STORAGE_PREFIX = "atenas-popup-vista-";

function nextNoVisto(
  items: NotificacionPublica[],
  excludeId?: string
): NotificacionPublica | null {
  if (typeof window === "undefined") return null;
  for (const item of items) {
    if (excludeId && item.id === excludeId) continue;
    try {
      if (window.localStorage.getItem(STORAGE_PREFIX + item.id) !== "1") {
        return item;
      }
    } catch {
      return item;
    }
  }
  return null;
}

/**
 * Wrapper del popup de notificación. Decide qué template renderizar
 * según el campo `modo_visual` de la notificación activa:
 *
 *   - imagen_libre              → solo la imagen cuadrada (sin texto/CTA)
 *   - plantilla_imagen_texto    → variante B (imagen + bloque texto)
 *   - plantilla_diagonal        → variante C (navy con franja diagonal roja)
 *
 * Maneja la lógica de "siguiente popup no visto" cuando hay varios
 * encolados, persistencia en localStorage, animación de entrada/salida y
 * delay inicial.
 */
export function PopupBienvenida({
  items,
}: {
  items: NotificacionPublica[];
}) {
  const [active, setActive] = useState<NotificacionPublica | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const next = nextNoVisto(items);
    if (next) {
      const t = setTimeout(() => {
        setActive(next);
        setVisible(true);
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [items]);

  const close = () => {
    const closingId = active?.id;
    if (closingId) {
      try {
        window.localStorage.setItem(STORAGE_PREFIX + closingId, "1");
      } catch {}
    }
    setVisible(false);
    setTimeout(() => {
      const next = nextNoVisto(items, closingId);
      if (next) {
        setActive(next);
        setTimeout(() => setVisible(true), 150);
      } else {
        setActive(null);
      }
    }, 280);
  };

  if (!active) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center px-4"
          style={{
            background:
              active.modo_visual === "plantilla_diagonal"
                ? "rgba(13,24,37,0.7)"
                : "rgba(13,24,37,0.65)",
            zIndex: 100,
            backdropFilter:
              active.modo_visual === "plantilla_diagonal"
                ? "blur(6px)"
                : "blur(4px)",
          }}
          onClick={close}
        >
          {active.modo_visual === "imagen_libre" && (
            <PopupImagenLibre data={active} onClose={close} />
          )}
          {active.modo_visual === "plantilla_imagen_texto" && (
            <PopupTemplateImagenTexto data={active} onClose={close} />
          )}
          {active.modo_visual === "plantilla_diagonal" && (
            <PopupTemplateDiagonal data={active} onClose={close} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
