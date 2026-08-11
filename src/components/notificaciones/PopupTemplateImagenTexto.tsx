"use client";

import { motion } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";
import { sanearHtml, urlSegura } from "@/lib/cms/htmlSeguro";

/**
 * Popup template "Imagen + texto" (variante B)
 *
 * Top: imagen 1:1 (cuadrada). Bottom: bloque blanco con badge rojo,
 * título navy, contenido HTML y CTA rojo.
 *
 * Se monta desde PopupBienvenida cuando `modo_visual === "plantilla_imagen_texto"`.
 */
export function PopupTemplateImagenTexto({
  data,
  onClose,
}: {
  data: NotificacionPublica;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.94, y: 16, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0.97, y: 8, opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative bg-white overflow-hidden flex flex-col"
      style={{
        width: 460,
        maxWidth: "100%",
        maxHeight: "92vh",
        borderRadius: 16,
        boxShadow: "0 24px 60px rgba(0,0,0,0.32)",
        fontFamily: "Poppins, sans-serif",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Imagen cuadrada */}
      <div
        className="relative"
        style={{
          aspectRatio: "1 / 1",
          background: "linear-gradient(135deg, var(--color-navy) 0%, var(--color-red) 100%)",
        }}
      >
        {data.imagen_url && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={data.imagen_url}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute transition-opacity hover:opacity-100"
          style={{
            top: 12,
            right: 12,
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.92)",
            color: "var(--color-navy)",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            opacity: 0.95,
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div
        className="flex flex-col gap-3 px-7 py-6"
        style={{ background: "#FFFFFF" }}
      >
        {data.prioridad > 0 && (
          <div className="flex items-center gap-2">
            <span
              className="block"
              style={{ width: 4, height: 18, background: "var(--color-red)" }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--color-red)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              ⚡ Anuncio importante
            </span>
          </div>
        )}

        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--color-navy)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {data.titulo}
        </h2>

        {data.contenido_html && (
          <div
            style={{
              fontSize: 13,
              color: "#374151",
              lineHeight: 1.65,
            }}
            dangerouslySetInnerHTML={{ __html: sanearHtml(data.contenido_html) }}
          />
        )}

        {data.cta_texto && urlSegura(data.cta_url) && (
          <a
            href={urlSegura(data.cta_url)!}
            onClick={onClose}
            className="self-start inline-flex items-center gap-2 mt-2 px-5 transition-colors"
            style={{
              height: 40,
              background: "var(--color-red)",
              color: "#FFFFFF",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {data.cta_texto}
            <ArrowRight size={14} strokeWidth={2.5} />
          </a>
        )}
      </div>
    </motion.div>
  );
}
