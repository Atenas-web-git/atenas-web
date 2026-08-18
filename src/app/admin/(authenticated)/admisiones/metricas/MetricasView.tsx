/**
 * Todo lo que se PINTA de las métricas de admisiones.
 *
 * Separado de `page.tsx` —que se queda con el permiso y las consultas— por el
 * mismo motivo que `CuposFormClient`: así se puede montar la pantalla con datos
 * de mentira y mirarla, sin credenciales del panel y sin tocar la base. Un
 * tablero hay que verlo, no solo contarlo.
 */

import Link from "next/link";
import { AlertTriangle, Clock, Info } from "lucide-react";
import { ESTADO_INFO } from "../constants";
import { DIAS_DEL_PERIODO, type Metricas, type MesSerie } from "@/lib/admisiones/metricas";

const BORDE = "1px solid #E8E4DD";

function Tarjeta({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: BORDE, borderRadius: 12 }}
    >
      <h2
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          margin: 0,
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Cifra({ valor, etiqueta, nota }: { valor: number; etiqueta: string; nota?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ fontSize: 30, fontWeight: 700, color: "#1A2B4A", lineHeight: 1 }}>
        {valor}
      </span>
      <span style={{ fontSize: 13, color: "#2C2C2C", fontWeight: 500 }}>{etiqueta}</span>
      {nota && <span style={{ fontSize: 11, color: "#6B6660" }}>{nota}</span>}
    </div>
  );
}

/**
 * La evolución mes a mes: cuántas entraron y cuántas admitió el Comité.
 *
 * Barras verticales y no una línea a propósito. Son cuentas de cosas que
 * pasaron en cada mes, no una magnitud continua: una línea invita a leer los
 * tramos entre puntos como si significaran algo, y no significan nada.
 *
 * Dos series en la misma barra, una encima de otra en tono distinto, para
 * poder comparar entradas contra admisiones sin saltar de gráfico.
 */
function SerieMensual({
  meses,
  mesesOmitidos,
}: {
  meses: MesSerie[];
  mesesOmitidos: number;
}) {
  // El eje se escala al máximo de las dos series juntas, nunca por debajo de 1
  // para no dividir por cero cuando todavía no ha entrado nadie.
  const maximo = Math.max(1, ...meses.map((m) => Math.max(m.entraron, m.admitidos)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 flex-wrap">
        <Leyenda color="#1A2B4A" texto="Entraron" />
        <Leyenda color="#92400E" texto="Admitidas por el Comité" />
      </div>

      {/*
        Se desplaza en su propia caja si no cabe: con catorce meses en una
        pantalla estrecha, la alternativa es que la página entera tenga scroll
        lateral, que es lo que el proyecto no permite.
      */}
      {/*
        Las sombras de los bordes avisan de que hay más meses fuera de la caja.
        Sin ellas, en 375px se ven cinco de catorce y nada indica que el resto
        existe: se leería como «el colegio solo tiene cinco meses de historia».
        Van en CSS puro —`background-attachment: local` para los degradados
        blancos, `scroll` para las sombras— así que aparecen y desaparecen solas
        al llegar a cada extremo, sin JavaScript y sin volver cliente la vista.
      */}
      <div
        style={{
          overflowX: "auto",
          background:
            "linear-gradient(to right, #FFFFFF 30%, rgba(255,255,255,0)) left center," +
            "linear-gradient(to left, #FFFFFF 30%, rgba(255,255,255,0)) right center," +
            "radial-gradient(farthest-side at 0 50%, rgba(26,43,74,0.14), rgba(26,43,74,0)) left center," +
            "radial-gradient(farthest-side at 100% 50%, rgba(26,43,74,0.14), rgba(26,43,74,0)) right center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "28px 100%, 28px 100%, 12px 100%, 12px 100%",
          backgroundAttachment: "local, local, scroll, scroll",
        }}
      >
        <div className="flex items-end gap-2" style={{ minWidth: meses.length * 52 }}>
          {meses.map((m, i) => {
            const [ano, mes] = m.clave.split("-");
            // El año solo en la primera columna y cada vez que empieza uno
            // nuevo. Repetirlo en las catorce lo vuelve ruido.
            const marcaAno = i === 0 || mes === "01";
            return (
              <div
                key={m.clave}
                title={`${m.etiqueta}: entraron ${m.entraron}, admitidas ${m.admitidos}`}
                className="flex flex-col items-center gap-1"
                style={{ flex: 1 }}
              >
                <div
                  className="flex items-end justify-center gap-[3px] w-full"
                  style={{ height: 90 }}
                >
                  <Columna alto={(m.entraron / maximo) * 90} color="#1A2B4A" />
                  <Columna alto={(m.admitidos / maximo) * 90} color="#92400E" />
                </div>
                {/*
                  Horizontal y no rotada: con la etiqueta en diagonal no se leía
                  ninguna y además desbordaba la tarjeta por abajo.
                */}
                <span style={{ fontSize: 10, color: "#6B6660", whiteSpace: "nowrap" }}>
                  {m.etiqueta.split(" ")[0]}
                </span>
                {/*
                  El año es la única pista de a qué ejercicio pertenece cada
                  barra: iba en gris claro a 9px —contraste 2.3:1— y no se leía.
                */}
                <span style={{ fontSize: 10, color: "#6B6660", height: 12 }}>
                  {marcaAno ? ano : ""}
                </span>
                {/*
                  Las dos cifras exactas debajo, en el color de su serie. Con
                  números pequeños —un colegio, no un ecommerce— la diferencia
                  entre tres y cuatro no se ve en la altura de la barra.

                  Un cero es un dato, no decoración: un mes sin admisiones es
                  justo lo que admisiones necesita ver. Se atenúa para que no
                  compita con los meses con movimiento, pero con un gris que se
                  lee, y con el mismo criterio en las dos series —antes solo se
                  atenuaba el cero de admitidas.
                */}
                <span style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                  <strong style={{ color: m.entraron > 0 ? "#1A2B4A" : "#6B6660" }}>
                    {m.entraron}
                  </strong>
                  <span style={{ color: "#9A948C" }}> · </span>
                  <strong style={{ color: m.admitidos > 0 ? "#92400E" : "#6B6660" }}>
                    {m.admitidos}
                  </strong>
                </span>
                {/*
                  El `title` de la columna no existe para quien navega con dedo
                  o con teclado. Esta línea no se ve pero sí se lee en voz alta,
                  y es la única forma de saber cuál cifra es cuál sin depender
                  del color.
                */}
                <span className="sr-only">
                  {m.etiqueta}: entraron {m.entraron}, admitidas {m.admitidos}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {mesesOmitidos > 0 && (
        <p style={{ fontSize: 11, color: "#6B6660", margin: 0 }}>
          Se muestran los últimos {meses.length} meses.{" "}
          {mesesOmitidos === 1 ? "Hay un mes anterior" : `Hay ${mesesOmitidos} meses anteriores`} con
          movimiento que no cabe en el gráfico.
        </p>
      )}
    </div>
  );
}

function Columna({ alto, color }: { alto: number; color: string }) {
  return (
    <div
      style={{
        width: 12,
        // Un pelo de altura cuando el valor es cero, para que la barra exista
        // como sitio vacío y no como un hueco donde no hay nada.
        height: Math.max(2, Math.round(alto)),
        background: alto < 1 ? "#F4F1EB" : color,
        borderRadius: "3px 3px 0 0",
      }}
    />
  );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <span className="flex items-center gap-1.5" style={{ fontSize: 11, color: "#6B6660" }}>
      <span style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
      {texto}
    </span>
  );
}

/** Lista con barra proporcional. Se usa para los cortes por nivel y por colegio. */
function Barras({ filas, vacio }: { filas: { clave: string; total: number }[]; vacio: string }) {
  if (filas.length === 0) {
    return <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>{vacio}</p>;
  }
  const maximo = Math.max(...filas.map((f) => f.total));
  return (
    <div className="flex flex-col gap-3">
      {filas.map((f) => (
        <div key={f.clave} className="flex flex-col gap-1">
          <div className="flex items-baseline justify-between gap-3">
            {/*
              La institución de origen es texto libre que rellena el público, así
              que aquí puede llegar cualquier cosa: se corta en vez de romper la
              fila. El título deja ver el nombre completo al pasar el ratón.
            */}
            <span
              title={f.clave}
              style={{
                fontSize: 13,
                color: "#2C2C2C",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                minWidth: 0,
              }}
            >
              {f.clave}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A", flexShrink: 0 }}>
              {f.total}
            </span>
          </div>
          <div style={{ height: 6, background: "#F4F1EB", borderRadius: 999 }}>
            <div
              style={{
                height: "100%",
                width: `${Math.round((f.total / maximo) * 100)}%`,
                background: "#1A2B4A",
                borderRadius: 999,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Aviso({
  tono,
  icono: Icono,
  children,
}: {
  tono: "info" | "atencion";
  icono: typeof Info;
  children: React.ReactNode;
}) {
  const c =
    tono === "atencion"
      ? { bg: "#FEF3C7", borde: "#FDE68A", fg: "#92400E" }
      : { bg: "#F4F1EB", borde: "#E8E4DD", fg: "#6B6660" };
  return (
    <div
      className="flex items-start gap-3 p-4"
      style={{ background: c.bg, border: `1px solid ${c.borde}`, borderRadius: 10 }}
    >
      <Icono size={16} strokeWidth={2} style={{ color: c.fg, flexShrink: 0, marginTop: 1 }} />
      <div style={{ fontSize: 13, color: c.fg, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

export function MetricasView({
  metricas: m,
  anoLectivo,
  anos,
}: {
  metricas: Metricas;
  anoLectivo: string;
  anos: string[];
}) {
  const pasos = m.embudo;
  const maxEmbudo = Math.max(1, ...pasos.map((p) => p.alcanzaron));

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1A2B4A", margin: 0 }}>
            Métricas de admisiones
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            Cómo va el proceso del año lectivo {anoLectivo}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6B6660",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Año lectivo
          </span>
          <div
            className="flex items-center flex-wrap"
            style={{ border: BORDE, borderRadius: 8, background: "#FFFFFF", overflow: "hidden" }}
          >
            {anos.map((codigo) => {
            const activo = codigo === anoLectivo;
            return (
              <Link
                key={codigo}
                href={`/admin/admisiones/metricas?ano=${codigo}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: 36,
                  paddingLeft: 16,
                  paddingRight: 16,
                  background: activo ? "#1A2B4A" : "transparent",
                  color: activo ? "#FFFFFF" : "#6B6660",
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: activo ? 600 : 500,
                  transition: "all 0.15s ease",
                }}
              >
                  {codigo}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/*
        Lo que esta pantalla NO cuenta. Va arriba y no al pie a propósito: un
        tablero que calla lo que le falta es peor que no tenerlo, porque con él
        se toman decisiones.
      */}
      <Aviso tono="info" icono={Info}>
        Aquí están las solicitudes del año lectivo {anoLectivo}, <strong>vengan del formulario web
        o registradas a mano</strong> desde el panel. Lo que no aparece es lo que nunca llegó a
        registrarse: si alguien pregunta por teléfono y no se anota,{" "}
        <Link href="/admin/admisiones/nueva" style={{ color: "#1A2B4A", fontWeight: 600 }}>
          regístralo aquí
        </Link>{" "}
        o no cuenta en ningún número de esta pantalla.
      </Aviso>

      {m.sinAnoLectivo > 0 && (
        <Aviso tono="atencion" icono={AlertTriangle}>
          <strong>
            {m.sinAnoLectivo}{" "}
            {m.sinAnoLectivo === 1 ? "solicitud no aparece" : "solicitudes no aparecen"} en esta
            pantalla
          </strong>{" "}
          porque no tienen año lectivo, o tienen uno que ya no está en la lista. No suman en ninguna
          pestaña, sea cual sea el año que elijas. Ábrelas desde Solicitudes y asígnales el año para
          que cuenten.
        </Aviso>
      )}

      {m.total === 0 ? (
        <div
          className="flex flex-col items-center justify-center gap-2 py-16 px-6"
          style={{ background: "#FFFFFF", border: BORDE, borderRadius: 12 }}
        >
          <p style={{ fontSize: 15, color: "#2C2C2C", margin: 0, fontWeight: 500 }}>
            Todavía no hay solicitudes para {anoLectivo}
          </p>
          <p
            style={{ fontSize: 13, color: "#6B6660", margin: 0, textAlign: "center", maxWidth: 460 }}
          >
            En cuanto entre la primera —por el formulario de admisiones o{" "}
            <Link href="/admin/admisiones/nueva" style={{ color: "#1A2B4A", fontWeight: 600 }}>
              registrándola a mano
            </Link>
            — aquí verás en qué etapa está cada aspirante, cuáles llevan demasiado tiempo detenidos
            y de qué colegios vienen.
          </p>
        </div>
      ) : (
        <>
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
          >
            <Tarjeta titulo="Ahora mismo">
              <div className="flex flex-wrap gap-8">
                <Cifra valor={m.enProceso} etiqueta="En proceso" nota="Sin resolver todavía" />
                <Cifra valor={m.matriculados} etiqueta="Matriculados" />
                <Cifra valor={m.noAdmitidos} etiqueta="No admitidos" />
              </div>
            </Tarjeta>

            <Tarjeta titulo={`Últimos ${DIAS_DEL_PERIODO} días`}>
              <div className="flex flex-wrap gap-8">
                <Cifra valor={m.nuevasEnPeriodo} etiqueta="Solicitudes nuevas" />
                <Cifra
                  valor={m.admitidasEnPeriodo}
                  etiqueta="Admitidas"
                  nota="Cuenta cuándo las admitió el Comité"
                />
              </div>
            </Tarjeta>
          </div>

          <Tarjeta titulo="Embudo del proceso">
            <p style={{ fontSize: 12, color: "#6B6660", margin: "-4px 0 0", lineHeight: 1.55 }}>
              Cuántos aspirantes han llegado <strong>al menos</strong> hasta cada etapa — quien está
              matriculado también pasó por las anteriores.
              {m.noAdmitidos > 0 &&
                ` Los no admitidos cuentan hasta donde llegaron antes de salir del proceso.`}
            </p>
            <div className="flex flex-col gap-3">
              {pasos.map((p) => {
                const etiqueta = ESTADO_INFO[p.estado]?.label ?? p.estado;
                const enEsteEstado = m.porEstado.find((e) => e.estado === p.estado)?.total ?? 0;
                return (
                  <div key={p.estado} className="flex flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span style={{ fontSize: 13, color: "#2C2C2C" }}>{etiqueta}</span>
                      <span style={{ fontSize: 12, color: "#6B6660" }}>
                        <strong style={{ fontSize: 13, color: "#1A2B4A" }}>{p.alcanzaron}</strong>
                        {enEsteEstado > 0 && ` · ${enEsteEstado} parado aquí`}
                      </span>
                    </div>
                    <div style={{ height: 8, background: "#F4F1EB", borderRadius: 999 }}>
                      {/*
                        Un solo azul, no el color de cada estado. El embudo es
                        una sola magnitud ordenada —cuántos llegaron al menos
                        hasta aquí—, y seis colores distintos se leen como seis
                        categorías, que es justo lo contrario de lo que explica
                        el texto de arriba.

                        Además el color de «matriculado» es el rojo
                        institucional, así que la meta del proceso se habría
                        pintado del color que el panel usa para los errores.
                      */}
                      <div
                        style={{
                          height: "100%",
                          width: `${Math.round((p.alcanzaron / maxEmbudo) * 100)}%`,
                          background: "#1A2B4A",
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Mes a mes">
            <p style={{ fontSize: 12, color: "#6B6660", margin: "-4px 0 0", lineHeight: 1.55 }}>
              Cuántos aspirantes entraron cada mes y cuántos admitió el Comité. Las admisiones
              cuentan en el mes en que se decidieron, aunque después se hayan matriculado.
            </p>
            <SerieMensual meses={m.serieMensual} mesesOmitidos={m.mesesOmitidos} />
          </Tarjeta>

          <Tarjeta titulo={`Detenidos más de ${m.diasParaEstancada} días`}>
            {m.estancadas.length === 0 ? (
              <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
                Ninguno. Todos los aspirantes en proceso han cambiado de etapa en los últimos{" "}
                {m.diasParaEstancada} días.
              </p>
            ) : (
              <>
                <p style={{ fontSize: 12, color: "#6B6660", margin: "-4px 0 0", lineHeight: 1.55 }}>
                  Días desde el último cambio de etapa, no desde la última edición de la ficha.
                </p>
                <div className="flex flex-col">
                  {m.estancadas.map((e, i) => (
                    <Link
                      key={e.id}
                      href={`/admin/admisiones/${e.id}`}
                      className="flex items-center justify-between gap-4 py-3 transition-opacity hover:opacity-70"
                      style={{ borderTop: i === 0 ? "none" : BORDE, textDecoration: "none" }}
                    >
                      <div className="flex flex-col gap-0.5" style={{ minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: 13,
                            color: "#1A2B4A",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.nombre}
                        </span>
                        <span style={{ fontSize: 11, color: "#6B6660" }}>
                          {e.numero ? `${e.numero} · ` : ""}
                          {/*
                            Con fallback, como en el resto del módulo: si una
                            migración amplía los estados antes de que se
                            despliegue `constants.ts`, sin él esta pantalla
                            devuelve un 500 en vez de enseñar el slug.
                          */}
                          {ESTADO_INFO[e.estado]?.label ?? e.estado}
                        </span>
                      </div>
                      <span
                        className="flex items-center gap-1.5"
                        style={{ fontSize: 12, color: "#92400E", flexShrink: 0 }}
                      >
                        <Clock size={13} strokeWidth={2} />
                        {e.dias} días
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </Tarjeta>

          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}
          >
            <Tarjeta titulo="Por nivel">
              <Barras filas={m.porNivel} vacio="Ninguna solicitud indicó nivel." />
            </Tarjeta>
            <Tarjeta titulo="Por institución de origen">
              <Barras
                filas={m.porInstitucion}
                vacio="Ninguna solicitud indicó de qué institución viene."
              />
            </Tarjeta>
          </div>
        </>
      )}
    </>
  );
}
