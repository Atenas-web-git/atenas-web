import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
// Escapa Y neutraliza formulas: el contenido de estas celdas lo escribe
// cualquiera desde el formulario publico. Ver src/lib/csv.ts.
import { celdaCsv, BOM_UTF8 } from "@/lib/csv";
import { filtrarSolicitudes } from "@/lib/admisiones/filtros";
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
};

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
        "numero, est_nombres, est_apellidos, est_nivel, est_grado, est_fecha_nac, rep_nombres, rep_apellidos, rep_correo, rep_telefono, rep_relacion, estado, como_enterado, anio_ingreso, comentarios, created_at, origen"
      )
      .order("created_at", { ascending: false })
      .order("id", { ascending: false });

    q = filtrarSolicitudes(q, { estado, nivel, q: busqueda });

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
    filtros: { estado, nivel, busqueda },
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
