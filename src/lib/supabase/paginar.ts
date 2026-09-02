/**
 * Trae TODAS las filas de una consulta, en bloques.
 *
 * ## Por qué hace falta
 *
 * PostgREST corta en 1.000 filas y responde **200**. No hay error, no hay
 * excepción, no hay pantalla rota: la consulta devuelve menos filas de las que
 * hay y nada lo dice. Es el modo de fallo que este proyecto lleva persiguiendo
 * toda la semana — algo que parece funcionar y calla lo que se dejó fuera.
 *
 * El dashboard de Métricas ya lo resolvía con una copia local de este bucle.
 * Esto lo saca a un sitio, porque son seis las consultas que lo necesitan y una
 * copia por consulta es cómo se separan.
 *
 * ## `completa` no es decorativo
 *
 * Se devuelve junto a las filas, y **hay que mirarlo** cuando la respuesta se
 * usa para decidir qué borrar. Una lista incompleta de «lo que sí está en uso»
 * convierte todo lo que falta en candidato a borrarse: ahí un truncamiento
 * silencioso no encoge un número, destruye archivos. Ver `purgarHuerfanos.ts`.
 *
 * Para un número en pantalla o un Excel, `completa: false` es una advertencia
 * que conviene registrar; para un borrado, es una orden de abortar.
 *
 * ## Cómo se para el bucle
 *
 * Cuando un bloque vuelve **vacío**, nunca cuando vuelve más corto de lo pedido.
 * El tope real lo configura Supabase y no lo controla nadie de aquí: si fuera
 * menor que `bloque`, todos los bloques llegarían cortos y parar por eso sería
 * truncar otra vez, que es justo lo que esta función existe para evitar.
 */

/** Filas por viaje. Coincide con el tope de PostgREST por defecto. */
const BLOQUE = 1000;

/**
 * Tope de vueltas: 100 × 1.000 = 100.000 filas.
 *
 * Es una red contra un bucle infinito si el servidor devolviera siempre datos,
 * no un límite de negocio. Al alcanzarlo se devuelve `completa: false`, nunca
 * un resultado que aparente estar entero.
 */
const MAX_VUELTAS = 100;

export type ResultadoPaginado<T> = {
  filas: T[];
  /** `false` si se cortó por error o por llegar al tope de vueltas. */
  completa: boolean;
  motivo?: string;
};

/**
 * @param pedirBloque recibe el rango [desde, hasta] **inclusive**, tal como lo
 *   espera `.range()` de Supabase, y debe devolver la consulta ya construida.
 *
 * La consulta **tiene que llevar `.order()` por una columna estable y única**.
 * Sin orden, cada página devuelve un subconjunto arbitrario y entre una y la
 * siguiente se pierden y se repiten filas. Con `created_at` a secas no basta si
 * dos filas comparten milisegundo: conviene desempatar por `id`.
 */
export async function traerTodas<T>(
  pedirBloque: (
    desde: number,
    hasta: number
  ) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  opciones: { bloque?: number; maxVueltas?: number } = {}
): Promise<ResultadoPaginado<T>> {
  const bloque = opciones.bloque ?? BLOQUE;
  const maxVueltas = opciones.maxVueltas ?? MAX_VUELTAS;
  const filas: T[] = [];

  for (let vuelta = 0; vuelta < maxVueltas; vuelta++) {
    const { data, error } = await pedirBloque(
      filas.length,
      filas.length + bloque - 1
    );

    if (error) {
      return { filas, completa: false, motivo: error.message };
    }
    if (!data || data.length === 0) {
      return { filas, completa: true };
    }
    filas.push(...data);
  }

  return {
    filas,
    completa: false,
    motivo: `se alcanzaron las ${maxVueltas} vueltas (${filas.length} filas) sin llegar al final`,
  };
}
