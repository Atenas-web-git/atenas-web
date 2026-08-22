"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowUp, ArrowDown, Pencil, Trash2, Save, X } from "lucide-react";
import { DialogoConfirmacion } from "@/components/admin/DialogoConfirmacion";
import {
  guardarTipoAction,
  eliminarTipoAction,
  reordenarTipoAction,
} from "../actions";

type Tipo = {
  id: number;
  slug: string;
  nombre: string;
  orden: number;
};

export function TipoRow({
  tipo,
  count,
  isFirst,
  isLast,
}: {
  tipo: Tipo;
  count: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(tipo.nombre);
  const [slug, setSlug] = useState(tipo.slug);
  const [confirmando, setConfirmando] = useState(false);
  const [isPending, startTransition] = useTransition();

  const guardar = () => {
    const fd = new FormData();
    fd.set("id", String(tipo.id));
    fd.set("slug", slug);
    fd.set("nombre", nombre);
    startTransition(async () => {
      const result = await guardarTipoAction({ error: null, ok: false }, fd);
      if (result?.ok) setEditando(false);
    });
  };

  const cancelar = () => {
    setNombre(tipo.nombre);
    setSlug(tipo.slug);
    setEditando(false);
  };

  const mover = (direccion: "up" | "down") => {
    const fd = new FormData();
    fd.set("id", String(tipo.id));
    fd.set("direccion", direccion);
    startTransition(() => reordenarTipoAction(fd));
  };

  /**
   * Un tipo que está en uso no se puede borrar: el botón queda deshabilitado y
   * dice por qué. Antes se dejaba pulsar y se contestaba con un `alert()`.
   */
  const bloqueado = count > 0;
  const motivoBloqueo = `No se puede eliminar: hay ${count} evento(s) con este tipo. Pulsa el número de la columna «Eventos» para verlos y cambiarles el tipo.`;

  const eliminar = () => {
    setConfirmando(false);
    const fd = new FormData();
    fd.set("id", String(tipo.id));
    startTransition(() => eliminarTipoAction(fd));
  };

  if (editando) {
    return (
      <tr style={{ borderBottom: "1px solid #F4F1EB", background: "#FAFAF8" }}>
        <td style={{ padding: "10px 16px" }}>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={editInput} />
        </td>
        <td style={{ padding: "10px 16px" }}>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} pattern="[a-z0-9-]+" style={editInput} />
        </td>
        <td style={{ padding: "10px 16px", fontSize: 13, color: "#6B6660" }}>{count}</td>
        <td style={{ padding: "10px 16px" }}>
          <div className="flex items-center justify-end gap-1">
            <button onClick={guardar} disabled={isPending} style={btnIcon("#065F46", "#BBF7D0")}>
              <Save size={12} strokeWidth={2.5} />
            </button>
            <button onClick={cancelar} disabled={isPending} style={btnIcon("#6B6660", "#E8E4DD")}>
              <X size={12} strokeWidth={2.5} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr style={{ borderBottom: "1px solid #F4F1EB" }}>
      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
        {tipo.nombre}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B6660", fontFamily: "ui-monospace, monospace" }}>
        {tipo.slug}
      </td>
      {/* El contador enlaza a esos eventos: es la salida del botón apagado. */}
      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B6660" }}>
        {count > 0 ? (
          <Link
            href={`/admin/contenido/cronograma?tipo=${tipo.id}`}
            style={{ color: "#1A2B4A", fontWeight: 600, textDecoration: "underline" }}
            title={`Ver los ${count} eventos de este tipo`}
          >
            {count}
          </Link>
        ) : (
          count
        )}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => mover("up")}
            disabled={isFirst || isPending}
            aria-label="Subir"
            title="Subir en el orden"
            style={btnIcon("#1A2B4A", "#E8E4DD", isFirst || isPending)}
          >
            <ArrowUp size={12} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => mover("down")}
            disabled={isLast || isPending}
            aria-label="Bajar"
            title="Bajar en el orden"
            style={btnIcon("#1A2B4A", "#E8E4DD", isLast || isPending)}
          >
            <ArrowDown size={12} strokeWidth={2.5} />
          </button>
          <button onClick={() => setEditando(true)} disabled={isPending} style={btnIcon("#1A2B4A", "#E8E4DD")}>
            <Pencil size={12} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setConfirmando(true)}
            disabled={isPending || bloqueado}
            aria-label={bloqueado ? motivoBloqueo : `Eliminar el tipo ${tipo.nombre}`}
            title={bloqueado ? motivoBloqueo : "Eliminar"}
            style={btnIcon("#991B1B", "#FECACA", bloqueado)}
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>

          {/* Dentro del <td>: un <dialog> entre celdas es HTML inválido. */}
          <DialogoConfirmacion
            abierto={confirmando}
            titulo={`¿Eliminar el tipo «${tipo.nombre}»?`}
            descripcion="Desaparece de la leyenda del cronograma público y de los filtros del panel. Ningún evento lo usa, así que no cambia ninguna fecha."
            textoConfirmar="Eliminar tipo"
            onConfirmar={eliminar}
            onCancelar={() => setConfirmando(false)}
          />
        </div>
      </td>
    </tr>
  );
}

const editInput: React.CSSProperties = {
  height: 30,
  border: "1px solid #E8E4DD",
  borderRadius: 4,
  paddingLeft: 8,
  paddingRight: 8,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FFFFFF",
  outline: "none",
  fontFamily: "inherit",
};

function btnIcon(color: string, borderColor: string, disabled = false): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : color,
    border: `1px solid ${disabled ? "#E8E4DD" : borderColor}`,
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}
