"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type { Marca } from "@/lib/cms/getConfiguracion";

export type MarcaActionState = { error: string | null; ok: boolean };

const HEX_REGEX = /^#[0-9a-fA-F]{6}$/;

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

function normalizeHex(value: string, fallback: string): string {
  const trimmed = value.trim();
  if (HEX_REGEX.test(trimmed)) return trimmed.toUpperCase();
  // Aceptar #RGB (3 dígitos) y expandirlo a #RRGGBB
  const short = trimmed.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
  if (short) {
    return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toUpperCase();
  }
  return fallback;
}

export async function guardarMarcaAction(
  _prev: MarcaActionState,
  formData: FormData
): Promise<MarcaActionState> {
  const user = await assertSuperadmin();

  // Logos
  const logos = {
    principal: String(formData.get("logo_principal") ?? "").trim(),
    blanco: String(formData.get("logo_blanco") ?? "").trim(),
    escudo: String(formData.get("logo_escudo") ?? "").trim(),
    favicon: String(formData.get("logo_favicon") ?? "").trim(),
    ogDefault: String(formData.get("logo_og_default") ?? "").trim(),
  };

  // Paleta — normalizamos a #RRGGBB en mayúsculas, fallback al default si es inválido
  const paleta = {
    navy: normalizeHex(String(formData.get("color_navy") ?? ""), "#1A2B4A"),
    rojo: normalizeHex(String(formData.get("color_rojo") ?? ""), "#9E1915"),
    dorado: normalizeHex(String(formData.get("color_dorado") ?? ""), "#C9A84C"),
    offWhite: normalizeHex(String(formData.get("color_off_white") ?? ""), "#F8F5F0"),
    dark: normalizeHex(String(formData.get("color_dark") ?? ""), "#2C2C2C"),
  };

  // Tipografía
  const tipografia = String(formData.get("tipografia") ?? "Poppins").trim() || "Poppins";

  // Institución
  const anioFundacionRaw = String(formData.get("anio_fundacion") ?? "1976").trim();
  const anioFundacion = Number.parseInt(anioFundacionRaw, 10);
  const institucion = {
    nombre: String(formData.get("nombre_institucion") ?? "").trim() || "Unidad Educativa Atenas",
    ruc: String(formData.get("ruc") ?? "").trim(),
    direccion: String(formData.get("direccion") ?? "").trim(),
    ciudad: String(formData.get("ciudad") ?? "").trim() || "Ambato, Ecuador",
    sitioWeb: String(formData.get("sitio_web") ?? "").trim() || "https://atenas.edu.ec",
    anioFundacion:
      Number.isFinite(anioFundacion) && anioFundacion > 1800 && anioFundacion < 3000
        ? anioFundacion
        : 1976,
  };

  const value: Marca = { logos, paleta, tipografia, institucion };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "marca",
      value,
      descripcion:
        "Identidad visual del sitio: logos, paleta, tipografía e información institucional global.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[marca] upsert:", error);
    return { error: "No se pudo guardar la marca.", ok: false };
  }

  // Refrescar todas las rutas que dependen del root layout (la marca afecta a TODO).
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion/marca");
  return { error: null, ok: true };
}
