"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { urlSegura } from "@/lib/cms/htmlSeguro";

/**
 * El puente entre leer sobre un nivel y empezar la admisión de ESE nivel.
 *
 * Hasta ahora las páginas de `/academico/niveles/*` contaban el nivel y
 * terminaban sin ninguna forma de dar el siguiente paso: quien se interesaba
 * tenía que volver al menú y buscar Admisiones por su cuenta.
 *
 * Lleva al nivel correcto y no al formulario genérico, porque el formulario de
 * consulta ya llega con el nivel preseleccionado desde
 * `/admisiones/<nivel>` — mandar a todo el mundo a `/admisiones` obliga a
 * elegirlo otra vez y pierde gente por el camino.
 *
 * ── Textos ─────────────────────────────────────────────────────────────────
 *
 * Traen valor por defecto **en el código** y el colegio puede cambiarlos desde
 * el editor de la página. Es a propósito: si nacieran vacíos, el bloque no se
 * vería hasta que alguien los rellenara, y la tarea parecería hecha sin estarlo.
 * Lo guardado gana sobre el default, como en el resto del sitio.
 */

type Props = {
  /** Cómo se llama el nivel en pantalla, p. ej. «Educación Inicial». */
  nivel: string;
  /** A dónde lleva el botón. Normalmente `/admisiones/<nivel>`. */
  href: string;
  eyebrow?: string;
  heading?: string;
  descripcion?: string;
  ctaLabel?: string;
  /** Segundo enlace, discreto. Si falta, no se pinta. */
  secundarioLabel?: string;
  secundarioHref?: string;
  /**
   * `navy` es el bloque de énfasis de las páginas de nivel.
   *
   * `claro` existe para la landing de niveles, donde este bloque cae entre el
   * CTA del programa IB y el pie, los dos oscuros: tres secciones oscuras
   * seguidas se leen como una sola y el cierre deja de notarse.
   */
  variante?: "navy" | "claro";
};

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function CTAAdmisionNivel({
  nivel,
  href,
  eyebrow,
  heading,
  descripcion,
  ctaLabel,
  secundarioLabel,
  secundarioHref,
  variante = "navy",
}: Props) {
  // El destino puede venir del panel, así que pasa por el mismo filtro que el
  // resto de enlaces editables. Sin destino no hay bloque: un CTA que no lleva
  // a ningún sitio es peor que no tenerlo.
  const destino = urlSegura(href);
  if (!destino) return null;

  const destinoSecundario = urlSegura(secundarioHref);
  const claro = variante === "claro";

  // Colores según la variante, en un solo sitio para no repetir ternarios por
  // todo el JSX.
  const c = claro
    ? {
        fondo: "linear-gradient(180deg, var(--color-cream, #F8F5F0) 0%, #FFFFFF 100%)",
        eyebrow: "#6B6660",
        titulo: "var(--color-navy, #1A2B4A)",
        texto: "#6B6660",
        botonFondo: "var(--color-navy, #1A2B4A)",
        botonTexto: "#FFFFFF",
        secundario: "var(--color-navy, #1A2B4A)",
        borde: "none",
      }
    : {
        fondo: "var(--color-navy, #1A2B4A)",
        eyebrow: "rgba(255,255,255,0.72)",
        titulo: "#FFFFFF",
        texto: "rgba(255,255,255,0.8)",
        botonFondo: "#FFFFFF",
        botonTexto: "var(--color-navy, #1A2B4A)",
        secundario: "rgba(255,255,255,0.86)",
        // Debajo va `NavNiveles`, del MISMO azul marino. Sin esta línea los dos
        // bloques se ven como uno solo y no se distingue «empezar la admisión»
        // de «mirar otro nivel».
        borde: "1px solid rgba(255,255,255,0.14)",
      };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: c.fondo, borderBottom: c.borde }}
      aria-labelledby="cta-admision-nivel"
    >
      <div className="px-6 py-14 md:px-[160px] md:py-20 flex flex-col items-center text-center gap-4">
        {(eyebrow ?? "ADMISIONES ABIERTAS") && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease }}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: c.eyebrow,
            }}
          >
            {eyebrow ?? "Admisiones abiertas"}
          </motion.span>
        )}

        <motion.h2
          id="cta-admision-nivel"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "clamp(22px, 4.5vw, 32px)",
            fontWeight: 700,
            color: c.titulo,
            margin: 0,
            lineHeight: 1.25,
            maxWidth: 640,
          }}
        >
          {heading ?? `¿Quieres una plaza en ${nivel}?`}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 15,
            color: c.texto,
            margin: 0,
            lineHeight: 1.65,
            maxWidth: 560,
          }}
        >
          {descripcion ??
            "Cuéntanos de tu hijo o hija y te acompañamos en el proceso, paso a paso. Sin compromiso."}
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          style={{ marginTop: 8 }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
        >
          <a
            href={destino}
            className="inline-flex items-center justify-center gap-2 rounded-[10px] px-7 py-[14px] transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: c.botonTexto,
              background: c.botonFondo,
              textDecoration: "none",
              boxShadow: claro ? "0 6px 20px rgba(26,43,74,0.18)" : "0 8px 24px rgba(0,0,0,0.22)",
              // En 375px el botón ocupa el ancho: un CTA estrecho en móvil se
              // pierde, y la mayoría del tráfico del colegio entra por ahí.
              minWidth: 240,
            }}
          >
            <CalendarCheck size={16} strokeWidth={2.4} />
            {ctaLabel ?? "Iniciar mi proceso de admisión"}
            <ArrowRight size={14} strokeWidth={2.6} />
          </a>

          {secundarioLabel && destinoSecundario && (
            <a
              href={destinoSecundario}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: c.secundario,
                textDecoration: "underline",
                textUnderlineOffset: 4,
              }}
            >
              {secundarioLabel}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
