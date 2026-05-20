/**
 * Helpers de conversión tiempo ↔ segundos para los loops de video.
 *
 * El schema del CMS guarda los tiempos como SEGUNDOS (number) — esto NO
 * cambia. Solo la UI del editor muestra/acepta el formato `mm:ss` (o
 * `h:mm:ss`) para que sea cómodo ingresar "del minuto 2:32 al 3:20".
 */

/**
 * Convierte un string de tiempo a segundos.
 * Acepta: "152" (solo segundos), "2:32" (mm:ss), "1:05:30" (h:mm:ss).
 * Devuelve 0 si el input es inválido o vacío.
 */
export function parseTimeToSeconds(input: string): number {
  const s = (input ?? "").trim();
  if (!s) return 0;

  // Solo dígitos → ya son segundos
  if (/^\d+$/.test(s)) {
    return Math.max(0, parseInt(s, 10));
  }

  // Formato con ":" — h:mm:ss o mm:ss
  const parts = s.split(":").map((p) => p.trim());
  if (parts.length < 2 || parts.length > 3) return 0;
  if (parts.some((p) => p === "" || !/^\d+$/.test(p))) return 0;

  const nums = parts.map((p) => parseInt(p, 10));
  let total = 0;
  if (nums.length === 3) {
    total = nums[0] * 3600 + nums[1] * 60 + nums[2];
  } else {
    total = nums[0] * 60 + nums[1];
  }
  return Math.max(0, total);
}

/**
 * Convierte segundos a string `mm:ss` (o `h:mm:ss` si supera la hora).
 * Ej. 152 → "2:32", 0 → "0:00", 3930 → "1:05:30".
 */
export function formatSecondsToTime(totalSeconds: number): string {
  const secs = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}
