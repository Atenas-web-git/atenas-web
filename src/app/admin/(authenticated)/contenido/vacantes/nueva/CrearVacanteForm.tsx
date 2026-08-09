"use client";

import { useActionState, useState } from "react";
import { crearVacanteAction } from "../actions";
import { keyDesdeEtiqueta } from "@/lib/formularios/tipos";
import {
  CATEGORIAS_VACANTE,
  CATEGORIA_VACANTE_INFO,
} from "@/lib/vacantes/tipos";

const ESTADO_INICIAL = { error: null as string | null, ok: false };

const INPUT: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E8E4DD",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13,
  color: "#1A2B4A",
  outline: "none",
  background: "#FFFFFF",
};

export function CrearVacanteForm() {
  const [estado, accion, pendiente] = useActionState(
    crearVacanteAction,
    ESTADO_INICIAL
  );
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTocado, setSlugTocado] = useState(false);

  const slugFinal = slugTocado
    ? slug
    : keyDesdeEtiqueta(titulo).replace(/_/g, "-");

  return (
    <form
      action={accion}
      className="flex max-w-[560px] flex-col gap-4 p-6"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <Campo label="Título de la vacante" ayuda="Es el nombre del cargo, tal como lo verá quien postula.">
        <input
          name="titulo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Docente de Inglés"
          required
          style={INPUT}
        />
      </Campo>

      <Campo
        label="Dirección en el sitio"
        ayuda="Así queda: /trabaja-con-nosotros/docente-de-ingles"
      >
        <input
          name="slug"
          value={slugFinal}
          onChange={(e) => {
            setSlugTocado(true);
            setSlug(e.target.value.toLowerCase());
          }}
          pattern="[a-z0-9-]+"
          required
          style={INPUT}
        />
      </Campo>

      <Campo label="Dónde aparece">
        <select name="categoria" defaultValue="abierta" style={INPUT}>
          {CATEGORIAS_VACANTE.map((c) => (
            <option key={c} value={c}>
              {CATEGORIA_VACANTE_INFO[c].tituloPublico}
            </option>
          ))}
        </select>
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
        {pendiente ? "Creando…" : "Crear y redactar el perfil"}
      </button>
    </form>
  );
}

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
