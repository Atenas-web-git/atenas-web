/**
 * Validación de respuestas — la misma en el navegador y en el servidor.
 *
 * El servidor es la autoridad: la validación del navegador solo evita que el
 * visitante mande el formulario para que se lo devuelvan. Cualquiera puede
 * saltarse la del navegador con una línea de curl, así que el endpoint vuelve
 * a validar SIEMPRE con esta misma función.
 *
 * No importa nada de React ni de Next para poder usarse en los dos lados.
 */

import type {
  CampoFormulario,
  DatosRespuesta,
  ValorCampo,
} from "./tipos";

export type ErroresValidacion = Record<string, string>;

/**
 * Correo: comprobación deliberadamente laxa. La expresión estricta del RFC
 * rechaza direcciones válidas y no atrapa las inválidas que importan (un
 * dominio que no existe pasa cualquier expresión regular). Lo que de verdad
 * confirma un correo es el envío.
 */
export const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Comprueba que una cadena sea UNA sola dirección.
 *
 * Importa más de lo que parece: `sendEmail` parte el destinatario por comas y
 * por puntos y coma, así que una cadena con separadores se convierte en un
 * envío múltiple. Cualquier dirección que salga de un formulario público tiene
 * que pasar por aquí antes de usarse como destinatario.
 */
export function esCorreoUnico(valor: string): boolean {
  const limpio = valor.trim();
  if (limpio.length > 254) return false;
  if (/[,;\s]/.test(limpio)) return false;
  return RE_CORREO.test(limpio);
}

/**
 * Teléfono: dígitos, espacios, guiones, paréntesis y un `+` inicial. Entre 7
 * y 15 dígitos, que cubre desde un fijo de Ambato (032xxxxxx) hasta un número
 * internacional completo.
 */
const RE_TELEFONO = /^\+?[\d\s()-]{7,20}$/;

const RE_FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** Longitud máxima por defecto de un campo de una línea. */
const MAX_TEXTO = 200;
/** Longitud máxima por defecto de un campo de varias líneas. */
const MAX_TEXTO_LARGO = 5000;

function esVacio(valor: ValorCampo): boolean {
  if (valor === null || valor === undefined) return true;
  if (typeof valor === "string") return valor.trim() === "";
  if (Array.isArray(valor)) return valor.length === 0;
  if (typeof valor === "boolean") return valor === false;
  return false;
}

function contarDigitos(valor: string): number {
  return (valor.match(/\d/g) ?? []).length;
}

/**
 * Valida un campo suelto. Devuelve el mensaje de error, o null si está bien.
 *
 * `tieneArchivo` se pasa aparte porque los archivos no viajan dentro de
 * `datos`: en el navegador son objetos File y en el servidor llegan por
 * FormData. Aquí solo interesa si hay uno o no.
 */
export function validarCampo(
  campo: CampoFormulario,
  valor: ValorCampo,
  tieneArchivo = false
): string | null {
  if (campo.tipo === "archivo") {
    if (campo.obligatorio && !tieneArchivo) {
      return "Adjunta un archivo.";
    }
    return null;
  }

  if (campo.tipo === "aceptacion") {
    if (campo.obligatorio && valor !== true) {
      return "Debes marcar esta casilla para continuar.";
    }
    return null;
  }

  if (esVacio(valor)) {
    return campo.obligatorio ? "Este campo es obligatorio." : null;
  }

  switch (campo.tipo) {
    case "texto":
    case "texto_largo": {
      const texto = String(valor).trim();
      const limite =
        campo.maxLength ??
        (campo.tipo === "texto_largo" ? MAX_TEXTO_LARGO : MAX_TEXTO);
      if (texto.length > limite) {
        return `Máximo ${limite} caracteres (llevas ${texto.length}).`;
      }
      return null;
    }

    case "correo": {
      const texto = String(valor).trim();
      if (!RE_CORREO.test(texto)) return "Escribe un correo válido.";
      if (texto.length > 254) return "El correo es demasiado largo.";
      return null;
    }

    case "telefono": {
      const texto = String(valor).trim();
      if (!RE_TELEFONO.test(texto)) return "Escribe un teléfono válido.";
      const digitos = contarDigitos(texto);
      if (digitos < 7) return "El teléfono tiene muy pocos dígitos.";
      if (digitos > 15) return "El teléfono tiene demasiados dígitos.";
      return null;
    }

    case "numero": {
      const numero = typeof valor === "number" ? valor : Number(String(valor).trim());
      if (!Number.isFinite(numero)) return "Escribe solo números.";
      if (campo.min !== undefined && numero < campo.min) {
        return `El valor mínimo es ${campo.min}.`;
      }
      if (campo.max !== undefined && numero > campo.max) {
        return `El valor máximo es ${campo.max}.`;
      }
      return null;
    }

    case "fecha": {
      const texto = String(valor).trim();
      if (!RE_FECHA.test(texto)) return "Elige una fecha válida.";
      // Comprobar que existe de verdad: 2026-02-31 pasa la expresión regular.
      const [a, m, d] = texto.split("-").map(Number);
      const fecha = new Date(Date.UTC(a, m - 1, d));
      if (
        fecha.getUTCFullYear() !== a ||
        fecha.getUTCMonth() !== m - 1 ||
        fecha.getUTCDate() !== d
      ) {
        return "Esa fecha no existe.";
      }
      return null;
    }

    case "seleccion_unica": {
      const texto = String(valor).trim();
      const opciones = campo.opciones ?? [];
      if (opciones.length > 0 && !opciones.includes(texto)) {
        return "Elige una de las opciones de la lista.";
      }
      return null;
    }

    case "seleccion_multiple": {
      const marcadas = Array.isArray(valor) ? valor.map(String) : [String(valor)];
      const opciones = campo.opciones ?? [];
      if (opciones.length > 0) {
        const invalida = marcadas.find((m) => !opciones.includes(m));
        if (invalida) return "Elige solo opciones de la lista.";
      }
      return null;
    }

    default:
      return null;
  }
}

/**
 * Valida el formulario entero. Devuelve un mapa key → mensaje; vacío si todo
 * está bien.
 *
 * `keysConArchivo` son las keys de los campos de archivo que sí traen uno.
 */
export function validarRespuesta(
  campos: CampoFormulario[],
  datos: DatosRespuesta,
  keysConArchivo: string[] = []
): ErroresValidacion {
  const errores: ErroresValidacion = {};

  for (const campo of campos) {
    const error = validarCampo(
      campo,
      datos[campo.key] ?? null,
      keysConArchivo.includes(campo.key)
    );
    if (error) errores[campo.key] = error;
  }

  return errores;
}

/**
 * Deja los datos como se guardan: recorta espacios, descarta claves que no
 * corresponden a ningún campo del formulario y normaliza los tipos.
 *
 * Descartar lo que sobra importa: sin esto, quien envíe el formulario puede
 * añadir claves arbitrarias al JSON y quedarían guardadas en `datos` y
 * volcadas dentro del correo interno.
 */
export function normalizarDatos(
  campos: CampoFormulario[],
  entrada: Record<string, unknown>
): DatosRespuesta {
  const salida: DatosRespuesta = {};

  for (const campo of campos) {
    // Los archivos van en su propia columna. Sin este corte, el campo acaba
    // guardado como `"hoja_de_vida": null` dentro de los datos, y luego sale
    // como una fila vacía en el correo y en la exportación.
    if (campo.tipo === "archivo") continue;

    const bruto = entrada[campo.key];
    if (bruto === undefined || bruto === null) {
      salida[campo.key] = campo.tipo === "aceptacion" ? false : null;
      continue;
    }

    switch (campo.tipo) {
      case "aceptacion":
        salida[campo.key] = bruto === true || bruto === "true" || bruto === "on";
        break;

      case "numero": {
        const numero = Number(String(bruto).trim());
        salida[campo.key] = Number.isFinite(numero) ? numero : null;
        break;
      }

      case "seleccion_multiple": {
        const lista = Array.isArray(bruto) ? bruto : [bruto];
        salida[campo.key] = lista
          .map((v) => String(v).trim())
          .filter((v) => v !== "");
        break;
      }

      default: {
        const texto = String(bruto).trim();
        const limite =
          campo.maxLength ??
          (campo.tipo === "texto_largo" ? MAX_TEXTO_LARGO : MAX_TEXTO);
        salida[campo.key] = texto.slice(0, limite);
        break;
      }
    }
  }

  return salida;
}

/** Texto legible de un valor, para el correo y la exportación a CSV. */
export function valorLegible(valor: ValorCampo): string {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "boolean") return valor ? "Sí" : "No";
  if (Array.isArray(valor)) return valor.join(", ");
  return String(valor);
}

/**
 * Comprueba que la definición de campos sea coherente antes de guardarla.
 * Lo usa el panel: un formulario con dos campos que comparten key guardaría
 * una sola respuesta de los dos, y el editor no tiene por qué darse cuenta.
 */
export function validarDefinicion(campos: CampoFormulario[]): string | null {
  if (campos.length === 0) {
    return "Añade al menos un campo al formulario.";
  }

  const keys = new Set<string>();
  for (const campo of campos) {
    if (!campo.etiqueta.trim()) {
      return "Todos los campos necesitan una etiqueta.";
    }
    if (!campo.key.trim()) {
      return `El campo «${campo.etiqueta}» no tiene identificador.`;
    }
    if (keys.has(campo.key)) {
      return `Hay dos campos con el mismo identificador («${campo.key}»). Cambia la etiqueta de uno.`;
    }
    keys.add(campo.key);

    if (
      (campo.tipo === "seleccion_unica" || campo.tipo === "seleccion_multiple") &&
      (campo.opciones ?? []).filter((o) => o.trim()).length === 0
    ) {
      return `El campo «${campo.etiqueta}» necesita al menos una opción.`;
    }
  }

  return null;
}
