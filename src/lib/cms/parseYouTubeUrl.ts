/**
 * Utilidades para procesar enlaces de YouTube pegados por el usuario en
 * el editor de la plantilla Historia (sección Trayectoria).
 *
 * Formatos aceptados de entrada:
 * - https://www.youtube.com/watch?v=<ID>
 * - https://www.youtube.com/watch?v=<ID>&t=28s
 * - https://youtu.be/<ID>
 * - https://youtu.be/<ID>?t=28
 * - https://www.youtube.com/embed/<ID>
 * - https://www.youtube.com/shorts/<ID>
 *
 * Cualquier otro string devuelve null (no es URL válida de YouTube).
 */

const YT_HOSTS = [
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
];

export type YouTubeMeta = {
  videoId: string;
  /** Segundos de inicio detectados del parámetro `t=` del link, o null. */
  startSeconds: number | null;
};

/** Extrae el ID del video y el `t=` si está. Devuelve null si no es YouTube. */
export function parseYouTubeUrl(url: string): YouTubeMeta | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (!YT_HOSTS.includes(parsed.hostname)) return null;

  let videoId: string | null = null;

  if (parsed.hostname === "youtu.be") {
    // youtu.be/<ID>
    videoId = parsed.pathname.replace(/^\//, "").split("/")[0] || null;
  } else {
    // youtube.com/watch?v=<ID>
    videoId = parsed.searchParams.get("v");
    if (!videoId) {
      // youtube.com/embed/<ID> o /shorts/<ID>
      const m = parsed.pathname.match(/\/(?:embed|shorts|v)\/([a-zA-Z0-9_-]+)/);
      if (m) videoId = m[1];
    }
  }

  if (!videoId) return null;

  // `t` puede venir como "28" o "28s" o "1m30s"
  const tParam = parsed.searchParams.get("t") ?? parsed.searchParams.get("start");
  const startSeconds = tParam ? parseDurationToSeconds(tParam) : null;

  return { videoId, startSeconds };
}

/** Convierte "28", "28s", "1m30s" o "1h2m3s" a segundos. */
function parseDurationToSeconds(input: string): number | null {
  const s = input.trim().toLowerCase();
  if (/^\d+$/.test(s)) return Number(s);
  // Patrón con unidades h/m/s
  const match = s.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (!match) return null;
  const [, h, m, sec] = match;
  const total = (Number(h ?? 0) * 3600) + (Number(m ?? 0) * 60) + Number(sec ?? 0);
  return total > 0 || s === "0" ? total : null;
}

/** True si la URL es de YouTube y el videoId es extraíble. */
export function isYouTubeUrl(url: string): boolean {
  return parseYouTubeUrl(url) !== null;
}
