"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import type { CorreosDiseno } from "@/lib/cms/getConfiguracion";

export type CorreosDisenoActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarCorreosDisenoAction(
  _prev: CorreosDisenoActionState,
  formData: FormData
): Promise<CorreosDisenoActionState> {
  const user = await assertSuperadmin();

  const logoVariantRaw = String(formData.get("logoVariant") ?? "white_on_navy");
  const textoLegal = String(formData.get("textoLegal") ?? "").trim();

  const logoVariant: CorreosDiseno["logoVariant"] =
    logoVariantRaw === "color_on_white" ? "color_on_white" : "white_on_navy";

  if (!textoLegal) {
    return { error: "El texto legal no puede estar vacío.", ok: false };
  }
  if (textoLegal.length > 1000) {
    return { error: "El texto legal es demasiado largo (máx. 1000 caracteres).", ok: false };
  }

  const value: CorreosDiseno = { logoVariant, textoLegal };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "correos_diseno",
      value,
      descripcion:
        "Identidad común a los 10 correos transaccionales (variant del logo + texto legal del footer). Resto deriva de Marca + Contacto.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[correos_diseno]", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admin/configuracion/correos-diseno");
  return { error: null, ok: true };
}
