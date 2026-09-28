import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracionPrivada,
  mergeAsistente,
  type AsistenteConfig,
} from "@/lib/cms/getConfiguracion";
import { systemPromptAsistente } from "@/lib/asistente/prompt";
import { MANUAL_MEDIDAS } from "@/lib/asistente/manual";

/**
 * Endpoint de inspección — devuelve exactamente lo que el asistente recibe
 * como instrucciones en cada turno (reglas + manual + notas del colegio).
 * Sirve para entender por qué contestó algo, y para ver cuánto ocupa.
 *
 * Solo superadmin. GET /api/asistente/inspeccion
 */

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || !hasAnyRole(user, [ROLES.SUPERADMIN])) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const cfg = mergeAsistente(
    await getConfiguracionPrivada<Partial<AsistenteConfig>>("asistente")
  );
  const systemPrompt = systemPromptAsistente(cfg.notasColegio);

  return NextResponse.json({
    cfg: {
      activo: cfg.activo,
      provider: cfg.provider,
      model: cfg.model,
      apiKeyConfigured: cfg.apiKey.length > 10,
      maxHistoryMessages: cfg.maxHistoryMessages,
      notasColegioLength: cfg.notasColegio.length,
    },
    manual: MANUAL_MEDIDAS,
    systemPrompt,
    systemPromptLength: systemPrompt.length,
  });
}
