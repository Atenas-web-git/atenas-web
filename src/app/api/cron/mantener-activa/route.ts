import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Mantiene despierta la base de datos. Lo llama el cron de Vercel una vez al
 * día (ver `vercel.json`).
 *
 * ## Por qué existe
 *
 * El plan gratuito de Supabase **pausa el proyecto tras 7 días sin actividad**.
 * Pasó entre el 2026-09-02 y el 2026-09-16: la dirección de la base dejó de
 * existir en el DNS, el panel no dejaba entrar a nadie y el formulario de
 * admisión se veía pero no podía guardar.
 *
 * Y no hace falta que el sitio no tenga visitas para que pase: la mayoría de
 * las páginas se construyen estáticas, así que una visita **no toca la base**.
 * Lo único que la despierta es alguien usando el panel o enviando un formulario.
 *
 * ## Qué hace
 *
 * Una lectura real de una fila de `paginas`, con la clave pública: la tabla ya
 * es legible por cualquiera y no hace falta más permiso que ese. Tiene que ser
 * una consulta a Postgres; una llamada que no llegue a la base no cuenta.
 *
 * ## Lo que NO hace
 *
 * **No despierta un proyecto ya pausado.** Si la base está pausada, esto
 * responde 503 y el fallo queda en los logs del cron en Vercel, pero nadie
 * recibe un aviso. Para enterarse hace falta un monitor externo que llame a
 * esta ruta y avise por correo.
 *
 * ## La ruta es abierta a propósito
 *
 * Decidido el 2026-09-16: **`CRON_SECRET` se deja sin poner en Vercel.** El
 * monitor externo tiene que poder llamar a esta misma ruta sin cabeceras, y de
 * paso hace de segundo despertador si el cron de Vercel fallara. Lo que queda
 * abierto es una lectura de una fila pública que no sale en la respuesta:
 * cualquiera ya puede hacer lo mismo abriendo el sitio.
 *
 * El código sigue respetando `CRON_SECRET` si algún día se pone, pero entonces
 * el monitor recibirá 401 y dejará de servir.
 */

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secreto = process.env.CRON_SECRET;
  if (secreto && req.headers.get("authorization") !== `Bearer ${secreto}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const { error } = await supabase.from("paginas").select("id").limit(1);
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("[cron] la base no respondió:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  return NextResponse.json({ ok: true, en: new Date().toISOString() });
}
