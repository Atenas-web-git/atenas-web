/**
 * Limpieza del HTML que el panel publica en el sitio.
 *
 * Varios campos del CMS guardan HTML enriquecido —lo que produce el editor de
 * texto— y el sitio lo pintaba tal cual con `dangerouslySetInnerHTML`, sin
 * comprobar qué llevaba dentro. Quien tuviera una cuenta de editor podía
 * escribir código en un campo de texto y ese código se ejecutaba en el
 * navegador de CUALQUIER visitante.
 *
 * No hacía falta ser un desconocido: hace falta una cuenta. El riesgo real no
 * es que secretaría escriba un script a mala fe, es que **le roben la
 * contraseña** o que alguien **pegue contenido copiado de otra web** sin saber
 * lo que arrastra. Lo segundo pasa más de lo que parece.
 *
 * ── Dónde se aplica ────────────────────────────────────────────────────────
 *
 * DENTRO de cada componente que pinta HTML, justo antes de
 * `dangerouslySetInnerHTML`, y NO en las 14 páginas que los usan. Sanear en
 * cada sitio de uso es precisamente lo que se olvida al añadir el sitio
 * número quince.
 *
 * Se limpia AL MOSTRAR y no solo al guardar, a propósito: así queda cubierto
 * también todo lo que ya está guardado en la base desde antes.
 *
 * Lo que cuesta esta decisión, para que no haya que redescubrirlo: los seis
 * componentes son de cliente y dos cuelgan del layout raíz, así que `xss`
 * (~30 KB) entra en el bundle compartido de las 63 páginas aunque no haya
 * ninguna notificación activa. La alternativa era sanear en la capa de datos
 * del servidor —`getNotificaciones`, `getPagina`—, que también es un solo
 * sitio. Se eligió el componente porque es el punto por el que pasa TODO lo
 * que se pinta, venga de donde venga; si el coste llegara a molestar, mover
 * el saneado al servidor es el cambio a hacer, no quitarlo.
 *
 * ── Por qué `xss` y no DOMPurify ───────────────────────────────────────────
 *
 * Los componentes que pintan este HTML son de cliente, pero Next los renderiza
 * también en el servidor, y un `<script>` que llega en el HTML inicial se
 * ejecuta igual. Hace falta limpiar en los dos lados. DOMPurify necesita un
 * DOM, así que en el servidor arrastra jsdom y su coste de arranque en Vercel.
 * `xss` es JavaScript puro y funciona igual en ambos.
 */

import { filterXSS, type IFilterXSSOptions } from "xss";

/**
 * Lo que el editor del panel puede producir (TipTap StarterKit + Link).
 *
 * Hoy el contenido guardado solo usa `p`, `ul`, `li` y `strong`; el resto está
 * para que el colegio no se encuentre con que una negrita o un título
 * desaparecen al usarlos por primera vez.
 *
 * NO están, y es deliberado: `img`, `iframe`, `style`, `script`, `form` y
 * cualquier etiqueta que cargue algo de fuera. Las imágenes del sitio se
 * suben por la galería, no se pegan en un campo de texto.
 */
const ETIQUETAS_PERMITIDAS: IFilterXSSOptions["whiteList"] = {
  p: [],
  br: [],
  strong: [],
  b: [],
  em: [],
  i: [],
  u: [],
  s: [],
  ul: [],
  ol: [],
  li: [],
  h2: [],
  h3: [],
  h4: [],
  blockquote: [],
  code: [],
  pre: [],
  hr: [],
  // `rel` NO está a propósito: TipTap ya emite `rel="noopener"` por su cuenta y
  // aquí se añade otro, así que salían dos. El navegador se queda con el
  // primero y `noreferrer` no llegaba a aplicarse nunca. Dejándolo fuera de la
  // lista, el del editor se descarta y solo queda el que pone `onTagAttr`.
  a: ["href", "title", "target"],
};

/** `javascript:` en un href ejecuta código con un clic. Solo esquemas normales. */
export const ESQUEMAS_DE_ENLACE = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

/**
 * Para los enlaces que NO vienen dentro de HTML: los `cta_url` que el panel
 * guarda como campo suelto y que algún componente mete en `window.location` o
 * en un `href`.
 *
 * `window.location.href = "javascript:…"` ejecuta, sin React de por medio y
 * sin aviso. Es el mismo agujero que `sanearHtml` cierra dentro de un `<a>`,
 * pero por la puerta de al lado.
 *
 * Devuelve `null` si la dirección no es utilizable, para que quien llame
 * decida si esconde el botón o no hace nada.
 */
export function urlSegura(url: string | null | undefined): string | null {
  if (!url) return null;
  const limpia = url.trim();
  return ESQUEMAS_DE_ENLACE.test(limpia) ? limpia : null;
}

const OPCIONES: IFilterXSSOptions = {
  whiteList: ETIQUETAS_PERMITIDAS,
  // Una etiqueta que no está en la lista se QUITA, en vez de escaparse. Por
  // defecto `xss` la escapa, que es igual de seguro pero deja al visitante
  // viendo `<img src=x onerror=...>` como texto en mitad del párrafo: parece
  // un error del colegio.
  stripIgnoreTag: true,
  // Y en estas, además, se tira el contenido. Sin esto,
  // `<script>alert(1)</script>` deja el texto «alert(1)» suelto en la página.
  stripIgnoreTagBody: ["script", "style", "iframe", "object", "embed", "form"],

  onTagAttr(tag, nombre, valor) {
    if (tag === "a" && nombre === "href") {
      if (!ESQUEMAS_DE_ENLACE.test(valor.trim())) return "";
      return `href="${valor.replace(/"/g, "&quot;")}"`;
    }
    // Un enlace que abre en otra pestaña sin `rel` deja a la página de destino
    // manipular la nuestra desde `window.opener`.
    if (tag === "a" && nombre === "target") return 'target="_blank" rel="noopener noreferrer"';
    return undefined; // el resto lo decide la lista blanca
  },
};

/**
 * Devuelve el HTML sin nada ejecutable, listo para `dangerouslySetInnerHTML`.
 *
 * Acepta `null` y `undefined` porque casi todos los campos del CMS son
 * opcionales y así no hay que comprobarlo en cada componente.
 */
export function sanearHtml(html: string | null | undefined): string {
  if (!html) return "";
  return filterXSS(html, OPCIONES);
}

/**
 * Para meter datos del CMS dentro de una etiqueta `<script>` —los bloques
 * JSON-LD de SEO—.
 *
 * `JSON.stringify` no protege aquí: un título de página que contenga
 * `</script>` cierra la etiqueta y lo que venga después se ejecuta. Escapar
 * el `<` como `<` es JSON válido y ya no puede cerrar nada.
 */
export function jsonParaScript(valor: unknown): string {
  return JSON.stringify(valor).replace(/</g, "\\u003c");
}
