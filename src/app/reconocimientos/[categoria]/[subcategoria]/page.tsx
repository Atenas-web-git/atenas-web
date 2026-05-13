import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getSubcategoriaReconocimiento,
  getLogrosReconocimientos,
  getGaleriaReconocimientos,
} from "@/lib/cms/getReconocimientos";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ categoria: string; subcategoria: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, subcategoria } = await params;
  const found = await getSubcategoriaReconocimiento(categoria, subcategoria);
  if (!found) return { title: "No encontrado" };
  const { categoria: cat, subcategoria: sub } = found;
  return {
    title:
      sub.metaTitle ??
      `${sub.heroTitle || sub.nombre} — Reconocimientos ${cat.nombre} | Atenas`,
    description: sub.metaDescription ?? sub.heroSubtitle,
  };
}

export default async function SubcategoriaPage({ params }: Props) {
  const { categoria, subcategoria } = await params;
  const found = await getSubcategoriaReconocimiento(categoria, subcategoria);
  if (!found) notFound();
  const { categoria: cat, subcategoria: sub } = found;

  const [logros, galeria] = await Promise.all([
    getLogrosReconocimientos({ categoriaId: cat.id, subcategoriaId: sub.id }),
    getGaleriaReconocimientos("subcategoria", sub.id),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={
            sub.heroBadge ||
            `${cat.nombre.toUpperCase()} — ${sub.nombre.toUpperCase()}`
          }
          title={`${sub.icon ? sub.icon + " " : ""}${sub.heroTitle || sub.nombre}`}
          subtitle={sub.heroSubtitle || cat.heroSubtitle}
          ghostText={sub.heroGhostText || sub.nombre.toUpperCase()}
          footnote={sub.heroFootnote ?? cat.heroFootnote ?? undefined}
          bgImageSrc={sub.heroBgImage ?? cat.heroBgImage ?? undefined}
        />
        <NavReconocimientos currentSlug={cat.slug} />

        {logros.length > 0 && (
          <LogrosDestacados
            heading={sub.logrosHeading || `Nuestros logros en ${sub.nombre}`}
            subheading={
              sub.logrosSubheading ||
              "Toca los puntos de cada tarjeta para navegar entre las fotos."
            }
            logros={logros.map((l) => ({
              icon: l.icon,
              deporte: sub.nombre,
              titulo: l.titulo,
              year: l.year,
              categoria: l.descripcion,
              photos:
                l.fotos.length > 0
                  ? l.fotos
                  : ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80"],
              highlight: l.highlight,
            }))}
          />
        )}

        {galeria.length > 0 && (
          <GaleriaLogros
            titulo={sub.galeriaTitulo || `Galería — ${sub.nombre}`}
            subtitulo={sub.galeriaSubtitulo || "Momentos de esta sección"}
            photos={galeria.map((f) => ({ src: f.src, alt: f.alt }))}
            verCompletaHref={`/reconocimientos/${cat.slug}/${sub.slug}/galeria`}
          />
        )}

        <FooterCTA />
      </main>
    </>
  );
}
