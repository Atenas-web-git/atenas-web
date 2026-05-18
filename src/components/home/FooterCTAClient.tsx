"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { LogoSVG } from "@/components/shared/LogoSVG";
import type { FooterConfig } from "@/lib/cms/footer";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export type SocialItem = {
  label: string;
  href: string;
  /** Identificador del icono SVG a renderizar. */
  variant: "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin";
};

export type FooterCTAClientProps = {
  footer: FooterConfig;
  socials: SocialItem[];
  /** Línea pequeña "teléfono · correo" construida desde configuracion_global[contacto]. */
  contactoLine: string;
};

function SocialIcon({ variant }: { variant: SocialItem["variant"] }) {
  switch (variant) {
    case "facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      );
    case "youtube":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
        </svg>
      );
    case "tiktok":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.6 6.32a4.93 4.93 0 0 1-2.92-1.05A4.86 4.86 0 0 1 14.92 2H11.5v13.06a2.45 2.45 0 1 1-2.45-2.45c.26 0 .51.04.74.12V9.27a5.74 5.74 0 0 0-.74-.05A5.74 5.74 0 1 0 14.79 15V8.93a8.27 8.27 0 0 0 4.81 1.55V6.32z" />
        </svg>
      );
    case "x":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h3l-7.5 8.6L22 22h-6.8l-5.3-6.9L3.6 22H0.6l8-9.2L0 2h6.9l4.8 6.3L18 2z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.55 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.33-2.36 4.63 0 5.48 3.04 5.48 7v7.45h-4.55V15.6c0-1.7-.03-3.88-2.37-3.88-2.37 0-2.73 1.85-2.73 3.76V22H7.77V8z" />
        </svg>
      );
  }
}

export function FooterCTAClient({ footer, socials, contactoLine }: FooterCTAClientProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <footer
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0F1D33] min-h-[640px] md:min-h-[660px] flex flex-col items-center justify-center
                 py-12 md:py-20 px-6 md:px-8"
    >
      {/* Foto de fondo con parallax */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src={footer.bgImage}
          alt="Campus Atenas"
          fill
          className="object-cover object-center"
          sizes="100vw"
          style={{ opacity: 0.18 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,29,51,0.82) 0%, rgba(15,29,51,0.70) 50%, rgba(15,29,51,0.92) 100%)",
          }}
        />
      </motion.div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[342px] md:max-w-[760px]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
        >
          <LogoSVG variant="white" className="w-[161px] md:w-[200px]" />
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="mt-6 md:mt-8 text-white font-bold leading-[1.1]"
          style={{ fontSize: "clamp(30px, 3.6vw, 52px)" }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          {footer.headline}
        </motion.h2>

        {/* Subtítulo */}
        <motion.p
          className="mt-4 text-white/65 text-[13px] leading-[1.7] whitespace-pre-line"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.35, ease }}
        >
          {footer.subtitle}
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-6 md:mt-8 flex flex-col gap-3 w-full sm:flex-row sm:w-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
        >
          <motion.a
            href={footer.ctaPrimary.href}
            className="bg-[#9e1915] text-white text-[14px] font-bold tracking-[0.5px] px-8 py-3 text-center rounded-[6px] w-full sm:w-auto"
            whileHover={{ scale: 1.03, filter: "brightness(1.1)" }}
            transition={{ duration: 0.18 }}
          >
            {footer.ctaPrimary.label}
          </motion.a>
          <motion.a
            href={footer.ctaSecondary.href}
            className="border border-white/40 text-white text-[14px] font-semibold tracking-[0.5px] px-8 py-3 text-center rounded-[6px] w-full sm:w-auto"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            transition={{ duration: 0.18 }}
          >
            {footer.ctaSecondary.label}
          </motion.a>
        </motion.div>

        {/* Redes sociales */}
        {socials.length > 0 && (
          <motion.div
            className="mt-8 flex gap-3.5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.65, ease }}
          >
            {socials.map((s, i) => (
              <motion.a
                key={s.variant}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                style={{ background: "rgba(255,255,255,0.12)" }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.65 + i * 0.08, ease }}
              >
                <SocialIcon variant={s.variant} />
              </motion.a>
            ))}
          </motion.div>
        )}

        {/* Aliados estratégicos */}
        {footer.aliados.length > 0 && (
          <motion.div
            className="mt-10 w-full flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.75, ease }}
          >
            <span className="text-white/40 text-[10px] tracking-[2px] uppercase font-bold">
              {footer.aliadosLabel}
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 opacity-80">
              {footer.aliados.map((a) => (
                <div
                  key={`${a.abbr}-${a.label}`}
                  className="text-white/70 text-[10px] font-semibold tracking-[1.5px] uppercase border border-white/20 rounded-md px-3 py-[6px]"
                  title={a.label}
                >
                  {a.abbr}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sección inferior */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-2 w-full"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.75, ease }}
        >
          <div className="h-px bg-white/15 w-full max-w-[360px] md:max-w-[600px] mb-1" />

          {footer.links.length > 0 && (
            <>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 md:gap-6 md:hidden">
                {footer.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/50 text-[11px] tracking-[0.3px] hover:text-white/80 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="hidden md:flex flex-wrap justify-center gap-6">
                {footer.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/50 text-[12px] tracking-[0.5px] hover:text-white/80 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </>
          )}

          {contactoLine && (
            <p className="text-white/55 text-[11px] text-center mt-1">{contactoLine}</p>
          )}

          {footer.copyright && (
            <p className="text-white/30 text-[10px] text-center">{footer.copyright}</p>
          )}
        </motion.div>
      </div>
    </footer>
  );
}
