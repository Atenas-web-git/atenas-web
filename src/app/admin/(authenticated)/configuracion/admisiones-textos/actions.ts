"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
} from "@/lib/cms/admisionesTextos";

export type AdmisionesTextosActionState = { error: string | null; ok: boolean };

async function assertSuperadmin() {
  const user = await getCurrentUser();
  if (!user || !hasRole(user, ROLES.SUPERADMIN)) {
    throw new Error("No autorizado");
  }
  return user;
}

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function list(formData: FormData, key: string): string[] {
  // Textarea con una opción por línea.
  return String(formData.get(key) ?? "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export async function guardarAdmisionesTextosAction(
  _prev: AdmisionesTextosActionState,
  formData: FormData
): Promise<AdmisionesTextosActionState> {
  const user = await assertSuperadmin();

  // Construimos el objeto crudo, luego lo pasamos por merge para que
  // los campos vacíos caigan al default — patrón #26 (tolerancia).
  const raw: AdmisionesTextosConfig = {
    formulario: {
      headerTitle: s(formData, "f_headerTitle"),
      backLabel: s(formData, "f_backLabel"),

      pasoTitulos: {
        paso1: s(formData, "f_pasoTitulo_1"),
        paso2: s(formData, "f_pasoTitulo_2"),
        paso3: s(formData, "f_pasoTitulo_3"),
        paso4: s(formData, "f_pasoTitulo_4"),
      },
      pasoSubtitulos: {
        paso1: s(formData, "f_pasoSubtitulo_1"),
        paso2: s(formData, "f_pasoSubtitulo_2"),
        paso3: s(formData, "f_pasoSubtitulo_3"),
        paso4: s(formData, "f_pasoSubtitulo_4"),
      },

      camposEstudiante: {
        nombresLabel: s(formData, "f_est_nombresLabel"),
        nombresPlaceholder: s(formData, "f_est_nombresPlaceholder"),
        apellidosLabel: s(formData, "f_est_apellidosLabel"),
        apellidosPlaceholder: s(formData, "f_est_apellidosPlaceholder"),
        fechaNacLabel: s(formData, "f_est_fechaNacLabel"),
        nivelLabel: s(formData, "f_est_nivelLabel"),
        nivelPlaceholder: s(formData, "f_est_nivelPlaceholder"),
        institucionLabel: s(formData, "f_est_institucionLabel"),
        institucionPlaceholder: s(formData, "f_est_institucionPlaceholder"),
      },

      camposRepresentante: {
        nombresLabel: s(formData, "f_rep_nombresLabel"),
        nombresPlaceholder: s(formData, "f_rep_nombresPlaceholder"),
        apellidosLabel: s(formData, "f_rep_apellidosLabel"),
        apellidosPlaceholder: s(formData, "f_rep_apellidosPlaceholder"),
        relacionLabel: s(formData, "f_rep_relacionLabel"),
        relacionPlaceholder: s(formData, "f_rep_relacionPlaceholder"),
        correoLabel: s(formData, "f_rep_correoLabel"),
        correoPlaceholder: s(formData, "f_rep_correoPlaceholder"),
        telefonoLabel: s(formData, "f_rep_telefonoLabel"),
        telefonoPlaceholder: s(formData, "f_rep_telefonoPlaceholder"),
      },

      camposAdicional: {
        comoEnteradoLabel: s(formData, "f_ad_comoEnteradoLabel"),
        comoEnteradoPlaceholder: s(formData, "f_ad_comoEnteradoPlaceholder"),
        anioIngresoLabel: s(formData, "f_ad_anioIngresoLabel"),
        anioIngresoPlaceholder: s(formData, "f_ad_anioIngresoPlaceholder"),
        comentariosLabel: s(formData, "f_ad_comentariosLabel"),
        comentariosPlaceholder: s(formData, "f_ad_comentariosPlaceholder"),
      },

      opciones: {
        niveles: list(formData, "f_op_niveles"),
        relaciones: list(formData, "f_op_relaciones"),
        comoEnterado: list(formData, "f_op_comoEnterado"),
      },

      confirmacion: {
        seccionEstudiante: s(formData, "f_conf_seccionEstudiante"),
        seccionRepresentante: s(formData, "f_conf_seccionRepresentante"),
        seccionAdicional: s(formData, "f_conf_seccionAdicional"),
        botonEditar: s(formData, "f_conf_botonEditar"),
        mensajeFinal: s(formData, "f_conf_mensajeFinal"),
      },

      navegacion: {
        anterior: s(formData, "f_nav_anterior"),
        siguiente: s(formData, "f_nav_siguiente"),
        enviar: s(formData, "f_nav_enviar"),
        enviando: s(formData, "f_nav_enviando"),
      },

      exito: {
        titulo: s(formData, "f_ex_titulo"),
        descripcion: s(formData, "f_ex_descripcion"),
        etiquetaSeguimiento: s(formData, "f_ex_etiquetaSeguimiento"),
        queSigueTitulo: s(formData, "f_ex_queSigueTitulo"),
        queSigueBullets: list(formData, "f_ex_queSigueBullets"),
        botonVolver: s(formData, "f_ex_botonVolver"),
        botonInicio: s(formData, "f_ex_botonInicio"),
      },

      privacidad: {
        texto: s(formData, "f_priv_texto"),
        politicaLabel: s(formData, "f_priv_politicaLabel"),
      },
    },
    seguimiento: {
      headerTitle: s(formData, "s_headerTitle"),
      backLabel: s(formData, "s_backLabel"),
      introTitle: s(formData, "s_introTitle"),
      introDescription: s(formData, "s_introDescription"),
    },
  };

  const value = mergeAdmisionesTextos(raw);

  const supabase = createAdminClient();
  const { error } = await supabase.from("configuracion_global").upsert(
    {
      key: "admisiones_textos",
      value,
      descripcion:
        "Textos, etiquetas, placeholders y opciones editables del flujo público de admisiones (/admisiones/formulario + /admisiones/seguimiento).",
      updated_by: user.id,
    },
    { onConflict: "key" }
  );

  if (error) {
    console.error("[admisiones_textos] upsert:", error);
    return { error: "No se pudo guardar.", ok: false };
  }

  revalidatePath("/admisiones/formulario");
  revalidatePath("/admisiones/seguimiento");
  revalidatePath("/admin/configuracion/admisiones-textos");
  return { error: null, ok: true };
}

export type ContadorActionState = { error: string | null; ok: boolean };

/**
 * Edita el contador secuencial de N° de seguimiento de admisiones
 * (tabla `admisiones_contador`). El input del admin es "el próximo
 * número que se entregará"; internamente guardamos `proximo = N - 1`
 * porque la función SQL incrementa antes de devolver.
 */
export async function guardarContadorAction(
  _prev: ContadorActionState,
  formData: FormData
): Promise<ContadorActionState> {
  const user = await assertSuperadmin();

  const ano = String(formData.get("ano") ?? "").trim();
  const siguienteRaw = String(formData.get("siguiente") ?? "").trim();
  const siguiente = Number.parseInt(siguienteRaw, 10);

  if (!/^[0-9]{3}$/.test(ano)) {
    return { error: "Año inválido (debe ser de 3 dígitos, p.ej. 026).", ok: false };
  }
  if (!Number.isFinite(siguiente) || siguiente < 1 || siguiente > 999) {
    return { error: "El próximo número debe estar entre 1 y 999.", ok: false };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("admisiones_contador").upsert(
    {
      ano,
      proximo: siguiente - 1,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    },
    { onConflict: "ano" }
  );

  if (error) {
    console.error("[admisiones_contador] upsert:", error);
    return { error: "No se pudo guardar el contador.", ok: false };
  }

  revalidatePath("/admin/configuracion/admisiones-textos");
  return { error: null, ok: true };
}
