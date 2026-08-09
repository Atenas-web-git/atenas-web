// Página de una vacante concreta.
//
// Cada oferta tiene su propia dirección para que se pueda compartir por
// WhatsApp o publicar en redes sin mandar a la gente a buscarla dentro de una
// lista, y para que Google la indexe por separado.
//
// El formulario de postulación sale del motor: cada vacante apunta al suyo, y
// por eso los docentes de inglés pueden tener que subir un audio sin que se lo
// pidamos a todos los demás.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarClock, GraduationCap, Briefcase } from "lucide-react";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { BloqueFormulario } from "@/components/formularios/BloqueFormulario";
import { getVacantePublica } from "@/lib/vacantes/getVacantes";

export const revalidate = 60;
export const dynamicParams = true;

const FUENTE = "Poppins, sans-serif";

type Props = { params: Promise<{ vacante: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vacante: slug } = await params;
  const vacante = await getVacantePublica(slug);
  if (!vacante) return { title: "Vacante no disponible" };

  return {
    title: `${vacante.titulo} — Trabaja con nosotros | Unidad Educativa Atenas`,
    description:
      vacante.resumen ??
      `Postula a la vacante de ${vacante.titulo} en la Unidad Educativa Atenas.`,
  };
}

function formatearFecha(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function VacantePage({ params }: Props) {
  const { vacante: slug } = await params;
  const vacante = await getVacantePublica(slug);

  // Una vacante cerrada o en borrador da 404 en vez de una página vacía: si
  // ya no se puede postular, mostrarla solo genera postulaciones perdidas.
  if (!vacante) notFound();

  const parrafos = (vacante.descripcion ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main style={{ fontFamily: FUENTE }}>
        {/* ─── Encabezado ─── */}
        <section
          className="px-[24px] pb-[40px] pt-[120px] sm:px-[40px] sm:pb-[56px] sm:pt-[150px]"
          style={{ background: "var(--color-navy)" }}
        >
          <div className="mx-auto w-full max-w-[860px]">
            <Link
              href="/trabaja-con-nosotros"
              className="inline-flex items-center gap-1.5 text-[13px]"
              style={{ color: "rgba(255,255,255,0.70)" }}
            >
              <ArrowLeft size={14} /> Todas las vacantes
            </Link>

            <h1
              className="mt-4 text-[30px] font-bold leading-tight sm:text-[42px]"
              style={{ color: "#FFFFFF" }}
            >
              {vacante.titulo}
            </h1>

            {vacante.resumen && (
              <p
                className="mt-3 max-w-[620px] text-[15px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {vacante.resumen}
              </p>
            )}

            {vacante.cierra_en && (
              <p
                className="mt-4 inline-flex items-center gap-2 rounded-[8px] px-[14px] py-[8px] text-[13px] font-semibold"
                style={{ background: "var(--color-red)", color: "#FFFFFF" }}
              >
                <CalendarClock size={14} />
                Postula hasta el {formatearFecha(vacante.cierra_en)}
              </p>
            )}
          </div>
        </section>

        {/* ─── La oferta ─── */}
        {/*
          El fondo se declara explícitamente. Sin él la sección queda
          transparente y se ve el fondo del navegador: con el tema oscuro del
          sistema, estos textos —navy y gris— quedan ilegibles.
        */}
        <section
          className="px-[24px] py-[48px] sm:px-[40px] sm:py-[64px]"
          style={{ background: "#FFFFFF" }}
        >
          <div className="mx-auto flex w-full max-w-[860px] flex-col gap-8">
            {parrafos.length > 0 && (
              <div className="flex flex-col gap-4">
                {parrafos.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.75]"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}

            {(vacante.formacion || vacante.experiencia) && (
              <div className="flex flex-col gap-4">
                <h2
                  className="text-[19px] font-bold"
                  style={{ color: "var(--color-navy)" }}
                >
                  Perfil requerido
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {vacante.formacion && (
                    <Requisito
                      icono={<GraduationCap size={16} />}
                      titulo="Formación"
                      texto={vacante.formacion}
                    />
                  )}
                  {vacante.experiencia && (
                    <Requisito
                      icono={<Briefcase size={16} />}
                      titulo="Experiencia"
                      texto={vacante.experiencia}
                    />
                  )}
                </div>
              </div>
            )}

            {vacante.habilidades.length > 0 && (
              <div className="flex flex-col gap-3">
                <h2
                  className="text-[19px] font-bold"
                  style={{ color: "var(--color-navy)" }}
                >
                  Habilidades y conocimientos
                </h2>
                <ul className="flex flex-col gap-2">
                  {vacante.habilidades.map((h, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] leading-relaxed"
                      style={{ color: "var(--color-ink)" }}
                    >
                      <span
                        className="mt-[7px] block shrink-0 rounded-full"
                        style={{ width: 6, height: 6, background: "var(--color-red)" }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* ─── Postulación ─── */}
        {vacante.formulario_id ? (
          // El cargo llega puesto con el título de la vacante. El colegio usa
          // un único formulario de postulación para todas —así lo hacen hoy en
          // su Google Forms, con el cargo escrito a mano—, y prellenarlo evita
          // que lleguen postulaciones con el cargo mal escrito o en blanco,
          // que son imposibles de clasificar después.
          <BloqueFormulario
            formularioId={vacante.formulario_id}
            valoresIniciales={{ cargo: vacante.titulo }}
          />
        ) : (
          <section
            className="px-[24px] py-[48px] sm:px-[40px]"
            style={{ background: "var(--color-cream)" }}
          >
            <p
              className="mx-auto max-w-[620px] text-center text-[14px]"
              style={{ color: "var(--color-muted)" }}
            >
              Esta vacante todavía no tiene formulario de postulación. Escríbenos
              a{" "}
              <a
                href="mailto:gestionhumana@atenas.edu.ec"
                style={{ color: "var(--color-red)", fontWeight: 600 }}
              >
                gestionhumana@atenas.edu.ec
              </a>
              .
            </p>
          </section>
        )}

        <FooterCTA />
      </main>
    </>
  );
}

function Requisito({
  icono,
  titulo,
  texto,
}: {
  icono: React.ReactNode;
  titulo: string;
  texto: string;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-[10px] border p-4"
      style={{ borderColor: "#E8E4DD", background: "#FFFFFF" }}
    >
      <span
        className="inline-flex items-center gap-2 text-[11px] font-bold uppercase"
        style={{ color: "var(--color-red)", letterSpacing: 1 }}
      >
        {icono}
        {titulo}
      </span>
      <p className="text-[14px] leading-relaxed" style={{ color: "var(--color-ink)" }}>
        {texto}
      </p>
    </div>
  );
}
