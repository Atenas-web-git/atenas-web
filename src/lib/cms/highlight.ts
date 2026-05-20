/**
 * Resolución del "texto resaltado" (subrayado dorado) de los títulos del CMS.
 *
 * Convivían dos mecanismos:
 *   - Sintaxis de llaves `{palabra}` dentro del propio título.
 *   - Campo separado `headingHighlight` / `subtitleHighlight` con la palabra
 *     suelta, que el render localizaba con `titulo.split(palabra)`.
 *
 * El `split` exigía coincidencia EXACTA (mayúsculas, tildes y espacios). Si
 * el cliente escribía la palabra con una mayúscula distinta, una tilde, un
 * espacio sobrante o entre llaves, no había coincidencia y el subrayado
 * simplemente no se dibujaba, sin ningún error visible.
 *
 * `splitHighlight` unifica ambos mecanismos y hace la búsqueda tolerante:
 * ignora mayúsculas/minúsculas y tildes, y acepta llaves. Es una función
 * pura (sin imports server-only) para poder usarla tanto en los componentes
 * de render del frontend como en la vista previa de los editores del admin.
 */

export type HighlightParts = {
  /** Texto antes de la palabra resaltada. */
  before: string;
  /** La palabra resaltada, tal cual aparece en el título original. */
  match: string;
  /** Texto después de la palabra resaltada. */
  after: string;
};

/** Rango Unicode de marcas diacríticas combinantes (tildes, acentos). */
const DIACRITICS = /[̀-ͯ]/g;

/**
 * Normaliza un carácter: lo descompone (NFD), le quita las marcas
 * diacríticas (tildes) y lo pasa a minúscula. Devuelve la cadena
 * normalizada de ese único carácter (normalmente 1 carácter).
 */
function normalizeChar(ch: string): string {
  return ch.normalize("NFD").replace(DIACRITICS, "").toLowerCase();
}

/**
 * Construye una versión normalizada de `text` junto a un mapa que, para
 * cada índice del texto normalizado, indica el índice del carácter
 * original que lo produjo. Permite buscar de forma tolerante y luego
 * recortar sobre el texto ORIGINAL (preservando mayúsculas y tildes).
 */
function buildNormMap(text: string): { norm: string; map: number[] } {
  let norm = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const n = normalizeChar(text[i]);
    for (let j = 0; j < n.length; j++) {
      norm += n[j];
      map.push(i);
    }
  }
  return { norm, map };
}

/**
 * Localiza la parte resaltada de un título.
 *
 * @param text       Título completo.
 * @param highlight  Palabra/frase a resaltar (campo separado del editor).
 *                   Puede venir con llaves o espacios sobrantes.
 *
 * Reglas:
 *  1. Si el título trae sintaxis de llaves `{palabra}`, esa es la fuente
 *     de verdad (compatibilidad con el mecanismo antiguo de `HighlightText`).
 *  2. Si no, se busca `highlight` dentro del título: primero exacto y, si
 *     falla, de forma tolerante (sin mayúsculas ni tildes).
 *
 * Devuelve `null` si no hay nada que resaltar.
 */
export function splitHighlight(
  text: string,
  highlight?: string | null
): HighlightParts | null {
  if (!text) return null;

  // 1. Llaves dentro del propio título.
  const brace = text.match(/^(.*?)\{(.+?)\}(.*)$/);
  if (brace) {
    return { before: brace[1], match: brace[2], after: brace[3] };
  }

  // 2. Campo `highlight` separado — limpiamos llaves y espacios sobrantes.
  const needle = (highlight ?? "").replace(/[{}]/g, "").trim();
  if (!needle) return null;

  // 2a. Coincidencia exacta.
  const exactIdx = text.indexOf(needle);
  if (exactIdx !== -1) {
    return {
      before: text.slice(0, exactIdx),
      match: text.slice(exactIdx, exactIdx + needle.length),
      after: text.slice(exactIdx + needle.length),
    };
  }

  // 2b. Coincidencia tolerante (ignora mayúsculas y tildes).
  const t = buildNormMap(text);
  const n = buildNormMap(needle).norm;
  if (!n) return null;
  const idx = t.norm.indexOf(n);
  if (idx === -1) return null;

  const startOrig = t.map[idx];
  const endOrig = t.map[idx + n.length - 1];
  return {
    before: text.slice(0, startOrig),
    match: text.slice(startOrig, endOrig + 1),
    after: text.slice(endOrig + 1),
  };
}
