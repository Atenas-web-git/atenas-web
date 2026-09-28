/**
 * Lee la ESTRUCTURA de la pantalla del panel para el asistente: títulos,
 * pestañas, botones, campos y avisos. Corre en el navegador, sobre el DOM.
 *
 * Lo que NO lee, a propósito:
 * - El valor de ningún campo (`input.value`, `textarea`), ni lo escrito en un
 *   editor. Eso son datos.
 * - El contenido de tablas y listas: ahí van nombres de familias, aspirantes,
 *   empleados. De una fila solo se toman sus BOTONES («Editar», «Eliminar»),
 *   deduplicados y contados, nunca sus enlaces —el enlace de una fila suele
 *   ser el nombre de alguien—.
 * - Nada dentro de `[data-asistente-privado]`: es la marca para los bloques
 *   que pintan datos de personas SIN tabla ni lista (una ficha, un listado
 *   hecho con `div`). La lista de exclusiones por etiqueta HTML falla
 *   abierta; la marca falla cerrada. Lo cazó el auditor de seguridad el
 *   2026-09-27: la lista de detenidos de Métricas y los adjuntos de las
 *   respuestas de formularios se colaban.
 * - Nada del propio panel del asistente.
 *
 * En Admisiones (datos de menores) todavía menos: NI títulos —el título de
 * la ficha de una solicitud es el nombre del aspirante—, NI enlaces, NI
 * avisos, NI el texto de sugerencia de los campos. Solo botones y etiquetas.
 *
 * Los topes están en `lib/asistente/pantalla.ts` y el servidor los vuelve a
 * aplicar (y recorta Admisiones por su cuenta): esto es la primera barrera,
 * no la única.
 */

import {
  LIMITES,
  esRutaDeAdmisiones,
  type CampoPantalla,
  type EstructuraPantalla,
} from "@/lib/asistente/pantalla";

const DENTRO_DE_FILA = "table, tbody, tr, td, li, [role='row'], [role='listitem']";
const PANEL_PROPIO = "[data-asistente-panel]";
const PRIVADO = "[data-asistente-privado]";

const TIPOS: Record<string, string> = {
  text: "texto",
  email: "correo",
  url: "dirección web",
  tel: "teléfono",
  number: "número",
  date: "fecha",
  time: "hora",
  "datetime-local": "fecha y hora",
  file: "archivo",
  checkbox: "casilla",
  radio: "opción",
  password: "contraseña",
  search: "búsqueda",
  color: "color",
  range: "deslizador",
  select: "selector",
  textarea: "área de texto",
};

function limpiar(texto: string | null | undefined, largo: number = LIMITES.largo): string {
  return (texto ?? "").replace(/\s+/g, " ").trim().slice(0, largo);
}

function visible(el: Element): boolean {
  const h = el as HTMLElement;
  if (h.closest(PANEL_PROPIO) || h.closest(PRIVADO)) return false;
  if (h.getAttribute("aria-hidden") === "true") return false;
  const r = h.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
}

/**
 * Texto visible o, para un icono suelto, su aria-label o title. Solo la
 * primera línea: un botón de dos líneas («OpenAI / La cuenta que ya tiene el
 * colegio») se nombra por la primera.
 */
function textoDeControl(el: Element): string {
  const h = el as HTMLElement;
  return (
    limpiar(h.innerText.split("\n")[0]) ||
    limpiar(h.getAttribute("aria-label")) ||
    limpiar(h.getAttribute("title")) ||
    limpiar((h as HTMLInputElement).value)
  );
}

/** Quita el asterisco de obligatorio: «Modelo *» → «Modelo». */
function sinAsterisco(texto: string): string {
  return texto.replace(/\s*\*\s*$/, "").trim();
}

/**
 * La etiqueta de un `<label>`. Si el label ENVUELVE al control, su texto
 * entero incluye el texto de ayuda y hasta las opciones del desplegable; en
 * ese caso se toma solo su primer hijo con texto, que en el panel es siempre
 * la etiqueta. `textContent` y no `innerText`: el segundo devuelve el texto
 * ya en mayúsculas cuando el CSS lo transforma.
 */
function textoDeLabel(label: HTMLLabelElement, control: Element): string {
  if (!label.contains(control)) return sinAsterisco(limpiar(label.textContent));
  for (const hijo of label.children) {
    if (hijo === control || hijo.contains(control)) continue;
    const t = sinAsterisco(limpiar(hijo.textContent));
    if (t) return t;
  }
  return "";
}

type Campo = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * @param conSugerencia si se puede usar el `placeholder` como etiqueta. En
 *   Admisiones no: un diálogo de esa zona pone el número de la solicitud como
 *   sugerencia del campo de confirmación.
 */
function etiquetaDeCampo(campo: Campo, conSugerencia: boolean): string {
  const porLabels = campo.labels?.[0] ? textoDeLabel(campo.labels[0], campo) : "";
  if (porLabels) return porLabels;

  const aria = limpiar(campo.getAttribute("aria-label"));
  if (aria) return aria;

  const labelledBy = campo.getAttribute("aria-labelledby");
  if (labelledBy) {
    const t = limpiar(document.getElementById(labelledBy)?.textContent);
    if (t) return t;
  }

  // Sin etiqueta real, el texto de sugerencia describe al campo mejor que
  // cualquier vecino: «Buscar por apellido…» dice qué es el buscador.
  if (conSugerencia) {
    const placeholder = limpiar(campo.getAttribute("placeholder"));
    if (placeholder) return `«${placeholder}»`;
  }

  // Un selector sin etiqueta se describe por sus primeras opciones (años
  // lectivos, estados, niveles: nunca datos de una persona).
  if (campo.tagName === "SELECT") {
    const opciones = [...(campo as HTMLSelectElement).options]
      .map((o) => limpiar(o.text, 40))
      .filter(Boolean)
      .slice(0, 4);
    if (opciones.length) return `selector con opciones: ${opciones.join(" / ")}`;
  }

  // Muchos campos del panel van envueltos en un bloque cuya primera línea es
  // la etiqueta en mayúsculas pequeñas, sin `<label>` real.
  const bloque = campo.closest(".flex.flex-col");
  const primera = bloque?.querySelector("span, p, strong");
  const t = primera ? sinAsterisco(limpiar(primera.textContent)) : "";
  return t && t.length <= 60 ? t : "";
}

export function leerPantalla(ruta: string): EstructuraPantalla | null {
  if (typeof document === "undefined") return null;

  const admisiones = esRutaDeAdmisiones(ruta);

  const raiz =
    document.querySelector<HTMLElement>("[data-asistente-contenido]") ??
    document.querySelector<HTMLElement>("main") ??
    document.body;

  // --- Títulos --------------------------------------------------------------
  // En Admisiones, ninguno: el <h1> de la ficha es el nombre del aspirante.
  // El título de la pantalla ya lo pone el servidor desde el mapa.
  const titulos: string[] = [];
  if (!admisiones) {
    for (const h of raiz.querySelectorAll("h1, h2, h3")) {
      if (!visible(h) || h.closest(DENTRO_DE_FILA)) continue;
      const t = limpiar((h as HTMLElement).innerText);
      if (t && !titulos.includes(t)) titulos.push(t);
      if (titulos.length >= LIMITES.titulos) break;
    }
  }

  // --- Pestañas -------------------------------------------------------------
  // Hoy ninguna pantalla del panel usa `role="tab"` (las «pestañas» de
  // Admisiones son enlaces y entran como botones). Se deja para cuando alguna
  // lo use; mientras tanto esta lista sale vacía y el manual no la promete.
  const pestanas: string[] = [];
  for (const tab of raiz.querySelectorAll("[role='tab']")) {
    if (!visible(tab)) continue;
    const t = textoDeControl(tab);
    const activa = tab.getAttribute("aria-selected") === "true";
    const texto = activa ? `${t} (activa)` : t;
    if (t && !pestanas.includes(texto)) pestanas.push(texto);
    if (pestanas.length >= LIMITES.pestanas) break;
  }

  // --- Botones --------------------------------------------------------------
  // Fuera de filas: botones y enlaces de acción. Dentro de filas: solo
  // botones, contados. En Admisiones: nunca enlaces, estén donde estén — el
  // enlace a una solicitud lleva el nombre.
  const conteo = new Map<string, number>();
  const controles = raiz.querySelectorAll(
    "button, [role='button'], input[type='submit'], input[type='button'], a[href]"
  );
  for (const c of controles) {
    if (!visible(c)) continue;
    const enFila = !!c.closest(DENTRO_DE_FILA);
    const esEnlace = c.tagName === "A";
    if (esEnlace && (enFila || admisiones)) continue;
    if (c.tagName === "INPUT" && (c as HTMLInputElement).type !== "submit") continue;
    const t = textoDeControl(c);
    if (!t || t.length > LIMITES.largo) continue;
    const deshabilitado =
      (c as HTMLButtonElement).disabled || c.getAttribute("aria-disabled") === "true";
    const clave = deshabilitado ? `${t} (deshabilitado)` : t;
    conteo.set(clave, (conteo.get(clave) ?? 0) + 1);
  }
  const botones = [...conteo.entries()]
    .slice(0, LIMITES.botones)
    .map(([t, n]) => (n > 1 ? `${t} (×${n})` : t));

  // --- Campos ---------------------------------------------------------------
  const campos: CampoPantalla[] = [];
  const vistos = new Set<string>();
  for (const el of raiz.querySelectorAll<Campo>(
    "input:not([type='hidden']):not([type='submit']):not([type='button']), select, textarea"
  )) {
    if (!visible(el) || el.closest(DENTRO_DE_FILA)) continue;
    const etiqueta = etiquetaDeCampo(el, !admisiones);
    if (!etiqueta) continue;
    const tipoBruto = el.tagName === "INPUT" ? (el as HTMLInputElement).type : el.tagName.toLowerCase();
    const tipo = TIPOS[tipoBruto] ?? tipoBruto;
    const clave = `${etiqueta}|${tipo}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);
    campos.push({
      etiqueta,
      tipo,
      ...(el.required ? { obligatorio: true } : {}),
      ...(el.disabled || el.hasAttribute("readonly") ? { deshabilitado: true } : {}),
    });
    if (campos.length >= LIMITES.campos) break;
  }

  // --- Avisos ---------------------------------------------------------------
  // Regiones vivas, campos marcados en error, y los textos en el rojo y el
  // verde de estado del panel —que son los mismos en las 64 pantallas—.
  // En Admisiones, ninguno: un error puede llevar dentro un nombre o un correo.
  const avisos: string[] = [];
  if (!admisiones) {
    const agregar = (texto: string) => {
      const t = limpiar(texto, LIMITES.largoAviso);
      if (t && !avisos.includes(t) && avisos.length < LIMITES.avisos) avisos.push(t);
    };
    for (const el of raiz.querySelectorAll("[role='alert'], [role='status'], [aria-live]")) {
      if (visible(el)) agregar((el as HTMLElement).innerText);
    }
    for (const el of raiz.querySelectorAll("[aria-invalid='true']")) {
      if (visible(el)) {
        const etiqueta = etiquetaDeCampo(el as Campo, true);
        if (etiqueta) agregar(`Campo con error: ${etiqueta}`);
      }
    }
    if (avisos.length < LIMITES.avisos) {
      for (const el of raiz.querySelectorAll<HTMLElement>("span, p")) {
        if (avisos.length >= LIMITES.avisos) break;
        if (!visible(el) || el.closest(DENTRO_DE_FILA)) continue;
        const color = getComputedStyle(el).color;
        // #991B1B (error) y #065F46 (éxito), como los usa todo el panel.
        if (color === "rgb(153, 27, 27)" || color === "rgb(6, 95, 70)") {
          const t = limpiar(el.innerText, LIMITES.largoAviso);
          if (t.length > 2 && t.length <= LIMITES.largoAviso) agregar(t);
        }
      }
    }
  }

  const estructura: EstructuraPantalla = { titulos, pestanas, botones, campos, avisos };
  const vacia =
    titulos.length + pestanas.length + botones.length + campos.length + avisos.length === 0;
  return vacia ? null : estructura;
}
