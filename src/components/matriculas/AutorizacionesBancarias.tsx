"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const BANCOS = [
  {
    banco: "Banco Pichincha",
    tipo: "Cuenta Corriente",
    numero: "XXXXXXX-X",
    titular: "Unidad Educativa Atenas",
    ruc: "1891XXXXXXX001",
    color: "#1A4FA8",
  },
  {
    banco: "Banco del Pacífico",
    tipo: "Cuenta de Ahorros",
    numero: "XXXXXXX-X",
    titular: "Unidad Educativa Atenas",
    ruc: "1891XXXXXXX001",
    color: "#007A4D",
  },
  {
    banco: "Banco Guayaquil",
    tipo: "Cuenta Corriente",
    numero: "XXXXXXX-X",
    titular: "Unidad Educativa Atenas",
    ruc: "1891XXXXXXX001",
    color: "#E6A817",
  },
];

const PASOS = [
  "Realiza la transferencia o depósito al banco de tu preferencia.",
  "Guarda el comprobante de pago en formato PDF o imagen (JPG/PNG).",
  "Ingresa al portal de matrículas y sube el comprobante en la sección correspondiente.",
  "Secretaría validará el pago en un plazo de 2 días hábiles y te notificará por correo.",
];

export function AutorizacionesBancarias() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section className="relative overflow-hidden" style={{ background: "#060E1A" }}>
      <div className="absolute left-0 top-0 bottom-0" style={{ width: 4, background: "#C9A84C" }} />

      <div ref={ref} className="px-6 py-14 md:px-[160px] md:py-[60px] flex flex-col gap-10">

        {/* Header */}
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease }}
        >
          <div className="flex items-center gap-[10px]">
            <span className="block bg-[#C9A84C]" style={{ width: 24, height: 2 }} />
            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>
              Autorizaciones Bancarias
            </span>
          </div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontSize: "clamp(22px,2vw,30px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
            Cuentas para pago de matrícula
          </h2>
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, maxWidth: 520 }}>
            Realiza el pago en cualquiera de los bancos autorizados y sube el comprobante al portal de matrículas.
          </p>
        </motion.div>

        {/* Tarjetas de bancos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BANCOS.map((b, i) => (
            <motion.div
              key={b.banco}
              className="flex flex-col gap-4 rounded-[14px] p-6"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease }}
            >
              <div className="flex items-center gap-3">
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: b.color, flexShrink: 0 }} />
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                  {b.banco}
                </span>
              </div>
              <div className="flex flex-col gap-[6px]" style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
                <Row label="Tipo" value={b.tipo} />
                <Row label="N° de cuenta" value={b.numero} gold />
                <Row label="Titular" value={b.titular} />
                <Row label="RUC" value={b.ruc} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instrucciones */}
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease }}
        >
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
            Pasos para subir el comprobante
          </span>
          <div className="flex flex-col gap-[8px]">
            {PASOS.map((p, i) => (
              <div key={i} className="flex items-start gap-4 rounded-[10px] px-4 py-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#C9A84C", flexShrink: 0, marginTop: 1 }}>
                  0{i + 1}
                </span>
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.60)", lineHeight: 1.6 }}>
                  {p}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nota de contacto */}
        <motion.div
          className="flex items-start gap-3 rounded-[10px] px-5 py-4"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.65, ease }}
        >
          <span style={{ fontSize: 16, flexShrink: 0 }}>💬</span>
          <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>
            ¿Tienes dudas sobre el pago? Contáctanos en{" "}
            <span style={{ color: "#C9A84C", fontWeight: 600 }}>secretaria@atenas.edu.ec</span>{" "}
            o llámanos al{" "}
            <span style={{ color: "#C9A84C", fontWeight: 600 }}>032 456 789</span>.
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.40)" }}>{label}</span>
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 12, fontWeight: gold ? 700 : 500, color: gold ? "#C9A84C" : "rgba(255,255,255,0.75)" }}>
        {value}
      </span>
    </div>
  );
}
