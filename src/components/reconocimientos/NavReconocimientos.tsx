import { getCategoriasReconocimientos } from "@/lib/cms/getReconocimientos";
import { NavReconocimientosClient } from "./NavReconocimientosClient";

export type NavCategoria = { slug: string; nombre: string };

const FALLBACK: NavCategoria[] = [
  { slug: "academicos", nombre: "Académicos" },
  { slug: "deportivos", nombre: "Deportivos" },
];

export async function NavReconocimientos({ currentSlug }: { currentSlug: string }) {
  const cats = await getCategoriasReconocimientos();
  const items: NavCategoria[] =
    cats.length > 0 ? cats.map((c) => ({ slug: c.slug, nombre: c.nombre })) : FALLBACK;
  return <NavReconocimientosClient items={items} currentSlug={currentSlug} />;
}
