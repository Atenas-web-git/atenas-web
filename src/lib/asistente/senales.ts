/**
 * «Señalar el botón» (etapa 2, 2026-09-28).
 *
 * Cuando un paso de la respuesta habla de un control que ESTÁ en la pantalla
 * del usuario, el modelo lo escribe como `[[señalar: Nombre]]` en vez de en
 * negrita. El cliente pinta ese nombre como una etiqueta con un cursor y, al
 * hacer clic, ilumina el control en la pantalla (`senalar.ts`).
 *
 * Aquí, en el servidor, se decide qué señales sobreviven: solo las que
 * coinciden con un botón, pestaña o campo de la estructura que mandó el
 * navegador. Un `[[señalar: …]]` con un nombre que no está en pantalla es el
 * modelo inventando un control —el mismo control fantasma que la regla 1 del
 * prompt le prohíbe— y se degrada a negrita normal, sin cursor, para que el
 * usuario no busque algo que no existe.
 */

import type { EstructuraPantalla } from "./pantalla";

/**
 * Cómo lo escribe el modelo. Tolera «senalar» sin eñe y espacios de más. Sin
 * tope de largo aquí a propósito: una marca que no casara con esta expresión
 * llegaría intacta al cliente, que la pintaría como chip sin validar (lo vio
 * el auditor de seguridad). El tope se aplica dentro, degradando a negrita.
 */
const SENAL_DEL_MODELO = /\[\[\s*se[ñn]alar\s*:\s*([^\]\n]*?)\s*\]\]/gi;
const MAX_LARGO_SENAL = 120;

/** Cómo viaja al cliente, ya validada. Es lo que `AsistenteFlotante` pinta. */
export const SENAL_MARCA = /(\[\[señalar:[^\]\n]+\]\])/g;

export function nombreDeSenal(marca: string): string {
  return marca.replace(/^\[\[señalar:/, "").replace(/\]\]$/, "").trim();
}

/**
 * Deja el nombre como se compara: sin sufijos que añade el lector de pantalla
 * —«(×3)», «(deshabilitado)», «(activa)»—, sin las comillas con que el lector
 * envuelve un placeholder («Buscar por título o ruta…»: el modelo las quita al
 * escribirlo, medido el 2026-09-28), sin el asterisco de obligatorio y sin
 * mayúsculas. Lo usan el servidor y el cliente.
 */
export function normalizarNombre(texto: string): string {
  return texto
    .replace(/\s*\((?:×\d+|deshabilitado|activa)\)\s*$/i, "")
    .replace(/\s*\*\s*$/, "")
    .replace(/^[«"']+|[»"']+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function nombresSenalables(e: EstructuraPantalla | null): Set<string> {
  const nombres = new Set<string>();
  if (!e) return nombres;
  for (const b of e.botones) nombres.add(normalizarNombre(b));
  for (const p of e.pestanas) nombres.add(normalizarNombre(p));
  for (const c of e.campos) nombres.add(normalizarNombre(c.etiqueta));
  nombres.delete("");
  return nombres;
}

export function extraerSenales(
  texto: string,
  estructura: EstructuraPantalla | null
): { texto: string; descartadas: string[] } {
  const nombres = nombresSenalables(estructura);
  const descartadas: string[] = [];

  const limpio = texto
    .replace(SENAL_DEL_MODELO, (_, nombre: string) => {
      const n = nombre.trim();
      if (!n) return "";
      if (n.length <= MAX_LARGO_SENAL && nombres.has(normalizarNombre(n))) {
        return `[[señalar:${n}]]`;
      }
      descartadas.push(n);
      return `**${n}**`;
    })
    // El modelo a veces envuelve la señal en negrita: «**[[señalar:X]]**».
    // Sin esto, el cliente pintaría dos asteriscos sueltos a cada lado.
    .replace(/\*\*(\[\[señalar:[^\]\n]+\]\])\*\*/g, "$1");

  return { texto: limpio, descartadas };
}
