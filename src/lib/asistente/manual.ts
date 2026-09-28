/**
 * El manual del panel, convertido a texto para el asistente.
 *
 * La documentación de /admin/documentacion vive en código, así que esto se
 * calcula UNA vez por proceso y no toca la base. Cada artículo lleva su
 * identificador entre corchetes —`[paginas#editar-una-pagina]`— y ese es el
 * que el modelo cita al final de su respuesta. `extraerCitas()` convierte
 * cada cita en un enlace al artículo y DESCARTA las que no existen: un
 * artículo inventado sería otro control fantasma, solo que hablado.
 */

import { SECCIONES } from "@/app/admin/(authenticated)/documentacion/contenido";
import type {
  Articulo,
  Bloque,
  Seccion,
} from "@/app/admin/(authenticated)/documentacion/tipos";

const ETIQUETA_NOTA: Record<string, string> = {
  info: "Nota",
  tip: "Consejo",
  aviso: "Atención",
  peligro: "Cuidado",
};

function bloqueATexto(b: Bloque): string {
  switch (b.t) {
    case "p":
      return b.texto;
    case "sub":
      return `#### ${b.texto}`;
    case "pasos":
      return b.items.map((it, i) => `${i + 1}. ${it}`).join("\n");
    case "lista":
      return b.items.map((it) => `- ${it}`).join("\n");
    case "nota":
      return `> **${ETIQUETA_NOTA[b.tono] ?? "Nota"}:** ${b.texto}`;
    case "tabla": {
      const cabecera = `| ${b.encabezados.join(" | ")} |`;
      const separador = `| ${b.encabezados.map(() => "---").join(" | ")} |`;
      const filas = b.filas.map((f) => `| ${f.join(" | ")} |`);
      return [cabecera, separador, ...filas].join("\n");
    }
    case "ruta":
      return `Ruta en el panel: ${b.pasos.join(" › ")}`;
    case "campos":
      return b.items.map((it) => `- **${it.campo}**: ${it.desc}`).join("\n");
    default:
      return "";
  }
}

function articuloATexto(s: Seccion, a: Articulo): string {
  return [`### ${a.titulo}  [${s.slug}#${a.id}]`, a.resumen, ...a.bloques.map(bloqueATexto)]
    .filter((t) => t.trim() !== "")
    .join("\n\n");
}

function seccionATexto(s: Seccion): string {
  return [
    `## ${s.titulo}  [${s.slug}]`,
    `${s.descripcion} Para quién: ${s.paraQuien}.`,
    ...s.articulos.map((a) => articuloATexto(s, a)),
  ].join("\n\n");
}

/** El manual entero, en el orden en que se lee (y se dicta la capacitación). */
export const MANUAL_TEXTO: string = SECCIONES.map(seccionATexto).join("\n\n---\n\n");

export const MANUAL_MEDIDAS = {
  secciones: SECCIONES.length,
  articulos: SECCIONES.reduce((n, s) => n + s.articulos.length, 0),
  caracteres: MANUAL_TEXTO.length,
};

/* ─── Citas ─────────────────────────────────────────────────────── */

export type Cita = {
  /** `seccion#articulo`, o solo `seccion`. */
  clave: string;
  titulo: string;
  seccion: string;
  /** Enlace dentro del panel. */
  href: string;
};

const CITAS = new Map<string, Cita>();
for (const s of SECCIONES) {
  CITAS.set(s.slug, {
    clave: s.slug,
    titulo: s.titulo,
    seccion: s.titulo,
    href: `/admin/documentacion/${s.slug}`,
  });
  for (const a of s.articulos) {
    const clave = `${s.slug}#${a.id}`;
    CITAS.set(clave, {
      clave,
      titulo: a.titulo,
      seccion: s.titulo,
      href: `/admin/documentacion/${s.slug}#${a.id}`,
    });
  }
}

export function resolverCita(clave: string): Cita | null {
  return CITAS.get(clave.trim().toLowerCase()) ?? null;
}

/**
 * Las dos formas en que el modelo escribe una cita. La pedida es
 * `[[doc:seccion#articulo]]`; la segunda —`[seccion#articulo]` a secas— es la
 * que ve en el manual y a veces copia tal cual. Se aceptan las dos. La forma
 * corta exige el `#` para no confundirse con cualquier otro texto entre
 * corchetes, y no puede ir seguida de `(`, que sería un enlace markdown.
 */
const CITA_LARGA = /\[\[\s*doc:\s*([a-z0-9-]+(?:#[a-z0-9-]+)?)\s*\]\]/gi;
const CITA_CORTA = /\[([a-z0-9-]+#[a-z0-9-]+)\](?!\()/gi;

/**
 * Un enlace markdown que no apunte dentro del panel se queda en su texto.
 * El modelo no debería escribir ninguno —la regla se lo prohíbe—, pero lo que
 * ve en pantalla lo escribe cualquiera (el nombre en una solicitud lo pone la
 * familia), y una instrucción colada ahí podría hacerle pintar un enlace de
 * phishing con la autoridad del asistente. El cliente además no pinta enlaces
 * externos; esto es la segunda barrera.
 */
export function neutralizarEnlacesExternos(texto: string): string {
  return texto.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (todo, etiqueta: string, href: string) =>
    href.trim().startsWith("/admin/") ? todo : etiqueta
  );
}

export function extraerCitas(texto: string): {
  texto: string;
  citas: Cita[];
  desconocidas: string[];
} {
  const citas = new Map<string, Cita>();
  const desconocidas: string[] = [];

  const recoger = (_: string, clave: string) => {
    const cita = resolverCita(clave);
    if (cita) citas.set(cita.clave, cita);
    else desconocidas.push(clave);
    return "";
  };

  const limpio = texto
    .replace(CITA_LARGA, recoger)
    .replace(CITA_CORTA, recoger)
    // Lo que queda de una línea que solo tenía citas: «(Fuente: )», un
    // «Fuente:» huérfano al final, paréntesis vacíos y saltos de más.
    .replace(/\(\s*(?:fuente|fuentes|referencia|referencias|manual|ver)?\s*:?\s*\)/gi, "")
    .replace(/^\s*(?:fuente|fuentes|referencia|referencias|manual|ver)\s*:?\s*$/gim, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { texto: limpio, citas: [...citas.values()], desconocidas };
}
