/**
 * El filtro del listado de solicitudes, en un solo sitio.
 *
 * La pantalla y la exportación tienen que traer **lo mismo**. Cuando cada una
 * armaba su consulta, la exportación se dejó el buscador: secretaría escribía
 * un apellido, veía tres filas y se descargaba el padrón entero de aspirantes
 * —con fechas de nacimiento y teléfonos de las familias— creyendo que llevaba
 * tres. No fallaba nada: el archivo se descarga y parece correcto.
 *
 * Se comparte la función en vez de copiar el predicado a propósito. Duplicarlo
 * es exactamente lo que ya rompió el conteo de cupos: dos sitios calculando lo
 * mismo con reglas que se separan sin que nadie lo note.
 */

export type FiltroSolicitudes = {
  /** `"todas"` o vacío no filtran. */
  estado?: string | null;
  nivel?: string | null;
  /** Texto libre del buscador. */
  q?: string | null;
};

/**
 * Lo que hay que quitarle al texto antes de meterlo en un `or()`.
 *
 * PostgREST lee ese parámetro como una lista separada por comas de
 * `columna.operador.valor`, así que una coma o un paréntesis dentro del texto
 * **no se buscan: se interpretan**. Buscar `a,estado.eq.admitido` cambiaba el
 * filtro en vez de no encontrar nada.
 *
 * No es escalada de privilegios —quien busca ya puede ver estas solicitudes—
 * pero es una consulta que hace algo distinto de lo que la pantalla enseña, y
 * eso es justo lo que este proyecto lleva toda la semana persiguiendo.
 */
const ROMPE_LA_CONSULTA = /[,()"\\\u0000-\u001F]/g;

/**
 * Y los comodines, que no rompen la consulta pero la ensanchan.
 *
 * Dentro de un `ilike`, `%` casa con cualquier cosa y `_` con un carácter;
 * PostgREST además acepta `*` como alias de `%`. Medido el 2026-08-19: buscar
 * un solo `%`, un `*` o un `_` devolvía **todas** las solicitudes, y buscar
 * `M%r` también. Quien teclea un guion bajo por error se lleva el padrón
 * entero creyendo que ha filtrado.
 *
 * Se quitan en vez de escaparse: nadie busca a una familia por un porcentaje,
 * y escapar en `ilike` a través de PostgREST tiene su propia letra pequeña.
 */
const COMODINES = /[%_*]/g;

/** Los tres campos por los que busca el buscador del panel. */
const CAMPOS_BUSCABLES = ["numero", "est_nombres", "est_apellidos"];

/**
 * El uuid que ninguna solicitud tiene, para decir «ninguna».
 *
 * Va contra la clave primaria a propósito: es lo único de la fila que no puede
 * escribir nadie de fuera.
 */
const UUID_IMPOSIBLE = "00000000-0000-0000-0000-000000000000";

/**
 * Aplica estado, nivel y búsqueda a una consulta de `solicitudes_admision`.
 *
 * Genérico sobre lo que necesita —`eq` y `or`— para no arrastrar el tipo del
 * cliente de Supabase, que en este proyecto va sin `Database` y acabaría en
 * `any`.
 */
export function filtrarSolicitudes<
  T extends { eq(columna: string, valor: string): T; or(filtro: string): T },
>(consulta: T, f: FiltroSolicitudes): T {
  let q = consulta;

  if (f.estado && f.estado !== "todas") q = q.eq("estado", f.estado);
  if (f.nivel) q = q.eq("est_nivel", f.nivel);

  const escrito = (f.q ?? "").trim();
  const texto = escrito
    .replace(ROMPE_LA_CONSULTA, "")
    .replace(COMODINES, "")
    .trim();

  if (texto) {
    q = q.or(CAMPOS_BUSCABLES.map((c) => `${c}.ilike.%${texto}%`).join(","));
  } else if (escrito) {
    /*
      Escribió algo y no quedó nada buscable: solo comodines o puntuación.
      Devolver «ninguna» y no «todas».

      Quitar los comodines sin más dejaba el filtro sin aplicar, así que teclear
      un guion bajo por error mostraba el padrón entero con el buscador lleno,
      como si eso fuera el resultado. Y desde aquí sale también el archivo: es
      justo la confusión que este módulo existe para impedir.

      Se compara la CLAVE contra un uuid que no existe, y no `numero` contra
      cadena vacía como estaba primero. Parecía equivalente y no lo es: la
      migración 084 deja a `anon` insertar solicitudes por REST y su `WITH
      CHECK` solo mira `origen` y `estado`, así que nadie impide plantar una
      fila con el número en blanco. Esa fila sería el único resultado que vería
      secretaría cada vez que el buscador se queda sin texto —y la única que
      saldría en el archivo—. Depender del contenido de una fila para decir
      «ninguna» es depender de que nadie escriba esa fila.
    */
    q = q.eq("id", UUID_IMPOSIBLE);
  }

  return q;
}
