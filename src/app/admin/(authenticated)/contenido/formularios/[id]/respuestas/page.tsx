import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, Inbox } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { puedeVerFormularios } from "@/lib/auth/areas";
import { getFormularioParaPanel } from "@/lib/formularios/getFormulario";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ESTADOS_RESPUESTA,
  estadoRespuestaValido,
  ESTADO_LABELS,
  type ArchivoRespuesta,
  type DatosRespuesta,
  type EstadoRespuesta,
} from "@/lib/formularios/tipos";
import { FichaRespuesta } from "./FichaRespuesta";

export const dynamic = "force-dynamic";

/**
 * Cuántas respuestas se pintan como máximo.
 *
 * Cada una es una ficha desplegable con sus datos y sus adjuntos, así que el
 * coste no está en la consulta sino en el navegador. 500 es de sobra para
 * trabajar y no cuelga la pestaña; lo que pase de ahí se baja con el botón de
 * descargar, que sí se lleva todas.
 */
const LIMITE_PANTALLA = 500;

type Respuesta = {
  id: string;
  numero: number;
  datos: DatosRespuesta;
  archivos: ArchivoRespuesta[];
  estado: EstadoRespuesta;
  nota_interna: string | null;
  correo_enviado: boolean;
  created_at: string;
};

export default async function RespuestasPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ estado?: string }>;
}) {
  const { id } = await params;
  const { estado: filtroEstado } = await searchParams;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!puedeVerFormularios(user)) {
    redirect("/admin");
  }

  const formulario = await getFormularioParaPanel(id, user);
  if (!formulario) notFound();

  const supabase = createAdminClient();
  let consulta = supabase
    .from("formulario_respuestas")
    // `count: "exact"` para poder decir cuántas hay en total, no solo cuántas
    // se están pintando. Ver `LIMITE_PANTALLA` más abajo.
    .select(
      "id, numero, datos, archivos, estado, nota_interna, correo_enviado, created_at",
      { count: "exact" }
    )
    .eq("formulario_id", id)
    .order("numero", { ascending: false });

  // La misma funcion que usa la exportacion: si cada una valida por su cuenta,
  // vuelven a separarse y el archivo deja de traer lo que se ve en pantalla.
  const estadoValido = estadoRespuestaValido(filtroEstado);

  if (estadoValido) consulta = consulta.eq("estado", estadoValido);

  // El enlace arrastra el filtro: sin esto, quien esta viendo «Nuevas» pulsa
  // Descargar y se lleva todas las respuestas del formulario.
  const urlExportar =
    `/admin/contenido/formularios/${id}/respuestas/exportar` +
    (estadoValido ? `?estado=${estadoValido}` : "");

  /*
    Esta pantalla pinta cada respuesta entera, con sus datos y sus adjuntos. Sin
    tope, la consulta se cortaba en 1.000 por el límite de PostgREST —con un 200
    y sin avisar— y la pantalla decía tener 1.000 cuando hubiera 3.000.

    La salida no es traerlas todas: cinco mil fichas en una sola página no las
    aguanta el navegador. Es pedir un tope EXPLÍCITO y decir cuántas hay en
    total, para que el número de la pantalla no sea una casualidad del servidor.

    El archivo sí se lleva todas: la exportación pagina. Por eso el aviso de
    abajo apunta al botón de descargar.
  */
  const { data, error, count } = await consulta.range(0, LIMITE_PANTALLA - 1);
  const respuestas = (data ?? []) as unknown as Respuesta[];

  const totalRespuestas = count ?? respuestas.length;
  const hayMasDeLasQueSeVen = totalRespuestas > respuestas.length;

  // Ojo: se cuenta sobre lo que se ve, no sobre el total. Con el aviso puesto
  // se entiende; sin él sería otro número encogido en silencio.
  const sinAvisar = respuestas.filter((r) => !r.correo_enviado).length;

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/admin/contenido/formularios/${id}`}
            className="inline-flex items-center gap-1"
            style={{ fontSize: 13, color: "#6B6660" }}
          >
            <ArrowLeft size={13} /> {formulario.nombre}
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
            Respuestas
          </h1>
        </div>

        {respuestas.length > 0 && (
          <a
            href={urlExportar}
            className="inline-flex shrink-0 items-center gap-1.5 px-3 py-2"
            style={{
              border: "1px solid #E8E4DD",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              color: "#1A2B4A",
            }}
          >
            <Download size={14} /> Descargar en Excel
          </a>
        )}
      </div>

      {/*
        Cuando hay más respuestas de las que caben en pantalla, se dice. La
        alternativa era que la lista pareciera completa y no lo fuera, que es
        justo lo que se vino a arreglar.
      */}
      {hayMasDeLasQueSeVen && (
        <div
          className="px-4 py-3"
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 8,
          }}
        >
          <p style={{ fontSize: 13, color: "#1E40AF", margin: 0, lineHeight: 1.5 }}>
            <strong>
              Se muestran las {respuestas.length} más recientes de{" "}
              {totalRespuestas} en total.
            </strong>{" "}
            Para verlas todas, usa <strong>Descargar en Excel</strong>: el archivo
            sí trae las {totalRespuestas}.
          </p>
        </div>
      )}

      {sinAvisar > 0 && (
        <div
          className="px-4 py-3"
          style={{ background: "rgba(158,25,21,0.06)", borderRadius: 8 }}
        >
          <p style={{ fontSize: 13, color: "#1A2B4A", margin: 0, lineHeight: 1.5 }}>
            <strong>
              {sinAvisar}{" "}
              {sinAvisar === 1 ? "respuesta llegó" : "respuestas llegaron"} sin
              que saliera el correo de aviso.
            </strong>{" "}
            Los datos están completos aquí — solo falló la notificación. Si se
            repite, revisa Configuración › Correos.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <FiltroEstado id={id} valor={null} activo={!estadoValido} label="Todas" />
        {ESTADOS_RESPUESTA.map((e) => (
          <FiltroEstado
            key={e}
            id={id}
            valor={e}
            activo={estadoValido === e}
            label={ESTADO_LABELS[e]}
          />
        ))}
      </div>

      {respuestas.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 px-6 py-14 text-center"
          style={{ background: "#FFFFFF", border: "1px dashed #E8E4DD", borderRadius: 12 }}
        >
          <Inbox size={26} color="#9A948C" />
          {/*
            Sin mirar `error`, un fallo de consulta se lee como «no hay
            respuestas» — y aquí eso significa dar por perdidas postulaciones
            que sí existen.
          */}
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: error ? "#991B1B" : "#1A2B4A",
              margin: 0,
            }}
          >
            {error
              ? "No se pudieron cargar las respuestas"
              : estadoValido
                ? "Nada en este estado"
                : "Todavía no hay respuestas"}
          </p>
          {error && (
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0 }}>
              Esto no quiere decir que no haya ninguna. Vuelve a intentarlo.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {respuestas.map((r) => (
            <FichaRespuesta
              key={r.id}
              respuesta={r}
              campos={formulario.campos}
              formularioId={id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FiltroEstado({
  id,
  valor,
  activo,
  label,
}: {
  id: string;
  valor: EstadoRespuesta | null;
  activo: boolean;
  label: string;
}) {
  return (
    <Link
      href={
        valor
          ? `/admin/contenido/formularios/${id}/respuestas?estado=${valor}`
          : `/admin/contenido/formularios/${id}/respuestas`
      }
      className="px-3 py-1.5"
      style={{
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        border: "1px solid #E8E4DD",
        background: activo ? "#1A2B4A" : "#FFFFFF",
        color: activo ? "#FFFFFF" : "#1A2B4A",
      }}
    >
      {label}
    </Link>
  );
}
