"use client";

/**
 * Elige qué formulario se muestra al final de esta página.
 *
 * Tiene su propio botón de guardar, separado del resto del editor: así el
 * mismo control sirve para las veinte plantillas sin tocar sus editores.
 */

import { useActionState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { asignarFormularioAction } from "../actions";

const ESTADO_INICIAL = { error: null as string | null, ok: false };

export type OpcionFormulario = {
  id: string;
  nombre: string;
  activo: boolean;
};

export function SelectorFormulario({
  paginaId,
  formularioActual,
  opciones,
}: {
  paginaId: string;
  formularioActual: string | null;
  opciones: OpcionFormulario[];
}) {
  const [estado, accion, pendiente] = useActionState(
    asignarFormularioAction,
    ESTADO_INICIAL
  );

  return (
    <form
      action={accion}
      className="flex flex-col gap-3 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <input type="hidden" name="id" value={paginaId} />

      <div className="flex items-center gap-2">
        <ClipboardList size={15} color="#1A2B4A" />
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Formulario al final de la página
        </h2>
      </div>

      {opciones.length === 0 ? (
        <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
          Todavía no hay formularios creados.{" "}
          <Link
            href="/admin/contenido/formularios/nuevo"
            style={{ color: "#1A2B4A", fontWeight: 600 }}
          >
            Crear uno
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              name="formulario_id"
              defaultValue={formularioActual ?? ""}
              style={{
                flex: 1,
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 13,
                color: "#1A2B4A",
                background: "#FFFFFF",
              }}
            >
              <option value="">Ninguno</option>
              {opciones.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                  {o.activo ? "" : " (desactivado)"}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={pendiente}
              style={{
                background: "#1A2B4A",
                color: "#FFFFFF",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                padding: "10px 18px",
                opacity: pendiente ? 0.6 : 1,
              }}
            >
              {pendiente ? "Guardando…" : "Guardar"}
            </button>
          </div>

          <p style={{ fontSize: 11, color: "#6B6660", margin: 0 }}>
            Se coloca debajo de todo el contenido de la página. Este ajuste se
            guarda por separado del resto del editor.
          </p>
        </>
      )}

      {estado.ok && (
        <span style={{ fontSize: 12, color: "#1A2B4A", fontWeight: 600 }}>Guardado.</span>
      )}
      {estado.error && (
        <span role="alert" style={{ fontSize: 12, color: "#9e1915", fontWeight: 600 }}>
          {estado.error}
        </span>
      )}
    </form>
  );
}
