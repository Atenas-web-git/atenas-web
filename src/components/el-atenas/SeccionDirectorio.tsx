"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User } from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export interface DirectorioItem {
  cargo: string;
  nombre: string;
}

interface Props {
  badge: string;
  heading: string;
  period?: string;
  items: DirectorioItem[];
  note?: string;
}

export function SeccionDirectorio({
  badge,
  heading,
  period,
  items,
  note,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="bg-[#F8F5F0]">
      <div className="px-6 py-20 md:px-[160px] md:py-[100px]">

        {/* Encabezado */}
        <motion.div
          className="flex flex-col gap-4 mb-12"
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
              {badge}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-5">
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(26px, 2.5vw, 38px)",
                fontWeight: 700,
                color: "#1A2B4A",
                lineHeight: 1.15,
              }}
            >
              {heading}
            </h2>
            {period && (
              <span
                className="self-start md:self-auto rounded-full px-4 py-1 text-[12px] font-semibold"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  background: "rgba(201,168,76,0.14)",
                  color: "#C9A84C",
                  border: "1px solid rgba(201,168,76,0.30)",
                }}
              >
                {period}
              </span>
            )}
          </div>

          <div style={{ width: 60, height: 3, background: "#C9A84C" }} />
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ cargo, nombre }, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-[14px] p-6 flex items-center gap-4"
              style={{ boxShadow: "0 4px 20px rgba(26,43,74,0.07)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.07, ease }}
            >
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: 44, height: 44, background: "#1A2B4A" }}
              >
                <User size={18} color="#C9A84C" />
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1A2B4A",
                  }}
                >
                  {nombre}
                </p>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: 12,
                    color: "rgba(26,43,74,0.55)",
                    marginTop: 2,
                  }}
                >
                  {cargo}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {note && (
          <motion.p
            className="mt-8"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              color: "rgba(26,43,74,0.42)",
              lineHeight: 1.65,
            }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.5, ease }}
          >
            {note}
          </motion.p>
        )}

      </div>
    </section>
  );
}
