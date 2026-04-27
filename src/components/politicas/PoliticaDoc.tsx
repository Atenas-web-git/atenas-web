"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface PoliticaDocProps {
  titulo: string;
  version: string;
  audiencia: string;
  children: React.ReactNode;
}

export function PoliticaDoc({ titulo, version, audiencia, children }: PoliticaDocProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.04 });

  return (
    <section style={{ background: "#FFFFFF", padding: "72px 0 80px" }}>
      <div
        ref={ref}
        className="mx-auto px-6"
        style={{ maxWidth: 820 }}
      >
        {/* Pills */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, ease }}
        >
          {[version, audiencia, "LOPDP Ecuador"].map((pill) => (
            <span
              key={pill}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: "#1A2B4A",
                background: "rgba(26,43,74,0.07)",
                borderRadius: 20,
                padding: "4px 12px",
              }}
            >
              {pill}
            </span>
          ))}
        </motion.div>

        {/* Título del documento */}
        <div className="overflow-hidden mb-6">
          <motion.h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(20px, 2.2vw, 30px)",
              fontWeight: 700,
              color: "#0D1825",
              lineHeight: 1.2,
              margin: 0,
            }}
            initial={{ y: 32, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease }}
          >
            {titulo}
          </motion.h2>
        </div>

        {/* Separador */}
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

        {/* Secciones */}
        <div className="flex flex-col gap-12">{children}</div>

        {/* CTA */}
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
              color: "#0D1825",
              margin: 0,
            }}
          >
            ¿Tiene dudas sobre el tratamiento de sus datos?
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
            Puede contactar al Responsable de Protección de Datos de la institución por cualquier consulta o solicitud.
          </p>
          <Link
            href="/contactos"
            style={{
              marginTop: 16,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#1A2B4A",
              color: "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              padding: "12px 24px",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            Ir a Contactos →
          </Link>
        </div>
      </div>
    </section>
  );
}

interface SeccionDocProps {
  numero: number;
  titulo: string;
  children: React.ReactNode;
}

export function SeccionDoc({ numero, titulo, children }: SeccionDocProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: "clamp(14px, 1.18vw, 17px)",
          fontWeight: 700,
          color: "#0D1825",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {numero}. {titulo}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function ParrafoDoc({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "Poppins, sans-serif",
        fontSize: "clamp(13px, 1vw, 15px)",
        color: "rgba(13,24,37,0.68)",
        lineHeight: 1.85,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

export function BulletDoc({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(13px, 1vw, 15px)",
            color: "rgba(13,24,37,0.68)",
            lineHeight: 1.8,
            paddingLeft: 4,
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
