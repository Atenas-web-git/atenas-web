import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { LogrosCompleta, type SubcategoriaGroup, type LogroItem } from "@/components/reconocimientos/LogrosCompleta";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getCategoriaReconocimiento,
  getSubcategoriasReconocimientos,
  getLogrosReconocimientos,
} from "@/lib/cms/getReconocimientos";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ categoria: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const cat = await getCategoriaReconocimiento(categoria);
  if (!cat) return { title: "No encontrado" };
  return {
    title: `Todos los logros — ${cat.nombre} | Atenas`,
    description: `Listado completo de reconocimientos en la categoría ${cat.nombre} de la Unidad Educativa Atenas.`,
  };
}

export default async function LogrosCompletaPage({ params }: Props) {
  const { categoria } = await params;
  const cat = await getCategoriaReconocimiento(categoria);
  if (!cat) notFound();

  const [subs, todosLogros] = await Promise.all([
    getSubcategoriasReconocimientos(cat.id),
    getLogrosReconocimientos({ categoriaId: cat.id }),
  ]);

  const toItem = (l: (typeof todosLogros)[number]): LogroItem => ({
    id: l.id,
    icon: l.icon,
    titulo: l.titulo,
    year: l.year,
    descripcion: l.descripcion,
    highlight: l.highlight,
    fotos: l.fotos,
  });

  const destacados = todosLogros.filter((l) => l.highlight).map(toItem);
  const logrosSueltos = todosLogros
    .filter((l) => l.subcategoriaId === null && !l.highlight)
    .map(toItem);

  const grupos: SubcategoriaGroup[] = subs.map((s) => ({
    id: s.id,
    slug: s.slug,
    nombre: s.nombre,
    icon: s.icon,
    logros: todosLogros
      .filter((l) => l.subcategoriaId === s.id && !l.highlight)
      .map(toItem),
  }));

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={`TODOS LOS LOGROS — ${cat.nombre.toUpperCase()}`}
          title={`Todos los logros de ${cat.nombre}`}
          subtitle={`Listado completo de los reconocimientos registrados en ${cat.nombre}, agrupados por subcategoría.`}
          ghostText="LOGROS"
          footnote={cat.heroFootnote ?? undefined}
          bgImageSrc={cat.heroBgImage ?? undefined}
        />
        <NavReconocimientos currentSlug={cat.slug} />
        <LogrosCompleta destacados={destacados} grupos={grupos} logrosSueltos={logrosSueltos} />
        <FooterCTA />
      </main>
    </>
  );
}
