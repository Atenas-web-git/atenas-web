import { FloatingBoot } from "@/components/shared/FloatingBoot";
import {
  FloatingChatbot,
  getChatbotConfig,
  chatbotIsLive,
} from "@/components/chatbot/FloatingChatbot";
import {
  getConfiguracion,
  mergeContacto,
  type Contacto,
} from "@/lib/cms/getConfiguracion";

/**
 * El botón flotante del sitio público: el chatbot Ateneo si está activo y con
 * API key cargada, y si no, el de WhatsApp de Configuración › Contacto.
 *
 * Lo monta **solo** el layout de `(publico)`, que es lo que garantiza que no
 * aparezca en el panel: hasta el 2026-09-22 se pintaba también dentro de
 * /admin porque colgaba del layout raíz, y se tapaba a mano desde el cliente.
 * Los dos componentes siguen escondiéndose solos en `/admin`
 * —`FloatingChatbotClient` y `FloatingBoot`—, ahora como cinturón además del
 * tirante; si algún día estorban, se quitan de ahí, no de aquí.
 *
 * ⚠️ Asimetría heredada, por si el chatbot se apaga algún día: el chatbot
 * también se esconde en `/paseo-virtual`, `/admisiones/formulario` y
 * `/admisiones/seguimiento`; **el de WhatsApp no**. Sin chatbot, el botón
 * volvería a taparle al visitante los accesos del paseo.
 *
 * Está en su propio archivo, y no dentro del layout, porque la decisión
 * —chatbot o WhatsApp— tiene reglas propias y conviene leerla de un vistazo.
 */
export async function BotonFlotante() {
  const [contactoRaw, chatbotCfg] = await Promise.all([
    getConfiguracion<Partial<Contacto>>("contacto"),
    getChatbotConfig(),
  ]);
  const contacto = mergeContacto(contactoRaw);

  if (chatbotIsLive(chatbotCfg)) return <FloatingChatbot />;

  return (
    <FloatingBoot
      numero={contacto.whatsapp.numero}
      mensaje={contacto.whatsapp.mensaje}
      activo={contacto.whatsapp.activo}
    />
  );
}
