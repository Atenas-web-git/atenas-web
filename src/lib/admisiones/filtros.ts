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
 * Puntuación que se le quita al texto buscado.
 *
 * **Esto nació por el `or()`, que ya no se usa aquí.** PostgREST leía ese
 * parámetro como una lista separada por comas de `columna.operador.valor`, así
 * que una coma o un paréntesis dentro del texto no se buscaban: se
 * interpretaban. Buscar `a,estado.eq.admitido` cambiaba el filtro en vez de no
 * encontrar nada.
 *
 * Desde que se busca con `ilike()` encadenados —cada uno viaja como parámetro
 * propio— esa vía está cerrada por construcción. El saneado se mantiene igual
 * por dos motivos: nadie busca a una familia por un paréntesis, y si algún día
 * alguien vuelve a montar un `or()` aquí, el agujero no reaparece con él.
 *
 * Lo que ya NO se puede decir es que esto sea lo único que lo impide.
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

/**
 * La columna contra la que se busca: número, nombres y apellidos juntos, sin
 * tildes y en minúsculas. La mantiene Postgres (migración 086).
 *
 * Antes se buscaba en las tres columnas por separado con un `or()`, y eso
 * fallaba de dos formas:
 *
 *   «Perez»       → no encontraba a «Pérez», porque `ilike` compara carácter a
 *                   carácter y no sabe que `e` y `é` son la misma letra.
 *   «Maria Perez» → no encontraba nada, porque ninguna columna por separado
 *                   contiene el nombre Y el apellido.
 */
const COLUMNA_BUSQUEDA = "busqueda";

/**
 * Quita las tildes del texto tecleado, para compararlo con la columna que ya
 * viene sin ellas.
 *
 * NFD separa la letra de su acento y luego se descartan los acentos sueltos.
 * Sirve igual para «Perez» que para «Pérez»: los dos acaban en `perez`.
 *
 * ⚠️ LA EÑE TAMBIÉN CAE: «Ñuñez» acaba en `nunez`. No es un descuido, es lo que
 * hace falta — el `unaccent` de Postgres que rellena la columna `busqueda`
 * convierte la ñ en n igual, así que los dos lados tienen que coincidir. El
 * efecto para el colegio es bueno: quien teclee «Nunez» encuentra a «Núñez».
 *
 * ⚠️ Y de ahí sale el riesgo real de este módulo: **son dos implementaciones
 * distintas normalizando lo mismo**, JavaScript de un lado y Postgres del otro.
 * Si difieren en algún carácter, la búsqueda no encuentra y no avisa.
 *
 * La comprobación está al final de la migración 086 y hay que ejecutarla al
 * aplicarla: compara lo que produce cada lado sobre los apellidos con tilde y
 * con eñe que de verdad aparecen aquí. Mientras no se haya corrido, esto es una
 * suposición razonable, no un hecho medido.
 */
function sinTildes(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

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
  T extends {
    eq(columna: string, valor: string): T;
    ilike(columna: string, patron: string): T;
  },
>(consulta: T, f: FiltroSolicitudes): T {
  let q = consulta;

  if (f.estado && f.estado !== "todas") q = q.eq("estado", f.estado);
  if (f.nivel) q = q.eq("est_nivel", f.nivel);

  const escrito = (f.q ?? "").trim();
  const texto = sinTildes(
    escrito.replace(ROMPE_LA_CONSULTA, "").replace(COMODINES, "")
  ).trim();

  // Cada palabra por separado, todas obligatorias. Encadenar `ilike` es un AND,
  // así que «maria perez» exige las dos y encuentra a María José Pérez Romero
  // aunque estén en columnas distintas y en otro orden.
  const palabras = texto.split(/\s+/).filter(Boolean);

  if (palabras.length > 0) {
    for (const palabra of palabras) {
      q = q.ilike(COLUMNA_BUSQUEDA, `%${palabra}%`);
    }
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
