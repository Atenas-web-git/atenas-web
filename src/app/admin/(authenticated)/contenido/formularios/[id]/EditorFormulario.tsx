"use client";

/**
 * Constructor de formularios.
 *
 * Quien usa esto es la persona de marketing o secretaría del colegio, que no
 * es técnica. De ahí tres decisiones:
 *
 *  · No se pide un «identificador» de campo: se genera solo desde la etiqueta.
 *    Pero una vez que el formulario tiene respuestas guardadas, cambiar la
 *    etiqueta ya NO cambia el identificador, porque eso dejaría huérfanas las
 *    respuestas anteriores.
 *  · Los campos se mueven con flechas, no arrastrando: funciona con teclado y
 *    en móvil, y no necesita librería.
 *  · Cada tipo de campo se describe por lo que el visitante ve, no por su tipo
 *    de dato.
 */

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Plus,
  Trash2,
} from "lucide-react";
import {
  TIPOS_PLANTILLA_FORMULARIO,
  TIPOS_PLANTILLA_INFO,
  type TipoPlantillaFormulario,
} from "../../plantillas-formularios/constants";
import { guardarFormularioAction } from "../actions";
import {
  TIPOS_CAMPO,
  keyDesdeEtiqueta,
  keyUnica,
  tipoTieneOpciones,
  type CampoFormulario,
  type Formulario,
  type TipoCampo,
} from "@/lib/formularios/tipos";
import { CORREO_PURPOSES, CORREO_PURPOSE_LABELS } from "@/lib/cms/correos";

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

type PaginaUsando = { slug: string; titulo: string; publicada: boolean };

export function EditorFormulario({
  formulario,
  paginas,
  tieneRespuestas,
}: {
  formulario: Formulario;
  paginas: PaginaUsando[];
  tieneRespuestas: boolean;
}) {
  const [estado, accion, pendiente] = useActionState(
    guardarFormularioAction,
    ESTADO_INICIAL
  );

  const [campos, setCampos] = useState<CampoFormulario[]>(formulario.campos);
  const [campoCorreo, setCampoCorreo] = useState(formulario.campo_correo ?? "");
  const [confirmacion, setConfirmacion] = useState(formulario.confirmacion_activa);
  const [plantilla, setPlantilla] = useState(formulario.plantilla_correo ?? "");

  const camposDeCorreo = useMemo(
    () => campos.filter((c) => c.tipo === "correo"),
    [campos]
  );

  function anadirCampo(tipo: TipoCampo) {
    const etiqueta =
      TIPOS_CAMPO.find((t) => t.tipo === tipo)?.label ?? "Campo nuevo";
    const key = keyUnica(
      keyDesdeEtiqueta(etiqueta),
      campos.map((c) => c.key)
    );
    setCampos((prev) => [
      ...prev,
      {
        key,
        tipo,
        etiqueta,
        obligatorio: false,
        ancho: "completo",
        ...(tipoTieneOpciones(tipo) ? { opciones: ["Opción 1"] } : {}),
      },
    ]);
  }

  function actualizarCampo(indice: number, cambios: Partial<CampoFormulario>) {
    setCampos((prev) =>
      prev.map((campo, i) => {
        if (i !== indice) return campo;
        const siguiente = { ...campo, ...cambios };

        // La key sigue a la etiqueta solo mientras el formulario no tenga
        // respuestas: después, renombrarla dejaría las respuestas viejas
        // guardadas bajo una clave que ya no existe.
        if (cambios.etiqueta !== undefined && !tieneRespuestas) {
          siguiente.key = keyUnica(
            keyDesdeEtiqueta(cambios.etiqueta),
            prev.filter((_, j) => j !== indice).map((c) => c.key)
          );
        }
        return siguiente;
      })
    );
  }

  function moverCampo(indice: number, direccion: -1 | 1) {
    const destino = indice + direccion;
    if (destino < 0 || destino >= campos.length) return;
    setCampos((prev) => {
      const copia = [...prev];
      [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
      return copia;
    });
  }

  function borrarCampo(indice: number) {
    const campo = campos[indice];
    if (campo.key === campoCorreo) setCampoCorreo("");
    setCampos((prev) => prev.filter((_, i) => i !== indice));
  }

  return (
    <form action={accion} className="flex flex-col gap-6">
      <input type="hidden" name="id" value={formulario.id} />
      <input type="hidden" name="campos" value={JSON.stringify(campos)} />

      {tieneRespuestas && (
        <Aviso>
          Este formulario ya tiene respuestas guardadas. Puedes cambiar los
          textos con confianza, pero al renombrar una pregunta las respuestas
          anteriores seguirán guardadas con el nombre viejo.
        </Aviso>
      )}

      {/* ─── Preguntas ─────────────────────────────────────── */}
      <Bloque
        titulo="Preguntas"
        ayuda="Lo que la persona rellena. El orden aquí es el orden en que se ven."
      >
        {campos.length === 0 && (
          <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
            Todavía no hay preguntas. Añade la primera abajo.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {campos.map((campo, i) => (
            <EditorCampo
              key={`${campo.key}-${i}`}
              campo={campo}
              indice={i}
              total={campos.length}
              onCambio={(cambios) => actualizarCampo(i, cambios)}
              onMover={(d) => moverCampo(i, d)}
              onBorrar={() => borrarCampo(i)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {TIPOS_CAMPO.map((t) => (
            <button
              key={t.tipo}
              type="button"
              onClick={() => anadirCampo(t.tipo)}
              title={t.descripcion}
              className="inline-flex items-center gap-1.5 px-3 py-2"
              style={{
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: "#1A2B4A",
                background: "#FFFFFF",
              }}
            >
              <Plus size={13} /> {t.label}
            </button>
          ))}
        </div>
      </Bloque>

      {/* ─── Textos ────────────────────────────────────────── */}
      <Bloque titulo="Lo que se ve en la página">
        <Fila>
          <Campo label="Título">
            <input name="titulo" defaultValue={formulario.titulo ?? ""} style={INPUT} />
          </Campo>
          <Campo label="Texto del botón">
            <input
              name="texto_boton"
              defaultValue={formulario.texto_boton}
              style={INPUT}
            />
          </Campo>
        </Fila>

        <Campo label="Subtítulo" ayuda="Una línea de contexto bajo el título. Opcional.">
          <input name="subtitulo" defaultValue={formulario.subtitulo ?? ""} style={INPUT} />
        </Campo>

        <Fila>
          <Campo label="Título del mensaje de gracias">
            <input
              name="titulo_exito"
              defaultValue={formulario.titulo_exito}
              style={INPUT}
            />
          </Campo>
          <Campo label="Mensaje de gracias">
            <input name="texto_exito" defaultValue={formulario.texto_exito} style={INPUT} />
          </Campo>
        </Fila>

        <Campo
          label="Aviso legal"
          ayuda="Texto pequeño bajo el formulario. Si recoges datos personales, aquí va el aviso de tratamiento."
        >
          <textarea
            name="aviso_legal"
            defaultValue={formulario.aviso_legal ?? ""}
            rows={3}
            style={{ ...INPUT, resize: "vertical" }}
          />
        </Campo>
      </Bloque>

      {/* ─── Aviso interno ─────────────────────────────────── */}
      <Bloque
        titulo="A quién le llega"
        ayuda="Las respuestas se guardan siempre, aunque el correo falle. Esto es solo el aviso."
      >
        <Campo
          label="Correos que reciben el aviso"
          ayuda="Separa varios con comas. Este es el único sitio donde se decide: lo que pongas aquí manda sobre la configuración general de correos."
        >
          <input
            name="notificar_a"
            defaultValue={formulario.notificar_a.join(", ")}
            placeholder="gestionhumana@atenas.edu.ec"
            style={INPUT}
          />
        </Campo>

        {formulario.notificar_a.length === 0 && (
          <Aviso>
            Sin ningún correo aquí, las respuestas se guardan pero{" "}
            <strong>nadie recibe aviso de que llegaron</strong>. Alguien tendría
            que entrar a mirar la bandeja por su cuenta.
          </Aviso>
        )}

        <Fila>
          <Campo
            label="Asunto del aviso"
            ayuda="Puedes usar {nombre_del_campo} para meter una respuesta dentro del asunto."
          >
            <input
              name="asunto"
              defaultValue={formulario.asunto ?? ""}
              placeholder="Nueva postulación — {nombres}"
              style={INPUT}
            />
          </Campo>
          <Campo
            label="Buzón desde el que sale"
            ayuda="Solo decide el remitente: desde qué dirección se envía y con qué nombre."
          >
            <select
              name="preset_correo"
              defaultValue={formulario.preset_correo}
              style={INPUT}
            >
              {CORREO_PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {CORREO_PURPOSE_LABELS[p]}
                </option>
              ))}
            </select>
          </Campo>
        </Fila>

        <p style={{ fontSize: 11, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
          Los buzones y sus credenciales se administran en{" "}
          <Link
            href="/admin/configuracion/correos"
            style={{ color: "#1A2B4A", fontWeight: 600 }}
          >
            Configuración › Correos
          </Link>
          . El destinatario, en cambio, se decide aquí.
        </p>
      </Bloque>

      {/* ─── Confirmación ──────────────────────────────────── */}
      <Bloque titulo="Confirmación a quien responde">
        <label className="flex items-center gap-2" style={{ fontSize: 13, color: "#1A2B4A" }}>
          <input
            type="checkbox"
            name="confirmacion_activa"
            checked={confirmacion}
            onChange={(e) => setConfirmacion(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          Enviar un correo de confirmación a quien rellena el formulario
        </label>

        {confirmacion && camposDeCorreo.length === 0 && (
          <Aviso>
            Para poder confirmar hace falta una pregunta de tipo «Correo
            electrónico». Añádela arriba.
          </Aviso>
        )}

        {confirmacion && camposDeCorreo.length > 0 && (
          <>
            <Campo
              label="¿Cuál de las preguntas es su correo?"
              ayuda="Es la dirección a la que se envía la confirmación."
            >
              <select
                name="campo_correo"
                value={campoCorreo}
                onChange={(e) => setCampoCorreo(e.target.value)}
                style={INPUT}
              >
                <option value="">Elegir…</option>
                {camposDeCorreo.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.etiqueta}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Asunto de la confirmación">
              <input
                name="confirmacion_asunto"
                defaultValue={formulario.confirmacion_asunto ?? ""}
                placeholder="Recibimos tu postulación"
                style={INPUT}
              />
            </Campo>

            <Campo
              label="Mensaje"
              ayuda="Texto normal. Deja una línea en blanco para separar párrafos."
            >
              <textarea
                name="confirmacion_cuerpo"
                defaultValue={formulario.confirmacion_cuerpo ?? ""}
                rows={4}
                style={{ ...INPUT, resize: "vertical" }}
              />
            </Campo>

            <Campo
              label="Plantilla de correo con diseño"
              ayuda="Opcional. Son las que se editan en Contenido › Plantillas de correo para formularios."
            >
              <select
                name="plantilla_correo"
                value={plantilla}
                onChange={(e) => setPlantilla(e.target.value)}
                style={INPUT}
              >
                <option value="">Ninguna — usar el mensaje de arriba</option>
                {TIPOS_PLANTILLA_FORMULARIO.map((t) => (
                  <option key={t} value={t}>
                    {TIPOS_PLANTILLA_INFO[t].label}
                  </option>
                ))}
              </select>
            </Campo>

            {plantilla && (
              <Link
                href={`/admin/contenido/plantillas-formularios/${plantilla}`}
                className="inline-flex items-center gap-1.5"
                style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}
              >
                <Mail size={13} /> Editar «
                {TIPOS_PLANTILLA_INFO[plantilla as TipoPlantillaFormulario]?.label ??
                  plantilla}
                »
              </Link>
            )}
          </>
        )}

        {!confirmacion && (
          <>
            <input type="hidden" name="campo_correo" value={campoCorreo} />
            <input type="hidden" name="plantilla_correo" value={plantilla} />
          </>
        )}
      </Bloque>

      {/* ─── Publicación ───────────────────────────────────── */}
      <Bloque titulo="Dónde se ve">
        {paginas.length === 0 ? (
          <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
            Todavía no está en ninguna página. Para colocarlo, abre la página en
            Contenido › Páginas y elígelo en «Formulario al final de la página».
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {paginas.map((p) => (
              <li key={p.slug}>
                <a
                  href={`/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5"
                  style={{ fontSize: 13, color: "#1A2B4A", fontWeight: 600 }}
                >
                  {p.titulo || `/${p.slug}`}
                  <ExternalLink size={12} />
                </a>
                {!p.publicada && (
                  <span style={{ fontSize: 11, color: "#6B6660", marginLeft: 8 }}>
                    (borrador)
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}

        <label className="flex items-center gap-2" style={{ fontSize: 13, color: "#1A2B4A" }}>
          <input
            type="checkbox"
            name="activo"
            defaultChecked={formulario.activo}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          Formulario activo
        </label>
        <p style={{ fontSize: 11, color: "#6B6660", margin: 0 }}>
          Al desactivarlo deja de verse en el sitio, pero las respuestas
          recibidas se conservan. Es la forma correcta de retirar un formulario.
        </p>
      </Bloque>

      {/* ─── Guardar ───────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pendiente}
          style={{
            background: "#1A2B4A",
            color: "#FFFFFF",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            padding: "11px 22px",
            opacity: pendiente ? 0.6 : 1,
          }}
        >
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </button>

        {estado.ok && (
          <span style={{ fontSize: 12, color: "#1A2B4A", fontWeight: 600 }}>
            Guardado.
          </span>
        )}
        {estado.error && (
          <span role="alert" style={{ fontSize: 12, color: "#9e1915", fontWeight: 600 }}>
            {estado.error}
          </span>
        )}
      </div>
    </form>
  );
}

// ───────────────────────────────────────────────────────────

function EditorCampo({
  campo,
  indice,
  total,
  onCambio,
  onMover,
  onBorrar,
}: {
  campo: CampoFormulario;
  indice: number;
  total: number;
  onCambio: (cambios: Partial<CampoFormulario>) => void;
  onMover: (direccion: -1 | 1) => void;
  onBorrar: () => void;
}) {
  const meta = TIPOS_CAMPO.find((t) => t.tipo === campo.tipo);

  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{ border: "1px solid #E8E4DD", borderRadius: 10, background: "#FCFBF9" }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            color: "#6B6660",
          }}
        >
          {meta?.label ?? campo.tipo}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <BotonIcono
            onClick={() => onMover(-1)}
            disabled={indice === 0}
            titulo="Subir"
          >
            <ChevronUp size={14} />
          </BotonIcono>
          <BotonIcono
            onClick={() => onMover(1)}
            disabled={indice === total - 1}
            titulo="Bajar"
          >
            <ChevronDown size={14} />
          </BotonIcono>
          <BotonIcono onClick={onBorrar} titulo="Quitar esta pregunta" peligro>
            <Trash2 size={14} />
          </BotonIcono>
        </div>
      </div>

      <Fila>
        <Campo label="Pregunta">
          <input
            value={campo.etiqueta}
            onChange={(e) => onCambio({ etiqueta: e.target.value })}
            style={INPUT}
          />
        </Campo>
        <Campo label="Texto de ayuda" ayuda="Opcional, se ve debajo del campo.">
          <input
            value={campo.ayuda ?? ""}
            onChange={(e) => onCambio({ ayuda: e.target.value })}
            style={INPUT}
          />
        </Campo>
      </Fila>

      {tipoTieneOpciones(campo.tipo) && (
        <Campo label="Opciones" ayuda="Una por línea.">
          <textarea
            value={(campo.opciones ?? []).join("\n")}
            onChange={(e) =>
              onCambio({
                opciones: e.target.value.split("\n").map((o) => o.trimStart()),
              })
            }
            rows={Math.max(3, (campo.opciones ?? []).length)}
            style={{ ...INPUT, resize: "vertical" }}
          />
        </Campo>
      )}

      {campo.tipo === "archivo" && (
        <Campo
          label="Formatos admitidos"
          ayuda="Separados por comas, con punto. Por ejemplo: .pdf, .docx, .mp3"
        >
          <input
            value={(campo.acepta ?? []).join(", ")}
            onChange={(e) =>
              onCambio({
                acepta: e.target.value
                  .split(",")
                  .map((x) => x.trim().toLowerCase())
                  .filter(Boolean),
              })
            }
            placeholder=".pdf, .docx"
            style={INPUT}
          />
        </Campo>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2" style={{ fontSize: 12, color: "#1A2B4A" }}>
          <input
            type="checkbox"
            checked={campo.obligatorio}
            onChange={(e) => onCambio({ obligatorio: e.target.checked })}
            style={{ width: 15, height: 15, accentColor: "#1A2B4A" }}
          />
          Obligatorio
        </label>

        {campo.tipo !== "texto_largo" &&
          campo.tipo !== "seleccion_multiple" &&
          campo.tipo !== "aceptacion" && (
            <label className="flex items-center gap-2" style={{ fontSize: 12, color: "#1A2B4A" }}>
              <input
                type="checkbox"
                checked={campo.ancho === "medio"}
                onChange={(e) =>
                  onCambio({ ancho: e.target.checked ? "medio" : "completo" })
                }
                style={{ width: 15, height: 15, accentColor: "#1A2B4A" }}
              />
              Media columna en computador
            </label>
          )}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Piezas de interfaz
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
          <p style={{ fontSize: 12, color: "#6B6660", margin: "3px 0 0" }}>{ayuda}</p>
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
      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
      {children}
      {ayuda && <span style={{ fontSize: 11, color: "#6B6660" }}>{ayuda}</span>}
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
      <span style={{ fontSize: 12, color: "#1A2B4A", lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

function BotonIcono({
  children,
  onClick,
  disabled,
  titulo,
  peligro,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  titulo: string;
  peligro?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={titulo}
      aria-label={titulo}
      className="flex items-center justify-center"
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "1px solid #E8E4DD",
        background: "#FFFFFF",
        color: peligro ? "#9e1915" : "#1A2B4A",
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
