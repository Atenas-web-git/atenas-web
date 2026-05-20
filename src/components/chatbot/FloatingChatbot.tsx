/**
 * Server async wrapper del chatbot Ateneo.
 *
 * Lee la config y solo renderiza el cliente si el chatbot está "live"
 * (activo + apiKey configurada). El root layout consulta esto antes de
 * decidir si mostrar el WhatsApp.
 *
 * Esta función está exportada como helper para que el layout pueda
 * preguntar `chatbotIsLive(cfg)` sin re-leer BD.
 */

import {
  getConfiguracion,
  mergeChatbot,
  chatbotIsLive,
  type ChatbotConfig,
} from "@/lib/cms/getConfiguracion";
import { FloatingChatbotClient } from "./FloatingChatbotClient";

export async function getChatbotConfig(): Promise<ChatbotConfig> {
  const raw = await getConfiguracion<Partial<ChatbotConfig>>("chatbot");
  return mergeChatbot(raw);
}

export { chatbotIsLive };

export async function FloatingChatbot() {
  const cfg = await getChatbotConfig();
  if (!chatbotIsLive(cfg)) return null;

  return (
    <FloatingChatbotClient
      bubbleText={cfg.bubbleText}
      welcomeMessage={cfg.welcomeMessage}
      fallbackMessage={cfg.fallbackMessage}
      fallbackCtaLabel={cfg.fallbackCtaLabel}
      fallbackCtaUrl={cfg.fallbackCtaUrl}
    />
  );
}
