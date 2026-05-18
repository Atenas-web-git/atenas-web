"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import type {
  ContactosPaginaConfig,
  ExtensionContacto,
} from "@/lib/cms/contactosPagina";

export type ContactosPaginaActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function guardarContactosPaginaAction(
  _prev: ContactosPaginaActionState,
  formData: FormData
): Promise<ContactosPaginaActionState> {
  const user = await assertSuperadmin();

  let extensiones: ExtensionContacto[];
  try {
    extensiones = JSON.parse(String(formData.get("extensiones") ?? "[]"));
  } catch {
    return { error: "Datos inválidos en extensiones.", ok: false };
  }
  if (!Array.isArray(extensiones)) {
    return { error: "Datos inválidos en extensiones.", ok: false };
  }

  const extensionesValidas: ExtensionContacto[] = extensiones
    .map((e) => ({
      ext: String(e?.ext ?? "").trim(),
      dept: String(e?.dept ?? "").trim(),
      primary: Boolean(e?.primary),
    }))
    .filter((e) => e.ext && e.dept);

  const value: ContactosPaginaConfig = {
    hero: {
      eyebrow: String(formData.get("hero_eyebrow") ?? "").trim(),
      titleLine1: String(formData.get("hero_titleLine1") ?? "").trim(),
      titleLine2: String(formData.get("hero_titleLine2") ?? "").trim(),
      description: String(formData.get("hero_description") ?? ""),
      caption: String(formData.get("hero_caption") ?? "").trim(),
      ghostText: String(formData.get("hero_ghostText") ?? "").trim(),
      bgImage: String(formData.get("hero_bgImage") ?? "").trim(),
      tarjeta: {
        titulo: String(formData.get("hero_tarjeta_titulo") ?? "").trim(),
        subtitulo: String(formData.get("hero_tarjeta_subtitulo") ?? "").trim(),
      },
    },
    canales: {
      eyebrow: String(formData.get("canales_eyebrow") ?? "").trim(),
      heading: String(formData.get("canales_heading") ?? "").trim(),
      bannerImagen: String(formData.get("canales_bannerImagen") ?? "").trim(),
      tarjetaTelefono: {
        titulo: String(formData.get("canales_tarjetaTelefono_titulo") ?? "").trim(),
        extensiones: extensionesValidas,
      },
      tarjetaDireccion: {
        titulo: String(formData.get("canales_tarjetaDireccion_titulo") ?? "").trim(),
        horarioLaboral: String(
          formData.get("canales_tarjetaDireccion_horarioLaboral") ?? ""
        ).trim(),
        horarioFinde: String(
          formData.get("canales_tarjetaDireccion_horarioFinde") ?? ""
        ).trim(),
      },
      tarjetaEmail: {
        titulo: String(formData.get("canales_tarjetaEmail_titulo") ?? "").trim(),
        descripcion: String(formData.get("canales_tarjetaEmail_descripcion") ?? "").trim(),
        ctaLabel: String(formData.get("canales_tarjetaEmail_ctaLabel") ?? "").trim(),
        ctaHref: String(formData.get("canales_tarjetaEmail_ctaHref") ?? "").trim(),
      },
    },
    formulario: {
      eyebrow: String(formData.get("form_eyebrow") ?? "").trim(),
      heading: String(formData.get("form_heading") ?? "").trim(),
      subtitle: String(formData.get("form_subtitle") ?? "").trim(),
      submitLabel: String(formData.get("form_submitLabel") ?? "").trim(),
      successTitle: String(formData.get("form_successTitle") ?? "").trim(),
      successText: String(formData.get("form_successText") ?? "").trim(),
    },
    mapa: {
      embedUrl: String(formData.get("mapa_embedUrl") ?? "").trim(),
      badgeText: String(formData.get("mapa_badgeText") ?? "").trim(),
    },
  };

  if (!value.hero.titleLine1 || !value.hero.titleLine2) {
    return { error: "El título del hero (2 líneas) es obligatorio.", ok: false };
  }
  if (extensionesValidas.length === 0) {
    return { error: "Agrega al menos una extensión telefónica.", ok: false };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "contactos_pagina",
      value,
      descripcion:
        "Contenido editable de /contactos: hero, tarjeta flotante, sección Canales de atención (3 tarjetas con extensiones), formulario y mapa. Datos de contacto base vienen de configuracion_global[contacto].",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[contactos_pagina] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/contactos");
  revalidatePath("/admin/configuracion/contactos-pagina");
  return { error: null, ok: true };
}
