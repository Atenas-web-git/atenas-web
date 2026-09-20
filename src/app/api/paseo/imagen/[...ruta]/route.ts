import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Entrega las fotos del paseo virtual.
 *
 * ## Por qué existe, en vez de enlazar Supabase directo
 *
 * El bucket `paseo` es privado a propósito. Si el navegador fuera a Supabase a
 * por cada cara, cada visita gastaría transferencia de Supabase: el plan
 * gratuito da 5 GB al mes y una visita que recorra diez espacios se lleva unos
 * 6 MB. Son **unas 800 visitas y se acabó** — y al acabarse, el paseo deja de
 * cargar sin más aviso.
 *
 * Pasando por aquí, el CDN del sitio guarda cada archivo y Supabase lo sirve
 * una vez, no una por visitante.
 *
 * ## La caché es de un año, y por eso el camino lleva versión
 *
 * `Cache-Control: immutable` significa que ni el navegador ni el CDN van a
 * volver a preguntar. Reemplazar una foto NO se vería nunca… si el camino fuera
 * siempre el mismo. Por eso las imágenes viven en `<carpeta>/v1/<cara>.webp` y
 * el panel sube la siguiente como `v2`: cambia el camino, cambia la caché.
 *
 * ⚠️ Quien toque esto: si se quita la versión del camino, hay que quitar el
 * `immutable`. Si no, el colegio cambiará una foto, verá «guardado», y seguirá
 * viendo la vieja durante un año sin entender por qué.
 *
 * ## Por qué se consulta la base antes de servir una foto
 *
 * Porque «esconder un espacio» tiene que esconder también su fotografía. El
 * panel dice «Escondido» y la base esconde sus accesos; si aquí no se mirara,
 * la foto seguiría descargable para quien tuviera —o adivinara— la dirección.
 * El día que el colegio esconda un espacio será justamente porque esa foto no
 * debe verse.
 *
 * De paso tapa un agujero de coste: sin esta lista, cualquiera podía inventar
 * direcciones (`/aaa/v1/front.webp`, `/aab/v1/…`) y cada una era una consulta
 * a Supabase. Ahora las inventadas mueren aquí, sin tocar el almacenamiento.
 */

/** `carpeta/v1/cara.webp` y nada más: ni subir de carpeta, ni otros archivos del bucket. */
const CAMINO_VALIDO = /^[a-z0-9_]+\/v[0-9]{1,2}\/(front|right|back|left|top|bottom|thumbnail)\.webp$/;

const BUCKET = "paseo";
const VIDA_LISTA = 60_000;

/**
 * Las carpetas que sí se pueden servir, guardadas un minuto.
 *
 * Sin caché, cada una de las 7 imágenes de cada escena haría su consulta. Con
 * un minuto, esconder un espacio tarda como mucho eso en dejar de servirse —y
 * lo que ya esté en el CDN seguirá ahí hasta que caduque, cosa que hay que
 * decirle al colegio si alguna vez esconde una foto por urgencia.
 */
let lista: { hasta: number; carpetas: Set<string> } | null = null;

async function carpetasPublicadas(): Promise<Set<string> | null> {
  if (lista && lista.hasta > Date.now()) return lista.carpetas;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("paseo_escenas")
    .select("carpeta")
    .eq("publicada", true);

  if (error || !data) {
    console.error("[paseo] no se pudo leer qué escenas están publicadas:", error?.message);
    // Si hay una lista vieja se sigue con ella: es preferible a dejar el paseo
    // en blanco por un tropiezo de la base. Si no hay ninguna, no se inventa.
    return lista?.carpetas ?? null;
  }

  lista = {
    hasta: Date.now() + VIDA_LISTA,
    carpetas: new Set(data.map((d) => d.carpeta as string)),
  };
  return lista.carpetas;
}

function noEncontrado() {
  return new Response("No encontrado", {
    status: 404,
    // Que el CDN absorba las direcciones inventadas en vez de despertar a la
    // función una vez por cada intento.
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ruta: string[] }> }
) {
  const { ruta } = await params;
  const camino = ruta.join("/");

  if (!CAMINO_VALIDO.test(camino)) return noEncontrado();

  const carpeta = camino.split("/")[0];
  const permitidas = await carpetasPublicadas();

  if (!permitidas) {
    // No se sabe qué está publicado: no se sirve nada, y se dice que es un
    // problema del servidor y no que la foto no exista.
    return new Response("No disponible", { status: 503 });
  }
  if (!permitidas.has(carpeta)) return noEncontrado();

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage.from(BUCKET).download(camino);

  if (error || !data) {
    // Una escena publicada cuya foto no está subida es un fallo nuestro, no
    // del visitante: conviene que quede en los registros del servidor.
    console.error("[paseo] no se pudo servir", camino, error?.message);
    return noEncontrado();
  }

  return new Response(data, {
    headers: {
      "Content-Type": "image/webp",
      // Un año en el navegador y en el CDN. Ver el aviso de arriba.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
    },
  });
}
