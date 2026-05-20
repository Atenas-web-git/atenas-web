/**
 * Construye una "base de conocimiento" en texto plano del contenido
 * público del sitio, lista para ser inyectada al system prompt del LLM.
 *
 * Lee:
 *   - Páginas publicadas (titulo, meta_description, slug, contenido JSONB)
 *   - Documentos institucionales (titulo, descripcion, URL Drive)
 *   - Eventos del cronograma (titulo, descripcion, fechas)
 *   - Categorías + subcategorías + logros de Reconocimientos visibles
 *   - Datos de Marca (institución, ciudad, sitio web)
 *   - Datos de Contacto (teléfonos, emails, redes, horario)
 *
 * Cada bloque se etiqueta para que el modelo entienda qué tipo de
 * recurso es y pueda referenciar URLs en sus respuestas.
 *
 * Cache: 60 segundos vía `unstable_cache` para evitar tocar BD en cada
 * mensaje del chatbot.
 */

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getConfiguracion,
  mergeMarca,
  mergeContacto,
  type Marca,
  type Contacto,
} from "@/lib/cms/getConfiguracion";

const CACHE_TAG = "chatbot-kb";
const CACHE_TTL_SECONDS = 60;

/** Claves del JSONB que NUNCA aportan info útil al modelo. */
const SKIP_KEYS = new Set([
  "icon",
  "iconName",
  "bgImage",
  "bgImageSrc",
  "imageSrc",
  "imageAlt",
  "img",
  "src",
  "alt",
  "href",
  "url",
  "color",
  "anchorId",
  "ghostText",
  "id",
  "slug",
  "type",
  "videoYoutubeUrl",
  "videoLinkUrl",
  "photoSrc",
  "fotoPrincipal",
  "fotoSecundaria",
  "fotoSecundaria1",
  "fotoSecundaria2",
  "logoSrc",
  "ctaHref",
  "linkHref",
  "ctaUrl",
  "filaHref",
]);

/**
 * Indica si un string parece "ruido técnico" en vez de contenido real.
 * Filtra hex colors, URLs, slugs kebab, paths con /, JSON-shaped strings.
 */
function isTechnicalString(s: string): boolean {
  const t = s.trim();
  if (t.length < 3) return true;
  if (/^#[0-9A-Fa-f]{3,8}$/.test(t)) return true; // hex
  if (/^rgba?\(/i.test(t)) return true;
  if (/^https?:\/\//i.test(t)) return true;
  if (/^\/[a-z0-9\-/_.]*$/i.test(t)) return true; // ruta
  if (/^[a-z][a-z0-9_-]*$/.test(t) && t.length < 24 && !/\s/.test(t)) return true; // slug
  return false;
}

/**
 * Extrae texto narrativo de un objeto JSONB (contenido de página).
 * Recorre recursivo pero salta claves técnicas (icon, color, src, etc.)
 * y filtra strings que parecen identificadores en vez de contenido real.
 */
function extractTextFromJson(obj: unknown, depth = 0): string {
  if (depth > 10) return "";
  if (typeof obj === "string") {
    return isTechnicalString(obj) ? "" : obj;
  }
  if (typeof obj === "number" || typeof obj === "boolean") {
    return String(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((it) => extractTextFromJson(it, depth + 1)).filter(Boolean).join(" ");
  }
  if (obj && typeof obj === "object") {
    const out: string[] = [];
    for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
      if (SKIP_KEYS.has(key)) continue;
      const piece = extractTextFromJson(val, depth + 1);
      if (piece) out.push(piece);
    }
    return out.join(" ");
  }
  return "";
}

/** Limpia HTML del output de TipTap a texto plano. */
function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Limita texto a N caracteres por entrada para controlar tamaño total. */
function clip(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

async function buildKnowledgeBaseImpl(): Promise<string> {
  const supabase = createAdminClient();

  const [marcaRaw, contactoRaw] = await Promise.all([
    getConfiguracion<Partial<Marca>>("marca"),
    getConfiguracion<Partial<Contacto>>("contacto"),
  ]);
  const marca = mergeMarca(marcaRaw);
  const contacto = mergeContacto(contactoRaw);

  const [
    { data: paginas },
    { data: documentos },
    { data: eventos },
    { data: categorias },
    { data: subcategorias },
    { data: logros },
  ] = await Promise.all([
    supabase
      .from("paginas")
      .select("slug, titulo, meta_title, meta_description, plantilla, contenido")
      .eq("publicada", true)
      .order("slug", { ascending: true }),
    supabase
      .from("documentos")
      .select("titulo, descripcion, drive_url")
      .eq("publicado", true)
      .order("orden", { ascending: true })
      .limit(40),
    supabase
      .from("cronograma_eventos")
      .select("titulo, descripcion, fecha_inicio, fecha_fin")
      .eq("publicado", true)
      .order("fecha_inicio", { ascending: true })
      .limit(60),
    supabase
      .from("reconocimientos_categorias")
      .select("slug, nombre, hero_subtitle, meta_description")
      .eq("visible", true)
      .order("orden", { ascending: true }),
    supabase
      .from("reconocimientos_subcategorias")
      .select("slug, nombre, categoria_id, hero_subtitle")
      .eq("visible", true)
      .order("orden", { ascending: true }),
    supabase
      .from("reconocimientos_logros")
      .select("titulo, year, descripcion, categoria_id, subcategoria_id")
      .eq("visible", true)
      .order("year", { ascending: false })
      .limit(80),
  ]);

  const chunks: string[] = [];

  // ─── Marca + Contacto ──────────────────────────────────────────
  chunks.push("## DATOS INSTITUCIONALES");
  chunks.push(`Nombre: ${marca.institucion.nombre}`);
  if (marca.institucion.ruc) chunks.push(`RUC: ${marca.institucion.ruc}`);
  chunks.push(`Dirección: ${marca.institucion.direccion}`);
  chunks.push(`Ciudad: ${marca.institucion.ciudad}`);
  chunks.push(`Sitio web: ${marca.institucion.sitioWeb}`);
  chunks.push(`Año de fundación: ${marca.institucion.anioFundacion}`);

  chunks.push("\n## CANALES DE CONTACTO");
  if (contacto.horario) chunks.push(`Horario de atención: ${contacto.horario}`);
  for (const tel of contacto.telefonos) {
    chunks.push(
      `Teléfono ${tel.label || ""}: ${tel.numero}${tel.extension ? " ext. " + tel.extension : ""}${tel.esWhatsApp ? " (acepta WhatsApp)" : ""}`
    );
  }
  for (const em of contacto.emails) {
    chunks.push(`Email ${em.label || ""}: ${em.email}`);
  }
  const redes = contacto.redes;
  const redesList: string[] = [];
  if (redes.facebook) redesList.push(`Facebook: ${redes.facebook}`);
  if (redes.instagram) redesList.push(`Instagram: ${redes.instagram}`);
  if (redes.youtube) redesList.push(`YouTube: ${redes.youtube}`);
  if (redes.tiktok) redesList.push(`TikTok: ${redes.tiktok}`);
  if (redes.linkedin) redesList.push(`LinkedIn: ${redes.linkedin}`);
  if (redes.x) redesList.push(`X / Twitter: ${redes.x}`);
  if (redesList.length > 0) {
    chunks.push("Redes sociales:");
    chunks.push(...redesList);
  }

  // ─── Páginas del CMS ───────────────────────────────────────────
  if (paginas && paginas.length > 0) {
    chunks.push("\n## PÁGINAS PUBLICADAS DEL SITIO ATENAS");
    chunks.push(
      `Total: ${paginas.length} páginas. Cada bloque incluye el título de la sección, la URL en el sitio y el contenido completo.`
    );
    for (const p of paginas as Array<{
      slug: string;
      titulo: string;
      meta_title: string | null;
      meta_description: string | null;
      plantilla: string;
      contenido: unknown;
    }>) {
      const titulo = p.titulo || p.meta_title || "Página sin título";
      const slug = p.slug || "";
      const metaT = p.meta_title || "";
      const metaD = p.meta_description || "";
      const contenidoRaw = extractTextFromJson(p.contenido);
      const cleaned = stripHtml(contenidoRaw)
        .replace(/\s+/g, " ")
        .trim();
      const bodyClipped = clip(cleaned, 3500);

      chunks.push(`\n### ${titulo}`);
      chunks.push(`URL: /${slug}`);
      if (metaT && metaT !== titulo) chunks.push(`Meta título: ${metaT}`);
      if (metaD) chunks.push(`Descripción corta: ${metaD}`);
      if (bodyClipped) {
        chunks.push(`Contenido completo:\n${bodyClipped}`);
      } else {
        chunks.push("(Página sin contenido editable todavía)");
      }
    }
  }

  // ─── Documentos ─────────────────────────────────────────────────
  if (documentos && documentos.length > 0) {
    chunks.push("\n## DOCUMENTOS INSTITUCIONALES DESCARGABLES");
    chunks.push("Lista accesible desde /documentos-institucionales");
    for (const d of documentos) {
      chunks.push(`- ${d.titulo}${d.descripcion ? ` — ${d.descripcion}` : ""}`);
    }
  }

  // ─── Cronograma ─────────────────────────────────────────────────
  if (eventos && eventos.length > 0) {
    chunks.push("\n## CRONOGRAMA ANUAL DE EVENTOS");
    chunks.push("Calendario accesible desde /cronograma-anual");
    for (const ev of eventos) {
      const fechaInicio = ev.fecha_inicio ? String(ev.fecha_inicio) : "";
      const fechaFin = ev.fecha_fin ? ` al ${ev.fecha_fin}` : "";
      const desc = ev.descripcion ? ` — ${ev.descripcion}` : "";
      chunks.push(`- ${ev.titulo} (${fechaInicio}${fechaFin})${desc}`);
    }
  }

  // ─── Reconocimientos ────────────────────────────────────────────
  if (categorias && categorias.length > 0) {
    chunks.push("\n## RECONOCIMIENTOS DEL COLEGIO");
    const subsByCat = new Map<number, Array<{ nombre: string; slug: string }>>();
    for (const s of (subcategorias ?? []) as Array<{
      categoria_id: number;
      nombre: string;
      slug: string;
    }>) {
      const arr = subsByCat.get(s.categoria_id) ?? [];
      arr.push({ nombre: s.nombre, slug: s.slug });
      subsByCat.set(s.categoria_id, arr);
    }
    const logrosByCat = new Map<number, Array<{ titulo: string; year: string; descripcion: string }>>();
    for (const l of (logros ?? []) as Array<{
      categoria_id: number;
      titulo: string;
      year: string;
      descripcion: string;
    }>) {
      const arr = logrosByCat.get(l.categoria_id) ?? [];
      arr.push({ titulo: l.titulo, year: l.year, descripcion: l.descripcion });
      logrosByCat.set(l.categoria_id, arr);
    }
    for (const c of categorias as Array<{
      slug: string;
      nombre: string;
      hero_subtitle: string;
      meta_description: string | null;
      id: number;
    }>) {
      chunks.push(`\n### ${c.nombre} — /reconocimientos/${c.slug}`);
      const resumen = c.meta_description || c.hero_subtitle;
      if (resumen) chunks.push(resumen);
      const subs = subsByCat.get(c.id) ?? [];
      if (subs.length > 0) {
        chunks.push("Disciplinas:");
        for (const s of subs) chunks.push(`- ${s.nombre}`);
      }
      const ls = (logrosByCat.get(c.id) ?? []).slice(0, 10);
      if (ls.length > 0) {
        chunks.push("Logros destacados:");
        for (const l of ls) {
          chunks.push(`- ${l.titulo}${l.year ? ` (${l.year})` : ""}${l.descripcion ? ` — ${l.descripcion}` : ""}`);
        }
      }
    }
  }

  return chunks.join("\n");
}

/**
 * API pública — versión cacheada que se invoca desde el endpoint del chatbot.
 * Se refresca cada 60 segundos automáticamente.
 */
export const buildKnowledgeBase = unstable_cache(
  buildKnowledgeBaseImpl,
  [CACHE_TAG],
  { revalidate: CACHE_TTL_SECONDS, tags: [CACHE_TAG] }
);
