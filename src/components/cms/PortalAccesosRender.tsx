"use client";

import Link from "next/link";
import type { ContenidoPlantillaT } from "@/app/admin/(authenticated)/contenido/plantillas";

const ACCENT_COLOR_MAP: Record<ContenidoPlantillaT["cards"][number]["accentColor"], string> = {
  gold: "var(--color-red)",
  navy: "var(--color-navy)",
  red: "var(--color-red)",
};

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export type PortalAccesosRenderProps = {
  hero: ContenidoPlantillaT["hero"];
  intro: ContenidoPlantillaT["intro"];
  cards: ContenidoPlantillaT["cards"];
  notaPie: ContenidoPlantillaT["notaPie"];
};

/**
 * Renderer de plantilla T — portal con cards de acceso.
 *
 * Hero gradient navy + intro opcional + grid de cards con badge, título,
 * descripción, bullets y CTA (interno o externo según el href). El
 * `accentColor` controla el color del badge y del botón. La nota al pie
 * es opcional (si todos los campos están vacíos no se renderiza).
 */
export function PortalAccesosRender({
  hero,
  intro,
  cards,
  notaPie,
}: PortalAccesosRenderProps) {
  const notaActiva =
    !!(notaPie.tituloNegrita.trim() || notaPie.texto.trim() || notaPie.linkLabel.trim());
  const introActiva = !!(intro.titulo?.trim() || intro.descripcion?.trim());

  return (
    <div className="bg-[#F5F1EB] min-h-screen pt-[88px]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark via-navy to-[#0F1E30] py-16 px-6">
        <div
          className="absolute -right-[120px] -top-[120px] rounded-full pointer-events-none"
          style={{ width: 400, height: 400, background: "rgba(158,25,21,0.08)" }}
        />
        <div
          className="absolute -left-[80px] -bottom-[80px] rounded-full pointer-events-none"
          style={{ width: 280, height: 280, background: "rgba(255,255,255,0.04)" }}
        />
        <div className="relative z-10 max-w-[820px] mx-auto flex flex-col items-center text-center gap-5">
          {hero.eyebrow && (
            <div className="flex items-center gap-[10px]">
              <span className="block bg-red" style={{ width: 24, height: 2 }} />
              <span
                className="text-red text-[11px] font-bold tracking-[2.5px] uppercase"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {hero.eyebrow}
              </span>
              <span className="block bg-red" style={{ width: 24, height: 2 }} />
            </div>
          )}
          <h1
            className="text-white font-bold leading-[1.1]"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(28px, 3.5vw, 44px)",
            }}
          >
            {hero.title}
          </h1>
          <p
            className="text-white/70 leading-relaxed"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 15,
              maxWidth: 580,
            }}
          >
            {hero.description}
          </p>
        </div>
      </section>

      {/* Intro opcional */}
      {introActiva && (
        <section className="px-6 pt-12">
          <div className="max-w-[820px] mx-auto flex flex-col gap-2 text-center">
            {intro.titulo && (
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--color-navy)",
                  margin: 0,
                }}
              >
                {intro.titulo}
              </h2>
            )}
            {intro.descripcion && (
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: 14,
                  color: "rgba(13,24,37,0.55)",
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                {intro.descripcion}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Cards */}
      {cards.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cards.map((acc, i) => {
              const accent = ACCENT_COLOR_MAP[acc.accentColor] ?? ACCENT_COLOR_MAP.gold;
              const external = isExternal(acc.ctaHref);
              const ctaLabel = external ? `${acc.ctaLabel} ↗` : `${acc.ctaLabel} →`;
              return (
                <article
                  key={`${acc.title}-${i}`}
                  className="bg-white flex flex-col gap-6 p-8 transition-shadow hover:shadow-md"
                  style={{
                    border: "1px solid #E8E4DD",
                    borderRadius: 16,
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {acc.badge && (
                      <span
                        className="inline-flex items-center self-start px-3 rounded-full"
                        style={{
                          height: 22,
                          background: `${accent}15`,
                          border: `1px solid ${accent}40`,
                          fontSize: 10,
                          fontWeight: 700,
                          color: accent,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                        }}
                      >
                        {acc.badge}
                      </span>
                    )}
                    <h2
                      className="text-navy font-bold leading-tight"
                      style={{ fontSize: 24, marginTop: 4 }}
                    >
                      {acc.title}
                    </h2>
                  </div>

                  {acc.description && (
                    <p
                      className="text-[#374151]"
                      style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}
                    >
                      {acc.description}
                    </p>
                  )}

                  {acc.bullets.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {acc.bullets.map((b, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2 text-[#374151]"
                          style={{ fontSize: 13 }}
                        >
                          <span
                            className="flex-shrink-0 mt-[2px]"
                            style={{ color: accent, fontWeight: 800 }}
                          >
                            ✓
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex-1" />

                  {acc.ctaLabel && acc.ctaHref && (
                    external ? (
                      <a
                        href={acc.ctaHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-[8px] px-7 py-[14px] font-bold text-[14px] transition-colors w-full sm:w-auto self-start"
                        style={{
                          background: accent,
                          color: "#FFFFFF",
                          textDecoration: "none",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {ctaLabel}
                      </a>
                    ) : (
                      <Link
                        href={acc.ctaHref}
                        className="inline-flex items-center justify-center rounded-[8px] px-7 py-[14px] font-bold text-[14px] transition-colors w-full sm:w-auto self-start"
                        style={{
                          background: "var(--color-navy)",
                          color: "#FFFFFF",
                          textDecoration: "none",
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {ctaLabel}
                      </Link>
                    )
                  )}
                </article>
              );
            })}
          </div>

          {notaActiva && (
            <div
              className="max-w-[820px] mx-auto mt-10 px-6 py-5 rounded-[12px] flex items-start gap-3"
              style={{
                background: "rgba(158,25,21,0.08)",
                border: "1px solid rgba(158,25,21,0.25)",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <span style={{ fontSize: 18 }}>💡</span>
              <p
                className="text-[#6B6660]"
                style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}
              >
                {notaPie.tituloNegrita && (
                  <strong className="text-navy">{notaPie.tituloNegrita}</strong>
                )}
                {notaPie.tituloNegrita && notaPie.texto ? " " : ""}
                {notaPie.texto}
                {notaPie.linkLabel && notaPie.linkHref && (
                  <>
                    {" "}
                    {isExternal(notaPie.linkHref) ? (
                      <a
                        href={notaPie.linkHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red underline font-semibold"
                      >
                        {notaPie.linkLabel}
                      </a>
                    ) : (
                      <Link
                        href={notaPie.linkHref}
                        className="text-red underline font-semibold"
                      >
                        {notaPie.linkLabel}
                      </Link>
                    )}
                  </>
                )}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
