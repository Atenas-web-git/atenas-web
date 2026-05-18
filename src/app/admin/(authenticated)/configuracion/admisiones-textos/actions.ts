"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type { AdmisionesTextosConfig } from "@/lib/cms/admisionesTextos";

export type AdmisionesTextosActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarAdmisionesTextosAction(
  _prev: AdmisionesTextosActionState,
  formData: FormData
): Promise<AdmisionesTextosActionState> {
  const user = await assertSuperadmin();

  const value: AdmisionesTextosConfig = {
    formulario: {
      headerTitle: String(formData.get("formulario_headerTitle") ?? "").trim(),
      backLabel: String(formData.get("formulario_backLabel") ?? "").trim(),
    },
    seguimiento: {
      headerTitle: String(formData.get("seguimiento_headerTitle") ?? "").trim(),
      backLabel: String(formData.get("seguimiento_backLabel") ?? "").trim(),
      introTitle: String(formData.get("seguimiento_introTitle") ?? "").trim(),
      introDescription: String(formData.get("seguimiento_introDescription") ?? "").trim(),
    },
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "admisiones_textos",
      value,
      descripcion:
        "Textos editables de /admisiones/formulario y /admisiones/seguimiento (solo headers e intro de búsqueda).",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[admisiones_textos] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admisiones/formulario");
  revalidatePath("/admisiones/seguimiento");
  revalidatePath("/admin/configuracion/admisiones-textos");
  return { error: null, ok: true };
}
