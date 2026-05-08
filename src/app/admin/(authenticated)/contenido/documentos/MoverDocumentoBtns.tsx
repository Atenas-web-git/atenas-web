"use client";

import { useTransition } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { reordenarDocumentoAction } from "./actions";

export function MoverDocumentoBtns({
  id,
  isFirstInCategoria,
  isLastInCategoria,
}: {
  id: number;
  isFirstInCategoria: boolean;
  isLastInCategoria: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const mover = (direccion: "up" | "down") => {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("direccion", direccion);
    startTransition(() => reordenarDocumentoAction(fd));
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => mover("up")}
        disabled={isFirstInCategoria || pending}
        aria-label="Subir"
        title="Subir dentro de la categoría"
        style={iconButton(isFirstInCategoria || pending)}
      >
        <ArrowUp size={11} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => mover("down")}
        disabled={isLastInCategoria || pending}
        aria-label="Bajar"
        title="Bajar dentro de la categoría"
        style={iconButton(isLastInCategoria || pending)}
      >
        <ArrowDown size={11} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function iconButton(disabled: boolean): React.CSSProperties {
  return {
    width: 24,
    height: 24,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : "#1A2B4A",
    border: "1px solid #E8E4DD",
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}
