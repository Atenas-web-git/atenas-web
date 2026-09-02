/**
 * Deja constancia de quién descargó datos personales.
 *
 * ## Por qué existe
 *
 * Las dos exportaciones del panel se llevan datos de personas reales: el padrón
 * de admisiones incluye fechas de nacimiento de menores; las respuestas de
 * formularios, lo que cada quien escribió. Quién puede pedirlas ya estaba
 * acotado, pero no quedaba rastro de nadie.
 *
 * Con dos o tres personas compartiendo el rol de Admisiones, «lo descargó
 * alguien de secretaría» no es una respuesta.
 *
 * ## Lo que NO hace
 *
 * No guarda el contenido descargado. Este registro existe para saber quién
 * accedió, no para tener los datos personales copiados en otra tabla — eso
 * sería crear el mismo problema por segunda vez.
 *
 * ## Falla en abierto, y es deliberado
 *
 * Si el registro no se puede escribir, la descarga **sigue adelante**. Es la
 * misma decisión que en `rateLimit.ts` y por el mismo motivo: un error de base
 * no puede dejar a secretaría sin poder trabajar.
 *
 * La consecuencia hay que tenerla clara: esto es un registro, no una garantía.
 * Si alguna vez hiciera falta que ninguna descarga ocurra sin dejar rastro,
 * habría que invertir esto —y asumir que un fallo de base bloquea el trabajo—.
 * El caso más probable de fallo silencioso es desplegar sin haber aplicado la
 * migración 088, así que el mensaje de error lo dice sin rodeos.
 */

import { createAdminClient } from "@/lib/supabase/admin";

export type DescargaRegistrable = {
  /** Qué se exportó: `admisiones` o `formulario:<slug>`. */
  recurso: string;
  usuarioId: string;
  usuarioNombre: string;
  /** Los filtros aplicados. Distinguen «una familia» de «el padrón entero». */
  filtros: Record<string, string | null | undefined>;
  filas: number;
};

export async function registrarDescarga(d: DescargaRegistrable): Promise<void> {
  try {
    const supabase = createAdminClient();

    // Los filtros vacíos se quitan: `{}` se lee como «sin filtro, se llevó
    // todo», y `{estado: null, nivel: null}` dice lo mismo con más ruido.
    const filtros: Record<string, string> = {};
    for (const [k, v] of Object.entries(d.filtros)) {
      const limpio = typeof v === "string" ? v.trim() : "";
      if (limpio) filtros[k] = limpio;
    }

    const { error } = await supabase.from("registro_descargas").insert({
      usuario_id: d.usuarioId,
      usuario_nombre: d.usuarioNombre,
      recurso: d.recurso,
      filtros,
      filas: d.filas,
    });

    if (error) {
      console.error(
        `[registroDescargas] SIN REGISTRAR la descarga de "${d.recurso}" por ${d.usuarioNombre} — ¿está aplicada la migración 088?:`,
        error.message
      );
    }
  } catch (e) {
    console.error(
      `[registroDescargas] SIN REGISTRAR la descarga de "${d.recurso}":`,
      e
    );
  }
}
