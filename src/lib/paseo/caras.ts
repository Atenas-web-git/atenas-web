/**
 * Convierte una fotografía 360° en las seis caras del cubo que usa el visor.
 *
 * ## Por qué hace falta
 *
 * Una cámara 360° entrega **una sola imagen equirectangular**: el mundo
 * estirado en un rectángulo de 2:1, como un planisferio. El visor, en cambio,
 * pinta **seis caras de un cubo**. Alguien tiene que traducir, y ese alguien no
 * puede ser el servidor: son 25 millones de píxeles por foto y las funciones de
 * Vercel se cortan a los pocos segundos. Se hace aquí, en el navegador de quien
 * sube la foto, que para esto va sobrado.
 *
 * ## ⚠️ La orientación de arriba y abajo
 *
 * Las 63 escenas que vinieron del tour de 2016 guardan el techo y el suelo
 * **girados media vuelta**, y el visor lo compensa con `flipTopBottom`. Para que
 * una foto nueva encaje con esa regla, aquí se giran igual. Si algún día se
 * quita `flipTopBottom` del visor, hay que quitar también `GIRAR_TECHO_Y_SUELO`
 * de aquí — y regenerar las 63 viejas. Mezclar las dos convenciones deja unas
 * escenas bien y otras del revés, que es de las cosas que no se ven hasta que
 * alguien mira al techo.
 */

/** Las seis caras, en el orden en el que las nombra el visor. */
export const CARAS = ["front", "right", "back", "left", "top", "bottom"] as const;
export type Cara = (typeof CARAS)[number];

/** Ver el aviso de la cabecera antes de tocar esto. */
const GIRAR_TECHO_Y_SUELO = true;

/**
 * Hacia dónde mira cada cara y cómo se orienta.
 *
 * `frente` es la dirección de la cámara; `derecha` y `arriba` son los ejes del
 * plano de la imagen. Con los tres se saca la dirección de cada píxel.
 */
const EJES: Record<Cara, { frente: number[]; derecha: number[]; arriba: number[] }> = {
  front:  { frente: [0, 0, -1], derecha: [1, 0, 0],  arriba: [0, 1, 0] },
  right:  { frente: [1, 0, 0],  derecha: [0, 0, 1],  arriba: [0, 1, 0] },
  back:   { frente: [0, 0, 1],  derecha: [-1, 0, 0], arriba: [0, 1, 0] },
  left:   { frente: [-1, 0, 0], derecha: [0, 0, -1], arriba: [0, 1, 0] },
  top:    { frente: [0, 1, 0],  derecha: [1, 0, 0],  arriba: [0, 0, 1] },
  bottom: { frente: [0, -1, 0], derecha: [1, 0, 0],  arriba: [0, 0, -1] },
};

/**
 * Una cara del cubo a partir de la imagen equirectangular.
 *
 * Muestreo bilineal: sin él, las líneas rectas del campus —las canchas, los
 * pasillos— salen con los bordes dentados.
 */
function dibujarCara(
  origen: ImageData,
  cara: Cara,
  tam: number
): ImageData {
  const { frente, derecha, arriba } = EJES[cara];
  const destino = new ImageData(tam, tam);
  const dst = destino.data;
  const src = origen.data;
  const W = origen.width;
  const H = origen.height;

  for (let y = 0; y < tam; y++) {
    const v = 1 - (2 * (y + 0.5)) / tam;
    for (let x = 0; x < tam; x++) {
      const u = (2 * (x + 0.5)) / tam - 1;

      // Dirección del rayo que sale por este píxel.
      let dx = frente[0] + u * derecha[0] + v * arriba[0];
      let dy = frente[1] + u * derecha[1] + v * arriba[1];
      let dz = frente[2] + u * derecha[2] + v * arriba[2];
      const largo = Math.hypot(dx, dy, dz);
      dx /= largo;
      dy /= largo;
      dz /= largo;

      // De dirección a coordenadas del planisferio.
      const lon = Math.atan2(dx, -dz);
      const lat = Math.asin(Math.max(-1, Math.min(1, dy)));
      const sx = (lon / (2 * Math.PI) + 0.5) * W - 0.5;
      const sy = (0.5 - lat / Math.PI) * H - 0.5;

      const x0 = Math.floor(sx);
      const y0 = Math.max(0, Math.min(H - 1, Math.floor(sy)));
      const fx = sx - x0;
      const fy = sy - y0;
      const x1 = ((x0 + 1) % W + W) % W;
      const xa = ((x0 % W) + W) % W;
      const y1 = Math.min(H - 1, y0 + 1);

      const p00 = (y0 * W + xa) * 4;
      const p10 = (y0 * W + x1) * 4;
      const p01 = (y1 * W + xa) * 4;
      const p11 = (y1 * W + x1) * 4;
      const d = (y * tam + x) * 4;

      for (let c = 0; c < 3; c++) {
        const arribaMezcla = src[p00 + c] * (1 - fx) + src[p10 + c] * fx;
        const abajoMezcla = src[p01 + c] * (1 - fx) + src[p11 + c] * fx;
        dst[d + c] = arribaMezcla * (1 - fy) + abajoMezcla * fy;
      }
      dst[d + 3] = 255;
    }
  }

  return destino;
}

function girarMediaVuelta(datos: ImageData): ImageData {
  const { width: w, height: h, data } = datos;
  const salida = new ImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const desde = (y * w + x) * 4;
      const hasta = ((h - 1 - y) * w + (w - 1 - x)) * 4;
      salida.data[hasta] = data[desde];
      salida.data[hasta + 1] = data[desde + 1];
      salida.data[hasta + 2] = data[desde + 2];
      salida.data[hasta + 3] = 255;
    }
  }
  return salida;
}

async function aWebp(datos: ImageData, calidad = 0.8): Promise<Blob> {
  const lienzo = document.createElement("canvas");
  lienzo.width = datos.width;
  lienzo.height = datos.height;
  lienzo.getContext("2d")!.putImageData(datos, 0, 0);
  return new Promise((resolve, reject) =>
    lienzo.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("el navegador no pudo crear el WebP"))),
      "image/webp",
      calidad
    )
  );
}

export type ProgresoCaras = (hechas: number, total: number) => void;

/**
 * De la foto que sube el colegio a los siete archivos que guarda el paseo:
 * las seis caras y la miniatura.
 *
 * `tam` es el lado de cada cara. Las 63 escenas existentes usan 2048, que
 * equivale a un panorama de unos 8000 píxeles de ancho.
 */
export async function carasDesdeEquirectangular(
  imagen: ImageBitmap,
  { tam = 2048, alAvanzar }: { tam?: number; alAvanzar?: ProgresoCaras } = {}
): Promise<Record<string, Blob>> {
  if (imagen.width < imagen.height * 1.8 || imagen.width > imagen.height * 2.2) {
    throw new Error(
      `La foto debe ser 360° equirectangular, del doble de ancha que de alta. Esta mide ${imagen.width}×${imagen.height}.`
    );
  }

  const lienzo = document.createElement("canvas");
  lienzo.width = imagen.width;
  lienzo.height = imagen.height;
  const ctx = lienzo.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(imagen, 0, 0);
  const origen = ctx.getImageData(0, 0, imagen.width, imagen.height);

  const salida: Record<string, Blob> = {};
  let hechas = 0;

  for (const cara of CARAS) {
    let datos = dibujarCara(origen, cara, tam);
    if (GIRAR_TECHO_Y_SUELO && (cara === "top" || cara === "bottom")) {
      datos = girarMediaVuelta(datos);
    }
    salida[`${cara}.webp`] = await aWebp(datos);
    alAvanzar?.(++hechas, CARAS.length + 1);
    // Un respiro para que la pantalla no se congele entre cara y cara.
    await new Promise((r) => setTimeout(r, 0));
  }

  // La miniatura sale del frente, que es lo que se reconoce de un vistazo.
  const mini = document.createElement("canvas");
  mini.width = 400;
  mini.height = 200;
  const frente = await createImageBitmap(salida["front.webp"]);
  mini.getContext("2d")!.drawImage(frente, 0, 0, frente.width, frente.height * 0.5, 0, 0, 400, 200);
  salida["thumbnail.webp"] = await new Promise<Blob>((resolve, reject) =>
    mini.toBlob((b) => (b ? resolve(b) : reject(new Error("miniatura"))), "image/webp", 0.8)
  );
  alAvanzar?.(++hechas, CARAS.length + 1);

  return salida;
}
