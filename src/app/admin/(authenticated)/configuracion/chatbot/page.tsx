import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracionPrivada,
  mergeChatbot,
  type ChatbotConfig,
} from "@/lib/cms/getConfiguracion";
import { ChatbotConfigForm } from "./ChatbotConfigForm";

export default async function ChatbotConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN])) redirect("/admin");

  const raw = await getConfiguracionPrivada<Partial<ChatbotConfig>>("chatbot");
  const config = mergeChatbot(raw);

  // Maskeo de la API key — el form recibe "•••••...•last4" si ya hay una key
  // configurada. Evita exponer la key completa en el HTML del navegador.
  const keyConfigured = config.apiKey.trim().length > 0;
  const maskedKey = keyConfigured
    ? "•".repeat(Math.max(20, config.apiKey.length - 4)) + config.apiKey.slice(-4)
    : "";

  const initial: ChatbotConfig = { ...config, apiKey: maskedKey };

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/configuracion"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Configuración
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Chatbot IA «Ateneo»
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 760, lineHeight: 1.5 }}>
          Asistente virtual con la mascota Ateneo que responde preguntas de
          padres y postulantes. Se alimenta automáticamente del contenido del
          sitio (páginas, documentos, eventos, reconocimientos). Cuando está
          activo y tiene API key configurada, <strong>reemplaza al botón flotante
          de WhatsApp</strong> en todas las páginas públicas.
        </p>
      </div>

      <ChatbotConfigForm initial={initial} keyConfigured={keyConfigured} />
    </div>
  );
}
