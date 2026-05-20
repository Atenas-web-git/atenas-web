"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import type { NavbarConfig } from "@/lib/cms/getConfiguracion";

export type NavbarActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarNavbarAction(
  _prev: NavbarActionState,
  formData: FormData
): Promise<NavbarActionState> {
  const user = await assertSuperadmin();

  const payloadRaw = String(formData.get("payload") ?? "");
  let value: NavbarConfig;
  try {
    value = JSON.parse(payloadRaw);
  } catch {
    return { error: "Payload inválido.", ok: false };
  }

  // Validación mínima de los campos requeridos
  if (!value.menuLabel || !value.menuLabel.trim()) {
    return { error: 'El label del botón "Menú" no puede estar vacío.', ok: false };
  }
  if (
    value.ctaPortal?.visible &&
    (!value.ctaPortal.label?.trim() || !value.ctaPortal.href?.trim())
  ) {
    return {
      error: 'El botón "Portal Familiar" está visible pero falta label o URL.',
      ok: false,
    };
  }
  if (
    value.ctaTour?.visible &&
    (!value.ctaTour.label?.trim() || !value.ctaTour.href?.trim())
  ) {
    return {
      error: 'El botón "Tour Virtual" está visible pero falta label o URL.',
      ok: false,
    };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "navbar",
      value,
      descripcion:
        "Barra de navegación superior: badge de aniversario, CTAs Portal/Tour, búsqueda, campanita y label del botón menú.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[navbar config]", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  // El navbar aparece en TODAS las páginas (root layout).
  revalidatePath("/admin/configuracion/navbar");
  revalidatePath("/", "layout");

  return { error: null, ok: true };
}
