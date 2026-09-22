import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { NotFoundContent } from "./not-found-content";

/**
 * La 404 global. Vive en la raíz —no dentro de `(publico)`— porque es la que
 * Next usa para cualquier URL que no exista, del sitio o del panel.
 *
 * **No monta el botón flotante ni ninguna etiqueta de terceros, a propósito.**
 * Este archivo pone solo el contenido; el envoltorio se lo da quien lo pinta,
 * y eso cambia según dónde caiga la dirección. Comprobado el 2026-09-22:
 *
 * - Una dirección **pública** que no existe la recoge el catch-all
 *   `(publico)/[...slug]`, así que la 404 se pinta dentro del layout público y
 *   hereda de él el botón flotante, el JSON-LD y la medición. Montar aquí otro
 *   botón pintaba **dos**.
 * - Una dirección bajo **`/admin`** la recoge `admin/[...resto]`, y entonces
 *   esto se pinta con el layout raíz pelado: sin etiquetas de terceros, que es
 *   justo lo que se buscaba.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <NotFoundContent />
      <FooterCTA />
    </>
  );
}
