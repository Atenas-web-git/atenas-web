/**
 * Las capturas de pantalla que el usuario pega en el asistente (etapa 2,
 * 2026-09-28). Este archivo no importa nada del navegador ni del servidor: lo
 * comparten el cliente —que reduce la imagen antes de mandarla— y la ruta
 * `/api/asistente`, que la valida otra vez.
 *
 * Una captura es el único dato «libre» que viaja al proveedor: lo que salga
 * en ella, sale del panel. Por eso:
 *
 * - En las pantallas que pintan datos de familias, aspirantes o personas que
 *   rellenaron un formulario no se acepta ninguna, ni en el cliente ni en el
 *   servidor (`capturasBloqueadas`). Una captura son píxeles: las defensas del
 *   lector de pantalla —saltar tablas, `data-asistente-privado`— no le sirven
 *   de nada. El mismo criterio que con el pixel de Meta.
 * - En el resto del panel la decisión es de quien pega: el manual le pide que
 *   mire qué sale antes de pegar, y el prompt le prohíbe al modelo transcribir
 *   nombres, correos o teléfonos que vea.
 * - El bloqueo va por la pantalla en la que se pega, no por lo que muestra la
 *   imagen: nada impide capturar en Admisiones y pegar en Contenido. El manual
 *   lo dice sin rodeos.
 */

/**
 * Dónde NO se aceptan capturas. Lo comparten el cliente (no adjunta, esconde
 * el botón) y el servidor (400 aunque la manden). Es el ÚNICO interruptor: una
 * pantalla nueva con datos de personas se añade aquí, no con otra comprobación.
 *
 * - `/admin` (el Inicio): pinta las cinco últimas solicitudes con nombre,
 *   apellidos y nivel del aspirante. Lo cazó el auditor de seguridad el
 *   2026-09-28: la pantalla por la que todo el mundo entra.
 * - `/admin/admisiones*`: todo son datos de menores.
 * - Las respuestas de los formularios del sitio: cédulas, datos de salud, lo
 *   que cada familia escribió.
 * - El registro de descargas (`/admin/usuarios/descargas`): pinta los filtros
 *   de cada exportación, y el filtro de búsqueda es lo que se tecleó —el
 *   apellido o la cédula de un aspirante—. Lo cazó el auditor de cierre.
 *
 * Decidido que NO se bloquea: `/admin/usuarios` (nombres y correos del
 * personal, que ya se los saben entre ellos) y el resto del panel. Si el
 * colegio pide más, se añade aquí.
 */
export function capturasBloqueadas(ruta: string): boolean {
  const r = ruta.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  if (r === "/admin") return true;
  if (r === "/admin/admisiones" || r.startsWith("/admin/admisiones/")) return true;
  if (/^\/admin\/contenido\/formularios\/[^/]+\/respuestas(\/|$)/.test(r)) return true;
  if (r === "/admin/usuarios/descargas") return true;
  return false;
}

export const AVISO_SIN_CAPTURAS =
  "En esta pantalla no se pueden adjuntar capturas: muestra datos de personas. Describe lo que ves, sin nombres.";

/**
 * Tope del base64 de UNA captura. El cliente la reduce a JPEG de 1600 px de
 * lado y suele quedar por debajo de 400 KB; esto es la barrera para cualquier
 * otro cliente. Vercel corta el cuerpo de la petición en 4,5 MB (patrón #14
 * del motor de formularios): con este tope, el JSON entero queda muy lejos.
 */
export const MAX_CAPTURA_BASE64 = 1_800_000;

export type Captura = { mediaType: string; base64: string };

/** Solo JPEG, PNG y WebP: lo que produce una captura y lo que aceptan los tres proveedores. */
const DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/;

/**
 * Valida lo que mandó el navegador. Devuelve `null` si no venía captura, la
 * captura si es válida, o el motivo si no lo es (para responder 400 y que un
 * cliente distinto al nuestro sepa por qué).
 */
export function validarCaptura(
  raw: unknown
): { captura: Captura } | { error: string } | null {
  if (raw === undefined || raw === null || raw === "") return null;
  if (typeof raw !== "string") return { error: "La captura debe ser una data URL de imagen." };
  if (raw.length > MAX_CAPTURA_BASE64 + 40) {
    return { error: "La captura es demasiado grande. Recórtala a la parte que importa." };
  }
  const m = DATA_URL.exec(raw);
  if (!m) return { error: "La captura debe ser JPEG, PNG o WebP en base64." };
  return { captura: { mediaType: m[1], base64: m[2] } };
}
