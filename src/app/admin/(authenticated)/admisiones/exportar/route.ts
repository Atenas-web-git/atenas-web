import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
// Escapa Y neutraliza formulas: el contenido de estas celdas lo escribe
// cualquiera desde el formulario publico. Ver src/lib/csv.ts.
import { celdaCsv, BOM_UTF8 } from "@/lib/csv";
import { filtrarSolicitudes, diasSinMovimiento } from "@/lib/admisiones/filtros";
import { ESTADOS_TERMINALES, type EstadoAdmision } from "../constants";
import { traerTodas } from "@/lib/supabase/paginar";
import { registrarDescarga } from "@/lib/security/registroDescargas";

/**
 * Las columnas que se exportan. Antes el tipo lo inferíaSupabase de la consulta;
 * ahora que la consulta va por `traerTodas`, hay que declararlo aquí.
 */
type FilaExportada = {
  numero: number | string | null;
  est_nombres: string | null;
  est_apellidos: string | null;
  est_nivel: string | null;
  est_grado: string | null;
  est_fecha_nac: string | null;
  rep_nombres: string | null;
  rep_apellidos: string | null;
  rep_correo: string | null;
  rep_telefono: string | null;
  rep_relacion: string | null;
  estado: string | null;
  como_enterado: string | null;
  anio_ingreso: string | number | null;
  comentarios: string | null;
  created_at: string;
  origen: string | null;
  ultimo_movimiento: string | null;
};

function diasSinCambiar(iso: string, ahora: number): number {
  return Math.floor((ahora - new Date(iso).getTime()) / 86_400_000);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const estado = searchParams.get("estado");
  const nivel = searchParams.get("nivel");
  // El buscador tambien. Sin el, quien busca un apellido y ve tres filas se
  // descarga el padron entero sin enterarse.
  const busqueda = searchParams.get("q");
  /*
    Y el filtro de «sin movimiento», por el mismo motivo que el buscador: si la
    pantalla enseña 12 familias detenidas y el archivo trae las 300, quien
    reparte las llamadas llama a quien no debe. Se lee con la misma función que
    la pantalla para que las dos entiendan igual un valor raro.
  */
  const detenidoDias = diasSinMovimiento(searchParams.get("detenido"));
  // El año lectivo, que la pantalla también filtra: la tarjeta de Métricas
  // cuenta un año y este archivo se lleva lo que se le diga.
  const anio = searchParams.get("ano");

  /*
    El instante se fija ANTES de pedir las filas, y se pasa al filtro.

    Este archivo se trae las solicitudes de mil en mil. Si la frontera de días
    se recalculara en cada vuelta, el conjunto crecería mientras se pagina: se
    colarían familias que cruzaron el umbral a mitad de la descarga y, peor, se
    podría saltar una fila, porque el paginado cuenta por posición.
  */
  const ahora = Date.now();

  const supabase = createAdminClient();

  /*
    PAGINADO desde el 2026-09-02. Antes era una consulta suelta sin `.range()`,
    y PostgREST corta en 1.000 filas devolviendo 200: a partir de la solicitud
    1.001, secretaría se descargaba un Excel al que le faltaban filas sin que
    nada lo dijera. Un archivo que se ve completo y no lo está es peor que uno
    vacío, porque nadie lo revisa.

    El desempate por `id` no es adorno: si dos solicitudes comparten
    `created_at` al milisegundo, sin él el orden entre ellas es indefinido y
    entre una página y la siguiente se pierden y se repiten filas.
  */
  const resultado = await traerTodas<FilaExportada>((desde, hasta) => {
    let q = supabase
      .from("solicitudes_admision")
      .select(
        "numero, est_nombres, est_apellidos, est_nivel, est_grado, est_fecha_nac, rep_nombres, rep_apellidos, rep_correo, rep_telefono, rep_relacion, estado, como_enterado, anio_ingreso, comentarios, created_at, origen, ultimo_movimiento"
      )
      /*
        El orden acompaña al filtro, igual que en la pantalla: con «sin
        movimiento» puesto, primero la que lleva más tiempo parada.

        No es un detalle estético. Este archivo existe para repartir llamadas,
        y si sale ordenado por fecha de entrada, quien lo reparte empieza por
        la familia equivocada. La pantalla ya lo hacía y el archivo no: son
        exactamente las dos mitades que este módulo lleva meses intentando que
        no se separen.
      */
      .order(detenidoDias !== null ? "ultimo_movimiento" : "created_at", {
        ascending: detenidoDias !== null,
      })
      .order("id", { ascending: false });

    q = filtrarSolicitudes(q, {
      estado,
      nivel,
      q: busqueda,
      anioIngreso: anio,
      sinMovimientoDias: detenidoDias,
      ahora,
    });

    return q.range(desde, hasta);
  });

  /*
    Un archivo incompleto NO se entrega. Da igual si el corte vino de un error
    de la consulta o de quedarse sin vueltas: entregar lo que se pudo leer, con
    un 200 y sin avisar, es exactamente el fallo que este paginado arregla.

    Antes aquí solo se miraba `error`. Esa rama sigue sin estar ejercitada —se
    predijo que un `?q=%00` mataría la consulta y el 2026-08-19 no reprodujo—,
    pero ahora cubre también el caso que sí puede ocurrir solo con que el
    colegio acumule solicitudes.
  */
  if (!resultado.completa) {
    console.error("[admisiones/exportar] exportación incompleta:", resultado.motivo);
    return NextResponse.json(
      { error: "No se pudo generar la exportación completa. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  const data = resultado.filas;

  const headers = [
    "N° Solicitud",
    "Est. Nombres",
    "Est. Apellidos",
    "Nivel",
    "Año escolar",
    "Fecha Nac.",
    "Rep. Nombres",
    "Rep. Apellidos",
    "Rep. Correo",
    "Rep. Teléfono",
    "Rep. Relación",
    "Estado",
    "Cómo se enteró",
    "Año lectivo",
    "Comentarios",
    "Fecha recibida",
    "Días sin movimiento",
    "Cómo llegó",
  ];

  /*
    Queda constancia ANTES de devolver el archivo, y solo cuando ya se sabe
    cuántas filas se lleva: un registro que dijera «descargó» sin decir cuánto
    no distingue mirar una familia de llevarse el padrón entero.

    No se espera al `await` para nada más: si el registro falla, la descarga
    sigue. Ver `registroDescargas.ts`.
  */
  await registrarDescarga({
    recurso: "admisiones",
    usuarioId: user.id,
    usuarioNombre: user.fullName,
    /*
      Las claves se escriben como se leen: esto se pinta tal cual en
      Usuarios › Descargas, que es la única pantalla donde un superadmin audita
      quién se llevó el padrón de menores. «detenidoDias: 30» ahí es ruido.
    */
    filtros: {
      estado,
      nivel,
      busqueda,
      "año lectivo": anio,
      // El registro guarda texto: sin convertirlo, un filtro puesto se
      // guardaría como si no lo estuviera.
      "días sin movimiento": detenidoDias !== null ? String(detenidoDias) : null,
    },
    filas: data.length,
  });

  const rows = data.map((s) =>
    [
      s.numero,
      s.est_nombres,
      s.est_apellidos,
      s.est_nivel,
      s.est_grado,
      s.est_fecha_nac,
      s.rep_nombres,
      s.rep_apellidos,
      s.rep_correo,
      s.rep_telefono,
      s.rep_relacion,
      s.estado,
      s.como_enterado,
      s.anio_ingreso,
      s.comentarios,
      formatDate(s.created_at),
      /*
        Días sin CAMBIAR DE ESTADO, que es lo que ordena las llamadas. Se cae a
        la fecha de entrada si la fila no tuviera la columna, igual que la
        pantalla, para que el archivo y lo que se ve digan el mismo número.

        En las matriculadas y las no admitidas va **vacío**, no el número: sin
        el filtro puesto el archivo las incluye, y quien ordenara esa columna de
        mayor a menor en Excel se encontraría arriba del todo a un matriculado
        de hace dos años, en la lista de a quién llamar.
      */
      ESTADOS_TERMINALES.has(s.estado as EstadoAdmision)
        ? ""
        : diasSinCambiar(s.ultimo_movimiento ?? s.created_at, ahora),
      // En palabras, no el valor de la base: quien abre el CSV es secretaría.
      s.origen === "manual" ? "Registrada a mano" : "Formulario web",
    ]
      .map(celdaCsv)
      .join(",")
  );

  // Con BOM, como la exportación de formularios: las cabeceras llevan tildes y
  // eñes («Cómo se enteró», «Año escolar») y sin él Excel en Windows las lee
  // con la codificación rota.
  const csv = BOM_UTF8 + [headers.map(celdaCsv).join(","), ...rows].join("\r\n");
  const filename = `admisiones_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      // Evita que la respuesta quede en la cache del navegador y que se vuelva
      // a pintar al pulsar «atrás». Ojo con lo que NO resuelve: el archivo se
      // descarga igual a la carpeta de Descargas del equipo, y ahí ninguna
      // cabecera llega. Con datos de menores, eso es conversación con el
      // colegio, no una linea de codigo.
      "Cache-Control": "no-store, private",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
