"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Eye,
  Heart,
  Star,
  Scale,
  Award,
  Users,
  Target,
  Anchor,
} from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const VALORES = [
  {
    icon: Shield,
    name: "Respeto",
    desc: "Es un derecho inalienable de todo ser humano. Reconocemos nuestra individualidad y valoramos la de los demás.",
  },
  {
    icon: Eye,
    name: "Verdad",
    desc: "Hablamos y actuamos de manera coherente con nuestra conciencia y convicciones personales, siendo auténticos y valientes.",
  },
  {
    icon: Heart,
    name: "Solidaridad",
    desc: "Extendemos la mano voluntariamente a quien lo necesita, sintiendo como algo propio el sufrimiento de nuestro prójimo.",
  },
  {
    icon: Star,
    name: "Responsabilidad",
    desc: "Hacemos lo que tenemos que hacer en el momento oportuno y asumimos las consecuencias de nuestras decisiones.",
  },
  {
    icon: Scale,
    name: "Justicia",
    desc: "Somos objetivos y neutrales en la toma de decisiones, comprometidos con la verdad, la conciencia social y la mejora del ambiente.",
  },
  {
    icon: Award,
    name: "Integridad",
    desc: "Actuamos de forma honesta y responsable considerando el sentido de la justicia en todas las acciones que desarrollamos.",
  },
  {
    icon: Users,
    name: "Compañerismo",
    desc: "Comprender, apoyar y ayudar a los demás sin buscar algo a cambio, basado en una actitud de colaboración compartida por todos.",
  },
  {
    icon: Target,
    name: "Perseverancia",
    desc: "Nos esforzamos continuamente para alcanzar lo que nos proponemos y buscamos soluciones a las dificultades que puedan surgir.",
  },
  {
    icon: Anchor,
    name: "Lealtad",
    desc: "Mantener una actitud de fidelidad, honestidad y coherencia en las acciones y decisiones, incluso en situaciones difíciles.",
  },
];

export function SeccionValores() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section ref={ref} className="bg-[#F8F5F0]">
      <div className="px-6 py-20 md:px-[160px] md:py-[100px]">

        {/* Encabezado */}
        <motion.div
          className="flex flex-col gap-4 mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease }}
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
              VALORES
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(26px, 2.5vw, 38px)",
              fontWeight: 700,
              color: "#1A2B4A",
              lineHeight: 1.15,
            }}
          >
            Nuestros Valores Institucionales
          </h2>
          <div style={{ width: 60, height: 3, background: "#C9A84C" }} />
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 16,
              color: "rgba(26,43,74,0.55)",
              lineHeight: 1.65,
              maxWidth: 640,
            }}
          >
            Nueve pilares que guían la vida de toda la comunidad educativa:
            estudiantes, docentes y familias.
          </p>
        </motion.div>

        {/* Grid 3×3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALORES.map(({ icon: Icon, name, desc }, i) => (
            <motion.div
              key={name}
              className="bg-white rounded-[16px] p-7 flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-200"
              style={{ boxShadow: "0 8px 32px rgba(26,43,74,0.07)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
            >
              <div
                className="rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{
                  width: 48,
                  height: 48,
                  background: "rgba(201,168,76,0.12)",
                }}
              >
                <Icon size={22} color="#C9A84C" />
              </div>
              <h3
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1A2B4A",
                }}
              >
                {name}
              </h3>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(26,43,74,0.60)",
                  lineHeight: 1.65,
                }}
              >
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
