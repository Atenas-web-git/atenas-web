import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { HeroCategoria } from "@/components/revista/HeroCategoria";
import { GridNoticias } from "@/components/revista/GridNoticias";
import { ARTICULOS } from "@/components/revista/data";

const SLUGS: Record<string, { nombre: string; imagen: string; descripcion: string }> = {
  "educacion-inicial":  { nombre: "Educación Inicial",  imagen: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=1440&q=80", descripcion: "Todo sobre el aprendizaje temprano y metodologías lúdicas."   },
  "bachillerato-ib":    { nombre: "Bachillerato IB",    imagen: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1440&q=80", descripcion: "Logros, noticias y vida del programa del Diploma IB en Atenas." },
  "deportes":           { nombre: "Deportes",           imagen: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1440&q=80", descripcion: "Torneos, campeonatos y el deporte que une a la comunidad."       },
  "cultura":            { nombre: "Cultura",            imagen: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1440&q=80", descripcion: "Arte, música, teatro y expresión creativa en Atenas."           },
};

export async function generateStaticParams() {
  return Object.keys(SLUGS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = SLUGS[slug] ?? { nombre: slug };
  return {
    title: `${cat.nombre} — Revista Atenas`,
    description: cat.descripcion ?? "",
  };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = SLUGS[slug] ?? { nombre: slug, imagen: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1440&q=80", descripcion: "" };
  const articulos = ARTICULOS.filter(a => a.categoria.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "") === slug);

  return (
    <>
      <Navbar />
      <main>
        <HeroCategoria nombre={cat.nombre} imagen={cat.imagen} descripcion={cat.descripcion} count={articulos.length} slug={slug} />
        <GridNoticias articulos={articulos.length ? articulos : ARTICULOS} titulo={cat.nombre} verTodosHref="/revista" />
        <FooterCTA />
      </main>
    </>
  );
}
