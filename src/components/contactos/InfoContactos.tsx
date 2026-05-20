"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MapPin, Mail, ArrowRight } from "lucide-react";
import { CONTACTOS_PAGINA_DEFAULT, type ContactosPaginaConfig } from "@/lib/cms/contactosPagina";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type InfoContactosProps = {
  canales?: ContactosPaginaConfig["canales"];
  /** Número grande de la tarjeta de teléfono (ej. "03 2854281"). Viene de configuracion_global[contacto]. */
  telefonoPrincipal?: string;
  /** Dirección completa a 2 líneas + ciudad. */
  direccionLinea1?: string;
  direccionLinea2?: string;
  /** Email institucional principal mostrado en la tarjeta. */
  emailPrincipal?: string;
};

export function InfoContactos({
  canales = CONTACTOS_PAGINA_DEFAULT.canales,
  telefonoPrincipal = "03 2854281",
  direccionLinea1 = "Calle Gabriel Román s/n",
  direccionLinea2 = "Av. Pedro Vásconez Yacupamba, Izamba\nAmbato, Ecuador EC 180156",
  emailPrincipal = "admisiones@atenas.edu.ec",
}: InfoContactosProps = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream">

      {/* ─── Franja fotográfica ─── */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        <Image
          src={canales.bannerImagen}
          alt="Campus Unidad Educativa Atenas"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--color-cream) 85%)",
          }}
        />
      </div>

      {/* ─── Línea decorativa dorada ─── */}
      <div
        className="hidden md:block absolute"
        style={{
          left: 160,
          top: 250,
          right: 160,
          height: 1,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.50) 50%, transparent 100%)",
        }}
      />

      {/* ─── Contenido ─── */}
      <div className="px-6 md:px-[160px] pt-10 md:pt-14 pb-20">

        {/* Encabezado */}
        <motion.div
          className="flex flex-col gap-2 mb-10 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-[10px]">
            <span
              className="block bg-gold"
              style={{ width: 28, height: 2 }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                color: "var(--color-gold)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {canales.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 2.22vw, 32px)",
              fontWeight: 700,
              color: "var(--color-navy)",
            }}
          >
            {canales.heading}
          </h2>
        </motion.div>

        {/* Tarjetas */}
        <div className="flex flex-col md:flex-row gap-7">

          {/* Tarjeta 1 — Teléfono */}
          <motion.div
            className="flex-1 flex flex-col gap-5 rounded-[16px] bg-white p-7 md:p-8"
            style={{ boxShadow: "0 8px 32px rgba(26,43,74,0.09)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            <div className="flex items-center gap-[14px]">
              <Phone size={22} color="var(--color-gold)" />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                }}
              >
                {canales.tarjetaTelefono.titulo}
              </span>
            </div>

            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "var(--color-navy)",
                letterSpacing: -0.5,
              }}
            >
              {telefonoPrincipal}
            </span>

            <div style={{ height: 1, background: "#E8E4DD" }} />

            <div className="flex flex-col gap-[9px]">
              {canales.tarjetaTelefono.extensiones.map(({ ext, dept, primary }) => (
                <p
                  key={ext}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: primary
                      ? "var(--color-navy)"
                      : "rgba(26,43,74,0.55)",
                    lineHeight: 1.4,
                  }}
                >
                  ext. {ext}&nbsp;&nbsp;·&nbsp;&nbsp;{dept}
                </p>
              ))}
            </div>
          </motion.div>

          {/* Tarjeta 2 — Dirección */}
          <motion.div
            className="flex-1 flex flex-col gap-5 rounded-[16px] bg-white p-7 md:p-8"
            style={{ boxShadow: "0 8px 32px rgba(26,43,74,0.09)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.22, ease }}
          >
            <div className="flex items-center gap-[14px]">
              <MapPin size={22} color="var(--color-gold)" />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                }}
              >
                {canales.tarjetaDireccion.titulo}
              </span>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                }}
              >
                {direccionLinea1}
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "rgba(26,43,74,0.55)",
                  lineHeight: 1.55,
                  marginTop: 4,
                  whiteSpace: "pre-line",
                }}
              >
                {direccionLinea2}
              </p>
            </div>

            <div style={{ height: 1, background: "#E8E4DD" }} />

            <div className="flex flex-col gap-[8px]">
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "var(--color-navy)",
                  lineHeight: 1.5,
                }}
              >
                {canales.tarjetaDireccion.horarioLaboral}
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(26,43,74,0.50)",
                  lineHeight: 1.5,
                }}
              >
                {canales.tarjetaDireccion.horarioFinde}
              </p>
            </div>
          </motion.div>

          {/* Tarjeta 3 — Email */}
          <motion.div
            className="flex-1 flex flex-col gap-5 rounded-[16px] p-7 md:p-8"
            style={{
              background: "var(--color-navy)",
              boxShadow: "0 8px 32px rgba(26,43,74,0.20)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.34, ease }}
          >
            <div className="flex items-center gap-[14px]">
              <Mail size={22} color="var(--color-gold)" />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                {canales.tarjetaEmail.titulo}
              </span>
            </div>

            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-gold)",
              }}
            >
              {emailPrincipal}
            </span>

            <div style={{ height: 1, background: "rgba(255,255,255,0.10)" }} />

            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.50)",
                lineHeight: 1.6,
              }}
            >
              {canales.tarjetaEmail.descripcion}
            </p>

            <Link
              href={canales.tarjetaEmail.ctaHref || `mailto:${emailPrincipal}`}
              target={
                canales.tarjetaEmail.ctaHref &&
                /^https?:\/\//i.test(canales.tarjetaEmail.ctaHref)
                  ? "_blank"
                  : undefined
              }
              rel={
                canales.tarjetaEmail.ctaHref &&
                /^https?:\/\//i.test(canales.tarjetaEmail.ctaHref)
                  ? "noopener noreferrer"
                  : undefined
              }
              className="inline-flex items-center gap-2 self-start rounded-[8px] px-[18px] py-[10px] font-bold text-[13px] bg-gold text-dark hover:bg-[#dbb95a] transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {canales.tarjetaEmail.ctaLabel}
              <ArrowRight size={14} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
