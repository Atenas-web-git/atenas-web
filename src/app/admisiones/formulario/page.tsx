import type { Metadata } from "next";
import Link from "next/link";
import { LogoSVG } from "@/components/shared/LogoSVG";
import { FormularioMultiStep } from "@/components/admisiones/FormularioMultiStep";

export const metadata: Metadata = {
  title: "Solicitud de Admisión — Unidad Educativa Atenas",
  description:
    "Inicia el proceso de admisión para tu hijo/a en la Unidad Educativa Atenas. Completa el formulario en 4 sencillos pasos.",
  robots: { index: false, follow: false },
};

export default async function FormularioPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  return (
    <>
      {/* Minimal header — sin el mega-menú para mantener el foco en el formulario */}
      <header
        className="h-[64px] bg-[#1A2B4A] flex items-center justify-between
          px-[56px] max-sm:px-[20px] sticky top-0 z-50"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        <Link href="/" aria-label="Inicio">
          <LogoSVG variant="white" className="w-[120px]" />
        </Link>

        <span
          className="text-white/70 text-[15px] font-semibold hidden sm:block"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Proceso de Admisión
        </span>

        <Link
          href="/admisiones"
          className="text-white/60 text-[13px] hover:text-white/90 transition-colors"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ← Volver al sitio
        </Link>
      </header>

      <main>
        <FormularioMultiStep nivelInicial={nivel ?? ""} />
      </main>
    </>
  );
}
