"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { LogoSVG } from "@/components/shared/LogoSVG";

type SolicitudData = {
  numero: string;
  estado: string;
  created_at: string;
  est_nombres: string;
  est_apellidos: string;
  est_nivel: string;
};

const ESTADOS: Record<string, { label: string; desc: string; step: number }> = {
  pendiente:  { label: "Solicitud recibida",  desc: "Tu solicitud está en cola y será revisada en las próximas 48 horas hábiles.", step: 1 },
  revisando:  { label: "En revisión",         desc: "Nuestro equipo de admisiones está analizando tu solicitud.", step: 2 },
  contactado: { label: "Familia contactada",  desc: "¡Nuestro equipo ya se puso en contacto contigo para coordinar los próximos pasos!", step: 3 },
};

const PASOS = ["Solicitud recibida", "En revisión", "Familia contactada"];

function StatusCard({ data }: { data: SolicitudData }) {
  const estado = ESTADOS[data.estado] ?? ESTADOS.pendiente;
  const fecha = new Date(data.created_at).toLocaleDateString("es-EC", { dateStyle: "long" });

  return (
    <div
      className="bg-white rounded-[12px] overflow-hidden w-full max-w-[600px]"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}
    >
      {/* Header */}
      <div className="bg-[#1A2B4A] px-8 py-6">
        <p className="text-[#C9A84C] text-[10px] font-bold tracking-[2px] uppercase mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          N° de seguimiento
        </p>
        <p className="text-white text-[26px] font-bold tracking-wide"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          {data.numero}
        </p>
        <p className="text-white/50 text-[12px] mt-1"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          Enviada el {fecha}
        </p>
      </div>

      {/* Progreso */}
      <div className="px-8 py-6 border-b border-[#F0ECE7]">
        <div className="flex items-start">
          {PASOS.map((paso, i) => {
            const n = i + 1;
            const done = n <= estado.step;
            const active = n === estado.step;
            return (
              <div key={n} className="flex items-start flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                    style={{
                      background: done ? "#16A34A" : "#F3F4F6",
                      color: done ? "#fff" : "#9CA3AF",
                      boxShadow: active ? "0 0 0 4px rgba(22,163,74,0.15)" : "none",
                    }}
                  >
                    {done ? "✓" : n}
                  </div>
                  <p
                    className="text-[10px] font-semibold text-center mt-2 leading-tight"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      color: done ? "#16A34A" : "#9CA3AF",
                      maxWidth: 72,
                    }}
                  >
                    {paso}
                  </p>
                </div>
                {i < PASOS.length - 1 && (
                  <div
                    className="h-[2px] flex-1 mt-4"
                    style={{ background: n < estado.step ? "#16A34A" : "#E5E7EB" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Estado actual */}
      <div className="px-8 py-5 bg-[#F0FDF4] border-b border-[#F0ECE7]">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-[#16A34A] mt-[6px] flex-shrink-0" />
          <div>
            <p className="text-[13px] font-bold text-[#15803D]"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              {estado.label}
            </p>
            <p className="text-[13px] text-[#374151] mt-[2px] leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              {estado.desc}
            </p>
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="px-8 py-6">
        <p className="text-[11px] font-bold tracking-[1px] uppercase text-[#9CA3AF] mb-3"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          Datos de la solicitud
        </p>
        <div className="flex flex-col gap-2">
          {[
            ["Estudiante", `${data.est_nombres} ${data.est_apellidos}`],
            ["Nivel solicitado", data.est_nivel],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-2 text-[13px]" style={{ fontFamily: "Poppins, sans-serif" }}>
              <span className="text-[#9CA3AF] w-[140px] flex-shrink-0">{label}</span>
              <span className="text-[#1A2B4A] font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-[#F8F5F0] flex flex-col sm:flex-row gap-3 items-center justify-between">
        <p className="text-[11px] text-[#9CA3AF]" style={{ fontFamily: "Poppins, sans-serif" }}>
          ¿Dudas?{" "}
          <a href="mailto:admisiones@atenas.edu.ec" className="text-[#C9A84C] underline">
            admisiones@atenas.edu.ec
          </a>
        </p>
        <Link
          href="/admisiones"
          className="text-[12px] font-semibold text-[#1A2B4A] hover:underline"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ← Volver a admisiones
        </Link>
      </div>
    </div>
  );
}

export default function SeguimientoPage() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SolicitudData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const buscar = async (numero: string) => {
    const n = numero.trim().toUpperCase();
    if (!n) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);
    try {
      const res = await fetch(`/api/admisiones/seguimiento?numero=${encodeURIComponent(n)}`);
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "No se encontró ninguna solicitud con ese número.");
      } else {
        setResult(data);
      }
    } catch {
      setErrorMsg("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const n = searchParams.get("numero");
    if (n) {
      setInput(n);
      buscar(n);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buscar(input);
  };

  return (
    <>
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
          Seguimiento de Solicitud
        </span>
        <Link
          href="/admisiones"
          className="text-white/60 text-[13px] hover:text-white/90 transition-colors"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ← Volver a admisiones
        </Link>
      </header>

      <main className="min-h-[calc(100vh-64px)] bg-[#EEF2F7] py-12 px-4">
        <div className="max-w-[600px] mx-auto flex flex-col items-center gap-8">

          {/* Título */}
          <div className="text-center">
            <p className="text-[#C9A84C] text-[11px] font-bold tracking-[2.5px] uppercase mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Módulo de Admisiones
            </p>
            <h1 className="text-[#1A2B4A] text-[28px] font-bold leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Consulta tu solicitud
            </h1>
            <p className="text-[#6B7280] text-[14px] mt-2 leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              Ingresa el número de seguimiento que recibiste al enviar tu solicitud.
            </p>
          </div>

          {/* Buscador */}
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ATN-2026-XXXXXX"
              className="flex-1 h-[50px] rounded-[6px] border border-[#C8C4BD] bg-white px-4
                text-[14px] text-[#1A2B4A] placeholder:text-[#9CA3AF] outline-none
                focus:border-[#1A2B4A] focus:shadow-[0_0_0_3px_rgba(26,43,74,0.09)]
                transition-[border-color,box-shadow]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-[50px] px-6 rounded-[6px] bg-[#1A2B4A] text-white text-[14px]
                font-semibold hover:bg-[#22375e] transition-colors disabled:opacity-50
                disabled:cursor-not-allowed flex-shrink-0"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {loading ? "Buscando..." : "Consultar"}
            </button>
          </form>

          {/* Error */}
          {errorMsg && (
            <div className="w-full bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] px-4 py-3">
              <p className="text-[13px] text-[#9e1915]" style={{ fontFamily: "Poppins, sans-serif" }}>
                {errorMsg}
              </p>
            </div>
          )}

          {/* Resultado */}
          {result && <StatusCard data={result} />}

        </div>
      </main>
    </>
  );
}
