/**
 * Límite de intentos para endpoints públicos.
 *
 * El sitio no tenía ninguno (auditoría del 2026-08-03). Esto es lo mínimo
 * para que un endpoint público no se pueda recorrer a fuerza bruta.
 *
 * Se apoya en la tabla `intentos_publicos` (migración 069) y NO en memoria:
 * en Vercel cada petición puede caer en una instancia distinta, así que un
 * contador en memoria se esquiva con paciencia.
 *
 * ⚠️ SOLO desde servidor — usa la service_role key.
 *
 * Diseñado para reusarse: el parámetro `endpoint` separa los contadores, así
 * que el chatbot y los formularios pueden usarlo sin otra migración.
 */

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Una de cada N llamadas dispara la purga de registros viejos. */
const PROBABILIDAD_PURGA = 20;

/**
 * Horas que se conservan los registros. La ventana más larga que se usa es de
 * 60 minutos, así que guardar más tiempo no aporta nada al mecanismo y sí
 * acumula historial de quién consultó qué solicitud.
 */
const HORAS_RETENCION = 2;

/**
 * Sal del hash de identificadores.
 *
 * Sale de una variable de entorno del servidor cuando existe. El valor de
 * reserva está en el repo y no pretende ser un secreto: sin sal secreta, un
 * hash de IP se revierte por fuerza bruta —el espacio IPv4 entero son 4.300
 * millones de valores—. Lo que sí garantiza en cualquier caso es que la
 * columna no contenga direcciones legibles para quien acceda a la base.
 *
 * Es seudonimización, no anonimización. El aviso de privacidad tiene que
 * decirlo así.
 */
const SAL = process.env.RATE_LIMIT_SALT || "atenas-rate-limit-v1";

function hash(valor: string): string {
  return createHash("sha256").update(SAL + valor).digest("hex");
}

/**
 * De quién viene la petición, ya hasheado.
 *
 * En Vercel, `NextRequest` ya no expone `.ip`: hay que leer una cabecera. El
 * orden de preferencia importa y no es arbitrario:
 *
 * 1. `x-vercel-forwarded-for` — la escribe la plataforma, el cliente no puede
 *    falsearla. Es la fuente fiable hoy.
 * 2. `x-forwarded-for` — se toma el ÚLTIMO valor de la cadena, no el primero:
 *    el primero lo controla quien envía la petición, basta con mandar la
 *    cabecera ya rellenada.
 *
 * ⚠️ `cf-connecting-ip` solo se lee si `TRUST_CLOUDFLARE_IP` está activada, y
 * eso NO debe hacerse hasta que Cloudflare esté realmente delante y el sitio
 * deje de responder por su URL de Vercel. Hoy no hay Cloudflare —el DNS de
 * atenas.edu.ec sigue bloqueado esperando al colegio— y Vercel reenvía esa
 * cabecera tal cual llegue, así que leerla sin condición permitiría mandar
 * `cf-connecting-ip: 10.0.0.<al azar>` en cada petición, caer en un cubo
 * distinto cada vez y anular los dos contadores con una línea de curl.
 *
 * Cuando se active: hará falta porque, con Cloudflare delante, el hop más
 * cercano pasa a ser su edge y todas las visitas compartirían un solo cubo.
 *
 * Si no hay ninguna cabecera, todos los anónimos comparten cubo: más
 * restrictivo, no menos.
 */
export function identificadorDe(req: NextRequest): string {
  if (process.env.TRUST_CLOUDFLARE_IP === "1") {
    const cloudflare = req.headers.get("cf-connecting-ip")?.trim();
    if (cloudflare) return hash(cloudflare);
  }

  const vercel = req.headers.get("x-vercel-forwarded-for")?.trim();
  if (vercel) {
    const ultima = vercel.split(",").pop()?.trim();
    if (ultima) return hash(ultima);
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ultima = forwarded.split(",").pop()?.trim();
    if (ultima) return hash(ultima);
  }

  const real = req.headers.get("x-real-ip")?.trim();
  return hash(real || "desconocido");
}

/**
 * Identificador que combina un recurso concreto con quien lo pide.
 *
 * Se usa para el contador estricto. Va emparejado con la IP a propósito: un
 * contador por recurso a secas dejaría que cualquiera bloqueara la consulta de
 * una familia concreta a voluntad, bastando con fallar ocho veces contra su
 * número —que es correlativo y adivinable—.
 */
export function identificadorDeRecurso(
  recurso: string,
  identificadorPeticion: string
): string {
  return hash(`${recurso.trim().toUpperCase()}|${identificadorPeticion}`);
}

/**
 * Registra el intento y devuelve cuántos lleva ese identificador en la ventana.
 *
 * Registra SIEMPRE, aciertos incluidos. Contar solo los fallos obliga a contar
 * antes de saber si el intento falla, y ahí una ráfaga de peticiones
 * simultáneas lee todas el contador a cero y pasa entera. El INSERT y el COUNT
 * ocurren dentro de la misma función SQL, así que el número que se devuelve ya
 * incluye este intento.
 *
 * Tampoco existe forma de limpiar el historial tras un acierto: sería un
 * agujero, porque el formulario de admisiones es público y cualquiera podría
 * crearse una solicitud propia para poner el contador a cero entre tandas. La
 * ventana deslizante caduca sola.
 *
 * Falla en ABIERTO: si la base no responde, devuelve 0 y el intento pasa. Un
 * error de base no puede dejar sin consulta a las familias — la defensa
 * principal no es esta, es el segundo dato que se le pide a quien consulta.
 */
export async function registrarIntento(
  endpoint: string,
  identificador: string,
  ventanaMinutos: number
): Promise<number> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("registrar_intento_publico", {
      p_endpoint: endpoint,
      p_identificador: identificador,
      p_ventana_minutos: ventanaMinutos,
    });

    if (error) {
      // Mensaje inequívoco a propósito: el modo de fallo más probable es
      // desplegar el código sin haber aplicado la migración 069, y entonces
      // el límite no existe aunque todo parezca funcionar.
      console.error(
        `[rateLimit] LÍMITE DESACTIVADO en "${endpoint}" — no se pudo registrar el intento:`,
        error.message
      );
      return 0;
    }

    if (Math.floor(Math.random() * PROBABILIDAD_PURGA) === 0) {
      await purgarViejos();
    }

    return typeof data === "number" ? data : 0;
  } catch (e) {
    console.error(`[rateLimit] LÍMITE DESACTIVADO en "${endpoint}":`, e);
    return 0;
  }
}

/**
 * Borra los registros que ya pasaron la retención. DELETE directo con
 * service_role: se evita a propósito exponerlo como función de base, porque
 * una función destructiva en `public` hay que acordarse de cerrarla a mano —y
 * en la primera versión de esto se olvidó, quedando abierta a cualquiera.
 */
async function purgarViejos(): Promise<void> {
  try {
    const limite = new Date(
      Date.now() - HORAS_RETENCION * 60 * 60 * 1000
    ).toISOString();

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("intentos_publicos")
      .delete()
      .lt("created_at", limite);

    if (error) {
      console.error("[rateLimit] Purga fallida:", error.message);
    }
  } catch (e) {
    console.error("[rateLimit] Excepción purgando:", e);
  }
}
