"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type FechasActionState = { error: string | null; ok: boolean };

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [
      ROLES.SUPERADMIN,
      ROLES.EDITOR_ADMISIONES,
      ROLES.EDITOR_COMM,
    ])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarFechasMatriculasAction(
  _prev: FechasActionState,
  formData: FormData
): Promise<FechasActionState> {
  const user = await assertEditor();

  const anoLectivo = String(formData.get("ano_lectivo") ?? "").trim();
  const ctaTexto = String(formData.get("cta_texto") ?? "").trim();
  const ctaUrl = String(formData.get("cta_url") ?? "").trim();

  if (!anoLectivo) {
    return { error: "El año lectivo es obligatorio.", ok: false };
  }

  // Las etapas vienen como JSON serializado desde el cliente
  const etapasRaw = String(formData.get("etapas") ?? "[]");
  let etapas: Array<{ etapa: string; rango: string }>;
  try {
    etapas = JSON.parse(etapasRaw);
  } catch {
    return { error: "Etapas inválidas.", ok: false };
  }
  if (!Array.isArray(etapas)) {
    return { error: "Etapas inválidas.", ok: false };
  }

  const etapasValidas = etapas
    .map((e) => ({
      etapa: String(e?.etapa ?? "").trim(),
      rango: String(e?.rango ?? "").trim(),
    }))
    .filter((e) => e.etapa && e.rango);

  if (etapasValidas.length === 0) {
    return {
      error: "Debes definir al menos una etapa con etiqueta y rango.",
      ok: false,
    };
  }

  const value = {
    ano_lectivo: anoLectivo,
    etapas: etapasValidas,
    cta_texto: ctaTexto || null,
    cta_url: ctaUrl || null,
  };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("configuracion_global")
    .upsert(
      {
        key: "fechas_matriculas",
        value,
        descripcion:
          "Banner de fechas que aparece en todas las páginas de Matrículas.",
        updated_by: user.id,
      },
      { onConflict: "key" }
    );

  if (error) {
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admin/configuracion/fechas-matriculas");
  // Revalidar todas las páginas que usan el banner
  revalidatePath("/matriculas");
  revalidatePath("/matriculas/proceso");
  revalidatePath("/matriculas/valores");
  return { error: null, ok: true };
}
