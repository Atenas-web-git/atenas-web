"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type { Seo } from "@/lib/cms/getConfiguracion";

export type SeoActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

function clean(input: FormDataEntryValue | null): string {
  return String(input ?? "").trim();
}

export async function guardarSeoAction(
  _prev: SeoActionState,
  formData: FormData
): Promise<SeoActionState> {
  const user = await assertSuperadmin();

  const titleDefault = clean(formData.get("title_default"));
  const titleTemplate = clean(formData.get("title_template"));
  const description = clean(formData.get("description"));
  const keywords = clean(formData.get("keywords"));
  const ogImage = clean(formData.get("og_image"));
  const ogLocale = clean(formData.get("og_locale"));
  const siteName = clean(formData.get("site_name"));
  const twitterCardRaw = clean(formData.get("twitter_card"));
  const robotsIndex = formData.get("robots_index") === "on";
  const robotsFollow = formData.get("robots_follow") === "on";

  // Validaciones
  if (!titleDefault) return { error: "El title default es obligatorio.", ok: false };
  if (!titleTemplate || !titleTemplate.includes("%s")) {
    return {
      error: 'El title template debe incluir "%s" (placeholder para el title de cada página). Ej. "%s | Atenas".',
      ok: false,
    };
  }
  if (!description) return { error: "La description es obligatoria.", ok: false };
  if (description.length > 320) {
    return {
      error: "La description no debe superar 320 caracteres (recomendado 140-160).",
      ok: false,
    };
  }

  const twitterCard: Seo["twitterCard"] =
    twitterCardRaw === "summary" || twitterCardRaw === "summary_large_image"
      ? twitterCardRaw
      : "summary_large_image";

  const value: Seo = {
    titleDefault,
    titleTemplate,
    description,
    keywords,
    ogImage,
    ogLocale: ogLocale || "es_EC",
    siteName: siteName || "Unidad Educativa Atenas",
    twitterCard,
    robotsIndex,
    robotsFollow,
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "seo",
      value,
      descripcion: "Defaults SEO globales: title template, description, keywords, OG image, twitter card, locale, robots.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[seo] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  // El layout root revalida toda la app — el SEO afecta a todas las páginas.
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion/seo");
  return { error: null, ok: true };
}
