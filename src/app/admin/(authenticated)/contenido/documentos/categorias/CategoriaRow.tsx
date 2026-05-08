"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2, Save, X } from "lucide-react";
import {
  guardarCategoriaAction,
  eliminarCategoriaAction,
  reordenarCategoriaAction,
} from "../actions";

const COLORES = ["gold", "red", "teal", "navy", "purple"] as const;

const PALETA: Record<string, string> = {
  gold: "#C9A84C",
  red: "#9e1915",
  teal: "#0D9488",
  navy: "#1A2B4A",
  purple: "#7C3AED",
};

type Cat = {
  id: number;
  slug: string;
  nombre: string;
  icono: string | null;
  color: string;
  orden: number;
};

export function CategoriaRow({
  cat,
  count,
  isFirst,
  isLast,
}: {
  cat: Cat;
  count: number;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(cat.nombre);
  const [slug, setSlug] = useState(cat.slug);
  const [icono, setIcono] = useState(cat.icono ?? "");
  const [color, setColor] = useState(cat.color);
  const [orden, setOrden] = useState(cat.orden);
  const [isPending, startTransition] = useTransition();

  const guardar = () => {
    const fd = new FormData();
    fd.set("id", String(cat.id));
    fd.set("slug", slug);
    fd.set("nombre", nombre);
    fd.set("icono", icono);
    fd.set("color", color);
    fd.set("orden", String(orden));
    startTransition(async () => {
      const result = await guardarCategoriaAction({ error: null, ok: false }, fd);
      if (result?.ok) setEditando(false);
    });
  };

  const cancelar = () => {
    setNombre(cat.nombre);
    setSlug(cat.slug);
    setIcono(cat.icono ?? "");
    setColor(cat.color);
    setOrden(cat.orden);
    setEditando(false);
  };

  const mover = (direccion: "up" | "down") => {
    const fd = new FormData();
    fd.set("id", String(cat.id));
    fd.set("direccion", direccion);
    startTransition(() => reordenarCategoriaAction(fd));
  };

  const eliminar = () => {
    if (count > 0) {
      alert(
        `No se puede eliminar: hay ${count} documento(s) en esta categoría. Mueve esos documentos a otra categoría primero.`
      );
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"?`)) return;
    const fd = new FormData();
    fd.set("id", String(cat.id));
    startTransition(() => eliminarCategoriaAction(fd));
  };

  if (editando) {
    return (
      <tr style={{ borderBottom: "1px solid #F4F1EB", background: "#FAFAF8" }}>
        <td style={{ padding: "10px 16px" }}>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ ...editInput, width: 90 }}
          >
            {COLORES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </td>
        <td style={{ padding: "10px 16px" }}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={editInput}
          />
        </td>
        <td style={{ padding: "10px 16px" }}>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            pattern="[a-z0-9-]+"
            style={editInput}
          />
        </td>
        <td style={{ padding: "10px 16px" }}>
          <input
            value={icono}
            onChange={(e) => setIcono(e.target.value)}
            placeholder="lucide-name"
            style={editInput}
          />
        </td>
        <td style={{ padding: "10px 16px", fontSize: 12, color: "#6B6660" }}>{count}</td>
        <td style={{ padding: "10px 16px" }}>
          <input
            type="number"
            value={orden}
            onChange={(e) => setOrden(Number(e.target.value))}
            style={{ ...editInput, width: 70 }}
          />
        </td>
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
      <td style={{ padding: "12px 16px" }}>
        <span
          className="inline-block rounded-full"
          style={{
            width: 14,
            height: 14,
            background: PALETA[cat.color] ?? "#6B6660",
          }}
          title={cat.color}
        />
      </td>
      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
        {cat.nombre}
      </td>
      <td
        style={{
          padding: "12px 16px",
          fontSize: 11,
          color: "#6B6660",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {cat.slug}
      </td>
      <td
        style={{
          padding: "12px 16px",
          fontSize: 11,
          color: "#6B6660",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {cat.icono || "—"}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B6660" }}>{count}</td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B6660" }}>{cat.orden}</td>
      <td style={{ padding: "12px 16px" }}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => mover("up")}
            disabled={isFirst || isPending}
            style={btnIcon("#1A2B4A", "#E8E4DD", isFirst)}
            aria-label="Subir"
          >
            <ArrowUp size={12} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => mover("down")}
            disabled={isLast || isPending}
            style={btnIcon("#1A2B4A", "#E8E4DD", isLast)}
            aria-label="Bajar"
          >
            <ArrowDown size={12} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => setEditando(true)}
            disabled={isPending}
            style={btnIcon("#1A2B4A", "#E8E4DD")}
            aria-label="Editar"
          >
            <Pencil size={12} strokeWidth={2.5} />
          </button>
          <button
            onClick={eliminar}
            disabled={isPending}
            style={btnIcon("#991B1B", "#FECACA")}
            aria-label="Eliminar"
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
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
  fontSize: 12,
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
