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
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { getFormularioPorId } from "@/lib/formularios/getFormulario";
import { valorLegible } from "@/lib/formularios/validar";
import {
  ESTADO_LABELS,
  type ArchivoRespuesta,
  type DatosRespuesta,
  type EstadoRespuesta,
} from "@/lib/formularios/tipos";

export const runtime = "nodejs";

function escaparCsv(valor: string): string {
  if (/[",\n\r]/.test(valor)) {
    return `"${valor.replace(/"/g, '""')}"`;
  }
  return valor;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const formulario = await getFormularioPorId(id);
  if (!formulario) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("formulario_respuestas")
    .select("numero, datos, archivos, estado, nota_interna, created_at")
    .eq("formulario_id", id)
    .order("numero", { ascending: true });

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
      .map(escaparCsv)
      .join(",")
  );

  const csv =
    "﻿" + [cabeceras.map(escaparCsv).join(","), ...lineas].join("\r\n");

  const nombreArchivo = `${formulario.slug}_${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
    },
  });
}
