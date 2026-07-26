import type { Seccion } from "../tipos";
import { PRIMEROS_PASOS, ROLES_SECCION } from "./basico";
import { EDITOR, PAGINAS } from "./paginas";
import { NOTIFICACIONES, CRONOGRAMA, DOCUMENTOS, RECONOCIMIENTOS, GALERIA } from "./modulos";
import { ADMISIONES, CORREOS } from "./admisiones";
import { CONFIGURACION, USUARIOS } from "./ajustes";
import { PRACTICAS, GLOSARIO } from "./cierre";

/** Orden en el que se recorre la documentación. Es también el orden sugerido de la capacitación. */
export const SECCIONES: Seccion[] = [
  PRIMEROS_PASOS,
  ROLES_SECCION,
  EDITOR,
  PAGINAS,
  NOTIFICACIONES,
  CRONOGRAMA,
  DOCUMENTOS,
  RECONOCIMIENTOS,
  GALERIA,
  ADMISIONES,
  CORREOS,
  CONFIGURACION,
  USUARIOS,
  PRACTICAS,
  GLOSARIO,
];

export function getSeccion(slug: string): Seccion | undefined {
  return SECCIONES.find((s) => s.slug === slug);
}

/** Sección anterior y siguiente, para navegar en secuencia. */
export function getVecinas(slug: string): { anterior?: Seccion; siguiente?: Seccion } {
  const i = SECCIONES.findIndex((s) => s.slug === slug);
  if (i === -1) return {};
  return {
    anterior: i > 0 ? SECCIONES[i - 1] : undefined,
    siguiente: i < SECCIONES.length - 1 ? SECCIONES[i + 1] : undefined,
  };
}

/** Índice plano de artículos, para el buscador. */
export type EntradaIndice = {
  seccionSlug: string;
  seccionTitulo: string;
  articuloId: string;
  titulo: string;
  resumen: string;
  /** Todo el texto del artículo en minúsculas, para buscar. */
  texto: string;
};

function textoDeArticulo(bloques: import("../tipos").Bloque[]): string {
  const partes: string[] = [];
  for (const b of bloques) {
    switch (b.t) {
      case "p":
      case "sub":
        partes.push(b.texto);
        break;
      case "pasos":
      case "lista":
        partes.push(b.items.join(" "));
        break;
      case "nota":
        partes.push(b.texto);
        break;
      case "tabla":
        partes.push(b.encabezados.join(" "), b.filas.flat().join(" "));
        break;
      case "ruta":
        partes.push(b.pasos.join(" "));
        break;
      case "campos":
        partes.push(b.items.map((i) => `${i.campo} ${i.desc}`).join(" "));
        break;
    }
  }
  return partes.join(" ");
}

export const INDICE: EntradaIndice[] = SECCIONES.flatMap((s) =>
  s.articulos.map((a) => ({
    seccionSlug: s.slug,
    seccionTitulo: s.titulo,
    articuloId: a.id,
    titulo: a.titulo,
    resumen: a.resumen,
    texto: `${a.titulo} ${a.resumen} ${textoDeArticulo(a.bloques)}`
      .toLowerCase()
      .replace(/\*\*|`/g, ""),
  }))
);

export const TOTAL_ARTICULOS = INDICE.length;
