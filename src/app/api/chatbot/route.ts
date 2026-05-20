import { NextResponse } from "next/server";
import {
  getConfiguracion,
  mergeChatbot,
  chatbotIsLive,
  type ChatbotConfig,
} from "@/lib/cms/getConfiguracion";
import { buildKnowledgeBase } from "@/lib/chatbot/knowledgeBase";
import { chatWithProvider, type ChatMessage } from "@/lib/chatbot/providers";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RequestBody = {
  messages: Array<{ role: string; content: string }>;
};

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const messagesRaw = Array.isArray(body.messages) ? body.messages : [];
  // Sanitiza y limita el largo de cada mensaje
  const messages: ChatMessage[] = messagesRaw
    .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, 2000),
    }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "Se requiere al menos un mensaje del usuario al final" },
      { status: 400 }
    );
  }

  // Lee configuración del chatbot
  const cfgRaw = await getConfiguracion<Partial<ChatbotConfig>>("chatbot");
  const cfg = mergeChatbot(cfgRaw);

  if (!chatbotIsLive(cfg)) {
    return NextResponse.json(
      { error: "Chatbot no configurado o inactivo." },
      { status: 503 }
    );
  }

  // Limita historial al máximo configurado
  const trimmedMessages = messages.slice(-cfg.maxHistoryMessages);

  // Construye knowledge base + system prompt completo
  let knowledgeBase = "";
  try {
    knowledgeBase = await buildKnowledgeBase();
  } catch (e) {
    console.error("[chatbot] error armando knowledge base:", e);
  }

  const extraBlock = cfg.extraKnowledge.trim()
    ? `\n\n────────────────────────────────────────\nCONOCIMIENTO ADICIONAL (no publicado en la web):\n────────────────────────────────────────\n\n${cfg.extraKnowledge.trim()}`
    : "";

  const fullSystemPrompt = `${cfg.systemPrompt}

═══════════════════════════════════════════════════════════════════
BASE DE CONOCIMIENTO — Contenido COMPLETO y ACTUAL del sitio web del colegio.
Esta es la ÚNICA fuente de verdad. Léela con MUCHA atención antes de responder.
═══════════════════════════════════════════════════════════════════

${knowledgeBase}${extraBlock}

═══════════════════════════════════════════════════════════════════
REGLAS CRÍTICAS DE COMPORTAMIENTO:
═══════════════════════════════════════════════════════════════════

REGLA #1 — USA ACTIVAMENTE LA BASE:
La base de arriba contiene todas las páginas publicadas del sitio del colegio (admisiones, niveles educativos —inicial, EGB, BGU, IB—, matrículas, servicios, espacios de desarrollo, política de privacidad, contactos, etc.), todos los documentos descargables, todos los eventos del cronograma anual, todos los reconocimientos. La respuesta a casi cualquier pregunta sobre el colegio ESTÁ en esa base. Búscala antes de decir que no sabes.

REGLA #2 — NO DIGAS "no tengo información" A LA LIGERA:
Antes de usar la frase "no tengo información", "no cuento con datos", "no dispongo de" o similar, hazte estas preguntas:
  a) ¿La pregunta toca un tema general del colegio (admisiones, niveles, IB, matrículas, contacto, servicios, etc.)? Si SÍ → la respuesta está en la base, búscala.
  b) ¿Aparece la palabra clave (o sinónimos) en alguna parte de la base? Si SÍ → úsala.
  c) ¿La pregunta pide un dato muy específico que claramente no está en la base (ej. el nombre exacto de un profesor, un valor de matrícula del año pasado, etc.)? Solo en este caso responde que no tienes ese dato puntual y sugiere ${cfg.fallbackCtaUrl}.

REGLA #3 — EJEMPLOS DE BUENAS RESPUESTAS:
• Pregunta: "¿Cuáles son los niveles educativos?" → Respuesta: lista los niveles que aparecen en la base (inicial, EGB, BGU, IB) con las URLs correspondientes.
• Pregunta: "¿Cuándo son las matrículas?" → Respuesta: usa la información del cronograma anual o de la página de matrículas que aparece en la base.
• Pregunta: "¿Qué servicios ofrecen?" → Respuesta: lista los servicios que ves en la base.

REGLA #4 — CITAR LA RUTA:
Cuando menciones un tema, agrega la ruta entre paréntesis al final (ej. "(/academico/niveles)") para que el usuario pueda visitar la página completa.

REGLA #5 — NO INVENTES DATOS ESPECÍFICOS:
Fechas exactas, valores numéricos, nombres propios y requisitos detallados solo si aparecen textualmente en la base. Si no, di que la información detallada se confirma en el contacto.

REGLA #6 — TONO Y FORMATO:
- Trata de "tú". Tono formal pero cercano. Sin emojis.
- 2 a 4 oraciones cuando puedas. Más largo solo si el usuario pide pasos detallados.
- Usa listas con guiones cuando enumeres varios items (niveles, requisitos, etc.).`;

  try {
    const reply = await chatWithProvider(cfg.provider, {
      apiKey: cfg.apiKey,
      model: cfg.model,
      systemPrompt: fullSystemPrompt,
      messages: trimmedMessages,
    });

    return NextResponse.json({
      message: reply,
      fallback: detectFallback(reply, cfg),
    });
  } catch (err) {
    console.error("[chatbot] provider error:", err);
    return NextResponse.json(
      {
        message: cfg.fallbackMessage,
        fallback: true,
        ctaLabel: cfg.fallbackCtaLabel,
        ctaUrl: cfg.fallbackCtaUrl,
        providerError: true,
      },
      { status: 200 }
    );
  }
}

/**
 * Detecta si el modelo emitió un "no tengo información" para activar
 * el CTA al fallback. Heurística simple: si la respuesta menciona la URL
 * de fallback o frases tipo "no tengo", "no cuento con", "no dispongo".
 */
function detectFallback(reply: string, cfg: ChatbotConfig): boolean {
  const t = reply.toLowerCase();
  if (t.includes(cfg.fallbackCtaUrl.toLowerCase())) return true;
  const phrases = [
    "no tengo esa información",
    "no tengo información",
    "no cuento con",
    "no dispongo de",
    "no encuentro información",
    "no tengo datos",
    "no tengo detalles",
  ];
  return phrases.some((p) => t.includes(p));
}
