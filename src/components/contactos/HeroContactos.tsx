"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";
import { CONTACTOS_PAGINA_DEFAULT, type ContactosPaginaConfig } from "@/lib/cms/contactosPagina";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type HeroContactosProps = {
  hero?: ContactosPaginaConfig["hero"];
  /** Línea principal con número + extensión (ej. "03 2854281"). */
  telefonoPrincipal?: string;
  /** Texto secundario bajo el número (ej. "ext. 100 Recepción"). */
  telefonoExtension?: string;
  /** Dirección a 2 líneas. La segunda mostrada bajo "y ...". */
  direccionLinea1?: string;
  direccionLinea2?: string;
  /** Horario corto (ej. "Lun–Vie · 7:30 – 15:30"). */
  horarioCorto?: string;
};

export function HeroContactos({
  hero = CONTACTOS_PAGINA_DEFAULT.hero,
  telefonoPrincipal = "03 2854281",
  telefonoExtension = "ext. 100 Recepción",
  direccionLinea1 = "Calle Gabriel Román s/n",
  direccionLinea2 = "y Av. Pedro Vásconez, Izamba",
  horarioCorto = "Lun–Vie · 7:30 – 15:30",
}: HeroContactosProps = {}) {
  return (
    <section
      className="relative overflow-hidden bg-dark"
      style={{ minHeight: 700 }}
    >
      {/* ─── Fondo ─── */}
      <div className="absolute inset-0">
        <Image
          src={hero.bgImage}
          alt=""
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.22 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,24,37,0.94) 0%, rgba(13,24,37,0.40) 55%, rgba(13,24,37,0.80) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(158,25,21,0.05) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ─── Ghost text desktop ─── */}
      <div
        className="hidden md:block absolute pointer-events-none select-none"
        style={{ top: 100, left: -8 }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontSize: 155,
            fontWeight: 700,
            color: "white",
            opacity: 0.024,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}
        >
          {hero.ghostText}
        </span>
      </div>

      {/* ─── Ghost text mobile ─── */}
      <div
        className="md:hidden absolute pointer-events-none select-none overflow-hidden"
        style={{ top: 102, left: 0, width: 380 }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "Poppins, sans-serif",
            fontSize: 57,
            fontWeight: 700,
            color: "white",
            opacity: 0.02,
            lineHeight: 1,
          }}
        >
          {hero.ghostText}
        </span>
      </div>

      {/* ─── Decorativos ─── */}
      <div
        className="hidden md:block absolute pointer-events-none"
        style={{
          left: 160,
          top: 0,
          width: 1,
          height: 700,
          background:
            "linear-gradient(180deg, transparent 0%, rgba(158,25,21,0.40) 40%, rgba(158,25,21,0.40) 60%, transparent 100%)",
        }}
      />
      <div
        className="hidden md:flex absolute gap-[16px] items-center pointer-events-none"
        style={{ left: 148, top: 214 }}
      >
        {[0.8, 0.4, 0.2].map((op, i) => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: `rgba(158,25,21,${op})`,
            }}
          />
        ))}
      </div>
      <div
        className="hidden md:block absolute pointer-events-none rounded-full"
        style={{
          right: -100,
          top: -180,
          width: 320,
          height: 320,
          border: "1px solid rgba(158,25,21,0.20)",
        }}
      />
      <div
        className="hidden md:block absolute pointer-events-none rounded-full"
        style={{
          right: -70,
          top: -200,
          width: 260,
          height: 260,
          border: "1px solid rgba(158,25,21,0.12)",
        }}
      />
      <div
        className="hidden md:block absolute pointer-events-none"
        style={{
          left: 160,
          bottom: 40,
          width: 600,
          height: 1,
          background:
            "linear-gradient(90deg, rgba(158,25,21,0.60) 0%, transparent 100%)",
        }}
      />

      {/* ─── Contenido principal ─── */}
      <div
        className="relative z-10
          px-6 pt-[160px] pb-28
          md:px-0 md:pt-0 md:pb-0
          md:absolute md:left-[192px] md:top-[270px]
          flex flex-col gap-[16px] md:gap-[18px]"
        style={{ maxWidth: 560 }}
      >
        <motion.div
          className="flex items-center gap-[10px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <motion.span
            className="block bg-red flex-shrink-0"
            style={{ width: 28, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease }}
          />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color:"#FFFFFF",
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {hero.eyebrow}
          </span>
        </motion.div>

        <div>
          {([hero.titleLine1, hero.titleLine2] as const).map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.span
                className="block"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "clamp(38px, 4.44vw, 64px)",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: i === 0 ? "#FFFFFF" : "var(--color-red)",
                }}
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.28 + i * 0.13, ease }}
              >
                {line}
              </motion.span>
            </div>
          ))}
        </div>

        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(14px, 1.18vw, 17px)",
            color: "rgba(255,255,255,0.65)",
            lineHeight: 1.65,
            maxWidth: 480,
            whiteSpace: "pre-line",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.56, ease }}
        >
          {hero.description}
        </motion.p>

        <motion.p
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: 1,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.75, ease }}
        >
          {hero.caption}
        </motion.p>
      </div>

      {/* ─── Tarjeta flotante — desktop ─── */}
      <motion.div
        className="hidden md:flex absolute flex-col rounded-[16px] overflow-hidden"
        style={{
          left: 830,
          top: 190,
          width: 300,
          background: "rgba(26,43,74,0.95)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.50)",
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.6, ease }}
      >
        <div className="px-5 py-4" style={{ background: "var(--color-red)" }}>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color:"#FFFFFF",
              letterSpacing: 1,
            }}
          >
            {hero.tarjeta.titulo}
          </p>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              color: "rgba(13,24,37,0.55)",
              marginTop: 2,
            }}
          >
            {hero.tarjeta.subtitulo}
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start gap-[10px]">
            <Phone size={16} color="var(--color-red)" className="mt-[2px] flex-shrink-0" />
            <div className="flex flex-col gap-[2px]">
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                {telefonoPrincipal}
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.50)",
                }}
              >
                {telefonoExtension}
              </span>
            </div>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          <div className="flex items-start gap-[10px]">
            <MapPin
              size={16}
              color="var(--color-red)"
              className="mt-[2px] flex-shrink-0"
            />
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.70)",
                lineHeight: 1.55,
              }}
            >
              {direccionLinea1}
              <br />
              {direccionLinea2}
            </p>
          </div>

          <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />

          <div className="flex items-center gap-[10px]">
            <Clock size={16} color="var(--color-red)" className="flex-shrink-0" />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.70)",
              }}
            >
              {horarioCorto}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ─── Barra info — mobile ─── */}
      <motion.div
        className="md:hidden absolute left-4 right-4 bottom-4 rounded-[12px] overflow-hidden z-10"
        style={{
          background: "rgba(26,43,74,0.92)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.40)",
        }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.65, ease }}
      >
        <div className="flex items-center gap-[10px] px-4 py-3">
          <Phone size={15} color="var(--color-red)" className="flex-shrink-0" />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#FFFFFF",
            }}
          >
            {telefonoPrincipal}
          </span>
          <div
            style={{
              width: 1,
              height: 20,
              background: "rgba(255,255,255,0.15)",
              margin: "0 4px",
            }}
          />
          <Clock size={15} color="var(--color-red)" className="flex-shrink-0" />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,0.65)",
            }}
          >
            {horarioCorto}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
