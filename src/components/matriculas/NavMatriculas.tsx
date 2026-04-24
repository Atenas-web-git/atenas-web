"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export type MatSlug = "proceso" | "valores" | "listas" | "autorizaciones";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const ITEMS: { slug: MatSlug; label: string }[] = [
  { slug: "proceso", label: "Proceso" },
  { slug: "valores", label: "Valores" },
  { slug: "listas", label: "Listas de Útiles" },
  { slug: "autorizaciones", label: "Autorizaciones Bancarias" },
];

export function NavMatriculas({ current }: { current?: MatSlug }) {
  return (
    <motion.nav
      className="w-full bg-[#1A2B4A] overflow-x-auto"
      style={{ height: 64, flexShrink: 0 }}
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease }}
    >
      <div className="flex items-stretch h-full px-4 md:px-[160px]" style={{ minWidth: "max-content" }}>
        {ITEMS.map((item) => {
          const isActive = item.slug === current;
          if (isActive) {
            return (
              <div
                key={item.slug}
                className="relative flex flex-col items-center justify-between px-5"
                style={{ paddingTop: 20, paddingBottom: 0, height: "100%" }}
              >
                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 700, color: "#FFFFFF", letterSpacing: 1.5, whiteSpace: "nowrap" }}>
                  {item.label}
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
              key={item.slug}
              href={`/matriculas/${item.slug}`}
              className="flex items-center h-full px-5"
              style={{ textDecoration: "none" }}
            >
              <motion.span
                style={{ fontFamily: "Poppins, sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.50)", letterSpacing: 1.5, whiteSpace: "nowrap" }}
                whileHover={{ color: "#FFFFFF" }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
