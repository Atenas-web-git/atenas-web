"use server";

/**
 * Acciones del constructor de formularios.
 *
 * AUTORIZACIÓN: cada acción llama a su guard por su cuenta. No hay
 * envoltorio compartido que lo garantice, así que una acción nueva que se
 * olvide del guard queda abierta a cualquier usuario con sesión en el panel.
 * Es la primera cosa que hay que revisar al añadir algo aquí.
 *
 * Hay tres guards y NO son intercambiables (migración 079):
 *   · `assertEditor()`      — solo dice que la persona entra en la sección.
 *   · `assertFormulario(id)` — además, que ese formulario es de su área.
 *   · `assertRespuesta(id)`  — lo mismo, partiendo de UNA respuesta.
 *
 * `assertEditor()` a secas basta únicamente cuando la acción no toca ningún
 * formulario concreto. En cuanto hay un id de por medio, usar el guard
 * general deja que Talento Humano abra la bandeja de contactos con solo
 * cambiar el id de la URL.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import {
  puedeCrearFormularios,
  puedeVerFormularios,
  areasVisibles,
  normalizarArea,
} from "@/lib/auth/areas";
import { getFormularioParaPanel } from "@/lib/formularios/getFormulario";
import { CORREO_PURPOSES, type CorreoPurpose } from "@/lib/cms/correos";
import {
  ESTADOS_RESPUESTA,
  type CampoFormulario,
  type EstadoRespuesta,
} from "@/lib/formularios/tipos";
import { validarDefinicion } from "@/lib/formularios/validar";
import {
  TIPOS_PLANTILLA_FORMULARIO,
  type TipoPlantillaFormulario,
} from "../plantillas-formularios/constants";

export type FormularioActionState = { error: string | null; ok: boolean };

const SLUG_REGEX = /^[a-z0-9-]+$/;
const BUCKET = "formularios-archivos";

/** Entra en la sección. No dice nada sobre QUÉ formulario puede tocar. */
async function assertEditor() {
  const user = await getCurrentUser();
  if (!user || !puedeVerFormularios(user)) {
    throw new Error("No autorizado");
  }
  return user;
}

/** El formulario existe y es de un área que este usuario tiene asignada. */
async function assertFormulario(id: string) {
  const user = await assertEditor();
  const formulario = await getFormularioParaPanel(id, user);
  if (!formulario) throw new Error("No autorizado");
  return { user, formulario };
}

/**
 * Igual, pero partiendo de una respuesta.
 *
 * El `formulario_id` que viaja en el formulario HTML no sirve para decidir:
 * lo pone el navegador y se puede cambiar. Hay que preguntarle a la base de
 * qué formulario es realmente esa respuesta.
 */
async function assertRespuesta(respuestaId: string) {
  const user = await assertEditor();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("formulario_respuestas")
    .select("id, formulario_id, formularios!inner(area)")
    .eq("id", respuestaId)
    .maybeSingle();

  if (error || !data) throw new Error("No autorizado");

  const fila = data as unknown as {
    formulario_id: string;
    formularios: { area: string } | { area: string }[];
  };
  const rel = Array.isArray(fila.formularios) ? fila.formularios[0] : fila.formularios;

  if (!areasVisibles(user).includes(normalizarArea(rel?.area))) {
    console.error(
      `[formularios] ${user.email} intentó tocar la respuesta ${respuestaId}, ` +
        `del área ${rel?.area}, que su rol no cubre.`
    );
    throw new Error("No autorizado");
  }
  return { user, formularioId: fila.formulario_id };
}

function revalidar(id?: string) {
  revalidatePath("/admin/contenido/formularios");
  if (id) {
    revalidatePath(`/admin/contenido/formularios/${id}`);
    revalidatePath(`/admin/contenido/formularios/${id}/respuestas`);
  }
}

function presetSeguro(valor: string): CorreoPurpose {
  return CORREO_PURPOSES.includes(valor as CorreoPurpose)
    ? (valor as CorreoPurpose)
    : "contactos";
}

/**
 * La plantilla de correo asociada. Vacío es válido: significa que el
 * formulario usa el texto de confirmación escrito aquí mismo en vez de una
 * plantilla con diseño.
 */
function plantillaSegura(valor: string): string | null {
  const limpio = valor.trim();
  if (!limpio) return null;
  return TIPOS_PLANTILLA_FORMULARIO.includes(limpio as TipoPlantillaFormulario)
    ? limpio
    : null;
}

/** Los correos de notificación llegan como una lista separada por comas. */
function parsearCorreos(bruto: string): string[] {
  return bruto
    .split(/[,;\n]/)
    .map((c) => c.trim())
    .filter((c) => c.includes("@"));
}

// ───────────────────────────────────────────────────────────
// Crear
// ───────────────────────────────────────────────────────────

export async function crearFormularioAction(
  _prev: FormularioActionState,
  formData: FormData
): Promise<FormularioActionState> {
  const user = await getCurrentUser();
  // Talento Humano administra el formulario de postulación que ya existe,
  // pero no crea formularios nuevos: habría que decidir a qué área van.
  if (!puedeCrearFormularios(user)) throw new Error("No autorizado");

  const nombre = String(formData.get("nombre") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (!nombre) return { error: "Ponle un nombre al formulario.", ok: false };
  if (!slug) return { error: "La dirección del formulario es obligatoria.", ok: false };
  if (!SLUG_REGEX.test(slug)) {
    return {
      error:
        "La dirección solo puede llevar minúsculas, números y guiones. Por ejemplo: postulacion-docentes.",
      ok: false,
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("formularios")
    .insert({
      nombre,
      slug,
      titulo: nombre,
      // Un formulario sin campos no se puede guardar desde el editor, pero sí
      // se crea vacío: los campos se añaden en el paso siguiente.
      campos: [],
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un formulario con esa dirección.", ok: false };
    }
    return { error: error.message, ok: false };
  }

  revalidar();
  redirect(`/admin/contenido/formularios/${data.id}`);
}

// ───────────────────────────────────────────────────────────
// Guardar
// ───────────────────────────────────────────────────────────

export async function guardarFormularioAction(
  _prev: FormularioActionState,
  formData: FormData
): Promise<FormularioActionState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Falta el identificador del formulario.", ok: false };

  const { user } = await assertFormulario(id);

  const nombre = String(formData.get("nombre") ?? "").trim();
  if (!nombre) return { error: "Ponle un nombre al formulario.", ok: false };

  // Los campos viajan serializados desde el constructor.
  let campos: CampoFormulario[];
  try {
    const bruto = JSON.parse(String(formData.get("campos") ?? "[]"));
    if (!Array.isArray(bruto)) throw new Error("no es una lista");
    campos = bruto as CampoFormulario[];
  } catch {
    return { error: "No se pudieron leer los campos del formulario.", ok: false };
  }

  const problema = validarDefinicion(campos);
  if (problema) return { error: problema, ok: false };

  const campoCorreo = String(formData.get("campo_correo") ?? "").trim();
  const confirmacionActiva = formData.get("confirmacion_activa") === "on";

  // Una confirmación sin saber a dónde enviarla no avisa a nadie y no deja
  // ningún rastro de que no lo hizo.
  if (confirmacionActiva && !campoCorreo) {
    return {
      error:
        "Para enviar confirmación hace falta indicar cuál de los campos es el correo de quien responde.",
      ok: false,
    };
  }
  // Tiene que existir Y ser de tipo correo. Comprobar solo que exista deja una
  // puerta abierta: bastaba con elegir el campo de correo, cambiarlo después a
  // «Texto corto» y volver a guardar. Ese campo ya no valida su contenido, y
  // como el destinatario se parte por comas, quien rellenara el formulario
  // podría hacer que el colegio enviara correos a una lista suya.
  if (campoCorreo) {
    const elegido = campos.find((c) => c.key === campoCorreo);
    if (!elegido) {
      return {
        error: "El campo de correo elegido ya no existe en el formulario.",
        ok: false,
      };
    }
    if (elegido.tipo !== "correo") {
      return {
        error: `«${elegido.etiqueta}» no es una pregunta de tipo correo electrónico. Elige una que sí lo sea.`,
        ok: false,
      };
    }
  }

  const notificarA = parsearCorreos(String(formData.get("notificar_a") ?? ""));

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("formularios")
    .update({
      nombre,
      // OJO: aquí NO se toca `descripcion_interna`. Se leía del formulario, y no
    // existe ningún control con ese nombre en todo el panel, así que el primer
    // guardado de cualquier formulario la ponía a null y se llevaba por delante
    // lo que sembraron las migraciones 075 y 077.
      titulo: String(formData.get("titulo") ?? "").trim() || null,
      subtitulo: String(formData.get("subtitulo") ?? "").trim() || null,
      texto_boton: String(formData.get("texto_boton") ?? "").trim() || "Enviar",
      titulo_exito: String(formData.get("titulo_exito") ?? "").trim() || "Recibido",
      texto_exito:
        String(formData.get("texto_exito") ?? "").trim() ||
        "Gracias. Hemos recibido tu información y te contactaremos.",
      aviso_legal: String(formData.get("aviso_legal") ?? "").trim() || null,
      campos,
      notificar_a: notificarA,
      asunto: String(formData.get("asunto") ?? "").trim() || null,
      preset_correo: presetSeguro(String(formData.get("preset_correo") ?? "")),
      plantilla_correo: plantillaSegura(String(formData.get("plantilla_correo") ?? "")),
      campo_correo: campoCorreo || null,
      confirmacion_activa: confirmacionActiva,
      /*
        El asunto y el cuerpo solo se escriben cuando la confirmación está
        encendida, porque solo entonces existen en la pantalla.

        Con la casilla apagada, sus dos campos se desmontan y no llegan aquí.
        Escribirlos igual los ponía a `null`: quien desmarcaba «Enviar
        confirmación» y guardaba perdía el correo que había redactado, y al
        volver a encenderla salían vacíos. Peor aún, el motor cae a un texto
        genérico y el correo sigue saliendo, así que nadie se entera.

        Apagar una función no es motivo para borrar lo que hay dentro.
      */
      ...(confirmacionActiva
        ? {
            confirmacion_asunto:
              String(formData.get("confirmacion_asunto") ?? "").trim() || null,
            confirmacion_cuerpo:
              String(formData.get("confirmacion_cuerpo") ?? "").trim() || null,
          }
        : {}),
      activo: formData.get("activo") === "on",
      updated_by: user.id,
    })
    .eq("id", id);

  if (error) return { error: error.message, ok: false };

  revalidar(id);
  // Las páginas que llevan este formulario tienen que volver a generarse.
  revalidatePath("/", "layout");
  return { error: null, ok: true };
}

// ───────────────────────────────────────────────────────────
// Borrar
// ───────────────────────────────────────────────────────────

/**
 * Solo se pueden borrar formularios SIN respuestas. La clave foránea es
 * RESTRICT, así que la base también lo impide; esto es para dar un mensaje
 * entendible en vez de un error de Postgres.
 *
 * Para retirar un formulario que ya recibió respuestas se desactiva: deja de
 * verse en el sitio y las respuestas se conservan.
 */
export async function borrarFormularioAction(id: string): Promise<void> {
  await assertFormulario(id);

  const supabase = createAdminClient();

  const { count } = await supabase
    .from("formulario_respuestas")
    .select("id", { count: "exact", head: true })
    .eq("formulario_id", id);

  if ((count ?? 0) > 0) {
    throw new Error(
      "Este formulario ya tiene respuestas guardadas. Desactívalo en vez de borrarlo."
    );
  }

  // Quitarlo de las páginas que lo usaran; la columna es SET NULL, pero
  // hacerlo explícito permite revalidarlas.
  await supabase
    .from("paginas")
    .update({ formulario_id: null })
    .eq("formulario_id", id);

  const { error } = await supabase.from("formularios").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidar();
  revalidatePath("/", "layout");
  redirect("/admin/contenido/formularios");
}

// ───────────────────────────────────────────────────────────
// Respuestas
// ───────────────────────────────────────────────────────────

export async function cambiarEstadoRespuestaAction(
  formData: FormData
): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const estado = String(formData.get("estado") ?? "").trim();

  if (!id || !ESTADOS_RESPUESTA.includes(estado as EstadoRespuesta)) return;

  const { user, formularioId } = await assertRespuesta(id);

  const supabase = createAdminClient();
  await supabase
    .from("formulario_respuestas")
    .update({ estado, updated_by: user.id })
    .eq("id", id);

  revalidar(formularioId);
}

export async function guardarNotaRespuestaAction(
  formData: FormData
): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { user, formularioId } = await assertRespuesta(id);

  const supabase = createAdminClient();
  await supabase
    .from("formulario_respuestas")
    .update({
      nota_interna: String(formData.get("nota_interna") ?? "").trim() || null,
      updated_by: user.id,
    })
    .eq("id", id);

  revalidar(formularioId);
}

/**
 * Borra una respuesta y sus archivos, de verdad.
 *
 * Hace falta por ley, no por comodidad: la LOPDP reconoce el derecho de
 * supresión, y estos formularios recogen cédula, fecha de nacimiento y
 * condición de discapacidad —categoría especial—. Marcar la respuesta como
 * «descartada» no borra nada; si alguien pide que le eliminen sus datos, el
 * colegio tiene que poder hacerlo.
 *
 * Los archivos del bucket se borran primero: si se borrara la fila antes, sus
 * rutas se perderían y los archivos quedarían para siempre sin nada que los
 * referencie.
 */
export async function borrarRespuestaAction(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const { formularioId } = await assertRespuesta(id);

  const supabase = createAdminClient();

  const { data: respuesta } = await supabase
    .from("formulario_respuestas")
    .select("archivos")
    .eq("id", id)
    .maybeSingle();

  const rutas = Array.isArray(respuesta?.archivos)
    ? (respuesta.archivos as { storage_path?: string }[])
        .map((a) => a?.storage_path)
        .filter((r): r is string => typeof r === "string" && r.length > 0)
    : [];

  if (rutas.length > 0) {
    const { error } = await supabase.storage.from(BUCKET).remove(rutas);
    if (error) {
      // Se avisa pero no se detiene: dejar la respuesta sin borrar por un
      // fallo del almacenamiento impediría atender la solicitud de supresión.
      console.error(
        "[formularios] no se pudieron borrar los adjuntos:",
        error.message
      );
    }
  }

  const { error } = await supabase
    .from("formulario_respuestas")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidar(formularioId);
}

/**
 * Enlace temporal para descargar un adjunto.
 *
 * El bucket es privado a propósito: son hojas de vida y audios de personas
 * reales. Una URL firmada caduca sola, así que si el enlace se reenvía por
 * error deja de servir. Una hora es de sobra para descargarlo.
 */
export async function urlFirmadaAdjuntoAction(
  storagePath: string
): Promise<string | null> {
  const user = await assertEditor();

  // La ruta llega desde el navegador, así que se comprueba antes de usarla.
  //
  // No es paranoia: el cliente de Storage concatena bucket y ruta en una URL,
  // y el navegador —o `fetch`— resuelve los `..` ANTES de enviar la petición.
  // Una ruta como «../admisiones-adjuntos/solicitudes/…» acabaría firmando un
  // archivo de OTRO bucket, y la petición va con service_role, que se salta
  // las políticas. Un editor de contenidos podría así descargar documentos de
  // aspirantes menores de edad, que su rol no debe ver.
  //
  // El formato válido es exactamente el que genera el endpoint de envío:
  // «<slug-del-formulario>/<uuid>_<nombre>».
  if (!/^[a-z0-9-]+\/[A-Za-z0-9._-]+$/.test(storagePath)) {
    console.error(
      "[formularios] se rechazó una ruta de adjunto con formato inesperado:",
      storagePath
    );
    return null;
  }

  const supabase = createAdminClient();

  // El formato válido basta para que la ruta no se escape del bucket, pero no
  // dice de QUIÉN es el archivo. La primera carpeta es el slug del
  // formulario, así que se comprueba su área: sin esto, Talento Humano podría
  // firmar un adjunto de admisiones escribiendo la ruta a mano, y la petición
  // va con service_role, que se salta las políticas del bucket.
  const slugFormulario = storagePath.split("/")[0];
  const { data: dueno } = await supabase
    .from("formularios")
    .select("area")
    .eq("slug", slugFormulario)
    .maybeSingle();

  if (
    !dueno ||
    !areasVisibles(user).includes(normalizarArea((dueno as { area: string }).area))
  ) {
    console.error(
      `[formularios] ${user.email} pidió firmar "${storagePath}", de un ` +
        `formulario que su rol no cubre.`
    );
    return null;
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 60);

  if (error) {
    console.error("[formularios] no se pudo firmar el adjunto:", error.message);
    return null;
  }
  return data?.signedUrl ?? null;
}
