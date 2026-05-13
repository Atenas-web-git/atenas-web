import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { GaleriaCompleta } from "@/components/reconocimientos/GaleriaCompleta";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getSubcategoriaReconocimiento,
  getGaleriaReconocimientos,
} from "@/lib/cms/getReconocimientos";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ categoria: string; subcategoria: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria, subcategoria } = await params;
  const found = await getSubcategoriaReconocimiento(categoria, subcategoria);
  if (!found) return { title: "No encontrado" };
  const { subcategoria: sub } = found;
  return {
    title: `Galería — ${sub.nombre} | Atenas`,
    description: sub.galeriaSubtitulo || `Galería completa de ${sub.nombre}.`,
  };
}

export default async function GaleriaSubcategoriaPage({ params }: Props) {
  const { categoria, subcategoria } = await params;
  const found = await getSubcategoriaReconocimiento(categoria, subcategoria);
  if (!found) notFound();
  const { categoria: cat, subcategoria: sub } = found;

  const fotos = await getGaleriaReconocimientos("subcategoria", sub.id);

  return (
    <>
      <Navbar />
      <main>
        <NavReconocimientos currentSlug={cat.slug} />
        <GaleriaCompleta
          titulo={sub.galeriaTitulo || `Galería — ${sub.nombre}`}
          subtitulo={sub.galeriaSubtitulo}
          photos={fotos.map((f) => ({ src: f.src, alt: f.alt }))}
        />
        <FooterCTA />
      </main>
    </>
  );
}
