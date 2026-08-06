"use client";

import { useActionState, useState } from "react";
import { crearFormularioAction } from "../actions";
import { keyDesdeEtiqueta } from "@/lib/formularios/tipos";

const ESTADO_INICIAL = { error: null as string | null, ok: false };

export function CrearFormularioForm() {
  const [estado, accion, pendiente] = useActionState(
    crearFormularioAction,
    ESTADO_INICIAL
  );
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  // Mientras no se toque a mano, la dirección sigue al nombre. En cuanto se
  // edita, deja de hacerlo: si no, corregir el nombre pisaría la dirección
  // que la persona acaba de escribir.
  const [slugTocado, setSlugTocado] = useState(false);

  const slugFinal = slugTocado
    ? slug
    : keyDesdeEtiqueta(nombre).replace(/_/g, "-");

  return (
    <form
      action={accion}
      className="flex max-w-[560px] flex-col gap-4 p-6"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <Campo label="Nombre del formulario" ayuda="Solo lo ves tú, en este panel.">
        <input
          name="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Postulación docentes de inglés"
          required
          style={INPUT}
        />
      </Campo>

      <Campo
        label="Dirección"
        ayuda="Identifica al formulario dentro del sitio. Solo minúsculas, números y guiones."
      >
        <input
          name="slug"
          value={slugFinal}
          onChange={(e) => {
            setSlugTocado(true);
            setSlug(e.target.value.toLowerCase());
          }}
          placeholder="postulacion-docentes-ingles"
          pattern="[a-z0-9-]+"
          required
          style={INPUT}
        />
      </Campo>

      {estado.error && (
        <p
          role="alert"
          style={{
            fontSize: 12,
            color: "#9e1915",
            background: "rgba(158,25,21,0.08)",
            borderRadius: 8,
            padding: "10px 12px",
            margin: 0,
          }}
        >
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        style={{
          background: "#1A2B4A",
          color: "#FFFFFF",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          padding: "11px 20px",
          alignSelf: "flex-start",
          opacity: pendiente ? 0.6 : 1,
        }}
      >
        {pendiente ? "Creando…" : "Crear y elegir preguntas"}
      </button>
    </form>
  );
}

const INPUT: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E8E4DD",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13,
  color: "#1A2B4A",
  outline: "none",
};

function Campo({
  label,
  ayuda,
  children,
}: {
  label: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
      {children}
      {ayuda && <span style={{ fontSize: 11, color: "#6B6660" }}>{ayuda}</span>}
    </label>
  );
}
