"use client";

import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2, Save, X } from "lucide-react";
import {
  guardarPeriodoAction,
  eliminarPeriodoAction,
  reordenarPeriodoAction,
} from "../actions";

const COLORES = ["gold", "red", "teal", "navy", "purple"] as const;

const PALETA: Record<string, string> = {
  gold: "#C9A84C",
  red: "#9e1915",
  teal: "#0D9488",
  navy: "#1A2B4A",
  purple: "#7C3AED",
};

type Periodo = {
  id: number;
  slug: string;
  nombre: string;
  color: string;
  ano_lectivo_codigo: string | null;
  orden: number;
};

type Ano = { codigo: string; nombre: string };

export function PeriodoRow({
  periodo,
  count,
  isFirst,
  isLast,
  anosLectivos,
}: {
  periodo: Periodo;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  anosLectivos: Ano[];
}) {
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState(periodo.nombre);
  const [slug, setSlug] = useState(periodo.slug);
  const [color, setColor] = useState(periodo.color);
  const [ano, setAno] = useState(periodo.ano_lectivo_codigo ?? "");
  const [isPending, startTransition] = useTransition();

  const guardar = () => {
    const fd = new FormData();
    fd.set("id", String(periodo.id));
    fd.set("slug", slug);
    fd.set("nombre", nombre);
    fd.set("color", color);
    fd.set("ano_lectivo_codigo", ano);
    startTransition(async () => {
      const result = await guardarPeriodoAction({ error: null, ok: false }, fd);
      if (result?.ok) setEditando(false);
    });
  };

  const cancelar = () => {
    setNombre(periodo.nombre);
    setSlug(periodo.slug);
    setColor(periodo.color);
    setAno(periodo.ano_lectivo_codigo ?? "");
    setEditando(false);
  };

  const mover = (direccion: "up" | "down") => {
    const fd = new FormData();
    fd.set("id", String(periodo.id));
    fd.set("direccion", direccion);
    startTransition(() => reordenarPeriodoAction(fd));
  };

  const eliminar = () => {
    if (count > 0) {
      alert(
        `No se puede eliminar: hay ${count} evento(s) en este período. Mueve esos eventos a otro período primero.`
      );
      return;
    }
    if (!confirm(`¿Eliminar el período "${periodo.nombre}"?`)) return;
    const fd = new FormData();
    fd.set("id", String(periodo.id));
    startTransition(() => eliminarPeriodoAction(fd));
  };

  if (editando) {
    return (
      <tr style={{ borderBottom: "1px solid #F4F1EB", background: "#FAFAF8" }}>
        <td style={{ padding: "10px 16px" }}>
          <select value={color} onChange={(e) => setColor(e.target.value)} style={{ ...editInput, width: 90 }}>
            {COLORES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </td>
        <td style={{ padding: "10px 16px" }}>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={editInput} />
        </td>
        <td style={{ padding: "10px 16px" }}>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} pattern="[a-z0-9-]+" style={editInput} />
        </td>
        <td style={{ padding: "10px 16px" }}>
          <select value={ano} onChange={(e) => setAno(e.target.value)} style={editInput}>
            <option value="">—</option>
            {anosLectivos.map((a) => (
              <option key={a.codigo} value={a.codigo}>{a.nombre}</option>
            ))}
          </select>
        </td>
        <td style={{ padding: "10px 16px", fontSize: 12, color: "#6B6660" }}>{count}</td>
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

  const anoNombre =
    anosLectivos.find((a) => a.codigo === periodo.ano_lectivo_codigo)?.nombre ?? "—";

  return (
    <tr style={{ borderBottom: "1px solid #F4F1EB" }}>
      <td style={{ padding: "12px 16px" }}>
        <span
          className="inline-block rounded-full"
          style={{ width: 14, height: 14, background: PALETA[periodo.color] ?? "#6B6660" }}
          title={periodo.color}
        />
      </td>
      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
        {periodo.nombre}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 11, color: "#6B6660", fontFamily: "ui-monospace, monospace" }}>
        {periodo.slug}
      </td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B6660" }}>{anoNombre}</td>
      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6B6660" }}>{count}</td>
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
          <button onClick={eliminar} disabled={isPending} style={btnIcon("#991B1B", "#FECACA")}>
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
