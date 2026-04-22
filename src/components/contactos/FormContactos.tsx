"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Send, ExternalLink } from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const MAPS_URL =
  "https://maps.google.com/?q=Calle+Gabriel+Roman+s/n+y+Av+Pedro+Vasconez+Yacupamba,+Izamba,+Ambato,+Ecuador";

export function FormContactos() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white flex flex-col md:flex-row"
      style={{ minHeight: 720 }}
    >
      {/* ─── Columna mapa — desktop ─── */}
      <div
        className="relative hidden md:block flex-shrink-0"
        style={{ width: "48.6%", minHeight: 720 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1581885896013-42723a002667?w=1200&q=80"
          alt="Ubicación Unidad Educativa Atenas — Izamba, Ambato"
          fill
          className="object-cover object-center"
          sizes="50vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(26,43,74,0.55) 0%, rgba(26,43,74,0.15) 100%)",
          }}
        />

        {/* Línea dorada vertical */}
        <div
          className="absolute right-0 top-[60px]"
          style={{
            width: 1,
            height: 600,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(201,168,76,0.30) 50%, transparent 100%)",
          }}
        />
        {[0, 20, 40].map((offset, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              right: -3,
              top: 56 + offset,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: `rgba(201,168,76,${[0.70, 0.40, 0.20][i]})`,
            }}
          />
        ))}

        {/* Badge ubicación */}
        <div
          className="absolute left-8 top-8 flex items-center gap-2 rounded-[8px] px-[14px] py-[8px]"
          style={{
            background: "rgba(13,24,37,0.80)",
            backdropFilter: "blur(8px)",
          }}
        >
          <MapPin size={14} color="#C9A84C" />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            Izamba · Ambato, Ecuador
          </span>
        </div>

        {/* Centro del mapa */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3">
          <MapPin size={40} color="#C9A84C" />
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.80)",
            }}
          >
            Mapa interactivo
          </p>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-[6px] px-[14px] py-[8px] text-[12px] font-semibold transition-colors hover:opacity-80"
            style={{
              fontFamily: "Poppins, sans-serif",
              color: "#C9A84C",
              background: "rgba(201,168,76,0.15)",
              border: "1px solid rgba(201,168,76,0.40)",
            }}
          >
            Ver en Google Maps
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* ─── Columna formulario ─── */}
      <motion.div
        className="flex-1 flex flex-col justify-center gap-8 px-6 py-12 md:px-16 md:py-16"
        initial={{ opacity: 0, x: 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.65, delay: 0.2, ease }}
      >
        {/* Encabezado */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-[10px]">
            <span
              className="block bg-[#C9A84C]"
              style={{ width: 28, height: 2 }}
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
              Escríbenos
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 1.94vw, 28px)",
              fontWeight: 700,
              color: "#1A2B4A",
            }}
          >
            Envíanos un mensaje
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(26,43,74,0.55)",
              lineHeight: 1.6,
            }}
          >
            Te responderemos en máximo 48 horas hábiles.
          </p>
        </div>

        {sent ? (
          <motion.div
            className="flex flex-col items-center gap-4 py-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 56, height: 56, background: "#C9A84C" }}
            >
              <Send size={22} color="#0D1825" />
            </div>
            <h3
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 20,
                fontWeight: 700,
                color: "#1A2B4A",
              }}
            >
              ¡Mensaje enviado!
            </h3>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 14,
                color: "rgba(26,43,74,0.55)",
                maxWidth: 360,
              }}
            >
              Gracias por contactarnos. Nuestro equipo te responderá pronto.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
            <div className="flex flex-col md:flex-row gap-[18px]">
              <Field
                label="Nombre"
                id="nombre"
                placeholder="Tu nombre completo"
                type="text"
                required
              />
              <Field
                label="Correo electrónico"
                id="correo"
                placeholder="correo@ejemplo.com"
                type="email"
                required
              />
            </div>

            <Field
              label="Asunto"
              id="asunto"
              placeholder="¿En qué podemos ayudarte?"
              type="text"
              required
            />

            <div className="flex flex-col gap-[6px]">
              <label
                htmlFor="mensaje"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#1A2B4A",
                }}
              >
                Mensaje
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe tu mensaje aquí..."
                required
                rows={4}
                className="w-full rounded-[8px] px-[14px] py-[10px] text-[13px] resize-none outline-none border focus:border-[#C9A84C] transition-colors"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#1A2B4A",
                  borderColor: "#E8E4DD",
                }}
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-[10px] self-start rounded-[8px] px-[28px] py-[14px] font-bold text-[14px] bg-[#1A2B4A] text-white hover:bg-[#243d6a] transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Enviar mensaje
              <Send size={16} />
            </button>
          </form>
        )}
      </motion.div>
    </section>
  );
}

function Field({
  label,
  id,
  placeholder,
  type,
  required,
}: {
  label: string;
  id: string;
  placeholder: string;
  type: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px] flex-1">
      <label
        htmlFor={id}
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 12,
          fontWeight: 600,
          color: "#1A2B4A",
        }}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[8px] px-[14px] text-[13px] outline-none border focus:border-[#C9A84C] transition-colors"
        style={{
          fontFamily: "Poppins, sans-serif",
          color: "#1A2B4A",
          borderColor: "#E8E4DD",
          height: 44,
        }}
      />
    </div>
  );
}
