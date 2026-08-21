"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

/**
 * Diálogo de confirmación del backoffice.
 *
 * Sustituye al `confirm()` del navegador, que hasta el 2026-08-21 se usaba en
 * siete sitios del panel. Los problemas del `confirm()` nativo no son estéticos:
 *
 *   - No admite formato. Todo va en un párrafo gris, así que lo importante
 *     («esto no se puede deshacer») pesa lo mismo que el resto y no se lee.
 *   - El botón de aceptar sale enfocado por defecto. Un Intro de más y borraste.
 *   - Bloquea el hilo del navegador entero mientras está abierto.
 *   - Algunos navegadores dejan marcar «no volver a mostrar», y a partir de ahí
 *     los borrados dejan de pedir confirmación en toda la pestaña. Sin aviso.
 *
 * Usa `<dialog>` nativo a propósito: la gestión de foco, el cierre con Escape,
 * el fondo y dejar inerte el resto de la página vienen del navegador, no de
 * código nuestro que haya que mantener y que se rompa en un caso raro.
 */

type Props = {
  abierto: boolean;
  /** Qué va a pasar, en una frase. No «¿Estás seguro?» */
  titulo: string;
  /** Qué se pierde exactamente y qué no. Es la parte que de verdad se lee. */
  descripcion?: React.ReactNode;
  /** Texto del botón que ejecuta. Un verbo: «Eliminar», no «Aceptar» */
  textoConfirmar?: string;
  textoCancelar?: string;
  /** `true` pinta el botón en rojo. Para borrados. */
  destructivo?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
};

export function DialogoConfirmacion({
  abierto,
  titulo,
  descripcion,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  destructivo = true,
  onConfirmar,
  onCancelar,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const botonCancelarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;

    if (abierto && !dialogo.open) {
      dialogo.showModal();
      // El foco arranca en CANCELAR, nunca en el botón que borra. El navegador
      // enfoca el primer elemento del diálogo, y aquí ese orden importa: quien
      // llegue pulsando Intro por inercia no debe borrar nada.
      botonCancelarRef.current?.focus();
    } else if (!abierto && dialogo.open) {
      dialogo.close();
    }
  }, [abierto]);

  // Escape y el botón de cierre del navegador disparan `cancel`. Sin esto, el
  // diálogo se cerraría por dentro pero el estado de React seguiría diciendo
  // que está abierto, y no se podría volver a abrir.
  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    const alCancelar = (e: Event) => {
      e.preventDefault();
      onCancelar();
    };
    dialogo.addEventListener("cancel", alCancelar);
    return () => dialogo.removeEventListener("cancel", alCancelar);
  }, [onCancelar]);

  const colorAccion = destructivo ? "#9E1915" : "#1A2B4A";

  return (
    <dialog
      ref={ref}
      aria-labelledby="dialogo-titulo"
      style={{
        padding: 0,
        border: "none",
        borderRadius: 12,
        maxWidth: 440,
        width: "calc(100% - 32px)",
        background: "#FFFFFF",
        boxShadow: "0 16px 48px rgba(26, 43, 74, 0.24)",
        fontFamily: "Poppins, sans-serif",
        color: "#2C2C2C",
      }}
      // Un clic fuera de la caja cierra sin ejecutar nada. Se comprueba que el
      // clic cayó en el `<dialog>` mismo —que ocupa toda la pantalla— y no en
      // el contenido de dentro.
      onClick={(e) => {
        if (e.target === ref.current) onCancelar();
      }}
    >
      <div style={{ padding: 24 }}>
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              background: destructivo ? "#FEE2E2" : "#EFF6FF",
            }}
            aria-hidden="true"
          >
            <AlertTriangle size={18} color={colorAccion} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col gap-1.5 min-w-0">
            <h2
              id="dialogo-titulo"
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1A2B4A",
                margin: 0,
                lineHeight: 1.35,
              }}
            >
              {titulo}
            </h2>
            {descripcion && (
              <div style={{ fontSize: 13, lineHeight: 1.55, color: "#6B6660" }}>
                {descripcion}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2" style={{ marginTop: 20 }}>
          <button
            ref={botonCancelarRef}
            type="button"
            onClick={onCancelar}
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: 6,
              border: "1px solid #8A857E",
              background: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              color: "#1A2B4A",
            }}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            style={{
              height: 36,
              padding: "0 16px",
              borderRadius: 6,
              border: "none",
              background: colorAccion,
              fontSize: 13,
              fontWeight: 600,
              color: "#FFFFFF",
            }}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </dialog>
  );
}
