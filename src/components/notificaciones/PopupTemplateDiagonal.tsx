"use client";

import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { LogoSVG } from "@/components/shared/LogoSVG";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";
import { sanearHtml, urlSegura } from "@/lib/cms/htmlSeguro";

/**
 * Popup template "Diagonal con personalidad" (variante C)
 *
 * Fondo navy oscuro con franja diagonal roja como detalle gráfico
 * impactante. Logo blanco, título grande blanco, acento dorado, CTA dorado.
 *
 * Se monta desde PopupBienvenida cuando `modo_visual === "plantilla_diagonal"`.
 */
export function PopupTemplateDiagonal({
  data,
  onClose,
}: {
  data: NotificacionPublica;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, y: 24, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.95, y: 12, opacity: 0 }}
      transition={{ duration: 0.36, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden flex flex-col"
      style={{
        width: 460,
        maxWidth: "100%",
        maxHeight: "90vh",
        background: "var(--color-dark)",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        fontFamily: "Poppins, sans-serif",
        border: "1px solid rgba(158,25,21,0.15)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Franja diagonal: rojo + acento dorado + navy */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -60,
          right: -120,
          width: 400,
          height: 200,
          background: "var(--color-red)",
          transform: "rotate(-18deg)",
          opacity: 0.92,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: 30,
          right: -160,
          width: 380,
          height: 4,
          background: "var(--color-red)",
          transform: "rotate(-18deg)",
          opacity: 0.85,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: -30,
          right: -200,
          width: 380,
          height: 80,
          background: "var(--color-navy)",
          transform: "rotate(-18deg)",
          opacity: 0.5,
        }}
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute z-20 transition-opacity hover:opacity-100"
        style={{
          top: 14,
          right: 14,
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.18)",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          opacity: 0.95,
          backdropFilter: "blur(4px)",
        }}
      >
        <X size={16} strokeWidth={2.5} />
      </button>

      <div
        className="relative z-10 flex flex-col items-start gap-1"
        style={{ paddingTop: 32, paddingLeft: 28 }}
      >
        <LogoSVG variant="white" className="w-[90px]" />
        {data.prioridad > 0 && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "var(--color-red)",
              letterSpacing: 2,
              textTransform: "uppercase",
              paddingLeft: 2,
              marginTop: 4,
            }}
          >
            ⚡ Anuncio importante
          </span>
        )}
      </div>

      <div
        className="relative z-10 flex flex-col gap-4"
        style={{ padding: "30px 32px 36px" }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.15,
            maxWidth: 360,
          }}
        >
          {data.titulo}
        </h2>

        <div
          style={{
            width: 48,
            height: 3,
            background: "var(--color-red)",
          }}
        />

        {data.contenido_html && (
          <div
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.7,
              maxWidth: 380,
            }}
            dangerouslySetInnerHTML={{ __html: sanearHtml(data.contenido_html) }}
          />
        )}

        {data.cta_texto && urlSegura(data.cta_url) && (
          <a
            href={urlSegura(data.cta_url)!}
            onClick={onClose}
            className="self-start inline-flex items-center gap-2 mt-3 px-6 transition-colors"
            style={{
              height: 44,
              background: "var(--color-red)",
              color:"#FFFFFF",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.5,
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            {data.cta_texto}
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        )}
      </div>

      {/* Línea decorativa inferior */}
      <div
        className="relative z-10"
        style={{
          marginTop: "auto",
          height: 4,
          background: "linear-gradient(90deg, var(--color-red) 0%, var(--color-red) 50%, var(--color-navy) 100%)",
        }}
      />
    </motion.div>
  );
}
