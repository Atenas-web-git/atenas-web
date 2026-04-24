"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoSVG } from "@/components/shared/LogoSVG";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type CategoryKey =
  | "quienes_somos"
  | "espacios"
  | "reconocimientos"
  | "academico"
  | "admisiones"
  | "matriculas"
  | "documentos"
  | "servicios"
  | "plataformas"
  | "revista"
  | "comunidad";

const categories: { key: CategoryKey; label: string }[] = [
  { key: "quienes_somos",   label: "Quiénes Somos"               },
  { key: "espacios",        label: "Espacios de Desarrollo"      },
  { key: "reconocimientos", label: "Reconocimientos"             },
  { key: "academico",       label: "Académico"                   },
  { key: "admisiones",      label: "Admisiones"                  },
  { key: "matriculas",      label: "Matrículas"                  },
  { key: "documentos",      label: "Documentos Institucionales"  },
  { key: "servicios",       label: "Servicios"                   },
  { key: "plataformas",     label: "Nuestras Plataformas"        },
  { key: "revista",         label: "Revista"                     },
  { key: "comunidad",       label: "Comunidad"                   },
];

const subLinks: Record<CategoryKey, Record<string, string>> = {
  quienes_somos: {
    "Historia & 50 Años":        "/el-atenas/historia",
    "Misión":                    "/el-atenas/mision",
    "Visión":                    "/el-atenas/vision",
    "Valores Institucionales":   "/el-atenas/valores",
    "Política de Calidad":       "/el-atenas/politica-calidad",
    "Política de Seguridad":     "/el-atenas/politica-seguridad",
    "Directiva de PPFF":         "/el-atenas/directiva-ppff",
    "Directorio FCEA":           "/el-atenas/directorio-fcea",
  },
  espacios: {
    "Proyecto VASE":      "/espacios/vase",
    "Proyecto CAS":       "/espacios/cas",
    "Idioma Extranjero":  "/espacios/idioma-extranjero",
    "Cultura Estética":   "/espacios/cultura-estetica",
    "Educación Física":   "/espacios/educacion-fisica",
    "Intercambio":        "/espacios/intercambio",
  },
  reconocimientos: {
    "Logros Deportivos":  "/reconocimientos/deportivos",
    "Logros Académicos":  "/reconocimientos/academicos",
  },
  academico: {
    "Educación Inicial":              "/academico/niveles/inicial",
    "EGB Elemental y Media":          "/academico/niveles/egb-elemental-media",
    "EGB Superior":                   "/academico/niveles/egb-superior",
    "Bachillerato Internacional (IB)":"/academico/ib",
  },
  admisiones: {
    "Educación Inicial":        "/admisiones/inicial",
    "EGB Elemental y Media":    "/admisiones/egb-elemental-media",
    "EGB Superior":             "/admisiones/egb-superior",
    "Bachillerato IB":          "/admisiones/ib",
    "Agenda una visita":        "/admisiones#visita",
  },
  matriculas: {
    "Proceso de Matrícula":      "/matriculas/proceso",
    "Inicial 2.1":               "/matriculas/inicial-2-1",
    "Inicial 2.2":               "/matriculas/inicial-2-2",
    "Primer grado":              "/matriculas/primer-grado",
    "Segundo grado":             "/matriculas/segundo-grado",
    "3ro a 7mo grado":           "/matriculas/3ro-7mo",
    "8vo a 10mo grado":          "/matriculas/8vo-10mo",
    "Bachillerato IB":           "/matriculas/ib",
    "Valores Referenciales":     "/matriculas/valores",
    "Listas de útiles":          "/matriculas/listas",
    "Autorizaciones bancarias":  "/matriculas/autorizaciones",
  },
  documentos: {
    "Resolución de Pensiones":          "/documentos-institucionales/resolucion-pensiones",
    "Contrato de Prestación":           "/documentos-institucionales/contrato-prestacion",
    "Consentimiento Datos Personales":  "/documentos-institucionales/consentimiento-datos",
    "Código de Convivencia":            "/documentos-institucionales/codigo-convivencia",
    "Declaración Juramentada":          "/documentos-institucionales/declaracion-juramentada",
    "Rutas de Manejo de Conflictos":    "/documentos-institucionales/rutas-conflictos",
    "Solicitud de Inasistencia":        "/documentos-institucionales/solicitud-inasistencia",
  },
  servicios: {
    "Bar / Cafetería":        "/servicios/bar-cafeteria",
    "Biblioteca":             "/servicios/biblioteca",
    "Transporte":             "/servicios/transporte",
    "Dispensario Médico":     "/servicios/dispensario-medico",
    "Llave del Aprendizaje":  "/servicios/llave-aprendizaje",
    "Becas":                  "/servicios/becas",
    "Seguro Estudiantil":     "/servicios/seguro-estudiantil",
    "Quejas y Sugerencias":   "/servicios/quejas-sugerencias",
  },
  plataformas: {
    "Aleks":                          "https://latam.aleks.com/?_s=6114732018736631",
    "eLibro":                         "https://elibro.net/es/lc/atenas/login_usuario/?next=/es/lc/atenas/inicio/",
    "Biblioteca Virtual Institucional":"http://biblioteca.atenas.edu.ec:8085/librum/buea/?_gl=1*1hlf85s*_ga*MTg3ODg1NDY0Ny4xNzc1NjAzODE5*_ga_PC0YRJJ3QP*czE3NzY5OTAzMDYkbzEzJGcxJHQxNzc2OTkxOTI3JGo1MiRsMCRoMA..&_ga=2.144400246.2113148885.1776990306-1878854647.1775603819",
  },
  revista: {
    "Ver todos los artículos": "/revista",
    "Educación Inicial":       "/revista/categoria/educacion-inicial",
    "Bachillerato IB":         "/revista/categoria/bachillerato-ib",
    "Deportes":                "/revista/categoria/deportes",
    "Cultura":                 "/revista/categoria/cultura",
  },
  comunidad: {
    "Soy Alumno":   "/comunidad#alumno",
    "Soy Padre":    "/comunidad#padre",
    "Soy Docente":  "/comunidad#docente",
    "Alumni":       "/comunidad#alumni",
  },
};

const subItems: Record<CategoryKey, string[]> = {
  quienes_somos:   Object.keys(subLinks.quienes_somos),
  espacios:        Object.keys(subLinks.espacios),
  reconocimientos: Object.keys(subLinks.reconocimientos),
  academico:       Object.keys(subLinks.academico),
  admisiones:      Object.keys(subLinks.admisiones),
  matriculas:      Object.keys(subLinks.matriculas),
  documentos:      Object.keys(subLinks.documentos),
  servicios:       Object.keys(subLinks.servicios),
  plataformas:     Object.keys(subLinks.plataformas),
  revista:         Object.keys(subLinks.revista),
  comunidad:       Object.keys(subLinks.comunidad),
};

const subLabels: Record<CategoryKey, string> = {
  quienes_somos:   "QUIÉNES SOMOS",
  espacios:        "ESPACIOS DE DESARROLLO",
  reconocimientos: "RECONOCIMIENTOS",
  academico:       "ACADÉMICO",
  admisiones:      "ADMISIONES",
  matriculas:      "MATRÍCULAS",
  documentos:      "DOCUMENTOS INSTITUCIONALES",
  servicios:       "SERVICIOS",
  plataformas:     "NUESTRAS PLATAFORMAS",
  revista:         "REVISTA",
  comunidad:       "COMUNIDAD",
};

export function Navbar() {
  const [scrolled,        setScrolled]        = useState(false);
  const [menuOpen,        setMenuOpen]        = useState(false);
  const [activeCategory,  setActiveCategory]  = useState<CategoryKey>("quienes_somos");
  const [mobileExpanded,  setMobileExpanded]  = useState<CategoryKey | null>("quienes_somos");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setActiveCategory("quienes_somos");
      setMobileExpanded("quienes_somos");
    }
    window.dispatchEvent(new CustomEvent("atenas:megamenu", { detail: { open: menuOpen } }));
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "shadow-[0_2px_20px_rgba(13,24,37,0.12)]" : ""
        }`}
      >
        <nav className="bg-white h-[80px] flex items-center justify-between px-10 md:px-16">
          {/* Logo + Badge */}
          <div className="flex items-center gap-3">
            <a href="/" aria-label="Inicio">
              <LogoSVG className="w-[107px]" />
            </a>
            <span className="hidden sm:inline-flex items-center text-[#C9A84C] text-[9px] font-semibold tracking-[2px] border border-[#C9A84C] rounded-full px-2.5 py-[3px] whitespace-nowrap">
              50 AÑOS
            </span>
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="https://idukay.net/colegios/#/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A2B4A] text-[11px] font-medium tracking-[2px] uppercase hover:opacity-60 transition-opacity"
            >
              PORTAL FAMILIAR
            </a>
            <a
              href="/paseo-virtual"
              className="text-[#C9A84C] border border-[#C9A84C] text-[11px] font-semibold tracking-[2px] uppercase px-3.5 h-8 flex items-center rounded-full hover:bg-[#C9A84C] hover:text-white transition-colors"
            >
              TOUR VIRTUAL
            </a>
            <button aria-label="Buscar" className="text-[#1A2B4A] hover:opacity-60 transition-opacity">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-[#9e1915] text-white text-[11px] font-semibold tracking-[2px] px-5 h-10 flex items-center gap-2.5 hover:bg-[#7d140f] transition-colors"
            >
              <span>MENÚ</span>
              <span className="flex flex-col gap-[5px]">
                <span className="block w-[16px] h-[1.5px] bg-white" />
                <span className="block w-[16px] h-[1.5px] bg-white" />
              </span>
            </button>
          </div>

          {/* Mobile MENÚ */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-[#9e1915] text-white text-[10px] font-semibold tracking-[1.5px] px-4 h-9"
          >
            MENÚ
          </button>
        </nav>
      </header>

      {/* ── Mega-menú overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="megamenu"
            className="fixed inset-0 z-50 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Panel izquierdo — foto campus (solo desktop) */}
            <motion.div
              className="hidden md:flex w-[40%] flex-col justify-end p-16 relative overflow-hidden"
              style={{ background: "#1A2B4A" }}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: "url(/images/00_politicas-de-seguridad-1536x864.jpg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[60%]"
                style={{ background: "linear-gradient(to top, rgba(13,24,37,0.85) 0%, transparent 100%)" }}
              />
              <div className="relative z-10 flex flex-col gap-4">
                <LogoSVG variant="white" className="w-[160px]" />
                <p className="text-white/75 text-[15px] leading-[1.65] max-w-[280px]">
                  50 años formando líderes<br />con valores y excelencia.
                </p>
              </div>
            </motion.div>

            {/* Panel derecho */}
            <motion.div
              className="flex-1 bg-[#0F1E30] flex flex-col overflow-hidden"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between px-8 md:px-16 h-[80px] flex-shrink-0">
                <LogoSVG variant="white" className="w-[110px]" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/50 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* ── Nav area ── */}
              <div className="flex-1 min-h-0 flex flex-col">

                {/* DESKTOP — 2 columnas */}
                <div className="hidden md:flex flex-1 min-h-0 gap-16 px-16 pt-10 pb-0">
                  {/* Columna izquierda: categorías */}
                  <div className="w-[300px] flex-shrink-0 flex flex-col gap-0 overflow-y-auto pb-4">
                    <span className="text-[#9e1915] text-[10px] font-bold tracking-[3px] uppercase mb-3">
                      Secciones
                    </span>
                    {categories.map((cat, i) => (
                      <motion.button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className="flex items-center justify-between py-[10px] text-left w-full"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 + i * 0.035, duration: 0.35, ease }}
                      >
                        <span
                          className="font-semibold text-[18px] leading-[1.2] transition-colors duration-150"
                          style={{ color: activeCategory === cat.key ? "#FFFFFF" : "rgba(255,255,255,0.4)" }}
                        >
                          {cat.label}
                        </span>
                        {activeCategory === cat.key && (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9e1915" strokeWidth="2.5">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Divisor vertical */}
                  <div className="w-[1px] bg-white/10 self-stretch flex-shrink-0" />

                  {/* Columna derecha: sub-items */}
                  <div className="flex-1 min-w-0 min-h-0 overflow-y-auto flex flex-col gap-1 pt-[2px] pb-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease }}
                      >
                        <span className="text-[#9e1915] text-[10px] font-bold tracking-[3px] uppercase mb-3 block">
                          {subLabels[activeCategory]}
                        </span>
                        {subItems[activeCategory].map((item, i) => (
                          <motion.a
                            key={item}
                            href={subLinks[activeCategory]?.[item] ?? "#"}
                            target={(subLinks[activeCategory]?.[item] ?? "").startsWith("http") ? "_blank" : undefined}
                            rel={(subLinks[activeCategory]?.[item] ?? "").startsWith("http") ? "noopener noreferrer" : undefined}
                            className="flex items-center gap-3 py-[14px] border-b border-white/[0.07] group w-full"
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.3, ease }}
                            onClick={() => setMenuOpen(false)}
                          >
                            <span className="w-1 h-1 rounded-sm bg-[#C9A84C] flex-shrink-0" />
                            <span className="text-white text-[16px] font-normal group-hover:text-white/70 transition-colors">
                              {item}
                            </span>
                          </motion.a>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* MOBILE — acordeón */}
                <div className="md:hidden flex-1 overflow-y-auto px-7 pt-2">
                  {categories.map((cat, i) => (
                    <motion.div
                      key={cat.key}
                      className="border-b border-white/10"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 + i * 0.06, duration: 0.3, ease }}
                    >
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === cat.key ? null : cat.key)
                        }
                        className="flex items-center justify-between w-full py-[12px]"
                      >
                        <span
                          className="font-semibold text-[16px] leading-[1.25] pr-3 transition-colors"
                          style={{ color: mobileExpanded === cat.key ? "#FFFFFF" : "rgba(255,255,255,0.45)" }}
                        >
                          {cat.label}
                        </span>
                        <motion.svg
                          width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke={mobileExpanded === cat.key ? "#9e1915" : "rgba(255,255,255,0.3)"}
                          strokeWidth="2.5"
                          animate={{ rotate: mobileExpanded === cat.key ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path d="m9 18 6-6-6-6" />
                        </motion.svg>
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileExpanded === cat.key && (
                          <motion.div
                            key={`msub-${cat.key}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 flex flex-col pl-2">
                              {subItems[cat.key].map((item) => (
                                <a
                                  key={item}
                                  href={subLinks[cat.key]?.[item] ?? "#"}
                                  target={(subLinks[cat.key]?.[item] ?? "").startsWith("http") ? "_blank" : undefined}
                                  rel={(subLinks[cat.key]?.[item] ?? "").startsWith("http") ? "noopener noreferrer" : undefined}
                                  className="flex items-center gap-3 py-2.5"
                                  onClick={() => setMenuOpen(false)}
                                >
                                  <span className="w-[5px] h-[5px] rounded-sm bg-[#C9A84C] flex-shrink-0" />
                                  <span className="text-white/80 text-[14px]">{item}</span>
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {/* Contacto info — mobile */}
                  <div className="mt-5 pt-4 pb-2">
                    <p className="text-white/40 text-[10px] tracking-[2px] uppercase font-bold mb-2">Contacto</p>
                    <p className="text-white/55 text-[12px] leading-relaxed">
                      03 2854281 ext. 100 (Recepción)<br />admisiones@atenas.edu.ec
                    </p>
                  </div>
                </div>
              </div>

              {/* Divisor horizontal */}
              <div className="mx-8 md:mx-16 h-[1px] bg-white/10 mt-6 md:mt-8 flex-shrink-0" />

              {/* CTA row */}
              <div className="flex items-center justify-between px-8 md:px-16 py-6 md:py-8 flex-shrink-0">
                <div className="flex flex-col gap-2">
                  <span className="hidden md:block text-white/60 text-[13px]">
                    ¿Listo para ser parte del Atenas?
                  </span>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="/admisiones"
                      className="bg-[#9e1915] text-white text-[12px] md:text-[13px] font-bold tracking-[0.5px] px-5 md:px-6 py-3 rounded hover:bg-[#7d140f] transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Solicitar Admisión
                    </a>
                    <a
                      href="/paseo-virtual"
                      className="border border-[#C9A84C] text-[#C9A84C] text-[12px] md:text-[13px] font-semibold px-5 md:px-6 py-3 rounded hover:bg-[#C9A84C] hover:text-white transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Tour Virtual
                    </a>
                    <a
                      href="/cronograma-anual"
                      className="border border-white/30 text-white/80 text-[12px] md:text-[13px] px-5 md:px-6 py-3 rounded hover:bg-white/10 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Cronograma
                    </a>
                    <a
                      href="/contactos"
                      className="border border-white/30 text-white/80 text-[12px] md:text-[13px] px-5 md:px-6 py-3 rounded hover:bg-white/10 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Contactos
                    </a>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2 text-white/50 text-[13px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
                  </svg>
                  03 2854281 ext. 100
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
