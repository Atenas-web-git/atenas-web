"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { contarPlazas } from "@/lib/admisiones/cupos";

export type AnoLectivoActionState = { error: string | null; ok: boolean };

const CODIGO_REGEX = /^\d{4}-\d{4}$/;

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

function validateCodigo(codigo: string): string | null {
  if (!CODIGO_REGEX.test(codigo)) {
    return 'El código debe tener formato "YYYY-YYYY" (por ej. 2026-2027).';
  }
  const [a, b] = codigo.split("-").map((n) => parseInt(n, 10));
  if (b !== a + 1) {
    return "Los dos años del código deben ser consecutivos.";
  }
  return null;
}

export async function createAnoLectivoAction(
  _prev: AnoLectivoActionState,
  formData: FormData
): Promise<AnoLectivoActionState> {
  const user = await assertSuperadmin();

  const codigo = String(formData.get("codigo") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fechaInicio = String(formData.get("fecha_inicio") ?? "").trim();
  const fechaFin = String(formData.get("fecha_fin") ?? "").trim();

  const codigoError = validateCodigo(codigo);
  if (codigoError) return { error: codigoError, ok: false };
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };

  const supabase = createAdminClient();

  const { error } = await supabase.from("anos_lectivos").insert({
    codigo,
    nombre,
    fecha_inicio: fechaInicio || null,
    fecha_fin: fechaFin || null,
    activo: true,
    created_by: user.id,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un año lectivo con ese código.", ok: false };
    }
    return { error: "No se pudo crear el año lectivo.", ok: false };
  }

  revalidatePath("/admin/configuracion/anos-lectivos");
  revalidatePath("/admin/admisiones/cupos");
  return { error: null, ok: true };
}

export async function updateAnoLectivoAction(
  _prev: AnoLectivoActionState,
  formData: FormData
): Promise<AnoLectivoActionState> {
  await assertSuperadmin();

  const codigo = String(formData.get("codigo") ?? "").trim();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const fechaInicio = String(formData.get("fecha_inicio") ?? "").trim();
  const fechaFin = String(formData.get("fecha_fin") ?? "").trim();
  const activo = formData.get("activo") === "on";

  if (!codigo) return { error: "Código inválido.", ok: false };
  if (!nombre) return { error: "El nombre es obligatorio.", ok: false };

  const supabase = createAdminClient();

  const { error } = await supabase
    .from("anos_lectivos")
    .update({
      nombre,
      fecha_inicio: fechaInicio || null,
      fecha_fin: fechaFin || null,
      activo,
      updated_at: new Date().toISOString(),
    })
    .eq("codigo", codigo);

  if (error) return { error: "No se pudo actualizar.", ok: false };

  revalidatePath("/admin/configuracion/anos-lectivos");
  revalidatePath("/admin/admisiones/cupos");
  return { error: null, ok: true };
}

export async function deleteAnoLectivoAction(
  _prev: AnoLectivoActionState,
  formData: FormData
): Promise<AnoLectivoActionState> {
  await assertSuperadmin();

  const codigo = String(formData.get("codigo") ?? "").trim();
  if (!codigo) return { error: "Código inválido.", ok: false };

  const supabase = createAdminClient();

  // Verificar que no haya cupos ni solicitudes vinculadas.
  //
  // Se cuentan PLAZAS y con `contarPlazas`, la MISMA función que pinta el
  // número en la pantalla. Aquí se sumaban todas las filas y allí solo las de
  // nivel, así que las dos daban cifras distintas del mismo año: uno
  // configurado solo por año escolar salía como «0 cupos», con la papelera
  // habilitada, y esta acción lo rechazaba diciendo que tenía cupos.
  //
  // Contar filas tampoco vale: guardar escribe una fila por año escolar aunque
  // valga cero, así que un año recién creado y vacío quedaba imborrable.
  const [{ data: cuposRows }, { count: solicCount }] = await Promise.all([
    supabase
      .from("cupos_admision")
      .select("nivel, grado, cupos_total")
      .eq("ano_lectivo", codigo),
    supabase
      .from("solicitudes_admision")
      .select("*", { count: "exact", head: true })
      .eq("anio_ingreso", codigo),
  ]);

  const plazas = contarPlazas(cuposRows ?? []);
  const solicitudes = solicCount ?? 0;

  if (plazas > 0 || solicitudes > 0) {
    // El mensaje viejo afirmaba las dos cosas aunque solo se cumpliera una.
    const motivos = [
      plazas > 0 ? `${plazas} cupo(s) configurado(s)` : null,
      solicitudes > 0 ? `${solicitudes} solicitud(es) vinculada(s)` : null,
    ].filter(Boolean);
    return {
      error: `No se puede eliminar: este año lectivo tiene ${motivos.join(" y ")}.`,
      ok: false,
    };
  }

  const { error } = await supabase.from("anos_lectivos").delete().eq("codigo", codigo);

  if (error) return { error: "No se pudo eliminar.", ok: false };

  revalidatePath("/admin/configuracion/anos-lectivos");
  revalidatePath("/admin/admisiones/cupos");
  return { error: null, ok: true };
}
