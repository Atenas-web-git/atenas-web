"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { ContenidoPlantillaS } from "@/app/admin/(authenticated)/contenido/plantillas";
import { sanearHtml } from "@/lib/cms/htmlSeguro";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type DocumentoPoliticaRenderProps = {
  meta: ContenidoPlantillaS["meta"];
  tituloDocumento: string;
  secciones: ContenidoPlantillaS["secciones"];
  ctaPie: ContenidoPlantillaS["ctaPie"];
};

/**
 * Renderer del cuerpo de un documento de política (plantilla S).
 * El hero se renderiza por separado en el dispatcher con `HeroElAtenas`.
 *
 * El campo `cuerpoHtml` de cada sección viene de TipTap (HTML rico):
 * <p>, <strong>, <em>, <ul>/<ol>/<li>, <a>, etc. Se inyecta con
 * `dangerouslySetInnerHTML`, pero **pasando siempre por `sanearHtml`**: quien
 * edita estas páginas es superadmin, editor_comm o editor_academico —los tres,
 * no dos como decía antes este comentario—, y una cuenta de esas con la
 * contraseña robada bastaba para ejecutar código en el navegador de cualquier
 * visitante. Ver `lib/cms/htmlSeguro.ts`.
 */
export function DocumentoPoliticaRender({
  meta,
  tituloDocumento,
  secciones,
  ctaPie,
}: DocumentoPoliticaRenderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.04 });

  const pills = [meta.versionLabel, meta.audiencia, meta.fechaVigencia].filter(
    (p) => p && p.trim()
  );
  const ctaActivo = ctaPie.titulo.trim() !== "" || ctaPie.descripcion.trim() !== "";

  return (
    <section style={{ background: "#FFFFFF", padding: "72px 0 80px" }}>
      <div ref={ref} className="mx-auto px-6" style={{ maxWidth: 820 }}>
        {/* Pills */}
        {pills.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            {pills.map((pill) => (
              <span
                key={pill}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--color-navy)",
                  background: "rgba(26,43,74,0.07)",
                  borderRadius: 20,
                  padding: "4px 12px",
                }}
              >
                {pill}
              </span>
            ))}
          </motion.div>
        )}

        {tituloDocumento && (
          <div className="overflow-hidden mb-6">
            <motion.h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(20px, 2.2vw, 30px)",
                fontWeight: 700,
                color: "var(--color-dark)",
                lineHeight: 1.2,
                margin: 0,
              }}
              initial={{ y: 32, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.12, ease }}
            >
              {tituloDocumento}
            </motion.h2>
          </div>
        )}

        <motion.div
          style={{
            width: "100%",
            height: 1,
            background: "rgba(13,24,37,0.10)",
            marginBottom: 56,
          }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.22, ease }}
        />

        <div className="flex flex-col gap-12">
          {secciones.map((sec, i) => {
            const numero = sec.numero?.trim() || String(i + 1);
            return (
              <div key={`${numero}-${i}`} className="flex flex-col gap-4">
                <h3
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "clamp(14px, 1.18vw, 17px)",
                    fontWeight: 700,
                    color: "var(--color-dark)",
                    margin: 0,
                    lineHeight: 1.3,
                  }}
                >
                  {numero}. {sec.titulo}
                </h3>
                <div
                  className="documento-politica-body"
                  dangerouslySetInnerHTML={{ __html: sanearHtml(sec.cuerpoHtml) }}
                />
              </div>
            );
          })}
        </div>

        {ctaActivo && (
          <div
            style={{
              marginTop: 80,
              background: "#F5F1EB",
              borderRadius: 16,
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 17,
                fontWeight: 700,
                color: "var(--color-dark)",
                margin: 0,
              }}
            >
              {ctaPie.titulo}
            </p>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                color: "rgba(13,24,37,0.55)",
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {ctaPie.descripcion}
            </p>
            {ctaPie.ctaLabel && ctaPie.ctaHref && (
              <Link
                href={ctaPie.ctaHref}
                style={{
                  marginTop: 16,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--color-navy)",
                  color: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  padding: "12px 24px",
                  borderRadius: 8,
                  textDecoration: "none",
                  alignSelf: "flex-start",
                }}
              >
                {ctaPie.ctaLabel}
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Estilos del cuerpo HTML (TipTap output) */}
      <style>{`
        .documento-politica-body p {
          font-family: "Poppins", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          color: rgba(13, 24, 37, 0.68);
          line-height: 1.85;
          margin: 0 0 12px;
        }
        .documento-politica-body p:last-child { margin-bottom: 0; }
        .documento-politica-body strong { color: var(--color-dark); font-weight: 700; }
        .documento-politica-body em { font-style: italic; }
        .documento-politica-body a {
          color: var(--color-red);
          text-decoration: underline;
          font-weight: 600;
        }
        .documento-politica-body ul,
        .documento-politica-body ol {
          margin: 0 0 12px;
          padding-left: 22px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .documento-politica-body li {
          font-family: "Poppins", sans-serif;
          font-size: clamp(13px, 1vw, 15px);
          color: rgba(13, 24, 37, 0.68);
          line-height: 1.8;
          padding-left: 4px;
        }
      `}</style>
    </section>
  );
}
