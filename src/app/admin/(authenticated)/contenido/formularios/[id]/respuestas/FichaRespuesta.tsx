"use client";

import { useRef, useState, useTransition } from "react";
import { Download, Loader2, MailWarning, Paperclip, Trash2 } from "lucide-react";
import {
  borrarRespuestaAction,
  cambiarEstadoRespuestaAction,
  guardarNotaRespuestaAction,
  urlFirmadaAdjuntoAction,
} from "../../actions";
import {
  ESTADOS_RESPUESTA,
  ESTADO_LABELS,
  type ArchivoRespuesta,
  type CampoFormulario,
  type DatosRespuesta,
  type EstadoRespuesta,
} from "@/lib/formularios/tipos";
import { camposRetirados } from "@/lib/formularios/tipos";
import { valorLegible } from "@/lib/formularios/validar";
import { DialogoConfirmacion } from "@/components/admin/DialogoConfirmacion";

type Respuesta = {
  id: string;
  numero: number;
  datos: DatosRespuesta;
  archivos: ArchivoRespuesta[];
  estado: EstadoRespuesta;
  nota_interna: string | null;
  correo_enviado: boolean;
  created_at: string;
};

const COLOR_ESTADO: Record<EstadoRespuesta, string> = {
  nueva: "#9e1915",
  en_proceso: "#1A2B4A",
  atendida: "#2F6B4F",
  descartada: "#8A857E",
};

export function FichaRespuesta({
  respuesta,
  campos,
  formularioId,
}: {
  respuesta: Respuesta;
  campos: CampoFormulario[];
  formularioId: string;
}) {
  const [abierta, setAbierta] = useState(respuesta.estado === "nueva");
  const [pendiente, iniciar] = useTransition();
  const [descargando, setDescargando] = useState<string | null>(null);
  const [confirmandoBorrado, setConfirmandoBorrado] = useState(false);
  const formBorrarRef = useRef<HTMLFormElement>(null);

  const fecha = new Date(respuesta.created_at).toLocaleString("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
  });

  // Lo que esta persona contestó a preguntas que ya no existen en el
  // formulario. Sin esto desaparecía de la pantalla en cuanto alguien quitaba
  // la pregunta, aunque el dato siguiera guardado.
  const retirados = camposRetirados(respuesta.datos, campos);

  async function descargar(archivo: ArchivoRespuesta) {
    setDescargando(archivo.storage_path);
    try {
      const url = await urlFirmadaAdjuntoAction(archivo.storage_path);
      if (url) window.open(url, "_blank", "noopener");
    } finally {
      setDescargando(null);
    }
  }

  return (
    <div
      className="flex flex-col"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <button
        type="button"
        onClick={() => setAbierta((v) => !v)}
        className="flex items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A" }}>
              #{respuesta.numero}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: "uppercase",
                color: "#FFFFFF",
                background: COLOR_ESTADO[respuesta.estado],
                padding: "3px 8px",
                borderRadius: 999,
              }}
            >
              {ESTADO_LABELS[respuesta.estado]}
            </span>
            {!respuesta.correo_enviado && (
              <span
                className="inline-flex items-center gap-1"
                style={{ fontSize: 12, color: "#9e1915", fontWeight: 600 }}
                title="La respuesta se guardó, pero el correo de aviso no salió."
              >
                <MailWarning size={12} /> sin aviso
              </span>
            )}
            {respuesta.archivos.length > 0 && (
              <span
                className="inline-flex items-center gap-1"
                style={{ fontSize: 12, color: "#6B6660" }}
              >
                <Paperclip size={12} /> {respuesta.archivos.length}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "3px 0 0" }}>{fecha}</p>
        </div>

        <span style={{ fontSize: 13, color: "#6B6660", flexShrink: 0 }}>
          {abierta ? "Cerrar" : "Ver"}
        </span>
      </button>

      {abierta && (
        <div className="flex flex-col gap-4 px-4 pb-4">
          <dl className="flex flex-col gap-0" style={{ margin: 0 }}>
            {campos
              .filter((c) => c.tipo !== "archivo")
              .map((campo) => (
                <div
                  key={campo.key}
                  className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4"
                  style={{ borderTop: "1px solid #F1EEE9" }}
                >
                  <dt
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                      textTransform: "uppercase",
                      color: "#8A857E",
                      minWidth: 190,
                    }}
                  >
                    {campo.etiqueta}
                  </dt>
                  <dd
                    style={{
                      fontSize: 14,
                      color: "#1A2B4A",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {valorLegible(respuesta.datos[campo.key] ?? null) || "—"}
                  </dd>
                </div>
              ))}

            {/*
              Lo que esta persona contestó a preguntas que el formulario ya no
              tiene. El dato nunca se borró —sigue en `datos`— pero dejaba de
              verse en cuanto alguien quitaba la pregunta del editor, porque
              esta lista recorre `campos` y no las claves de la respuesta.

              Se marcan como retiradas en vez de mezclarlas con las vigentes:
              secretaría tiene que poder distinguir lo que el formulario pide
              hoy de lo que pidió cuando llegó esta respuesta.
            */}
            {retirados.map(({ key, valor }) => (
              <div
                key={key}
                className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4"
                style={{ borderTop: "1px solid #F1EEE9" }}
              >
                <dt
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    color: "#92400E",
                    minWidth: 190,
                  }}
                >
                  {key.replace(/_/g, " ")}
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 600,
                      textTransform: "none",
                      letterSpacing: 0,
                      color: "#92400E",
                    }}
                  >
                    pregunta retirada
                  </span>
                </dt>
                <dd
                  style={{
                    fontSize: 14,
                    color: "#1A2B4A",
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {valorLegible(valor)}
                </dd>
              </div>
            ))}
          </dl>

          {respuesta.archivos.length > 0 && (
            <div className="flex flex-col gap-2">
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  color: "#8A857E",
                }}
              >
                Archivos adjuntos
              </span>
              <div className="flex flex-wrap gap-2">
                {respuesta.archivos.map((archivo) => (
                  <button
                    key={archivo.storage_path}
                    type="button"
                    onClick={() => descargar(archivo)}
                    disabled={descargando === archivo.storage_path}
                    className="inline-flex items-center gap-1.5 px-3 py-2"
                    style={{
                      border: "1px solid #E8E4DD",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#1A2B4A",
                      maxWidth: "100%",
                    }}
                  >
                    {descargando === archivo.storage_path ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Download size={13} />
                    )}
                    <span className="truncate">{archivo.filename}</span>
                  </button>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "#6B6660" }}>
                El enlace de descarga caduca en una hora. Vuelve aquí para
                generar otro.
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <form
              action={(fd) => iniciar(() => cambiarEstadoRespuestaAction(fd))}
              className="flex flex-1 flex-col gap-1.5"
            >
              <input type="hidden" name="id" value={respuesta.id} />
              <input type="hidden" name="formulario_id" value={formularioId} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                Estado
              </span>
              <div className="flex gap-2">
                <select
                  name="estado"
                  defaultValue={respuesta.estado}
                  style={{
                    flex: 1,
                    border: "1px solid #E8E4DD",
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontSize: 14,
                    color: "#1A2B4A",
                    background: "#FFFFFF",
                  }}
                >
                  {ESTADOS_RESPUESTA.map((e) => (
                    <option key={e} value={e}>
                      {ESTADO_LABELS[e]}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={pendiente}
                  style={{
                    border: "1px solid #E8E4DD",
                    borderRadius: 8,
                    padding: "9px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1A2B4A",
                  }}
                >
                  Cambiar
                </button>
              </div>
            </form>
          </div>

          <form
            action={(fd) => iniciar(() => guardarNotaRespuestaAction(fd))}
            className="flex flex-col gap-1.5"
          >
            <input type="hidden" name="id" value={respuesta.id} />
            <input type="hidden" name="formulario_id" value={formularioId} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
              Nota interna
            </span>
            <textarea
              name="nota_interna"
              defaultValue={respuesta.nota_interna ?? ""}
              rows={2}
              placeholder="Solo la ve el equipo del colegio."
              style={{
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 14,
                color: "#1A2B4A",
                resize: "vertical",
                background: "#FFFFFF",
              }}
            />
            <button
              type="submit"
              disabled={pendiente}
              style={{
                alignSelf: "flex-start",
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "#1A2B4A",
              }}
            >
              Guardar nota
            </button>
          </form>

          {/*
            Borrado real, no «descartar». Existe porque la ley de protección de
            datos reconoce el derecho a que te eliminen la información, y estos
            formularios recogen cédula y datos de salud.
          */}
          <form
            ref={formBorrarRef}
            action={(fd) => iniciar(() => borrarRespuestaAction(fd))}
            style={{ borderTop: "1px solid #F1EEE9", paddingTop: 12 }}
          >
            <input type="hidden" name="id" value={respuesta.id} />
            <input type="hidden" name="formulario_id" value={formularioId} />

            <DialogoConfirmacion
              abierto={confirmandoBorrado}
              titulo={`¿Borrar la respuesta #${respuesta.numero} para siempre?`}
              descripcion={
                <>
                  Se elimina la respuesta y sus archivos adjuntos.{" "}
                  <strong style={{ color: "#1A2B4A" }}>
                    No se puede deshacer y no queda copia.
                  </strong>
                  <br />
                  <br />
                  Si lo que quieres es cerrar el caso, cambia el estado a
                  «Descartada»: se conserva todo y deja de aparecer como
                  pendiente.
                </>
              }
              textoConfirmar="Borrar definitivamente"
              onConfirmar={() => {
                setConfirmandoBorrado(false);
                formBorrarRef.current?.requestSubmit();
              }}
              onCancelar={() => setConfirmandoBorrado(false)}
            />

            {/* `type="button"`: abre el diálogo. El envío real lo dispara
                `requestSubmit()` al confirmar. */}
            <button
              type="button"
              onClick={() => setConfirmandoBorrado(true)}
              disabled={pendiente}
              className="inline-flex items-center gap-1.5"
              style={{
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "#9e1915",
              }}
            >
              <Trash2 size={13} /> Borrar definitivamente
            </button>
            <p style={{ fontSize: 12, color: "#6B6660", margin: "6px 0 0" }}>
              Úsalo solo si la persona pide que se eliminen sus datos. Para
              cerrar el caso sin borrar nada, cambia el estado a «Descartada».
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
