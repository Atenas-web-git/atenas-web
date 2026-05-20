/**
 * Builder server-side del email premium.
 *
 * Lee Marca + Contacto + CorreosDiseno desde Supabase y llama al render
 * puro de `premiumEmailRender.ts`. Usado por los senders del pipeline de
 * admisiones y de las confirmaciones de formularios.
 *
 * Los editores admin (componentes cliente) importan SOLO desde
 * `premiumEmailRender.ts` para evitar arrastrar `next/headers` al bundle
 * del navegador (patrón #25).
 */

import {
  getConfiguracion,
  mergeMarca,
  mergeContacto,
  mergeCorreosDiseno,
  mergeNavbar,
  type Marca,
  type Contacto,
  type CorreosDiseno,
  type NavbarConfig,
} from "@/lib/cms/getConfiguracion";
import {
  renderPremiumEmail,
  type PremiumEmailProps,
} from "./premiumEmailRender";

export type { AcentoCorreo, DataBlockItem, PremiumEmailProps } from "./premiumEmailRender";
export { renderPremiumEmail } from "./premiumEmailRender";

/**
 * Variante server: lee marca/contacto/diseno/navbar de BD y delega al render puro.
 */
export async function buildPremiumEmail(props: PremiumEmailProps): Promise<string> {
  const [marcaRaw, contactoRaw, disenoRaw, navbarRaw] = await Promise.all([
    getConfiguracion<Partial<Marca>>("marca"),
    getConfiguracion<Partial<Contacto>>("contacto"),
    getConfiguracion<Partial<CorreosDiseno>>("correos_diseno"),
    getConfiguracion<Partial<NavbarConfig>>("navbar"),
  ]);
  return renderPremiumEmail(props, {
    marca: mergeMarca(marcaRaw),
    contacto: mergeContacto(contactoRaw),
    diseno: mergeCorreosDiseno(disenoRaw),
    navbar: mergeNavbar(navbarRaw),
  });
}
