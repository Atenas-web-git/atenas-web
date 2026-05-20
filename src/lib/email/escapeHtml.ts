/**
 * Helpers de escape para HTML de correos.
 *
 * Los endpoints de formularios públicos (contactos, quejas, trabaja)
 * arman el HTML del correo interno interpolando datos que escribió el
 * usuario. Aunque es un correo interno (lo abre el equipo del colegio en
 * su cliente de correo, que no ejecuta scripts), escapar es higiene
 * básica: evita que un `<` rompa el layout del correo y que un enlace
 * con protocolo raro (`javascript:`, `data:`) llegue a un `href`.
 */

/** Escapa caracteres HTML peligrosos de un valor de texto. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitiza una URL para usarla en un `href`. Solo admite http(s) y
 * mailto. Cualquier otro protocolo (javascript:, data:, etc.) devuelve
 * cadena vacía.
 */
export function safeHref(value: unknown): string {
  const url = String(value ?? "").trim();
  if (/^https?:\/\//i.test(url) || /^mailto:/i.test(url)) {
    return escapeHtml(url);
  }
  return "";
}
