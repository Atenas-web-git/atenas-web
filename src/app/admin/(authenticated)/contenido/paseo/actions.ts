"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export type PaseoActionState = { error: string | null; ok: boolean };

/**
 * Deja el texto en texto: sin etiquetas, sin `<` ni `>`.
 *
 * **Esto no es celo de más.** El visor construye el globo de cada acceso
 * pegando cadenas y lo mete con `innerHTML`; su propio código llama `html` al
 * parámetro. O sea que el nombre de un espacio se interpreta como HTML en la
 * página pública, y un `<img src=x onerror=…>` escrito aquí se ejecutaría en
 * el navegador de cualquier familia que pase el dedo por un acceso.
 *
 * Y como el panel y el sitio comparten dominio, ese código correría con la
 * sesión de quien lo mire: un superadministrador abriendo el paseo le entrega
 * el panel entero.
 *
 * No hace falta mala fe de secretaría: basta una contraseña robada o un texto
 * pegado de otra web. Encontrado por el auditor de seguridad el 2026-09-20,
 * antes de desplegar.
 */
function soloTexto(valor: string): string {
  return valor
    .replace(/<[^>]*>/g, "") // etiquetas completas
    .replace(/[<>]/g, "")    // y los signos sueltos, por si quedó una a medias
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Quién puede tocar el paseo: el superadministrador y comunicaciones, que es
 * el equipo de marketing. Es el mismo corte que tienen las políticas de la
 * base (migración 089): si aquí se ampliara y allá no, la pantalla dejaría
 * guardar y la base lo rechazaría sin explicar por qué.
 */
async function assertEditor() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    throw new Error("No autorizado");
  }
  return user;
}

function revalidar(slug?: string) {
  revalidatePath("/admin/contenido/paseo");
  if (slug) revalidatePath(`/admin/contenido/paseo/${slug}`);
  revalidatePath("/paseo-virtual");
}

export async function guardarEscenaAction(
  _prev: PaseoActionState,
  formData: FormData
): Promise<PaseoActionState> {
  await assertEditor();

  const slug = String(formData.get("slug") ?? "").trim();
  const titulo = soloTexto(String(formData.get("titulo") ?? ""));
  const descripcion = soloTexto(String(formData.get("descripcion") ?? ""));
  const grupo = String(formData.get("grupo") ?? "").trim();
  const ordenRaw = String(formData.get("orden") ?? "").trim();

  if (!slug) return { error: "Falta la escena.", ok: false };
  if (!titulo) return { error: "El nombre del espacio no puede quedar vacío.", ok: false };
  if (titulo.length > 80) return { error: "El nombre no puede pasar de 80 caracteres.", ok: false };
  if (descripcion.length > 400) {
    return { error: "La descripción no puede pasar de 400 caracteres.", ok: false };
  }

  const orden = Number(ordenRaw);
  if (!Number.isInteger(orden) || orden < 1 || orden > 99) {
    return { error: "El orden tiene que ser un número entre 1 y 99.", ok: false };
  }

  const supabase = createAdminClient();

  // La lista de zonas del formulario viene del navegador y se puede cambiar
  // desde ahí. Se comprueba contra las zonas que existen de verdad: inventar
  // una crearía un grupo fantasma en el menú del paseo que nadie pidió.
  const { data: zonas } = await supabase.from("paseo_escenas").select("grupo");
  const validas = new Set((zonas ?? []).map((z) => z.grupo as string));
  if (!grupo || !validas.has(grupo)) {
    return { error: "Elige una de las zonas que ya existen.", ok: false };
  }

  const { error } = await supabase
    .from("paseo_escenas")
    .update({
      titulo,
      descripcion: descripcion || null,
      grupo,
      orden,
    })
    .eq("slug", slug);

  if (error) {
    // El mensaje de Postgres va al registro, no a la pantalla: a quien edita
    // no le sirve «violates check constraint» y además cuenta de más.
    console.error("[paseo] no se pudo guardar la escena", slug, error.message);
    return { error: "No se pudo guardar. Inténtalo otra vez; si sigue igual, avísanos.", ok: false };
  }

  revalidar(slug);
  return { error: null, ok: true };
}

/**
 * Publica o esconde un espacio.
 *
 * Esconder una escena **no borra nada**, pero sí la saca del recorrido: los
 * accesos que llevaban a ella dejan de verse porque la política de la base
 * solo muestra los puntos de escenas publicadas. Por eso la pantalla avisa de
 * cuántos accesos se van a quedar sin destino antes de esconderla.
 */
export async function publicarEscenaAction(
  _prev: PaseoActionState,
  formData: FormData
): Promise<PaseoActionState> {
  await assertEditor();

  const slug = String(formData.get("slug") ?? "").trim();
  const publicada = formData.get("publicada") === "1";
  if (!slug) return { error: "Falta la escena.", ok: false };

  const supabase = createAdminClient();

  // Un paseo sin ninguna escena publicada es una página en blanco. Se avisa
  // en vez de dejar al colegio delante de un agujero negro.
  if (!publicada) {
    const { count } = await supabase
      .from("paseo_escenas")
      .select("id", { count: "exact", head: true })
      .eq("publicada", true);

    if ((count ?? 0) <= 1) {
      return {
        error: "Es el único espacio publicado: si lo escondes, el paseo se queda vacío.",
        ok: false,
      };
    }
  }

  const { error } = await supabase
    .from("paseo_escenas")
    .update({ publicada })
    .eq("slug", slug);

  if (error) {
    console.error("[paseo] no se pudo publicar/esconder", slug, error.message);
    return { error: "No se pudo guardar. Inténtalo otra vez; si sigue igual, avísanos.", ok: false };
  }

  revalidar(slug);
  return { error: null, ok: true };
}

// ───────────────────────────────────────────────────────────
// REEMPLAZAR LA FOTOGRAFÍA DE UN ESPACIO
//
// La conversión de la foto 360° a las seis caras del cubo ocurre en el
// navegador de quien la sube (ver `lib/paseo/caras.ts`): son 25 millones de
// píxeles y una función de servidor se corta antes de terminar.
//
// Y las caras viajan del navegador a Supabase **directamente**, con permisos de
// un solo uso que firma el servidor. Si pasaran por aquí, chocarían con el tope
// de 4,5 MB por petición de Vercel.
//
// El orden importa: primero se suben los siete archivos de la versión nueva y
// solo al final se cambia el número de versión de la escena. Así, si la subida
// se corta a medias, el paseo sigue mostrando la foto anterior en vez de
// quedarse con medio cubo.
// ───────────────────────────────────────────────────────────

const ARCHIVOS = [
  "front.webp",
  "right.webp",
  "back.webp",
  "left.webp",
  "top.webp",
  "bottom.webp",
  "thumbnail.webp",
] as const;

export type PermisosSubida = {
  error: string | null;
  version?: number;
  /** Un permiso de subida por archivo: camino dentro del bucket y vale-de-un-uso. */
  permisos?: { archivo: string; camino: string; token: string }[];
};

export async function pedirSubidaFotoAction(slug: string): Promise<PermisosSubida> {
  await assertEditor();

  const supabase = createAdminClient();
  const { data: escena, error } = await supabase
    .from("paseo_escenas")
    .select("carpeta, version_imagen")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !escena) return { error: "No se encontró el espacio." };

  const version = escena.version_imagen + 1;
  const permisos: { archivo: string; camino: string; token: string }[] = [];

  for (const archivo of ARCHIVOS) {
    const camino = `${escena.carpeta}/v${version}/${archivo}`;
    const { data, error: fallo } = await supabase.storage
      .from("paseo")
      .createSignedUploadUrl(camino);

    if (fallo || !data) {
      console.error("[paseo] no se pudo firmar la subida", camino, fallo?.message);
      return { error: "No se pudo preparar la subida. Inténtalo otra vez." };
    }
    permisos.push({ archivo, camino, token: data.token });
  }

  return { error: null, version, permisos };
}

export async function confirmarFotoAction(
  slug: string,
  version: number
): Promise<PaseoActionState> {
  await assertEditor();

  if (!Number.isInteger(version) || version < 2) {
    return { error: "Versión de imagen no válida.", ok: false };
  }

  const supabase = createAdminClient();
  const { data: escena } = await supabase
    .from("paseo_escenas")
    .select("carpeta, version_imagen")
    .eq("slug", slug)
    .maybeSingle();

  if (!escena) return { error: "No se encontró el espacio.", ok: false };

  // Se comprueba que estén LOS SIETE antes de dar el cambio por bueno. Sin
  // esto, una subida a medias dejaría el espacio con caras de dos fotos
  // distintas: el visor no avisa, simplemente pinta un cubo imposible.
  const { data: subidos, error: fallo } = await supabase.storage
    .from("paseo")
    .list(`${escena.carpeta}/v${version}`, { limit: 20 });

  if (fallo) {
    console.error("[paseo] no se pudo comprobar la subida", fallo.message);
    return { error: "No se pudo comprobar la subida. Inténtalo otra vez.", ok: false };
  }

  const nombres = new Set((subidos ?? []).map((o) => o.name));
  const faltan = ARCHIVOS.filter((a) => !nombres.has(a));
  if (faltan.length > 0) {
    return {
      error: `La subida quedó incompleta (faltan ${faltan.length} de 7 archivos). No se cambió la foto; vuelve a intentarlo.`,
      ok: false,
    };
  }

  const { error: alGuardar } = await supabase
    .from("paseo_escenas")
    .update({ version_imagen: version })
    .eq("slug", slug);

  if (alGuardar) {
    console.error("[paseo] no se pudo cambiar la versión", slug, alGuardar.message);
    return { error: "No se pudo guardar. Inténtalo otra vez.", ok: false };
  }

  // La versión anterior NO se borra: puede seguir viva en la caché del sitio
  // durante un año, y borrarla dejaría huecos en quien la tenga a medio cargar.
  // Son ~1,2 MB por escena reemplazada; si algún día molesta, se limpia aparte.
  revalidar(slug);
  return { error: null, ok: true };
}
