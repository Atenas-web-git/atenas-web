import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
// Escapa Y neutraliza formulas: el contenido de estas celdas lo escribe
// cualquiera desde el formulario publico. Ver src/lib/csv.ts.
import { celdaCsv, BOM_UTF8 } from "@/lib/csv";

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

  const supabase = createAdminClient();
  let q = supabase
    .from("solicitudes_admision")
    .select(
      "numero, est_nombres, est_apellidos, est_nivel, est_grado, est_fecha_nac, rep_nombres, rep_apellidos, rep_correo, rep_telefono, rep_relacion, estado, como_enterado, anio_ingreso, comentarios, created_at, origen"
    )
    .order("created_at", { ascending: false });

  if (estado) q = q.eq("estado", estado);
  if (nivel) q = q.eq("est_nivel", nivel);

  const { data } = await q;

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

  const rows = (data ?? []).map((s) =>
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
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
