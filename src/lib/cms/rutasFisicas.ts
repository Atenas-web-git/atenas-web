/**
 * ⚠️ ESTE MÓDULO YA NO BLOQUEA NADA. Se conserva vacío a propósito, y lo que
 * queda es el aviso — que es lo único que sigue siendo verdad.
 *
 * ## Qué había aquí
 *
 * Una lista de las páginas con archivo propio en `src/app/`. El bloque de
 * formulario lo pintaba solo `PlantillaRenderer`, y a ese solo lo usa el
 * catch-all `src/app/[...slug]/page.tsx`: las páginas con maquetación propia no
 * pasan por ahí, así que asignarles un formulario desde el editor no hacía
 * absolutamente nada.
 *
 * De 53 páginas, 44 no funcionaban, y el selector se ofrecía en todas. Esta
 * lista existía para tapar ese agujero: escondía el selector donde no servía.
 *
 * ## Qué cambió el 2026-09-02
 *
 * Las **30 páginas con archivo propio montan ahora `<BloqueFormulario />`**, así
 * que las 54 del panel admiten formulario y el bloqueo sobraba. Comprobado
 * cruzando los slugs de la tabla `paginas` con los archivos reales: 30 con
 * archivo propio y bloque, 24 por el catch-all, **0 sin cobertura**.
 *
 * ## LO QUE HAY QUE RECORDAR AL AÑADIR UNA PÁGINA CON ARCHIVO PROPIO
 *
 * Poner `<BloqueFormulario formularioId={pagina?.formulario_id ?? null} />`
 * antes del `<FooterCTA />`, y asegurarse de que la página llama a
 * `getPagina(<slug>)`.
 *
 * Si se olvida, no falla nada visible: el selector se ofrece igual en el panel,
 * el colegio elige un formulario, guarda, y no pasa nada. Es exactamente la
 * trampa que este módulo vino a tapar en su día, y la única forma de que
 * vuelva.
 *
 * Para comprobar la cobertura, cruzar los slugs de `paginas` con los archivos:
 *
 *   select slug from paginas order by slug;
 *   -- y por cada uno, si existe src/app/<slug>/page.tsx, que contenga
 *   -- "BloqueFormulario"
 */

/**
 * Vacía desde el 2026-09-02. Ya no la lee nadie; se deja declarada para que
 * quien busque «RUTAS_FISICAS» encuentre esta explicación en vez de un archivo
 * borrado y una duda.
 */
export const RUTAS_FISICAS = new Set<string>([]);
