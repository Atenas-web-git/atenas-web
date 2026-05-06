"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import type { EstadoAdmision } from "../constants";

export type PlantillaActionState = { error: string | null; ok: boolean };

const ESTADOS_VALIDOS: EstadoAdmision[] = [
  "revisando",
  "entrevista_agendada",
  "lista_espera",
  "aceptado",
  "matriculado",
  "rechazado",
];

async function assertAdmisiones() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function savePlantillaAction(
  _prev: PlantillaActionState,
  formData: FormData
): Promise<PlantillaActionState> {
  const user = await assertAdmisiones();

  const estado = String(formData.get("estado") ?? "") as EstadoAdmision;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const asunto = String(formData.get("asunto") ?? "").trim();
  const cuerpoHtml = String(formData.get("cuerpo_html") ?? "");
  const activo = formData.get("activo") === "on";

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return { error: "Estado inválido.", ok: false };
  }
  if (!titulo) return { error: "El título es obligatorio.", ok: false };
  if (!asunto) return { error: "El asunto es obligatorio.", ok: false };
  if (!cuerpoHtml.trim()) return { error: "El cuerpo del mensaje no puede estar vacío.", ok: false };

  const supabase = createAdminClient();

  const { error } = await supabase.from("plantillas_correo_admision").upsert(
    {
      estado,
      titulo,
      asunto,
      cuerpo_html: cuerpoHtml,
      activo,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    { onConflict: "estado" }
  );

  if (error) return { error: "No se pudo guardar la plantilla.", ok: false };

  revalidatePath("/admin/admisiones/correos");
  revalidatePath(`/admin/admisiones/correos/${estado}`);
  return { error: null, ok: true };
}

export async function toggleActivoAction(
  _prev: PlantillaActionState,
  formData: FormData
): Promise<PlantillaActionState> {
  const user = await assertAdmisiones();

  const estado = String(formData.get("estado") ?? "") as EstadoAdmision;
  const activo = formData.get("activo") === "on";

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return { error: "Estado inválido.", ok: false };
  }

  const supabase = createAdminClient();

  // Update solo si la plantilla ya existe
  const { error } = await supabase
    .from("plantillas_correo_admision")
    .update({
      activo,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("estado", estado);

  if (error) return { error: "No se pudo actualizar el estado.", ok: false };

  revalidatePath("/admin/admisiones/correos");
  return { error: null, ok: true };
}
