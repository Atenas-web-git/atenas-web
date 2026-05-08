/**
 * Utilidades para procesar enlaces de Google Drive pegados por el usuario
 * en el editor de Documentos.
 *
 * Formatos aceptados de entrada:
 * - https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing
 * - https://drive.google.com/file/d/<FILE_ID>/edit
 * - https://drive.google.com/open?id=<FILE_ID>
 * - https://drive.google.com/uc?id=<FILE_ID>&export=download
 * - https://docs.google.com/document/d/<FILE_ID>/edit  (Docs)
 * - https://docs.google.com/spreadsheets/d/<FILE_ID>/edit  (Sheets)
 *
 * Cualquier otro string se devuelve sin modificar (URL externa libre).
 */

const DRIVE_HOSTS = ["drive.google.com", "docs.google.com"];

/** Extrae el FILE_ID de cualquier URL de Drive/Docs reconocida. */
export function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }
  if (!DRIVE_HOSTS.includes(parsed.hostname)) return null;

  // Patrón "/file/d/<id>" o "/document/d/<id>" o "/spreadsheets/d/<id>"
  const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Patrón "?id=<id>"
  const id = parsed.searchParams.get("id");
  if (id) return id;

  return null;
}

/**
 * Devuelve la URL más adecuada para que el usuario descargue el documento.
 *
 * - Si la URL es de Drive y se puede extraer FILE_ID, devuelve la URL de
 *   descarga directa `https://drive.google.com/uc?export=download&id=<FILE_ID>`
 *   (descarga inmediata sin pasar por el visor de Drive).
 * - Si la URL es de Docs/Sheets/Slides (host docs.google.com), devuelve la
 *   URL original — abrir en Google Docs es lo que el usuario espera.
 * - Si la URL no es de Drive, devuelve sin modificar (puede ser cualquier
 *   URL externa: Dropbox, OneDrive, sitio del colegio, etc.).
 */
export function toDownloadUrl(url: string): string {
  if (!url) return url;
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch {
    return url;
  }
  // docs.google.com → no convertir, abrir en su app nativa
  if (parsed.hostname === "docs.google.com") return url;
  if (parsed.hostname !== "drive.google.com") return url;

  const fileId = extractDriveFileId(url);
  if (!fileId) return url;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/** True si la URL es válida (parseable) y opcionalmente de Drive. */
export function isDriveUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    return DRIVE_HOSTS.includes(parsed.hostname);
  } catch {
    return false;
  }
}
