"use client";

import Link from "next/link";

type NivelSlug = "inicial" | "egb-elemental-media" | "egb-superior";

const NIVELES: { slug: NivelSlug; label: string }[] = [
  { slug: "inicial",            label: "Educación Inicial" },
  { slug: "egb-elemental-media", label: "EGB Elemental y Media" },
  { slug: "egb-superior",        label: "EGB Superior" },
];

interface Props {
  current: NivelSlug;
}

export function NavNiveles({ current }: Props) {
  const others = NIVELES.filter((n) => n.slug !== current);

  return (
    <nav
      className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-0
        bg-[#1A2B4A] px-6 py-5 md:px-[160px] md:py-0 md:h-[72px]"
    >
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          color: "#C9A84C",
          letterSpacing: 2,
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        Otros niveles
      </span>

      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 md:ml-10">
        {others.map((n, i) => (
          <span key={n.slug} className="flex items-center">
            {i > 0 && (
              <span
                className="hidden md:block mx-6"
                style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }}
              />
            )}
            <Link
              href={`/academico/niveles/${n.slug}`}
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "rgba(255,255,255,0.70)",
                textDecoration: "none",
              }}
              className="hover:text-white transition-colors duration-200"
            >
              {n.label}
            </Link>
          </span>
        ))}

        {/* Separador y enlace IB */}
        <span className="hidden md:block mx-6" style={{ width: 1, height: 20, background: "rgba(255,255,255,0.15)" }} />
        <Link
          href="/academico/ib"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#C9A84C",
            textDecoration: "none",
          }}
          className="hover:brightness-110 transition-all duration-200"
        >
          Bachillerato IB ★
        </Link>
      </div>
    </nav>
  );
}
