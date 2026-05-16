"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { NIVELES, type EstadoAdmision } from "./constants";
import { notifyEstadoChange } from "./emails";

export type { EstadoAdmision } from "./constants";

export type AdmisionActionState = { error: string | null; ok: boolean };

async function assertAdmisiones() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) {
    throw new Error("No autorizado");
  }
  return user;
}

export async function updateEstadoAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");
  const nuevoEstado = String(formData.get("nuevoEstado") ?? "") as EstadoAdmision;

  if (!solicitudId || !nuevoEstado) {
    return { error: "Datos incompletos.", ok: false };
  }

  const supabase = createAdminClient();

  const { data: prev } = await supabase
    .from("solicitudes_admision")
    .select("numero, rep_correo, rep_nombres, est_nombres, est_apellidos, est_nivel, estado")
    .eq("id", solicitudId)
    .single();

  const { error } = await supabase
    .from("solicitudes_admision")
    .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
    .eq("id", solicitudId);

  if (error) return { error: "No se pudo actualizar el estado.", ok: false };

  if (prev && prev.estado !== nuevoEstado && prev.rep_correo) {
    await notifyEstadoChange({ ...prev, id: solicitudId }, nuevoEstado);
  }

  revalidatePath("/admin/admisiones");
  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

export async function updateDocumentosAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");

  if (!solicitudId) return { error: "ID de solicitud inválido.", ok: false };

  // Detectar dinámicamente qué documentos están marcados, sin depender
  // del catálogo hardcodeado: cualquier campo "doc_<nombre>" === "on"
  const documentos: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("doc_") && value === "on") {
      documentos.push(key.slice(4));
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("solicitudes_admision")
    .update({ documentos_recibidos: documentos, updated_at: new Date().toISOString() })
    .eq("id", solicitudId);

  if (error) return { error: "No se pudieron actualizar los documentos.", ok: false };

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

export async function updateNotasAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");
  const notas = String(formData.get("notas") ?? "").trim();

  if (!solicitudId) return { error: "ID de solicitud inválido.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("solicitudes_admision")
    .update({ notas_internas: notas || null, updated_at: new Date().toISOString() })
    .eq("id", solicitudId);

  if (error) return { error: "No se pudo guardar la nota.", ok: false };

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

const ADJUNTO_MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadAdjuntoAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  const user = await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");
  const file = formData.get("file") as File | null;

  if (!solicitudId) return { error: "ID de solicitud inválido.", ok: false };
  if (!file || file.size === 0) return { error: "Selecciona un archivo válido.", ok: false };
  if (file.size > ADJUNTO_MAX_BYTES) {
    return { error: "El archivo supera el límite de 5 MB.", ok: false };
  }

  const supabase = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `solicitudes/${solicitudId}/${Date.now()}_${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("admisiones-adjuntos")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { error: "No se pudo subir el archivo.", ok: false };
  }

  const { error: dbError } = await supabase.from("solicitud_adjuntos").insert({
    solicitud_id: solicitudId,
    filename: file.name,
    storage_path: storagePath,
    size_bytes: file.size,
    mime_type: file.type || null,
    uploaded_by: user.id,
  });

  if (dbError) {
    // limpiar el archivo si la BD falla
    await supabase.storage.from("admisiones-adjuntos").remove([storagePath]);
    return { error: "No se pudo registrar el adjunto.", ok: false };
  }

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

export async function deleteAdjuntoAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  await assertAdmisiones();
  const adjuntoId = String(formData.get("adjuntoId") ?? "");
  const solicitudId = String(formData.get("solicitudId") ?? "");

  if (!adjuntoId) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();

  const { data: adj } = await supabase
    .from("solicitud_adjuntos")
    .select("storage_path")
    .eq("id", adjuntoId)
    .single();

  if (adj?.storage_path) {
    await supabase.storage.from("admisiones-adjuntos").remove([adj.storage_path]);
  }

  const { error } = await supabase.from("solicitud_adjuntos").delete().eq("id", adjuntoId);
  if (error) return { error: "No se pudo eliminar.", ok: false };

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

/**
 * Vincula un archivo del banco a UNA solicitud específica. Cuando se envíe el
 * próximo correo automático a esa solicitud, este archivo se adjuntará (en
 * adición a los archivos asociados a la plantilla del estado).
 */
export async function vincularArchivoBancoASolicitudAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  const user = await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");
  const archivoId = String(formData.get("archivo_id") ?? "");

  if (!solicitudId) return { error: "Solicitud inválida.", ok: false };
  if (!archivoId) return { error: "Archivo inválido.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("solicitud_archivos_banco")
    .upsert(
      { solicitud_id: solicitudId, archivo_id: archivoId, created_by: user.id },
      { onConflict: "solicitud_id,archivo_id" }
    );

  if (error && error.code !== "23505") {
    return { error: `No se pudo vincular: ${error.message}`, ok: false };
  }

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

export async function desvincularArchivoBancoDeSolicitudAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");
  const archivoId = String(formData.get("archivo_id") ?? "");

  if (!solicitudId) return { error: "Solicitud inválida.", ok: false };
  if (!archivoId) return { error: "Archivo inválido.", ok: false };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("solicitud_archivos_banco")
    .delete()
    .eq("solicitud_id", solicitudId)
    .eq("archivo_id", archivoId);

  if (error) return { error: `No se pudo desvincular: ${error.message}`, ok: false };

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  return { error: null, ok: true };
}

export async function deleteSolicitudAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    return { error: "Solo el superadmin puede eliminar solicitudes.", ok: false };
  }

  const solicitudId = String(formData.get("solicitudId") ?? "");
  if (!solicitudId) return { error: "ID inválido.", ok: false };

  const supabase = createAdminClient();

  // Limpiar adjuntos en storage antes de borrar la solicitud
  const { data: adjuntos } = await supabase
    .from("solicitud_adjuntos")
    .select("storage_path")
    .eq("solicitud_id", solicitudId);

  const paths = (adjuntos ?? []).map((a) => a.storage_path).filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from("admisiones-adjuntos").remove(paths);
  }

  // El historial y los adjuntos en BD se borran por CASCADE
  const { error } = await supabase.from("solicitudes_admision").delete().eq("id", solicitudId);
  if (error) return { error: "No se pudo eliminar la solicitud.", ok: false };

  revalidatePath("/admin/admisiones");
  return { error: null, ok: true };
}

export async function saveCuposAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  const user = await assertAdmisiones();
  const supabase = createAdminClient();

  const anoLectivo = String(formData.get("ano_lectivo") ?? "");
  if (!anoLectivo) return { error: "Año lectivo inválido.", ok: false };

  const rows = NIVELES.map((nivel) => {
    const key = `cupos_${nivel.replace(/[^a-zA-Z0-9]/g, "_")}`;
    const total = Math.max(0, parseInt(String(formData.get(key) ?? "0"), 10) || 0);
    return {
      nivel,
      ano_lectivo: anoLectivo,
      cupos_total: total,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    };
  });

  const { error } = await supabase.from("cupos_admision").upsert(rows, {
    onConflict: "nivel,ano_lectivo",
  });

  if (error) return { error: "No se pudieron guardar los cupos.", ok: false };

  revalidatePath("/admin/admisiones/cupos");
  return { error: null, ok: true };
}
