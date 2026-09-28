"use client";

/**
 * Dictado por voz con el reconocimiento del propio navegador (Web Speech
 * API). Gratis y sin clave: no pasa por el proveedor de IA del colegio.
 *
 * Lo que hay que saber antes de tocarlo:
 *
 * - Existe en Chrome, Edge y Safari; en Firefox no. Donde no existe,
 *   `disponible` es `false` y el botón del micrófono no se pinta.
 * - El audio lo transcribe el fabricante del navegador (Google en Chrome y
 *   Edge, Apple en Safari), no el panel. El manual lo dice; aquí no se graba
 *   nada.
 * - El navegador pide permiso de micrófono la primera vez. Si se niega, el
 *   error `not-allowed` llega aquí y se le dice al usuario dónde arreglarlo.
 * - `continuous` para que no corte a la primera pausa: quien dicta una
 *   pregunta piensa a mitad. Se para con el mismo botón, al enviar o al cerrar.
 */

import { useCallback, useEffect, useRef, useState } from "react";

type ResultadoDictado = {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }>;
};

type Reconocedor = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: ResultadoDictado) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

type VentanaConDictado = Window & {
  SpeechRecognition?: new () => Reconocedor;
  webkitSpeechRecognition?: new () => Reconocedor;
};

function constructor(): (new () => Reconocedor) | null {
  if (typeof window === "undefined") return null;
  const w = window as VentanaConDictado;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

const MENSAJES: Record<string, string> = {
  "not-allowed":
    "El navegador no dio permiso para usar el micrófono. Si lo negaste, se vuelve a dar desde el candado de la barra de direcciones; si no te lo preguntó, escribe la pregunta.",
  "service-not-allowed":
    "El navegador no dio permiso para usar el micrófono. Si lo negaste, se vuelve a dar desde el candado de la barra de direcciones; si no te lo preguntó, escribe la pregunta.",
  "audio-capture": "No se encontró ningún micrófono.",
  network: "El reconocimiento de voz del navegador no responde. Escribe la pregunta.",
  "language-not-supported": "Este navegador no reconoce voz en español. Escribe la pregunta.",
};

/**
 * @param onTexto recibe lo dictado hasta ahora: `final` es lo ya reconocido,
 *   `provisional` lo que el navegador todavía está afinando. Quien lo usa
 *   pinta `base + final + provisional`.
 */
export function useDictado(onTexto: (final: string, provisional: string) => void) {
  // Perezoso y no en un efecto: el botón del micrófono solo se pinta con la
  // ventana abierta, que es siempre después de hidratar, así que no hay
  // desajuste entre servidor y navegador.
  const [disponible] = useState(() => constructor() !== null);
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reconocedor = useRef<Reconocedor | null>(null);
  const finalAcumulado = useRef("");
  const onTextoRef = useRef(onTexto);

  // En un efecto y no en el render: la regla `react-hooks/refs` lo exige, y
  // así el reconocedor llama siempre a la última versión del callback.
  useEffect(() => {
    onTextoRef.current = onTexto;
  }, [onTexto]);

  const parar = useCallback(() => {
    reconocedor.current?.stop();
  }, []);

  const empezar = useCallback(() => {
    const Ctor = constructor();
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = "es-EC";
    r.continuous = true;
    r.interimResults = true;
    finalAcumulado.current = "";

    r.onresult = (e) => {
      let provisional = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const t = res[0].transcript;
        if (res.isFinal) finalAcumulado.current += t;
        else provisional += t;
      }
      onTextoRef.current(finalAcumulado.current, provisional);
    };
    r.onerror = (e) => {
      // «no-speech» y «aborted» no son errores para quien dicta: solo paró.
      if (e.error === "no-speech" || e.error === "aborted") return;
      setError(MENSAJES[e.error] ?? "No se pudo usar el micrófono. Escribe la pregunta.");
    };
    r.onend = () => {
      setEscuchando(false);
      reconocedor.current = null;
    };

    setError(null);
    reconocedor.current = r;
    try {
      r.start();
      setEscuchando(true);
    } catch {
      reconocedor.current = null;
      setError("No se pudo usar el micrófono. Escribe la pregunta.");
    }
  }, []);

  const alternar = useCallback(() => {
    if (reconocedor.current) parar();
    else empezar();
  }, [empezar, parar]);

  // Al desmontar no puede quedar un micrófono abierto: `abort` corta sin
  // esperar resultados. Ojo: cerrar la ventana de ayuda NO desmonta este hook
  // —`AsistenteFlotante` vive en el layout del panel—; por eso quien cierra
  // llama a `parar()` a mano. Esto es la red de seguridad para el cierre de
  // sesión y el desmontaje del layout.
  useEffect(() => {
    return () => {
      reconocedor.current?.abort();
      reconocedor.current = null;
    };
  }, []);

  const limpiarError = useCallback(() => setError(null), []);

  return { disponible, escuchando, error, alternar, parar, limpiarError };
}
