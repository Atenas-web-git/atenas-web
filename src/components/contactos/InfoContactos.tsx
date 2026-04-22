"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Phone, MapPin, Mail, ArrowRight } from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const extensions = [
  { ext: "100", dept: "Recepción / Asistente General", primary: true },
  { ext: "140", dept: "Secretaría Colegio", primary: false },
  { ext: "150", dept: "Secretaría Escuela", primary: false },
  { ext: "260", dept: "Secretaría IB", primary: false },
  { ext: "190", dept: "Tesorería", primary: false },
  { ext: "135", dept: "Admisiones", primary: false },
  { ext: "112 / 180", dept: "Servicio al Cliente", primary: false },
];

export function InfoContactos() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#F8F5F0]">

      {/* ─── Franja fotográfica ─── */}
      <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
        <Image
          src="https://images.unsplash.com/photo-1758270703733-3663d99c9dd7?w=1440&q=80"
          alt="Campus Unidad Educativa Atenas"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #F8F5F0 85%)",
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
              Información de contacto
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 2.22vw, 32px)",
              fontWeight: 700,
              color: "#1A2B4A",
            }}
          >
            Canales de atención
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
              <Phone size={22} color="#C9A84C" />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A2B4A",
                }}
              >
                Teléfono Central
              </span>
            </div>

            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 28,
                fontWeight: 700,
                color: "#1A2B4A",
                letterSpacing: -0.5,
              }}
            >
              03 2854281
            </span>

            <div style={{ height: 1, background: "#E8E4DD" }} />

            <div className="flex flex-col gap-[9px]">
              {extensions.map(({ ext, dept, primary }) => (
                <p
                  key={ext}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 13,
                    color: primary
                      ? "#1A2B4A"
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
              <MapPin size={22} color="#C9A84C" />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A2B4A",
                }}
              >
                Dirección y Horario
              </span>
            </div>

            <div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1A2B4A",
                }}
              >
                Calle Gabriel Román s/n
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 13,
                  color: "rgba(26,43,74,0.55)",
                  lineHeight: 1.55,
                  marginTop: 4,
                }}
              >
                Av. Pedro Vásconez Yacupamba, Izamba
                <br />
                Ambato, Ecuador EC 180156
              </p>
            </div>

            <div style={{ height: 1, background: "#E8E4DD" }} />

            <div className="flex flex-col gap-[8px]">
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "#1A2B4A",
                  lineHeight: 1.5,
                }}
              >
                Lunes a Viernes&nbsp;&nbsp;·&nbsp;&nbsp;7:30 – 15:30
              </p>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(26,43,74,0.50)",
                  lineHeight: 1.5,
                }}
              >
                Sábado y Domingo&nbsp;&nbsp;·&nbsp;&nbsp;Cerrado
              </p>
            </div>
          </motion.div>

          {/* Tarjeta 3 — Email */}
          <motion.div
            className="flex-1 flex flex-col gap-5 rounded-[16px] p-7 md:p-8"
            style={{
              background: "#1A2B4A",
              boxShadow: "0 8px 32px rgba(26,43,74,0.20)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.34, ease }}
          >
            <div className="flex items-center gap-[14px]">
              <Mail size={22} color="#C9A84C" />
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#FFFFFF",
                }}
              >
                Correo Electrónico
              </span>
            </div>

            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: "#C9A84C",
              }}
            >
              admisiones@atenas.edu.ec
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
              Para consultas sobre admisiones, matrículas y servicios
              institucionales. Respondemos en máximo 48 horas.
            </p>

            <Link
              href="mailto:admisiones@atenas.edu.ec"
              className="inline-flex items-center gap-2 self-start rounded-[8px] px-[18px] py-[10px] font-bold text-[13px] bg-[#C9A84C] text-[#0D1825] hover:bg-[#dbb95a] transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Enviar correo
              <ArrowRight size={14} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
