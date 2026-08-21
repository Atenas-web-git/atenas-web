"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { CONTACTOS_PAGINA_DEFAULT, type ContactosPaginaConfig } from "@/lib/cms/contactosPagina";
import { FormularioDinamico } from "@/components/formularios/FormularioDinamico";
import type { FormularioPublico } from "@/lib/formularios/getFormulario";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type FormContactosProps = {
  formulario?: ContactosPaginaConfig["formulario"];
  mapa?: ContactosPaginaConfig["mapa"];
  /**
   * Definición del formulario «contactos» del motor. Los campos, la
   * validación y el envío salen de ahí; lo que sigue viviendo en el CMS de
   * esta página son los textos del encabezado y el mapa.
   *
   * Si llega null —porque el formulario se desactivó desde el panel— la
   * página se sigue sirviendo con el mapa y los datos de contacto, que es lo
   * que de verdad necesita quien llega buscando cómo comunicarse.
   */
  formularioMotor: FormularioPublico | null;
};

export function FormContactos({
  formulario = CONTACTOS_PAGINA_DEFAULT.formulario,
  mapa = CONTACTOS_PAGINA_DEFAULT.mapa,
  formularioMotor,
}: FormContactosProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-white flex flex-col md:flex-row"
      style={{ minHeight: 720 }}
    >
      {/* ─── Columna mapa — desktop ─── */}
      <div
        className="relative hidden md:block flex-shrink-0 overflow-hidden"
        style={{ width: "48.6%", minHeight: 720 }}
      >
        {/* Badge ubicación — a la derecha para no chocar con la card nativa de Google Maps */}
        <div
          className="absolute right-8 top-8 z-10 flex items-center gap-2 rounded-[8px] px-[14px] py-[8px]"
          style={{
            background: "rgba(13,24,37,0.80)",
            backdropFilter: "blur(8px)",
          }}
        >
          <MapPin size={14} color="var(--color-red)" />
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            {mapa.badgeText}
          </span>
        </div>

        {/*
          La dirección viene validada por ANFITRIÓN desde `contactosPagina`:
          tiene que ser `https` de google.com o maps.google.com y con ruta de
          mapas. Antes solo se le hacía `.trim()`, así que un editor podía
          apuntar «el mapa» a cualquier sitio y quedaba incrustado a media
          pantalla en la página del colegio.

          ⚠️ Falta el `sandbox` que pide la ficha, y falta a propósito: se
          escribió, y **no se pudo comprobar que el mapa siguiera cargando**
          —el iframe es `lazy` y no llegó a pedirse en el entorno de prueba—.
          Un `sandbox` mal puesto deja el mapa en blanco sin ningún error, en
          una página pública. Se prueba en un navegador de verdad y se añade.
          → ficha 2026-08-14-iframe-del-mapa-sin-validar-en-contactos
        */}
        <iframe
          src={mapa.embedUrl}
          title="Ubicación Unidad Educativa Atenas"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
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
              className="block bg-red"
              style={{ width: 28, height: 2 }}
            />
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                // Esta columna tiene fondo BLANCO: en blanco el texto era
                // invisible (contraste 1:1). Los eyebrows sobre fondo claro
                // van en rojo institucional en todo el sitio.
                color: "var(--color-red)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {formulario.eyebrow}
            </span>
          </div>
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(22px, 1.94vw, 28px)",
              fontWeight: 700,
              color: "var(--color-navy)",
            }}
          >
            {formulario.heading}
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "rgba(26,43,74,0.55)",
              lineHeight: 1.6,
            }}
          >
            {formulario.subtitle}
          </p>
        </div>

        {/*
          Los campos, la validación y el envío los pone el motor de
          formularios: así el colegio puede añadir o quitar preguntas desde
          Contenido › Formularios, y cada mensaje queda guardado en la bandeja
          aunque el correo falle. La maquetación de esta página —el mapa al
          lado, el encabezado, la animación de entrada— se queda como estaba.
        */}
        {formularioMotor && (
          <FormularioDinamico
            formulario={formularioMotor}
            mostrarEncabezado={false}
          />
        )}
      </motion.div>
    </section>
  );
}
