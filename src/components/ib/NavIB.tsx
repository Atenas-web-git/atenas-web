"use client";

import Link from "next/link";

type IBSlug =
  | "atributos"
  | "infraestructura"
  | "documentos"
  | "escuela-padres"
  | "visitas"
  | "politicas"
  | "capacitacion";

const IB_PAGES: { slug: IBSlug; label: string }[] = [
  { slug: "atributos",      label: "Atributos IB" },
  { slug: "infraestructura", label: "Infraestructura" },
  { slug: "documentos",     label: "Documentos IB" },
  { slug: "escuela-padres", label: "Escuela de Padres" },
  { slug: "visitas",        label: "Visitas" },
  { slug: "politicas",      label: "Políticas" },
  { slug: "capacitacion",   label: "Capacitación" },
];

interface Props {
  current: IBSlug;
}

export function NavIB({ current }: Props) {
  const others = IB_PAGES.filter((p) => p.slug !== current);

  return (
    <nav
      className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0
        bg-[#1A2B4A] px-6 py-5 md:px-[160px] md:py-0 md:h-[72px] overflow-x-auto"
    >
      <Link
        href="/academico/ib"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: "#C9A84C",
          letterSpacing: 2,
          textTransform: "uppercase",
          flexShrink: 0,
          textDecoration: "none",
        }}
        className="hover:brightness-110 transition-all duration-200"
      >
        Bachillerato IB ★
      </Link>

      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 md:ml-10 flex-wrap">
        {others.map((p, i) => (
          <span key={p.slug} className="flex items-center">
            {i > 0 && (
              <span
                className="hidden md:block mx-5"
                style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }}
              />
            )}
            <Link
              href={`/academico/ib/${p.slug}`}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.70)",
                textDecoration: "none",
              }}
              className="hover:text-white transition-colors duration-200 whitespace-nowrap"
            >
              {p.label}
            </Link>
          </span>
        ))}
      </div>
    </nav>
  );
}
