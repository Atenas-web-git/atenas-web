"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export type EspacioSlug =
  | "vase"
  | "cas"
  | "idioma"
  | "cultura"
  | "educacion-fisica"
  | "intercambio";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ESPACIOS: { slug: EspacioSlug; label: string }[] = [
  { slug: "vase",             label: "VASE" },
  { slug: "cas",              label: "CAS" },
  { slug: "idioma",           label: "Idioma" },
  { slug: "cultura",          label: "Cultura" },
  { slug: "educacion-fisica", label: "Ed. Física" },
  { slug: "intercambio",      label: "Intercambio" },
];

export function NavEspacios({ current }: { current: EspacioSlug }) {
  return (
    <motion.nav
      className="w-full bg-[#1A2B4A] overflow-x-auto"
      style={{ height: 64, flexShrink: 0 }}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease }}
    >
      <div className="flex items-stretch h-full px-4 md:px-[160px]" style={{ minWidth: "max-content" }}>
        {ESPACIOS.map((e) => {
          const isActive = e.slug === current;
          if (isActive) {
            return (
              <div
                key={e.slug}
                className="relative flex flex-col items-center justify-between px-5"
                style={{ paddingTop: 20, paddingBottom: 0, height: "100%" }}
              >
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: 1.5, whiteSpace: "nowrap" }}>
                  {e.label}
                </span>
                <motion.span
                  className="block w-full bg-[#C9A84C]"
                  style={{ height: 2 }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.45, delay: 0.15, ease }}
                />
              </div>
            );
          }
          return (
            <Link
              key={e.slug}
              href={`/espacios/${e.slug}`}
              className="flex items-center h-full px-5"
              style={{ textDecoration: "none" }}
            >
              <motion.span
                style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.50)", letterSpacing: 1.5, whiteSpace: "nowrap" }}
                whileHover={{ color: "#FFFFFF" }}
                transition={{ duration: 0.2 }}
              >
                {e.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
