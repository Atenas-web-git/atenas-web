import { redirect } from "next/navigation";
import { getCategoriasReconocimientos } from "@/lib/cms/getReconocimientos";

export const revalidate = 60;

export default async function ReconocimientosRootPage() {
  const cats = await getCategoriasReconocimientos();
  const first = cats[0]?.slug ?? "academicos";
  redirect(`/reconocimientos/${first}`);
}
