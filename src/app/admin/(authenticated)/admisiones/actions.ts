"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { NIVELES, ESTADO_INICIAL, type EstadoAdmision } from "./constants";
import { notifyEstadoChange } from "./emails";
import { TODOS_LOS_GRADOS, gradoValido } from "@/lib/admisiones/grados";

export type { EstadoAdmision } from "./constants";

export type AdmisionActionState = { error: string | null; ok: boolean };

/** Como `AdmisionActionState`, más el id de la solicitud recién creada. */
export type CrearSolicitudState = AdmisionActionState & { id: string | null };

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
    .select(
      "numero, rep_correo, rep_nombres, est_nombres, est_apellidos, est_nivel, est_institucion_origen, estado"
    )
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

/**
 * Edita manualmente los datos del estudiante y del representante de una
 * solicitud existente. Útil para corregir errores tipográficos que el
 * postulante cometió al llenar el formulario (un correo mal escrito, un
 * nombre con error, relación equivocada, etc.). No toca el estado, el
 * número, la fecha de creación ni el historial.
 */
export async function updateDatosSolicitudAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  await assertAdmisiones();
  const solicitudId = String(formData.get("solicitudId") ?? "");
  if (!solicitudId) return { error: "ID de solicitud inválido.", ok: false };

  const trim = (k: string) => String(formData.get(k) ?? "").trim();
  const nullable = (k: string) => {
    const v = trim(k);
    return v === "" ? null : v;
  };

  const est_nombres = trim("est_nombres");
  const est_apellidos = trim("est_apellidos");
  const est_nivel = trim("est_nivel");
  const rep_nombres = trim("rep_nombres");
  const rep_apellidos = trim("rep_apellidos");
  const rep_correo = trim("rep_correo");
  const rep_telefono = trim("rep_telefono");

  if (!est_nombres) return { error: "Los nombres del estudiante no pueden estar vacíos.", ok: false };
  if (!est_apellidos) return { error: "Los apellidos del estudiante no pueden estar vacíos.", ok: false };
  if (!est_nivel) return { error: "El nivel solicitado no puede estar vacío.", ok: false };
  if (!rep_nombres) return { error: "Los nombres del representante no pueden estar vacíos.", ok: false };
  if (!rep_apellidos) return { error: "Los apellidos del representante no pueden estar vacíos.", ok: false };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rep_correo)) {
    return { error: "El correo del representante no es válido.", ok: false };
  }
  if (!rep_telefono) return { error: "El teléfono del representante no puede estar vacío.", ok: false };

  const update: Record<string, string | null> = {
    est_nombres,
    est_apellidos,
    est_fecha_nac: nullable("est_fecha_nac"),
    est_nivel,
    // Mismo filtro que el endpoint público: «3ro EGB» dentro de Bachillerato es
    // una pareja que no existe, y guardarla desde el panel la dejaba pasar por
    // la puerta de atrás.
    est_grado: gradoValido(est_nivel, String(formData.get("est_grado") ?? ""))
      ? nullable("est_grado")
      : null,
    est_institucion_origen: nullable("est_institucion_origen"),
    anio_ingreso: nullable("anio_ingreso"),
    rep_nombres,
    rep_apellidos,
    rep_relacion: nullable("rep_relacion"),
    rep_correo,
    rep_telefono,
    como_enterado: nullable("como_enterado"),
    comentarios: nullable("comentarios"),
    updated_at: new Date().toISOString(),
  };

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("solicitudes_admision")
    .update(update)
    .eq("id", solicitudId);

  if (error) {
    console.error("[updateDatosSolicitudAction]", error);
    return { error: "No se pudieron guardar los cambios.", ok: false };
  }

  revalidatePath(`/admin/admisiones/${solicitudId}`);
  revalidatePath("/admin/admisiones");
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

/**
 * Registra a mano una solicitud de admisión, sin pasar por el formulario
 * público.
 *
 * Cubre el caso real del colegio: alguien llega por teléfono o en persona. Y en
 * 2do y 3ro de bachillerato el trámite es presencial por norma, así que esas
 * solicitudes **siempre** entran por aquí.
 *
 * Entra al mismo pipeline y toma número del mismo contador atómico que el
 * formulario público, para que no haya dos series de números conviviendo.
 */
export async function crearSolicitudAction(
  _prev: CrearSolicitudState,
  formData: FormData
): Promise<CrearSolicitudState> {
  await assertAdmisiones();

  // Topes de longitud. El único techo que había era el límite del cuerpo de la
  // petición, casi un mega: un nombre de esa longitud revienta la ficha, el
  // CSV y cualquier correo que lo interpole.
  const LARGO = 200;
  const LARGO_TEXTO = 2000;

  const trim = (k: string, max = LARGO) =>
    String(formData.get(k) ?? "").trim().slice(0, max);
  const nullable = (k: string, max = LARGO) => trim(k, max) || null;

  const est_nombres = trim("est_nombres");
  const est_apellidos = trim("est_apellidos");
  const est_nivel = trim("est_nivel");
  const est_grado = trim("est_grado");
  const anio_ingreso = trim("anio_ingreso");
  const rep_nombres = trim("rep_nombres");
  const rep_apellidos = trim("rep_apellidos");
  const rep_correo = trim("rep_correo");
  const rep_telefono = trim("rep_telefono");

  if (!est_nombres) return { error: "Escribe los nombres del estudiante.", ok: false, id: null };
  if (!est_apellidos) return { error: "Escribe los apellidos del estudiante.", ok: false, id: null };
  if (!NIVELES.includes(est_nivel as (typeof NIVELES)[number])) {
    return { error: "Elige el nivel al que aspira.", ok: false, id: null };
  }
  // Año escolar y año lectivo son OBLIGATORIOS aquí, al revés que en el
  // formulario público donde son opcionales. Sin ellos la solicitud nace
  // invisible: no cuenta en Cupos ni en Métricas, y aparece en el aviso de «no
  // aparece en esta pantalla». Quien la registra tiene a la familia delante y
  // puede preguntar; el visitante de la web, no.
  if (!gradoValido(est_nivel, est_grado)) {
    return { error: "Elige el año escolar, y que corresponda al nivel.", ok: false, id: null };
  }
  // El año lectivo se compara contra el catálogo, no solo contra el vacío. Es
  // un desplegable en pantalla, pero la acción es un endpoint como cualquier
  // otro: una cadena con otro formato —«2026-2027 » con espacio, o un guion
  // largo— se guardaría, y como Cupos y Métricas filtran por igualdad exacta,
  // la solicitud desaparecería de las dos. Justo lo que el campo obligatorio
  // venía a evitar.
  const anioNormalizado = anio_ingreso.replace(/[–—]/g, "-");
  const supabase = createAdminClient();
  const { data: anosActivos } = await supabase
    .from("anos_lectivos")
    .select("codigo")
    .eq("activo", true);
  const codigosActivos = (anosActivos ?? []).map((a) => a.codigo as string);
  if (!codigosActivos.includes(anioNormalizado)) {
    return { error: "Elige el año lectivo al que aspira.", ok: false, id: null };
  }
  if (!rep_nombres) return { error: "Escribe los nombres del representante.", ok: false, id: null };
  if (!rep_apellidos) {
    return { error: "Escribe los apellidos del representante.", ok: false, id: null };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rep_correo)) {
    return { error: "El correo del representante no es válido.", ok: false, id: null };
  }
  if (!rep_telefono) {
    return { error: "Escribe el teléfono del representante.", ok: false, id: null };
  }

  // Mismo contador atómico que el formulario público — función SECURITY
  // DEFINER en Postgres. Generar el número aquí a mano crearía duplicados en
  // cuanto dos personas registren a la vez.
  const anoCodigo = String(new Date().getFullYear() % 100).padStart(3, "0");
  const { data: seq, error: seqError } = await supabase.rpc("siguiente_numero_admision", {
    p_ano: anoCodigo,
  });
  if (seqError || typeof seq !== "number") {
    console.error("[crearSolicitudAction] contador:", seqError);
    return { error: "No se pudo generar el número de seguimiento.", ok: false, id: null };
  }
  const numero = `ADM${anoCodigo}-${String(seq).padStart(3, "0")}`;

  const { data: creada, error } = await supabase
    .from("solicitudes_admision")
    .insert({
      numero,
      est_nombres,
      est_apellidos,
      est_fecha_nac: nullable("est_fecha_nac"),
      est_nivel,
      est_grado,
      est_institucion_origen: nullable("est_institucion_origen"),
      anio_ingreso: anioNormalizado,
      rep_nombres,
      rep_apellidos,
      rep_relacion: nullable("rep_relacion"),
      rep_correo,
      rep_telefono,
      como_enterado: nullable("como_enterado"),
      comentarios: nullable("comentarios", LARGO_TEXTO),
      estado: ESTADO_INICIAL,
      // Requiere la migración 083. Sin ella este INSERT falla entero.
      origen: "manual",
    })
    .select("id")
    .single();

  if (error || !creada) {
    console.error("[crearSolicitudAction]", error);
    return { error: "No se pudo registrar la solicitud.", ok: false, id: null };
  }

  // NO se envía ningún correo, y es deliberado: quien registra la solicitud
  // está hablando con la familia en ese momento, así que una confirmación
  // automática sobra o llega a destiempo. Si más adelante hace falta, se añade
  // como casilla opcional — pero por defecto callado.

  revalidatePath("/admin/admisiones");
  revalidatePath("/admin/admisiones/metricas");
  revalidatePath("/admin/admisiones/cupos");
  return { error: null, ok: true, id: creada.id };
}

export async function saveCuposAction(
  _prev: AdmisionActionState,
  formData: FormData
): Promise<AdmisionActionState> {
  const user = await assertAdmisiones();
  const supabase = createAdminClient();

  const anoLectivo = String(formData.get("ano_lectivo") ?? "");
  if (!anoLectivo) return { error: "Año lectivo inválido.", ok: false };

  const limpio = (t: string) => t.replace(/[^a-zA-Z0-9]/g, "_");

  // Detalle por año escolar. Se guarda incluso en cero: una fila en cero dice
  // «este año no tiene cupo», que no es lo mismo que no haberlo configurado, y
  // el colegio necesita poder cerrar un año concreto.
  const filasPorGrado = TODOS_LOS_GRADOS.map(({ nivel, grado }) => {
    const bruto = formData.get(`cupog_${limpio(nivel)}__${limpio(grado)}`);
    const total = Math.max(0, Math.min(999, parseInt(String(bruto ?? "0"), 10) || 0));
    return {
      nivel,
      grado,
      ano_lectivo: anoLectivo,
      cupos_total: total,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    };
  });

  const rows = NIVELES.map((nivel) => {
    const key = `cupos_${nivel.replace(/[^a-zA-Z0-9]/g, "_")}`;
    // Mismo tope que las filas por año: el `max` del input no protege al
    // servidor, que recibe lo que le manden.
    const total = Math.max(0, Math.min(999, parseInt(String(formData.get(key) ?? "0"), 10) || 0));
    return {
      nivel,
      // Cadena vacía = el cupo es del NIVEL entero, sin desglosar por año.
      // Desde la migración 080 la clave primaria incluye el año escolar, así
      // que hay que mandarlo o el upsert no encuentra la fila que actualizar.
      grado: "",
      ano_lectivo: anoLectivo,
      cupos_total: total,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    };
  });

  // El `onConflict` tiene que nombrar la clave única ENTERA. Cuando la 080
  // amplió la primaria a (nivel, grado, ano_lectivo) y esto seguía diciendo
  // (nivel, ano_lectivo), Postgres respondía 42P10 y guardar cupos dejó de
  // funcionar sin que nada más lo delatara: la pantalla lee bien y solo falla
  // al pulsar Guardar.
  const { error } = await supabase.from("cupos_admision").upsert(
    [...rows, ...filasPorGrado],
    { onConflict: "nivel,grado,ano_lectivo" }
  );

  if (error) return { error: "No se pudieron guardar los cupos.", ok: false };

  revalidatePath("/admin/admisiones/cupos");
  return { error: null, ok: true };
}
