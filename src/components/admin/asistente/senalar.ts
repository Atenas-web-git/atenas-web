/**
 * «Señalar el botón»: ilumina en la pantalla el control del que habla la
 * respuesta. Corre en el navegador.
 *
 * Busca por el mismo texto con el que `leerPantalla.ts` describió el control
 * —si el asistente lo nombró así es porque así lo leyó— y lo marca con
 * `data-asistente-senal`, que `admin-ds.css` pinta con un contorno que late
 * tres veces. No hace clic ni cambia nada: guía, no actúa.
 *
 * Si el control ya no está (el usuario cambió de pantalla, cerró el diálogo),
 * devuelve `null` y la etiqueta de la respuesta lo dice.
 */

import { normalizarNombre } from "@/lib/asistente/senales";
import { textoDeControl, textoDeLabel, visible } from "./leerPantalla";

const CONTROLES =
  "button, [role='button'], [role='tab'], a[href], input[type='submit'], label";

const DURACION_MS = 3200;
let temporizador: ReturnType<typeof setTimeout> | null = null;

export function buscarControl(nombre: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const objetivo = normalizarNombre(nombre);
  if (!objetivo) return null;

  const raiz =
    document.querySelector<HTMLElement>("[data-asistente-contenido]") ??
    document.querySelector<HTMLElement>("main") ??
    document.body;

  for (const el of raiz.querySelectorAll<HTMLElement>(CONTROLES)) {
    if (!visible(el)) continue;
    const texto =
      el.tagName === "LABEL"
        ? textoDeLabel(el as HTMLLabelElement, (el as HTMLLabelElement).control)
        : textoDeControl(el);
    if (normalizarNombre(texto) === objetivo) return el;
  }

  // Un campo etiquetado solo por `aria-label` o por su placeholder (el
  // buscador de casi todos los listados) no tiene `<label>` que iluminar: se
  // ilumina el propio campo.
  for (const el of raiz.querySelectorAll<HTMLElement>("input, select, textarea")) {
    if (!visible(el)) continue;
    if (normalizarNombre(el.getAttribute("aria-label") ?? "") === objetivo) return el;
    if (normalizarNombre(el.getAttribute("placeholder") ?? "") === objetivo) return el;
  }
  return null;
}

export function iluminar(el: HTMLElement): void {
  apagar();
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.setAttribute("data-asistente-senal", "");
  temporizador = setTimeout(apagar, DURACION_MS);
}

export function apagar(): void {
  if (temporizador) clearTimeout(temporizador);
  temporizador = null;
  if (typeof document === "undefined") return;
  for (const el of document.querySelectorAll("[data-asistente-senal]")) {
    el.removeAttribute("data-asistente-senal");
  }
}
