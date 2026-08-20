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
} from "@/lib/formularios/tipos";

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
  let consulta = supabase
    .from("formulario_respuestas")
    .select("numero, datos, archivos, estado, nota_interna, created_at")
    .eq("formulario_id", id)
    .order("numero", { ascending: true });

  // Mismo filtro que la bandeja, validado con la misma funcion.
  const estado = estadoRespuestaValido(new URL(req.url).searchParams.get("estado"));
  if (estado) consulta = consulta.eq("estado", estado);

  const { data, error } = await consulta;

  // Igual que en la exportación de admisiones: sin mirar `error`, una consulta
  // fallida produce un CSV con 200 y solo cabeceras, que se lee como «este
  // formulario no tiene ni una respuesta».
  if (error) {
    console.error("[respuestas/exportar]", error);
    return NextResponse.json(
      { error: "No se pudo generar la exportación." },
      { status: 500 }
    );
  }

  const filas = (data ?? []) as unknown as {
    numero: number;
    datos: DatosRespuesta;
    archivos: ArchivoRespuesta[];
    estado: EstadoRespuesta;
    nota_interna: string | null;
    created_at: string;
  }[];

  const camposDatos = formulario.campos.filter((c) => c.tipo !== "archivo");
  const camposArchivo = formulario.campos.filter((c) => c.tipo === "archivo");

  const cabeceras = [
    "N°",
    "Fecha",
    ...camposDatos.map((c) => c.etiqueta),
    ...camposArchivo.map((c) => c.etiqueta),
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
