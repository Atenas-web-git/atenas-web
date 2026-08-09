/**
 * Borra los archivos que quedaron sueltos en el bucket de formularios.
 *
 * DE DÓNDE SALEN
 *
 * Los adjuntos se suben en cuanto la persona los elige, antes de enviar el
 * formulario. Si abandona a mitad —cierra la pestaña, se arrepiente, cambia de
 * archivo tres veces— lo subido se queda en el bucket sin ninguna respuesta
 * que lo referencie. No molesta a nadie, pero son hojas de vida y audios de
 * personas reales acumulándose sin motivo ni plazo, y eso es justo lo que la
 * ley de protección de datos no quiere.
 *
 * CÓMO SE DISPARA
 *
 * Igual que la purga del limitador de intentos (`rateLimit.ts`): una de cada N
 * respuestas guardadas la ejecuta. No hace falta un cron ni infraestructura
 * nueva, y el coste se reparte entre envíos que ya están ocurriendo.
 *
 * PERIODO DE GRACIA
 *
 * Solo se borra lo que lleva más de un día. Un archivo recién subido puede
 * pertenecer a un formulario que la persona todavía está rellenando: borrarlo
 * por ir demasiado rápido dejaría una postulación sin su hoja de vida, que es
 * peor que dejar basura.
 *
 * ⚠️ SOLO desde servidor — usa la service_role key.
 */

import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "formularios-archivos";

/** Una de cada N respuestas dispara la purga. */
const PROBABILIDAD_PURGA = 25;

/** Horas que un archivo puede estar sin respuesta antes de considerarse suelto. */
const HORAS_DE_GRACIA = 24;

/** Tope por pasada, para no encadenar cientos de borrados en una petición. */
const MAX_POR_PASADA = 100;

/**
 * Recorre la carpeta de un formulario y borra lo que no esté referenciado.
 *
 * Se limita a UNA carpeta —la del formulario que acaba de recibir respuesta—
 * en vez de barrer el bucket entero: es lo que mantiene la operación barata
 * cuando se dispara desde un envío.
 */
export async function purgarArchivosHuerfanos(
  slugFormulario: string,
  formularioId: string,
  /** Solo para poder comprobar la purga sin esperar un día real. */
  horasDeGracia: number = HORAS_DE_GRACIA
): Promise<number> {
  try {
    const supabase = createAdminClient();

    const { data: enBucket, error: errorLista } = await supabase.storage
      .from(BUCKET)
      .list(slugFormulario, { limit: 1000 });

    if (errorLista || !enBucket || enBucket.length === 0) return 0;

    // Todas las rutas que SÍ pertenecen a una respuesta guardada.
    const { data: respuestas, error: errorRespuestas } = await supabase
      .from("formulario_respuestas")
      .select("archivos")
      .eq("formulario_id", formularioId);

    // Si esta consulta falla no se borra nada. Sin la lista de referencias,
    // «no referenciado» significaría «todos», y la purga se llevaría por
    // delante los adjuntos de postulaciones reales.
    if (errorRespuestas) {
      console.error(
        "[formularios] purga cancelada, no se pudieron leer las respuestas:",
        errorRespuestas.message
      );
      return 0;
    }

    const referenciadas = new Set<string>();
    for (const fila of respuestas ?? []) {
      const archivos = (fila as { archivos?: { storage_path?: string }[] }).archivos;
      for (const a of archivos ?? []) {
        if (a?.storage_path) referenciadas.add(a.storage_path);
      }
    }

    const limite = Date.now() - horasDeGracia * 60 * 60 * 1000;

    const sueltos = enBucket
      .filter((archivo) => {
        const ruta = `${slugFormulario}/${archivo.name}`;
        if (referenciadas.has(ruta)) return false;

        // Sin fecha fiable se deja estar: más vale un archivo de más que
        // borrar el adjunto de alguien que está rellenando el formulario.
        const creado = archivo.created_at ?? archivo.updated_at;
        if (!creado) return false;

        return new Date(creado).getTime() < limite;
      })
      .slice(0, MAX_POR_PASADA)
      .map((archivo) => `${slugFormulario}/${archivo.name}`);

    if (sueltos.length === 0) return 0;

    const { error: errorBorrado } = await supabase.storage
      .from(BUCKET)
      .remove(sueltos);

    if (errorBorrado) {
      console.error("[formularios] purga fallida:", errorBorrado.message);
      return 0;
    }

    console.log(
      `[formularios] purgados ${sueltos.length} archivo(s) sueltos de "${slugFormulario}".`
    );
    return sueltos.length;
  } catch (e) {
    console.error("[formularios] excepción purgando huérfanos:", e);
    return 0;
  }
}

/** Ejecuta la purga una de cada N veces. */
export function quizaPurgar(slugFormulario: string, formularioId: string): void {
  if (Math.floor(Math.random() * PROBABILIDAD_PURGA) !== 0) return;

  // Sin await a propósito: la purga no debe retrasar la respuesta a quien
  // acaba de enviar el formulario.
  void purgarArchivosHuerfanos(slugFormulario, formularioId);
}
