"use client";

import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";

type Props = {
  label?: string;
  href?: string;
  descripcion?: string;
};

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * Botón CTA "Descargar más información" opcional para plantillas A y F.
 * Si falta `label` o `href`, NO se renderiza nada (sección oculta).
 *
 * Si el href apunta a Google Drive u otro dominio externo, abre en nueva
 * pestaña automáticamente.
 */
export function CTADescargas({ label, href, descripcion }: Props) {
  // Solo renderizar si ambos campos están completos
  if (!label?.trim() || !href?.trim()) return null;

  const isExternal = href.startsWith("http") || href.startsWith("//");
  const isDriveLike = /drive\.google|docs\.google|dropbox|onedrive/i.test(href);
  const Icon = isDriveLike ? Download : isExternal ? ExternalLink : Download;

  return (
    <section
      className="relative"
      style={{
        background: "linear-gradient(180deg, #F8F5F0 0%, #FFFFFF 100%)",
        paddingTop: 60,
        paddingBottom: 80,
      }}
    >
      <div className="px-6 md:px-[160px] flex flex-col items-center text-center gap-5">
        {descripcion && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease }}
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 14,
              color: "#6B6660",
              maxWidth: 580,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {descripcion}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1, ease }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-[10px] px-7 py-[14px]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              background: "var(--color-navy, #1A2B4A)",
              border: "1.5px solid var(--color-navy, #1A2B4A)",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(26,43,74,0.18)",
            }}
          >
            <Icon size={16} strokeWidth={2.4} />
            {label}
            {isExternal && !isDriveLike && (
              <ExternalLink size={12} strokeWidth={2.4} style={{ opacity: 0.7 }} />
            )}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
