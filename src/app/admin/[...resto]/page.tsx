import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Como el resto de entradas del panel: nunca indexable. Devuelve 404 y
// robots.txt ya bloquea `/admin/`, así que es defensa en profundidad.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Cierra el último hueco por el que una URL del panel llegaba al sitio público.
 *
 * Medido el 2026-09-22: sin este archivo, `/admin/<lo-que-sea-que-no-exista>`
 * no lo recogía nadie bajo `/admin` y acababa cayendo en el catch-all
 * `(publico)/[...slug]`, que busca la dirección en el CMS, no la encuentra y
 * pinta la 404 **dentro del layout público** — con su JSON-LD, su medición y
 * sus pixels. Una dirección mal tecleada del panel se le habría reportado a
 * Google como si fuera una página del sitio.
 *
 * Con este catch-all, esas direcciones se resuelven dentro de `/admin`: la 404
 * se pinta con el layout raíz pelado y no carga ninguna etiqueta de terceros.
 * No se lleva por delante ninguna ruta real del panel, porque un segmento fijo
 * —`admisiones`, `contenido`, `login`…— siempre gana a un catch-all.
 *
 * → ficha 2026-08-19-el-panel-manda-a-google-y-meta-lo-que-busca-secretaria
 */
export default function AdminNoExiste() {
  notFound();
}
