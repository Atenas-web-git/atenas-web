/**
 * Cómo se cuentan las plazas de un año lectivo.
 *
 * Vive aquí, y no repetido en cada pantalla, porque la pantalla de años
 * lectivos y el guardia que impide borrarlos **tienen que decir lo mismo**.
 * Cuando no lo decían, un año con cupos configurados solo por año escolar se
 * enseñaba como «0 cupos» con la papelera habilitada, y al pulsarla el
 * servidor la rechazaba diciendo que tenía cupos. Ninguna de las dos mentía
 * sola: cada una sumaba un conjunto distinto de filas.
 *
 * Desde la migración 080, `cupos_admision` guarda dos clases de fila para el
 * mismo año lectivo:
 *
 *   - `grado = ""`  → el cupo del NIVEL entero.
 *   - `grado = "…"` → el desglose por año escolar dentro de ese nivel.
 *
 * **No son sumables.** Sumarlas todas cuenta las mismas plazas dos veces: si
 * Inicial tiene 20 y su detalle dice 10 y 10, el año no tiene 40 plazas.
 */

/** Una fila de `cupos_admision`, con lo mínimo para contar. */
export type FilaDeCupo = {
  nivel: string;
  grado: string | null;
  cupos_total: number | null;
};

/**
 * Las plazas de un año lectivo.
 *
 * La regla es «el nivel manda, y si no está puesto, se mira su detalle»: para
 * cada nivel se toma su fila de nivel, y solo cuando esa vale cero se suman
 * sus años escolares. Así el número nunca se infla, y nunca sale cero cuando
 * hay algo configurado — que es justo lo que hacía discrepar a las dos
 * pantallas.
 *
 * Se agrupa por nivel, así que las filas tienen que traerlo.
 */
export function contarPlazas(filas: FilaDeCupo[]): number {
  const porNivel = new Map<string, { nivel: number; detalle: number }>();

  for (const f of filas) {
    const total = f.cupos_total ?? 0;
    const acc = porNivel.get(f.nivel) ?? { nivel: 0, detalle: 0 };
    if ((f.grado ?? "") === "") acc.nivel += total;
    else acc.detalle += total;
    porNivel.set(f.nivel, acc);
  }

  let plazas = 0;
  for (const { nivel, detalle } of porNivel.values()) {
    plazas += nivel > 0 ? nivel : detalle;
  }
  return plazas;
}
