import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { DisciplinaShowcase } from "@/components/reconocimientos/DisciplinaShowcase";
import { LogrosDestacados } from "@/components/reconocimientos/LogrosDestacados";
import { GaleriaLogros } from "@/components/reconocimientos/GaleriaLogros";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getCategoriaReconocimiento,
  getSubcategoriasReconocimientos,
  getLogrosReconocimientos,
  getGaleriaReconocimientos,
  getCategoriasReconocimientos,
} from "@/lib/cms/getReconocimientos";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  const cats = await getCategoriasReconocimientos();
  return cats.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const cat = await getCategoriaReconocimiento(categoria);
  if (!cat) return { title: "No encontrado" };
  return {
    title: cat.metaTitle ?? `${cat.nombre} — Reconocimientos | Atenas`,
    description: cat.metaDescription ?? cat.heroSubtitle,
  };
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const cat = await getCategoriaReconocimiento(categoria);
  if (!cat) notFound();

  const [subs, destacados, galeria] = await Promise.all([
    getSubcategoriasReconocimientos(cat.id),
    getLogrosReconocimientos({ categoriaId: cat.id, soloHighlight: true, limite: 6 }),
    getGaleriaReconocimientos("categoria", cat.id),
  ]);

  const showcaseItems = subs.map((s) => ({
    slug: s.slug,
    icon: s.icon,
    nombre: s.nombre,
    count: s.countValue,
    countLabel: s.countLabel,
    photoSrc: s.photoSrc,
    basePath: `/reconocimientos/${cat.slug}`,
  }));

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={cat.heroBadge}
          title={cat.heroTitle}
          subtitle={cat.heroSubtitle}
          ghostText={cat.heroGhostText}
          footnote={cat.heroFootnote ?? undefined}
          bgImageSrc={cat.heroBgImage ?? undefined}
        />
        <NavReconocimientos currentSlug={cat.slug} />

        {showcaseItems.length > 0 && (
          <DisciplinaShowcase
            disciplinas={showcaseItems}
            heading={cat.showcaseHeading}
            ctaText={cat.showcaseCtaText}
            verTodosHref={`/reconocimientos/${cat.slug}/logros`}
          />
        )}

        {destacados.length > 0 && (
          <LogrosDestacados
            heading={cat.logrosHeading}
            subheading={cat.logrosSubheading}
            logros={destacados.map((l) => ({
              icon: l.icon,
              deporte: subs.find((s) => s.id === l.subcategoriaId)?.nombre ?? cat.nombre,
              titulo: l.titulo,
              year: l.year,
              categoria: l.descripcion,
              photos: l.fotos.length > 0 ? l.fotos : [
                "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=80",
              ],
              highlight: l.highlight,
            }))}
            verTodosHref={
              showcaseItems.length === 0
                ? `/reconocimientos/${cat.slug}/logros`
                : undefined
            }
            verTodosLabel="Ver todos los logros"
          />
        )}

        {galeria.length > 0 && (
          <GaleriaLogros
            titulo={cat.galeriaTitulo || "Galería"}
            subtitulo={cat.galeriaSubtitulo || ""}
            photos={galeria.map((f) => ({ src: f.src, alt: f.alt }))}
            verCompletaHref={`/reconocimientos/${cat.slug}/galeria`}
          />
        )}

        <FooterCTA />
      </main>
    </>
  );
}
