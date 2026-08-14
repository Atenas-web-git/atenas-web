"use client";

/**
 * Vista previa de un correo dentro del panel, aislada en un iframe.
 *
 * Antes esto era un `dangerouslySetInnerHTML` sobre un `<div>`, y tenía dos
 * problemas de distinta gravedad:
 *
 * 1. **Seguridad.** El HTML de la plantilla lo guarda un rol y la vista previa
 *    la abre otro, así que un `<script>` en la plantilla se ejecutaba en
 *    `/admin` con la sesión de quien miraba. Es escalada de privilegios, no
 *    algo autoinfligido.
 *
 *    Quién puede escribir ese HTML, mirando `plantillasVisibles` en
 *    `@/lib/auth/areas`: Talento Humano solo en la plantilla «trabaja», pero
 *    Comunicaciones y Admisiones reciben `null` —es decir, TODAS—, además del
 *    Superadministrador. Son cuatro roles, no uno: no relajes esto pensando
 *    que el único autor posible es Talento Humano.
 * 2. **Fidelidad.** `renderPremiumEmail` devuelve un documento completo, con su
 *    `<html>` y su `<style>`. Metido en un `div` el navegador tira la cabecera,
 *    y los estilos del correo y los del panel se mezclaban en las dos
 *    direcciones.
 *
 * El iframe resuelve las dos: `sandbox` sin `allow-scripts` significa que ahí
 * dentro NO se ejecuta nada, y el documento se pinta entero, como lo verá quien
 * reciba el correo.
 *
 * `allow-same-origin` está por una sola razón: poder leer la altura del
 * contenido y crecer con él, porque un iframe no se autoajusta. No abre la
 * puerta que cierra el sandbox — la combinación peligrosa es
 * `allow-scripts allow-same-origin` juntos, que le permitiría al documento
 * quitarse el propio sandbox. Sin scripts no hay nada que pueda actuar.
 *
 * No saneamos el HTML del correo con `sanearHtml`: su lista blanca es la del
 * sitio público y dejaría el correo en cuatro párrafos sueltos, sin tablas,
 * sin imágenes y sin colores. Parecería que la vista previa se rompió.
 */

import { useCallback, useEffect, useRef, useState } from "react";

const ALTURA_MINIMA = 320;

/**
 * Tope duro del alto. No es una preferencia estética: sin él, medir el
 * contenido para fijar el alto del iframe se realimenta.
 *
 * Un `min-height:200vh` en el cuerpo de la plantilla —trivial desde el modo
 * HTML en crudo— se resuelve contra el alto que acabamos de fijar, así que cada
 * medición duplica la anterior: 320 → 640 → 1280… hasta colgar la pestaña de
 * quien está revisando. Comprobado el 2026-08-14: se cuelga de verdad.
 *
 * Y es el mismo reparto de siempre —Talento Humano guarda, el Superadministrador
 * revisa—, así que sería negarle a otro la revisión, a voluntad. También puede
 * pasar por accidente con cualquier CSS pegado que use unidades `vh`.
 *
 * Pasado el tope el iframe hace scroll interno, que es degradar bien: se ve
 * todo el correo, solo que desplazándose.
 */
const ALTURA_MAXIMA = 6000;

// Por debajo de esto no vale la pena volver a fijar el alto. Evita el
// ida y vuelta de un píxel entre el redondeo del layout y `scrollHeight`.
const DELTA_MINIMO = 2;

export function VistaPreviaCorreo({ html }: { html: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [altura, setAltura] = useState(ALTURA_MINIMA);
  // Cambia en cada `load` del iframe. Está aquí, y no en un ref, porque es lo
  // que vuelve a lanzar el efecto de abajo: cuando el efecto corre por primera
  // vez el iframe todavía no ha parseado el `srcDoc` y su `body` aún no existe.
  const [cargas, setCargas] = useState(0);

  const medir = useCallback(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.documentElement) return;
    const alto = Math.max(
      doc.documentElement.scrollHeight,
      doc.body?.scrollHeight ?? 0
    );
    if (alto <= 0) return;
    const acotado = Math.min(Math.max(ALTURA_MINIMA, alto), ALTURA_MAXIMA);
    setAltura((previo) =>
      Math.abs(acotado - previo) < DELTA_MINIMO ? previo : acotado
    );
  }, []);

  // El alto cambia dos veces: al pintar, y otra vez cuando terminan de cargar
  // las imágenes del correo (el logo y la hero). Midiendo solo en `load` la
  // vista previa queda cortada por abajo, así que observamos el contenido.
  useEffect(() => {
    const doc = ref.current?.contentDocument;
    if (!doc?.body) return;
    const observador = new ResizeObserver(medir);
    observador.observe(doc.body);
    return () => observador.disconnect();
  }, [cargas, medir]);

  return (
    <div
      className="rounded-md overflow-hidden"
      style={{ border: "1px solid #E8E4DD", background: "#FFFFFF" }}
    >
      <iframe
        ref={ref}
        srcDoc={html}
        onLoad={() => {
          medir();
          setCargas((n) => n + 1);
        }}
        title="Vista previa del correo"
        // NO añadir `allow-scripts`. Esta línea es todo lo que separa la vista
        // previa de un XSS en el origen de `/admin`: junto con
        // `allow-same-origin`, el documento podría quitarse el propio sandbox.
        // Si alguna vez hace falta una vista previa interactiva, quita antes
        // `allow-same-origin` y mide el alto por otra vía.
        sandbox="allow-same-origin"
        referrerPolicy="no-referrer"
        // Aquí iría un `transition` en el alto para suavizar el ajuste en dos
        // tiempos, y a propósito no está: el alto que medimos depende del alto
        // que fijamos, así que animarlo mete valores intermedios en la propia
        // medición. Además tapó el bucle de `ALTURA_MAXIMA` mientras se
        // probaba: parecía estable y lo que estaba era congelado.
        style={{
          display: "block",
          width: "100%",
          height: altura,
          border: 0,
        }}
      />
    </div>
  );
}
