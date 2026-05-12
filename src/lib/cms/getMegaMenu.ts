import { createClient } from "@/lib/supabase/server";

/**
 * Item del mega-menú tal como llega de la tabla `menu_items`.
 */
export type MenuItemRow = {
  id: string;
  parent_id: string | null;
  label: string;
  href: string | null;
  external: boolean;
  badge: string | null;
  visible: boolean;
  orden: number;
};

/**
 * Sub-item del mega-menú (segundo nivel — link a una página).
 */
export type MenuSubItem = {
  id: string;
  label: string;
  href: string;
  external: boolean;
  badge: string | null;
};

/**
 * Categoría del mega-menú (primer nivel — agrupa sub-items).
 */
export type MenuCategoria = {
  id: string;
  label: string;
  /** Si la categoría también es clickeable (raro, pero posible). */
  href: string | null;
  badge: string | null;
  /** Sub-items dentro de esta categoría, ordenados. */
  items: MenuSubItem[];
};

/**
 * Lee el árbol del mega-menú desde Supabase y lo estructura como
 * `MenuCategoria[]` con sus sub-items. Solo incluye items visibles.
 *
 * Si Supabase falla devuelve un arreglo vacío para que el frontend pueda
 * fallback al menú hardcoded.
 */
export async function getMegaMenu(): Promise<MenuCategoria[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("id, parent_id, label, href, external, badge, visible, orden")
      .eq("visible", true)
      .order("orden", { ascending: true });

    if (error || !data) return [];

    const rows = data as MenuItemRow[];

    // Construir árbol: items sin parent_id son categorías; con parent_id son sub-items.
    const categorias: MenuCategoria[] = rows
      .filter((r) => r.parent_id === null)
      .map((cat) => ({
        id: cat.id,
        label: cat.label,
        href: cat.href,
        badge: cat.badge,
        items: rows
          .filter((sub) => sub.parent_id === cat.id)
          .map((sub) => ({
            id: sub.id,
            label: sub.label,
            href: sub.href ?? "#",
            // Auto-detectar externo si href empieza con http (además del flag explícito)
            external: sub.external || (sub.href?.startsWith("http") ?? false),
            badge: sub.badge,
          })),
      }));

    return categorias;
  } catch {
    return [];
  }
}

/**
 * Variante "admin" — lee TODOS los items, incluso ocultos, sin filtrar
 * por `visible`. Pensado para el editor del backoffice (que ya viene
 * autenticado con superadmin y usa el admin client).
 */
export type MenuItemAdmin = MenuItemRow & {
  /** Sub-items hijos del item (vacío si es hoja). */
  children: MenuItemAdmin[];
};

export function buildAdminTree(rows: MenuItemRow[]): MenuItemAdmin[] {
  const byParent = new Map<string | null, MenuItemRow[]>();
  for (const r of rows) {
    const key = r.parent_id;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(r);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => a.orden - b.orden);
  }

  function build(parentId: string | null): MenuItemAdmin[] {
    return (byParent.get(parentId) ?? []).map((r) => ({
      ...r,
      children: build(r.id),
    }));
  }

  return build(null);
}
