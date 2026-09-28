import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { canAccessAdmin, ROLE_LABELS } from "@/lib/auth/types";
import {
  getConfiguracionPrivada,
  mergeAsistente,
  asistenteIsLive,
  type AsistenteConfig,
} from "@/lib/cms/getConfiguracion";
import { chatWithProviderDetallado, type ChatMessage, type ChatUso } from "@/lib/chatbot/providers";
import { systemPromptAsistente, contextoDelTurno } from "@/lib/asistente/prompt";
import { extraerCitas, neutralizarEnlacesExternos } from "@/lib/asistente/manual";
import {
  sanearEstructura,
  esRutaDeAdmisiones,
  recortarParaAdmisiones,
} from "@/lib/asistente/pantalla";
import { buscarEntrada } from "@/components/admin/mapaPantallas";
import { registrarIntento, identificadorDeRecurso } from "@/lib/security/rateLimit";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * El asistente del panel: responde con el manual y sabe en qué pantalla está
 * quien pregunta.
 *
 * POST /api/asistente
 *   { mensajes: [{ role, content }], ruta: "/admin/…", pantalla: EstructuraPantalla | null }
 *   → { texto, citas: [{ titulo, seccion, href }] }
 *
 * Solo para usuarios del panel con sesión. El rol NO viene del cliente: se lee
 * de la sesión, igual que el nombre. Lo único que se acepta del navegador es
 * la ruta y la estructura de la pantalla, y las dos se vuelven a validar.
 *
 * Guía, no actúa: aquí no hay herramientas ni escrituras. Lo único que se
 * escribe es una fila en `asistente_uso` con los tokens que costó el turno,
 * nunca el texto.
 */

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Preguntas por usuario cada diez minutos. Sobra para trabajar; frena un bucle. */
const MAX_PREGUNTAS_POR_10_MIN = 30;
/**
 * Y por usuario cada 24 horas. Sin esto, 30 cada diez minutos son 4.320 al
 * día: cualquier cuenta del panel podría usar la clave del colegio como un
 * chat de propósito general. Se cuenta sobre `asistente_uso`, que es donde
 * queda cada pregunta; si la tabla no existe, el tope no aplica y se avisa.
 */
const MAX_PREGUNTAS_POR_DIA = 150;
const MAX_LARGO_MENSAJE = 4000;
/** Más largo que el chatbot (800): una guía paso a paso ocupa. */
const MAX_TOKENS_RESPUESTA = 1200;

type Body = { mensajes?: unknown; ruta?: unknown; pantalla?: unknown };

function sanearMensajes(raw: unknown): ChatMessage[] {
  if (!Array.isArray(raw)) return [];
  const salida: ChatMessage[] = [];
  for (const m of raw.slice(-40)) {
    if (!m || typeof m !== "object") continue;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const texto = content.trim().slice(0, MAX_LARGO_MENSAJE);
    if (!texto) continue;
    salida.push({ role, content: texto });
  }
  return salida;
}

type FilaUso = {
  user_id: string;
  pantalla: string;
  provider: string;
  model: string;
  con_pantalla: boolean;
  ok: boolean;
} & Record<"tokens_entrada" | "tokens_cache" | "tokens_salida", number>;

async function anotarUso(fila: FilaUso): Promise<void> {
  try {
    const { error } = await createAdminClient().from("asistente_uso").insert(fila);
    if (error) {
      console.error(
        "[asistente] no se pudo anotar el uso (¿falta la migración 094?):",
        error.message
      );
    }
  } catch (e) {
    console.error("[asistente] excepción anotando el uso:", e);
  }
}

const USO_CERO: ChatUso = { entrada: 0, cache: 0, salida: 0 };

async function preguntasUltimas24h(userId: string): Promise<number> {
  try {
    const desde = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error } = await createAdminClient()
      .from("asistente_uso")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", desde);
    if (error) {
      console.error("[asistente] TOPE DIARIO DESACTIVADO — no se pudo contar:", error.message);
      return 0;
    }
    return count ?? 0;
  } catch (e) {
    console.error("[asistente] TOPE DIARIO DESACTIVADO:", e);
    return 0;
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || !canAccessAdmin(user)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Un contador por usuario, no por IP: en el colegio todos salen por la
  // misma conexión y se bloquearían entre sí.
  const intentos = await registrarIntento(
    "asistente:usuario",
    identificadorDeRecurso(user.id, "asistente"),
    10
  );
  if (intentos > MAX_PREGUNTAS_POR_10_MIN) {
    return NextResponse.json(
      { error: "Demasiadas preguntas seguidas. Espera unos minutos y vuelve a intentarlo." },
      { status: 429 }
    );
  }
  if ((await preguntasUltimas24h(user.id)) >= MAX_PREGUNTAS_POR_DIA) {
    return NextResponse.json(
      {
        error: `Has llegado al tope de ${MAX_PREGUNTAS_POR_DIA} preguntas en 24 horas. Mañana vuelve a estar disponible; mientras tanto, el manual está en Documentación.`,
      },
      { status: 429 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const mensajes = sanearMensajes(body.mensajes);
  if (mensajes.length === 0 || mensajes[mensajes.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Se requiere al menos un mensaje del usuario al final" },
      { status: 400 }
    );
  }

  // La ruta sin parámetros de consulta: `?q=apellido` no tiene por qué viajar.
  const ruta =
    typeof body.ruta === "string" ? body.ruta.split("?")[0].split("#")[0].slice(0, 200) : "";
  const rutaDelPanel = ruta.startsWith("/admin");
  const entrada = rutaDelPanel ? buscarEntrada(ruta) : null;
  const enAdmisiones = esRutaDeAdmisiones(ruta);

  // Se vuelve a sanear en el servidor: el cliente ya lo hizo, pero el cliente
  // es el navegador. En Admisiones, títulos y avisos se descartan aquí aunque
  // el navegador los mandara.
  let estructura = sanearEstructura(body.pantalla);
  if (estructura && enAdmisiones) estructura = recortarParaAdmisiones(estructura);

  const cfg = mergeAsistente(
    await getConfiguracionPrivada<Partial<AsistenteConfig>>("asistente")
  );
  if (!asistenteIsLive(cfg)) {
    return NextResponse.json(
      { error: "El asistente no está configurado o está apagado." },
      { status: 503 }
    );
  }

  const historial = mensajes.slice(-cfg.maxHistoryMessages);
  const systemPrompt = systemPromptAsistente(cfg.notasColegio);
  const contexto = contextoDelTurno({
    nombre: user.fullName.split(/\s+/)[0] || "",
    rolesEtiquetas: user.roles.map((r) => ROLE_LABELS[r]),
    pantalla: entrada
      ? { titulo: entrada.titulo, subtitulo: entrada.subtitulo ?? "", patron: entrada.patron }
      : null,
    estructura,
    enAdmisiones,
  });

  const filaBase = {
    user_id: user.id,
    // El patrón, nunca la URL real: `/admin/admisiones/:id`, no el número de
    // una solicitud.
    pantalla: entrada?.patron ?? (rutaDelPanel ? "/admin/(sin-mapa)" : "(sin-ruta)"),
    provider: cfg.provider,
    model: cfg.model,
    con_pantalla: estructura !== null,
  };

  try {
    const resultado = await chatWithProviderDetallado(cfg.provider, {
      apiKey: cfg.apiKey,
      model: cfg.model,
      systemPrompt,
      contexto,
      messages: historial,
      maxTokens: MAX_TOKENS_RESPUESTA,
      esfuerzo: "bajo",
      cachearSistema: true,
    });

    const { texto, citas, desconocidas } = extraerCitas(
      neutralizarEnlacesExternos(resultado.text)
    );
    if (desconocidas.length > 0) {
      // Una cita que no existe es el modelo inventando: conviene verlo en el log.
      console.warn("[asistente] citas a artículos que no existen:", desconocidas);
    }

    await anotarUso({
      ...filaBase,
      tokens_entrada: resultado.uso.entrada,
      tokens_cache: resultado.uso.cache,
      tokens_salida: resultado.uso.salida,
      ok: true,
    });

    return NextResponse.json({ texto, citas });
  } catch (err) {
    console.error("[asistente] error del proveedor:", err);
    await anotarUso({
      ...filaBase,
      tokens_entrada: USO_CERO.entrada,
      tokens_cache: USO_CERO.cache,
      tokens_salida: USO_CERO.salida,
      ok: false,
    });
    // No se inventa una respuesta: se dice que no hubo.
    return NextResponse.json(
      { error: "El proveedor de IA no respondió. Inténtalo de nuevo en un momento." },
      { status: 502 }
    );
  }
}
