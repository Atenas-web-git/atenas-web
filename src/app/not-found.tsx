"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        className="relative overflow-hidden flex flex-col items-center justify-center"
        style={{
          background: "#F5F1EB",
          minHeight: "calc(100vh - 80px)",
          paddingTop: 120,
          paddingBottom: 100,
        }}
      >
        {/* Ghost "404" */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -52%)" }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(140px, 28vw, 360px)",
              fontWeight: 700,
              color: "#0D1825",
              opacity: 0.05,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            404
          </span>
        </div>

        {/* Decorativo — línea dorada izquierda */}
        <div
          className="hidden md:block absolute pointer-events-none"
          style={{
            left: 160,
            top: 0,
            bottom: 0,
            width: 1,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.30) 35%, rgba(201,168,76,0.30) 65%, transparent 100%)",
          }}
        />

        {/* Mascota flotante */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <Image
            src="/images/ateneo-comunicador.png"
            alt="Ateneo, mascota de la Unidad Educativa Atenas"
            width={260}
            height={260}
            priority
            style={{ filter: "drop-shadow(0 20px 40px rgba(13,24,37,0.12))" }}
          />
        </motion.div>

        {/* Contenido */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-5 text-center px-6 mt-6"
          style={{ maxWidth: 500 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span
              className="block bg-[#C9A84C] flex-shrink-0"
              style={{ width: 24, height: 2 }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              Error 404
            </span>
          </div>

          <h1
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(26px, 3.2vw, 40px)",
              fontWeight: 700,
              color: "#0D1825",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Página no encontrada
          </h1>

          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 15,
              color: "rgba(13,24,37,0.55)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Esta dirección no existe o fue movida. Ateneo te ayuda a encontrar
            el camino de vuelta.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "#1A2B4A",
                color: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "#0D1825")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "#1A2B4A")
              }
            >
              ← Volver al inicio
            </Link>
            <Link
              href="/contactos"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: "transparent",
                color: "#1A2B4A",
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none",
                border: "1.5px solid rgba(26,43,74,0.22)",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(201,168,76,0.60)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "rgba(26,43,74,0.22)")
              }
            >
              Ir a Contactos
            </Link>
          </div>
        </motion.div>
      </main>
      <FooterCTA />
    </>
  );
}
