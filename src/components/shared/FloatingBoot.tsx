"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WHATSAPP_NUMBER = "593997622994";
const WHATSAPP_MESSAGE = "Hola, me gustaría recibir información sobre la Unidad Educativa Atenas.";

export function FloatingBoot() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-[60] flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.85 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatePresence>
            {open && (
              <motion.div
                className="bg-white rounded-[14px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-[280px] md:w-[300px] overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.92 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ background: "#075E54" }} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-[14px]">
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-[13px] font-semibold leading-tight">Atenas BOOT</p>
                    <p className="text-white/70 text-[10px]">Responde en minutos</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar"
                    className="text-white/80 hover:text-white"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="px-4 py-4 flex flex-col gap-3" style={{ background: "#E5DDD5" }}>
                  <div className="bg-white rounded-[10px] rounded-tl-none px-3 py-2 shadow-sm max-w-[85%]">
                    <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "#1A2B4A" }}>
                      ¡Hola! 👋 Soy el asistente de Atenas. Escríbenos por WhatsApp y con gusto te ayudamos con:
                    </p>
                    <ul className="mt-2 ml-3 list-disc" style={{ fontSize: 11, color: "rgba(26,43,74,0.75)" }}>
                      <li>Proceso de admisiones</li>
                      <li>Matrículas y requisitos</li>
                      <li>Becas y servicios</li>
                      <li>Agendar una visita</li>
                    </ul>
                  </div>
                </div>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold hover:brightness-110 transition-all"
                  style={{ background: "#25D366", fontSize: 13 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
                  </svg>
                  <span>Iniciar conversación</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen(o => !o)}
            aria-label="Abrir chat de WhatsApp"
            className="relative w-[58px] h-[58px] md:w-[64px] md:h-[64px] rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.45)] flex items-center justify-center text-white"
            style={{ background: "#25D366" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
          >
            {!open && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: "#25D366" }}
                animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" className="relative">
              {open ? (
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.975 1.005-3.639-.239-.374a9.838 9.838 0 0 1-1.51-5.234c.003-5.45 4.456-9.885 9.945-9.885a9.87 9.87 0 0 1 7.021 2.91 9.772 9.772 0 0 1 2.903 6.994c-.003 5.45-4.456 9.885-9.888 9.885" />
              )}
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
