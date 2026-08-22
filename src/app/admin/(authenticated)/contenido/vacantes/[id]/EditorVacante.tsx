"use client";

/**
 * Editor de una vacante.
 *
 * Los rótulos son los que el colegio ya usa al redactar una oferta —«Perfil
 * requerido», «Formación», «Experiencia», «Habilidades/Conocimientos»— para
 * que rellenar esto se parezca a lo que escriben hoy en su Google Sites.
 */

import { useActionState, useState } from "react";
import Link from "next/link";
import { DialogoConfirmacion } from "@/components/admin/DialogoConfirmacion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { guardarVacanteAction, borrarVacanteAction } from "../actions";
import {
  CATEGORIAS_VACANTE,
  CATEGORIA_VACANTE_INFO,
  type Vacante,
} from "@/lib/vacantes/tipos";
import type { FormularioListado } from "@/lib/formularios/getFormulario";

const ESTADO_INICIAL = { error: null as string | null, ok: false };

const INPUT: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E8E4DD",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 14,
  color: "#1A2B4A",
  outline: "none",
  background: "#FFFFFF",
};

export function EditorVacante({
  vacante,
  formularios,
}: {
  vacante: Vacante;
  formularios: FormularioListado[];
}) {
  const [estado, accion, pendiente] = useActionState(
    guardarVacanteAction,
    ESTADO_INICIAL
  );
  const [formularioId, setFormularioId] = useState(vacante.formulario_id ?? "");
  const [activa, setActiva] = useState(vacante.activa);

  return (
    <form action={accion} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={vacante.id} />

      <Bloque titulo="Lo que se ve en el listado">
        <Fila>
          <Campo label="Título del cargo">
            <input name="titulo" defaultValue={vacante.titulo} style={INPUT} />
          </Campo>
          <Campo label="Dónde aparece">
            <select name="categoria" defaultValue={vacante.categoria} style={INPUT}>
              {CATEGORIAS_VACANTE.map((c) => (
                <option key={c} value={c}>
                  {CATEGORIA_VACANTE_INFO[c].tituloPublico}
                </option>
              ))}
            </select>
          </Campo>
        </Fila>

        <Campo
          label="Resumen"
          ayuda="Una o dos frases. Es lo único que se lee en la tarjeta del listado, así que conviene que diga a quién buscan."
        >
          <textarea
            name="resumen"
            defaultValue={vacante.resumen ?? ""}
            rows={2}
            style={{ ...INPUT, resize: "vertical" }}
          />
        </Campo>

        <Fila>
          <Campo label="Imagen" ayuda="Opcional. Dirección de una imagen ya subida a la galería.">
            <input
              name="imagen_url"
              defaultValue={vacante.imagen_url ?? ""}
              placeholder="https://…"
              style={INPUT}
            />
          </Campo>
          <Campo label="Orden" ayuda="Número más bajo, aparece antes.">
            <input
              name="orden"
              type="number"
              defaultValue={vacante.orden}
              style={INPUT}
            />
          </Campo>
        </Fila>
      </Bloque>

      <Bloque titulo="La oferta">
        <Campo
          label="Descripción del cargo"
          ayuda="Deja una línea en blanco para separar párrafos."
        >
          <textarea
            name="descripcion"
            defaultValue={vacante.descripcion ?? ""}
            rows={7}
            style={{ ...INPUT, resize: "vertical" }}
          />
        </Campo>

        <Fila>
          <Campo label="Formación">
            <input
              name="formacion"
              defaultValue={vacante.formacion ?? ""}
              placeholder="Título de cuarto nivel en gestión educativa o afines."
              style={INPUT}
            />
          </Campo>
          <Campo label="Experiencia">
            <input
              name="experiencia"
              defaultValue={vacante.experiencia ?? ""}
              placeholder="Mínimo 7 años liderando programas académicos."
              style={INPUT}
            />
          </Campo>
        </Fila>

        <Campo label="Habilidades y conocimientos" ayuda="Una por línea.">
          <textarea
            name="habilidades"
            defaultValue={vacante.habilidades.join("\n")}
            rows={5}
            style={{ ...INPUT, resize: "vertical" }}
          />
        </Campo>
      </Bloque>

      <Bloque
        titulo="Cómo se postula"
        ayuda="Cada vacante tiene su propio formulario, así las postulaciones de cada una llegan por separado."
      >
        <Campo label="Formulario de postulación">
          <select
            name="formulario_id"
            value={formularioId}
            onChange={(e) => setFormularioId(e.target.value)}
            style={INPUT}
          >
            <option value="">Ninguno todavía</option>
            {formularios.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
                {f.activo ? "" : " (desactivado)"}
              </option>
            ))}
          </select>
        </Campo>

        {formularioId ? (
          <Link
            href={`/admin/contenido/formularios/${formularioId}`}
            style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}
          >
            Editar las preguntas de este formulario
          </Link>
        ) : (
          <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
            Todavía no hay formulario.{" "}
            <Link
              href="/admin/contenido/formularios/nuevo"
              style={{ color: "#1A2B4A", fontWeight: 600 }}
            >
              Crear uno
            </Link>{" "}
            con las preguntas que necesites para este cargo.
          </p>
        )}
      </Bloque>

      <Bloque titulo="Publicación">
        <Campo
          label="Fecha de cierre"
          ayuda="Opcional. Pasada esa fecha la vacante deja de verse sola, sin que nadie tenga que acordarse."
        >
          <input
            name="cierra_en"
            type="date"
            defaultValue={vacante.cierra_en ?? ""}
            style={{ ...INPUT, maxWidth: 220 }}
          />
        </Campo>

        <label className="flex items-center gap-2" style={{ fontSize: 14, color: "#1A2B4A" }}>
          <input
            type="checkbox"
            name="activa"
            checked={activa}
            onChange={(e) => setActiva(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          Vacante publicada
        </label>

        {activa && !formularioId && (
          <Aviso>
            No se puede publicar sin formulario: quien entre vería el perfil
            pero no tendría dónde dejar sus datos.
          </Aviso>
        )}
      </Bloque>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pendiente}
          style={{
            background: "#1A2B4A",
            color: "#FFFFFF",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            padding: "11px 22px",
            opacity: pendiente ? 0.6 : 1,
          }}
        >
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </button>

        {estado.ok && (
          <span style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 600 }}>Guardado.</span>
        )}
        {estado.error && (
          <span role="alert" style={{ fontSize: 13, color: "#9e1915", fontWeight: 600 }}>
            {estado.error}
          </span>
        )}
      </div>

      <BorrarVacante id={vacante.id} titulo={vacante.titulo} />
    </form>
  );
}

function BorrarVacante({ id, titulo }: { id: string; titulo: string }) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div style={{ borderTop: "1px solid #E8E4DD", paddingTop: 16 }}>
      <DialogoConfirmacion
        abierto={confirmando}
        titulo={`¿Borrar la vacante «${titulo}»?`}
        descripcion={
          <>
            Desaparece de «Trabaja con nosotros» en el sitio público.
            <br />
            <strong style={{ color: "#1A2B4A" }}>
              Las postulaciones que ya llegaron no se borran
            </strong>{" "}
            — siguen en la bandeja de su formulario.
          </>
        }
        textoConfirmar="Borrar vacante"
        onConfirmar={() => {
          setConfirmando(false);
          void borrarVacanteAction(id);
        }}
        onCancelar={() => setConfirmando(false)}
      />
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="inline-flex items-center gap-1.5"
        style={{
          border: "1px solid #E8E4DD",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 13,
          fontWeight: 600,
          color: "#9e1915",
          background: "#FFFFFF",
        }}
      >
        <Trash2 size={13} /> Borrar vacante
      </button>
      <p style={{ fontSize: 12, color: "#6B6660", margin: "6px 0 0" }}>
        Si el cargo ya se llenó, mejor desmarca «Vacante publicada»: así deja de
        verse pero conservas el texto para la próxima convocatoria.
      </p>
    </div>
  );
}

// ───────────────────────────────────────────────────────────

function Bloque({
  titulo,
  ayuda,
  children,
}: {
  titulo: string;
  ayuda?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col gap-4 p-6"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          {titulo}
        </h2>
        {ayuda && (
          <p style={{ fontSize: 13, color: "#6B6660", margin: "3px 0 0" }}>{ayuda}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Fila({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-4 sm:flex-row">{children}</div>;
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
    <label className="flex flex-1 flex-col gap-1.5">
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
      {children}
      {ayuda && <span style={{ fontSize: 12, color: "#6B6660" }}>{ayuda}</span>}
    </label>
  );
}

function Aviso({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-2 px-3 py-2.5"
      style={{ background: "rgba(158,25,21,0.06)", borderRadius: 8 }}
    >
      <AlertTriangle size={14} color="#9e1915" style={{ marginTop: 1, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: "#1A2B4A", lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}
