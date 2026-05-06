import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Portal Familiar — Unidad Educativa Atenas",
  description:
    "Accede al seguimiento de tu solicitud de admisión o a la plataforma educativa Idukay desde el portal familiar de la Unidad Educativa Atenas.",
};

const ACCESOS = [
  {
    badge: "Postulantes",
    title: "Seguimiento de Admisión",
    description:
      "¿Llenaste la solicitud de admisión y quieres saber en qué etapa va? Ingresa con tu número de seguimiento (ATN-YYYY-XXXXXX) y consulta el estado en tiempo real.",
    cta: "Consultar mi solicitud",
    href: "/admisiones/seguimiento",
    external: false,
    accent: "#C9A84C",
    bullets: [
      "Estado actualizado del proceso",
      "Pipeline visual de 7 etapas",
      "Sin necesidad de crear cuenta",
    ],
  },
  {
    badge: "Familias matriculadas",
    title: "Plataforma Idukay",
    description:
      "¿Tu hijo ya es estudiante de Atenas? Accede a Idukay para ver calificaciones, comunicados, calendario académico y estado de cuenta.",
    cta: "Ir a Idukay",
    href: "https://idukay.net/colegios/#/login",
    external: true,
    accent: "#1A2B4A",
    bullets: [
      "Calificaciones y reportes",
      "Comunicados oficiales",
      "Calendario y estado de cuenta",
    ],
  },
];

export default function PortalFamiliarPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F5F1EB] min-h-screen pt-[88px]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0D1825] via-[#1A2B4A] to-[#0F1E30] py-16 px-6">
          <div
            className="absolute -right-[120px] -top-[120px] rounded-full pointer-events-none"
            style={{ width: 400, height: 400, background: "rgba(201,168,76,0.08)" }}
          />
          <div
            className="absolute -left-[80px] -bottom-[80px] rounded-full pointer-events-none"
            style={{ width: 280, height: 280, background: "rgba(255,255,255,0.04)" }}
          />
          <div className="relative z-10 max-w-[820px] mx-auto flex flex-col items-center text-center gap-5">
            <div className="flex items-center gap-[10px]">
              <span className="block bg-[#C9A84C]" style={{ width: 24, height: 2 }} />
              <span
                className="text-[#C9A84C] text-[11px] font-bold tracking-[2.5px] uppercase"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Portal Familiar
              </span>
              <span className="block bg-[#C9A84C]" style={{ width: 24, height: 2 }} />
            </div>
            <h1
              className="text-white font-bold leading-[1.1]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(28px, 3.5vw, 44px)",
              }}
            >
              Bienvenido a la familia Atenas
            </h1>
            <p
              className="text-white/70 leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 15, maxWidth: 580 }}
            >
              Selecciona la opción que mejor se ajuste a tu caso. Si recién solicitaste admisión,
              consulta el estado de tu trámite. Si ya eres parte del colegio, accede a Idukay.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="py-16 px-6">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ACCESOS.map((acc) => (
              <article
                key={acc.title}
                className="bg-white flex flex-col gap-6 p-8 transition-shadow hover:shadow-md"
                style={{
                  border: "1px solid #E8E4DD",
                  borderRadius: 16,
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                <div className="flex flex-col gap-2">
                  <span
                    className="inline-flex items-center self-start px-3 rounded-full"
                    style={{
                      height: 22,
                      background: `${acc.accent}15`,
                      border: `1px solid ${acc.accent}40`,
                      fontSize: 10,
                      fontWeight: 700,
                      color: acc.accent,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {acc.badge}
                  </span>
                  <h2
                    className="text-[#1A2B4A] font-bold leading-tight"
                    style={{ fontSize: 24, marginTop: 4 }}
                  >
                    {acc.title}
                  </h2>
                </div>

                <p
                  className="text-[#374151]"
                  style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}
                >
                  {acc.description}
                </p>

                <ul className="flex flex-col gap-2.5">
                  {acc.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-[#374151]"
                      style={{ fontSize: 13 }}
                    >
                      <span
                        className="flex-shrink-0 mt-[2px]"
                        style={{ color: acc.accent, fontWeight: 800 }}
                      >
                        ✓
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="flex-1" />

                {acc.external ? (
                  <a
                    href={acc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-[8px] px-7 py-[14px]
                      font-bold text-[14px] transition-colors w-full sm:w-auto self-start"
                    style={{
                      background: acc.accent,
                      color: "#FFFFFF",
                      textDecoration: "none",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {acc.cta} ↗
                  </a>
                ) : (
                  <Link
                    href={acc.href}
                    className="inline-flex items-center justify-center rounded-[8px] px-7 py-[14px]
                      font-bold text-[14px] transition-colors w-full sm:w-auto self-start"
                    style={{
                      background: "#1A2B4A",
                      color: "#FFFFFF",
                      textDecoration: "none",
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {acc.cta} →
                  </Link>
                )}
              </article>
            ))}
          </div>

          <div
            className="max-w-[820px] mx-auto mt-10 px-6 py-5 rounded-[12px] flex items-start gap-3"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            <span style={{ fontSize: 18 }}>💡</span>
            <p
              className="text-[#6B6660]"
              style={{ fontSize: 13, margin: 0, lineHeight: 1.6 }}
            >
              <strong className="text-[#1A2B4A]">¿Aún no postulas?</strong> Si quieres iniciar el
              proceso de admisión para tu hijo o hija, visita la sección de{" "}
              <Link href="/admisiones" className="text-[#C9A84C] underline font-semibold">
                Admisiones
              </Link>{" "}
              y completa el formulario en línea.
            </p>
          </div>
        </section>
      </main>
      <FooterCTA />
    </>
  );
}
