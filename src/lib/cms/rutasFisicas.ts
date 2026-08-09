/**
 * Páginas que tienen su propio archivo de código en `src/app/`.
 *
 * PARA QUÉ SIRVE ESTA LISTA
 *
 * El bloque de formulario que se elige en el editor de página lo pinta
 * `PlantillaRenderer`, y a `PlantillaRenderer` solo lo usa el catch-all
 * `src/app/[...slug]/page.tsx`. Las páginas de esta lista NO pasan por ahí:
 * cada una tiene su propio `page.tsx` con su maquetación, así que asignarles
 * un formulario desde el editor no haría absolutamente nada.
 *
 * Sin esta lista, el selector aparecería igual en las 53 páginas y en 29 de
 * ellas el colegio elegiría un formulario, guardaría, y no pasaría nada. Es la
 * misma trampa que tenía el «Notificar a» de Configuración › Correos.
 *
 * CÓMO SE ACTUALIZA
 *
 * Cuando se añade o se quita una ruta física hay que tocarla a mano. No se
 * puede detectar en tiempo de ejecución: en Vercel los archivos fuente no
 * existen una vez construido el proyecto. Para regenerarla:
 *
 *   while read slug; do
 *     [ -f "src/app/$slug/page.tsx" ] && echo "  \"$slug\","
 *   done < <(psql -Atc "select slug from paginas order by slug")
 *
 * Si se olvida, el único efecto es que el selector se ofrece en una página
 * donde no funciona — molesto, pero no rompe nada.
 */

export const RUTAS_FISICAS = new Set<string>([
  "/",
  "academico/ib",
  "academico/ib/atributos",
  "academico/ib/capacitacion",
  "academico/ib/documentos",
  "academico/ib/escuela-padres",
  "academico/ib/infraestructura",
  "academico/ib/politicas",
  "academico/ib/visitas",
  "academico/niveles",
  "academico/niveles/egb-elemental-media",
  "academico/niveles/egb-superior",
  "academico/niveles/inicial",
  "admisiones",
  "admisiones/egb-elemental-media",
  "admisiones/egb-superior",
  "admisiones/ib",
  "admisiones/inicial",
  "contactos",
  "el-atenas/historia",
  "el-atenas/mision",
  "el-atenas/valores",
  "el-atenas/vision",
  "espacios",
  "matriculas",
  "matriculas/autorizaciones",
  "matriculas/proceso",
  "matriculas/valores",
  "servicios",
  "trabaja-con-nosotros",
]);

/**
 * Si es true, esta página NO puede llevar un formulario elegido desde el
 * editor: su diseño está en código y hay que añadirlo ahí.
 */
export function tieneRutaFisica(slug: string): boolean {
  if (RUTAS_FISICAS.has(slug)) return true;
  // Las fichas de servicio y espacio se sirven por rutas dinámicas propias
  // (/servicios/[servicio], /espacios/[espacio]), no por el catch-all.
  return /^(servicios|espacios|reconocimientos)\//.test(slug);
}
