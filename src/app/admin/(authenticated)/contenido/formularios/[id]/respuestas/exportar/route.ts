/**
 * GET /admin/contenido/formularios/[id]/respuestas/exportar
 *
 * Descarga las respuestas en CSV. Las columnas salen de la definición del
 * formulario, así que cada formulario exporta las suyas.
 *
 * Lleva BOM UTF-8 al principio: sin él, Excel en Windows abre el archivo en
 * la codificación del sistema y todas las tildes y las eñes salen rotas.
 *
 * Los adjuntos NO se exportan, solo su nombre. Son archivos privados y una
 * hoja de cálculo circula por correo con demasiada facilidad; para bajarlos
 * hay que entrar a la bandeja, donde el enlace caduca en una hora.
 */

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { puedeVerFormularios } from "@/lib/auth/areas";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFormularioParaPanel } from "@/lib/formularios/getFormulario";
import { valorLegible } from "@/lib/formularios/validar";
// Escapa Y neutraliza formulas: estas respuestas las escribe cualquier
// visitante del sitio, sin cuenta. Ver src/lib/csv.ts.
import { celdaCsv, BOM_UTF8 } from "@/lib/csv";
import {
  ESTADO_LABELS,
  type ArchivoRespuesta,
  type DatosRespuesta,
  type EstadoRespuesta,
  estadoRespuestaValido,
  clavesRetiradasDe,
} from "@/lib/formularios/tipos";
import { traerTodas } from "@/lib/supabase/paginar";

/** Una fila tal como sale de la consulta. */
type FilaRespuesta = {
  numero: number;
  datos: DatosRespuesta;
  archivos: ArchivoRespuesta[];
  estado: EstadoRespuesta;
  nota_interna: string | null;
  created_at: string;
};

export const runtime = "nodejs";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user || !puedeVerFormularios(user)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  // El Excel se lleva todas las respuestas de golpe, así que este guard es el
  // que más importa: sin el corte por área, una URL bastaba para descargar
  // los mensajes de contacto o las consultas de admisión enteras.
  const formulario = await getFormularioParaPanel(id, user);
  if (!formulario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const supabase = createAdminClient();

  // Mismo filtro que la bandeja, validado con la misma funcion.
  const estado = estadoRespuestaValido(new URL(req.url).searchParams.get("estado"));

  /*
    PAGINADO desde el 2026-09-02, y de las tres exportaciones esta es la que
    llega antes al tope: acumula contactos, quejas y postulaciones de empleo,
    que suman mil mucho antes que las solicitudes de admisión.

    `numero` es único por formulario y ya venía como orden, así que sirve de
    clave estable para paginar sin desempate extra.
  */
  const resultado = await traerTodas<FilaRespuesta>((desde, hasta) => {
    let consulta = supabase
      .from("formulario_respuestas")
      .select("numero, datos, archivos, estado, nota_interna, created_at")
      .eq("formulario_id", id)
      .order("numero", { ascending: true });

    if (estado) consulta = consulta.eq("estado", estado);

    return consulta.range(desde, hasta);
  });

  // Un archivo incompleto no se entrega. Antes aquí solo se miraba `error`: una
  // consulta fallida producía un CSV con 200 y solo cabeceras, que se lee como
  // «este formulario no tiene ni una respuesta». Un archivo al que le faltan
  // filas de la mitad hacia abajo es la misma mentira, y esa sí llega sola.
  if (!resultado.completa) {
    console.error("[respuestas/exportar] exportación incompleta:", resultado.motivo);
    return NextResponse.json(
      { error: "No se pudo generar la exportación completa. Inténtalo de nuevo." },
      { status: 500 }
    );
  }

  // Sin el doble casteo de antes: el tipo va ahora en `FilaRespuesta`, que es
  // el mismo que se le pide a `traerTodas`.
  const filas = resultado.filas;

  const camposDatos = formulario.campos.filter((c) => c.tipo !== "archivo");
  const camposArchivo = formulario.campos.filter((c) => c.tipo === "archivo");

  /*
    Las preguntas que ya no existen pero cuyas respuestas sí.

    Se calculan sobre TODAS las filas y no fila a fila: no todas las respuestas
    tienen las mismas claves —una pregunta pudo existir unos meses y no antes ni
    después— y el CSV necesita las columnas antes de recorrer nada.

    Sin esto, borrar una pregunta del editor hacía que lo ya contestado
    desapareciera del archivo. El dato seguía en la base; simplemente nadie
    volvía a verlo.
  */
  const clavesRetiradas = clavesRetiradasDe(filas, formulario.campos);

  const cabeceras = [
    "N°",
    "Fecha",
    ...camposDatos.map((c) => c.etiqueta),
    ...camposArchivo.map((c) => c.etiqueta),
    // Se marcan en la cabecera para que quien abra el Excel no crea que son
    // preguntas vigentes del formulario.
    ...clavesRetiradas.map((k) => `${k.replace(/_/g, " ")} (pregunta retirada)`),
    "Estado",
    "Nota interna",
  ];

  const lineas = filas.map((fila) =>
    [
      String(fila.numero),
      new Date(fila.created_at).toLocaleString("es-EC", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      ...camposDatos.map((c) => valorLegible(fila.datos?.[c.key] ?? null)),
      ...camposArchivo.map(
        (c) =>
          (fila.archivos ?? []).find((a) => a.key === c.key)?.filename ?? ""
      ),
      ...clavesRetiradas.map((k) => valorLegible(fila.datos?.[k] ?? null)),
      ESTADO_LABELS[fila.estado] ?? fila.estado,
      fila.nota_interna ?? "",
    ]
      .map(celdaCsv)
      .join(",")
  );

  const csv =
    BOM_UTF8 + [cabeceras.map(celdaCsv).join(","), ...lineas].join("\r\n");

  const nombreArchivo = `${formulario.slug}_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      // Evita que la respuesta quede en la cache del navegador y que se vuelva
      // a pintar al pulsar «atrás». Ojo con lo que NO resuelve: el archivo se
      // descarga igual a la carpeta de Descargas del equipo, y ahí ninguna
      // cabecera llega. Con datos de menores, eso es conversación con el
      // colegio, no una linea de codigo.
      "Cache-Control": "no-store, private",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
