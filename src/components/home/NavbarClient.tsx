"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LogoSVG } from "@/components/shared/LogoSVG";
import { CampanaNavbar } from "@/components/notificaciones/CampanaNavbar";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import type { MenuCategoria } from "@/lib/cms/getMegaMenu";
import type { MegaMenuConfig, NavbarConfig } from "@/lib/cms/getConfiguracion";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type Props = {
  categorias: MenuCategoria[];
  megaMenuCfg: MegaMenuConfig;
  navbarCfg: NavbarConfig;
  /** Línea con teléfono + extensión derivada de configuracion_global[contacto]. */
  phoneLine: string;
  /** Lista de líneas para el bloque "Contacto" del mega-menú en mobile. */
  mobileContactLines: string[];
};

export function NavbarClient({
  categorias,
  megaMenuCfg,
  navbarCfg,
  phoneLine,
  mobileContactLines,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(categorias[0]?.id ?? "");
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(
    categorias[0]?.id ?? null
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen && categorias.length > 0) {
      setActiveCategory(categorias[0].id);
      setMobileExpanded(categorias[0].id);
    }
    window.dispatchEvent(new CustomEvent("atenas:megamenu", { detail: { open: menuOpen } }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // Atajo global Cmd+K / Ctrl+K — abre el buscador desde cualquier parte del sitio
  useEffect(() => {
    if (!navbarCfg.busqueda.visible) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navbarCfg.busqueda.visible]);

  const activeCat = categorias.find((c) => c.id === activeCategory) ?? categorias[0];

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? "shadow-[0_2px_20px_rgba(13,24,37,0.12)]" : ""
        }`}
        style={{ top: "var(--banner-height, 0px)" }}
      >
        <nav className="bg-white h-[80px] flex items-center justify-between px-10 md:px-16">
          {/* Logo + Badge */}
          <div className="flex items-center gap-3">
            <a href="/" aria-label="Inicio">
              <LogoSVG className="w-[107px]" />
            </a>
            {navbarCfg.aniversarioBadge.visible &&
              (navbarCfg.aniversarioBadge.logoSrc ? (
                <Image
                  src={navbarCfg.aniversarioBadge.logoSrc}
                  alt={navbarCfg.aniversarioBadge.label}
                  width={120}
                  height={120}
                  className="hidden sm:block h-12 md:h-14 w-auto"
                  unoptimized
                />
              ) : (
                <span className="hidden sm:inline-flex items-center text-red text-[9px] font-semibold tracking-[2px] border border-red rounded-full px-2.5 py-[3px] whitespace-nowrap">
                  {navbarCfg.aniversarioBadge.label}
                </span>
              ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-5">
            {navbarCfg.ctaPortal.visible && (
              <a
                href={navbarCfg.ctaPortal.href}
                className="text-navy text-[11px] font-medium tracking-[2px] uppercase hover:opacity-60 transition-opacity"
              >
                {navbarCfg.ctaPortal.label}
              </a>
            )}
            {navbarCfg.ctaTour.visible && (
              <a
                href={navbarCfg.ctaTour.href}
                className="text-red border border-red text-[11px] font-semibold tracking-[2px] uppercase px-3.5 h-8 flex items-center rounded-full hover:bg-red hover:text-white transition-colors"
              >
                {navbarCfg.ctaTour.label}
              </a>
            )}
            {navbarCfg.campana.visible && <CampanaNavbar />}
            {navbarCfg.busqueda.visible && (
              <button
                aria-label="Buscar"
                onClick={() => setSearchOpen(true)}
                className="text-navy hover:opacity-60 transition-opacity"
                title="Buscar (⌘K)"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setMenuOpen(true)}
              className="bg-red text-white text-[11px] font-semibold tracking-[2px] px-5 h-10 flex items-center gap-2.5 hover:bg-[#7d140f] transition-colors"
            >
              <span>{navbarCfg.menuLabel}</span>
              <span className="flex flex-col gap-[5px]">
                <span className="block w-[16px] h-[1.5px] bg-white" />
                <span className="block w-[16px] h-[1.5px] bg-white" />
              </span>
            </button>
          </div>

          {/* Mobile MENÚ */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-red text-white text-[10px] font-semibold tracking-[1.5px] px-4 h-9"
          >
            {navbarCfg.menuLabel}
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
              style={{ background: "var(--color-navy)" }}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <div
                className="absolute inset-0 opacity-[0.35]"
                style={{
                  backgroundImage: `url(${megaMenuCfg.bgImage})`,
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
                <p className="text-white/75 text-[15px] leading-[1.65] max-w-[280px] whitespace-pre-line">
                  {megaMenuCfg.tagline}
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
                    <span className="text-red text-[10px] font-bold tracking-[3px] uppercase mb-3">
                      Secciones
                    </span>
                    {categorias.map((cat, i) => (
                      <motion.button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className="flex items-center justify-between py-[10px] text-left w-full"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 + i * 0.035, duration: 0.35, ease }}
                      >
                        <span
                          className="font-semibold text-[18px] leading-[1.2] transition-colors duration-150"
                          style={{ color: activeCategory === cat.id ? "#FFFFFF" : "rgba(255,255,255,0.4)" }}
                        >
                          {cat.label}
                        </span>
                        {activeCategory === cat.id && (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" strokeWidth="2.5">
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
                      {activeCat && (
                        <motion.div
                          key={activeCat.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25, ease }}
                        >
                          <span className="text-red text-[10px] font-bold tracking-[3px] uppercase mb-3 block">
                            {activeCat.label.toUpperCase()}
                          </span>
                          {activeCat.items.map((item, i) => (
                            <motion.a
                              key={item.id}
                              href={item.href}
                              target={item.external ? "_blank" : undefined}
                              rel={item.external ? "noopener noreferrer" : undefined}
                              className="flex items-center gap-3 py-[14px] border-b border-white/[0.07] group w-full"
                              initial={{ opacity: 0, x: 12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.3, ease }}
                              onClick={() => setMenuOpen(false)}
                            >
                              <span className="w-1 h-1 rounded-sm bg-red flex-shrink-0" />
                              <span className="text-white text-[16px] font-normal group-hover:text-white/70 transition-colors flex-1">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className="inline-flex items-center px-2 rounded-full"
                                  style={{
                                    height: 18,
                                    background: "var(--color-red)",
                                    color: "#FFFFFF",
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </motion.a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* MOBILE — acordeón */}
                <div className="md:hidden flex-1 overflow-y-auto px-7 pt-2">
                  {categorias.map((cat, i) => (
                    <motion.div
                      key={cat.id}
                      className="border-b border-white/10"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.04 + i * 0.06, duration: 0.3, ease }}
                    >
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === cat.id ? null : cat.id)
                        }
                        className="flex items-center justify-between w-full py-[12px]"
                      >
                        <span
                          className="font-semibold text-[16px] leading-[1.25] pr-3 transition-colors"
                          style={{ color: mobileExpanded === cat.id ? "#FFFFFF" : "rgba(255,255,255,0.45)" }}
                        >
                          {cat.label}
                        </span>
                        <motion.svg
                          width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke={mobileExpanded === cat.id ? "var(--color-red)" : "rgba(255,255,255,0.3)"}
                          strokeWidth="2.5"
                          animate={{ rotate: mobileExpanded === cat.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path d="m9 18 6-6-6-6" />
                        </motion.svg>
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileExpanded === cat.id && (
                          <motion.div
                            key={`msub-${cat.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease }}
                            className="overflow-hidden"
                          >
                            <div className="pb-4 flex flex-col pl-2">
                              {cat.items.map((item) => (
                                <a
                                  key={item.id}
                                  href={item.href}
                                  target={item.external ? "_blank" : undefined}
                                  rel={item.external ? "noopener noreferrer" : undefined}
                                  className="flex items-center gap-3 py-2.5"
                                  onClick={() => setMenuOpen(false)}
                                >
                                  <span className="w-[5px] h-[5px] rounded-sm bg-red flex-shrink-0" />
                                  <span className="text-white/80 text-[14px] flex-1">{item.label}</span>
                                  {item.badge && (
                                    <span
                                      className="inline-flex items-center px-2 rounded-full"
                                      style={{
                                        height: 16,
                                        background: "var(--color-red)",
                                        color: "#FFFFFF",
                                        fontSize: 8,
                                        fontWeight: 700,
                                        letterSpacing: 0.5,
                                        textTransform: "uppercase",
                                      }}
                                    >
                                      {item.badge}
                                    </span>
                                  )}
                                </a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}

                  {/* Contacto info — mobile (derivado de configuracion_global[contacto]) */}
                  {mobileContactLines.length > 0 && (
                    <div className="mt-5 pt-4 pb-2">
                      <p className="text-white/40 text-[10px] tracking-[2px] uppercase font-bold mb-2">Contacto</p>
                      <p className="text-white/55 text-[12px] leading-relaxed">
                        {mobileContactLines.map((line, i) => (
                          <span key={i}>
                            {line}
                            {i < mobileContactLines.length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisor horizontal */}
              <div className="mx-8 md:mx-16 h-[1px] bg-white/10 mt-6 md:mt-8 flex-shrink-0" />

              {/* CTA row */}
              <div className="flex items-center justify-between px-8 md:px-16 py-6 md:py-8 flex-shrink-0">
                <div className="flex flex-col gap-2">
                  {megaMenuCfg.ctaFooter.pretitle && (
                    <span className="hidden md:block text-white/60 text-[13px]">
                      {megaMenuCfg.ctaFooter.pretitle}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {megaMenuCfg.ctaFooter.buttons.map((btn, i) => {
                      // Estilo fijo por posición: rojo, rojo outline, blanco outline×N
                      const className =
                        i === 0
                          ? "bg-red text-white text-[12px] md:text-[13px] font-bold tracking-[0.5px] px-5 md:px-6 py-3 rounded hover:bg-[#7d140f] transition-colors"
                          : i === 1
                            ? "border border-red text-red text-[12px] md:text-[13px] font-semibold px-5 md:px-6 py-3 rounded hover:bg-red hover:text-white transition-colors"
                            : "border border-white/30 text-white/80 text-[12px] md:text-[13px] px-5 md:px-6 py-3 rounded hover:bg-white/10 transition-colors";
                      return (
                        <a
                          key={`${btn.label}-${i}`}
                          href={btn.href}
                          className={className}
                          onClick={() => setMenuOpen(false)}
                        >
                          {btn.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
                {phoneLine && (
                  <div className="hidden md:flex items-center gap-2 text-white/50 text-[13px]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.9a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
                    </svg>
                    {phoneLine}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay de búsqueda global — Cmd+K abre, Esc cierra */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
