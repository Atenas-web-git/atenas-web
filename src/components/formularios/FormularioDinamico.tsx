"use client";

/**
 * Dibuja cualquier formulario a partir de su definición.
 *
 * Mobile first: en 375px todo ocupa el ancho completo y los campos marcados
 * como «medio» solo se ponen a dos columnas a partir de 640px.
 *
 * La validación de aquí es cortesía —evita el viaje al servidor para decir
 * «falta el correo»—. La que manda es la del endpoint, que usa exactamente
 * estas mismas funciones.
 */

import { useMemo, useRef, useState } from "react";
import { Check, Loader2, Paperclip, Send } from "lucide-react";
import type {
  CampoFormulario,
  DatosRespuesta,
  ValorCampo,
} from "@/lib/formularios/tipos";
import { EXTENSIONES_ARCHIVO_DEFAULT } from "@/lib/formularios/tipos";
import { validarRespuesta, type ErroresValidacion } from "@/lib/formularios/validar";
import type { FormularioPublico } from "@/lib/formularios/getFormulario";

const FUENTE = "Poppins, sans-serif";
const BORDE = "#E8E4DD";

/** Deben coincidir con los del endpoint. */
const CAMPO_TRAMPA = "_confirmacion_web";
const CAMPO_TIEMPO = "_t";

function valorInicial(campo: CampoFormulario): ValorCampo {
  if (campo.tipo === "aceptacion") return false;
  if (campo.tipo === "seleccion_multiple") return [];
  return "";
}

function valorInicialValido(
  campo: CampoFormulario,
  propuesto: string | undefined
): ValorCampo {
  if (!propuesto) return valorInicial(campo);
  if (campo.tipo === "aceptacion" || campo.tipo === "archivo") {
    return valorInicial(campo);
  }
  if (campo.tipo === "seleccion_unica") {
    return (campo.opciones ?? []).includes(propuesto)
      ? propuesto
      : valorInicial(campo);
  }
  if (campo.tipo === "seleccion_multiple") {
    return (campo.opciones ?? []).includes(propuesto) ? [propuesto] : [];
  }
  return propuesto;
}

export function FormularioDinamico({
  formulario,
  mostrarEncabezado = true,
  anchoBoton = "auto",
  colorBoton = "navy",
  valoresIniciales,
}: {
  formulario: FormularioPublico;
  /**
   * Las páginas que ya traen su propio título —contactos, quejas, las de
   * nivel— lo desactivan para no repetirlo. El texto sigue viviendo en el
   * formulario, solo que lo pinta la página con su tipografía.
   */
  mostrarEncabezado?: boolean;
  /** "completo" estira el botón, como lo tienen hoy algunas páginas. */
  anchoBoton?: "auto" | "completo";
  /**
   * Color del botón de envío. El de quejas y sugerencias es rojo desde que se
   * diseñó la página; forzarlo a azul aquí cambiaría una página ya aprobada.
   */
  colorBoton?: "navy" | "red";
  /**
   * Valores con los que arranca el formulario, por key de campo.
   *
   * Lo usan las páginas de nivel: /admisiones/inicial trae «Educación Inicial»
   * ya elegido en la lista, porque quien llega ahí ya dijo qué nivel le
   * interesa y volvérselo a preguntar es fricción gratis. Sigue pudiendo
   * cambiarlo.
   */
  valoresIniciales?: Record<string, string>;
}) {
  const [valores, setValores] = useState<DatosRespuesta>(() =>
    Object.fromEntries(
      formulario.campos.map((campo) => [
        campo.key,
        // Solo se acepta el valor de fuera si la lista lo contiene: un valor
        // que no está entre las opciones se rechazaría al enviar, y el
        // visitante vería un error sobre algo que él no escribió.
        valorInicialValido(campo, valoresIniciales?.[campo.key]),
      ])
    )
  );
  const [archivos, setArchivos] = useState<Record<string, File | null>>({});
  const [errores, setErrores] = useState<ErroresValidacion>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Momento en que se pintó el formulario. El servidor descarta los envíos
  // instantáneos, que son de robots.
  const pintadoEn = useRef<number>(Date.now());

  const keysConArchivo = useMemo(
    () => Object.entries(archivos).filter(([, f]) => f).map(([k]) => k),
    [archivos]
  );

  function actualizar(key: string, valor: ValorCampo) {
    setValores((prev) => ({ ...prev, [key]: valor }));
    // Quitar el error en cuanto la persona empieza a corregir: dejarlo puesto
    // mientras escribe es la forma más rápida de que un formulario se sienta
    // hostil.
    setErrores((prev) => {
      if (!prev[key]) return prev;
      const siguiente = { ...prev };
      delete siguiente[key];
      return siguiente;
    });
  }

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (enviando) return;

    const encontrados = validarRespuesta(
      formulario.campos,
      valores,
      keysConArchivo
    );
    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados);
      setErrorGeneral(null);
      // Llevar el foco al primer campo con problema.
      const primero = formulario.campos.find((c) => encontrados[c.key]);
      if (primero) {
        document.getElementById(`campo-${primero.key}`)?.focus();
      }
      return;
    }

    setEnviando(true);
    setErrorGeneral(null);

    const datos = new FormData();
    for (const campo of formulario.campos) {
      if (campo.tipo === "archivo") {
        const archivo = archivos[campo.key];
        if (archivo) datos.append(campo.key, archivo);
        continue;
      }
      const valor = valores[campo.key];
      if (Array.isArray(valor)) {
        for (const item of valor) datos.append(campo.key, String(item));
      } else if (typeof valor === "boolean") {
        datos.append(campo.key, valor ? "true" : "false");
      } else if (valor !== null && valor !== undefined) {
        datos.append(campo.key, String(valor));
      }
    }
    datos.append(CAMPO_TRAMPA, "");
    datos.append(CAMPO_TIEMPO, String(pintadoEn.current));

    try {
      const res = await fetch(`/api/formularios/${formulario.slug}`, {
        method: "POST",
        body: datos,
      });
      const cuerpo = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (cuerpo?.errores) {
          setErrores(cuerpo.errores as ErroresValidacion);
          setErrorGeneral("Revisa los campos marcados.");
        } else {
          setErrorGeneral(
            typeof cuerpo?.error === "string"
              ? cuerpo.error
              : "No pudimos enviar tu información. Intenta de nuevo."
          );
        }
        return;
      }

      setEnviado(true);
    } catch {
      setErrorGeneral(
        "No pudimos enviar tu información. Revisa tu conexión e intenta de nuevo."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div
        className="rounded-[12px] border px-6 py-10 text-center"
        style={{ borderColor: BORDE, background: "#FFFFFF", fontFamily: FUENTE }}
        role="status"
      >
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
          background:
            colorBoton === "red" ? "var(--color-red)" : "var(--color-navy)",
        }}
        >
          <Check size={26} color="#FFFFFF" strokeWidth={2.5} />
        </div>
        <h3
          className="text-[20px] font-bold"
          style={{ color: "var(--color-navy)" }}
        >
          {formulario.titulo_exito}
        </h3>
        <p
          className="mx-auto mt-2 max-w-[440px] text-[14px] leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {formulario.texto_exito}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate style={{ fontFamily: FUENTE }}>
      {mostrarEncabezado && (formulario.titulo || formulario.subtitulo) && (
        <div className="mb-6">
          {formulario.titulo && (
            <h3
              className="text-[22px] font-bold leading-tight sm:text-[26px]"
              style={{ color: "var(--color-navy)" }}
            >
              {formulario.titulo}
            </h3>
          )}
          {formulario.subtitulo && (
            <p
              className="mt-2 text-[14px] leading-relaxed"
              style={{ color: "var(--color-muted)" }}
            >
              {formulario.subtitulo}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-[18px] sm:flex-row sm:flex-wrap">
        {formulario.campos.map((campo) => (
          <Campo
            key={campo.key}
            campo={campo}
            valor={valores[campo.key] ?? null}
            archivo={archivos[campo.key] ?? null}
            error={errores[campo.key]}
            onChange={(valor) => actualizar(campo.key, valor)}
            onArchivo={(archivo) => {
              setArchivos((prev) => ({ ...prev, [campo.key]: archivo }));
              setErrores((prev) => {
                if (!prev[campo.key]) return prev;
                const siguiente = { ...prev };
                delete siguiente[campo.key];
                return siguiente;
              });
            }}
          />
        ))}
      </div>

      {/*
        Campo trampa. Invisible para una persona pero presente en el HTML, que
        es lo único que lee un robot de spam. `tabIndex={-1}` y
        `aria-hidden` lo dejan también fuera del teclado y del lector de
        pantalla, para que no moleste a quien navega sin ratón.
      */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={CAMPO_TRAMPA}>No rellenar</label>
        <input
          id={CAMPO_TRAMPA}
          name={CAMPO_TRAMPA}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {formulario.aviso_legal && (
        <p
          className="mt-5 text-[12px] leading-relaxed"
          style={{ color: "var(--color-muted)" }}
        >
          {formulario.aviso_legal}
        </p>
      )}

      {errorGeneral && (
        <p
          role="alert"
          className="mt-4 rounded-[8px] px-[14px] py-[10px] text-[13px]"
          style={{
            background: "rgba(158,25,21,0.08)",
            color: "var(--color-red)",
          }}
        >
          {errorGeneral}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className={`mt-6 inline-flex w-full items-center justify-center gap-[10px] rounded-[8px] px-[28px] py-[14px] text-[14px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          anchoBoton === "completo" ? "" : "sm:w-auto"
        }`}
        style={{
          background:
            colorBoton === "red" ? "var(--color-red)" : "var(--color-navy)",
        }}
      >
        {enviando ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        {enviando ? "Enviando…" : formulario.texto_boton}
      </button>
    </form>
  );
}

// ───────────────────────────────────────────────────────────
// Un campo
// ───────────────────────────────────────────────────────────

function Campo({
  campo,
  valor,
  archivo,
  error,
  onChange,
  onArchivo,
}: {
  campo: CampoFormulario;
  valor: ValorCampo;
  archivo: File | null;
  error?: string;
  onChange: (valor: ValorCampo) => void;
  onArchivo: (archivo: File | null) => void;
}) {
  const id = `campo-${campo.key}`;
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;

  const describedBy =
    [error ? idError : null, campo.ayuda ? idAyuda : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const anchoClase =
    campo.ancho === "medio"
      ? "w-full sm:w-[calc(50%-9px)]"
      : "w-full";

  const estiloBase = {
    fontFamily: FUENTE,
    color: "var(--color-navy)",
    borderColor: error ? "var(--color-red)" : BORDE,
  };

  const claseControl =
    "w-full rounded-[8px] border px-[14px] text-[13px] outline-none transition-colors focus:border-red";

  return (
    <div className={`flex flex-col gap-[6px] ${anchoClase}`}>
      {campo.tipo !== "aceptacion" && (
        <label
          htmlFor={id}
          className="text-[12px] font-semibold"
          style={{ color: "var(--color-navy)", fontFamily: FUENTE }}
        >
          {campo.etiqueta}
          {campo.obligatorio && (
            <span style={{ color: "var(--color-red)" }} aria-hidden>
              {" *"}
            </span>
          )}
        </label>
      )}

      {campo.tipo === "texto_largo" ? (
        <textarea
          id={id}
          name={campo.key}
          rows={5}
          placeholder={campo.placeholder}
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${claseControl} resize-none py-[10px]`}
          style={estiloBase}
        />
      ) : campo.tipo === "seleccion_unica" ? (
        <select
          id={id}
          name={campo.key}
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={claseControl}
          style={{ ...estiloBase, height: 44 }}
        >
          <option value="">Selecciona una opción</option>
          {(campo.opciones ?? []).map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      ) : campo.tipo === "seleccion_multiple" ? (
        <div
          className="flex flex-col gap-[10px] rounded-[8px] border px-[14px] py-[12px]"
          style={{ borderColor: error ? "var(--color-red)" : BORDE }}
          role="group"
          aria-describedby={describedBy}
        >
          {(campo.opciones ?? []).map((opcion) => {
            const marcadas = Array.isArray(valor) ? valor.map(String) : [];
            const activa = marcadas.includes(opcion);
            return (
              <label
                key={opcion}
                className="flex cursor-pointer items-center gap-[10px] text-[13px]"
                style={{ color: "var(--color-ink)" }}
              >
                <input
                  type="checkbox"
                  name={campo.key}
                  value={opcion}
                  checked={activa}
                  onChange={(e) =>
                    onChange(
                      e.target.checked
                        ? [...marcadas, opcion]
                        : marcadas.filter((m) => m !== opcion)
                    )
                  }
                  className="h-[16px] w-[16px] shrink-0 accent-[#1A2B4A]"
                />
                {opcion}
              </label>
            );
          })}
        </div>
      ) : campo.tipo === "aceptacion" ? (
        <label
          className="flex cursor-pointer items-start gap-[10px] text-[13px] leading-relaxed"
          style={{ color: "var(--color-ink)" }}
        >
          <input
            id={id}
            name={campo.key}
            type="checkbox"
            checked={valor === true}
            onChange={(e) => onChange(e.target.checked)}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className="mt-[3px] h-[16px] w-[16px] shrink-0 accent-[#1A2B4A]"
          />
          <span>
            {campo.etiqueta}
            {campo.obligatorio && (
              <span style={{ color: "var(--color-red)" }} aria-hidden>
                {" *"}
              </span>
            )}
          </span>
        </label>
      ) : campo.tipo === "archivo" ? (
        <div>
          <label
            htmlFor={id}
            className="flex cursor-pointer items-center gap-[10px] rounded-[8px] border border-dashed px-[14px] py-[12px] text-[13px] transition-colors"
            style={{
              borderColor: error ? "var(--color-red)" : BORDE,
              color: archivo ? "var(--color-navy)" : "var(--color-muted)",
            }}
          >
            <Paperclip size={16} />
            <span className="truncate">
              {archivo ? archivo.name : "Elegir archivo"}
            </span>
          </label>
          <input
            id={id}
            name={campo.key}
            type="file"
            accept={(campo.acepta ?? EXTENSIONES_ARCHIVO_DEFAULT).join(",")}
            onChange={(e) => onArchivo(e.target.files?.[0] ?? null)}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            className="sr-only"
          />
        </div>
      ) : (
        <input
          id={id}
          name={campo.key}
          type={
            campo.tipo === "correo"
              ? "email"
              : campo.tipo === "telefono"
                ? "tel"
                : campo.tipo === "numero"
                  ? "number"
                  : campo.tipo === "fecha"
                    ? "date"
                    : "text"
          }
          inputMode={
            campo.tipo === "telefono"
              ? "tel"
              : campo.tipo === "numero"
                ? "numeric"
                : undefined
          }
          placeholder={campo.placeholder}
          value={String(valor ?? "")}
          onChange={(e) => onChange(e.target.value)}
          min={campo.tipo === "numero" ? campo.min : undefined}
          max={campo.tipo === "numero" ? campo.max : undefined}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={claseControl}
          style={{ ...estiloBase, height: 44 }}
        />
      )}

      {campo.ayuda && (
        <p id={idAyuda} className="text-[11px]" style={{ color: "var(--color-muted)" }}>
          {campo.ayuda}
        </p>
      )}

      {error && (
        <p
          id={idError}
          className="text-[11px] font-semibold"
          style={{ color: "var(--color-red)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
