/**
 * Server async wrapper del footer global (patrón #18).
 *
 * Lee `configuracion_global['footer']` + `configuracion_global['contacto']`,
 * arma la lista de redes sociales y la línea "teléfono · correo", y
 * delega el render + animaciones a `FooterCTAClient`.
 *
 * Los importadores (50+ páginas del sitio) siguen importando `FooterCTA`
 * exactamente igual — el cambio interno es transparente.
 */

import { getConfiguracion } from "@/lib/cms/getConfiguracion";
import { mergeFooter, type FooterConfig } from "@/lib/cms/footer";
import {
  mergeContacto,
  type Contacto,
} from "@/lib/cms/getConfiguracion";
import { FooterCTAClient, type SocialItem } from "./FooterCTAClient";

function buildSocials(redes: Contacto["redes"]): SocialItem[] {
  const items: SocialItem[] = [];
  if (redes.facebook) items.push({ variant: "facebook", href: redes.facebook, label: "Facebook" });
  if (redes.instagram) items.push({ variant: "instagram", href: redes.instagram, label: "Instagram" });
  if (redes.youtube) items.push({ variant: "youtube", href: redes.youtube, label: "YouTube" });
  if (redes.tiktok) items.push({ variant: "tiktok", href: redes.tiktok, label: "TikTok" });
  if (redes.x) items.push({ variant: "x", href: redes.x, label: "X (Twitter)" });
  if (redes.linkedin) items.push({ variant: "linkedin", href: redes.linkedin, label: "LinkedIn" });
  return items;
}

function buildContactoLine(contacto: Contacto): string {
  const partes: string[] = [];
  const principal = contacto.telefonos[0];
  if (principal) {
    const ext = principal.extension ? ` ext. ${principal.extension}` : "";
    partes.push(`${principal.numero}${ext}`);
  }
  const email = contacto.emails[0];
  if (email) partes.push(email.email);
  return partes.join(" · ");
}

export async function FooterCTA() {
  const [rawFooter, rawContacto] = await Promise.all([
    getConfiguracion<Partial<FooterConfig>>("footer"),
    getConfiguracion<Partial<Contacto>>("contacto"),
  ]);
  const footer = mergeFooter(rawFooter);
  const contacto = mergeContacto(rawContacto);
  const socials = buildSocials(contacto.redes);
  const contactoLine = buildContactoLine(contacto);

  return <FooterCTAClient footer={footer} socials={socials} contactoLine={contactoLine} />;
}
