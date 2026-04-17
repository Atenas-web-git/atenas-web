"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function FundacionHistoria() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section className="relative bg-white overflow-hidden">

      {/* ─── Mobile ─── */}
      <div className="md:hidden">
        {/* Dos imágenes lado a lado */}
        <div className="flex">
          <div className="relative flex-1" style={{ height: 240 }}>
            <Image
              src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80"
              alt="Aula Atenas"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative flex-1" style={{ height: 240 }}>
            <Image
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80"
              alt="Estudiantes Atenas"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Texto */}
        <div ref={ref} className="px-6 pt-8 pb-14">
          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              color: "#C9A84C",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            Nuestros Orígenes
          </motion.p>

          <motion.span
            className="block bg-[#C9A84C] mt-[5px] mb-[15px]"
            style={{ width: 32, height: 2 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />

          <motion.h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 32,
              fontWeight: 700,
              color: "#1A2B4A",
              lineHeight: 1.15,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15, ease }}
          >
            Un sueño que<br />nació en 1976
          </motion.h2>

          <motion.p
            className="mt-8"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(26,43,74,0.60)",
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease }}
          >
            En la ciudad de Ambato, un grupo de visionarios decidió crear un
            espacio educativo diferente. Con el nombre &lsquo;Atenas&rsquo; como estandarte
            del conocimiento, la Unidad Educativa abrió sus puertas con un
            propósito claro: formar ciudadanos íntegros, críticos y
            comprometidos con su comunidad.
          </motion.p>
        </div>
      </div>

      {/* ─── Desktop ─── */}
      <div
        className="hidden md:block relative"
        style={{ height: 760, maxWidth: 1440, marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Columna de texto */}
        <div
          ref={ref}
          className="absolute"
          style={{ left: 160, top: 0, width: 460, paddingTop: 120 }}
        >
          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              color: "#C9A84C",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease }}
          >
            Nuestros Orígenes
          </motion.p>

          <motion.span
            className="block bg-[#C9A84C]"
            style={{ width: 40, height: 2, marginTop: 8, marginBottom: 8 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          />

          <motion.h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 52,
              fontWeight: 700,
              color: "#1A2B4A",
              lineHeight: 1.1,
              marginTop: 11,
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            Un sueño que<br />nació en 1976
          </motion.h2>

          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 16,
              color: "rgba(26,43,74,0.60)",
              lineHeight: 1.7,
              marginTop: 52,
            }}
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease }}
          >
            La Sociedad Cultural y Educativa Ambato fue fundada por un grupo de
            empresarios encabezados por José Filometor Cuesta Holguín. El 19 de
            octubre de 1976 se emite la autorización de funcionamiento del Centro
            Educativo Atenas — primer día de una historia que dura hasta hoy.
          </motion.p>

          <motion.span
            className="block bg-[#C9A84C]"
            style={{ width: 48, height: 3, marginTop: 86, marginBottom: 16 }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.45, ease }}
          />

          <motion.p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 16,
              fontWeight: 600,
              color: "#1A2B4A",
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55, ease }}
          >
            En 2006 obtuvimos la primera certificación ISO 9001 del centro del
            país. En 2013, la autorización del Bachillerato Internacional. Hoy
            somos referentes de calidad en Ecuador.
          </motion.p>
        </div>

        {/* Imagen principal — 320×580 */}
        <motion.div
          className="absolute rounded-[8px] overflow-hidden"
          style={{ left: 796, top: 80, width: 320, height: 580 }}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease }}
        >
          <Image
            src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80"
            alt="Aula Atenas"
            fill
            className="object-cover"
            sizes="320px"
          />
        </motion.div>

        {/* Imagen 2 — 188×282 (arriba derecha) */}
        <motion.div
          className="absolute rounded-[8px] overflow-hidden"
          style={{ left: 1132, top: 80, width: 188, height: 282 }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35, ease }}
        >
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=80"
            alt="Estudiantes Atenas"
            fill
            className="object-cover"
            sizes="188px"
          />
        </motion.div>

        {/* Imagen 3 — 188×282 (abajo derecha) */}
        <motion.div
          className="absolute rounded-[8px] overflow-hidden"
          style={{ left: 1132, top: 378, width: 188, height: 282 }}
          initial={{ opacity: 0, y: 36 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease }}
        >
          <Image
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&q=80"
            alt="Biblioteca Atenas"
            fill
            className="object-cover"
            sizes="188px"
          />
        </motion.div>
      </div>

    </section>
  );
}
