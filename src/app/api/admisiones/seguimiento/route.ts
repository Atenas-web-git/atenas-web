import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const numero = req.nextUrl.searchParams.get("numero")?.trim().toUpperCase();

  if (!numero || !/^ATN-\d{4}-\d{6}$/.test(numero)) {
    return NextResponse.json({ error: "Número de seguimiento inválido" }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("solicitudes_admision")
      .select("numero, estado, created_at, est_nombres, est_apellidos, est_nivel")
      .eq("numero", numero)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      numero: data.numero,
      estado: data.estado,
      created_at: data.created_at,
      est_nombres: data.est_nombres,
      est_apellidos: data.est_apellidos,
      est_nivel: data.est_nivel,
    });
  } catch (err) {
    console.error("[admisiones/seguimiento]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
