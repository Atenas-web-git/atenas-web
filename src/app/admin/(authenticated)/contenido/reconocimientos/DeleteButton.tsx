"use client";

import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { DialogoConfirmacion } from "@/components/admin/DialogoConfirmacion";

type Props = {
  action: (formData: FormData) => void;
  hiddenFields: Record<string, string | number>;
  label?: string;
  /**
   * Mensaje de la confirmación, en dos partes separadas por una línea en blanco:
   *
   *     ¿Eliminar el logro "X"?
   *
   *     Se borrarán también sus fotos asociadas.
   *
   * La primera línea es el título del diálogo y el resto la explicación. Es el
   * formato que ya usaban los seis sitios que llaman a este componente, así que
   * se respeta tal cual; si no hay línea en blanco, todo va como título.
   */
  confirmMessage: string;
  variant?: "lg" | "sm";
};

export function DeleteButton({
  action,
  hiddenFields,
  label = "Eliminar",
  confirmMessage,
  variant = "lg",
}: Props) {
  const [confirmando, setConfirmando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const corte = confirmMessage.indexOf("\n\n");
  const titulo = corte === -1 ? confirmMessage : confirmMessage.slice(0, corte);
  const descripcion = corte === -1 ? undefined : confirmMessage.slice(corte + 2).trim();

  return (
    <form ref={formRef} action={action}>
      {Object.entries(hiddenFields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={String(v)} />
      ))}

      {/*
        El botón visible es `type="button"`: abre el diálogo y no envía nada.
        El envío de verdad lo dispara `requestSubmit()` al confirmar, que sí
        pasa por la server action y por `useFormStatus`.

        Antes esto era un `onSubmit` que llamaba a `confirm()` y hacía
        `preventDefault()` si decías que no. Funcionaba, pero dejaba el borrado
        a un paso de un Intro: el botón de aceptar del navegador sale enfocado.
      */}
      <BotonBorrar
        label={label}
        variant={variant}
        onPulsar={() => setConfirmando(true)}
      />

      <DialogoConfirmacion
        abierto={confirmando}
        titulo={titulo}
        descripcion={descripcion}
        textoConfirmar={label}
        onConfirmar={() => {
          setConfirmando(false);
          formRef.current?.requestSubmit();
        }}
        onCancelar={() => setConfirmando(false)}
      />
    </form>
  );
}

function BotonBorrar({
  label,
  variant,
  onPulsar,
}: {
  label: string;
  variant: "lg" | "sm";
  onPulsar: () => void;
}) {
  const { pending } = useFormStatus();
  const isSm = variant === "sm";
  return (
    <button
      type="button"
      onClick={onPulsar}
      disabled={pending}
      className="flex items-center gap-1.5 rounded-md transition-opacity hover:opacity-70 disabled:opacity-50"
      style={{
        height: isSm ? 28 : 36,
        padding: isSm ? "0 10px" : "0 12px",
        background: "#FEE2E2",
        fontSize: isSm ? 11 : 13,
        color: "#991B1B",
        fontWeight: 600,
        border: "1px solid #FCA5A5",
        cursor: pending ? "wait" : "pointer",
      }}
    >
      <Trash2 size={isSm ? 11 : 13} strokeWidth={2.5} />
      {pending ? "Eliminando…" : label}
    </button>
  );
}
