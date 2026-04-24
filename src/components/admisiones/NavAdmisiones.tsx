"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type AdmisionSlug = "inicial" | "egb-elemental-media" | "egb-superior" | "ib";

const NIVELES: { slug: AdmisionSlug; label: string; short: string }[] = [
  { slug: "inicial",             label: "Educación Inicial",       short: "Inicial" },
  { slug: "egb-elemental-media", label: "EGB Elemental y Media",   short: "EGB E/M" },
  { slug: "egb-superior",        label: "EGB Superior",            short: "EGB Superior" },
  { slug: "ib",                  label: "Bachillerato IB ★",       short: "IB ★" },
];

interface Props { current: AdmisionSlug }

export function NavAdmisiones({ current }: Props) {
  return (
    <motion.nav
      className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0
        bg-[#1A2B4A] px-6 py-4 md:px-[160px] md:py-0 md:h-[72px] overflow-x-auto"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 10, fontWeight: 700,
        color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase", flexShrink: 0 }}>
        Por nivel
      </span>

      <div className="flex flex-row flex-wrap md:flex-nowrap md:items-center gap-y-2 gap-x-0 md:ml-8">
        {NIVELES.map((n, i) => {
          const isActive = n.slug === current;
          return (
            <span key={n.slug} className="flex items-center">
              {i > 0 && (
                <span className="hidden md:block mx-5" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
              )}
              {isActive ? (
                <motion.span
                  className="relative"
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 700,
                    color: "#C9A84C", whiteSpace: "nowrap" }}
                >
                  <span className="hidden md:inline">{n.label}</span>
                  <span className="md:hidden">{n.short}</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 block bg-[#C9A84C]"
                    style={{ height: 2, borderRadius: 1 }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </motion.span>
              ) : (
                <Link
                  href={`/admisiones/${n.slug}`}
                  style={{ fontFamily: "Poppins, sans-serif", fontSize: 13, fontWeight: 500,
                    color: "rgba(255,255,255,0.60)", textDecoration: "none", whiteSpace: "nowrap" }}
                  className="hover:text-white transition-colors duration-200"
                >
                  <span className="hidden md:inline">{n.label}</span>
                  <span className="md:hidden">{n.short}</span>
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </motion.nav>
  );
}
