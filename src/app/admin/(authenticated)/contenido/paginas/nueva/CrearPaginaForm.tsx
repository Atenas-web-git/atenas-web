"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { crearPaginaAction, type PaginaActionState } from "../actions";
import { PLANTILLAS_LIST } from "../../plantillas";

export function CrearPaginaForm() {
  const [state, action, isPending] = useActionState<PaginaActionState, FormData>(
    crearPaginaAction,
    { error: null, ok: false }
  );

  const [plantillaSel, setPlantillaSel] = useState<string>("tpl_a_hero_texto");

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Selector de plantilla */}
      <div
        className="flex flex-col gap-3 p-5"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
      >
        <span style={fieldLabel}>Plantilla</span>
        <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
          Elige el formato visual de la página. No se puede cambiar después de crear.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
          {PLANTILLAS_LIST.map((p) => {
            const selected = plantillaSel === p.slug;
            const disabled = !p.implementada;
            return (
              <label
                key={p.slug}
                className="flex flex-col gap-2 p-4 transition-all"
                style={{
                  border: selected ? "2px solid #1A2B4A" : "1px solid #E8E4DD",
                  borderRadius: 10,
                  background: selected ? "#F4F1EB" : disabled ? "#FAFAF8" : "#FFFFFF",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.55 : 1,
                }}
              >
                <input
                  type="radio"
                  name="plantilla"
                  value={p.slug}
                  checked={selected}
                  disabled={disabled}
                  onChange={() => !disabled && setPlantillaSel(p.slug)}
                  style={{ position: "absolute", opacity: 0, width: 1, height: 1 }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="inline-flex items-center justify-center"
                    style={{
                      width: 32,
                      height: 32,
                      background: selected ? "#1A2B4A" : "#F4F1EB",
                      color: selected ? "#FFFFFF" : "#1A2B4A",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {p.letra}
                  </span>
                  {disabled && (
                    <span
                      className="inline-flex items-center px-2 rounded-full"
                      style={{
                        height: 18,
                        background: "#F4F1EB",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#6B6660",
                        letterSpacing: 0.5,
                      }}
                    >
                      PRÓXIMAMENTE
                    </span>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1A2B4A",
                    margin: 0,
                  }}
                >
                  {p.nombre}
                </h3>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6B6660",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {p.descripcion}
                </p>
              </label>
            );
          })}
        </div>
      </div>

      {/* Datos básicos */}
      <div
        className="flex flex-col gap-4 p-5"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="titulo-input" style={fieldLabel}>
            Título interno
          </label>
          <input
            id="titulo-input"
            type="text"
            name="titulo"
            required
            placeholder="ej. Misión, Política de Calidad, Bachillerato IB…"
            style={inputStyle}
          />
          <span style={hintStyle}>
            Aparece en el listado del backoffice y como título del hero por defecto.
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug-input" style={fieldLabel}>
            Slug (URL pública)
          </label>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 13,
                color: "#A0AABA",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              }}
            >
              atenas.edu.ec/
            </span>
            <input
              id="slug-input"
              type="text"
              name="slug"
              required
              pattern="[a-z0-9\-/]+"
              placeholder="el-atenas/historia"
              style={{
                ...inputStyle,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                flex: 1,
              }}
            />
          </div>
          <span style={hintStyle}>
            Usa solo minúsculas, números, guiones y barras (/). Ejemplo: <code>el-atenas/historia</code>
          </span>
        </div>
      </div>

      {state.error && (
        <p
          className="px-4 py-3 rounded-md"
          style={{
            background: "#FEE2E2",
            border: "1px solid #FECACA",
            fontSize: 12,
            color: "#991B1B",
            margin: 0,
          }}
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-5 rounded-md transition-opacity"
          style={{
            height: 40,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: isPending ? "wait" : "pointer",
            opacity: isPending ? 0.7 : 1,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          {isPending ? "Creando…" : "Crear página"}
        </button>
        <p style={{ fontSize: 11, color: "#A0AABA", margin: 0 }}>
          Se creará en estado <strong style={{ color: "#6B6660" }}>borrador</strong>. La publicas desde el editor.
        </p>
      </div>
    </form>
  );
}

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
};

const hintStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#A0AABA",
};
