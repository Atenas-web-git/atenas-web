import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { SECCIONES, getSeccion, getVecinas } from "../contenido";
import { IconoSeccion } from "../IconoSeccion";
import { RenderBloques } from "../Bloques";

export function generateStaticParams() {
  return SECCIONES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const seccion = getSeccion(slug);
  return {
    title: seccion ? `${seccion.titulo} — Documentación` : "Documentación",
    robots: { index: false, follow: false },
  };
}

export default async function SeccionDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seccion = getSeccion(slug);
  if (!seccion) notFound();

  const { anterior, siguiente } = getVecinas(slug);

  return (
    <div className="flex flex-col gap-6 p-8" style={{ maxWidth: 1080 }}>
      {/* Volver */}
      <Link
        href="/admin/documentacion"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70 doc-no-print"
        style={{ textDecoration: "none", width: "fit-content" }}
      >
        <ChevronLeft size={14} color="#6B6660" strokeWidth={2.5} />
        <span style={{ fontSize: 12.5, fontWeight: 500, color: "#6B6660" }}>
          Toda la documentación
        </span>
      </Link>

      {/* Cabecera */}
      <div className="flex items-start gap-4">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 44, height: 44, background: "#1A2B4A", borderRadius: 10 }}
        >
          <IconoSeccion nombre={seccion.icono} size={21} color="#9e1915" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            {seccion.titulo}
          </h1>
          <p style={{ fontSize: 13.5, color: "#6B6660", margin: 0, lineHeight: 1.6, maxWidth: 720 }}>
            {seccion.descripcion}
          </p>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#A0AABA",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginTop: 3,
            }}
          >
            {seccion.paraQuien}
          </span>
        </div>
      </div>

      {/* Índice de la sección */}
      {seccion.articulos.length > 1 && (
        <nav
          className="flex flex-col gap-2 px-5 py-4 doc-no-print"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#6B6660",
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            En esta sección
          </span>
          <ol className="flex flex-col gap-1" style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {seccion.articulos.map((a, i) => (
              <li key={a.id} className="flex items-baseline gap-2.5">
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#D8D3CA",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    minWidth: 16,
                  }}
                >
                  {i + 1}
                </span>
                <a
                  href={`#${a.id}`}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#1A2B4A",
                    textDecoration: "none",
                  }}
                >
                  {a.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Artículos */}
      <div className="flex flex-col gap-4">
        {seccion.articulos.map((a) => (
          <article
            key={a.id}
            id={a.id}
            className="flex flex-col gap-4 px-6 py-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
              scrollMarginTop: 24,
            }}
          >
            <div className="flex flex-col gap-1">
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                {a.titulo}
              </h2>
              <p style={{ fontSize: 12.5, color: "#A0A09A", margin: 0, lineHeight: 1.55 }}>
                {a.resumen}
              </p>
            </div>
            <div style={{ height: 1, background: "#F1EEE8" }} />
            <RenderBloques bloques={a.bloques} />
          </article>
        ))}
      </div>

      {/* Anterior / siguiente */}
      <div className="flex items-stretch gap-3 flex-wrap doc-no-print">
        {anterior && (
          <Link
            href={`/admin/documentacion/${anterior.slug}`}
            className="flex items-center gap-3 px-4 py-3 transition-opacity hover:opacity-70"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 10,
              textDecoration: "none",
              flex: "1 1 240px",
            }}
          >
            <ArrowLeft size={15} color="#6B6660" strokeWidth={2.5} />
            <span className="flex flex-col">
              <span style={{ fontSize: 10.5, color: "#A0AABA", fontWeight: 600 }}>Anterior</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                {anterior.titulo}
              </span>
            </span>
          </Link>
        )}
        {siguiente && (
          <Link
            href={`/admin/documentacion/${siguiente.slug}`}
            className="flex items-center justify-end gap-3 px-4 py-3 transition-opacity hover:opacity-70"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 10,
              textDecoration: "none",
              flex: "1 1 240px",
            }}
          >
            <span className="flex flex-col items-end">
              <span style={{ fontSize: 10.5, color: "#A0AABA", fontWeight: 600 }}>Siguiente</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
                {siguiente.titulo}
              </span>
            </span>
            <ArrowRight size={15} color="#6B6660" strokeWidth={2.5} />
          </Link>
        )}
      </div>
    </div>
  );
}
