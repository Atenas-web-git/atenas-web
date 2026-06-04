"use client";

import { useState, useEffect, Suspense } from "react";
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

// Pipeline visual lineal — camino feliz de 7 etapas que ve el postulante.
// "no_admitido" es ramal terminal (se muestra aparte sin stepper).
const PIPELINE = [
  { key: "interesado", label: "Recibida" },
  { key: "postulante", label: "Requisitos" },
  { key: "postulacion_completa", label: "Documentos" },
  { key: "en_evaluacion", label: "Evaluación" },
  { key: "en_revision_comite", label: "Comité" },
  { key: "admitido", label: "Admitida" },
  { key: "matriculado", label: "Matriculada" },
] as const;

const ESTADO_INFO: Record<
  string,
  { label: string; description: string; color: string; bg: string; isFinal?: boolean; isAlt?: boolean }
> = {
  interesado: {
    label: "Solicitud recibida",
    description:
      "Recibimos tu solicitud. En las próximas horas nuestro equipo te enviará los requisitos para completar la postulación.",
    color: "#92400E",
    bg: "#FEF3C7",
  },
  postulante: {
    label: "Esperando tu documentación",
    description:
      "Te enviamos los requisitos. Cuando recibamos toda la documentación, continuamos con el proceso.",
    color: "#1E40AF",
    bg: "#DBEAFE",
  },
  postulacion_completa: {
    label: "Documentación recibida",
    description:
      "Recibimos toda tu documentación. Pronto coordinaremos la entrevista familiar y la evaluación del estudiante.",
    color: "#3730A3",
    bg: "#E0E7FF",
  },
  en_evaluacion: {
    label: "En evaluación",
    description:
      "Estamos coordinando o realizando la entrevista familiar y la evaluación del estudiante.",
    color: "#9D174D",
    bg: "#FCE7F3",
  },
  en_revision_comite: {
    label: "En revisión por Comité",
    description:
      "Tu expediente está siendo analizado por el Comité de Admisiones. Te notificaremos el resultado en las próximas 48 horas.",
    color: "#9A3412",
    bg: "#FED7AA",
  },
  admitido: {
    label: "¡Has sido admitido!",
    description:
      "Felicitaciones. Pronto recibirás los pasos para completar la matrícula.",
    color: "#065F46",
    bg: "#D1FAE5",
  },
  matriculado: {
    label: "Matriculada",
    description:
      "¡Bienvenido a la familia Atenas! La matrícula ha sido completada con éxito.",
    color: "var(--color-navy)",
    bg: "#D4AF37",
    isFinal: true,
  },
  no_admitido: {
    label: "No admitido",
    description:
      "Lamentamos no poder otorgar un cupo en esta ocasión. Te animamos a postular nuevamente más adelante.",
    color: "#991B1B",
    bg: "#FEE2E2",
    isFinal: true,
    isAlt: true,
  },
};

function getStepIndex(estado: string): number {
  const idx = PIPELINE.findIndex((p) => p.key === estado);
  return idx >= 0 ? idx : 0;
}

function StatusCard({
  data,
  contactoEmail,
}: {
  data: SolicitudData;
  contactoEmail: string;
}) {
  const info = ESTADO_INFO[data.estado] ?? ESTADO_INFO.interesado;
  const fecha = new Date(data.created_at).toLocaleDateString("es-EC", { dateStyle: "long" });
  const currentIdx = getStepIndex(data.estado);
  const isAlt = info.isAlt; // no_admitido (ramal alternativo del pipeline)

  return (
    <div
      className="bg-white rounded-[12px] overflow-hidden w-full max-w-[640px]"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}
    >
      {/* Header */}
      <div className="bg-navy px-8 py-6">
        <p
          className="text-gold text-[10px] font-bold tracking-[2px] uppercase mb-2"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          N° de seguimiento
        </p>
        <p
          className="text-white text-[26px] font-bold tracking-wide"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {data.numero}
        </p>
        <p
          className="text-white/50 text-[12px] mt-1"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Enviada el {fecha}
        </p>
      </div>

      {/* Pipeline visual (solo si no es estado terminal alternativo) */}
      {!isAlt && (
        <div className="px-6 sm:px-8 py-6 border-b border-[#F0ECE7]">
          <div className="flex items-start gap-1">
            {PIPELINE.map((paso, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const isLast = i === PIPELINE.length - 1;
              return (
                <div key={paso.key} className="flex items-start flex-1 min-w-0">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 56 }}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                      style={{
                        background: done ? "#16A34A" : active ? info.color : "#F3F4F6",
                        color: done || active ? "#fff" : "#9CA3AF",
                        boxShadow: active ? `0 0 0 4px ${info.color}25` : "none",
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <p
                      className="text-[10px] font-semibold text-center mt-2 leading-tight"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        color: done ? "#16A34A" : active ? info.color : "#9CA3AF",
                        maxWidth: 80,
                      }}
                    >
                      {paso.label}
                    </p>
                  </div>
                  {!isLast && (
                    <div
                      className="h-[2px] flex-1 mt-4"
                      style={{ background: i < currentIdx ? "#16A34A" : "#E5E7EB" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estado actual */}
      <div
        className="px-8 py-5 border-b border-[#F0ECE7]"
        style={{ background: info.bg + "30" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-2 h-2 rounded-full mt-[8px] flex-shrink-0"
            style={{ background: info.color }}
          />
          <div>
            <p
              className="text-[14px] font-bold"
              style={{ fontFamily: "Poppins, sans-serif", color: info.color }}
            >
              {info.label}
            </p>
            <p
              className="text-[13px] text-[#374151] mt-[4px] leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {info.description}
            </p>
          </div>
        </div>
      </div>

      {/* Datos */}
      <div className="px-8 py-6">
        <p
          className="text-[11px] font-bold tracking-[1px] uppercase text-[#9CA3AF] mb-3"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Datos de la solicitud
        </p>
        <div className="flex flex-col gap-2">
          {[
            ["Estudiante", `${data.est_nombres} ${data.est_apellidos}`],
            ["Nivel solicitado", data.est_nivel],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex gap-2 text-[13px]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <span className="text-[#9CA3AF] w-[140px] flex-shrink-0">{label}</span>
              <span className="text-navy font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-cream flex flex-col sm:flex-row gap-3 items-center justify-between">
        <p
          className="text-[11px] text-[#9CA3AF]"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ¿Dudas?{" "}
          <a href={`mailto:${contactoEmail}`} className="text-gold underline">
            {contactoEmail}
          </a>
        </p>
        <Link
          href="/portal-familiar"
          className="text-[12px] font-semibold text-navy hover:underline"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          ← Volver al portal familiar
        </Link>
      </div>
    </div>
  );
}

export type SeguimientoClientProps = {
  headerTitle: string;
  backLabel: string;
  introTitle: string;
  introDescription: string;
  /** Email de contacto para dudas — derivado de configuracion_global['contacto']. */
  contactoEmail: string;
};

export function SeguimientoClient(props: SeguimientoClientProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EEF2F7]" />}>
      <SeguimientoContent {...props} />
    </Suspense>
  );
}

function SeguimientoContent({
  headerTitle,
  backLabel,
  introTitle,
  introDescription,
  contactoEmail,
}: SeguimientoClientProps) {
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
        className="h-[64px] bg-navy flex items-center justify-between
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
          {headerTitle}
        </span>
        <Link
          href="/portal-familiar"
          className="text-white/60 text-[13px] hover:text-white/90 transition-colors"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {backLabel}
        </Link>
      </header>

      <main className="min-h-[calc(100vh-64px)] bg-[#EEF2F7] py-12 px-4">
        <div className="max-w-[640px] mx-auto flex flex-col items-center gap-8">
          {/* Título */}
          <div className="text-center">
            <p
              className="text-gold text-[11px] font-bold tracking-[2.5px] uppercase mb-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Módulo de Admisiones
            </p>
            <h1
              className="text-navy text-[28px] font-bold leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {introTitle}
            </h1>
            <p
              className="text-[#6B7280] text-[14px] mt-2 leading-relaxed"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {introDescription}
            </p>
          </div>

          {/* Buscador */}
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ADM026-XXX"
              className="flex-1 h-[50px] rounded-[6px] border border-[#C8C4BD] bg-white px-4
                text-[14px] text-navy placeholder:text-[#9CA3AF] outline-none
                focus:border-navy focus:shadow-[0_0_0_3px_rgba(26,43,74,0.09)]
                transition-[border-color,box-shadow] uppercase"
              style={{ fontFamily: "Poppins, sans-serif" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-[50px] px-6 rounded-[6px] bg-navy text-white text-[14px]
                font-semibold hover:bg-[#22375e] transition-colors disabled:opacity-50
                disabled:cursor-not-allowed flex-shrink-0"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {loading ? "Buscando…" : "Consultar"}
            </button>
          </form>

          {/* Error */}
          {errorMsg && (
            <div className="w-full bg-[#FEF2F2] border border-[#FECACA] rounded-[6px] px-4 py-3">
              <p
                className="text-[13px] text-red"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {errorMsg}
              </p>
            </div>
          )}

          {/* Resultado */}
          {result && <StatusCard data={result} contactoEmail={contactoEmail} />}

          {/* Hint cuando no hay búsqueda */}
          {!result && !errorMsg && !loading && (
            <div
              className="w-full bg-white rounded-[12px] px-6 py-5 flex items-start gap-3"
              style={{
                border: "1px solid #E8E4DD",
                fontFamily: "Poppins, sans-serif",
              }}
            >
              <span style={{ fontSize: 18 }}>📬</span>
              <div className="flex flex-col gap-1">
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-navy)", margin: 0 }}>
                  ¿No tienes el número?
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  Lo recibiste por correo electrónico al momento de enviar la solicitud, con el formato{" "}
                  <code
                    style={{
                      background: "#F4F1EB",
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 11,
                      color: "var(--color-navy)",
                    }}
                  >
                    ADM&lt;año&gt;-&lt;n&gt;
                  </code>
                  . Revisa también la carpeta de Spam. Si no lo encuentras, escríbenos a{" "}
                  <a
                    href={`mailto:${contactoEmail}`}
                    className="text-gold underline font-semibold"
                  >
                    {contactoEmail}
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
