/**
 * Convierte la imagen que el usuario pegó, soltó o eligió en lo que viaja al
 * asistente: un JPEG de como mucho 1600 px de lado, en data URL.
 *
 * Una captura de pantalla de un monitor grande en PNG pesa 2–5 MB; a 1600 px
 * y JPEG queda en 150–400 KB y el texto sigue legible para el modelo. Si aun
 * así pasa del tope (`MAX_CAPTURA_BASE64`), se vuelve a intentar más pequeña
 * y con más compresión, una vez.
 *
 * Corre en el navegador. Con `Image` y no `createImageBitmap`: Safari lo
 * soporta desde hace poco y aquí no hace falta.
 */

import { MAX_CAPTURA_BASE64 } from "@/lib/asistente/captura";

const LADO_MAX = 1600;
const CALIDAD = 0.85;

function cargar(archivo: Blob): Promise<HTMLImageElement> {
  return new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(archivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolver(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      rechazar(new Error("No se pudo leer la imagen."));
    };
    img.src = url;
  });
}

function reducir(img: HTMLImageElement, ladoMax: number, calidad: number): string {
  const escala = Math.min(1, ladoMax / Math.max(img.naturalWidth, img.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(img.naturalWidth * escala));
  canvas.height = Math.max(1, Math.round(img.naturalHeight * escala));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen.");
  // Fondo blanco: un PNG con transparencia se volvería negro al pasar a JPEG.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", calidad);
}

export async function prepararCaptura(archivo: Blob): Promise<string> {
  if (!archivo.type.startsWith("image/")) throw new Error("Solo se pueden adjuntar imágenes.");
  const img = await cargar(archivo);
  let dataUrl = reducir(img, LADO_MAX, CALIDAD);
  if (dataUrl.length > MAX_CAPTURA_BASE64) dataUrl = reducir(img, 1200, 0.7);
  if (dataUrl.length > MAX_CAPTURA_BASE64) {
    throw new Error("La captura es demasiado grande. Recórtala a la parte que importa.");
  }
  return dataUrl;
}

/** La imagen del portapapeles, si la hay. */
export function imagenDelPortapapeles(e: ClipboardEvent): File | null {
  for (const item of e.clipboardData?.items ?? []) {
    if (item.kind === "file" && item.type.startsWith("image/")) return item.getAsFile();
  }
  return null;
}
