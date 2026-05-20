import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracion,
  mergeChatbot,
  type ChatbotConfig,
} from "@/lib/cms/getConfiguracion";
import { buildKnowledgeBase } from "@/lib/chatbot/knowledgeBase";

/**
 * Endpoint de inspección — devuelve el knowledge base completo que se
 * envía al modelo en cada turno. Útil para diagnosticar por qué el
 * chatbot dice "no tengo información" sobre algún tema.
 *
 * Solo accesible para usuarios con rol superadmin.
 *
 * GET /api/chatbot/debug
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const cfgRaw = await getConfiguracion<Partial<ChatbotConfig>>("chatbot");
  const cfg = mergeChatbot(cfgRaw);

  let knowledgeBase = "";
  let kbError: string | null = null;
  try {
    knowledgeBase = await buildKnowledgeBase();
  } catch (e) {
    kbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    cfg: {
      activo: cfg.activo,
      provider: cfg.provider,
      model: cfg.model,
      apiKeyConfigured: cfg.apiKey.length > 10,
      maxHistoryMessages: cfg.maxHistoryMessages,
      extraKnowledgeLength: cfg.extraKnowledge.length,
    },
    systemPrompt: cfg.systemPrompt,
    knowledgeBase,
    knowledgeBaseLength: knowledgeBase.length,
    extraKnowledge: cfg.extraKnowledge,
    kbError,
  });
}
