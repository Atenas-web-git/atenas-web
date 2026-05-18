"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type { FooterConfig, FooterAliado, FooterLink } from "@/lib/cms/footer";

export type FooterActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarFooterAction(
  _prev: FooterActionState,
  formData: FormData
): Promise<FooterActionState> {
  const user = await assertSuperadmin();

  let aliados: FooterAliado[];
  let links: FooterLink[];
  try {
    aliados = JSON.parse(String(formData.get("aliados") ?? "[]"));
    links = JSON.parse(String(formData.get("links") ?? "[]"));
  } catch {
    return { error: "Datos inválidos.", ok: false };
  }
  if (!Array.isArray(aliados) || !Array.isArray(links)) {
    return { error: "Datos inválidos.", ok: false };
  }

  const aliadosValidos: FooterAliado[] = aliados
    .map((a) => ({
      label: String(a?.label ?? "").trim(),
      abbr: String(a?.abbr ?? "").trim(),
    }))
    .filter((a) => a.label && a.abbr);

  const linksValidos: FooterLink[] = links
    .map((l) => ({
      label: String(l?.label ?? "").trim(),
      href: String(l?.href ?? "").trim(),
    }))
    .filter((l) => l.label && l.href);

  const value: FooterConfig = {
    bgImage: String(formData.get("bgImage") ?? "").trim(),
    headline: String(formData.get("headline") ?? "").trim(),
    subtitle: String(formData.get("subtitle") ?? "").trim(),
    ctaPrimary: {
      label: String(formData.get("ctaPrimary_label") ?? "").trim(),
      href: String(formData.get("ctaPrimary_href") ?? "").trim(),
    },
    ctaSecondary: {
      label: String(formData.get("ctaSecondary_label") ?? "").trim(),
      href: String(formData.get("ctaSecondary_href") ?? "").trim(),
    },
    aliadosLabel: String(formData.get("aliadosLabel") ?? "").trim(),
    aliados: aliadosValidos,
    links: linksValidos,
    copyright: String(formData.get("copyright") ?? "").trim(),
  };

  if (!value.headline) {
    return { error: "El titular es obligatorio.", ok: false };
  }
  if (!value.ctaPrimary.label || !value.ctaPrimary.href) {
    return { error: "El botón primario necesita texto y URL.", ok: false };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "footer",
      value,
      descripcion:
        "Footer global del sitio (FooterCTA): foto de fondo, headline, subtitle, 2 CTAs, aliados estratégicos, links del pie y copyright.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[footer] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  // Footer aparece en todas las páginas: revalidar el layout entero.
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion/footer");
  return { error: null, ok: true };
}
