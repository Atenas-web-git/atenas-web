/**
 * Listado de vacantes en «Trabaja con nosotros».
 *
 * Desde que se retiró el formulario general (2026-08-06), esta sección ES la
 * página: si no hay vacantes abiertas muestra a quién escribir, en vez de
 * desaparecer y dejar a quien busca trabajo sin ninguna salida.
 *
 * Mobile first: una columna en 375px, dos a partir de 768.
 */

import Link from "next/link";
import { ArrowRight, CalendarClock, Mail } from "lucide-react";
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

  // Sin vacantes NO se devuelve null.
  //
  // Desde que se retiró el formulario general, esta sección es lo único que
  // ofrece la página: si desapareciera al quedarse sin ofertas, quien llegue
  // buscando trabajo se encontraría un hero, tres tarjetas de valores y ni una
  // forma de escribir. Se muestra a dónde dirigirse mientras tanto.
  if (vacantes.length === 0) return <SinVacantes />;

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

/**
 * Lo que se ve cuando no hay ninguna vacante abierta.
 *
 * No es un hueco: da el correo de talento humano, para que alguien interesado
 * pueda escribir igual y el colegio no pierda un candidato por haber cerrado
 * todas sus convocatorias esa semana.
 */
function SinVacantes() {
  return (
    <section
      id="vacantes"
      className="px-[24px] py-[56px] sm:px-[40px] sm:py-[80px]"
      style={{ background: "var(--color-cream)", fontFamily: FUENTE }}
    >
      <div className="mx-auto w-full max-w-[620px] text-center">
        <h2
          className="text-[22px] font-bold leading-tight sm:text-[26px]"
          style={{ color: "var(--color-navy)" }}
        >
          Ahora mismo no hay vacantes abiertas
        </h2>
        <p
          className="mx-auto mt-3 text-[14px] leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          Publicamos aquí cada convocatoria en cuanto se abre. Si quieres que
          te tengamos en cuenta para las próximas, escríbenos con tu hoja de
          vida.
        </p>
        <a
          href="mailto:gestionhumana@atenas.edu.ec"
          className="mt-6 inline-flex items-center gap-[10px] rounded-[8px] px-[26px] py-[13px] text-[14px] font-bold"
          style={{ background: "var(--color-navy)", color: "#FFFFFF" }}
        >
          <Mail size={16} />
          gestionhumana@atenas.edu.ec
        </a>
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
