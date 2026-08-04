/**
 * Render PURO del email premium — sin imports server-only.
 *
 * Toma Marca + Contacto + CorreosDiseno + props específicos del correo y
 * devuelve el HTML completo basado en tablas (compatibilidad Outlook +
 * Gmail + iOS Mail).
 *
 * Este módulo NO toca BD. Para la versión server que lee BD ver
 * `buildPremiumEmail.ts`. Los editores admin del cliente importan desde
 * acá para previews en vivo.
 *
 * Patrón #25 — types/render puros separados del módulo server.
 */

import type {
  Marca,
  Contacto,
  CorreosDiseno,
  NavbarConfig,
} from "@/lib/cms/getConfiguracion";
import { buildSocialIconDataUri } from "./socialIcons";

export type AcentoCorreo = "navy" | "red" | "gold";

export type DataBlockItem = {
  /** Etiqueta corta en mayúsculas (ej. "N° SEGUIMIENTO"). */
  label: string;
  /** Valor en negrita color navy. */
  value: string;
};

export type PremiumEmailProps = {
  /** Color de acento de los detalles del email. */
  acento: AcentoCorreo;
  /** Texto pequeño antes del título grande. Opcional. */
  eyebrow?: string;
  /** Título grande (h1) del correo. */
  titulo: string;
  /** HTML rico del cuerpo (output de TipTap). */
  cuerpoHtml: string;
  /** Imagen banner opcional (ratio recomendado: ~16:11). */
  heroImageUrl?: string;
  /** Bloque resaltado con filas etiqueta + valor. */
  dataBlock?: DataBlockItem[];
  /** Botón CTA. Si label o url falta, no se renderiza. */
  ctaLabel?: string;
  ctaUrl?: string;
  /** Texto pequeño centrado debajo del CTA. */
  helperText?: string;
};

/** Hex de cada acento — paleta institucional. */
const ACENTO_HEX: Record<AcentoCorreo, string> = {
  navy: "#1A2B4A",
  red: "#9e1915",
  gold: "#9e1915",
};

/**
 * Render puro: recibe Marca/Contacto/Diseno/Navbar como args y devuelve HTML.
 */
export function renderPremiumEmail(
  props: PremiumEmailProps,
  ctx: {
    marca: Marca;
    contacto: Contacto;
    diseno: CorreosDiseno;
    navbar: NavbarConfig;
  }
): string {
  const acentoHex = ACENTO_HEX[props.acento] ?? ACENTO_HEX.navy;
  const navyHex = paletaSafe(ctx.marca, "navy");
  const goldHex = paletaSafe(ctx.marca, "gold");
  const darkHex = "#0D1825";

  const isLogoWhiteOnNavy = ctx.diseno.logoVariant === "white_on_navy";
  const logoSrc = isLogoWhiteOnNavy
    ? ctx.marca.logos.blanco || ctx.marca.logos.principal
    : ctx.marca.logos.principal;
  const headerBg = isLogoWhiteOnNavy ? navyHex : "#FFFFFF";

  const tel = ctx.contacto.telefonos[0];
  const email = ctx.contacto.emails[0];
  const ano = new Date().getFullYear();

  // Badge "50 AÑOS" — viene de la config del Navbar (mismo lugar donde
  // editas el del sitio público). Si tiene logoSrc, usa imagen; si no, texto.
  const badge = ctx.navbar.aniversarioBadge;
  const badgeHtml = badge.visible
    ? badge.logoSrc
      ? `<img src="${escapeHtml(badge.logoSrc)}" alt="${escapeHtml(badge.label)}" height="24" style="display:block;height:24px;width:auto;border:0;outline:none;">`
      : `<span style="display:inline-block;font-family:Poppins,Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;padding:4px 10px;border-radius:999px;border:1px solid ${goldHex};color:${goldHex};">${escapeHtml(badge.label)}</span>`
    : "";

  const header = `
<tr><td bgcolor="${headerBg}" style="background:${headerBg};padding:28px 40px;border-radius:12px 12px 0 0;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="left" style="vertical-align:middle;">
        ${
          logoSrc
            ? `<img src="${escapeHtml(logoSrc)}" alt="${escapeHtml(ctx.marca.institucion.nombre)}" height="32" style="display:block;height:32px;width:auto;max-height:32px;border:0;outline:none;">`
            : `<span style="font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:22px;color:${isLogoWhiteOnNavy ? "#FFFFFF" : navyHex};letter-spacing:1px;">ATENAS</span>`
        }
      </td>
      <td align="right" style="vertical-align:middle;">
        ${badgeHtml}
      </td>
    </tr>
  </table>
</td></tr>
<tr><td bgcolor="${acentoHex}" style="background:${acentoHex};height:3px;line-height:3px;font-size:3px;">&nbsp;</td></tr>
`;

  const hero = props.heroImageUrl
    ? `<tr><td style="padding:0;line-height:0;font-size:0;background:${navyHex};">
  <img src="${escapeHtml(props.heroImageUrl)}" alt="" width="640" style="display:block;width:100%;max-width:640px;height:auto;border:0;outline:none;">
</td></tr>`
    : "";

  const eyebrow = props.eyebrow
    ? `<p style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${acentoHex};margin:0 0 12px;">${escapeHtml(props.eyebrow)}</p>`
    : "";

  const dataBlockHtml =
    props.dataBlock && props.dataBlock.length > 0
      ? renderDataBlock(props.dataBlock, navyHex, goldHex)
      : "";

  const ctaHtml = renderCta(props.ctaLabel, props.ctaUrl, props.helperText, acentoHex);

  const body = `
<tr><td bgcolor="#FFFFFF" style="background:#FFFFFF;padding:40px 40px 32px;">
  ${eyebrow}
  <h1 style="font-family:Poppins,Arial,sans-serif;font-size:28px;font-weight:700;color:${navyHex};line-height:1.15;margin:0 0 24px;">${escapeHtml(props.titulo)}</h1>
  <div style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#2C2C2C;line-height:1.7;">
    ${normalizeCuerpoHtml(props.cuerpoHtml, acentoHex, navyHex)}
  </div>
  ${dataBlockHtml}
  ${ctaHtml}
</td></tr>
`;

  const phoneLine = tel
    ? `${escapeHtml(tel.numero)}${tel.extension ? ` ext. ${escapeHtml(tel.extension)}` : ""}`
    : "";
  const emailLine = email
    ? `<a href="mailto:${escapeHtml(email.email)}" style="color:${goldHex};text-decoration:none;">${escapeHtml(email.email)}</a>`
    : "";

  const socials = renderSocials(ctx.contacto.redes, goldHex);

  const ciudad = ctx.marca.institucion.ciudad || "Ambato, Ecuador";
  const sitioWebFull = ctx.marca.institucion.sitioWeb || "https://atenas.edu.ec";
  const sitioWebLabel = sitioWebFull.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  const footer = `
<tr><td style="padding:0;height:1px;line-height:1px;font-size:1px;background:linear-gradient(90deg,transparent 0%,${goldHex} 50%,transparent 100%);">&nbsp;</td></tr>
<tr><td bgcolor="${darkHex}" style="background:${darkHex};padding:32px 40px;border-radius:0 0 12px 12px;">
  <p style="font-family:Poppins,Arial,sans-serif;font-weight:800;font-size:18px;letter-spacing:1px;color:#FFFFFF;margin:0 0 4px;">${escapeHtml(ctx.marca.institucion.nombre || "Unidad Educativa Atenas")}</p>
  <p style="font-family:Poppins,Arial,sans-serif;font-size:11px;color:${goldHex};letter-spacing:2px;text-transform:uppercase;margin:0 0 18px;">${escapeHtml(ciudad)}</p>
  <p style="font-family:Poppins,Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.65);line-height:1.8;margin:0 0 18px;">
    <strong style="color:#FFFFFF;font-weight:600;">${escapeHtml(ctx.marca.institucion.direccion || "")}</strong><br>
    ${phoneLine}${phoneLine && emailLine ? " · " : ""}${emailLine}
  </p>
  ${socials}
  <p style="font-family:Poppins,Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.4);line-height:1.7;margin:0;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
    © ${ano} ${escapeHtml(ctx.marca.institucion.nombre || "Unidad Educativa Atenas")} · ${escapeHtml(ciudad)} · <a href="${escapeHtml(sitioWebFull)}" style="color:rgba(255,255,255,0.55);text-decoration:none;">${escapeHtml(sitioWebLabel)}</a><br>
    ${escapeHtml(ctx.diseno.textoLegal)}
  </p>
</td></tr>
`;

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(props.titulo)}</title>
<style>
  @media (max-width:600px) {
    .email-container { width:100% !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#F4F1EB;font-family:Poppins,Arial,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#F4F1EB" style="background:#F4F1EB;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" class="email-container" style="width:640px;max-width:640px;background:#FFFFFF;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(13,24,37,0.08);">
      ${header}
      ${hero}
      ${body}
      ${footer}
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/* ─── helpers ─────────────────────────────────────────────────── */

function renderDataBlock(items: DataBlockItem[], navyHex: string, goldHex: string): string {
  const rows = items
    .map(
      (it, i) => `
    <tr>
      <td style="font-family:Poppins,Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6B6660;padding:8px 0 8px 20px;${i > 0 ? `border-top:1px solid rgba(158,25,21,0.20);` : ""}">${escapeHtml(it.label)}</td>
      <td align="right" style="font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:600;color:${navyHex};padding:8px 20px 8px 0;${i > 0 ? `border-top:1px solid rgba(158,25,21,0.20);` : ""}">${escapeHtml(it.value)}</td>
    </tr>`
    )
    .join("");
  return `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:24px 0;background:#F8F5F0;border-left:3px solid ${goldHex};border-radius:0 8px 8px 0;">
  ${rows}
</table>`;
}

function renderCta(label?: string, url?: string, helper?: string, acentoHex?: string): string {
  if (!label || !label.trim() || !url || !url.trim()) return "";
  const safeUrl = url.startsWith("http") ? url : `https://${url}`;
  const btn = `
<tr><td align="center" style="padding:24px 0 8px;">
  <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer"
     style="display:inline-block;font-family:Poppins,Arial,sans-serif;font-size:14px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:14px 32px;border-radius:4px;background:${acentoHex};color:#FFFFFF;text-decoration:none;">${escapeHtml(label)}</a>
</td></tr>`;
  const helperRow = helper
    ? `<tr><td align="center" style="font-family:Poppins,Arial,sans-serif;font-size:11px;color:#6B6660;padding:0 0 8px;">${escapeHtml(helper)}</td></tr>`
    : "";
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${btn}${helperRow}</table>`;
}

function renderSocials(redes: Contacto["redes"], goldHex: string): string {
  const items: Array<{ url: string; label: string; network: string }> = [];
  if (redes.facebook) items.push({ url: redes.facebook, label: "Facebook", network: "facebook" });
  if (redes.instagram) items.push({ url: redes.instagram, label: "Instagram", network: "instagram" });
  if (redes.youtube) items.push({ url: redes.youtube, label: "YouTube", network: "youtube" });
  if (redes.linkedin) items.push({ url: redes.linkedin, label: "LinkedIn", network: "linkedin" });
  if (redes.tiktok) items.push({ url: redes.tiktok, label: "TikTok", network: "tiktok" });
  if (redes.x) items.push({ url: redes.x, label: "X", network: "x" });
  if (items.length === 0) return "";
  const links = items
    .map((s) => {
      const iconDataUri = buildSocialIconDataUri(s.network, goldHex);
      return `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(s.label)}" style="display:inline-block;width:36px;height:36px;background:rgba(255,255,255,0.08);border-radius:50%;text-decoration:none;margin-right:8px;text-align:center;line-height:36px;"><img src="${iconDataUri}" alt="${escapeHtml(s.label)}" width="18" height="18" style="display:inline-block;border:0;outline:none;vertical-align:middle;"></a>`;
    })
    .join("");
  return `<p style="margin:0 0 22px;line-height:36px;">${links}</p>`;
}

function normalizeCuerpoHtml(html: string, acentoHex: string, navyHex: string): string {
  let out = html;
  out = out.replace(/<p(\s|>)/g, `<p style="font-family:Poppins,Arial,sans-serif;font-size:15px;color:#2C2C2C;line-height:1.7;margin:0 0 16px;"$1`);
  out = out.replace(/<strong(\s|>)/g, `<strong style="color:${navyHex};font-weight:700;"$1`);
  out = out.replace(/<em(\s|>)/g, `<em style="font-style:italic;"$1`);
  out = out.replace(/<a (?![^>]*style)/g, `<a style="color:${acentoHex};text-decoration:underline;" `);
  out = out.replace(/<ul(\s|>)/g, `<ul style="margin:0 0 18px;padding:0 0 0 22px;"$1`);
  out = out.replace(/<ol(\s|>)/g, `<ol style="margin:0 0 18px;padding:0 0 0 22px;"$1`);
  out = out.replace(/<li(\s|>)/g, `<li style="font-family:Poppins,Arial,sans-serif;font-size:14px;color:#2C2C2C;margin:4px 0;line-height:1.65;"$1`);
  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paletaSafe(m: Marca, key: "navy" | "rojo" | "gold" | "offWhite" | "dark"): string {
  if (key === "gold") return m.paleta.dorado || "#9e1915";
  if (key === "navy") return m.paleta.navy || "#1A2B4A";
  if (key === "rojo") return m.paleta.rojo || "#9e1915";
  if (key === "offWhite") return m.paleta.offWhite || "#F8F5F0";
  return m.paleta.dark || "#2C2C2C";
}
