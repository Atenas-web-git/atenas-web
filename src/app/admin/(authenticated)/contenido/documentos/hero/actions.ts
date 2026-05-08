"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type HeroDocumentosActionState = { error: string | null; ok: boolean };

async function assertEditor() {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])
  ) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarHeroDocumentosAction(
  _prev: HeroDocumentosActionState,
  formData: FormData
): Promise<HeroDocumentosActionState> {
  const user = await assertEditor();

  const badge = String(formData.get("badge") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const ghostText = String(formData.get("ghostText") ?? "").trim();
  const footnote = String(formData.get("footnote") ?? "").trim();
  const bgImageSrc = String(formData.get("bgImageSrc") ?? "").trim();

  if (!title) {
    return { error: "El título es obligatorio.", ok: false };
  }

  const value = {
    badge: badge || null,
    title,
    subtitle: subtitle || null,
    ghostText: ghostText || null,
    footnote: footnote || null,
    bgImageSrc: bgImageSrc || null,
  };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("configuracion_global")
    .upsert(
      {
        key: "documentos_pagina_hero",
        value,
        descripcion:
          "Hero (cabecera) de la página pública /documentos-institucionales.",
        updated_by: user.id,
      },
      { onConflict: "key" }
    );

  if (error) {
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admin/contenido/documentos/hero");
  revalidatePath("/documentos-institucionales");
  return { error: null, ok: true };
}
