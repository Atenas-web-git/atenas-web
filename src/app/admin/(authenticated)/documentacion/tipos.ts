/**
 * Modelo de contenido de la documentación interna del panel.
 *
 * La documentación vive en código (no en base de datos) a propósito:
 * describe cómo funciona el panel, así que cambia solo cuando cambia
 * el panel. Editarla es editar `contenido.ts`.
 */

export type Tono = "info" | "tip" | "aviso" | "peligro";

export type Bloque =
  /** Párrafo. Admite **negrita**, `código` y [texto](url). */
  | { t: "p"; texto: string }
  /** Subtítulo dentro de un artículo. */
  | { t: "sub"; texto: string }
  /** Pasos numerados: la secuencia exacta a seguir en el panel. */
  | { t: "pasos"; items: string[] }
  /** Lista con viñetas. */
  | { t: "lista"; items: string[] }
  /** Recuadro destacado. */
  | { t: "nota"; tono: Tono; texto: string }
  /** Tabla simple. */
  | { t: "tabla"; encabezados: string[]; filas: string[][] }
  /** Ruta de navegación dentro del panel, ej. Contenido › Páginas. */
  | { t: "ruta"; pasos: string[] }
  /** Par campo → qué hace. Para documentar formularios largos. */
  | { t: "campos"; items: { campo: string; desc: string }[] };

export type Articulo = {
  /** Ancla de la URL: /admin/documentacion/<seccion>#<id> */
  id: string;
  titulo: string;
  /** Una línea que resume el artículo. Se usa en el buscador. */
  resumen: string;
  bloques: Bloque[];
};

export type Seccion = {
  slug: string;
  titulo: string;
  descripcion: string;
  /** Nombre del icono de lucide-react, resuelto en ICONOS. */
  icono: string;
  /** Quién necesita leer esta sección. Solo informativo. */
  paraQuien: string;
  articulos: Articulo[];
};
