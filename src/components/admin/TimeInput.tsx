"use client";

import { useEffect, useState } from "react";
import { parseTimeToSeconds, formatSecondsToTime } from "@/lib/cms/timeFormat";

/**
 * Input de tiempo para loops de video. El editor escribe en formato
 * `mm:ss` (ej. "2:32") y el componente reporta SEGUNDOS al `onChange`.
 *
 * - `value` se recibe en segundos (number).
 * - Al hacer blur, se parsea el texto y se normaliza al formato canónico.
 * - Acepta también escribir solo segundos crudos ("152") por compatibilidad.
 */
export function TimeInput({
  value,
  onChange,
  placeholder = "0:00",
  style,
  disabled = false,
}: {
  value: number;
  onChange: (seconds: number) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const [text, setText] = useState(() => formatSecondsToTime(value));

  // Si el valor externo cambia (ej. al detectar el inicio desde la URL),
  // re-sincronizamos el texto visible.
  useEffect(() => {
    setText(formatSecondsToTime(value));
  }, [value]);

  const commit = () => {
    const secs = parseTimeToSeconds(text);
    onChange(secs);
    setText(formatSecondsToTime(secs));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
        }
      }}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
    />
  );
}
