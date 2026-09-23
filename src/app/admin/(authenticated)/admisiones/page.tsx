import Link from "next/link";
import { redirect } from "next/navigation";
import { Search, Download, ChevronLeft, ChevronRight, Plus, Clock } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { filtrarSolicitudes, diasSinMovimiento } from "@/lib/admisiones/filtros";
import { getConfiguracion } from "@/lib/cms/getConfiguracion";
import {
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
} from "@/lib/cms/admisionesTextos";
import {
  NIVELES,
  ESTADOS,
  ESTADO_INFO,
  ESTADOS_TERMINALES,
  type EstadoAdmision,
} from "./constants";
import { AdmisionesSubNav } from "./SubNav";

/**
 * Las opciones del filtro «sin movimiento».
 *
 * Son las que sirven para repartir llamadas: una semana, dos, un mes, dos
 * meses, un trimestre. Al umbral que el colegio configura en Configuración ›
 * Admisiones se le añade su propia opción si no está en la lista, porque es el
 * número con el que el dashboard llama «detenida» a una solicitud y las dos
 * pantallas tienen que poder decir lo mismo.
 */
const DIAS_SUGERIDOS = [7, 14, 30, 60, 90];

function diasDesde(iso: string, ahora: number): number {
  return Math.floor((ahora - new Date(iso).getTime()) / 86_400_000);
}

/**
 * El primer valor de un parámetro de la URL.
 *
 * Un parámetro puede venir repetido —`?q=a&q=b`—, y entonces Next entrega un
 * array. Hacerle `.trim()` a un array revienta la pantalla con un 500: era un
 * fallo anterior a este cambio que se arregla aquí porque el filtro nuevo
 * habría traído el suyo igual.
 */
function primerValor(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Aparte y no `Date.now()` dentro del componente: la regla `react-hooks/purity`
 * marca como error llamar a una función impura durante el render, y el resto
 * del panel ya resuelve esto igual (ver `metricas/page.tsx`).
 */
function ahoraMs(): number {
  return Date.now();
}

const TABS: { key: string; label: string }[] = [
  { key: "todas", label: "Todas" },
  ...ESTADOS.map((e) => ({ key: e, label: ESTADO_INFO[e].label })),
];

const PER_PAGE = 20;

function buildUrl(
  params: {
    estado?: string;
    nivel?: string;
    q?: string;
    ano?: string;
    detenido?: number | null;
    page?: number;
  }
): string {
  const p = new URLSearchParams();
  if (params.estado && params.estado !== "todas") p.set("estado", params.estado);
  if (params.nivel) p.set("nivel", params.nivel);
  if (params.q) p.set("q", params.q);
  if (params.ano) p.set("ano", params.ano);
  if (params.detenido) p.set("detenido", String(params.detenido));
  if (params.page && params.page > 1) p.set("page", String(params.page));
  const qs = p.toString();
  return `/admin/admisiones${qs ? `?${qs}` : ""}`;
}

function getInitials(nombres: string, apellidos: string): string {
  const n = (nombres ?? "").trim()[0] ?? "";
  const a = (apellidos ?? "").trim()[0] ?? "";
  return (n + a).toUpperCase() || "·";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function loadCounts() {
  const supabase = createAdminClient();
  const results = await Promise.all(
    ESTADOS.map((s) =>
      supabase.from("solicitudes_admision").select("*", { count: "exact", head: true }).eq("estado", s)
    )
  );
  return Object.fromEntries(ESTADOS.map((s, i) => [s, results[i].count ?? 0]));
}

export default async function AdmisionesPage({
  searchParams,
}: {
  searchParams: Promise<{
    estado?: string | string[];
    nivel?: string | string[];
    q?: string | string[];
    ano?: string | string[];
    detenido?: string | string[];
    page?: string | string[];
  }>;
}) {
  const sp = await searchParams;
  const estadoFilter = primerValor(sp.estado) ?? "todas";
  const nivelFilter = primerValor(sp.nivel) ?? "";
  const query = (primerValor(sp.q) ?? "").trim();
  const anioFilter = primerValor(sp.ano) ?? "";
  // El mismo lector que usa la exportación: lo que aquí no filtra, allí tampoco.
  const detenidoDias = diasSinMovimiento(sp.detenido);
  // El instante se fija una vez y se usa para filtrar Y para pintar los días,
  // para que la pantalla no diga «13 d» sobre una fila que el filtro contó como
  // de 14.
  const ahora = ahoraMs();
  const page = Math.max(1, parseInt(primerValor(sp.page) ?? "1", 10));
  const offset = (page - 1) * PER_PAGE;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  let dbQuery = supabase
    .from("solicitudes_admision")
    .select(
      "id, numero, est_nombres, est_apellidos, est_nivel, estado, created_at, origen, ultimo_movimiento",
      { count: "exact" }
    )
    // Con el filtro de detenidas puesto, lo urgente es lo más parado, no lo más
    // reciente: la lista sale ordenada por antigüedad para llamar en ese orden.
    .order(detenidoDias !== null ? "ultimo_movimiento" : "created_at", {
      ascending: detenidoDias !== null,
    })
    // El desempate no es adorno, y es el mismo motivo que ya está escrito en la
    // exportación: si dos solicitudes comparten fecha al milisegundo, sin él el
    // orden entre ellas es indefinido y entre una página y la siguiente se
    // pierden y se repiten filas. Con `ultimo_movimiento` el riesgo es mayor
    // que con `created_at`: una importación en lote deja a todas con la misma.
    .order("id", { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  // Los CINCO filtros salen de la misma función que usa la exportación: si no,
  // vuelven a separarse y el archivo deja de traer lo que se ve en pantalla.
  dbQuery = filtrarSolicitudes(dbQuery, {
    estado: estadoFilter,
    nivel: nivelFilter,
    q: query,
    anioIngreso: anioFilter,
    sinMovimientoDias: detenidoDias,
    ahora,
  });

  /*
    El enlace de «Exportar CSV» se armaba concatenando cadenas con ternarios
    dentro del JSX, y ahí es donde se perdió el buscador: nadie ve que falta un
    parámetro en una línea de doscientos caracteres. Con `URLSearchParams` se
    añade uno más sin tocar la puntuación, y encodea solo.
  */
  const paramsExportar = new URLSearchParams();
  if (estadoFilter !== "todas") paramsExportar.set("estado", estadoFilter);
  if (nivelFilter) paramsExportar.set("nivel", nivelFilter);
  if (query) paramsExportar.set("q", query);
  if (anioFilter) paramsExportar.set("ano", anioFilter);
  if (detenidoDias !== null) paramsExportar.set("detenido", String(detenidoDias));
  const cadena = paramsExportar.toString();
  const urlExportar = `/admin/admisiones/exportar${cadena ? `?${cadena}` : ""}`;

  /*
    Lo que hay que recordar al abrir una ficha, para que «Volver a solicitudes»
    devuelva la lista donde estaba —con sus filtros y su página— y no al
    principio de todo.

    El flujo que este filtro existe para habilitar es: filtrar las detenidas,
    abrir una, coger el teléfono, volver, seguir por la siguiente. Sin esto,
    cada vuelta obliga a rehacer el filtro.
  */
  const paramsVolver = new URLSearchParams(paramsExportar);
  if (page > 1) paramsVolver.set("page", String(page));
  const cadenaVolver = paramsVolver.toString();
  const volver = cadenaVolver ? `?volver=${encodeURIComponent(cadenaVolver)}` : "";

  const [{ data: solicitudes, count, error }, tabCounts, textosRaw, { data: anosData }] =
    await Promise.all([
    dbQuery,
    loadCounts(),
    // El umbral de «detenida» lo edita el colegio en Configuración › Admisiones,
    // y es el mismo con el que el dashboard pinta su tarjeta.
    getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos"),
    supabase.from("anos_lectivos").select("codigo").eq("activo", true).order("codigo"),
  ]);

  /*
    Los años lectivos del catálogo, MÁS el que venga por la URL aunque ya no
    esté activo. Es el mismo motivo por el que abajo se inyecta el valor de los
    días: un enlace guardado con `?ano=2026-2027` seguiría filtrando mientras el
    control diría «Todos los años lectivos». Un filtro que actúa sin aparecer es
    peor que no tenerlo, y eso vale también para el control de al lado.
  */
  const anosLectivos = [
    ...new Set([
      ...(anosData ?? []).map((a) => a.codigo as string),
      ...(anioFilter ? [anioFilter] : []),
    ]),
  ].sort();

  const { diasParaEstancada } = mergeAdmisionesTextos(textosRaw).metricas;
  /*
    El valor que venga por la URL entra en la lista aunque no sea uno de los
    sugeridos. Si no, `?detenido=45` filtraba de verdad mientras el desplegable
    caía en «Con o sin movimiento» y decía que no había filtro: la pantalla
    enseñaba 12 filas de 300 afirmando que eran todas.
  */
  const opcionesDias = [
    ...new Set([...DIAS_SUGERIDOS, diasParaEstancada, ...(detenidoDias !== null ? [detenidoDias] : [])]),
  ].sort((a, b) => a - b);

  const total = count ?? 0;
  const totalPages = Math.ceil(total / PER_PAGE);
  const totalCount = Object.values(tabCounts).reduce((a, b) => a + b, 0);

  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid #E8E4DD",
    borderRadius: 12,
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Solicitudes de Admisión
          </h1>
          {/*
            «De todos los años lectivos» no sobra: Métricas cuenta un año y
            esta pantalla los cuenta todos. Sin decirlo, las dos dan cifras
            distintas en el mismo panel y quien mire deja de fiarse de las dos.
          */}
          <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0" }}>
            {totalCount} solicitud{totalCount === 1 ? "" : "es"} en total, de todos los años
            lectivos
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/admisiones/nueva"
            className="flex items-center gap-2 px-4 rounded-md transition-opacity hover:opacity-80"
            style={{
              height: 38,
              background: "#1A2B4A",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Registrar a mano
          </Link>
          <a
            href={urlExportar}
            className="flex items-center gap-2 px-4 rounded-md transition-opacity hover:opacity-80"
            style={{
              height: 38,
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              color: "#1A2B4A",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Download size={14} strokeWidth={2} />
            Exportar CSV
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #E8E4DD" }}>
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = tab.key === estadoFilter;
            const cnt = tab.key === "todas" ? totalCount : (tabCounts[tab.key] ?? 0);
            return (
              <Link
                key={tab.key}
                href={buildUrl({
                  estado: tab.key,
                  nivel: nivelFilter,
                  q: query,
                  ano: anioFilter,
                  detenido: detenidoDias,
                })}
                className="flex items-center gap-2 px-4 whitespace-nowrap transition-colors"
                style={{
                  height: 44,
                  borderBottom: isActive ? "2px solid #1A2B4A" : "2px solid transparent",
                  marginBottom: -1,
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#1A2B4A" : "#6B6660",
                  }}
                >
                  {tab.label}
                </span>
                {cnt > 0 && (
                  <span
                    className="flex items-center justify-center px-1.5 rounded-full"
                    style={{
                      minWidth: 20,
                      height: 18,
                      background: isActive ? "#1A2B4A" : "#E8E4DD",
                      fontSize: 12,
                      fontWeight: 700,
                      color: isActive ? "#9e1915" : "#6B6660",
                    }}
                  >
                    {cnt}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filtros */}
      <form
        method="get"
        action="/admin/admisiones"
        className="flex items-center gap-3 flex-wrap"
      >
        {estadoFilter !== "todas" && (
          <input type="hidden" name="estado" value={estadoFilter} />
        )}
        <div
          className="flex items-center gap-2 px-3 rounded-md flex-1"
          style={{
            height: 38,
            border: "1px solid #E8E4DD",
            background: "#FFFFFF",
            minWidth: 200,
            maxWidth: 320,
          }}
        >
          <Search size={14} color="#6B6660" strokeWidth={2} />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre o N° ADM…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              color: "#1A2B4A",
              width: "100%",
            }}
          />
        </div>
        <select
          name="nivel"
          defaultValue={nivelFilter}
          style={{
            height: 38,
            border: "1px solid #E8E4DD",
            borderRadius: 6,
            background: "#FFFFFF",
            fontSize: 14,
            color: "#1A2B4A",
            paddingLeft: 12,
            paddingRight: 28,
            outline: "none",
          }}
        >
          <option value="">Todos los niveles</option>
          {NIVELES.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {/*
          El año lectivo. La tarjeta «Detenidos» de Métricas cuenta un solo año
          y esta pantalla junta todos; sin este control, el enlace entre las dos
          prometía la misma lista y entregaba otra más grande, con familias de
          ciclos ya cerrados. Tiene que verse: un filtro que actúa sin aparecer
          es peor que no tenerlo.
        */}
        {anosLectivos.length > 0 && (
          <select
            name="ano"
            defaultValue={anioFilter}
            title="Año lectivo al que postula el aspirante"
            style={{
              height: 38,
              border: "1px solid #E8E4DD",
              borderRadius: 6,
              background: "#FFFFFF",
              fontSize: 14,
              color: "#1A2B4A",
              paddingLeft: 12,
              paddingRight: 28,
              outline: "none",
            }}
          >
            <option value="">Todos los años lectivos</option>
            {anosLectivos.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        )}
        {/*
          El filtro para repartir llamadas. «Sin movimiento» y no «detenidas» a
          secas porque lo que mide es que no ha cambiado de estado, no que la
          familia se haya ido: puede haberse hablado con ella por teléfono.
        */}
        <select
          name="detenido"
          defaultValue={detenidoDias !== null ? String(detenidoDias) : ""}
          title="Solicitudes que llevan ese tiempo sin cambiar de estado"
          style={{
            height: 38,
            border: "1px solid #E8E4DD",
            borderRadius: 6,
            background: "#FFFFFF",
            fontSize: 14,
            color: "#1A2B4A",
            paddingLeft: 12,
            paddingRight: 28,
            outline: "none",
          }}
        >
          <option value="">Con o sin movimiento</option>
          {opcionesDias.map((d) => (
            <option key={d} value={d}>
              Sin mover {d}+ días{d === diasParaEstancada ? " (detenidas)" : ""}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 rounded-md transition-opacity hover:opacity-80"
          style={{
            height: 38,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Filtrar
        </button>
        {(query || nivelFilter || anioFilter || detenidoDias !== null) && (
          <Link
            href={buildUrl({ estado: estadoFilter })}
            style={{ fontSize: 13, color: "#6B6660", textDecoration: "underline" }}
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div style={cardStyle}>
        {/*
          Un fallo de consulta y un resultado vacío se ven igual si nadie mira
          `error`: la pantalla decía «no hay solicitudes que coincidan» y quien
          la lee se lo cree. Las dos rutas de exportación ya devuelven 500 ante
          lo mismo; la pantalla no podía seguir afirmando que no hay nada.
        */}
        {error ? (
          <div className="flex flex-col items-center justify-center gap-1 py-16 px-6">
            <p style={{ fontSize: 14, fontWeight: 600, color: "#991B1B", margin: 0 }}>
              No se pudieron cargar las solicitudes.
            </p>
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Esto no quiere decir que no haya ninguna. Vuelve a intentarlo y, si sigue igual,
              avísanos.
            </p>
          </div>
        ) : !solicitudes || solicitudes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-1 py-16 px-6">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              No hay solicitudes que coincidan con los filtros.
            </p>
            {/*
              El caso que más despista: la pestaña de un estado terminal con el
              filtro de «sin movimiento» puesto SIEMPRE sale vacía, y encima su
              número sigue ahí arriba, porque ese conteo no aplica los filtros.
              Sin esta línea parece que se han perdido solicitudes.
            */}
            {detenidoDias !== null && ESTADOS_TERMINALES.has(estadoFilter as EstadoAdmision) && (
              <p style={{ fontSize: 13, color: "#6B6660", margin: 0, textAlign: "center", maxWidth: 460 }}>
                Es por el filtro de <strong>sin movimiento</strong>: deja fuera a propósito las
                matriculadas y las no admitidas, porque llevan tiempo quietas por haber terminado
                el proceso, no por olvido. Quita ese filtro para verlas.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
                  {["N° Solicitud", "Postulante", "Nivel", "Recibida", "Sin mover", "Estado", ""].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#6B6660",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s, i) => {
                  const info =
                    ESTADO_INFO[s.estado as EstadoAdmision] ?? ESTADO_INFO.interesado;
                  const initials = getInitials(s.est_nombres, s.est_apellidos);
                  return (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom:
                          i === solicitudes.length - 1 ? "none" : "1px solid #E8E4DD",
                      }}
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1A2B4A",
                            fontFamily: "monospace",
                          }}
                        >
                          {s.numero}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex items-center justify-center flex-shrink-0"
                            style={{
                              width: 34,
                              height: 34,
                              background: "#F4F1EB",
                              borderRadius: "50%",
                            }}
                          >
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>
                              {initials}
                            </span>
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
                            {s.est_nombres} {s.est_apellidos}
                          </span>
                          {/*
                            Solo se marca lo registrado a mano. La inmensa
                            mayoría entra por la web, así que etiquetar las dos
                            cosas sería ruido en cada fila.
                          */}
                          {s.origen === "manual" && (
                            <span
                              title="Registrada a mano desde el panel, no por el formulario web"
                              className="inline-flex items-center px-2 rounded-full flex-shrink-0"
                              style={{
                                height: 18,
                                background: "#F4F1EB",
                                border: "1px solid #E8E4DD",
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#6B6660",
                              }}
                            >
                              A mano
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 13, color: "#6B6660" }}>{s.est_nivel}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 13, color: "#6B6660" }}>
                          {formatDate(s.created_at)}
                        </span>
                      </td>
                      {/*
                        Días sin cambiar de estado. Se marca en ámbar a partir
                        del umbral que el colegio configuró, que es el mismo con
                        el que el dashboard la llama «detenida»; y no se marca
                        nada en las terminales, porque una matriculada lleva
                        meses quieta por haber terminado, no por olvido.
                      */}
                      <td style={{ padding: "14px 16px" }}>
                        {(() => {
                          const dias = diasDesde(s.ultimo_movimiento ?? s.created_at, ahora);
                          // La lista de terminales vive en `constants.ts` y la
                          // usa también el filtro: repetirla aquí es como se
                          // separan dos reglas que deberían ser una.
                          const terminal = ESTADOS_TERMINALES.has(s.estado as EstadoAdmision);

                          /*
                            En las terminales no se pinta número, y no es
                            estética: una matriculada de hace dos años marcaría
                            «730 días» en la columna con la que se decide a
                            quién llamar. El proceso de esa familia terminó.
                          */
                          if (terminal) {
                            return (
                              <span
                                title="Proceso terminado"
                                style={{ fontSize: 13, color: "#A0AABA" }}
                              >
                                —
                              </span>
                            );
                          }

                          const alerta = dias >= diasParaEstancada;
                          return (
                            /*
                              Sin píldora y con reloj. El estado «Interesado»
                              usa exactamente el mismo ámbar, y las dos
                              insignias juntas en la misma fila se leían como si
                              fueran lo mismo. El reloj es además el icono con
                              el que Métricas marca lo detenido.
                            */
                            <span
                              title={`Sin cambiar de estado desde hace ${dias} día${dias === 1 ? "" : "s"}`}
                              className="inline-flex items-center gap-1.5"
                              style={{
                                fontSize: 13,
                                fontWeight: alerta ? 700 : 400,
                                color: alerta ? "#92400E" : "#6B6660",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {alerta && <Clock size={13} strokeWidth={2.5} />}
                              {dias} {dias === 1 ? "día" : "días"}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          className="inline-flex items-center px-2.5 rounded-full"
                          style={{
                            height: 22,
                            background: info.colorBg,
                            fontSize: 12,
                            fontWeight: 600,
                            color: info.colorFg,
                          }}
                        >
                          {info.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <Link
                          // Con los filtros puestos: al volver de la ficha,
                          // la lista tiene que seguir donde estaba. El flujo
                          // que este filtro habilita es abrir, llamar, volver
                          // y seguir por la siguiente.
                          href={`/admin/admisiones/${s.id}${volver}`}
                          className="transition-opacity hover:opacity-70"
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#1A2B4A",
                            textDecoration: "none",
                            border: "1px solid #E8E4DD",
                            borderRadius: 6,
                            padding: "5px 12px",
                          }}
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
            Mostrando {offset + 1}–{Math.min(offset + PER_PAGE, total)} de {total}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={buildUrl({
                  estado: estadoFilter,
                  nivel: nivelFilter,
                  q: query,
                  ano: anioFilter,
                  detenido: detenidoDias,
                  page: page - 1,
                })}
                className="flex items-center gap-1 px-3 rounded-md transition-opacity hover:opacity-70"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#FFFFFF",
                  fontSize: 14,
                  color: "#1A2B4A",
                  textDecoration: "none",
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
                Anterior
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 px-3 rounded-md"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#F4F1EB",
                  fontSize: 14,
                  color: "#A0AABA",
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
                Anterior
              </span>
            )}
            <span style={{ fontSize: 13, color: "#6B6660" }}>
              Pág. {page} de {totalPages}
            </span>
            {page < totalPages ? (
              <Link
                href={buildUrl({
                  estado: estadoFilter,
                  nivel: nivelFilter,
                  q: query,
                  ano: anioFilter,
                  detenido: detenidoDias,
                  page: page + 1,
                })}
                className="flex items-center gap-1 px-3 rounded-md transition-opacity hover:opacity-70"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#FFFFFF",
                  fontSize: 14,
                  color: "#1A2B4A",
                  textDecoration: "none",
                }}
              >
                Siguiente
                <ChevronRight size={14} strokeWidth={2.5} />
              </Link>
            ) : (
              <span
                className="flex items-center gap-1 px-3 rounded-md"
                style={{
                  height: 34,
                  border: "1px solid #E8E4DD",
                  background: "#F4F1EB",
                  fontSize: 14,
                  color: "#A0AABA",
                }}
              >
                Siguiente
                <ChevronRight size={14} strokeWidth={2.5} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
