import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";
import { SocialShare } from "@/components/revista/SocialShare";
import { ArticuloCard } from "@/components/revista/ArticuloCard";
import { ARTICULOS } from "@/components/revista/data";

export async function generateStaticParams() {
  return ARTICULOS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = ARTICULOS.find(a => a.slug === slug);
  if (!art) return {};
  return { title: `${art.titulo} — Revista Atenas`, description: art.extracto };
}

export default async function ArticuloPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = ARTICULOS.find(a => a.slug === slug);
  if (!art) notFound();

  const relacionados = ARTICULOS.filter(a => a.id !== art.id && a.categoria === art.categoria).slice(0, 3);
  const masArticulos  = relacionados.length < 3
    ? [...relacionados, ...ARTICULOS.filter(a => a.id !== art.id && !relacionados.includes(a))].slice(0, 3)
    : relacionados;

  const galeriaImgs = [
    art.imagen,
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=520&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&q=80",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&q=80",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&q=80",
  ];

  return (
    <>
      <Navbar />
      <main>

        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden bg-[#0D1825]" style={{ minHeight: 560 }}>
          <Image src={art.imagen} alt={art.titulo} fill className="object-cover object-center" style={{ opacity: 0.35 }} priority />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(13,24,37,0.96) 0%,rgba(13,24,37,0.60) 50%,rgba(13,24,37,0.95) 100%)" }} />

          <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-0 pt-[130px] pb-[64px]">
            {/* Breadcrumb */}
            <div className="flex items-center gap-[8px] mb-[20px]">
              <Link href="/revista" style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80">Revista</Link>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
              <Link href={`/revista/categoria/${art.categoria.toLowerCase().replace(/\s+/g,"-").replace(/[()]/g,"")}`} style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)" }} className="hover:opacity-80">{art.categoria}</Link>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
              <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "#C9A84C", fontWeight: 700 }}>Artículo</span>
            </div>

            <span className="inline-block px-[16px] py-[6px] rounded-[20px] text-[11px] font-bold mb-[16px]" style={{ fontFamily: "Poppins,sans-serif", background: "#C9A84C", color: "#0D1825" }}>
              {art.categoria}
            </span>

            <h1 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(28px,3.5vw,48px)", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2, maxWidth: 860, marginBottom: 32 }}>
              {art.titulo}
            </h1>

            <div className="flex items-center gap-[18px] flex-wrap">
              <div className="flex items-center gap-[10px]">
                <div className="w-[40px] h-[40px] rounded-full bg-[#C9A84C] flex items-center justify-center" style={{ fontSize: 16, fontWeight: 700, color: "#0D1825", fontFamily: "Poppins,sans-serif" }}>R</div>
                <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>Redacción Atenas</span>
              </div>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.25)" }} />
              <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{art.fecha}</span>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.25)" }} />
              <span style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{art.minLectura} min lectura</span>
            </div>
          </div>
        </section>

        {/* ─── Cuerpo + Sidebar ─── */}
        <section className="bg-white py-[64px] md:py-[80px]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-0">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-[60px]">

              {/* Contenido principal */}
              <article className="min-w-0">
                <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 17, color: "#1A2B4A", lineHeight: 1.8, marginBottom: 28 }}>
                  {art.extracto} Seis estudiantes del Bachillerato Internacional de la Unidad Educativa Atenas lograron puntajes perfectos o cercanos al máximo en los exámenes finales, marcando un hito histórico para la institución y posicionando a Atenas entre las mejores del Ecuador.
                </p>

                {/* Pull quote */}
                <blockquote
                  className="my-[32px] py-[20px] pr-[24px] pl-[28px]"
                  style={{ fontFamily: "Poppins,sans-serif", fontSize: 19, fontWeight: 700, color: "#1A2B4A", lineHeight: 1.5, background: "#F8F5F0", borderRadius: 8, borderLeft: "4px solid #C9A84C" }}
                >
                  "El esfuerzo y la dedicación de nuestros estudiantes demuestra que la excelencia académica es posible cuando hay pasión y guía."
                  <footer style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", marginTop: 10 }}>— Rector, Unidad Educativa Atenas</footer>
                </blockquote>

                <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 17, color: "#1A2B4A", lineHeight: 1.8, marginBottom: 28 }}>
                  Los exámenes del Programa del Diploma IB evalúan a los estudiantes en seis grupos de materias más tres componentes del núcleo: Teoría del Conocimiento, Monografía y Creatividad, Actividad y Servicio. Obtener 40 puntos o más sobre 45 posibles es considerado excepcional a nivel mundial.
                </p>

                {/* Imagen embebida */}
                <figure className="my-[32px]">
                  <div className="relative rounded-[10px] overflow-hidden" style={{ height: "clamp(260px,30vw,420px)" }}>
                    <Image src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80" alt="Estudiantes IB" fill className="object-cover object-center" sizes="800px" />
                  </div>
                  <figcaption style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(26,43,74,0.55)", marginTop: 10 }}>
                    Los seis estudiantes destacados junto al cuerpo docente del programa IB — Enero 2026
                  </figcaption>
                </figure>

                <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 17, color: "#1A2B4A", lineHeight: 1.8, marginBottom: 28 }}>
                  La coordinadora del programa IB, Lcda. María Fernanda Vega, destacó que estos resultados son fruto de un trabajo continuo que va más allá del aula. "Nuestros estudiantes no solo memorizan contenidos; desarrollan pensamiento crítico, aprenden a investigar y a cuestionarse el mundo que los rodea."
                </p>

                {/* Video embed */}
                <div className="relative my-[32px] rounded-[10px] overflow-hidden" style={{ height: "clamp(220px,28vw,400px)", background: "#0D1825" }}>
                  <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80" alt="Video ceremonia" fill className="object-cover object-center" style={{ opacity: 0.5 }} sizes="800px" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-[12px]">
                    <button className="w-[64px] h-[64px] rounded-full flex items-center justify-center shadow-xl" style={{ background: "#C9A84C" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0D1825"><polygon points="5,3 19,12 5,21"/></svg>
                    </button>
                  </div>
                  <p className="absolute bottom-[16px] left-[20px]" style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.75)" }}>
                    ▶ Ceremonia de premiación IB 2026 — Auditorio Atenas
                  </p>
                </div>

                <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 17, color: "#1A2B4A", lineHeight: 1.8, marginBottom: 28 }}>
                  Ecuador cuenta actualmente con 14 colegios autorizados a impartir el Diploma IB. Los puntajes de Atenas 2026 ubican a la institución en el top 3 nacional, consolidando un camino de excelencia iniciado cuando el colegio obtuvo la autorización IB en 2018.
                </p>

                {/* Galería inline 3 fotos */}
                <div className="grid grid-cols-3 gap-[12px] my-[32px]">
                  {["https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&q=80","https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&q=80"].map((src, i) => (
                    <div key={i} className="relative rounded-[8px] overflow-hidden" style={{ height: 180 }}>
                      <Image src={src} alt="" fill className="object-cover object-center" sizes="260px" />
                    </div>
                  ))}
                </div>
              </article>

              {/* Sidebar */}
              <aside className="flex flex-col gap-[24px] md:sticky md:top-[80px] self-start">
                <SocialShare titulo={art.titulo} slug={art.slug} />

                {/* Autor */}
                <div className="rounded-[12px] p-6 flex flex-col gap-[14px]" style={{ background: "#F8F5F0", border: "1px solid #E8E4DD" }}>
                  <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>Autor</p>
                  <div className="flex items-center gap-[12px]">
                    <div className="w-[48px] h-[48px] rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0" style={{ fontSize: 18, fontWeight: 700, color: "#0D1825", fontFamily: "Poppins,sans-serif" }}>R</div>
                    <div>
                      <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 14, fontWeight: 700, color: "#1A2B4A" }}>Redacción Atenas</p>
                      <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 12, color: "rgba(26,43,74,0.6)" }}>Equipo comunicación institucional</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, color: "rgba(26,43,74,0.65)", lineHeight: 1.6 }}>
                    Noticias, logros y vida institucional de la Unidad Educativa Atenas desde 1976.
                  </p>
                </div>

                {/* Artículos relacionados en sidebar */}
                <div className="rounded-[12px] p-6 flex flex-col gap-[16px]" style={{ background: "#F8F5F0", border: "1px solid #E8E4DD" }}>
                  <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2, textTransform: "uppercase" }}>También te interesa</p>
                  {masArticulos.map(rel => (
                    <Link key={rel.id} href={`/revista/${rel.slug}`} className="flex items-start gap-[12px] hover:opacity-75 transition-opacity">
                      <div className="relative w-[60px] h-[60px] rounded-[8px] overflow-hidden flex-shrink-0">
                        <Image src={rel.imagen} alt={rel.titulo} fill className="object-cover" sizes="60px" />
                      </div>
                      <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 13, fontWeight: 700, color: "#1A2B4A", lineHeight: 1.35 }}>{rel.titulo}</p>
                    </Link>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ─── Galería del evento ─── */}
        <section className="bg-[#F8F5F0] py-[64px]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-0">
            <div className="mb-[36px]">
              <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>Galería</p>
              <div className="w-[36px] h-[2px] bg-[#C9A84C] mt-2 mb-2" />
              <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(22px,2vw,32px)", fontWeight: 700, color: "#1A2B4A" }}>Galería del evento</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-[12px]" style={{ height: "clamp(300px,26vw,380px)" }}>
              <div className="relative rounded-[10px] overflow-hidden row-span-2">
                <Image src={galeriaImgs[0]} alt="" fill className="object-cover object-center" sizes="40vw" />
              </div>
              {galeriaImgs.slice(1).map((src, i) => (
                <div key={i} className="relative rounded-[10px] overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover object-center" sizes="25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Más artículos ─── */}
        <section className="bg-white py-[64px]">
          <div className="max-w-[1200px] mx-auto px-6 md:px-0">
            <div className="mb-[40px]">
              <p style={{ fontFamily: "Poppins,sans-serif", fontSize: 10, fontWeight: 700, color: "#C9A84C", letterSpacing: 2.5, textTransform: "uppercase" }}>Te puede interesar</p>
              <div className="w-[36px] h-[2px] bg-[#C9A84C] mt-2 mb-2" />
              <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: "clamp(22px,2vw,32px)", fontWeight: 700, color: "#1A2B4A" }}>Más artículos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px]">
              {masArticulos.map((rel, i) => (
                <ArticuloCard key={rel.id} articulo={rel} index={i} inView />
              ))}
            </div>
          </div>
        </section>

        <FooterCTA />
      </main>
    </>
  );
}
