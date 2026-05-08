"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";

/**
 * Popup template "Imagen libre" (modo 1)
 *
 * Solo muestra la imagen cuadrada (sin texto, badge, ni botón del sistema).
 * Pensado para que la diseñadora del colegio suba un arte completo armado
 * en Photoshop / Canva / Illustrator.
 *
 * Comportamiento:
 *   - Si hay CTA URL, toda la imagen es clickeable (al click navega + cierra)
 *   - Si no hay imagen, no se renderiza
 */
export function PopupImagenLibre({
  data,
  onClose,
}: {
  data: NotificacionPublica;
  onClose: () => void;
}) {
  if (!data.imagen_url) return null;

  const clickeable = !!data.cta_url;
  const titulo = data.titulo || "";

  const handleImagenClick = () => {
    if (!data.cta_url) return;
    onClose();
    if (typeof window !== "undefined") {
      window.location.href = data.cta_url;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.92, y: 16, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.96, y: 8, opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden"
      style={{
        width: 480,
        maxWidth: "100%",
        aspectRatio: "1 / 1",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.40)",
        background: "#0D1825",
        fontFamily: "Poppins, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.imagen_url}
        alt={titulo}
        onClick={clickeable ? handleImagenClick : undefined}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: clickeable ? "pointer" : "default",
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute transition-opacity hover:opacity-100"
        style={{
          top: 12,
          right: 12,
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.92)",
          color: "#1A2B4A",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          opacity: 0.95,
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.20)",
        }}
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
