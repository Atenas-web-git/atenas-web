import { Fragment } from "react";
import { ChevronRight, Info, Lightbulb, AlertTriangle, OctagonAlert } from "lucide-react";
import type { Bloque, Tono } from "./tipos";

/* ── Inline: **negrita**, `código`, [texto](url) ─────────────────── */

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export function Inline({ texto }: { texto: string }) {
  const partes = texto.split(INLINE_RE).filter((p) => p !== "");

  return (
    <>
      {partes.map((parte, i) => {
        if (parte.startsWith("**") && parte.endsWith("**")) {
          return (
            <strong key={i} style={{ fontWeight: 700, color: "#1A2B4A" }}>
              {parte.slice(2, -2)}
            </strong>
          );
        }
        if (parte.startsWith("`") && parte.endsWith("`")) {
          return (
            <code
              key={i}
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: "0.92em",
                background: "#F4F1EB",
                border: "1px solid #E8E4DD",
                borderRadius: 4,
                padding: "1px 5px",
                color: "#1A2B4A",
                whiteSpace: "nowrap",
              }}
            >
              {parte.slice(1, -1)}
            </code>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(parte);
        if (link) {
          const externo = link[2].startsWith("http");
          return (
            <a
              key={i}
              href={link[2]}
              target={externo ? "_blank" : undefined}
              rel={externo ? "noopener noreferrer" : undefined}
              style={{ color: "#1A2B4A", fontWeight: 600, textDecoration: "underline" }}
            >
              {link[1]}
            </a>
          );
        }
        return <Fragment key={i}>{parte}</Fragment>;
      })}
    </>
  );
}

/* ── Notas ───────────────────────────────────────────────────────── */

const TONOS: Record<Tono, { bg: string; borde: string; fg: string; Icono: typeof Info; etiqueta: string }> = {
  info: { bg: "#EEF2FF", borde: "#C7D2FE", fg: "#3730A3", Icono: Info, etiqueta: "Nota" },
  tip: { bg: "#F0FDF4", borde: "#BBF7D0", fg: "#065F46", Icono: Lightbulb, etiqueta: "Consejo" },
  aviso: { bg: "#FEF3C7", borde: "#FDE68A", fg: "#92400E", Icono: AlertTriangle, etiqueta: "Atención" },
  peligro: { bg: "#FEE2E2", borde: "#FECACA", fg: "#991B1B", Icono: OctagonAlert, etiqueta: "Cuidado" },
};

/* ── Renderer ────────────────────────────────────────────────────── */

const textoBase: React.CSSProperties = {
  fontSize: 14.5,
  lineHeight: 1.7,
  color: "#4A4640",
  margin: 0,
};

export function RenderBloque({ bloque }: { bloque: Bloque }) {
  switch (bloque.t) {
    case "p":
      return (
        <p style={textoBase}>
          <Inline texto={bloque.texto} />
        </p>
      );

    case "sub":
      return (
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#1A2B4A",
            margin: "10px 0 0",
            letterSpacing: 0.2,
          }}
        >
          {bloque.texto}
        </h3>
      );

    case "pasos":
      return (
        <ol className="flex flex-col gap-2.5" style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {bloque.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#1A2B4A",
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                {i + 1}
              </span>
              <span style={textoBase}>
                <Inline texto={item} />
              </span>
            </li>
          ))}
        </ol>
      );

    case "lista":
      return (
        <ul className="flex flex-col gap-1.5" style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {bloque.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span
                className="flex-shrink-0"
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#9e1915",
                  marginTop: 9,
                }}
              />
              <span style={textoBase}>
                <Inline texto={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case "nota": {
      const { bg, borde, fg, Icono, etiqueta } = TONOS[bloque.tono];
      return (
        <div
          className="flex items-start gap-3 px-4 py-3"
          style={{ background: bg, border: `1px solid ${borde}`, borderRadius: 10 }}
        >
          <Icono size={15} color={fg} strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 3 }} />
          <p style={{ ...textoBase, color: fg, fontSize: 14 }}>
            <strong style={{ fontWeight: 700 }}>{etiqueta}: </strong>
            <Inline texto={bloque.texto} />
          </p>
        </div>
      );
    }

    case "tabla":
      return (
        <div style={{ overflowX: "auto", border: "1px solid #E8E4DD", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 460 }}>
            <thead>
              <tr style={{ background: "#FAFAF8" }}>
                {bloque.encabezados.map((h, i) => (
                  <th
                    key={i}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6B6660",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      borderBottom: "1px solid #E8E4DD",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloque.filas.map((fila, i) => (
                <tr key={i} style={{ borderTop: i === 0 ? "none" : "1px solid #F1EEE8" }}>
                  {fila.map((celda, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "10px 14px",
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        color: j === 0 ? "#1A2B4A" : "#4A4640",
                        fontWeight: j === 0 ? 600 : 400,
                        verticalAlign: "top",
                      }}
                    >
                      <Inline texto={celda} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "ruta":
      return (
        <div
          className="flex items-center gap-1.5 flex-wrap px-3 py-2"
          style={{ background: "#F4F1EB", borderRadius: 8, width: "fit-content" }}
        >
          {bloque.pasos.map((paso, i) => (
            <Fragment key={i}>
              {i > 0 && <ChevronRight size={12} color="#A0AABA" strokeWidth={2.5} />}
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{paso}</span>
            </Fragment>
          ))}
        </div>
      );

    case "campos":
      return (
        <div className="flex flex-col" style={{ border: "1px solid #E8E4DD", borderRadius: 10, overflow: "hidden" }}>
          {bloque.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-1 sm:gap-4 px-4 py-2.5"
              style={{ borderTop: i === 0 ? "none" : "1px solid #F1EEE8", background: "#FFFFFF" }}
            >
              <span
                style={{
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#1A2B4A",
                  flexShrink: 0,
                  width: "100%",
                  maxWidth: 210,
                }}
              >
                {item.campo}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.6, color: "#6B6660" }}>
                <Inline texto={item.desc} />
              </span>
            </div>
          ))}
        </div>
      );
  }
}

export function RenderBloques({ bloques }: { bloques: Bloque[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {bloques.map((b, i) => (
        <RenderBloque key={i} bloque={b} />
      ))}
    </div>
  );
}
