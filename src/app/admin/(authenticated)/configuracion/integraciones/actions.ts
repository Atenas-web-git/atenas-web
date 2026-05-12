"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type { Integraciones } from "@/lib/cms/getConfiguracion";

export type IntegracionesActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

/**
 * Validaciones de formato (no comprueban que las cuentas existan, solo que el
 * formato del ID sea válido). Si el campo está vacío, lo aceptamos (deshabilita
 * la integración).
 */
const PATTERNS = {
  gtmId: /^GTM-[A-Z0-9]{4,10}$/,
  ga4Id: /^G-[A-Z0-9]{6,12}$/,
  facebookPixel: /^[0-9]{10,20}$/,
  // TikTok Pixel: típicamente alfanumérico, 16-25 chars empezando por letra
  tiktokPixel: /^[A-Z0-9]{10,30}$/,
};

function clean(input: FormDataEntryValue | null): string {
  return String(input ?? "").trim();
}

export async function guardarIntegracionesAction(
  _prev: IntegracionesActionState,
  formData: FormData
): Promise<IntegracionesActionState> {
  const user = await assertSuperadmin();

  const gtmId = clean(formData.get("gtm_id"));
  const ga4Id = clean(formData.get("ga4_id"));
  const facebookPixel = clean(formData.get("facebook_pixel"));
  const tiktokPixel = clean(formData.get("tiktok_pixel"));
  const calendlyUrl = clean(formData.get("calendly_url"));
  const metaVerify = clean(formData.get("meta_verify"));
  const googleVerify = clean(formData.get("google_verify"));

  // Validaciones (vacío = válido — desactiva la integración)
  if (gtmId && !PATTERNS.gtmId.test(gtmId)) {
    return { error: 'GTM ID inválido. Formato esperado: "GTM-XXXXXXX".', ok: false };
  }
  if (ga4Id && !PATTERNS.ga4Id.test(ga4Id)) {
    return { error: 'GA4 ID inválido. Formato esperado: "G-XXXXXXX".', ok: false };
  }
  if (facebookPixel && !PATTERNS.facebookPixel.test(facebookPixel)) {
    return { error: "Facebook Pixel inválido. Debe ser un número de 10-20 dígitos.", ok: false };
  }
  if (tiktokPixel && !PATTERNS.tiktokPixel.test(tiktokPixel)) {
    return { error: "TikTok Pixel inválido. Debe ser alfanumérico (mayúsculas y números).", ok: false };
  }
  if (calendlyUrl && !/^https:\/\/calendly\.com\//.test(calendlyUrl)) {
    return { error: "URL de Calendly inválida. Debe empezar con https://calendly.com/.", ok: false };
  }

  const value: Integraciones = {
    gtmId,
    ga4Id,
    facebookPixel,
    tiktokPixel,
    calendlyUrl,
    metaVerify,
    googleVerify,
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "integraciones",
      value,
      descripcion:
        "Claves API de integraciones de terceros: GTM, GA4, Facebook Pixel, TikTok Pixel, Calendly, verificaciones.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[integraciones] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion/integraciones");
  return { error: null, ok: true };
}
