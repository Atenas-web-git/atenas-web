"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  TIPOS_PLANTILLA_FORMULARIO,
  type TipoPlantillaFormulario,
} from "./constants";

export type PlantillaFormularioActionState = { error: string | null; ok: boolean };

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES, ROLES.EDITOR_COMM])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function savePlantillaFormularioAction(
  _prev: PlantillaFormularioActionState,
  formData: FormData
): Promise<PlantillaFormularioActionState> {
  const user = await assertEditor();

  const tipo = String(formData.get("tipo") ?? "") as TipoPlantillaFormulario;
  const titulo = String(formData.get("titulo") ?? "").trim();
  const asunto = String(formData.get("asunto") ?? "").trim();
  const cuerpoHtml = String(formData.get("cuerpo_html") ?? "");
  const activo = formData.get("activo") === "on";

  if (!TIPOS_PLANTILLA_FORMULARIO.includes(tipo)) {
    return { error: "Tipo inválido.", ok: false };
  }
  if (!titulo) return { error: "El título es obligatorio.", ok: false };
  if (!asunto) return { error: "El asunto es obligatorio.", ok: false };
  if (!cuerpoHtml.trim()) {
    return { error: "El cuerpo del mensaje no puede estar vacío.", ok: false };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("plantillas_correo_formularios").upsert(
    {
      tipo,
      titulo,
      asunto,
      cuerpo_html: cuerpoHtml,
      activo,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    { onConflict: "tipo" }
  );

  if (error) {
    console.error("[plantillas_correo_formularios] upsert:", error);
    return { error: "No se pudo guardar la plantilla.", ok: false };
  }

  revalidatePath("/admin/contenido/plantillas-formularios");
  revalidatePath(`/admin/contenido/plantillas-formularios/${tipo}`);
  return { error: null, ok: true };
}
