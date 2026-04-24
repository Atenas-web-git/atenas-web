import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICIOS, getServicio } from "@/data/servicios";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { DetalleServicio } from "@/components/servicios/DetalleServicio";
import { FooterCTA } from "@/components/home/FooterCTA";

interface Props {
  params: Promise<{ servicio: string }>;
}

export function generateStaticParams() {
  return SERVICIOS.map((s) => ({ servicio: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { servicio: slug } = await params;
  const s = getServicio(slug);
  if (!s) return {};
  return {
    title: `${s.nombre} | Servicios | Atenas`,
    description: s.descripcionCorta,
  };
}

export default async function ServicioPage({ params }: Props) {
  const { servicio: slug } = await params;
  const s = getServicio(slug);
  if (!s) notFound();

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge="SERVICIOS INSTITUCIONALES"
          title={s.nombre}
          subtitle={s.heroSubtitle}
          ghostText={s.ghostText}
        />
        <DetalleServicio slug={slug} />
        <FooterCTA />
      </main>
    </>
  );
}
