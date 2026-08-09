/**
 * Listado de vacantes en «Trabaja con nosotros».
 *
 * Server component: si no hay vacantes publicadas no renderiza nada, y la
 * página se queda como estaba. Así el colegio puede empezar a usarlo cuando
 * quiera sin que aparezca una sección vacía mientras tanto.
 *
 * Mobile first: una columna en 375px, dos a partir de 768.
 */

import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import {
  CATEGORIA_VACANTE_INFO,
  getVacantesPublicas,
  type CategoriaVacante,
  type Vacante,
} from "@/lib/vacantes/getVacantes";

const FUENTE = "Poppins, sans-serif";

/** Orden de los bloques: primero lo que tiene proceso abierto. */
const ORDEN_CATEGORIAS: CategoriaVacante[] = ["concurso", "abierta", "banco"];

function formatearFecha(iso: string): string {
  const [a, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, d)).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export async function ListaVacantes() {
  const vacantes = await getVacantesPublicas();
  if (vacantes.length === 0) return null;

  const porCategoria = ORDEN_CATEGORIAS.map((categoria) => ({
    categoria,
    items: vacantes.filter((v) => v.categoria === categoria),
  })).filter((g) => g.items.length > 0);

  return (
    <section
      id="vacantes"
      className="px-[24px] py-[56px] sm:px-[40px] sm:py-[80px]"
      style={{ background: "var(--color-cream)", fontFamily: FUENTE }}
    >
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="mb-8 flex items-center gap-[10px]">
          <span className="block bg-red" style={{ width: 28, height: 2 }} />
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--color-red)",
            }}
          >
            Vacantes
          </span>
        </div>

        {porCategoria.map(({ categoria, items }) => (
          <div key={categoria} className="mb-10 last:mb-0">
            <h2
              className="mb-5 text-[22px] font-bold leading-tight sm:text-[26px]"
              style={{ color: "var(--color-navy)" }}
            >
              {CATEGORIA_VACANTE_INFO[categoria].tituloPublico}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((v) => (
                <TarjetaVacante key={v.id} vacante={v} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TarjetaVacante({ vacante }: { vacante: Vacante }) {
  return (
    <Link
      href={`/trabaja-con-nosotros/${vacante.slug}`}
      className="group flex flex-col justify-between gap-4 rounded-[12px] border p-[22px] transition-colors hover:border-red"
      style={{
        borderColor: "#E8E4DD",
        background: "#FFFFFF",
        textDecoration: "none",
      }}
    >
      <div>
        <h3
          className="text-[17px] font-bold leading-snug"
          style={{ color: "var(--color-navy)" }}
        >
          {vacante.titulo}
        </h3>
        {vacante.resumen && (
          <p
            className="mt-2 text-[13px] leading-relaxed"
            style={{ color: "var(--color-muted)" }}
          >
            {vacante.resumen}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {vacante.cierra_en ? (
          <span
            className="inline-flex items-center gap-1.5 text-[12px]"
            style={{ color: "var(--color-muted)" }}
          >
            <CalendarClock size={13} />
            Postula hasta el {formatearFecha(vacante.cierra_en)}
          </span>
        ) : (
          <span />
        )}

        <span
          className="inline-flex items-center gap-1.5 text-[13px] font-bold"
          style={{ color: "var(--color-red)" }}
        >
          Ver y postular
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
