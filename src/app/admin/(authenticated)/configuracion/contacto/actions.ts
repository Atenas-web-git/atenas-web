"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type { Contacto } from "@/lib/cms/getConfiguracion";

export type ContactoActionState = { error: string | null; ok: boolean };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarContactoAction(
  _prev: ContactoActionState,
  formData: FormData
): Promise<ContactoActionState> {
  const user = await assertSuperadmin();

  // Teléfonos y emails vienen como JSON serializado desde el cliente
  let telefonos: Contacto["telefonos"];
  let emails: Contacto["emails"];
  try {
    telefonos = JSON.parse(String(formData.get("telefonos") ?? "[]"));
    emails = JSON.parse(String(formData.get("emails") ?? "[]"));
  } catch {
    return { error: "Datos inválidos.", ok: false };
  }
  if (!Array.isArray(telefonos) || !Array.isArray(emails)) {
    return { error: "Datos inválidos.", ok: false };
  }

  const telefonosValidos = telefonos
    .map((t) => ({
      label: String(t?.label ?? "").trim(),
      numero: String(t?.numero ?? "").trim(),
      extension: String(t?.extension ?? "").trim(),
      esWhatsApp: Boolean(t?.esWhatsApp),
    }))
    .filter((t) => t.label && t.numero);

  const emailsValidos = emails
    .map((e) => ({
      label: String(e?.label ?? "").trim(),
      email: String(e?.email ?? "").trim(),
    }))
    .filter((e) => e.label && EMAIL_REGEX.test(e.email));

  if (telefonosValidos.length === 0) {
    return { error: "Agrega al menos un teléfono válido.", ok: false };
  }
  if (emailsValidos.length === 0) {
    return { error: "Agrega al menos un email válido.", ok: false };
  }

  const redes: Contacto["redes"] = {
    facebook: String(formData.get("red_facebook") ?? "").trim(),
    instagram: String(formData.get("red_instagram") ?? "").trim(),
    youtube: String(formData.get("red_youtube") ?? "").trim(),
    tiktok: String(formData.get("red_tiktok") ?? "").trim(),
    x: String(formData.get("red_x") ?? "").trim(),
    linkedin: String(formData.get("red_linkedin") ?? "").trim(),
  };

  const whatsapp: Contacto["whatsapp"] = {
    numero: String(formData.get("wa_numero") ?? "").replace(/[^0-9]/g, ""),
    mensaje: String(formData.get("wa_mensaje") ?? "").trim(),
    activo: formData.get("wa_activo") === "on",
  };

  const horario = String(formData.get("horario") ?? "").trim();

  const value: Contacto = {
    telefonos: telefonosValidos,
    emails: emailsValidos,
    redes,
    whatsapp,
    horario,
  };

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "contacto",
      value,
      descripcion:
        "Canales de contacto: teléfonos, emails, redes sociales, WhatsApp del FloatingBoot y horario.",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[contacto] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion/contacto");
  return { error: null, ok: true };
}
