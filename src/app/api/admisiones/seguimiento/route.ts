/**
 * Consulta pública del estado de una solicitud de admisión.
 *
 * Antes bastaba el número de solicitud, y los números son secuenciales
 * (ADM026-001, -002, …): recorrerlos devolvía el padrón completo de
 * postulantes con nombre y nivel. Datos de menores. Auditoría del 2026-08-03.
 *
 * Ahora hacen falta DOS datos: el número y el correo del representante con el
 * que se registró la solicitud. Se eligió el correo y no la fecha de
 * nacimiento del aspirante porque `rep_correo` es obligatorio en el formulario
 * y `est_fecha_nac` no — con la fecha, las solicitudes que la tengan vacía se
 * quedarían sin poder consultarse nunca.
 *
 * Es POST, no GET, para que el correo NO viaje en la URL: ahí quedaría en los
 * logs, en el historial del navegador y en la cabecera Referer.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  identificadorDe,
  identificadorDeRecurso,
  registrarIntento,
} from "@/lib/security/rateLimit";

export const runtime = "nodejs";

/**
 * Dos contadores, porque frenan ataques distintos:
 *
 * - POR IP, muy generoso: corta el barrido masivo de números. El umbral es alto
 *   a propósito. En Ecuador, CNT, Claro y Netlife comparten una misma IP
 *   pública entre muchos abonados —un barrio entero cuenta como uno solo— y la
 *   secretaría del colegio consulta desde una sola red: un umbral bajo dejaría
 *   sin consulta a familias que no hicieron nada. El que de verdad protege es
 *   el segundo contador.
 * - POR NÚMERO + IP, estricto: corta a quien ya conoce un número concreto y
 *   prueba correos hasta acertar. Va emparejado con la IP y no suelto: un
 *   contador por número a secas dejaría que cualquiera bloqueara la consulta de
 *   una familia concreta fallando ocho veces contra su número.
 *
 * Cuentan TODOS los intentos, no solo los fallidos — ver la nota en
 * `registrarIntento`. Por eso los umbrales son holgados.
 */
const ENDPOINT_IP = "admisiones-seguimiento:ip";
const MAX_POR_IP = 100;
const VENTANA_IP_MINUTOS = 15;

const ENDPOINT_NUMERO = "admisiones-seguimiento:numero-ip";
const MAX_POR_NUMERO = 10;
const VENTANA_NUMERO_MINUTOS = 60;

/**
 * MISMO mensaje para "ese número no existe" y "el correo no coincide".
 * Si fueran distintos, probar números seguiría revelando cuáles son válidos,
 * que es justo lo que esta ruta dejó de permitir.
 */
const NO_ENCONTRADA =
  "No encontramos ninguna solicitud con esos datos. Revisa el número y el correo con el que la registraste.";

// "Intentos", no "intentos fallidos": cuentan también los aciertos, y la
// secretaría reportaría como error un mensaje que dice lo contrario.
const DEMASIADOS_INTENTOS =
  "Demasiadas consultas seguidas. Espera unos minutos y vuelve a intentar, o escríbenos si necesitas ayuda.";

const RE_NUMERO_NUEVO = /^ADM\d{3}-\d{3,}$/;
const RE_NUMERO_VIEJO = /^ATN-\d{4}-\d{6}$/;
const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const datos = body as { numero?: unknown; correo?: unknown } | null;
  const numero =
    typeof datos?.numero === "string" ? datos.numero.trim().toUpperCase() : "";
  const correo =
    typeof datos?.correo === "string" ? datos.correo.trim().toLowerCase() : "";

  // Se acepta el formato viejo `ATN-<año4>-<seq6>` para no romper números
  // antiguos que el colegio pueda tener registrados a mano.
  const numeroValido =
    RE_NUMERO_NUEVO.test(numero) || RE_NUMERO_VIEJO.test(numero);

  if (!numeroValido || !RE_CORREO.test(correo)) {
    return NextResponse.json(
      { error: "Ingresa el número de seguimiento y el correo del representante." },
      { status: 400 }
    );
  }

  const idIp = identificadorDe(req);
  const idNumero = identificadorDeRecurso(numero, idIp);

  // Se registra ANTES de consultar y se decide con lo que devuelve el registro.
  // Comprobar primero y registrar después dejaba pasar entera una ráfaga de
  // peticiones simultáneas: todas leían el contador a cero.
  //
  // En secuencia y no en paralelo: si ya se pasó del límite por IP, no tiene
  // sentido escribir la segunda fila. Bajo ataque eso reduce a la mitad las
  // escrituras que se le regalan a la base de producción.
  const intentosIp = await registrarIntento(ENDPOINT_IP, idIp, VENTANA_IP_MINUTOS);
  if (intentosIp > MAX_POR_IP) {
    return NextResponse.json({ error: DEMASIADOS_INTENTOS }, { status: 429 });
  }

  const intentosNumero = await registrarIntento(
    ENDPOINT_NUMERO,
    idNumero,
    VENTANA_NUMERO_MINUTOS
  );
  if (intentosNumero > MAX_POR_NUMERO) {
    return NextResponse.json({ error: DEMASIADOS_INTENTOS }, { status: 429 });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("solicitudes_admision")
      .select(
        "numero, estado, created_at, est_nombres, est_apellidos, est_nivel, rep_correo"
      )
      .eq("numero", numero)
      .maybeSingle();

    // Correo guardado normalizado igual que el recibido: una mayúscula de más
    // no puede dejar fuera a una familia.
    const correoGuardado =
      typeof data?.rep_correo === "string"
        ? data.rep_correo.trim().toLowerCase()
        : "";

    if (error || !data || correoGuardado !== correo) {
      if (error) {
        console.error("[admisiones/seguimiento] Error de consulta:", error.message);
      }
      // Da igual cuál de los tres casos fue —número inexistente, correo que no
      // coincide o error de consulta—: el comportamiento observable desde fuera
      // tiene que ser idéntico, o probar números seguiría revelando cuáles son
      // válidos.
      return NextResponse.json({ error: NO_ENCONTRADA }, { status: 404 });
    }

    // `rep_correo` se usó para verificar, pero no se devuelve.
    return NextResponse.json({
      numero: data.numero,
      estado: data.estado,
      created_at: data.created_at,
      est_nombres: data.est_nombres,
      est_apellidos: data.est_apellidos,
      est_nivel: data.est_nivel,
    });
  } catch (err) {
    console.error("[admisiones/seguimiento]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
