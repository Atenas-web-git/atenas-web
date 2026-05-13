import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { NavReconocimientos } from "@/components/reconocimientos/NavReconocimientos";
import { GaleriaCompleta } from "@/components/reconocimientos/GaleriaCompleta";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getCategoriaReconocimiento,
  getGaleriaReconocimientos,
} from "@/lib/cms/getReconocimientos";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: Promise<{ categoria: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params;
  const cat = await getCategoriaReconocimiento(categoria);
  if (!cat) return { title: "No encontrado" };
  return {
    title: `Galería — ${cat.nombre} | Atenas`,
    description: cat.galeriaSubtitulo || `Galería completa de fotos de ${cat.nombre}.`,
  };
}

export default async function GaleriaCategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const cat = await getCategoriaReconocimiento(categoria);
  if (!cat) notFound();

  const fotos = await getGaleriaReconocimientos("categoria", cat.id);

  return (
    <>
      <Navbar />
      <main>
        <NavReconocimientos currentSlug={cat.slug} />
        <GaleriaCompleta
          titulo={cat.galeriaTitulo || `Galería — ${cat.nombre}`}
          subtitulo={cat.galeriaSubtitulo}
          photos={fotos.map((f) => ({ src: f.src, alt: f.alt }))}
        />
        <FooterCTA />
      </main>
    </>
  );
}
