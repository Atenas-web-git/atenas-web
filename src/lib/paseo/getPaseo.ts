import { createClient } from "@supabase/supabase-js";

/**
 * Cliente sin cookies, a propósito.
 *
 * El paseo es público y no depende de quién mire, así que no hace falta leer la
 * sesión. Y leerla tiene un coste: `cookies()` vuelve dinámica la página, y
 * Next la rehace en cada visita en vez de servir una copia. Con esto,
 * `/paseo-virtual` se genera cada 60 segundos y las visitas no tocan la base.
 */
function clientePublico() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

/** Una escena tal como la necesita el visor. Los ángulos van en grados. */
export type EscenaPaseo = {
  slug: string;
  titulo: string;
  descripcion: string | null;
  grupo: string;
  /** Prefijo de las imágenes en el bucket, con su versión ya resuelta. */
  imagenes: string;
  vista: { yaw: number; pitch: number; fov: number };
  puntos: PuntoPaseo[];
};

export type PuntoPaseo = {
  /** Slug de la escena a la que lleva. */
  destino: string;
  yaw: number;
  pitch: number;
  etiqueta: string;
};

type FilaPunto = {
  destino: { slug: string } | null;
  yaw: string | number;
  pitch: string | number;
  etiqueta: string;
  orden: number;
};

type FilaEscena = {
  slug: string;
  titulo: string;
  descripcion: string | null;
  grupo: string;
  carpeta: string;
  version_imagen: number;
  vista_yaw: string | number;
  vista_pitch: string | number;
  vista_fov: string | number;
  paseo_puntos: FilaPunto[];
};

/**
 * Trae el paseo entero: las escenas publicadas con sus accesos.
 *
 * Son 63 escenas y 229 puntos, unos 40 KB de JSON. Se piden de una vez porque
 * el visor necesita el mapa completo desde el primer momento: los puntos de la
 * escena en la que estás llevan a escenas que todavía no has abierto, y pedirlas
 * de una en una convertiría cada salto en una espera.
 *
 * ⚠️ Las columnas `numeric` de Postgres llegan como **cadena** por PostgREST.
 * Si se pasan tal cual al visor, los ángulos se interpretan como 0 y todos los
 * puntos aparecen apilados al frente. Por eso el `Number()` de abajo, que no es
 * decorativo.
 */
export async function getPaseo(): Promise<EscenaPaseo[]> {
  try {
    const supabase = clientePublico();
    const { data, error } = await supabase
      .from("paseo_escenas")
      .select(
        `slug, titulo, descripcion, grupo, carpeta, version_imagen,
         vista_yaw, vista_pitch, vista_fov,
         paseo_puntos!paseo_puntos_escena_id_fkey (
           yaw, pitch, etiqueta, orden,
           destino:destino_id ( slug )
         )`
      )
      .order("orden_grupo")
      .order("orden");

    if (error || !data) {
      console.error("[paseo] no se pudo leer el paseo:", error?.message);
      return [];
    }

    return (data as unknown as FilaEscena[]).map((e) => ({
      slug: e.slug,
      titulo: e.titulo,
      descripcion: e.descripcion,
      grupo: e.grupo,
      imagenes: `/api/paseo/imagen/${e.carpeta}/v${e.version_imagen}`,
      vista: {
        yaw: Number(e.vista_yaw),
        pitch: Number(e.vista_pitch),
        fov: Number(e.vista_fov),
      },
      puntos: (e.paseo_puntos ?? [])
        .filter((p) => p.destino)
        .sort((a, b) => a.orden - b.orden)
        .map((p) => ({
          destino: p.destino!.slug,
          yaw: Number(p.yaw),
          pitch: Number(p.pitch),
          etiqueta: p.etiqueta,
        })),
    }));
  } catch (e) {
    console.error("[paseo] error inesperado:", e);
    return [];
  }
}
