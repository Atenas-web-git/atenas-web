/**
 * Vista previa del subrayado dorado para los editores del admin.
 *
 * Se coloca debajo del campo "parte resaltada" de un título. Muestra cómo
 * quedará el título con la palabra subrayada — o un aviso claro si la
 * palabra escrita no se encuentra dentro del título, para que el editor
 * lo corrija ANTES de guardar (antes esto fallaba en silencio).
 */

import { splitHighlight } from "@/lib/cms/highlight";

export function HighlightPreview({
  text,
  highlight,
}: {
  text?: string;
  highlight?: string;
}) {
  const titulo = (text ?? "").trim();
  if (!titulo) return null;

  const parts = splitHighlight(text ?? "", highlight);
  const tieneHighlight = !!(highlight ?? "").replace(/[{}]/g, "").trim();

  return (
    <div
      style={{
        marginTop: 6,
        padding: "8px 10px",
        background: "#F4F1EB",
        border: "1px solid #E8E4DD",
        borderRadius: 6,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "#9A958C",
        }}
      >
        Vista previa
      </span>
      <p
        style={{
          margin: "3px 0 0",
          fontSize: 14,
          color: "#1A2B4A",
          lineHeight: 1.5,
        }}
      >
        {parts ? (
          <>
            {parts.before}
            <span
              style={{
                position: "relative",
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {parts.match}
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -2,
                  height: 3,
                  background: "#9e1915",
                  borderRadius: 999,
                }}
              />
            </span>
            {parts.after}
          </>
        ) : (
          titulo
        )}
      </p>
      {!parts && tieneHighlight && (
        <p style={{ margin: "5px 0 0", fontSize: 12, color: "#B45309", lineHeight: 1.4 }}>
          ⚠ «{highlight}» no se encontró dentro del título. Revísalo: debe ser
          una palabra o frase que aparezca tal cual en el título (las
          mayúsculas y las tildes no importan).
        </p>
      )}
    </div>
  );
}
